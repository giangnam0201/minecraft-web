#ifndef JVM_H
#define JVM_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#define JVM_STACK_SIZE     (1024 * 1024)
#define JVM_HEAP_SIZE      (256 * 1024 * 1024)
#define JVM_MAX_THREADS    64
#define JVM_MAX_CLASSES    32768
#define JVM_MAX_FIELDS     65536
#define JVM_MAX_METHODS    131072
#define JVM_MAX_STRING     65536
#define JVM_MAX_FRAMES     1024

#define ACC_PUBLIC       0x0001
#define ACC_PRIVATE      0x0002
#define ACC_PROTECTED    0x0004
#define ACC_STATIC       0x0008
#define ACC_FINAL        0x0010
#define ACC_SUPER        0x0020
#define ACC_VOLATILE     0x0040
#define ACC_TRANSIENT    0x0080
#define ACC_NATIVE       0x0100
#define ACC_INTERFACE    0x0200
#define ACC_ABSTRACT     0x0400
#define ACC_STRICT       0x0800
#define ACC_SYNTHETIC    0x1000
#define ACC_ANNOTATION   0x2000
#define ACC_ENUM         0x4000

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

typedef enum {
    T_BOOLEAN = 4,
    T_CHAR    = 5,
    T_FLOAT   = 6,
    T_DOUBLE  = 7,
    T_BYTE    = 8,
    T_SHORT   = 9,
    T_INT     = 10,
    T_LONG    = 11,
    T_VOID    = 12,
    T_REF     = 0,
} jvm_primitive_type;

typedef struct jvm_object jvm_object;
typedef struct jvm_class jvm_class;
typedef struct jvm_method jvm_method;
typedef struct jvm_field jvm_field;
typedef struct jvm_frame jvm_frame;
typedef struct jvm_thread jvm_thread;
typedef struct jvm_string jvm_string;
typedef struct jvm_array jvm_array;

typedef union {
    s4  i;
    s8  l;
    f4  f;
    f8  d;
    jvm_object *r;
} jvm_value;

struct jvm_string {
    u2 *chars;
    s4  length;
    jvm_object *obj;
};

struct jvm_array {
    s4  length;
    u1 *data;
    u1  elem_type;
    jvm_object *obj;
};

struct jvm_object {
    jvm_class *class;
    u1        *fields;
    bool       is_array;
    union {
        jvm_array arr;
    } data;
    jvm_object *monitor_owner;
    s4         monitor_count;
    jvm_object *next;
};

struct jvm_field {
    u2  access_flags;
    u2  name_index;
    u2  desc_index;
    u2  attr_count;
    u2  offset;
    jvm_class *class;
};

struct jvm_method {
    u2  access_flags;
    u2  name_index;
    u2  desc_index;
    u2  attr_count;
    u1  *code;
    s4  code_length;
    s4  max_stack;
    s4  max_locals;
    u2  *exception_table;
    s4  exc_table_length;
    jvm_class *class;
    void *native_func;
};

struct jvm_class {
    u1  *data;
    s4   data_len;
    u2   minor_version;
    u2   major_version;
    u2   cp_count;
    u1  *cp_raw;
    u2   access_flags;
    u2   this_class;
    u2   super_class;
    u2   interfaces_count;
    u2  *interfaces;
    u2   fields_count;
    jvm_field *fields;
    u2   methods_count;
    jvm_method *methods;
    s4   static_fields_size;
    u1  *static_fields;
    s4   instance_fields_size;
    bool initialized;
    char *name;
    jvm_object *class_object;
};

struct jvm_frame {
    jvm_method *method;
    u1         *pc;
    jvm_value  *locals;
    jvm_value  *stack;
    s4         sp;
    jvm_object *this_obj;
};

struct jvm_thread {
    s4         id;
    jvm_frame  frames[JVM_MAX_FRAMES];
    s4         frame_count;
    jvm_value  stack[JVM_STACK_SIZE];
    jvm_value  locals[JVM_STACK_SIZE];
    bool       running;
    bool       suspended;
    jvm_object *pending_exception;
};

typedef void (*native_method_fn)(jvm_thread *thread);

extern jvm_thread *jvm_current_thread;
extern jvm_class *jvm_classes[JVM_MAX_CLASSES];
extern s4 jvm_class_count;
extern u1 *jvm_heap;
extern s4 jvm_heap_used;
extern jvm_object *jvm_objects;

void jvm_init(void);
s4 jvm_load_class(u1 *data, s4 len);
jvm_class *jvm_find_class(const char *name);
void jvm_link_class(jvm_class *cls);
void jvm_init_class(jvm_thread *thread, jvm_class *cls);
void jvm_execute(jvm_thread *thread);
jvm_object *jvm_alloc_object(jvm_class *cls);
void jvm_thread_start(jvm_thread *thread, jvm_method *method);
char *jvm_get_utf8(u2 index, jvm_class *cls);

void jvm_invoke_static(jvm_thread *thread, jvm_class *cls, const char *method_name, const char *desc);
jvm_object *jvm_new_string(jvm_thread *thread, const char *utf8);
jvm_object *jvm_new_array(jvm_thread *thread, s4 count, u1 type);
jvm_class *jvm_get_class_from_object(jvm_object *obj);
jvm_class *jvm_find_class_in_cp(jvm_class *cls, u2 index);

void jvm_push_int(jvm_thread *thread, s4 val);
void jvm_push_long(jvm_thread *thread, s8 val);
void jvm_push_float(jvm_thread *thread, f4 val);
void jvm_push_double(jvm_thread *thread, f8 val);
void jvm_push_ref(jvm_thread *thread, jvm_object *ref);
jvm_value jvm_pop(jvm_thread *thread);

void native_method_call(jvm_thread *thread, const char *class_name, const char *method_name, const char *desc);
void bridge_register_natives(void);

extern void js_gl_clear(s4 mask);
extern void js_gl_clear_color(f4 r, f4 g, f4 b, f4 a);
extern void js_gl_viewport(s4 x, s4 y, s4 w, s4 h);
extern void js_gl_enable(s4 cap);
extern void js_gl_disable(s4 cap);
extern void js_gl_bind_texture(s4 target, s4 tex);
extern void js_gl_gen_textures(s4 n, void *textures);
extern void js_gl_delete_textures(s4 n, void *textures);
extern void js_gl_tex_image_2d(s4 target, s4 level, s4 internal, s4 w, s4 h, s4 border, s4 format, s4 type, void *pixels);
extern void js_gl_draw_arrays(s4 mode, s4 first, s4 count);
extern void js_gl_draw_elements(s4 mode, s4 count, s4 type, void *indices);
extern void js_gl_create_shader(s4 type);
extern void js_gl_shader_source(s4 shader, const char *src);
extern void js_gl_compile_shader(s4 shader);
extern void js_gl_create_program(void);
extern void js_gl_attach_shader(s4 prog, s4 shader);
extern void js_gl_link_program(s4 prog);
extern void js_gl_use_program(s4 prog);
extern void js_gl_uniform_matrix4fv(s4 loc, s4 count, bool transpose, f4 *val);
extern void js_gl_get_uniform_location(s4 prog, const char *name);
extern void js_gl_get_attrib_location(s4 prog, const char *name);
extern void js_gl_vertex_attrib_pointer(s4 idx, s4 size, s4 type, bool norm, s4 stride, void *ptr);
extern void js_gl_enable_vertex_attrib(s4 idx);
extern void js_gl_disable_vertex_attrib(s4 idx);
extern void js_gl_buffer_data(s4 target, s4 size, void *data, s4 usage);
extern void js_gl_buffer_sub_data(s4 target, s4 offset, s4 size, void *data);
extern void js_gl_gen_buffers(s4 n, void *buffers);
extern void js_gl_delete_buffers(s4 n, void *buffers);
extern void js_gl_bind_buffer(s4 target, s4 buf);
extern void js_swap_buffers(void);
extern void js_poll_events(void);
extern s4 js_get_key_state(s4 key);
extern s4 js_get_mouse_button(s4 btn);
extern s4 js_get_mouse_x(void);
extern s4 js_get_mouse_y(void);
extern void js_create_window(s4 w, s4 h, const char *title);
extern void js_set_display_mode(s4 w, s4 h);
extern s4 js_is_close_requested(void);
extern void js_audio_init(void);
extern void js_audio_play(s4 source, f4 vol);
extern void js_socket_connect(const char *host, s4 port);
extern void js_socket_send(void *data, s4 len);
extern s4 js_socket_recv(void *buf, s4 maxlen);
extern void js_socket_close(void);
extern void js_log(const char *msg);
extern void js_log_int(s4 val);
extern f8 js_current_time_millis(void);

#endif
