#ifndef JVM_H
#define JVM_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#define JVM_STACK_SIZE     (16 * 1024)
#define JVM_MAX_THREADS    4
#define JVM_MAX_CLASSES    16384
#define JVM_HASH_SIZE      32768
#define JVM_MAX_FRAMES     128

#define ACC_PUBLIC       0x0001
#define ACC_PRIVATE      0x0002
#define ACC_PROTECTED    0x0004
#define ACC_STATIC       0x0008
#define ACC_FINAL        0x0010
#define ACC_SUPER        0x0020
#define ACC_NATIVE       0x0100
#define ACC_INTERFACE    0x0200
#define ACC_ABSTRACT     0x0400

typedef uint8_t  u1;
typedef uint16_t u2;
typedef uint32_t u4;
typedef uint64_t u8;
typedef int8_t   s1;
typedef int16_t  s2;
typedef int32_t  s4;
typedef int64_t  s8;
typedef float    f4;
typedef double   f8;

enum { T_BOOLEAN=4, T_CHAR=5, T_FLOAT=6, T_DOUBLE=7, T_BYTE=8, T_SHORT=9, T_INT=10, T_LONG=11 };

struct jvm_object;
typedef union { s4 i; s8 l; f4 f; f8 d; struct jvm_object *r; } jvm_value;
typedef struct jvm_object { struct jvm_class *cls; u1 *fields; bool is_array; struct { s4 len; u1 *data; u1 etype; } arr; struct jvm_object *next; } jvm_object;
typedef struct jvm_class {
    u1 *data; s4 data_len; u2 minor_ver, major_ver; u2 cp_count; u1 *cp_raw;
    u2 access_flags; u2 this_class; char *name; char *super_name;
    u2 fields_count; struct jvm_field *fields;
    u2 methods_count; struct jvm_method *methods;
    s4 static_size; u1 *static_data; s4 inst_size;
    bool initialized; struct jvm_class *super; s4 index;
} jvm_class;
typedef struct jvm_field { u2 access; u2 name_idx; u2 desc_idx; s4 offset; jvm_class *cls; } jvm_field;
typedef struct jvm_method { u2 access; u2 name_idx; u2 desc_idx; u1 *code; s4 code_len; s4 max_stack; s4 max_locals; jvm_class *cls; } jvm_method;
typedef struct jvm_frame { jvm_method *method; u1 *pc; jvm_value *locals; jvm_value *stack; s4 sp; jvm_object *this_obj; } jvm_frame;
typedef struct jvm_thread { s4 id; jvm_frame frames[JVM_MAX_FRAMES]; s4 frame_cnt; jvm_value stack[JVM_STACK_SIZE]; jvm_value locals[JVM_STACK_SIZE]; bool running; jvm_object *exception; } jvm_thread;

extern jvm_thread jvm_threads[JVM_MAX_THREADS];
extern jvm_thread *jvm_cur;
extern jvm_class *jvm_classes[JVM_MAX_CLASSES];
extern s4 jvm_cls_cnt;
extern u1 *jvm_heap;

void jvm_init(void);
s4  jvm_load_class(u1 *data, s4 len);
s4  jvm_load_blob(u1 *blob, s4 len);
jvm_class *jvm_find_class(const char *name);
void jvm_init_class(jvm_thread *t, jvm_class *c);
void jvm_execute(jvm_thread *t);
jvm_object *jvm_alloc_obj(jvm_class *c);
jvm_object *jvm_new_array(jvm_thread *t, s4 cnt, u1 type);
jvm_object *jvm_new_string_utf8(jvm_thread *t, const char *s);
void jvm_invoke_static(jvm_thread *t, jvm_class *c, const char *name, const char *desc);
char *jvm_cp_utf8(u2 idx, jvm_class *c);
jvm_class *jvm_cp_class(jvm_class *c, u2 idx);
void jvm_push_i(jvm_thread *t, s4 v);
void jvm_push_l(jvm_thread *t, s8 v);
void jvm_push_f(jvm_thread *t, f4 v);
void jvm_push_d(jvm_thread *t, f8 v);
void jvm_push_r(jvm_thread *t, jvm_object *r);
void native_method_call(jvm_thread *t, const char *cls, const char *name, const char *desc);
void bridge_register_natives(void);

extern void js_log(const char *m);
extern void js_log_i(s4 v);
extern f8 js_cur_ms(void);
extern s4  js_resource_exists(const char *p);
extern s4  js_resource_read(const char *p, void *b, s4 m);
extern s4  js_resource_size(const char *p);
extern void js_gl_clear(s4 m);
extern void js_gl_clear_color(f4 r,f4 g,f4 b,f4 a);
extern void js_gl_viewport(s4 x,s4 y,s4 w,s4 h);
extern void js_gl_enable(s4 c);
extern void js_gl_disable(s4 c);
extern void js_gl_bind_texture(s4 t,s4 x);
extern void js_gl_gen_textures(s4 n,void *p);
extern void js_gl_delete_textures(s4 n,void *p);
extern void js_gl_tex_image_2d(s4 t,s4 l,s4 i,s4 w,s4 h,s4 b,s4 f,s4 ty,void *p);
extern void js_gl_draw_arrays(s4 m,s4 f,s4 c);
extern void js_gl_gen_buffers(s4 n,void *p);
extern void js_gl_bind_buffer(s4 t,s4 b);
extern void js_gl_buffer_data(s4 t,s4 s,void *d,s4 u);
extern void js_gl_buffer_sub_data(s4 t,s4 o,s4 s,void *d);
extern void js_gl_begin(s4 m);
extern void js_gl_end(void);
extern void js_gl_vertex2f(f4 x,f4 y);
extern void js_gl_vertex3f(f4 x,f4 y,f4 z);
extern void js_gl_tex_coord2f(f4 u,f4 v);
extern void js_gl_color3f(f4 r,f4 g,f4 b);
extern void js_gl_color4f(f4 r,f4 g,f4 b,f4 a);
extern void js_gl_matrix_mode(s4 m);
extern void js_gl_load_identity(void);
extern void js_gl_push_matrix(void);
extern void js_gl_pop_matrix(void);
extern void js_gl_translatef(f4 x,f4 y,f4 z);
extern void js_gl_rotatef(f4 a,f4 x,f4 y,f4 z);
extern void js_gl_scalef(f4 x,f4 y,f4 z);
extern void js_gl_ortho(f8 l,f8 r,f8 b,f8 t,f8 n,f8 f);
extern void js_gl_new_list(s4 l,s4 m);
extern void js_gl_end_list(void);
extern void js_gl_call_list(s4 l);
extern void js_gl_tex_parameteri(s4 t,s4 p,s4 v);
extern void js_gl_blend_func(s4 s,s4 d);
extern void js_gl_depth_func(s4 f);
extern void js_gl_depth_mask(s4 f);
extern void js_gl_color_mask(s4 r,s4 g,s4 b,s4 a);
extern void js_gl_cull_face(s4 m);
extern void js_gl_alpha_func(s4 f,f4 r);
extern void js_gl_get_string(s4 n,void *p);
extern s4  js_gl_get_error(void);
extern void js_gl_read_pixels(s4 x,s4 y,s4 w,s4 h,s4 f,s4 t,void *p);
extern void js_gl_get_integerv(s4 n,void *p);
extern void js_gl_line_width(f4 w);
extern void js_gl_polygon_offset(f4 f,f4 u);
extern void js_gl_scissor(s4 x,s4 y,s4 w,s4 h);
extern void js_gl_active_texture(s4 t);
extern void js_gl_fogi(s4 p,s4 v);
extern void js_gl_fogf(s4 p,f4 v);
extern void js_gl_fogfv(s4 p,void *v);
extern void js_gl_generate_mipmap(s4 t);
extern void js_gl_pixel_storei(s4 p,s4 v);
extern void js_gl_shader_source(s4 s,const char *c);
extern void js_gl_compile_shader(s4 s);
extern s4  js_gl_create_shader(s4 t);
extern s4  js_gl_create_program(void);
extern void js_gl_attach_shader(s4 p,s4 s);
extern void js_gl_link_program(s4 p);
extern void js_gl_use_program(s4 p);
extern s4  js_gl_get_uniform_location(s4 p,const char *n);
extern void js_gl_uniform1i(s4 l,s4 v);
extern void js_gl_uniform1f(s4 l,f4 v);
extern void js_gl_uniform_matrix4fv(s4 l,s4 c,bool t,f4 *v);
extern void js_gl_vertex_attrib_pointer(s4 i,s4 s,s4 t,bool n,s4 str,void *p);
extern void js_gl_enable_vertex_attrib(s4 i);
extern void js_create_window(s4 w,s4 h,const char *t);
extern void js_set_display_mode(s4 w,s4 h);
extern void js_swap_buffers(void);
extern s4  js_is_close_requested(void);
extern s4  js_get_key_state(s4 k);
extern s4  js_get_mouse_button(s4 b);
extern s4  js_get_mouse_x(void);
extern s4  js_get_mouse_y(void);
extern void js_set_mouse_grabbed(s4 g);
extern s4  js_is_mouse_grabbed(void);

#endif
