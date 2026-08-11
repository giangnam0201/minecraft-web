const fs = require('fs');
const path = require('path');

const PUBLIC = path.resolve(__dirname, '..', 'public');
const PASS = '✓', FAIL = '✗';
let passed = 0, failed = 0;

function check(name, condition) {
    if (condition) { console.log(`  ${PASS} ${name}`); passed++; }
    else { console.log(`  ${FAIL} ${name}`); failed++; }
}

async function run() {
    console.log('=== Minecraft Web Smoke Test ===\n');

    console.log('-- Build outputs --');
    const files = fs.readdirSync(PUBLIC);
    check('public/ exists', files.length > 0);
    check('index.html exists', fs.existsSync(path.join(PUBLIC, 'index.html')));
    check('jvm.js exists', fs.existsSync(path.join(PUBLIC, 'jvm.js')));
    check('jvm.wasm exists', fs.existsSync(path.join(PUBLIC, 'jvm.wasm')));

    const wasmSize = fs.statSync(path.join(PUBLIC, 'jvm.wasm')).size;
    check(`jvm.wasm > 10KB (${(wasmSize/1024).toFixed(1)} KB)`, wasmSize > 10240);

    const jsContent = fs.readFileSync(path.join(PUBLIC, 'jvm.js'), 'utf8');
    check('jvm.js exports jvm_init', jsContent.includes('jvm_init'));
    check('jvm.js exports jvm_load_blob', jsContent.includes('jvm_load_blob'));
    check('jvm.js exports jvm_find_class', jsContent.includes('jvm_find_class'));

    console.log('\n-- JS modules --');
    check('packer.js exists', fs.existsSync(path.join(PUBLIC, 'js', 'packer.js')));
    check('renderer.js exists', fs.existsSync(path.join(PUBLIC, 'js', 'renderer.js')));
    check('main.js exists', fs.existsSync(path.join(PUBLIC, 'js', 'main.js')));
    check('audio.js exists', fs.existsSync(path.join(PUBLIC, 'js', 'audio.js')));
    check('input.js exists', fs.existsSync(path.join(PUBLIC, 'js', 'input.js')));
    check('network.js exists', fs.existsSync(path.join(PUBLIC, 'js', 'network.js')));

    console.log('\n-- HTML validation --');
    const html = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
    check('HTML has game-canvas', html.includes('game-canvas'));
    check('HTML has loader', html.includes('id="loader"'));
    check('HTML has status', html.includes('id="status"'));
    check('HTML loads jvm.js', html.includes('jvm.js'));
    check('HTML loads main.js', html.includes('main.js'));

    console.log('\n-- WASM JVM test (Node.js) --');
    try {
        const Module = require(path.join(PUBLIC, 'jvm.js'));
        const mod = await Module();

        check('Module factory returned', !!mod);
        check('_jvm_init exported', typeof mod._jvm_init === 'function');
        check('_jvm_load_class exported', typeof mod._jvm_load_class === 'function');
        check('_jvm_load_blob exported', typeof mod._jvm_load_blob === 'function');
        check('_jvm_find_class exported', typeof mod._jvm_find_class === 'function');
        check('_jvm_invoke_static exported', typeof mod._jvm_invoke_static === 'function');
        check('_malloc exported', typeof mod._malloc === 'function');
        check('_free exported', typeof mod._free === 'function');

        mod._jvm_init();

        // Build a minimal class: public class Test {}
        // Magic: CAFEBABE, version 52.0, flags: ACC_PUBLIC|ACC_SUPER
        const classBytes = new Uint8Array([
            0xCA,0xFE,0xBA,0xBE, 0x00,0x00,0x00,0x34, // magic + version 52
            0x00,0x0A, // cp_count = 10
            0x07,0x00,0x02, // #1 Class[#2]
            0x01,0x00,0x04,0x54,0x65,0x73,0x74, // #2 Utf8 "Test"
            0x07,0x00,0x04, // #3 Class[#4]
            0x01,0x00,0x10,0x6A,0x61,0x76,0x61,0x2F,0x6C,0x61,0x6E,0x67,0x2F,0x4F,0x62,0x6A,0x65,0x63,0x74, // #4 Utf8 "java/lang/Object"
            0x01,0x00,0x04,0x43,0x6F,0x64,0x65, // #5 Utf8 "Code"
            0x01,0x00,0x06,0x3C,0x69,0x6E,0x69,0x74,0x3E, // #6 Utf8 "<init>"
            0x01,0x00,0x03,0x28,0x29,0x56, // #7 Utf8 "()V"
            0x01,0x00,0x0F,0x4C,0x69,0x6E,0x65,0x4E,0x75,0x6D,0x62,0x65,0x72,0x54,0x61,0x62,0x6C,0x65, // #8 Utf8 "LineNumberTable"
            0x01,0x00,0x04,0x6D,0x61,0x69,0x6E, // #9 Utf8 "main"
            0x00,0x21, // access_flags: ACC_PUBLIC|ACC_SUPER
            0x00,0x01, // this_class #1
            0x00,0x03, // super_class #3
            0x00,0x00, // interfaces_count = 0
            0x00,0x00, // fields_count = 0
            0x00,0x01, // methods_count = 1
            0x00,0x01, // method access: ACC_PUBLIC
            0x00,0x06, // name_index: <init>
            0x00,0x07, // desc_index: ()V
            0x00,0x01, // attr_count = 1
            0x00,0x05, // attr_name: Code
            0x00,0x00,0x00,0x11, // attr_len
            0x00,0x01, // max_stack
            0x00,0x01, // max_locals
            0x00,0x00,0x00,0x05, // code_len = 5
            0x2A,0xB7,0x00,0x01,0xB1, // aload_0, invokespecial #1, return
            0x00,0x00, // exc_table_len = 0
            0x00,0x00, // attr_count = 0
            0x00,0x00, // class attr_count
        ]);

        const ptr = mod._malloc(classBytes.length);
        mod.HEAPU8.set(classBytes, ptr);
        const idx = mod._jvm_load_class(ptr, classBytes.length);
        mod._free(ptr);

        check('Class loaded successfully (idx >= 0)', idx >= 0);
        check('JVM class count > 0', mod._jvm_cls_cnt > 0);

        const clsPtr = mod._jvm_find_class(mod.stringToUTF8('Test', 100, 0));
        check('jvm_find_class("Test") returns pointer', clsPtr !== 0);

        console.log(`\n  Class index: ${idx}, class count: ${mod._jvm_cls_cnt}`);
    } catch (e) {
        console.log(`  ${FAIL} WASM test crashed: ${e.message}`);
        failed++;
    }

    console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
    process.exit(failed > 0 ? 1 : 0);
}

run().catch(e => {
    console.error('Test crashed:', e);
    process.exit(1);
});
