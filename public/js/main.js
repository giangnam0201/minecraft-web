import { renderer } from './renderer.js';
import { audioManager } from './audio.js';
import { inputManager } from './input.js';
import { networkManager } from './network.js';

const MC_JAR_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';

const Module = window.Module || {};
Module.print = (t) => console.log('[JVM]', t);
Module.printErr = (t) => console.error('[JVM]', t);
const jarResources = new Map();
let jarBytes = null;
let jvmRunning = false;

function ptrToStr(p) { return Module.UTF8ToString ? Module.UTF8ToString(p) : ''; }
function setI32(p, v) { if (Module.setValue) Module.setValue(p, v, 'i32'); }
function getI32(p) { return Module.getValue ? Module.getValue(p, 'i32') : 0; }
function getF32(p) { return Module.getValue ? Module.getValue(p, 'float') : 0; }

// --- GL bridge ---
Module.js_gl_clear = (m) => renderer.clear(m);
Module.js_gl_clear_color = (r,g,b,a) => renderer.clearColor(r,g,b,a);
Module.js_gl_clear_depth = (d) => renderer.clearDepth(d);
Module.js_gl_clear_stencil = (s) => renderer.clearStencil(s);
Module.js_gl_viewport = (x,y,w,h) => renderer.viewport(x,y,w,h);
Module.js_gl_scissor = (x,y,w,h) => renderer.scissor(x,y,w,h);
Module.js_gl_enable = (c) => renderer.enable(c);
Module.js_gl_disable = (c) => renderer.disable(c);
Module.js_gl_blend_func = (s,d) => renderer.blendFunc(s,d);
Module.js_gl_depth_func = (f) => renderer.depthFunc(f);
Module.js_gl_depth_mask = (f) => renderer.depthMask(f);
Module.js_gl_color_mask = (r,g,b,a) => renderer.colorMask(r,g,b,a);
Module.js_gl_cull_face = (m) => renderer.cullFace(m);
Module.js_gl_front_face = (m) => renderer.frontFace(m);
Module.js_gl_shade_model = (m) => renderer.shadeModel(m);
Module.js_gl_polygon_offset = (f,u) => renderer.polygonOffset(f,u);
Module.js_gl_line_width = (w) => renderer.lineWidth(w);
Module.js_gl_point_size = (s) => renderer.pointSize(s);
Module.js_gl_alpha_func = (f,ref) => renderer.alphaFunc(f,ref);
Module.js_gl_active_texture = (t) => renderer.activeTexture(t);
Module.js_gl_bind_texture = (tgt,tex) => renderer.bindTexture(tgt,tex);
Module.js_gl_gen_textures = (n,p) => renderer.genTextures(n,p);
Module.js_gl_delete_textures = (n,p) => renderer.deleteTextures(n,p);
Module.js_gl_tex_parameteri = (t,pn,pv) => renderer.texParameteri(t,pn,pv);
Module.js_gl_tex_parameterf = (t,pn,pv) => renderer.texParameteri(t,pn,pv);
Module.js_gl_tex_image_2d = (t,l,i,w,h,b,fmt,typ,p) => renderer.texImage2D(t,l,i,w,h,b,fmt,typ,p);
Module.js_gl_tex_sub_image_2d = (t,l,x,y,w,h,fmt,typ,p) => renderer.texSubImage2D(t,l,x,y,w,h,fmt,typ,p);
Module.js_gl_copy_tex_sub_image_2d = (t,l,x,y,xx,yy,w,h) => renderer.copyTexSubImage2D(t,l,x,y,xx,yy,w,h);
Module.js_gl_generate_mipmap = (t) => renderer.generateMipmap(t);
Module.js_gl_pixel_storei = (p,v) => renderer.pixelStorei(p,v);
Module.js_gl_draw_arrays = (m,f,c) => renderer.drawArrays(m,f,c);
Module.js_gl_draw_elements = (m,c,t,o) => renderer.drawElements(m,c,t,o);
Module.js_gl_gen_buffers = (n,p) => renderer.genBuffers(n,p);
Module.js_gl_delete_buffers = (n,p) => renderer.deleteBuffers(n,p);
Module.js_gl_bind_buffer = (t,b) => renderer.bindBuffer(t,b);
Module.js_gl_buffer_data = (t,s,d,u) => renderer.bufferData(t,s,d,u);
Module.js_gl_buffer_sub_data = (t,o,s,d) => renderer.bufferSubData(t,o,s,d);
Module.js_gl_create_shader = (t) => { const r=renderer.createShader(t); return r; };
Module.js_gl_shader_source = (s,p) => renderer.shaderSource(s,p);
Module.js_gl_compile_shader = (s) => renderer.compileShader(s);
Module.js_gl_create_program = () => { const r=renderer.createProgram(); return r; };
Module.js_gl_attach_shader = (p,s) => renderer.attachShader(p,s);
Module.js_gl_link_program = (p) => renderer.linkProgram(p);
Module.js_gl_use_program = (p) => renderer.useProgram(p);
Module.js_gl_get_uniform_location = (p,n) => renderer.getUniformLocation(p,n);
Module.js_gl_get_attrib_location = (p,n) => renderer.getAttribLocation(p,n);
Module.js_gl_uniform1i = (l,v) => renderer.uniform1i(l,v);
Module.js_gl_uniform1f = (l,v) => renderer.uniform1f(l,v);
Module.js_gl_uniform2f = (l,x,y) => renderer.uniform2f(l,x,y);
Module.js_gl_uniform3f = (l,x,y,z) => renderer.uniform3f(l,x,y,z);
Module.js_gl_uniform4f = (l,x,y,z,w) => renderer.uniform4f(l,x,y,z,w);
Module.js_gl_uniform_matrix4fv = (l,c,t,p) => renderer.uniformMatrix4fv(l,c,t,p);
Module.js_gl_vertex_attrib_pointer = (i,s,t,n,str,p) => renderer.vertexAttribPointer(i,s,t,n,str,p);
Module.js_gl_enable_vertex_attrib = (i) => renderer.enableVertexAttribArray(i);
Module.js_gl_disable_vertex_attrib = (i) => renderer.disableVertexAttribArray(i);
Module.js_gl_begin = (m) => renderer.begin(m);
Module.js_gl_end = () => renderer.end();
Module.js_gl_vertex2f = (x,y) => renderer.vertex2f(x,y);
Module.js_gl_vertex3f = (x,y,z) => renderer.vertex3f(x,y,z);
Module.js_gl_vertex2fv = (p) => renderer.vertex2fv(p);
Module.js_gl_vertex3fv = (p) => renderer.vertex3fv(p);
Module.js_gl_tex_coord2f = (u,v) => renderer.texCoord2f(u,v);
Module.js_gl_color3f = (r,g,b) => renderer.color3f(r,g,b);
Module.js_gl_color4f = (r,g,b,a) => renderer.color4f(r,g,b,a);
Module.js_gl_color3ub = (r,g,b) => renderer.color3ub(r,g,b);
Module.js_gl_color4ub = (r,g,b,a) => renderer.color4ub(r,g,b,a);
Module.js_gl_normal3f = (x,y,z) => renderer.normal3f(x,y,z);
Module.js_gl_matrix_mode = (m) => renderer.matrixMode(m);
Module.js_gl_load_identity = () => renderer.loadIdentity();
Module.js_gl_push_matrix = () => renderer.pushMatrix();
Module.js_gl_pop_matrix = () => renderer.popMatrix();
Module.js_gl_translatef = (x,y,z) => renderer.translatef(x,y,z);
Module.js_gl_rotatef = (a,x,y,z) => renderer.rotatef(a,x,y,z);
Module.js_gl_scalef = (x,y,z) => renderer.scalef(x,y,z);
Module.js_gl_ortho = (l,r,b,t,n,f) => renderer.ortho(l,r,b,t,n,f);
Module.js_gl_frustum = (l,r,b,t,n,f) => renderer.frustum(l,r,b,t,n,f);
Module.js_gl_get_floatv = (p,v) => renderer.getFloatv(p,v);
Module.js_gl_get_integerv = (p,v) => renderer.getIntegerv(p,v);
Module.js_gl_get_string = (n,p) => { const s=renderer.getString(n); if(p&&s&&Module.stringToUTF8) Module.stringToUTF8(s,p,s.length); };
Module.js_gl_get_error = () => renderer.getError();
Module.js_gl_new_list = (l,m) => renderer.newList(l,m);
Module.js_gl_end_list = () => renderer.endList();
Module.js_gl_call_list = (l) => renderer.callList(l);
Module.js_gl_delete_lists = (l,r) => renderer.deleteLists(l,r);
Module.js_gl_gen_lists = (r) => renderer.genLists(r);
Module.js_gl_is_list = (l) => renderer.isList(l) ? 1 : 0;
Module.js_gl_read_pixels = (x,y,w,h,f,t,p) => renderer.readPixels(x,y,w,h,f,t,p);
Module.js_gl_read_buffer = (m) => renderer.readBuffer(m);
Module.js_gl_bind_framebuffer = (t,fb) => renderer.bindFramebuffer(t,fb);
Module.js_gl_gen_framebuffers = (n,p) => renderer.genFramebuffers(n,p);
Module.js_gl_delete_framebuffers = (n,p) => renderer.deleteFramebuffers(n,p);
Module.js_gl_framebuffer_texture2d = (t,a,tt,tx,l) => renderer.framebufferTexture2D(t,a,tt,tx,l);
Module.js_gl_check_framebuffer_status = (t) => renderer.checkFramebufferStatus(t);
Module.js_fogf = (p,v) => { if(p===0xB62)renderer.fogDensity=v; else if(p===0xB63)renderer.fogStart=v; else if(p===0xB64)renderer.fogEnd=v; };
Module.js_fogi = (p,v) => { if(p===0xB65)renderer.fogMode=v; };
Module.js_fogfv = (p,v) => { if(p===0xB66){ renderer.fogColor=[getF32(v),getF32(v+4),getF32(v+8),getF32(v+12)]; } };
Module.js_swap_buffers = () => {};
Module.js_is_close_requested = () => 0;
Module.js_create_window = (w,h,p) => renderer.createWindow(w,h,ptrToStr(p));
Module.js_set_display_mode = (w,h) => renderer.setDisplayMode(w,h);
Module.js_get_key_state = (k) => inputManager.isKeyDown(k);
Module.js_get_mouse_button = (b) => inputManager.isMouseButtonDown(b);
Module.js_get_mouse_x = () => inputManager.getMouseX();
Module.js_get_mouse_y = () => inputManager.getMouseY();
Module.js_get_mouse_dx = () => inputManager.getDX();
Module.js_get_mouse_dy = () => inputManager.getDY();
Module.js_get_mouse_dwheel = () => inputManager.getDWheel();
Module.js_set_mouse_grabbed = (g) => inputManager.setGrabbed(g);
Module.js_is_mouse_grabbed = () => inputManager.isGrabbed()?1:0;
Module.js_poll_events = () => 1;
Module.js_audio_init = () => audioManager.init()?1:0;
Module.js_audio_play = (s,v) => audioManager.play(s,v);
Module.js_audio_stop = (s) => audioManager.stop(s);
Module.js_audio_set_volume = (s,v) => audioManager.setVolume(s,v);
Module.js_audio_al_gen_sources = (n,p) => { for(let i=0;i<n;i++){audioManager.createSourceFromId(i+1);setI32(p+i*4,i+1);} };
Module.js_audio_al_delete_sources = (n,p) => { for(let i=0;i<n;i++)audioManager.deleteSource(getI32(p+i*4)); };
Module.js_audio_al_gen_buffers = (n,p) => { for(let i=0;i<n;i++)setI32(p+i*4,i+1); };
Module.js_audio_al_buffer_data = (b,f,d,s,r) => audioManager.createBufferFromData(b,d,s,r,16);
Module.js_audio_al_source_play = (s) => audioManager.play(s,1.0);
Module.js_audio_al_source_stop = (s) => audioManager.stop(s);
Module.js_audio_al_sourcef = (s,p,v) => {};
Module.js_audio_al_get_error = () => 0;
Module.js_socket_connect = (h,p) => networkManager.connect(ptrToStr(h),p);
Module.js_socket_send = (d,l) => networkManager.send(d,l);
Module.js_socket_recv = (b,m) => networkManager.receive(b,m);
Module.js_socket_close = () => networkManager.close();
Module.js_socket_available = () => networkManager.available();
Module.js_log = (m) => console.log('[JVM]',ptrToStr(m));
Module.js_log_int = (v) => console.log('[JVM]',v);
Module.js_current_time_millis = () => performance.now();
Module.js_resource_exists = (p) => jarResources.has(ptrToStr(p)) ? 1 : 0;
Module.js_resource_read = (p, b, m) => { const d=jarResources.get(ptrToStr(p)); if(!d)return 0; const l=Math.min(d.length,m); Module.HEAPU8.set(d.subarray(0,l),b); return l; };
Module.js_resource_size = (p) => { const d=jarResources.get(ptrToStr(p)); return d?d.length:-1; };

window.Module = Module;

// --- init ---
Module.onRuntimeInitialized = () => {
    console.log('WASM JVM initialised');
    document.getElementById('status').textContent = 'JVM ready. Click anywhere to start downloading Minecraft...';
    document.getElementById('loader').style.cursor = 'pointer';
    document.getElementById('loader').onclick = startEverything;
};

function startEverything() {
    document.getElementById('loader').onclick = null;
    document.getElementById('loader').style.cursor = 'default';
    const jvm_init = Module.cwrap('jvm_init', null, []);
    jvm_init();
    fetchMinecraftJar();
}

async function fetchMinecraftJar() {
    try {
        const status = document.getElementById('status');
        const percent = document.getElementById('status-percent');
        status.textContent = 'Downloading Minecraft 1.16.5...';
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
            if (total > 0) percent.textContent = Math.round((received / total) * 100) + '%';
        }
        jarBytes = new Uint8Array(received);
        let pos = 0;
        for (const c of chunks) { jarBytes.set(c, pos); pos += c.length; }
        status.textContent = 'Parsing JAR...';
        percent.textContent = '';
        await parseJarAndLoadClasses(jarBytes);
    } catch (e) {
        document.getElementById('status').textContent = 'Download failed: ' + e.message;
        console.error(e);
        document.getElementById('manual-load').style.display = 'block';
    }
}

async function inflateZIP(compressed) {
    for (const fmt of ['deflate', 'deflate-raw']) {
        try {
            const ds = new DecompressionStream(fmt);
            const writer = ds.writable.getWriter();
            const reader = ds.readable.getReader();
            writer.write(compressed);
            writer.close();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            const total = chunks.reduce((s, c) => s + c.length, 0);
            const result = new Uint8Array(total);
            let off = 0;
            for (const c of chunks) { result.set(c, off); off += c.length; }
            return result;
        } catch (e) {}
    }
    return null;
}

function findNextLocalHeader(data, start) {
    for (let i = start; i < data.length - 4; i++) {
        if (data[i] === 0x50 && data[i+1] === 0x4B && data[i+2] === 0x03 && data[i+3] === 0x04) return i;
    }
    return data.length;
}

async function parseJarAndLoadClasses(data) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const jvm_load_class = Module.cwrap('jvm_load_class', 'number', ['number', 'number']);
    let pos = 0;
    let classCount = 0;
    let resourceCount = 0;
    const status = document.getElementById('status');
    const percent = document.getElementById('status-percent');

    while (pos < data.length - 30) {
        if (view.getUint32(pos, true) !== 0x04034b50) { pos++; continue; }
        const flags = view.getUint16(pos + 6, true);
        const comp = view.getUint16(pos + 8, true);
        let compSize = view.getUint32(pos + 18, true);
        let uncompSize = view.getUint32(pos + 22, true);
        const nameLen = view.getUint16(pos + 26, true);
        const extraLen = view.getUint16(pos + 28, true);
        const name = new TextDecoder().decode(data.subarray(pos + 30, pos + 30 + nameLen));
        const fileStart = pos + 30 + nameLen + extraLen;

        if ((flags & 0x0008) && compSize === 0) {
            const nextHeader = findNextLocalHeader(data, fileStart);
            compSize = nextHeader - fileStart;
            if (compSize <= 0) { pos = nextHeader; continue; }
        }

        const isClass = name.endsWith('.class');
        const isResource = !name.endsWith('/') && !name.startsWith('META-INF');

        if (isClass || isResource) {
            let fileData;
            if (comp === 0) {
                fileData = data.subarray(fileStart, fileStart + uncompSize);
            } else {
                const raw = data.subarray(fileStart, fileStart + compSize);
                fileData = await inflateZIP(new Uint8Array(raw));
                if (!fileData) { pos = fileStart + compSize; continue; }
            }

            if (isClass) {
                const ptr = Module._malloc(fileData.length);
                Module.HEAPU8.set(fileData, ptr);
                jvm_load_class(ptr, fileData.length);
                Module._free(ptr);
                classCount++;
            } else if (isResource) {
                jarResources.set(name, fileData);
                resourceCount++;
            }
        }

        pos = fileStart + (comp > 0 ? compSize : uncompSize);
        if (classCount % 100 === 0) {
            status.textContent = 'Loading: ' + classCount + ' classes...';
            percent.textContent = resourceCount + ' resources';
            await new Promise(r => setTimeout(r, 0));
        }
    }

    status.textContent = 'Loaded ' + classCount + ' classes, ' + resourceCount + ' resources. Starting Minecraft...';
    percent.textContent = '';

    document.getElementById('loader').style.display = 'none';
    renderer.init();
    audioManager.init();

    runMinecraftMain();
}

function runMinecraftMain() {
    console.log('Looking for net/minecraft/client/main/Main...');
    const jvm_find_class = Module.cwrap('jvm_find_class', 'number', ['string']);
    const jvm_invoke_static = Module.cwrap('jvm_invoke_static', null, ['number', 'string', 'string']);

    const mainClassPtr = jvm_find_class('net/minecraft/client/main/Main');
    console.log('Main class pointer:', mainClassPtr);

    if (mainClassPtr) {
        console.log('Invoking Main.main([String])...');
        try {
            jvm_invoke_static(mainClassPtr, 'main', '([Ljava/lang/String;)V');
        } catch (e) {
            console.error('JVM execution error:', e);
        }
    } else {
        console.log('Main class not found, trying alternate names...');
        const alts = [
            'net/minecraft/client/Minecraft',
            'net/minecraft/client/main/Main',
            'net/minecraft/bundler/Main',
        ];
        for (const alt of alts) {
            const p = jvm_find_class(alt);
            if (p) {
                console.log('Found:', alt);
                jvm_invoke_static(p, 'main', '([Ljava/lang/String;)V');
                return;
            }
        }
        console.error('Could not find Minecraft main class');
    }
}

window.runMinecraftMain = runMinecraftMain;
