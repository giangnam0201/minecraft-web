#include "jvm.h"
#include <string.h>
#include <stdlib.h>

void native_method_call(jvm_thread *thread, const char *class_name, const char *method_name, const char *desc) {
    (void)desc;

    if (strcmp(class_name, "org/lwjgl/opengl/GL11") == 0) {
        if (strcmp(method_name, "glClear") == 0) { js_gl_clear(thread->stack[0].i); return; }
        if (strcmp(method_name, "glClearColor") == 0) { js_gl_clear_color(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f, thread->stack[3].f); return; }
        if (strcmp(method_name, "glClearDepth") == 0) { js_gl_clear_depth(thread->stack[0].d); return; }
        if (strcmp(method_name, "glClearStencil") == 0) { js_gl_clear_stencil(thread->stack[0].i); return; }
        if (strcmp(method_name, "glViewport") == 0) { js_gl_viewport(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i); return; }
        if (strcmp(method_name, "glScissor") == 0) { js_gl_scissor(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i); return; }
        if (strcmp(method_name, "glEnable") == 0) { js_gl_enable(thread->stack[0].i); return; }
        if (strcmp(method_name, "glDisable") == 0) { js_gl_disable(thread->stack[0].i); return; }
        if (strcmp(method_name, "glBlendFunc") == 0) { js_gl_blend_func(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glDepthFunc") == 0) { js_gl_depth_func(thread->stack[0].i); return; }
        if (strcmp(method_name, "glDepthMask") == 0) { js_gl_depth_mask(thread->stack[0].i); return; }
        if (strcmp(method_name, "glColorMask") == 0) { js_gl_color_mask(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i); return; }
        if (strcmp(method_name, "glCullFace") == 0) { js_gl_cull_face(thread->stack[0].i); return; }
        if (strcmp(method_name, "glFrontFace") == 0) { js_gl_front_face(thread->stack[0].i); return; }
        if (strcmp(method_name, "glShadeModel") == 0) { js_gl_shade_model(thread->stack[0].i); return; }
        if (strcmp(method_name, "glPolygonOffset") == 0) { js_gl_polygon_offset(thread->stack[0].f, thread->stack[1].f); return; }
        if (strcmp(method_name, "glLineWidth") == 0) { js_gl_line_width(thread->stack[0].f); return; }
        if (strcmp(method_name, "glPointSize") == 0) { js_gl_point_size(thread->stack[0].f); return; }
        if (strcmp(method_name, "glAlphaFunc") == 0) { js_gl_alpha_func(thread->stack[0].i, thread->stack[1].f); return; }
        if (strcmp(method_name, "glActiveTexture") == 0) { js_gl_active_texture(thread->stack[0].i); return; }
        if (strcmp(method_name, "glBindTexture") == 0) { js_gl_bind_texture(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glGenTextures") == 0) { js_gl_gen_textures(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glDeleteTextures") == 0) { js_gl_delete_textures(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glTexParameteri") == 0) { js_gl_tex_parameteri(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i); return; }
        if (strcmp(method_name, "glTexParameterf") == 0) { js_gl_tex_parameterf(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i); return; }
        if (strcmp(method_name, "glTexImage2D") == 0) { js_gl_tex_image_2d(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i, thread->stack[4].i, thread->stack[5].i, thread->stack[6].i, thread->stack[7].i, (void *)(intptr_t)thread->stack[8].i); return; }
        if (strcmp(method_name, "glTexSubImage2D") == 0) { js_gl_tex_sub_image_2d(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i, thread->stack[4].i, thread->stack[5].i, thread->stack[6].i, thread->stack[7].i, (void *)(intptr_t)thread->stack[8].i); return; }
        if (strcmp(method_name, "glCopyTexSubImage2D") == 0) { js_gl_copy_tex_sub_image_2d(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i, thread->stack[4].i, thread->stack[5].i, thread->stack[6].i, thread->stack[7].i); return; }
        if (strcmp(method_name, "glGenerateMipmap") == 0) { js_gl_generate_mipmap(thread->stack[0].i); return; }
        if (strcmp(method_name, "glPixelStorei") == 0) { js_gl_pixel_storei(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glDrawArrays") == 0) { js_gl_draw_arrays(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i); return; }
        if (strcmp(method_name, "glDrawElements") == 0) { js_gl_draw_elements(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, (void *)(intptr_t)thread->stack[3].i); return; }
        if (strcmp(method_name, "glGenBuffers") == 0) { js_gl_gen_buffers(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glDeleteBuffers") == 0) { js_gl_delete_buffers(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glBindBuffer") == 0) { js_gl_bind_buffer(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glBufferData") == 0) { js_gl_buffer_data(thread->stack[0].i, thread->stack[1].l, (void *)(intptr_t)thread->stack[2].i, thread->stack[3].i); return; }
        if (strcmp(method_name, "glBufferSubData") == 0) { js_gl_buffer_sub_data(thread->stack[0].i, thread->stack[1].l, thread->stack[2].l, (void *)(intptr_t)thread->stack[3].i); return; }
        if (strcmp(method_name, "glCreateShader") == 0) { s4 r = js_gl_create_shader(thread->stack[0].i); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glShaderSource") == 0) { js_gl_shader_source(thread->stack[0].i, (const char *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glCompileShader") == 0) { js_gl_compile_shader(thread->stack[0].i); return; }
        if (strcmp(method_name, "glCreateProgram") == 0) { s4 r = js_gl_create_program(); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glAttachShader") == 0) { js_gl_attach_shader(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glLinkProgram") == 0) { js_gl_link_program(thread->stack[0].i); return; }
        if (strcmp(method_name, "glUseProgram") == 0) { js_gl_use_program(thread->stack[0].i); return; }
        if (strcmp(method_name, "glGetUniformLocation") == 0) { s4 r = js_gl_get_uniform_location(thread->stack[0].i, (const char *)(intptr_t)thread->stack[1].i); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glGetAttribLocation") == 0) { s4 r = js_gl_get_attrib_location(thread->stack[0].i, (const char *)(intptr_t)thread->stack[1].i); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glUniform1i") == 0) { js_gl_uniform1i(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glUniform1f") == 0) { js_gl_uniform1f(thread->stack[0].i, thread->stack[1].f); return; }
        if (strcmp(method_name, "glUniform2f") == 0) { js_gl_uniform2f(thread->stack[0].i, thread->stack[1].f, thread->stack[2].f); return; }
        if (strcmp(method_name, "glUniform3f") == 0) { js_gl_uniform3f(thread->stack[0].i, thread->stack[1].f, thread->stack[2].f, thread->stack[3].f); return; }
        if (strcmp(method_name, "glUniform4f") == 0) { js_gl_uniform4f(thread->stack[0].i, thread->stack[1].f, thread->stack[2].f, thread->stack[3].f, thread->stack[4].f); return; }
        if (strcmp(method_name, "glUniformMatrix4fv") == 0) { js_gl_uniform_matrix4fv(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, (f4 *)(intptr_t)thread->stack[3].i); return; }
        if (strcmp(method_name, "glVertexAttribPointer") == 0) { js_gl_vertex_attrib_pointer(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i, thread->stack[4].i, (void *)(intptr_t)thread->stack[5].l); return; }
        if (strcmp(method_name, "glEnableVertexAttribArray") == 0) { js_gl_enable_vertex_attrib(thread->stack[0].i); return; }
        if (strcmp(method_name, "glDisableVertexAttribArray") == 0) { js_gl_disable_vertex_attrib(thread->stack[0].i); return; }
        if (strcmp(method_name, "glBegin") == 0) { js_gl_begin(thread->stack[0].i); return; }
        if (strcmp(method_name, "glEnd") == 0) { js_gl_end(); return; }
        if (strcmp(method_name, "glVertex2f") == 0) { js_gl_vertex2f(thread->stack[0].f, thread->stack[1].f); return; }
        if (strcmp(method_name, "glVertex3f") == 0) { js_gl_vertex3f(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f); return; }
        if (strcmp(method_name, "glVertex2fv") == 0) { js_gl_vertex2fv((void *)(intptr_t)thread->stack[0].i); return; }
        if (strcmp(method_name, "glVertex3fv") == 0) { js_gl_vertex3fv((void *)(intptr_t)thread->stack[0].i); return; }
        if (strcmp(method_name, "glTexCoord2f") == 0) { js_gl_tex_coord2f(thread->stack[0].f, thread->stack[1].f); return; }
        if (strcmp(method_name, "glColor3f") == 0) { js_gl_color3f(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f); return; }
        if (strcmp(method_name, "glColor4f") == 0) { js_gl_color4f(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f, thread->stack[3].f); return; }
        if (strcmp(method_name, "glColor3ub") == 0) { js_gl_color3ub(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i); return; }
        if (strcmp(method_name, "glColor4ub") == 0) { js_gl_color4ub(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i); return; }
        if (strcmp(method_name, "glNormal3f") == 0) { js_gl_normal3f(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f); return; }
        if (strcmp(method_name, "glMatrixMode") == 0) { js_gl_matrix_mode(thread->stack[0].i); return; }
        if (strcmp(method_name, "glLoadIdentity") == 0) { js_gl_load_identity(); return; }
        if (strcmp(method_name, "glPushMatrix") == 0) { js_gl_push_matrix(); return; }
        if (strcmp(method_name, "glPopMatrix") == 0) { js_gl_pop_matrix(); return; }
        if (strcmp(method_name, "glTranslatef") == 0) { js_gl_translatef(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f); return; }
        if (strcmp(method_name, "glRotatef") == 0) { js_gl_rotatef(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f, thread->stack[3].f); return; }
        if (strcmp(method_name, "glScalef") == 0) { js_gl_scalef(thread->stack[0].f, thread->stack[1].f, thread->stack[2].f); return; }
        if (strcmp(method_name, "glOrtho") == 0) { js_gl_ortho(thread->stack[0].d, thread->stack[1].d, thread->stack[2].d, thread->stack[3].d, thread->stack[4].d, thread->stack[5].d); return; }
        if (strcmp(method_name, "glFrustum") == 0) { js_gl_frustum(thread->stack[0].d, thread->stack[1].d, thread->stack[2].d, thread->stack[3].d, thread->stack[4].d, thread->stack[5].d); return; }
        if (strcmp(method_name, "glGetFloatv") == 0) { js_gl_get_floatv(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glGetIntegerv") == 0) { js_gl_get_integerv(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glGetString") == 0) { js_gl_get_string(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glGetError") == 0) { s4 r = js_gl_get_error(); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glNewList") == 0) { js_gl_new_list(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glEndList") == 0) { js_gl_end_list(); return; }
        if (strcmp(method_name, "glCallList") == 0) { js_gl_call_list(thread->stack[0].i); return; }
        if (strcmp(method_name, "glDeleteLists") == 0) { js_gl_delete_lists(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glGenLists") == 0) { s4 r = js_gl_gen_lists(thread->stack[0].i); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glIsList") == 0) { s4 r = js_gl_is_list(thread->stack[0].i); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glReadPixels") == 0) { js_gl_read_pixels(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i, thread->stack[4].i, thread->stack[5].i, (void *)(intptr_t)thread->stack[6].l); return; }
        if (strcmp(method_name, "glReadBuffer") == 0) { js_gl_read_buffer(thread->stack[0].i); return; }
        if (strcmp(method_name, "glBindFramebuffer") == 0) { js_gl_bind_framebuffer(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glGenFramebuffers") == 0) { js_gl_gen_framebuffers(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glDeleteFramebuffers") == 0) { js_gl_delete_framebuffers(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "glFramebufferTexture2D") == 0) { js_gl_framebuffer_texture2d(thread->stack[0].i, thread->stack[1].i, thread->stack[2].i, thread->stack[3].i, thread->stack[4].i); return; }
        if (strcmp(method_name, "glCheckFramebufferStatus") == 0) { s4 r = js_gl_check_framebuffer_status(thread->stack[0].i); jvm_push_int(thread, r); return; }
        if (strcmp(method_name, "glFogf") == 0) { js_fogf(thread->stack[0].i, thread->stack[1].f); return; }
        if (strcmp(method_name, "glFogi") == 0) { js_fogi(thread->stack[0].i, thread->stack[1].i); return; }
        if (strcmp(method_name, "glFogfv") == 0) { js_fogfv(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        return;
    }

    if (strcmp(class_name, "org/lwjgl/opengl/Display") == 0) {
        if (strcmp(method_name, "create") == 0) { js_create_window(854, 480, "Minecraft 1.16.5"); return; }
        if (strcmp(method_name, "swapBuffers") == 0) { js_swap_buffers(); return; }
        if (strcmp(method_name, "isCloseRequested") == 0) { jvm_push_int(thread, js_is_close_requested()); return; }
        if (strcmp(method_name, "setDisplayMode") == 0) { js_set_display_mode(854, 480); return; }
        if (strcmp(method_name, "setTitle") == 0) { return; }
        if (strcmp(method_name, "setResizable") == 0) { return; }
        if (strcmp(method_name, "isCreated") == 0) { jvm_push_int(thread, 1); return; }
        if (strcmp(method_name, "destroy") == 0) { return; }
        if (strcmp(method_name, "sync") == 0) { return; }
        if (strcmp(method_name, "setVSyncEnabled") == 0) { return; }
        if (strcmp(method_name, "getWidth") == 0) { jvm_push_int(thread, 854); return; }
        if (strcmp(method_name, "getHeight") == 0) { jvm_push_int(thread, 480); return; }
        return;
    }

    if (strcmp(class_name, "org/lwjgl/input/Keyboard") == 0) {
        if (strcmp(method_name, "isKeyDown") == 0) { jvm_push_int(thread, js_get_key_state(thread->stack[0].i)); return; }
        if (strcmp(method_name, "next") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventKey") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventState") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "isRepeatEvent") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "enableRepeatEvents") == 0) { return; }
        if (strcmp(method_name, "getEventCharacter") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getKeyName") == 0) { return; }
        if (strcmp(method_name, "getKeyCount") == 0) { jvm_push_int(thread, 256); return; }
        return;
    }

    if (strcmp(class_name, "org/lwjgl/input/Mouse") == 0) {
        if (strcmp(method_name, "isButtonDown") == 0) { jvm_push_int(thread, js_get_mouse_button(thread->stack[0].i)); return; }
        if (strcmp(method_name, "getX") == 0) { jvm_push_int(thread, js_get_mouse_x()); return; }
        if (strcmp(method_name, "getY") == 0) { jvm_push_int(thread, js_get_mouse_y()); return; }
        if (strcmp(method_name, "getDX") == 0) { jvm_push_int(thread, js_get_mouse_dx()); return; }
        if (strcmp(method_name, "getDY") == 0) { jvm_push_int(thread, js_get_mouse_dy()); return; }
        if (strcmp(method_name, "getDWheel") == 0) { jvm_push_int(thread, js_get_mouse_dwheel()); return; }
        if (strcmp(method_name, "setGrabbed") == 0) { js_set_mouse_grabbed(thread->stack[0].i); return; }
        if (strcmp(method_name, "isGrabbed") == 0) { jvm_push_int(thread, js_is_mouse_grabbed()); return; }
        if (strcmp(method_name, "next") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventButton") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventX") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventY") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventDX") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getEventDY") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "hasWheel") == 0) { jvm_push_int(thread, 1); return; }
        return;
    }

    if (strcmp(class_name, "org/lwjgl/opengl/ContextCapabilities") == 0) {
        if (strcmp(method_name, "getCapabilities") == 0) { return; }
        return;
    }

    if (strcmp(class_name, "org/lwjgl/openal/AL10") == 0) {
        if (strcmp(method_name, "alGenSources") == 0) { js_audio_al_gen_sources(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "alDeleteSources") == 0) { js_audio_al_delete_sources(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "alGenBuffers") == 0) { js_audio_al_gen_buffers(thread->stack[0].i, (void *)(intptr_t)thread->stack[1].i); return; }
        if (strcmp(method_name, "alDeleteBuffers") == 0) { return; }
        if (strcmp(method_name, "alBufferData") == 0) { js_audio_al_buffer_data(thread->stack[0].i, thread->stack[1].i, (void *)(intptr_t)thread->stack[2].i, thread->stack[3].i, thread->stack[4].i); return; }
        if (strcmp(method_name, "alSourcePlay") == 0) { js_audio_al_source_play(thread->stack[0].i); return; }
        if (strcmp(method_name, "alSourceStop") == 0) { js_audio_al_source_stop(thread->stack[0].i); return; }
        if (strcmp(method_name, "alSourcef") == 0) { js_audio_al_sourcef(thread->stack[0].i, thread->stack[1].i, thread->stack[2].f); return; }
        if (strcmp(method_name, "alGetError") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "alSourcei") == 0) { return; }
        if (strcmp(method_name, "alListener3f") == 0) { return; }
        return;
    }

    if (strcmp(class_name, "java/lang/System") == 0) {
        if (strcmp(method_name, "currentTimeMillis") == 0) { jvm_push_long(thread, (s8)js_current_time_millis()); return; }
        if (strcmp(method_name, "nanoTime") == 0) { jvm_push_long(thread, (s8)(js_current_time_millis() * 1000000.0)); return; }
        if (strcmp(method_name, "arraycopy") == 0) { return; }
        return;
    }

    if (strcmp(class_name, "java/lang/Thread") == 0) {
        if (strcmp(method_name, "currentThread") == 0) { return; }
        if (strcmp(method_name, "sleep") == 0) { return; }
        if (strcmp(method_name, "yield") == 0) { return; }
        return;
    }

    if (strcmp(class_name, "java/lang/Object") == 0) {
        if (strcmp(method_name, "hashCode") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "getClass") == 0) { return; }
        return;
    }

    if (strcmp(class_name, "java/lang/Class") == 0) {
        if (strcmp(method_name, "isAssignableFrom") == 0) { jvm_push_int(thread, 0); return; }
        if (strcmp(method_name, "desiredAssertionStatus") == 0) { jvm_push_int(thread, 0); return; }
        return;
    }

    if (strcmp(class_name, "java/lang/Math") == 0) {
        return;
    }

    if (strcmp(class_name, "org/lwjgl/BufferUtils") == 0) {
        return;
    }

    if (strcmp(class_name, "org/lwjgl/MemoryUtil") == 0) {
        return;
    }

    if (strcmp(class_name, "org/lwjgl/Sys") == 0) {
        if (strcmp(method_name, "getTimerResolution") == 0) { jvm_push_long(thread, 1000); return; }
        if (strcmp(method_name, "getTime") == 0) { jvm_push_long(thread, (s8)js_current_time_millis()); return; }
        return;
    }

    if (strcmp(class_name, "java/io/FileInputStream") == 0) {
        return;
    }
    if (strcmp(class_name, "java/io/FileOutputStream") == 0) {
        return;
    }
    if (strcmp(class_name, "java/io/RandomAccessFile") == 0) {
        return;
    }

    if (strcmp(class_name, "sun/misc/Unsafe") == 0) {
        if (strcmp(method_name, "allocateMemory") == 0) { return; }
        if (strcmp(method_name, "freeMemory") == 0) { return; }
        return;
    }

    if (strcmp(class_name, "java/security/AccessController") == 0) {
        return;
    }

    js_log(class_name);
    js_log(method_name);
}

void bridge_register_natives(void) {
}
