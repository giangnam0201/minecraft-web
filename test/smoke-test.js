const fs = require('fs');
const path = require('path');

const PUBLIC = path.resolve(__dirname, '..', 'public');
let passed = 0, failed = 0;
const logLines = [];

function log(msg) {
    const line = `  ${msg}`;
    console.log(line);
    logLines.push(line);
}
function check(name, condition) {
    if (condition) { console.log(`  \x1b[32m✓\x1b[0m ${name}`); passed++; }
    else { console.log(`  \x1b[31m✗\x1b[0m ${name}`); failed++; logLines.push(`FAIL: ${name}`); }
}

async function run() {
    console.log('=== Minecraft Web Smoke Test ===\n');

    console.log('-- Build outputs --');
    log('CWD: ' + process.cwd());
    log('PUBLIC dir: ' + PUBLIC);
    try { log('PUBLIC contents: ' + fs.readdirSync(PUBLIC).join(', ')); } catch(e) { log('PUBLIC read error: ' + e.message); }
    const files = fs.readdirSync(PUBLIC);
    check('index.html exists', fs.existsSync(path.join(PUBLIC, 'index.html')));
    check('jvm.js exists', fs.existsSync(path.join(PUBLIC, 'jvm.js')));
    check('jvm.wasm exists', fs.existsSync(path.join(PUBLIC, 'jvm.wasm')));

    const wasmSize = fs.statSync(path.join(PUBLIC, 'jvm.wasm')).size;
    check(`jvm.wasm size ${(wasmSize/1024).toFixed(1)} KB`, wasmSize > 10240);

    const jsContent = fs.readFileSync(path.join(PUBLIC, 'jvm.js'), 'utf8');
    check('jvm.js contains jvm_init', jsContent.includes('jvm_init'));
    check('jvm.js contains jvm_load_blob', jsContent.includes('jvm_load_blob'));

    console.log('\n-- JS modules --');
    check('packer.js', fs.existsSync(path.join(PUBLIC, 'js', 'packer.js')));
    check('renderer.js', fs.existsSync(path.join(PUBLIC, 'js', 'renderer.js')));
    check('main.js', fs.existsSync(path.join(PUBLIC, 'js', 'main.js')));

    console.log('\n-- HTML --');
    const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
    check('has game-canvas', html.includes('game-canvas'));
    check('has loader', html.includes('id="loader"'));
    check('has status', html.includes('id="status"'));
    check('loads jvm.js', html.includes('jvm.js'));
    check('loads main.js', html.includes('main.js'));
    check('has bridge stubs before jvm.js', html.indexOf('Module.js_gl_clear=noop') < html.indexOf('jvm.js'));

    console.log('\n-- WASM JVM test --');
    try {
        const noop = () => {};
        const noop0 = () => 0;
        global.Module = {
            print: (t) => {},
            printErr: (t) => {},
            preRun: [], postRun: [],
            js_gl_clear: noop, js_gl_clear_color: noop, js_gl_viewport: noop,
            js_gl_enable: noop, js_gl_disable: noop, js_gl_bind_texture: noop,
            js_gl_gen_textures: noop, js_gl_delete_textures: noop, js_gl_tex_image_2d: noop,
            js_gl_draw_arrays: noop, js_gl_gen_buffers: noop, js_gl_bind_buffer: noop,
            js_gl_buffer_data: noop, js_gl_buffer_sub_data: noop,
            js_gl_begin: noop, js_gl_end: noop, js_gl_vertex2f: noop, js_gl_vertex3f: noop,
            js_gl_tex_coord2f: noop, js_gl_color3f: noop, js_gl_color4f: noop,
            js_gl_matrix_mode: noop, js_gl_load_identity: noop,
            js_gl_push_matrix: noop, js_gl_pop_matrix: noop, js_gl_translatef: noop,
            js_gl_rotatef: noop, js_gl_scalef: noop, js_gl_ortho: noop,
            js_gl_new_list: noop, js_gl_end_list: noop, js_gl_call_list: noop,
            js_gl_tex_parameteri: noop, js_gl_blend_func: noop, js_gl_depth_func: noop,
            js_gl_depth_mask: noop, js_gl_color_mask: noop, js_gl_cull_face: noop,
            js_gl_alpha_func: noop, js_gl_get_string: noop, js_gl_get_error: noop0,
            js_gl_read_pixels: noop, js_gl_get_integerv: noop, js_gl_line_width: noop,
            js_gl_polygon_offset: noop, js_gl_scissor: noop, js_gl_active_texture: noop,
            js_gl_fogi: noop, js_gl_fogf: noop, js_gl_fogfv: noop,
            js_gl_generate_mipmap: noop, js_gl_pixel_storei: noop,
            js_gl_shader_source: noop, js_gl_compile_shader: noop,
            js_gl_create_shader: noop0, js_gl_create_program: noop0,
            js_gl_attach_shader: noop, js_gl_link_program: noop, js_gl_use_program: noop,
            js_gl_get_uniform_location: noop0, js_gl_uniform1i: noop,
            js_gl_uniform1f: noop, js_gl_uniform_matrix4fv: noop,
            js_gl_vertex_attrib_pointer: noop, js_gl_enable_vertex_attrib: noop,
            js_create_window: noop, js_set_display_mode: noop,
            js_swap_buffers: noop, js_is_close_requested: noop0,
            js_get_key_state: noop0, js_get_mouse_button: noop0,
            js_get_mouse_x: noop0, js_get_mouse_y: noop0,
            js_set_mouse_grabbed: noop, js_is_mouse_grabbed: noop0,
            js_log: noop, js_log_i: noop, js_cur_ms: () => Date.now(),
            js_resource_exists: noop0, js_resource_read: noop0, js_resource_size: noop0,
            js_gl_clear_depth: noop, js_gl_clear_stencil: noop,
            js_gl_front_face: noop, js_gl_shade_model: noop,
            js_gl_point_size: noop, js_gl_tex_parameterf: noop,
            js_gl_tex_sub_image_2d: noop, js_gl_copy_tex_sub_image_2d: noop,
            js_gl_uniform2f: noop, js_gl_uniform3f: noop, js_gl_uniform4f: noop,
            js_gl_vertex2fv: noop, js_gl_vertex3fv: noop,
            js_gl_color3ub: noop, js_gl_color4ub: noop, js_gl_normal3f: noop,
            js_gl_get_floatv: noop, js_gl_delete_lists: noop,
            js_gl_gen_lists: noop0, js_gl_is_list: noop0,
            js_gl_read_buffer: noop, js_gl_bind_framebuffer: noop,
            js_gl_gen_framebuffers: noop, js_gl_delete_framebuffers: noop,
            js_gl_framebuffer_texture2d: noop, js_gl_check_framebuffer_status: noop0,
            js_audio_init: noop0, js_audio_play: noop, js_audio_stop: noop,
            js_audio_set_volume: noop, js_audio_al_gen_sources: noop,
            js_audio_al_delete_sources: noop, js_audio_al_gen_buffers: noop,
            js_audio_al_buffer_data: noop, js_audio_al_source_play: noop,
            js_audio_al_source_stop: noop, js_audio_al_sourcef: noop,
            js_audio_al_get_error: noop0,
            js_socket_connect: noop, js_socket_send: noop,
            js_socket_recv: noop0, js_socket_close: noop, js_socket_available: noop0,
            locateFile: (f) => path.join(PUBLIC, f),
            onRuntimeInitialized: () => {},
        };

        const Module = require(path.join(PUBLIC, 'jvm.js'));
        const mod = await Module();
        log('WASM module instantiated OK');

        check('_jvm_init exported', typeof mod._jvm_init === 'function');
        check('_jvm_load_class exported', typeof mod._jvm_load_class === 'function');
        check('_jvm_load_blob exported', typeof mod._jvm_load_blob === 'function');
        check('_jvm_find_class exported', typeof mod._jvm_find_class === 'function');
        check('_malloc exported', typeof mod._malloc === 'function');
        check('_free exported', typeof mod._free === 'function');

        mod._jvm_init();
        log('JVM init called');

        const classBytes = new Uint8Array([
            0xCA,0xFE,0xBA,0xBE,0x00,0x00,0x00,0x34,0x00,0x0A,
            0x07,0x00,0x02,0x01,0x00,0x04,0x54,0x65,0x73,0x74,
            0x07,0x00,0x04,
            0x01,0x00,0x10,0x6A,0x61,0x76,0x61,0x2F,0x6C,0x61,0x6E,0x67,0x2F,0x4F,0x62,0x6A,0x65,0x63,0x74,
            0x01,0x00,0x04,0x43,0x6F,0x64,0x65,
            0x01,0x00,0x06,0x3C,0x69,0x6E,0x69,0x74,0x3E,
            0x01,0x00,0x03,0x28,0x29,0x56,
            0x01,0x00,0x0F,0x4C,0x69,0x6E,0x65,0x4E,0x75,0x6D,0x62,0x65,0x72,0x54,0x61,0x62,0x6C,0x65,
            0x01,0x00,0x04,0x6D,0x61,0x69,0x6E,
            0x00,0x21,0x00,0x01,0x00,0x03,0x00,0x00,0x00,0x00,
            0x00,0x01,0x00,0x01,0x00,0x06,0x00,0x07,0x00,0x01,
            0x00,0x05,0x00,0x00,0x00,0x11,0x00,0x01,0x00,0x01,0x00,0x00,0x00,0x05,
            0x2A,0xB7,0x00,0x01,0xB1,
            0x00,0x00,0x00,0x00,0x00,0x00,
        ]);
        const ptr = mod._malloc(classBytes.length);
        mod.HEAPU8.set(classBytes, ptr);
        const idx = mod._jvm_load_class(ptr, classBytes.length);
        mod._free(ptr);
        check('Class loaded (idx >= 0)', idx >= 0);

        const clsPtr = mod._jvm_find_class('Test');
        check('jvm_find_class found Test class', clsPtr !== 0);

        log(`Class index: ${idx}`);
    } catch (e) {
        check(`WASM test: ${e.message}`, false);
    }

    console.log(`\n=== ${passed} passed, ${failed} failed ===`);
    fs.writeFileSync(path.join(__dirname, 'result.txt'), logLines.join('\n'));
    process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => { console.error('CRASH:', e); process.exit(1); });
