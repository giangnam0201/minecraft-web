#include "jvm.h"
#include <string.h>
#include <stdlib.h>

jvm_thread jvm_threads[JVM_MAX_THREADS];
jvm_thread *jvm_cur;
jvm_class *jvm_classes[JVM_MAX_CLASSES];
s4 jvm_cls_cnt;
u1 *jvm_heap = NULL;

typedef struct { char *key; s4 idx; } hash_entry;
static hash_entry hash_table[JVM_HASH_SIZE];
static char *str_table;

static u4 hash_str(const char *s) {
    u4 h = 0;
    while (*s) h = h * 31 + (u1)*s++;
    return h % JVM_HASH_SIZE;
}

static void hash_put(const char *key, s4 idx) {
    u4 h = hash_str(key);
    while (hash_table[h].key) h = (h + 1) % JVM_HASH_SIZE;
    hash_table[h].key = (char *)key;
    hash_table[h].idx = idx;
}

static s4 hash_get(const char *key) {
    u4 h = hash_str(key);
    while (hash_table[h].key) {
        if (strcmp(hash_table[h].key, key) == 0) return hash_table[h].idx;
        h = (h + 1) % JVM_HASH_SIZE;
    }
    return -1;
}

jvm_class *jvm_find_class(const char *name) {
    s4 idx = hash_get(name);
    return (idx >= 0) ? jvm_classes[idx] : NULL;
}

static u1 read_u1(u1 **p) { u1 v = **p; (*p)++; return v; }
static u2 read_u2(u1 **p) { u2 v = ((u2)(*p)[0]<<8)|(*p)[1]; *p += 2; return v; }
static u4 read_u4(u1 **p) { u4 v = ((u4)(*p)[0]<<24)|((u4)(*p)[1]<<16)|((u4)(*p)[2]<<8)|(*p)[3]; *p += 4; return v; }

char *jvm_cp_utf8(u2 idx, jvm_class *c) {
    if (idx == 0 || idx >= c->cp_count) return NULL;
    u1 *p = c->cp_raw;
    for (u2 i = 1; i < idx; i++) {
        u1 tag = read_u1(&p);
        switch (tag) {
            case 1: { u2 l = read_u2(&p); p += l; break; }
            case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: p += 4; break;
            case 5: case 6: p += 8; i++; break;
            case 7: case 8: case 16: case 19: case 20: p += 2; break;
            case 15: p += 3; break;
            default: return NULL;
        }
    }
    u1 tag = read_u1(&p);
    if (tag != 1) return NULL;
    u2 len = read_u2(&p);
    char *s = malloc(len + 1);
    memcpy(s, p, len);
    s[len] = 0;
    return s;
}

jvm_class *jvm_cp_class(jvm_class *c, u2 idx) {
    if (idx == 0 || idx >= c->cp_count) return NULL;
    u1 *p = c->cp_raw;
    for (u2 i = 1; i < idx; i++) {
        u1 tag = read_u1(&p);
        switch (tag) {
            case 1: { u2 l = read_u2(&p); p += l; break; }
            case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: p += 4; break;
            case 5: case 6: p += 8; i++; break;
            case 7: case 8: case 16: case 19: case 20: p += 2; break;
            case 15: p += 3; break;
            default: return NULL;
        }
    }
    u1 tag = read_u1(&p);
    if (tag != 7) return NULL;
    u2 name_idx = read_u2(&p);
    char *name = jvm_cp_utf8(name_idx, c);
    if (!name) return NULL;
    jvm_class *cls = jvm_find_class(name);
    free(name);
    return cls;
}

s4 jvm_load_class(u1 *data, s4 len) {
    if (len < 8) return -1;
    u1 *p = data;
    if (read_u4(&p) != 0xCAFEBABE) return -1;

    jvm_class *c = calloc(1, sizeof(jvm_class));
    c->data = NULL; c->data_len = 0;
    c->index = jvm_cls_cnt;

    c->minor_ver = read_u2(&p); c->major_ver = read_u2(&p);
    c->cp_count = read_u2(&p);
    // Copy only the constant pool, not the entire class file
    u1 *cp_start = p;
    for (u2 i = 1; i < c->cp_count; i++) {
        u1 tag = read_u1(&p);
        switch (tag) {
            case 1: { u2 l = read_u2(&p); p += l; break; }
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
    s4 cp_size = p - cp_start;
    c->cp_raw = malloc(cp_size);
    memcpy(c->cp_raw, cp_start, cp_size);

    c->access_flags = read_u2(&p);
    c->this_class = read_u2(&p);

    {
        char *nm = jvm_cp_utf8(c->this_class, c);
        if (nm) {
            u1 *pp = c->cp_raw;
            for (u2 i = 1; i < c->this_class; i++) { u1 t = read_u1(&pp); switch (t) {
                case 1: { u2 l = read_u2(&pp); pp += l; break; }
                case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: pp += 4; break;
                case 5: case 6: pp += 8; i++; break;
                case 7: case 8: case 16: case 19: case 20: pp += 2; break;
                case 15: pp += 3; break;
                default: break;
            }}
            u1 t = read_u1(&pp);
            if (t == 7) { u2 ni = read_u2(&pp); c->name = jvm_cp_utf8(ni, c); }
            free(nm);
        }
    }

    u2 sc = read_u2(&p);
    if (sc != 0) {
        u1 *pp = c->cp_raw;
        for (u2 i = 1; i < sc; i++) { u1 t = read_u1(&pp); switch (t) {
            case 1: { u2 l = read_u2(&pp); pp += l; break; }
            case 3: case 4: case 9: case 10: case 11: case 12: case 17: case 18: pp += 4; break;
            case 5: case 6: pp += 8; i++; break;
            case 7: case 8: case 16: case 19: case 20: pp += 2; break;
            case 15: pp += 3; break;
            default: break;
        }}
        u1 t = read_u1(&pp);
        if (t == 7) { u2 ni = read_u2(&pp); c->super_name = jvm_cp_utf8(ni, c); }
    }

    u2 ic = read_u2(&p);
    for (u2 i = 0; i < ic; i++) { u2 ci = read_u2(&p); }

    c->fields_count = read_u2(&p);
    c->fields = calloc(c->fields_count, sizeof(jvm_field));
    s4 inst_off = 0, stat_off = 0;
    for (u2 i = 0; i < c->fields_count; i++) {
        jvm_field *f = &c->fields[i];
        f->access = read_u2(&p); f->name_idx = read_u2(&p); f->desc_idx = read_u2(&p);
        f->cls = c;
        u2 ac = read_u2(&p);
        for (u2 j = 0; j < ac; j++) { u2 an = read_u2(&p); u4 al = read_u4(&p); p += al; }
        char *desc = jvm_cp_utf8(f->desc_idx, c);
        s4 sz = (desc && (desc[0] == 'J' || desc[0] == 'D')) ? 8 : 4;
        if (f->access & ACC_STATIC) { f->offset = stat_off; stat_off += sz; }
        else { f->offset = inst_off; inst_off += sz; }
        if (desc) free(desc);
    }
    c->inst_size = inst_off;
    c->static_size = stat_off;
    if (stat_off > 0) c->static_data = calloc(1, stat_off);

    c->methods_count = read_u2(&p);
    c->methods = calloc(c->methods_count, sizeof(jvm_method));
    for (u2 i = 0; i < c->methods_count; i++) {
        jvm_method *m = &c->methods[i];
        m->access = read_u2(&p); m->name_idx = read_u2(&p); m->desc_idx = read_u2(&p);
        m->cls = c;
        u2 ac = read_u2(&p);
        for (u2 j = 0; j < ac; j++) {
            u2 an = read_u2(&p); u4 al = read_u4(&p);
            char *aname = jvm_cp_utf8(an, c);
            if (aname && strcmp(aname, "Code") == 0) {
                m->max_stack = read_u2(&p); m->max_locals = read_u2(&p);
                m->code_len = read_u4(&p); m->code = p; p += m->code_len;
                u2 etl = read_u2(&p);
                for (u4 k = 0; k < etl; k++) { read_u2(&p); read_u2(&p); read_u2(&p); read_u2(&p); }
                u2 ca = read_u2(&p);
                for (u4 k = 0; k < ca; k++) { u2 cn = read_u2(&p); u4 cl = read_u4(&p); p += cl; }
            } else { p += al; }
            if (aname) free(aname);
        }
    }

    jvm_classes[jvm_cls_cnt++] = c;
    if (c->name) hash_put(c->name, c->index);
    return c->index;
}

s4 jvm_load_blob(u1 *blob, s4 len) {
    if (len < 20) return -1;
    u1 *p = blob;
    u4 magic = read_u4(&p);
    if (magic != 0x4D43574A) return -1;
    u4 total = read_u4(&p);
    u4 cc = read_u4(&p);
    u4 rc = read_u4(&p);
    u4 st_size = read_u4(&p);
    str_table = (char *)(blob + 20);
    u1 *entries = blob + 20 + st_size;
    u1 *data_start = entries + cc * 16 + rc * 12;

    for (u4 i = 0; i < cc; i++) {
        u4 no = *(u4*)(entries + i*16);
        u4 so = *(u4*)(entries + i*16 + 4);
        u4 d_off = *(u4*)(entries + i*16 + 8);
        u4 d_sz = *(u4*)(entries + i*16 + 12);
        char *name = (char *)(blob + 20 + no);
        char *sname = (char *)(blob + 20 + so);
        if (d_sz > 0 && d_off + d_sz <= (u4)len) {
            s4 idx = jvm_load_class(data_start + (d_off - (u4)(data_start - blob)), d_sz);
            if (idx >= 0 && sname && sname[0]) {
                jvm_classes[idx]->super_name = sname;
            }
        }
    }

    return jvm_cls_cnt;
}

void jvm_init_class(jvm_thread *t, jvm_class *c) {
    if (!c || c->initialized) return;
    if (c->super_name && !c->super) {
        c->super = jvm_find_class(c->super_name);
        if (c->super && !c->super->initialized) jvm_init_class(t, c->super);
    }
    for (s4 i = 0; i < c->methods_count; i++) {
        jvm_method *m = &c->methods[i];
        char *mn = jvm_cp_utf8(m->name_idx, c);
        if (mn && strcmp(mn, "<clinit>") == 0 && (m->access & ACC_STATIC)) {
            if (m->code) {
                jvm_frame *f = &t->frames[t->frame_cnt];
                memset(f, 0, sizeof(jvm_frame));
                f->method = m; f->pc = m->code;
                f->locals = t->locals + t->frame_cnt * (m->max_locals + 1);
                f->stack = t->stack + t->frame_cnt * (m->max_stack + 1);
                t->frame_cnt++;
                jvm_execute(t);
                t->frame_cnt--;
            }
        }
        if (mn) free(mn);
    }
    c->initialized = true;
}

jvm_object *jvm_alloc_obj(jvm_class *c) {
    jvm_object *o = calloc(1, sizeof(jvm_object));
    o->cls = c;
    if (c->inst_size > 0) o->fields = calloc(1, c->inst_size);
    return o;
}

jvm_object *jvm_new_array(jvm_thread *t, s4 cnt, u1 type) {
    (void)t;
    jvm_object *o = calloc(1, sizeof(jvm_object));
    o->is_array = true; o->arr.len = cnt;
    s4 es = (type == T_LONG || type == T_DOUBLE) ? 8 : 4;
    o->arr.data = calloc(cnt, es);
    o->arr.etype = type;
    o->cls = jvm_find_class("java/lang/Object");
    return o;
}

jvm_object *jvm_new_string_utf8(jvm_thread *t, const char *s) {
    (void)t;
    jvm_class *sc = jvm_find_class("java/lang/String");
    if (!sc) return NULL;
    jvm_object *so = jvm_alloc_obj(sc);
    s4 slen = strlen(s);
    jvm_object *ca = jvm_new_array(t, slen, T_CHAR);
    if (ca && ca->arr.data) {
        for (s4 i = 0; i < slen; i++) {
            ((u2 *)ca->arr.data)[i] = (u2)(u1)s[i];
        }
    }
    for (s4 i = 0; i < sc->fields_count; i++) {
        jvm_field *f = &sc->fields[i];
        char *fn = jvm_cp_utf8(f->name_idx, sc);
        if (fn && strcmp(fn, "value") == 0) {
            *(jvm_object **)(so->fields + f->offset) = ca;
        }
        if (fn) free(fn);
    }
    return so;
}

jvm_object *jvm_new_string_arr(jvm_thread *t, s4 n, const char **strs) {
    jvm_object *arr = jvm_new_array(t, n, 0);
    for (s4 i = 0; i < n; i++) {
        jvm_object *s = jvm_new_string_utf8(t, strs[i]);
    }
    return arr;
}

void jvm_invoke_static(jvm_thread *t, jvm_class *c, const char *name, const char *desc) {
    if (!c) return;
    for (s4 i = 0; i < c->methods_count; i++) {
        jvm_method *m = &c->methods[i];
        char *mn = jvm_cp_utf8(m->name_idx, c);
        char *md = jvm_cp_utf8(m->desc_idx, c);
        bool match = mn && md && strcmp(mn, name) == 0 && strcmp(md, desc) == 0;
        if (mn) free(mn); if (md) free(md);
        if (!match) continue;
        if (!c->initialized) jvm_init_class(t, c);
        if (m->access & ACC_NATIVE) {
            native_method_call(t, c->name ? c->name : "", name, desc);
            return;
        }
        if (!m->code) return;
        jvm_frame *f = &t->frames[t->frame_cnt];
        memset(f, 0, sizeof(jvm_frame));
        f->method = m; f->pc = m->code;
        f->locals = t->locals + t->frame_cnt * (m->max_locals + 1);
        f->stack = t->stack + t->frame_cnt * (m->max_stack + 1);
        t->frame_cnt++;
        jvm_execute(t);
        t->frame_cnt--;
        return;
    }
}

void jvm_push_i(jvm_thread *t, s4 v) { jvm_frame *f=&t->frames[t->frame_cnt-1]; f->stack[f->sp].i=v; f->sp++; }
void jvm_push_l(jvm_thread *t, s8 v) { jvm_frame *f=&t->frames[t->frame_cnt-1]; f->stack[f->sp].l=v; f->sp+=2; }
void jvm_push_f(jvm_thread *t, f4 v) { jvm_frame *f=&t->frames[t->frame_cnt-1]; f->stack[f->sp].f=v; f->sp++; }
void jvm_push_d(jvm_thread *t, f8 v) { jvm_frame *f=&t->frames[t->frame_cnt-1]; f->stack[f->sp].d=v; f->sp+=2; }
void jvm_push_r(jvm_thread *t, jvm_object *r) { jvm_frame *f=&t->frames[t->frame_cnt-1]; f->stack[f->sp].r=r; f->sp++; }

void jvm_resolve_methods(jvm_class *c) { (void)c; }

void jvm_init(void) {
    memset(hash_table, 0, sizeof(hash_table));
    jvm_cls_cnt = 0; str_table = NULL; jvm_heap = NULL;
    memset(jvm_threads, 0, sizeof(jvm_threads));
    jvm_threads[0].id = 0;
    jvm_cur = &jvm_threads[0];
}

void native_method_call(jvm_thread *t, const char *cls, const char *name, const char *desc) {
    (void)desc;
    js_log(cls); js_log(name);
    if (strcmp(cls, "org/lwjgl/opengl/GL11") == 0) {
        if (strcmp(name, "glClear") == 0) { js_gl_clear(t->stack[0].i); return; }
        if (strcmp(name, "glClearColor") == 0) { js_gl_clear_color(t->stack[0].f,t->stack[1].f,t->stack[2].f,t->stack[3].f); return; }
        if (strcmp(name, "glViewport") == 0) { js_gl_viewport(t->stack[0].i,t->stack[1].i,t->stack[2].i,t->stack[3].i); return; }
        if (strcmp(name, "glEnable") == 0) { js_gl_enable(t->stack[0].i); return; }
        if (strcmp(name, "glDisable") == 0) { js_gl_disable(t->stack[0].i); return; }
        if (strcmp(name, "glBindTexture") == 0) { js_gl_bind_texture(t->stack[0].i,t->stack[1].i); return; }
        if (strcmp(name, "glGenTextures") == 0) { js_gl_gen_textures(t->stack[0].i,(void*)(intptr_t)t->stack[1].i); return; }
        if (strcmp(name, "glTexImage2D") == 0) { js_gl_tex_image_2d(t->stack[0].i,t->stack[1].i,t->stack[2].i,t->stack[3].i,t->stack[4].i,t->stack[5].i,t->stack[6].i,t->stack[7].i,(void*)(intptr_t)t->stack[8].i); return; }
        if (strcmp(name, "glDrawArrays") == 0) { js_gl_draw_arrays(t->stack[0].i,t->stack[1].i,t->stack[2].i); return; }
        if (strcmp(name, "glGenBuffers") == 0) { js_gl_gen_buffers(t->stack[0].i,(void*)(intptr_t)t->stack[1].i); return; }
        if (strcmp(name, "glBindBuffer") == 0) { js_gl_bind_buffer(t->stack[0].i,t->stack[1].i); return; }
        if (strcmp(name, "glBufferData") == 0) { js_gl_buffer_data(t->stack[0].i,t->stack[1].l,(void*)(intptr_t)t->stack[2].i,t->stack[3].i); return; }
        if (strcmp(name, "glBufferSubData") == 0) { js_gl_buffer_sub_data(t->stack[0].i,t->stack[1].l,t->stack[2].l,(void*)(intptr_t)t->stack[3].i); return; }
        if (strcmp(name, "glBegin") == 0) { js_gl_begin(t->stack[0].i); return; }
        if (strcmp(name, "glEnd") == 0) { js_gl_end(); return; }
        if (strcmp(name, "glVertex2f") == 0) { js_gl_vertex2f(t->stack[0].f,t->stack[1].f); return; }
        if (strcmp(name, "glVertex3f") == 0) { js_gl_vertex3f(t->stack[0].f,t->stack[1].f,t->stack[2].f); return; }
        if (strcmp(name, "glTexCoord2f") == 0) { js_gl_tex_coord2f(t->stack[0].f,t->stack[1].f); return; }
        if (strcmp(name, "glColor3f") == 0) { js_gl_color3f(t->stack[0].f,t->stack[1].f,t->stack[2].f); return; }
        if (strcmp(name, "glColor4f") == 0) { js_gl_color4f(t->stack[0].f,t->stack[1].f,t->stack[2].f,t->stack[3].f); return; }
        if (strcmp(name, "glMatrixMode") == 0) { js_gl_matrix_mode(t->stack[0].i); return; }
        if (strcmp(name, "glLoadIdentity") == 0) { js_gl_load_identity(); return; }
        if (strcmp(name, "glPushMatrix") == 0) { js_gl_push_matrix(); return; }
        if (strcmp(name, "glPopMatrix") == 0) { js_gl_pop_matrix(); return; }
        if (strcmp(name, "glTranslatef") == 0) { js_gl_translatef(t->stack[0].f,t->stack[1].f,t->stack[2].f); return; }
        if (strcmp(name, "glRotatef") == 0) { js_gl_rotatef(t->stack[0].f,t->stack[1].f,t->stack[2].f,t->stack[3].f); return; }
        if (strcmp(name, "glScalef") == 0) { js_gl_scalef(t->stack[0].f,t->stack[1].f,t->stack[2].f); return; }
        if (strcmp(name, "glOrtho") == 0) { js_gl_ortho(t->stack[0].d,t->stack[1].d,t->stack[2].d,t->stack[3].d,t->stack[4].d,t->stack[5].d); return; }
        if (strcmp(name, "glNewList") == 0) { js_gl_new_list(t->stack[0].i,t->stack[1].i); return; }
        if (strcmp(name, "glEndList") == 0) { js_gl_end_list(); return; }
        if (strcmp(name, "glCallList") == 0) { js_gl_call_list(t->stack[0].i); return; }
        if (strcmp(name, "glTexParameteri") == 0) { js_gl_tex_parameteri(t->stack[0].i,t->stack[1].i,t->stack[2].i); return; }
        if (strcmp(name, "glBlendFunc") == 0) { js_gl_blend_func(t->stack[0].i,t->stack[1].i); return; }
        if (strcmp(name, "glDepthFunc") == 0) { js_gl_depth_func(t->stack[0].i); return; }
        if (strcmp(name, "glDepthMask") == 0) { js_gl_depth_mask(t->stack[0].i); return; }
        if (strcmp(name, "glColorMask") == 0) { js_gl_color_mask(t->stack[0].i,t->stack[1].i,t->stack[2].i,t->stack[3].i); return; }
        if (strcmp(name, "glCullFace") == 0) { js_gl_cull_face(t->stack[0].i); return; }
        if (strcmp(name, "glAlphaFunc") == 0) { js_gl_alpha_func(t->stack[0].i,t->stack[1].f); return; }
        if (strcmp(name, "glGetString") == 0) { js_gl_get_string(t->stack[0].i,(void*)(intptr_t)t->stack[1].i); return; }
        if (strcmp(name, "glGetError") == 0) { jvm_push_i(t, js_gl_get_error()); return; }
        if (strcmp(name, "glReadPixels") == 0) { js_gl_read_pixels(t->stack[0].i,t->stack[1].i,t->stack[2].i,t->stack[3].i,t->stack[4].i,t->stack[5].i,(void*)(intptr_t)t->stack[6].l); return; }
        if (strcmp(name, "glGetIntegerv") == 0) { js_gl_get_integerv(t->stack[0].i,(void*)(intptr_t)t->stack[1].i); return; }
        if (strcmp(name, "glLineWidth") == 0) { js_gl_line_width(t->stack[0].f); return; }
        if (strcmp(name, "glPolygonOffset") == 0) { js_gl_polygon_offset(t->stack[0].f,t->stack[1].f); return; }
        if (strcmp(name, "glScissor") == 0) { js_gl_scissor(t->stack[0].i,t->stack[1].i,t->stack[2].i,t->stack[3].i); return; }
        if (strcmp(name, "glActiveTexture") == 0) { js_gl_active_texture(t->stack[0].i); return; }
        if (strcmp(name, "glFogi") == 0) { js_gl_fogi(t->stack[0].i,t->stack[1].i); return; }
        if (strcmp(name, "glFogf") == 0) { js_gl_fogf(t->stack[0].i,t->stack[1].f); return; }
        if (strcmp(name, "glGenerateMipmap") == 0) { js_gl_generate_mipmap(t->stack[0].i); return; }
        if (strcmp(name, "glPixelStorei") == 0) { js_gl_pixel_storei(t->stack[0].i,t->stack[1].i); return; }
        if (strcmp(name, "glDeleteTextures") == 0) { js_gl_delete_textures(t->stack[0].i,(void*)(intptr_t)t->stack[1].i); return; }
        return;
    }
    if (strcmp(cls, "org/lwjgl/opengl/Display") == 0) {
        if (strcmp(name, "create") == 0) { js_create_window(854,480,"Minecraft 1.16.5"); return; }
        if (strcmp(name, "swapBuffers") == 0) { js_swap_buffers(); return; }
        if (strcmp(name, "isCloseRequested") == 0) { jvm_push_i(t, js_is_close_requested()); return; }
        if (strcmp(name, "setDisplayMode") == 0) { js_set_display_mode(854,480); return; }
        if (strcmp(name, "setTitle") == 0) { return; }
        if (strcmp(name, "isCreated") == 0) { jvm_push_i(t, 1); return; }
        if (strcmp(name, "destroy") == 0) { return; }
        if (strcmp(name, "sync") == 0) { return; }
        if (strcmp(name, "setResizable") == 0) { return; }
        return;
    }
    if (strcmp(cls, "org/lwjgl/input/Keyboard") == 0) {
        if (strcmp(name, "isKeyDown") == 0) { jvm_push_i(t, js_get_key_state(t->stack[0].i)); return; }
        if (strcmp(name, "next") == 0) { jvm_push_i(t, 0); return; }
        return;
    }
    if (strcmp(cls, "org/lwjgl/input/Mouse") == 0) {
        if (strcmp(name, "isButtonDown") == 0) { jvm_push_i(t, js_get_mouse_button(t->stack[0].i)); return; }
        if (strcmp(name, "getX") == 0) { jvm_push_i(t, js_get_mouse_x()); return; }
        if (strcmp(name, "getY") == 0) { jvm_push_i(t, js_get_mouse_y()); return; }
        if (strcmp(name, "setGrabbed") == 0) { js_set_mouse_grabbed(t->stack[0].i); return; }
        if (strcmp(name, "isGrabbed") == 0) { jvm_push_i(t, js_is_mouse_grabbed()); return; }
        if (strcmp(name, "next") == 0) { jvm_push_i(t, 0); return; }
        return;
    }
    if (strcmp(cls, "java/lang/System") == 0) {
        if (strcmp(name, "currentTimeMillis") == 0) { jvm_push_l(t, (s8)js_cur_ms()); return; }
        if (strcmp(name, "nanoTime") == 0) { jvm_push_l(t, (s8)(js_cur_ms()*1000000.0)); return; }
        if (strcmp(name, "arraycopy") == 0) { return; }
        if (strcmp(name, "identityHashCode") == 0) { jvm_push_i(t, 0); return; }
        if (strcmp(name, "initProperties") == 0) { return; }
        return;
    }
    if (strcmp(cls, "java/lang/Thread") == 0) {
        if (strcmp(name, "currentThread") == 0) { jvm_push_r(t, NULL); return; }
        if (strcmp(name, "registerNatives") == 0) { return; }
        return;
    }
    if (strcmp(cls, "java/lang/Object") == 0) {
        if (strcmp(name, "hashCode") == 0) { jvm_push_i(t, 0); return; }
        if (strcmp(name, "getClass") == 0) { jvm_push_r(t, NULL); return; }
        if (strcmp(name, "registerNatives") == 0) { return; }
        return;
    }
    if (strcmp(cls, "java/lang/Class") == 0) {
        if (strcmp(name, "registerNatives") == 0) { return; }
        if (strcmp(name, "isAssignableFrom") == 0) { jvm_push_i(t, 0); return; }
        return;
    }
    if (strcmp(cls, "java/lang/ClassLoader") == 0) {
        if (strcmp(name, "registerNatives") == 0) { return; }
        return;
    }
}

void bridge_register_natives(void) {}
