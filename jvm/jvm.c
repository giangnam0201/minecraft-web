#include "jvm.h"
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

jvm_thread *jvm_current_thread = NULL;
jvm_class *jvm_classes[JVM_MAX_CLASSES];
s4 jvm_class_count = 0;
u1 jvm_heap_storage[JVM_HEAP_SIZE];
u1 *jvm_heap = jvm_heap_storage;
s4 jvm_heap_used = 0;
jvm_object *jvm_objects = NULL;
jvm_thread jvm_threads[JVM_MAX_THREADS];

static u1 read_u1(u1 **p) {
    u1 v = **p;
    *p += 1;
    return v;
}

static u2 read_u2(u1 **p) {
    u2 v = ((u2)(*p)[0] << 8) | (*p)[1];
    *p += 2;
    return v;
}

static u4 read_u4(u1 **p) {
    u4 v = ((u4)(*p)[0] << 24) | ((u4)(*p)[1] << 16) | ((u4)(*p)[2] << 8) | (*p)[3];
    *p += 4;
    return v;
}

static char *cp_get_utf8_raw(jvm_class *cls, u2 idx) {
    if (idx == 0 || idx >= cls->cp_count) return NULL;
    u1 *cp = cls->cp_raw;
    u1 *p = cp;
    for (u2 i = 1; i < idx; i++) {
        u1 tag = read_u1(&p);
        switch (tag) {
            case 1: { u2 len = read_u2(&p); p += len; break; }
            case 3: p += 4; break;
            case 4: p += 4; break;
            case 5: p += 8; break;
            case 6: p += 8; break;
            case 7: p += 2; break;
            case 8: p += 2; break;
            case 9: p += 4; break;
            case 10: p += 4; break;
            case 11: p += 4; break;
            case 12: p += 4; break;
            case 15: p += 3; break;
            case 16: p += 2; break;
            case 17: p += 4; break;
            case 18: p += 4; break;
            case 19: p += 2; break;
            case 20: p += 2; break;
            default: return NULL;
        }
    }
    u1 tag = read_u1(&p);
    if (tag != 1) return NULL;
    u2 len = read_u2(&p);
    char *str = (char *)malloc(len + 1);
    memcpy(str, p, len);
    str[len] = 0;
    return str;
}

char *jvm_get_utf8(u2 index, jvm_class *cls) {
    return cp_get_utf8_raw(cls, index);
}

s4 jvm_load_class(u1 *data, s4 len) {
    if (len < 8) return -1;
    u1 *p = data;
    u4 magic = read_u4(&p);
    if (magic != 0xCAFEBABE) return -1;

    jvm_class *cls = (jvm_class *)calloc(1, sizeof(jvm_class));
    cls->data = data;
    cls->data_len = len;
    cls->minor_version = read_u2(&p);
    cls->major_version = read_u2(&p);

    cls->cp_count = read_u2(&p);
    cls->cp_raw = p;

    for (u2 i = 1; i < cls->cp_count; i++) {
        u1 tag = read_u1(&p);
        switch (tag) {
            case 1: { u2 slen = read_u2(&p); p += slen; break; }
            case 3: case 4: p += 4; break;
            case 5: case 6: p += 8; i++; break;
            case 7: case 8: p += 2; break;
            case 9: case 10: case 11: case 12: case 18: p += 4; break;
            case 15: p += 3; break;
            case 16: case 19: case 20: p += 2; break;
            case 17: p += 4; break;
            default: break;
        }
    }

    cls->access_flags = read_u2(&p);
    cls->this_class = read_u2(&p);
    cls->super_class = read_u2(&p);

    cls->name = cp_get_utf8_raw(cls, cls->this_class);
    if (!cls->name) {
        cls->name = cp_get_utf8_raw(cls, cls->this_class);
    }

    cls->interfaces_count = read_u2(&p);
    cls->interfaces = (u2 *)calloc(cls->interfaces_count, sizeof(u2));
    for (u2 i = 0; i < cls->interfaces_count; i++) {
        cls->interfaces[i] = read_u2(&p);
    }

    cls->fields_count = read_u2(&p);
    cls->fields = (jvm_field *)calloc(cls->fields_count, sizeof(jvm_field));
    s4 instance_offset = 0;
    s4 static_offset = 0;
    for (u2 i = 0; i < cls->fields_count; i++) {
        jvm_field *f = &cls->fields[i];
        f->access_flags = read_u2(&p);
        f->name_index = read_u2(&p);
        f->desc_index = read_u2(&p);
        f->attr_count = read_u2(&p);
        f->class = cls;
        for (u2 j = 0; j < f->attr_count; j++) {
            u2 attr_name = read_u2(&p);
            u4 attr_len = read_u4(&p);
            p += attr_len;
        }
        char *desc = cp_get_utf8_raw(cls, f->desc_index);
        if (desc) {
            s4 size = (desc[0] == 'J' || desc[0] == 'D') ? 8 : 4;
            if (f->access_flags & ACC_STATIC) {
                f->offset = static_offset;
                static_offset += size;
            } else {
                f->offset = instance_offset;
                instance_offset += size;
            }
            free(desc);
        }
    }
    cls->instance_fields_size = instance_offset;
    cls->static_fields_size = static_offset;
    cls->static_fields = (u1 *)calloc(1, static_offset > 0 ? static_offset : 1);

    cls->methods_count = read_u2(&p);
    cls->methods = (jvm_method *)calloc(cls->methods_count, sizeof(jvm_method));
    for (u2 i = 0; i < cls->methods_count; i++) {
        jvm_method *m = &cls->methods[i];
        m->access_flags = read_u2(&p);
        m->name_index = read_u2(&p);
        m->desc_index = read_u2(&p);
        m->attr_count = read_u2(&p);
        m->class = cls;
        for (u2 j = 0; j < m->attr_count; j++) {
            u2 attr_name = read_u2(&p);
            u4 attr_len = read_u4(&p);
            if (attr_len > 0) {
                u1 *attr_start = p;
                char *aname = cp_get_utf8_raw(cls, attr_name);
                if (aname && strcmp(aname, "Code") == 0) {
                    m->max_stack = read_u2(&p);
                    m->max_locals = read_u2(&p);
                    m->code_length = read_u4(&p);
                    m->code = p;
                    p += m->code_length;
                    m->exc_table_length = read_u2(&p);
                    m->exception_table = (u2 *)malloc(m->exc_table_length * 8 * sizeof(u2));
                    for (s4 k = 0; k < m->exc_table_length; k++) {
                        m->exception_table[k * 4] = read_u2(&p);
                        m->exception_table[k * 4 + 1] = read_u2(&p);
                        m->exception_table[k * 4 + 2] = read_u2(&p);
                        m->exception_table[k * 4 + 3] = read_u2(&p);
                    }
                    u2 code_attr_count = read_u2(&p);
                    for (s4 k = 0; k < code_attr_count; k++) {
                        u2 can = read_u2(&p);
                        u4 cal = read_u4(&p);
                        p += cal;
                    }
                } else {
                    p += attr_len;
                }
                if (aname) free(aname);
            }
        }
    }

    cls->initialized = false;
    jvm_classes[jvm_class_count++] = cls;
    return jvm_class_count - 1;
}

jvm_class *jvm_find_class(const char *name) {
    for (s4 i = 0; i < jvm_class_count; i++) {
        if (jvm_classes[i]->name && strcmp(jvm_classes[i]->name, name) == 0) {
            return jvm_classes[i];
        }
    }
    return NULL;
}

jvm_class *jvm_get_class_from_object(jvm_object *obj) {
    return obj ? obj->class : NULL;
}

jvm_object *jvm_alloc_object(jvm_class *cls) {
    jvm_object *obj = (jvm_object *)calloc(1, sizeof(jvm_object));
    obj->class = cls;
    if (cls->instance_fields_size > 0) {
        obj->fields = (u1 *)calloc(1, cls->instance_fields_size);
    }
    obj->is_array = false;
    obj->next = jvm_objects;
    jvm_objects = obj;
    return obj;
}

jvm_object *jvm_new_string(jvm_thread *thread, const char *utf8) {
    (void)thread;
    jvm_class *str_cls = jvm_find_class("java/lang/String");
    if (!str_cls) return NULL;
    jvm_object *obj = jvm_alloc_object(str_cls);
    return obj;
}

jvm_object *jvm_new_array(jvm_thread *thread, s4 count, u1 type) {
    (void)thread;
    jvm_object *obj = (jvm_object *)calloc(1, sizeof(jvm_object));
    jvm_class *arr_cls = jvm_find_class("[I");
    if (!arr_cls) arr_cls = jvm_find_class("java/lang/Object");
    obj->class = arr_cls ? arr_cls : jvm_classes[0];
    obj->is_array = true;
    obj->data.arr.length = count;
    s4 elem_size = (type == T_LONG || type == T_DOUBLE) ? 8 : 4;
    obj->data.arr.data = (u1 *)calloc(count, elem_size);
    obj->data.arr.elem_type = type;
    obj->data.arr.obj = obj;
    obj->next = jvm_objects;
    jvm_objects = obj;
    return obj;
}

void jvm_link_class(jvm_class *cls) {
    (void)cls;
}

void jvm_init_class(jvm_thread *thread, jvm_class *cls) {
    if (cls->initialized) return;
    jvm_class *super_cls = NULL;
    if (cls->super_class != 0 && cls->super_class < cls->cp_count) {
        super_cls = jvm_find_class_in_cp(cls, cls->super_class);
    }
    if (super_cls && !super_cls->initialized) {
        super_cls = jvm_find_class_in_cp(cls, cls->super_class);
        if (super_cls) jvm_init_class(thread, super_cls);
    }
    for (s4 i = 0; i < cls->methods_count; i++) {
        jvm_method *m = &cls->methods[i];
        char *mname = cp_get_utf8_raw(cls, m->name_index);
        if (mname && strcmp(mname, "<clinit>") == 0 && m->access_flags & ACC_STATIC) {
            jvm_frame *frame = &thread->frames[thread->frame_count];
            memset(frame, 0, sizeof(jvm_frame));
            frame->method = m;
            frame->pc = m->code;
            frame->locals = thread->locals + thread->frame_count * m->max_locals;
            frame->stack = thread->stack + thread->frame_count * m->max_stack;
            frame->sp = 0;
            thread->frame_count++;
            jvm_execute(thread);
            thread->frame_count--;
        }
        if (mname) free(mname);
    }
    cls->initialized = true;
}

jvm_class *jvm_find_class_in_cp(jvm_class *cls, u2 index) {
    if (index == 0 || index >= cls->cp_count) return NULL;
    u1 *cp = cls->cp_raw;
    u1 *p = cp;
    for (u2 i = 1; i < index; i++) {
        u1 tag = read_u1(&p);
        switch (tag) {
            case 1: { u2 len = read_u2(&p); p += len; break; }
            case 3: case 4: p += 4; break;
            case 5: case 6: p += 8; i++; break;
            case 7: case 8: p += 2; break;
            case 9: case 10: case 11: case 12: case 18: p += 4; break;
            case 15: p += 3; break;
            case 16: case 19: case 20: p += 2; break;
            case 17: p += 4; break;
            default: break;
        }
    }
    u1 tag = read_u1(&p);
    if (tag == 7) {
        u2 name_idx = read_u2(&p);
        char *name = cp_get_utf8_raw(cls, name_idx);
        if (name) {
            jvm_class *found = jvm_find_class(name);
            free(name);
            return found;
        }
    }
    if (tag == 1) {
        u2 len = read_u2(&p);
        char *name = (char *)malloc(len + 1);
        memcpy(name, p, len);
        name[len] = 0;
        jvm_class *found = jvm_find_class(name);
        free(name);
        return found;
    }
    return NULL;
}

void jvm_invoke_static(jvm_thread *thread, jvm_class *cls, const char *method_name, const char *desc) {
    if (!cls) return;
    for (s4 i = 0; i < cls->methods_count; i++) {
        jvm_method *m = &cls->methods[i];
        char *mname = cp_get_utf8_raw(cls, m->name_index);
        char *mdesc = cp_get_utf8_raw(cls, m->desc_index);
        bool match = mname && mdesc &&
                     strcmp(mname, method_name) == 0 &&
                     strcmp(mdesc, desc) == 0;
        if (mname) free(mname);
        if (mdesc) free(mdesc);
        if (match) {
            jvm_init_class(thread, cls);
            jvm_frame *frame = &thread->frames[thread->frame_count];
            memset(frame, 0, sizeof(jvm_frame));
            frame->method = m;
            frame->pc = m ? m->code : NULL;
            frame->locals = thread->locals + thread->frame_count * (m ? m->max_locals : 16);
            frame->stack = thread->stack + thread->frame_count * (m ? m->max_stack : 256);
            frame->sp = 0;
            if (!(m->access_flags & ACC_STATIC)) {
                frame->this_obj = (jvm_object *)thread->stack[0].r;
            }
            thread->frame_count++;
            if (m->code) {
                jvm_execute(thread);
            }
            thread->frame_count--;
            return;
        }
    }
}

void jvm_push_int(jvm_thread *thread, s4 val) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    frame->stack[frame->sp].i = val;
    frame->sp++;
}

void jvm_push_long(jvm_thread *thread, s8 val) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    frame->stack[frame->sp].l = val;
    frame->sp += 2;
}

void jvm_push_float(jvm_thread *thread, f4 val) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    frame->stack[frame->sp].f = val;
    frame->sp++;
}

void jvm_push_double(jvm_thread *thread, f8 val) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    frame->stack[frame->sp].d = val;
    frame->sp += 2;
}

void jvm_push_ref(jvm_thread *thread, jvm_object *ref) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    frame->stack[frame->sp].r = ref;
    frame->sp++;
}

jvm_value jvm_pop(jvm_thread *thread) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    frame->sp--;
    return frame->stack[frame->sp];
}

void jvm_thread_start(jvm_thread *thread, jvm_method *method) {
    jvm_frame *frame = &thread->frames[0];
    memset(frame, 0, sizeof(jvm_frame));
    frame->method = method;
    frame->pc = method->code;
    frame->locals = thread->locals;
    frame->stack = thread->stack;
    frame->sp = 0;
    thread->frame_count = 1;
    thread->running = true;
}

void jvm_init(void) {
    memset(jvm_heap_storage, 0, JVM_HEAP_SIZE);
    jvm_heap_used = 0;
    jvm_class_count = 0;
    jvm_objects = NULL;
    memset(jvm_threads, 0, sizeof(jvm_threads));
    jvm_threads[0].id = 0;
    jvm_threads[0].running = false;
    jvm_current_thread = &jvm_threads[0];
    bridge_register_natives();
}
