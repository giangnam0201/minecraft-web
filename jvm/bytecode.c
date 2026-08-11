#include "jvm.h"
#include <string.h>
#include <stdlib.h>
#include <math.h>

static u1 read_u1_c(u1 **p) { u1 v = **p; *p += 1; return v; }
static u2 read_u2_c(u1 **p) { u2 v = ((u2)(*p)[0] << 8) | (*p)[1]; *p += 2; return v; }
static u4 read_u4_c(u1 **p) { u4 v = ((u4)(*p)[0] << 24) | ((u4)(*p)[1] << 16) | ((u4)(*p)[2] << 8) | (*p)[3]; *p += 4; return v; }
static s1 read_s1(u1 **p) { return (s1)read_u1_c(p); }
static s2 read_s2(u1 **p) { return (s2)read_u2_c(p); }
static s4 read_s4(u1 **p) { return (s4)read_u4_c(p); }

static jvm_method *find_method_in_class(jvm_class *cls, const char *name, const char *desc) {
    if (!cls) return NULL;
    for (s4 i = 0; i < cls->methods_count; i++) {
        char *mn = jvm_get_utf8(cls->methods[i].name_index, cls);
        char *md = jvm_get_utf8(cls->methods[i].desc_index, cls);
        if (mn && md && strcmp(mn, name) == 0 && strcmp(md, desc) == 0) {
            if (mn) free(mn);
            if (md) free(md);
            return &cls->methods[i];
        }
        if (mn) free(mn);
        if (md) free(md);
    }
    return NULL;
}

static jvm_field *find_field_in_class(jvm_class *cls, const char *name, const char *desc) {
    if (!cls) return NULL;
    for (s4 i = 0; i < cls->fields_count; i++) {
        char *fn = jvm_get_utf8(cls->fields[i].name_index, cls);
        char *fd = jvm_get_utf8(cls->fields[i].desc_index, cls);
        if (fn && fd && strcmp(fn, name) == 0 && strcmp(fd, desc) == 0) {
            if (fn) free(fn);
            if (fd) free(fd);
            return &cls->fields[i];
        }
        if (fn) free(fn);
        if (fd) free(fd);
    }
    return NULL;
}

static u1 *cp_get_raw(jvm_class *cls, u2 idx) {
    if (idx == 0 || idx >= cls->cp_count) return NULL;
    u1 *cp = cls->cp_raw;
    u1 *p = cp;
    for (u2 i = 1; i < idx; i++) {
        u1 tag = *p; p++;
        switch (tag) {
            case 1: { u2 len = (p[0]<<8)|p[1]; p += 2 + len; break; }
            case 3: case 4: p += 4; break;
            case 5: case 6: p += 8; i++; break;
            case 7: case 8: p += 2; break;
            case 9: case 10: case 11: case 12: case 18: p += 4; break;
            case 15: p += 3; break;
            case 16: case 19: case 20: p += 2; break;
            case 17: p += 4; break;
            default: return NULL;
        }
    }
    return p + 1;
}

static s4 cp_get_int(jvm_class *cls, u2 idx) {
    u1 *raw = cp_get_raw(cls, idx);
    if (!raw) return 0;
    return (s4)((raw[0]<<24)|(raw[1]<<16)|(raw[2]<<8)|raw[3]);
}

static f4 cp_get_float(jvm_class *cls, u2 idx) {
    s4 bits = cp_get_int(cls, idx);
    f4 val;
    memcpy(&val, &bits, 4);
    return val;
}

static s8 cp_get_long(jvm_class *cls, u2 idx) {
    u1 *raw = cp_get_raw(cls, idx);
    if (!raw) return 0;
    return (s8)(((u8)raw[0]<<56)|((u8)raw[1]<<48)|((u8)raw[2]<<40)|((u8)raw[3]<<32)|
                ((u8)raw[4]<<24)|((u8)raw[5]<<16)|((u8)raw[6]<<8)|raw[7]);
}

static f8 cp_get_double(jvm_class *cls, u2 idx) {
    s8 bits = cp_get_long(cls, idx);
    f8 val;
    memcpy(&val, &bits, 8);
    return val;
}

static jvm_class *resolve_class_cp(jvm_class *cls, u2 idx) {
    u1 *raw = cp_get_raw(cls, idx);
    if (!raw) return NULL;
    u2 name_idx = (raw[0]<<8)|raw[1];
    char *name = jvm_get_utf8(name_idx, cls);
    if (!name) return NULL;
    jvm_class *res = jvm_find_class(name);
    free(name);
    return res;
}

static jvm_method *resolve_method_cp(jvm_class *cls, u2 idx) {
    u1 *raw = cp_get_raw(cls, idx);
    if (!raw) return NULL;
    u2 class_idx = (raw[0]<<8)|raw[1];
    u2 nt_idx = (raw[2]<<8)|raw[3];
    u1 *nt = cp_get_raw(cls, nt_idx);
    if (!nt) return NULL;
    u2 name_idx = (nt[0]<<8)|nt[1];
    u2 desc_idx = (nt[2]<<8)|nt[3];
    char *name = jvm_get_utf8(name_idx, cls);
    char *desc = jvm_get_utf8(desc_idx, cls);
    jvm_class *target = resolve_class_cp(cls, class_idx);
    if (!target || !name || !desc) {
        if (name) free(name);
        if (desc) free(desc);
        return NULL;
    }
    jvm_method *m = find_method_in_class(target, name, desc);
    free(name);
    free(desc);
    return m;
}

static jvm_field *resolve_field_cp(jvm_class *cls, u2 idx) {
    u1 *raw = cp_get_raw(cls, idx);
    if (!raw) return NULL;
    u2 class_idx = (raw[0]<<8)|raw[1];
    u2 nt_idx = (raw[2]<<8)|raw[3];
    u1 *nt = cp_get_raw(cls, nt_idx);
    if (!nt) return NULL;
    u2 name_idx = (nt[0]<<8)|nt[1];
    u2 desc_idx = (nt[2]<<8)|nt[3];
    char *name = jvm_get_utf8(name_idx, cls);
    char *desc = jvm_get_utf8(desc_idx, cls);
    jvm_class *target = resolve_class_cp(cls, class_idx);
    if (!target || !name || !desc) {
        if (name) free(name);
        if (desc) free(desc);
        return NULL;
    }
    jvm_field *f = find_field_in_class(target, name, desc);
    free(name);
    free(desc);
    return f;
}

void jvm_execute(jvm_thread *thread) {
    jvm_frame *frame = &thread->frames[thread->frame_count - 1];
    u1 *pc = frame->pc;
    if (!pc) return;

    jvm_class *cls = frame->method->class;
    s4 *sp = &frame->sp;

    while (true) {
        u1 opcode = *pc;
        pc++;

        switch (opcode) {
            case 0x00: return;

            case 0x01: frame->stack[*sp].r = NULL; (*sp)++; break;

            case 0x02: frame->stack[*sp].i = -1; (*sp)++; break;
            case 0x03: frame->stack[*sp].i = 0; (*sp)++; break;
            case 0x04: frame->stack[*sp].i = 1; (*sp)++; break;
            case 0x05: frame->stack[*sp].i = 2; (*sp)++; break;
            case 0x06: frame->stack[*sp].i = 3; (*sp)++; break;
            case 0x07: frame->stack[*sp].i = 4; (*sp)++; break;
            case 0x08: frame->stack[*sp].i = 5; (*sp)++; break;
            case 0x09: frame->stack[*sp].l = 0; frame->stack[*sp+1].l = 0; (*sp)+=2; break;
            case 0x0A: frame->stack[*sp].l = 1; frame->stack[*sp+1].l = 1; (*sp)+=2; break;
            case 0x0B: frame->stack[*sp].f = 0.0f; (*sp)++; break;
            case 0x0C: frame->stack[*sp].f = 1.0f; (*sp)++; break;
            case 0x0D: frame->stack[*sp].f = 2.0f; (*sp)++; break;
            case 0x0E: frame->stack[*sp].d = 0.0; (*sp)+=2; break;
            case 0x0F: frame->stack[*sp].d = 1.0; (*sp)+=2; break;

            case 0x10: frame->stack[*sp].i = (s1)*pc; pc++; (*sp)++; break;
            case 0x11: frame->stack[*sp].i = (s2)((pc[0]<<8)|pc[1]); pc+=2; (*sp)++; break;
            case 0x12: {
                u1 idx = *pc; pc++;
                s4 val = cp_get_int(cls, idx);
                frame->stack[*sp].i = val;
                (*sp)++;
                break;
            }
            case 0x13: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                s8 val = cp_get_long(cls, idx);
                frame->stack[*sp].l = val;
                (*sp)+=2;
                break;
            }
            case 0x14: {
                u1 idx = *pc; pc++;
                f4 val = cp_get_float(cls, idx);
                frame->stack[*sp].f = val;
                (*sp)++;
                break;
            }
            case 0x15: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                s4 val = cp_get_int(cls, idx);
                frame->stack[*sp].i = val;
                (*sp)++;
                break;
            }
            case 0x16: frame->stack[*sp].i = frame->locals[*sp].i; (*sp)++; break;
            case 0x17: frame->stack[*sp].l = frame->locals[*sp].l; (*sp)+=2; break;
            case 0x18: frame->stack[*sp].f = frame->locals[*sp].f; (*sp)++; break;
            case 0x19: frame->stack[*sp].r = frame->locals[*sp].r; (*sp)++; break;
            case 0x1A: {
                u1 idx = *pc; pc++;
                frame->stack[*sp].i = frame->locals[idx].i;
                (*sp)++;
                break;
            }
            case 0x1B: {
                u1 idx = *pc; pc++;
                frame->stack[*sp].l = frame->locals[idx].l;
                (*sp)+=2;
                break;
            }
            case 0x1C: {
                u1 idx = *pc; pc++;
                frame->stack[*sp].f = frame->locals[idx].f;
                (*sp)++;
                break;
            }
            case 0x1D: {
                u1 idx = *pc; pc++;
                frame->stack[*sp].r = frame->locals[idx].r;
                (*sp)++;
                break;
            }
            case 0x1E: {
                u1 idx = *pc; pc++;
                frame->stack[*sp].i = frame->locals[idx].i;
                (*sp)++;
                break;
            }

            case 0x36: {
                u1 idx = *pc; pc++;
                (*sp)--;
                frame->locals[idx].i = frame->stack[*sp].i;
                break;
            }
            case 0x37: {
                u1 idx = *pc; pc++;
                (*sp)-=2;
                frame->locals[idx].l = frame->stack[*sp].l;
                break;
            }
            case 0x38: {
                u1 idx = *pc; pc++;
                (*sp)--;
                frame->locals[idx].f = frame->stack[*sp].f;
                break;
            }
            case 0x3A: {
                u1 idx = *pc; pc++;
                (*sp)--;
                frame->locals[idx].r = frame->stack[*sp].r;
                break;
            }
            case 0x3B: {
                u1 idx = *pc; pc++;
                (*sp)--;
                frame->locals[idx].i = frame->stack[*sp].i;
                break;
            }
            case 0x3C: {
                u1 idx = *pc; pc++;
                (*sp)--;
                frame->locals[idx].i = frame->stack[*sp].i;
                break;
            }
            case 0x3D: {
                u1 idx = *pc; pc++;
                (*sp)--;
                frame->locals[idx].i = frame->stack[*sp].i;
                break;
            }

            case 0x2A: frame->stack[*sp].r = frame->this_obj; (*sp)++; break;
            case 0x2B: {
                jvm_object *obj = frame->this_obj;
                s4 val = obj && obj->fields ? *(s4*)(obj->fields + 0) : 0;
                frame->stack[*sp].i = val;
                (*sp)++;
                break;
            }
            case 0x2C: {
                jvm_object *obj = frame->this_obj;
                s4 val = obj && obj->fields ? *(s4*)(obj->fields + 4) : 0;
                frame->stack[*sp].i = val;
                (*sp)++;
                break;
            }
            case 0x2D: {
                jvm_object *obj = frame->this_obj;
                s4 val = obj && obj->fields ? *(s4*)(obj->fields + 8) : 0;
                frame->stack[*sp].i = val;
                (*sp)++;
                break;
            }

            case 0x59: frame->stack[*sp] = frame->stack[*sp-1]; frame->stack[*sp].i = frame->stack[*sp-1].i; (*sp)++; break;
            case 0x5F: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a + b;
                (*sp)++;
                break;
            }
            case 0x60: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a + b;
                (*sp)++;
                break;
            }
            case 0x61: {
                (*sp)-=2; (*sp)-=2;
                s8 b = frame->stack[*sp+1].l;
                s8 a = frame->stack[*sp].l;
                frame->stack[*sp].l = a + b;
                (*sp)+=2;
                break;
            }
            case 0x64: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a - b;
                (*sp)++;
                break;
            }
            case 0x65: {
                (*sp)-=2; (*sp)-=2;
                s8 b = frame->stack[*sp+1].l;
                s8 a = frame->stack[*sp].l;
                frame->stack[*sp].l = a - b;
                (*sp)+=2;
                break;
            }
            case 0x68: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a * b;
                (*sp)++;
                break;
            }
            case 0x6C: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = b != 0 ? a / b : 0;
                (*sp)++;
                break;
            }
            case 0x70: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = b != 0 ? a % b : 0;
                (*sp)++;
                break;
            }
            case 0x74: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = -a;
                (*sp)++;
                break;
            }
            case 0x7C: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a | b;
                (*sp)++;
                break;
            }
            case 0x7E: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a & b;
                (*sp)++;
                break;
            }
            case 0x80: {
                (*sp)--;
                (*sp)--;
                s4 b = frame->stack[*sp+1].i;
                s4 a = frame->stack[*sp].i;
                frame->stack[*sp].i = a ^ b;
                (*sp)++;
                break;
            }

            case 0x99: {
                (*sp)--;
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp].i == 0) pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                break;
            }
            case 0x9A: {
                (*sp)--;
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp].i != 0) pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                break;
            }
            case 0x9B: {
                (*sp)--;
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp].i < 0) pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                break;
            }
            case 0x9C: {
                (*sp)--;
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp].i >= 0) pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                break;
            }
            case 0x9D: {
                (*sp)--;
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp].i > 0) pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                break;
            }
            case 0x9E: {
                (*sp)--;
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp].i <= 0) pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                break;
            }
            case 0x9F: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].i == frame->stack[*sp-2].i) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA0: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].i != frame->stack[*sp-2].i) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA1: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].i < frame->stack[*sp-2].i) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA2: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].i >= frame->stack[*sp-2].i) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA3: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].i > frame->stack[*sp-2].i) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA4: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].i <= frame->stack[*sp-2].i) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA5: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].r == frame->stack[*sp-2].r) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA6: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                if (frame->stack[*sp-1].r != frame->stack[*sp-2].r) {
                    pc = frame->method->code + ((pc - frame->method->code) - 3 + offset);
                }
                (*sp)-=2;
                break;
            }
            case 0xA7: {
                s2 offset = (pc[0]<<8)|pc[1]; pc+=2;
                pc += offset - 3;
                break;
            }

            case 0xAC: {
                (*sp)--;
                s4 val = frame->stack[*sp].i;
                thread->frame_count--;
                if (thread->frame_count > 0) {
                    jvm_frame *cf = &thread->frames[thread->frame_count - 1];
                    cf->stack[cf->sp].i = val;
                    cf->sp++;
                }
                frame->pc = pc;
                return;
            }
            case 0xAD: {
                (*sp)-=2;
                s8 val = frame->stack[*sp].l;
                thread->frame_count--;
                if (thread->frame_count > 0) {
                    jvm_frame *cf = &thread->frames[thread->frame_count - 1];
                    cf->stack[cf->sp].l = val;
                    cf->sp += 2;
                }
                frame->pc = pc;
                return;
            }
            case 0xAE: {
                (*sp)--;
                f4 val = frame->stack[*sp].f;
                thread->frame_count--;
                if (thread->frame_count > 0) {
                    jvm_frame *cf = &thread->frames[thread->frame_count - 1];
                    cf->stack[cf->sp].f = val;
                    cf->sp++;
                }
                frame->pc = pc;
                return;
            }
            case 0xB0: {
                (*sp)--;
                jvm_object *val = frame->stack[*sp].r;
                thread->frame_count--;
                if (thread->frame_count > 0) {
                    jvm_frame *cf = &thread->frames[thread->frame_count - 1];
                    cf->stack[cf->sp].r = val;
                    cf->sp++;
                }
                frame->pc = pc;
                return;
            }
            case 0xB1: {
                thread->frame_count--;
                frame->pc = pc;
                return;
            }

            case 0xB2: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_field *f = resolve_field_cp(cls, idx);
                if (f && (f->access_flags & ACC_STATIC)) {
                    jvm_class *fc = f->class;
                    if (fc && fc->static_fields) {
                        s4 val = *(s4*)(fc->static_fields + f->offset);
                        frame->stack[*sp].i = val;
                        (*sp)++;
                    }
                }
                break;
            }
            case 0xB3: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_field *f = resolve_field_cp(cls, idx);
                if (f && (f->access_flags & ACC_STATIC)) {
                    jvm_class *fc = f->class;
                    if (fc && fc->static_fields) {
                        (*sp)--;
                        *(s4*)(fc->static_fields + f->offset) = frame->stack[*sp].i;
                    }
                }
                break;
            }
            case 0xB4: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_field *f = resolve_field_cp(cls, idx);
                if (f) {
                    (*sp)--;
                    jvm_object *obj = frame->stack[*sp].r;
                    if (obj && obj->fields) {
                        s4 val = *(s4*)(obj->fields + f->offset);
                        frame->stack[*sp].i = val;
                        (*sp)++;
                    }
                }
                break;
            }
            case 0xB5: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_field *f = resolve_field_cp(cls, idx);
                if (f) {
                    (*sp)--;
                    s4 val = frame->stack[*sp].i;
                    (*sp)--;
                    jvm_object *obj = frame->stack[*sp].r;
                    if (obj && obj->fields) {
                        *(s4*)(obj->fields + f->offset) = val;
                    }
                }
                break;
            }

            case 0xB6: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_method *m = resolve_method_cp(cls, idx);
                if (m) {
                    s4 nargs = 1;
                    char *desc = jvm_get_utf8(m->desc_index, m->class);
                    if (desc) {
                        nargs = 0;
                        char *d = desc + 1;
                        while (*d && *d != ')') {
                            if (*d == 'J' || *d == 'D') nargs += 2;
                            else { nargs++; }
                            if (*d == '[') while (*d == '[') d++;
                            if (*d == 'L') while (*d && *d != ';') d++;
                            d++;
                        }
                        nargs++;
                        free(desc);
                    }
                    if (m->access_flags & ACC_NATIVE) {
                        char *cname = m->class->name;
                        char *mname = jvm_get_utf8(m->name_index, m->class);
                        char *mdesc = jvm_get_utf8(m->desc_index, m->class);
                        native_method_call(thread, cname ? cname : "", mname ? mname : "", mdesc ? mdesc : "");
                        if (cname) {} if (mname) free(mname); if (mdesc) free(mdesc);
                    } else if (m->code) {
                        jvm_frame *new_frame = &thread->frames[thread->frame_count];
                        memset(new_frame, 0, sizeof(jvm_frame));
                        new_frame->method = m;
                        new_frame->pc = m->code;
                        new_frame->locals = thread->locals + thread->frame_count * m->max_locals;
                        new_frame->stack = thread->stack + thread->frame_count * m->max_stack;
                        new_frame->sp = 0;
                        s4 stack_start = *sp - nargs;
                        new_frame->this_obj = frame->stack[stack_start].r;
                        for (s4 i = 0; i < nargs - 1; i++) {
                            new_frame->locals[i] = frame->stack[stack_start + 1 + i];
                        }
                        *sp = stack_start;
                        thread->frame_count++;
                        jvm_execute(thread);
                    }
                }
                break;
            }

            case 0xB7: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_method *m = resolve_method_cp(cls, idx);
                if (m) {
                    char *mname = jvm_get_utf8(m->name_index, m->class);
                    if (mname && strcmp(mname, "<init>") == 0) {
                        s4 nargs = 1;
                        char *desc = jvm_get_utf8(m->desc_index, m->class);
                        if (desc) {
                            nargs = 0;
                            char *d = desc + 1;
                            while (*d && *d != ')') {
                                if (*d == 'J' || *d == 'D') nargs += 2;
                                else nargs++;
                                if (*d == '[') while (*d == '[') d++;
                                if (*d == 'L') while (*d && *d != ';') d++;
                                d++;
                            }
                            nargs++;
                            free(desc);
                        }
                        if (m->code) {
                            jvm_frame *new_frame = &thread->frames[thread->frame_count];
                            memset(new_frame, 0, sizeof(jvm_frame));
                            new_frame->method = m;
                            new_frame->pc = m->code;
                            new_frame->locals = thread->locals + thread->frame_count * m->max_locals;
                            new_frame->stack = thread->stack + thread->frame_count * m->max_stack;
                            new_frame->sp = 0;
                            s4 stack_start = *sp - nargs;
                            new_frame->this_obj = frame->stack[stack_start].r;
                            for (s4 i = 0; i < nargs - 1; i++) {
                                new_frame->locals[i] = frame->stack[stack_start + 1 + i];
                            }
                            *sp = stack_start;
                            thread->frame_count++;
                            jvm_execute(thread);
                        }
                    }
                    if (mname) free(mname);
                }
                break;
            }

            case 0xB8: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_method *m = resolve_method_cp(cls, idx);
                if (m) {
                    s4 nargs = 0;
                    char *desc = jvm_get_utf8(m->desc_index, m->class);
                    if (desc) {
                        nargs = 0;
                        char *d = desc + 1;
                        while (*d && *d != ')') {
                            if (*d == 'J' || *d == 'D') nargs += 2;
                            else nargs++;
                            if (*d == '[') while (*d == '[') d++;
                            if (*d == 'L') while (*d && *d != ';') d++;
                            d++;
                        }
                        free(desc);
                    }
                    if (m->access_flags & ACC_NATIVE) {
                        char *cname = m->class->name;
                        char *mname = jvm_get_utf8(m->name_index, m->class);
                        char *mdesc = jvm_get_utf8(m->desc_index, m->class);
                        native_method_call(thread, cname ? cname : "", mname ? mname : "", mdesc ? mdesc : "");
                        if (mname) free(mname);
                        if (mdesc) free(mdesc);
                    } else if (m->code) {
                        jvm_frame *new_frame = &thread->frames[thread->frame_count];
                        memset(new_frame, 0, sizeof(jvm_frame));
                        new_frame->method = m;
                        new_frame->pc = m->code;
                        new_frame->locals = thread->locals + thread->frame_count * m->max_locals;
                        new_frame->stack = thread->stack + thread->frame_count * m->max_stack;
                        new_frame->sp = 0;
                        s4 stack_start = *sp - nargs;
                        for (s4 i = 0; i < nargs; i++) {
                            new_frame->locals[i] = frame->stack[stack_start + i];
                        }
                        *sp = stack_start;
                        thread->frame_count++;
                        jvm_execute(thread);
                    }
                }
                break;
            }

            case 0xBB: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_class *target = resolve_class_cp(cls, idx);
                if (target) {
                    jvm_object *obj = jvm_alloc_object(target);
                    frame->stack[*sp].r = obj;
                    (*sp)++;
                } else {
                    frame->stack[*sp].r = NULL;
                    (*sp)++;
                }
                break;
            }

            case 0xBC: {
                s4 atype = *pc; pc++;
                (*sp)--;
                s4 count = frame->stack[*sp].i;
                jvm_object *arr = jvm_new_array(thread, count, (u1)atype);
                frame->stack[*sp].r = arr;
                (*sp)++;
                break;
            }
            case 0xBD: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                (*sp)--;
                s4 count = frame->stack[*sp].i;
                jvm_class *elem_cls = NULL;
                char *name = jvm_get_utf8(idx, cls);
                if (name) {
                    elem_cls = jvm_find_class(name);
                    free(name);
                }
                jvm_object *arr = jvm_new_array(thread, count, 0);
                frame->stack[*sp].r = arr;
                (*sp)++;
                break;
            }

            case 0xBE: {
                jvm_object *obj = frame->stack[*sp-2].r;
                s4 idx = frame->stack[*sp-1].i;
                s4 val = obj && obj->data.arr.data && idx >= 0 && idx < obj->data.arr.length
                    ? *(s4*)(obj->data.arr.data + idx * 4) : 0;
                (*sp)-=2;
                frame->stack[*sp].i = val;
                (*sp)++;
                break;
            }
            case 0xBF: {
                s4 val = frame->stack[*sp-1].i;
                jvm_object *obj = frame->stack[*sp-2].r;
                s4 idx = frame->stack[*sp-3].i;
                if (obj && obj->data.arr.data && idx >= 0 && idx < obj->data.arr.length) {
                    *(s4*)(obj->data.arr.data + idx * 4) = val;
                }
                (*sp)-=3;
                break;
            }
            case 0xC0: {
                jvm_object *obj = frame->stack[*sp-1].r;
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                frame->stack[*sp-1].r = obj;
                break;
            }
            case 0xC1: {
                jvm_object *obj = frame->stack[*sp-1].r;
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                jvm_class *target = resolve_class_cp(cls, idx);
                s4 result = 0;
                if (obj && target) {
                    result = (obj->class == target) ? 1 : 0;
                }
                frame->stack[*sp-1].i = result;
                break;
            }

            case 0xC6: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                (*sp)--;
                if (frame->stack[*sp].r == NULL) {
                    s2 offset = (pc[0]<<8)|pc[1];
                    pc += offset;
                } else {
                    pc += 2;
                }
                break;
            }
            case 0xC7: {
                u2 idx = (pc[0]<<8)|pc[1]; pc+=2;
                (*sp)--;
                if (frame->stack[*sp].r != NULL) {
                    s2 offset = (pc[0]<<8)|pc[1];
                    pc += offset;
                } else {
                    pc += 2;
                }
                break;
            }

            case 0xD0: {
                pc += 4;
                break;
            }

            default: {
                frame->pc = pc;
                return;
            }
        }
    }
}
