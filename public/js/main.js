import { renderer } from './renderer.js';
import { audioManager } from './audio.js';
import { inputManager } from './input.js';
import { networkManager } from './network.js';

const MC_JAR_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';

const Module = window.Module || {};

Module.preRun = [];
Module.postRun = [];
Module.print = (t) => console.log('[JVM]', t);
Module.printErr = (t) => console.error('[JVM]', t);

Module.TOTAL_MEMORY = 201326592;

function ptrToStr(ptr) { return Module.UTF8ToString ? Module.UTF8ToString(ptr) : ''; }
function setI32(ptr, v) { if (Module.setValue) Module.setValue(ptr, v, 'i32'); }
function getI32(ptr) { return Module.getValue ? Module.getValue(ptr, 'i32') : 0; }
function getF32(ptr) { return Module.getValue ? Module.getValue(ptr, 'float') : 0; }
function setF32(ptr, v) { if (Module.setValue) Module.setValue(ptr, v, 'float'); }

Module.js_gl_clear = (mask) => renderer.clear(mask);
Module.js_gl_clear_color = (r, g, b, a) => renderer.clearColor(r, g, b, a);
Module.js_gl_clear_depth = (d) => renderer.clearDepth(d);
Module.js_gl_clear_stencil = (s) => renderer.clearStencil(s);
Module.js_gl_viewport = (x, y, w, h) => renderer.viewport(x, y, w, h);
Module.js_gl_scissor = (x, y, w, h) => renderer.scissor(x, y, w, h);
Module.js_gl_enable = (cap) => renderer.enable(cap);
Module.js_gl_disable = (cap) => renderer.disable(cap);
Module.js_gl_blend_func = (s, d) => renderer.blendFunc(s, d);
Module.js_gl_depth_func = (f) => renderer.depthFunc(f);
Module.js_gl_depth_mask = (f) => renderer.depthMask(f);
Module.js_gl_color_mask = (r, g, b, a) => renderer.colorMask(r, g, b, a);
Module.js_gl_cull_face = (m) => renderer.cullFace(m);
Module.js_gl_front_face = (m) => renderer.frontFace(m);
Module.js_gl_shade_model = (m) => renderer.shadeModel(m);
Module.js_gl_polygon_offset = (f, u) => renderer.polygonOffset(f, u);
Module.js_gl_line_width = (w) => renderer.lineWidth(w);
Module.js_gl_point_size = (s) => renderer.pointSize(s);
Module.js_gl_alpha_func = (f, ref) => renderer.alphaFunc(f, ref);
Module.js_gl_active_texture = (t) => renderer.activeTexture(t);
Module.js_gl_bind_texture = (target, tex) => renderer.bindTexture(target, tex);
Module.js_gl_gen_textures = (n, ptr) => renderer.genTextures(n, ptr);
Module.js_gl_delete_textures = (n, ptr) => renderer.deleteTextures(n, ptr);
Module.js_gl_tex_parameteri = (target, pname, param) => renderer.texParameteri(target, pname, param);
Module.js_gl_tex_parameterf = (target, pname, param) => renderer.texParameteri(target, pname, param);
Module.js_gl_tex_image_2d = (target, level, internal, w, h, border, format, type, pixels) =>
    renderer.texImage2D(target, level, internal, w, h, border, format, type, pixels);
Module.js_gl_tex_sub_image_2d = (target, level, xoff, yoff, w, h, format, type, pixels) =>
    renderer.texSubImage2D(target, level, xoff, yoff, w, h, format, type, pixels);
Module.js_gl_copy_tex_sub_image_2d = (target, level, xoff, yoff, x, y, w, h) =>
    renderer.copyTexSubImage2D(target, level, xoff, yoff, x, y, w, h);
Module.js_gl_generate_mipmap = (target) => renderer.generateMipmap(target);
Module.js_gl_pixel_storei = (p, v) => renderer.pixelStorei(p, v);
Module.js_gl_draw_arrays = (mode, first, count) => renderer.drawArrays(mode, first, count);
Module.js_gl_draw_elements = (mode, count, type, offset) => renderer.drawElements(mode, count, type, offset);
Module.js_gl_gen_buffers = (n, ptr) => renderer.genBuffers(n, ptr);
Module.js_gl_delete_buffers = (n, ptr) => renderer.deleteBuffers(n, ptr);
Module.js_gl_bind_buffer = (target, buf) => renderer.bindBuffer(target, buf);
Module.js_gl_buffer_data = (target, size, data, usage) => renderer.bufferData(target, size, data, usage);
Module.js_gl_buffer_sub_data = (target, offset, size, data) => renderer.bufferSubData(target, offset, size, data);
Module.js_gl_create_shader = (type) => renderer.createShader(type);
Module.js_gl_shader_source = (shader, ptr) => renderer.shaderSource(shader, ptr);
Module.js_gl_compile_shader = (shader) => renderer.compileShader(shader);
Module.js_gl_create_program = () => renderer.createProgram();
Module.js_gl_attach_shader = (prog, shader) => renderer.attachShader(prog, shader);
Module.js_gl_link_program = (prog) => renderer.linkProgram(prog);
Module.js_gl_use_program = (prog) => renderer.useProgram(prog);
Module.js_gl_get_uniform_location = (prog, namePtr) => renderer.getUniformLocation(prog, namePtr);
Module.js_gl_get_attrib_location = (prog, namePtr) => renderer.getAttribLocation(prog, namePtr);
Module.js_gl_uniform1i = (loc, v) => renderer.uniform1i(loc, v);
Module.js_gl_uniform1f = (loc, v) => renderer.uniform1f(loc, v);
Module.js_gl_uniform2f = (loc, x, y) => renderer.uniform2f(loc, x, y);
Module.js_gl_uniform3f = (loc, x, y, z) => renderer.uniform3f(loc, x, y, z);
Module.js_gl_uniform4f = (loc, x, y, z, w) => renderer.uniform4f(loc, x, y, z, w);
Module.js_gl_uniform_matrix4fv = (loc, count, transpose, ptr) => renderer.uniformMatrix4fv(loc, count, transpose, ptr);
Module.js_gl_vertex_attrib_pointer = (idx, size, type, norm, stride, ptr) =>
    renderer.vertexAttribPointer(idx, size, type, norm, stride, ptr);
Module.js_gl_enable_vertex_attrib = (idx) => renderer.enableVertexAttribArray(idx);
Module.js_gl_disable_vertex_attrib = (idx) => renderer.disableVertexAttribArray(idx);

Module.js_gl_begin = (mode) => renderer.begin(mode);
Module.js_gl_end = () => renderer.end();
Module.js_gl_vertex2f = (x, y) => renderer.vertex2f(x, y);
Module.js_gl_vertex3f = (x, y, z) => renderer.vertex3f(x, y, z);
Module.js_gl_vertex2fv = (ptr) => renderer.vertex2fv(ptr);
Module.js_gl_vertex3fv = (ptr) => renderer.vertex3fv(ptr);
Module.js_gl_tex_coord2f = (u, v) => renderer.texCoord2f(u, v);
Module.js_gl_color3f = (r, g, b) => renderer.color3f(r, g, b);
Module.js_gl_color4f = (r, g, b, a) => renderer.color4f(r, g, b, a);
Module.js_gl_color3ub = (r, g, b) => renderer.color3ub(r, g, b);
Module.js_gl_color4ub = (r, g, b, a) => renderer.color4ub(r, g, b, a);
Module.js_gl_normal3f = (x, y, z) => renderer.normal3f(x, y, z);

Module.js_gl_matrix_mode = (mode) => renderer.matrixMode(mode);
Module.js_gl_load_identity = () => renderer.loadIdentity();
Module.js_gl_push_matrix = () => renderer.pushMatrix();
Module.js_gl_pop_matrix = () => renderer.popMatrix();
Module.js_gl_translatef = (x, y, z) => renderer.translatef(x, y, z);
Module.js_gl_rotatef = (a, x, y, z) => renderer.rotatef(a, x, y, z);
Module.js_gl_scalef = (x, y, z) => renderer.scalef(x, y, z);
Module.js_gl_ortho = (l, r, b, t, n, f) => renderer.ortho(l, r, b, t, n, f);
Module.js_gl_frustum = (l, r, b, t, n, f) => renderer.frustum(l, r, b, t, n, f);

Module.js_gl_get_floatv = (pname, ptr) => renderer.getFloatv(pname, ptr);
Module.js_gl_get_integerv = (pname, ptr) => renderer.getIntegerv(pname, ptr);
Module.js_gl_get_string = (name, ptr) => { const s = renderer.getString(name); if (ptr && s) Module.stringToUTF8 ? Module.stringToUTF8(s, ptr, s.length) : null; };
Module.js_gl_get_error = () => renderer.getError();

Module.js_gl_new_list = (list, mode) => renderer.newList(list, mode);
Module.js_gl_end_list = () => renderer.endList();
Module.js_gl_call_list = (list) => renderer.callList(list);
Module.js_gl_delete_lists = (list, range) => renderer.deleteLists(list, range);
Module.js_gl_gen_lists = (range) => renderer.genLists(range);
Module.js_gl_is_list = (list) => renderer.isList(list) ? 1 : 0;

Module.js_gl_read_pixels = (x, y, w, h, format, type, pixels) => renderer.readPixels(x, y, w, h, format, type, pixels);
Module.js_gl_read_buffer = (mode) => renderer.readBuffer(mode);
Module.js_gl_bind_framebuffer = (target, fb) => renderer.bindFramebuffer(target, fb);
Module.js_gl_gen_framebuffers = (n, ptr) => renderer.genFramebuffers(n, ptr);
Module.js_gl_delete_framebuffers = (n, ptr) => renderer.deleteFramebuffers(n, ptr);
Module.js_gl_framebuffer_texture2d = (target, att, textarget, tex, level) => renderer.framebufferTexture2D(target, att, textarget, tex, level);
Module.js_gl_check_framebuffer_status = (target) => renderer.checkFramebufferStatus(target);

Module.js_swap_buffers = () => renderer.swapBuffers();
Module.js_is_close_requested = () => renderer.isCloseRequested() ? 1 : 0;

Module.js_create_window = (w, h, titlePtr) => { renderer.createWindow(w, h, ptrToStr(titlePtr)); };
Module.js_set_display_mode = (w, h) => renderer.setDisplayMode(w, h);

Module.js_get_key_state = (key) => inputManager.isKeyDown(key);
Module.js_get_mouse_button = (btn) => inputManager.isMouseButtonDown(btn);
Module.js_get_mouse_x = () => inputManager.getMouseX();
Module.js_get_mouse_y = () => inputManager.getMouseY();
Module.js_get_mouse_dx = () => inputManager.getDX();
Module.js_get_mouse_dy = () => inputManager.getDY();
Module.js_get_mouse_dwheel = () => inputManager.getDWheel();
Module.js_set_mouse_grabbed = (g) => inputManager.setGrabbed(g);
Module.js_is_mouse_grabbed = () => inputManager.isGrabbed() ? 1 : 0;

Module.js_poll_events = () => 1;
Module.js_keyboard_next = () => 0;
Module.js_keyboard_get_event_key = () => 0;
Module.js_keyboard_get_event_state = () => 0;
Module.js_mouse_next = () => 0;

Module.js_audio_init = () => audioManager.init() ? 1 : 0;
Module.js_audio_play = (source, vol) => audioManager.play(source, vol);
Module.js_audio_stop = (source) => audioManager.stop(source);
Module.js_audio_set_volume = (source, vol) => audioManager.setVolume(source, vol);
Module.js_audio_al_gen_sources = (n, ptr) => { for (let i = 0; i < n; i++) { audioManager.createSourceFromId(i + 1); setI32(ptr + i * 4, i + 1); } };
Module.js_audio_al_delete_sources = (n, ptr) => { for (let i = 0; i < n; i++) audioManager.deleteSource(getI32(ptr + i * 4)); };
Module.js_audio_al_gen_buffers = (n, ptr) => { for (let i = 0; i < n; i++) setI32(ptr + i * 4, i + 1); };
Module.js_audio_al_buffer_data = (bufferId, format, dataPtr, size, freq) => { audioManager.createBufferFromData(bufferId, dataPtr, size, freq, 16); };
Module.js_audio_al_source_play = (sourceId) => { audioManager.play(sourceId, 1.0); };
Module.js_audio_al_source_stop = (sourceId) => { audioManager.stop(sourceId); };
Module.js_audio_al_sourcef = (sourceId, param, val) => {};
Module.js_audio_al_get_error = () => 0;

Module.js_socket_connect = (hostPtr, port) => { networkManager.connect(ptrToStr(hostPtr), port); };
Module.js_socket_send = (dataPtr, len) => networkManager.send(dataPtr, len);
Module.js_socket_recv = (bufPtr, maxLen) => networkManager.receive(bufPtr, maxLen);
Module.js_socket_close = () => networkManager.close();
Module.js_socket_available = () => networkManager.available();

Module.js_log = (msgPtr) => console.log('[JVM]', ptrToStr(msgPtr));
Module.js_log_int = (val) => console.log('[JVM]', val);
Module.js_current_time_millis = () => performance.now();

Module.js_fogf = (pname, val) => {
    router.fogf(pname, val);
};
Module.js_fogi = (pname, val) => {
    router.fogi(pname, val);
};
Module.js_fogfv = (pname, ptr) => {
    router.fogfv(pname, ptr);
};

const router = {
    fogf(pname, val) {
        switch (pname) {
            case 0x0B62: renderer.fogDensity = val; break;
            case 0x0B63: renderer.fogStart = val; break;
            case 0x0B64: renderer.fogEnd = val; break;
        }
    },
    fogi(pname, val) {
        switch (pname) {
            case 0x0B65: renderer.fogMode = val; break;
        }
    },
    fogfv(pname, ptr) {
        switch (pname) {
            case 0x0B66: renderer.fogColor = [getF32(ptr), getF32(ptr+4), getF32(ptr+8), getF32(ptr+12)]; break;
        }
    }
};

Module._nativeCall = (classPtr, methodPtr, descPtr) => {
    const cls = ptrToStr(classPtr);
    const method = ptrToStr(methodPtr);
    const desc = ptrToStr(descPtr);
    console.log('[NATIVE]', cls + '.' + method + desc);
};

window.Module = Module;
window._renderer = renderer;
window._audio = audioManager;
window._input = inputManager;
window._network = networkManager;

Module.onRuntimeInitialized = () => {
    console.log('WASM JVM initialised. Fetching Minecraft JAR...');
    document.getElementById('status').textContent = 'JVM ready. Downloading Minecraft 1.16.5...';
    document.getElementById('status-percent').textContent = '';

    const jvm_init = Module.cwrap('jvm_init', null, []);
    jvm_init();

    fetchMinecraftJar();
};

async function fetchMinecraftJar() {
    try {
        const status = document.getElementById('status');
        const percent = document.getElementById('status-percent');
        status.textContent = 'Downloading Minecraft 1.16.5 client...';

        const resp = await fetch(MC_JAR_URL);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        const total = parseInt(resp.headers.get('content-length') || '0');
        const reader = resp.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            if (total > 0) {
                const pct = Math.round((received / total) * 100);
                percent.textContent = pct + '%';
            }
        }

        const buf = new Uint8Array(received);
        let pos = 0;
        for (const chunk of chunks) {
            buf.set(chunk, pos);
            pos += chunk.length;
        }

        status.textContent = 'JAR downloaded. Loading classes...';
        percent.textContent = '';

        const ptr = Module._malloc(buf.length);
        Module.HEAPU8.set(buf, ptr);
        const jvm_load_class = Module.cwrap('jvm_load_class', 'number', ['number', 'number']);
        const idx = jvm_load_class(ptr, buf.length);
        Module._free(ptr);

        status.textContent = 'Minecraft loaded. Starting game...';
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
            startGameLoop();
        }, 500);
    } catch (e) {
        document.getElementById('status').textContent = 'Download failed: ' + e.message;
        console.error(e);
        const manual = document.getElementById('manual-load');
        if (manual) manual.style.display = 'block';
    }
}

function startGameLoop() {
    renderer.init();
    audioManager.init();

    const loop = () => {
        inputManager.poll();
        renderer.clear(0x4000 | 0x100);
        renderer.swapBuffers();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

window.fetchMinecraftJar = fetchMinecraftJar;
window.startGameLoop = startGameLoop;
