import { renderer } from './renderer.js';
import { audioManager } from './audio.js';
import { inputManager } from './input.js';

const Module = window.Module;
let jvmLoadBlob, jvmFindClass, jvmInvokeStatic;

const ps = p => Module.UTF8ToString ? Module.UTF8ToString(p) : '';

function bridge() {
    const M = Module;
    M.js_gl_clear = m => renderer.clear(m);
    M.js_gl_clear_color = (r,g,b,a) => renderer.clearColor(r,g,b,a);
    M.js_gl_viewport = (x,y,w,h) => renderer.viewport(x,y,w,h);
    M.js_gl_enable = c => renderer.enable(c);
    M.js_gl_disable = c => renderer.disable(c);
    M.js_gl_bind_texture = (t,tex) => renderer.bindTexture(t,tex);
    M.js_gl_gen_textures = (n,p) => renderer.genTextures(n,p);
    M.js_gl_delete_textures = (n,p) => renderer.deleteTextures(n,p);
    M.js_gl_tex_image_2d = (t,l,i,w,h,b,f,ty,p) => renderer.texImage2D(t,l,i,w,h,b,f,ty,p);
    M.js_gl_draw_arrays = (m,f,c) => renderer.drawArrays(m,f,c);
    M.js_gl_gen_buffers = (n,p) => renderer.genBuffers(n,p);
    M.js_gl_bind_buffer = (t,b) => renderer.bindBuffer(t,b);
    M.js_gl_buffer_data = (t,s,d,u) => renderer.bufferData(t,s,d,u);
    M.js_gl_buffer_sub_data = (t,o,s,d) => renderer.bufferSubData(t,o,s,d);
    M.js_gl_begin = m => renderer.begin(m);
    M.js_gl_end = () => renderer.end();
    M.js_gl_vertex2f = (x,y) => renderer.vertex2f(x,y);
    M.js_gl_vertex3f = (x,y,z) => renderer.vertex3f(x,y,z);
    M.js_gl_tex_coord2f = (u,v) => renderer.texCoord2f(u,v);
    M.js_gl_color3f = (r,g,b) => renderer.color3f(r,g,b);
    M.js_gl_color4f = (r,g,b,a) => renderer.color4f(r,g,b,a);
    M.js_gl_matrix_mode = m => renderer.matrixMode(m);
    M.js_gl_load_identity = () => renderer.loadIdentity();
    M.js_gl_push_matrix = () => renderer.pushMatrix();
    M.js_gl_pop_matrix = () => renderer.popMatrix();
    M.js_gl_translatef = (x,y,z) => renderer.translatef(x,y,z);
    M.js_gl_rotatef = (a,x,y,z) => renderer.rotatef(a,x,y,z);
    M.js_gl_scalef = (x,y,z) => renderer.scalef(x,y,z);
    M.js_gl_ortho = (l,r,b,t,n,f) => renderer.ortho(l,r,b,t,n,f);
    M.js_gl_new_list = (l,m) => renderer.newList(l,m);
    M.js_gl_end_list = () => renderer.endList();
    M.js_gl_call_list = l => renderer.callList(l);
    M.js_gl_tex_parameteri = (t,p,v) => renderer.texParameteri(t,p,v);
    M.js_gl_blend_func = (s,d) => renderer.blendFunc(s,d);
    M.js_gl_depth_func = f => renderer.depthFunc(f);
    M.js_gl_depth_mask = f => renderer.depthMask(f);
    M.js_gl_color_mask = (r,g,b,a) => renderer.colorMask(r,g,b,a);
    M.js_gl_cull_face = m => renderer.cullFace(m);
    M.js_gl_alpha_func = (f,r) => renderer.alphaFunc(f,r);
    M.js_gl_get_string = (n,p) => { const s = renderer.getString(n); if(p&&s&&M.stringToUTF8) M.stringToUTF8(s,p,s.length); };
    M.js_gl_get_error = () => renderer.getError();
    M.js_gl_read_pixels = (x,y,w,h,f,t,p) => renderer.readPixels(x,y,w,h,f,t,p);
    M.js_gl_get_integerv = (n,p) => renderer.getIntegerv(n,p);
    M.js_gl_line_width = w => renderer.lineWidth(w);
    M.js_gl_polygon_offset = (f,u) => renderer.polygonOffset(f,u);
    M.js_gl_scissor = (x,y,w,h) => renderer.scissor(x,y,w,h);
    M.js_gl_active_texture = t => renderer.activeTexture(t);
    M.js_gl_fogi = (p,v) => { if(p===0xB65)renderer.fogMode=v; };
    M.js_gl_fogf = (p,v) => { if(p===0xB62)renderer.fogDensity=v;else if(p===0xB63)renderer.fogStart=v;else if(p===0xB64)renderer.fogEnd=v; };
    M.js_gl_fogfv = (p,v) => { if(p===0xB66){ const ptr=v; renderer.fogColor=[Module.getValue(ptr,'float'),Module.getValue(ptr+4,'float'),Module.getValue(ptr+8,'float'),Module.getValue(ptr+12,'float')]; } };
    M.js_gl_generate_mipmap = t => renderer.generateMipmap(t);
    M.js_gl_pixel_storei = (p,v) => renderer.pixelStorei(p,v);
    M.js_gl_shader_source = (s,p) => renderer.shaderSource(s,p);
    M.js_gl_compile_shader = s => renderer.compileShader(s);
    M.js_gl_create_shader = t => renderer.createShader(t);
    M.js_gl_create_program = () => renderer.createProgram();
    M.js_gl_attach_shader = (p,s) => renderer.attachShader(p,s);
    M.js_gl_link_program = p => renderer.linkProgram(p);
    M.js_gl_use_program = p => renderer.useProgram(p);
    M.js_gl_get_uniform_location = (p,n) => renderer.getUniformLocation(p,n);
    M.js_gl_uniform1i = (l,v) => renderer.uniform1i(l,v);
    M.js_gl_uniform1f = (l,v) => renderer.uniform1f(l,v);
    M.js_gl_uniform_matrix4fv = (l,c,t,p) => renderer.uniformMatrix4fv(l,c,t,p);
    M.js_gl_vertex_attrib_pointer = (i,s,t,n,str,p) => renderer.vertexAttribPointer(i,s,t,n,str,p);
    M.js_gl_enable_vertex_attrib = i => renderer.enableVertexAttribArray(i);
    M.js_create_window = (w,h,t) => renderer.createWindow(w,h,ps(t));
    M.js_set_display_mode = (w,h) => renderer.setDisplayMode(w,h);
    M.js_swap_buffers = () => {};
    M.js_is_close_requested = () => 0;
    M.js_get_key_state = k => inputManager.isKeyDown(k);
    M.js_get_mouse_button = b => inputManager.isMouseButtonDown(b);
    M.js_get_mouse_x = () => inputManager.getMouseX();
    M.js_get_mouse_y = () => inputManager.getMouseY();
    M.js_set_mouse_grabbed = g => inputManager.setGrabbed(g);
    M.js_is_mouse_grabbed = () => inputManager.isGrabbed()?1:0;
    M.js_log = m => console.log('[JVM]', ps(m));
    M.js_log_i = v => console.log('[JVM]', v);
    M.js_cur_ms = () => performance.now();
    M.js_resource_exists = p => 0;
    M.js_resource_read = (p,b,m) => 0;
    M.js_resource_size = p => -1;
}
bridge();

let ready = false;
Module.onRuntimeInitialized = () => {
    jvmLoadBlob = Module.cwrap('jvm_load_blob', 'number', ['number', 'number']);
    jvmFindClass = Module.cwrap('jvm_find_class', 'number', ['string']);
    jvmInvokeStatic = Module.cwrap('jvm_invoke_static', null, ['number', 'string', 'string']);
    Module.cwrap('jvm_init', null, [])();
    ready = true;
    const st = document.getElementById('status');
    st.textContent = 'Ready. Click to load Minecraft...';
    document.getElementById('loader').style.cursor = 'pointer';
    document.getElementById('loader').onclick = boot;
};

async function boot() {
    if (!ready) return;
    document.getElementById('loader').onclick = null;
    document.getElementById('loader').style.cursor = 'default';
    const st = document.getElementById('status');
    const pc = document.getElementById('status-percent');
    st.textContent = 'Loading Minecraft blob...';
    try { audioManager.init(); } catch(e) {}
    renderer.init();

    try {
        const resp = await fetch('minecraft.blob?v=2');
        if (!resp.ok) throw new Error(`HTTP ${resp.status} - blob missing`);
        const total = +resp.headers.get('content-length') || 27000000;
        const reader = resp.body.getReader();
        const chunks = [];
        let rx = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            rx += value.length;
            pc.textContent = `${Math.round(rx/Math.max(total,1)*100)}% (${(rx/1024/1024).toFixed(1)}MB)`;
        }
        const blob = new Uint8Array(rx);
        let pos = 0;
        for (const c of chunks) { blob.set(c,pos); pos += c.length; }
        st.textContent = `Parsing ${(blob.length/1024/1024).toFixed(1)}MB into JVM...`;
        pc.textContent = 'This may take a few seconds';

        await new Promise(r => setTimeout(r, 50));

        const ptr = Module._malloc(blob.length);
        if (!ptr) throw new Error('malloc failed - out of WASM memory');
        Module.HEAPU8.set(blob, ptr);
        st.textContent = 'Loading classes...';
        pc.textContent = '';
        const loaded = jvmLoadBlob(ptr, blob.length);
        Module._free(ptr);

        st.textContent = `${loaded} classes loaded. Finding main...`;
        pc.textContent = '';

        const mainCls = jvmFindClass('net/minecraft/client/main/Main');
        if (mainCls) {
            st.textContent = 'Booting Minecraft...';
            document.getElementById('loader').style.display = 'none';
            setTimeout(() => {
                try {
                    jvmInvokeStatic(mainCls, 'main', '([Ljava/lang/String;)V');
                } catch(e) {
                    console.error('JVM crash:', e);
                    st.textContent = 'JVM crashed: ' + e.message;
                    document.getElementById('loader').style.display = 'block';
                }
            }, 100);
        } else {
            st.textContent = `Main class not found! Loaded ${loaded} classes.`;
            console.log('Available classes sample:');
            for (let i = 0; i < Math.min(10, loaded); i++) {
                console.log('  class #' + i);
            }
        }
    } catch(e) {
        st.textContent = 'Error: ' + e.message;
        pc.textContent = '';
        console.error(e);
    }
}

window.boot = boot;
