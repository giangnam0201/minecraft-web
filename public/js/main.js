import { renderer } from './renderer.js';
import { audioManager } from './audio.js';
import { inputManager } from './input.js';
import { networkManager } from './network.js';
import { JarPacker } from './packer.js';

const MC_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';
const Module = window.Module || {};
Module.print = t => console.log('[JVM]', t);
Module.printErr = t => console.error('[JVM]', t);
const jarRes = new Map();
let jvmReady = false;

const ps = p => Module.UTF8ToString ? Module.UTF8ToString(p) : '';
const si = (p, v) => { if (Module.setValue) Module.setValue(p, v, 'i32'); };
const gi = p => Module.getValue ? Module.getValue(p, 'i32') : 0;
const gf = p => Module.getValue ? Module.getValue(p, 'float') : 0;

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
    M.js_gl_fogfv = (p,v) => { if(p===0xB66) renderer.fogColor=[gf(v),gf(v+4),gf(v+8),gf(v+12)]; };
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
    M.js_resource_exists = p => jarRes.has(ps(p)) ? 1 : 0;
    M.js_resource_read = (p,b,m) => { const d = jarRes.get(ps(p)); if(!d)return 0; const l=Math.min(d.length,m); M.HEAPU8.set(d.subarray(0,l),b); return l; };
    M.js_resource_size = p => { const d=jarRes.get(ps(p)); return d?d.length:-1; };
}
bridge();
window.Module = Module;

let jvmLoadBlob, jvmFindClass, jvmInvokeStatic;

Module.onRuntimeInitialized = () => {
    jvmLoadBlob = Module.cwrap('jvm_load_blob', 'number', ['number', 'number']);
    jvmFindClass = Module.cwrap('jvm_find_class', 'number', ['string']);
    jvmInvokeStatic = Module.cwrap('jvm_invoke_static', null, ['number', 'string', 'string']);
    const jvmInit = Module.cwrap('jvm_init', null, []);
    jvmInit();
    jvmReady = true;
    document.getElementById('status').textContent = 'JVM ready. Click anywhere to download Minecraft...';
    document.getElementById('loader').style.cursor = 'pointer';
    document.getElementById('loader').onclick = start;
};

async function start() {
    if (!jvmReady) return;
    document.getElementById('loader').onclick = null;
    document.getElementById('loader').style.cursor = 'default';
    audioManager.init();
    renderer.init();
    try {
        await downloadAndBoot();
    } catch(e) {
        document.getElementById('status').textContent = 'Error: ' + e.message;
        console.error(e);
        document.getElementById('manual-load').style.display = 'block';
    }
}

async function downloadAndBoot() {
    const st = document.getElementById('status');
    const pc = document.getElementById('status-percent');
    st.textContent = 'Downloading Minecraft 1.16.5...';

    const resp = await fetch(MC_URL);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const total = +resp.headers.get('content-length') || 0;
    const reader = resp.body.getReader();
    const chunks = [];
    let rx = 0;
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        rx += value.length;
        if (total) pc.textContent = Math.round(rx/total*100)+'%';
    }
    const jar = new Uint8Array(rx);
    let p = 0;
    for (const c of chunks) { jar.set(c, p); p += c.length; }
    st.textContent = 'Parsing & decompressing JAR...';
    pc.textContent = '';

    const { blob, classCount, resourceCount } = await buildBlob(jar);
    st.textContent = `Packed ${classCount} classes + ${resourceCount} resources. Loading into JVM...`;
    pc.textContent = `${(blob.length/1024/1024).toFixed(1)} MB blob`;

    await new Promise(r => setTimeout(r, 50));

    const ptr = Module._malloc(blob.length);
    Module.HEAPU8.set(blob, ptr);
    const loaded = jvmLoadBlob(ptr, blob.length);
    Module._free(ptr);

    st.textContent = `Loaded ${loaded} classes. Booting Minecraft...`;
    pc.textContent = '';
    document.getElementById('loader').style.display = 'none';

    setTimeout(() => bootMinecraft(), 100);
}

async function inflate(cmp) {
    for (const fmt of ['deflate', 'deflate-raw']) {
        try {
            const ds = new DecompressionStream(fmt);
            const w = ds.writable.getWriter();
            const r = ds.readable.getReader();
            w.write(cmp); w.close();
            const chunks = [];
            while (true) {
                const { done, value } = await r.read();
                if (done) break;
                chunks.push(value);
            }
            const total = chunks.reduce((s,c)=>s+c.length,0);
            const out = new Uint8Array(total);
            let off = 0;
            for (const c of chunks) { out.set(c,off); off+=c.length; }
            return out;
        } catch(e) {}
    }
    return null;
}

function nextHeader(d, start) {
    for (let i = start; i < d.length - 4; i++)
        if (d[i]===0x50&&d[i+1]===0x4B&&d[i+2]===0x03&&d[i+3]===0x04) return i;
    return d.length;
}

async function buildBlob(jar) {
    const v = new DataView(jar.buffer, jar.byteOffset, jar.byteLength);
    const packer = new JarPacker();
    let pos = 0, classCount = 0, resourceCount = 0;
    const st = document.getElementById('status');
    const pc = document.getElementById('status-percent');

    while (pos < jar.length - 30) {
        if (v.getUint32(pos, true) !== 0x04034b50) { pos++; continue; }
        const flags = v.getUint16(pos + 6, true);
        const comp = v.getUint16(pos + 8, true);
        let cs = v.getUint32(pos + 18, true);
        let us = v.getUint32(pos + 22, true);
        const nl = v.getUint16(pos + 26, true);
        const el = v.getUint16(pos + 28, true);
        const name = new TextDecoder().decode(jar.subarray(pos+30, pos+30+nl));
        const fs = pos + 30 + nl + el;

        if ((flags & 0x0008) && cs === 0) {
            const nh = nextHeader(jar, fs);
            cs = nh - fs;
            if (cs <= 0) { pos = nh; continue; }
        }

        const isClass = name.endsWith('.class');
        const isRes = !name.endsWith('/') && !name.startsWith('META-INF');

        if (isClass || isRes) {
            let data;
            if (comp === 0) {
                data = jar.subarray(fs, fs + us);
            } else {
                data = await inflate(new Uint8Array(jar.subarray(fs, fs + cs)));
                if (!data) { pos = fs + cs; continue; }
            }

            if (isClass) {
                const superName = '';
                packer.addClass(name.replace(/\.class$/, '').replace(/\//g, '/'), superName, data);
                classCount++;
            } else if (isRes) {
                packer.addResource(name, data);
                jarRes.set(name, data);
                resourceCount++;
            }
        }

        pos = fs + (comp > 0 ? cs : us);
        if (classCount % 200 === 0) {
            st.textContent = `Packing: ${classCount} classes...`;
            pc.textContent = `${resourceCount} resources`;
            await new Promise(r => setTimeout(r, 0));
        }
    }

    return { blob: packer.build(), classCount, resourceCount };
}

function bootMinecraft() {
    console.log('Booting Minecraft...');
    const mainClass = jvmFindClass('net/minecraft/client/main/Main');
    if (mainClass) {
        console.log('Found Main class, invoking main()...');
        try {
            jvmInvokeStatic(mainClass, 'main', '([Ljava/lang/String;)V');
        } catch(e) {
            console.error('JVM crash:', e);
        }
    } else {
        console.error('Main class not found. Loaded classes:', Module._jvm_cls_cnt ? Module.getValue(Module._jvm_cls_cnt, 'i32') : 'unknown');
    }
}
window.bootMinecraft = bootMinecraft;
