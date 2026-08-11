import { renderer } from './renderer.js';
import { audioManager } from './audio.js';
import { inputManager } from './input.js';
import { networkManager } from './network.js';

const Module = window.Module || {};

Module.preRun = [];
Module.postRun = [];
Module.print = (text) => console.log('[JVM]', text);
Module.printErr = (text) => console.error('[JVM]', text);

Module.TOTAL_MEMORY = 268435456;
Module.WASM_HAS_INIT = false;

Module.js_gl_clear = (mask) => renderer.clear(mask);
Module.js_gl_clear_color = (r, g, b, a) => renderer.clearColor(r, g, b, a);
Module.js_gl_viewport = (x, y, w, h) => renderer.viewport(x, y, w, h);
Module.js_gl_enable = (cap) => renderer.enable(cap);
Module.js_gl_disable = (cap) => renderer.disable(cap);
Module.js_gl_bind_texture = (target, tex) => renderer.bindTexture(target, tex);
Module.js_gl_gen_textures = (n, ptr) => renderer.genTextures(n, ptr);
Module.js_gl_delete_textures = (n, ptr) => renderer.deleteTextures(n, ptr);
Module.js_gl_tex_image_2d = (target, level, internal, w, h, border, format, type, pixels) =>
    renderer.texImage2D(target, level, internal, w, h, border, format, type, pixels);
Module.js_gl_draw_arrays = (mode, first, count) => renderer.drawArrays(mode, first, count);
Module.js_gl_draw_elements = (mode, count, type, offset) => renderer.drawElements(mode, count, type, offset);
Module.js_gl_create_shader = (type) => renderer.createShader(type);
Module.js_gl_shader_source = (shader, srcPtr) => renderer.shaderSource(shader, srcPtr);
Module.js_gl_compile_shader = (shader) => renderer.compileShader(shader);
Module.js_gl_create_program = () => renderer.createProgram();
Module.js_gl_attach_shader = (prog, shader) => renderer.attachShader(prog, shader);
Module.js_gl_link_program = (prog) => renderer.linkProgram(prog);
Module.js_gl_use_program = (prog) => renderer.useProgram(prog);
Module.js_gl_uniform_matrix4fv = (loc, count, transpose, valPtr) => renderer.uniformMatrix4fv(loc, count, transpose, valPtr);
Module.js_gl_get_uniform_location = (prog, namePtr) => renderer.getUniformLocation(prog, namePtr);
Module.js_gl_get_attrib_location = (prog, namePtr) => renderer.getAttribLocation(prog, namePtr);
Module.js_gl_vertex_attrib_pointer = (idx, size, type, norm, stride, ptr) =>
    renderer.vertexAttribPointer(idx, size, type, norm, stride, ptr);
Module.js_gl_enable_vertex_attrib = (idx) => renderer.enableVertexAttribArray(idx);
Module.js_gl_disable_vertex_attrib = (idx) => renderer.disableVertexAttribArray(idx);
Module.js_gl_buffer_data = (target, size, data, usage) => renderer.bufferData(target, size, data, usage);
Module.js_gl_buffer_sub_data = (target, offset, size, data) => renderer.bufferSubData(target, offset, size, data);
Module.js_gl_gen_buffers = (n, ptr) => renderer.genBuffers(n, ptr);
Module.js_gl_delete_buffers = (n, ptr) => renderer.deleteBuffers(n, ptr);
Module.js_gl_bind_buffer = (target, buf) => renderer.bindBuffer(target, buf);
Module.js_swap_buffers = () => renderer.swapBuffers();
Module.js_poll_events = () => 1;
Module.js_get_key_state = (key) => inputManager.isKeyDown(key);
Module.js_get_mouse_button = (btn) => inputManager.isMouseButtonDown(btn);
Module.js_get_mouse_x = () => inputManager.getMouseX();
Module.js_get_mouse_y = () => inputManager.getMouseY();
Module.js_create_window = (w, h, titlePtr) => {
    const title = Module.UTF8ToString(titlePtr);
    renderer.createWindow(w, h, title);
};
Module.js_set_display_mode = (w, h) => renderer.setDisplayMode(w, h);
Module.js_is_close_requested = () => 0;
Module.js_audio_init = () => audioManager.init();
Module.js_audio_play = (source, vol) => audioManager.play(source, vol);
Module.js_socket_connect = (hostPtr, port) => {
    const host = Module.UTF8ToString(hostPtr);
    networkManager.connect(host, port);
};
Module.js_socket_send = (dataPtr, len) => networkManager.send(dataPtr, len);
Module.js_socket_recv = (bufPtr, maxLen) => networkManager.receive(bufPtr, maxLen);
Module.js_socket_close = () => networkManager.close();
Module.js_log = (msgPtr) => console.log('[JVM]', Module.UTF8ToString(msgPtr));
Module.js_log_int = (val) => console.log('[JVM]', val);
Module.js_current_time_millis = () => performance.now();

Module.onRuntimeInitialized = () => {
    console.log('WASM JVM initialised');
    Module.WASM_HAS_INIT = true;

    const jvm_init = Module.cwrap('jvm_init', null, []);
    jvm_init();

    document.getElementById('status').textContent = 'JVM ready. Drag & drop Minecraft client JAR or load default.';
    document.getElementById('loader').style.display = 'none';

    window.loadJar = async (url) => {
        try {
            document.getElementById('status').textContent = 'Loading JAR...';
            const resp = await fetch(url);
            const buf = await resp.arrayBuffer();
            const data = new Uint8Array(buf);
            const ptr = Module._malloc(data.length);
            Module.HEAPU8.set(data, ptr);

            const jvm_load_class = Module.cwrap('jvm_load_class', 'number', ['number', 'number']);
            const idx = jvm_load_class(ptr, data.length);
            document.getElementById('status').textContent = `Loaded ${idx + 1} classes. Starting Minecraft...`;

            Module._free(ptr);

            runGameLoop();
        } catch (e) {
            document.getElementById('status').textContent = 'Error loading JAR: ' + e.message;
            console.error(e);
        }
    };

    window.loadJarFromArrayBuffer = (buf) => {
        const data = new Uint8Array(buf);
        const ptr = Module._malloc(data.length);
        Module.HEAPU8.set(data, ptr);
        const jvm_load_class = Module.cwrap('jvm_load_class', 'number', ['number', 'number']);
        const idx = jvm_load_class(ptr, data.length);
        document.getElementById('status').textContent = `Loaded JAR (index ${idx}). Starting main...`;
        Module._free(ptr);
        runGameLoop();
    };
};

window.runGameLoop = () => {
    renderer.init();

    const loop = () => {
        inputManager.poll();
        renderer.clear(0x00004000 | 0x00000100);
        renderer.swapBuffers();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

window.Module = Module;
