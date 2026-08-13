const fs = require('fs');
const path = require('path');
const https = require('https');

const CLIENT_JAR_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';
const VERSION_MANIFEST = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
const OUT_DIR = path.resolve(__dirname, '..', 'libs');
const OUT_JAR = path.join(OUT_DIR, 'minecraft-1.16.5-deobf.jar');

const REPLACE_MAP = {
    "java/net/Proxy": "org/eaglercraft/network/Proxy",
    "java/net/Authenticator": "org/eaglercraft/network/Authenticator",
    "java/net/InetSocketAddress": "org/eaglercraft/network/InetSocketAddress",
    "java/net/SocketAddress": "org/eaglercraft/network/SocketAddress",
    "java/net/Proxy$Type": "org/eaglercraft/network/Proxy$Type",
    "a": "com/mojang/math/Matrix3f",
    "b": "com/mojang/math/Matrix4f",
    "c": "com/mojang/math/OctahedralGroup",
    "d": "com/mojang/math/Quaternion",
    "e": "com/mojang/math/SymmetricGroup3",
    "f": "com/mojang/math/Transformation",
    "g": "com/mojang/math/Vector3f",
    "h": "com/mojang/math/Vector4f",
    "i": "net/minecraft/BlockUtil",
    "j": "net/minecraft/CharPredicate",
    "k": "net/minecraft/ChatFormatting",
    "l": "net/minecraft/CrashReport",
    "m": "net/minecraft/CrashReportCategory",
    "n": "net/minecraft/CrashReportDetail",
    "o": "net/minecraft/DefaultUncaughtExceptionHandler",
    "p": "net/minecraft/DefaultUncaughtExceptionHandlerWithName",
    "q": "net/minecraft/DetectedVersion",
    "r": "net/minecraft/FieldsAreNonnullByDefault",
    "s": "net/minecraft/FileUtil",
    "t": "net/minecraft/MethodsReturnNonnullByDefault",
    "u": "net/minecraft/ReportedException",
    "v": "net/minecraft/ResourceLocationException",
    "w": "net/minecraft/SharedConstants",
    "x": "net/minecraft/Util",
    "y": "net/minecraft/advancements/Advancement",
    "z": "net/minecraft/advancements/AdvancementList",
};

let GLOBAL_PATCHES = 0;
let GLOBAL_RENAME_MAP = null;

function download(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
                return download(res.headers.location).then(resolve).catch(reject);
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

function parseMappings(text) {
    const classMap = Object.create(null);
    for (const line of text.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#') || t.startsWith('    ')) continue;
        const a = t.indexOf(' -> ');
        if (a === -1) continue;
        const left = t.substring(0, a);
        const right = t.substring(a + 4).replace(/:$/, '').trim();
        if (!left.includes('.') || left.includes(' ') || left.includes('(') || left.includes(':')) continue;
        classMap[right] = left.trim().replace(/\./g, '/');
    }
    return classMap;
}

function buildGlobalRenameMap(classMap) {
    const merged = Object.create(null);
    for (const [k, v] of Object.entries(classMap)) merged[k] = v;
    for (const [k, v] of Object.entries(REPLACE_MAP)) merged[k] = v;
    const sortedKeys = Object.keys(merged).sort((a, b) => b.length - a.length);
    // Build combined regex for 2+ char keys (descriptor + standalone)
    const multiKeys = sortedKeys.filter(k => k.length >= 2).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let multiRegex = null;
    try {
        if (multiKeys.length > 0) {
            const pattern = '(?<=L)(' + multiKeys.join('|') + ')(?=[;<])|(?<![a-zA-Z0-9_/])(' + multiKeys.join('|') + ')(?![a-zA-Z0-9_])';
            multiRegex = new RegExp(pattern, 'g');
        }
    } catch (e) { multiRegex = null; }
    // Build combined regex for 1-char keys (descriptor only)
    const singleKeys = sortedKeys.filter(k => k.length === 1).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let singleRegex = null;
    try {
        if (singleKeys.length > 0) {
            singleRegex = new RegExp('(?<=L)(' + singleKeys.join('|') + ')(?=[;<])', 'g');
        }
    } catch (e) { singleRegex = null; }
    return { map: merged, multiRegex, singleRegex };
}

function renameString(str, renameMap) {
    let patches = 0;
    if (renameMap.multiRegex) {
        str = str.replace(renameMap.multiRegex, (match, descKey, wordKey) => {
            const key = descKey || wordKey;
            if (key && renameMap.map[key]) { patches++; return renameMap.map[key]; }
            return match;
        });
    }
    if (renameMap.singleRegex) {
        str = str.replace(renameMap.singleRegex, (match, key) => {
            if (key && renameMap.map[key]) { patches++; return renameMap.map[key]; }
            return match;
        });
    }
    return { str, patches };
}

function rebuildClass(buf, renameMap) {
    let patches = 0;
    if (buf.length < 10 || buf.readUInt32BE(0) !== 0xCAFEBABE) return { buf, patches };

    const cpCount = buf.readUInt16BE(8);
    const chunks = [buf.subarray(0, 10)];
    let pos = 10;

    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos++];
        chunks.push(Buffer.from([tag]));

        switch (tag) {
            case 1: {
                const len = buf.readUInt16BE(pos);
                const rawStr = buf.toString('utf8', pos + 2, pos + 2 + len);
                const { str, patches: p } = renameString(rawStr, renameMap);
                if (p > 0 && str.length < 65536) {
                    patches += p;
                    const lb = Buffer.alloc(2); lb.writeUInt16BE(str.length, 0);
                    chunks.push(lb, Buffer.from(str, 'utf8'));
                } else {
                    chunks.push(buf.subarray(pos, pos + 2 + len));
                }
                pos += 2 + len;
                break;
            }
            case 3: case 4: chunks.push(buf.subarray(pos, pos + 4)); pos += 4; break;
            case 5: case 6: chunks.push(buf.subarray(pos, pos + 8)); pos += 8; i++; break;
            case 7: case 8: chunks.push(buf.subarray(pos, pos + 2)); pos += 2; break;
            case 9: case 10: case 11: case 12: case 17: case 18: chunks.push(buf.subarray(pos, pos + 4)); pos += 4; break;
            case 15: chunks.push(buf.subarray(pos, pos + 3)); pos += 3; break;
            case 16: case 19: case 20: chunks.push(buf.subarray(pos, pos + 2)); pos += 2; break;
            default: return { buf, patches };
        }
    }

    chunks.push(buf.subarray(pos));
    return { buf: Buffer.concat(chunks), patches };
}

async function main() {
    console.log('=== Minecraft 1.16.5 Deobfuscator ===\n');
    console.log('1. Getting version manifest...');
    const manifest = JSON.parse((await download(VERSION_MANIFEST)).toString());
    const v1165 = manifest.versions.find(v => v.id === '1.16.5');
    if (!v1165) throw new Error('1.16.5 not found');
    const vMeta = JSON.parse((await download(v1165.url)).toString());
    const mUrl = vMeta.downloads?.client_mappings?.url;
    if (!mUrl) throw new Error('No mappings URL');

    console.log('2. Downloading mappings...');
    const classMap = parseMappings((await download(mUrl)).toString());
    GLOBAL_RENAME_MAP = buildGlobalRenameMap(classMap);
    console.log(`   ${GLOBAL_RENAME_MAP.keys.length} mappings`);

    console.log('3. Downloading client JAR...');
    const jar = await download(CLIENT_JAR_URL);
    console.log(`   ${(jar.length/1024/1024).toFixed(1)} MB`);

    console.log('4. Deobfuscating classes...');
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(jar), newZip = new AdmZip();
    let renamed = 0, skipped = 0;

    for (const e of zip.getEntries()) {
        const nm = e.entryName;
        if (e.isDirectory) continue;
        if (nm.startsWith('META-INF/')) { skipped++; continue; }
        if (nm.endsWith('.class')) {
            const obf = nm.replace(/\.class$/, '');
            const deobf = GLOBAL_RENAME_MAP.map[obf];
            const { buf: patched, patches } = rebuildClass(e.getData(), GLOBAL_RENAME_MAP);
            GLOBAL_PATCHES += patches;
            newZip.addFile((deobf || obf) + '.class', Buffer.from(patched));
            if (deobf) renamed++; else skipped++;
        } else {
            newZip.addFile(nm, e.getData());
        }
    }

    console.log(`   ${renamed} renamed, ${skipped} passthrough, ${GLOBAL_PATCHES} CP patches`);
    console.log('5. Writing output...');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    newZip.writeZip(OUT_JAR);
    console.log(`   Wrote ${(fs.statSync(OUT_JAR).size/1024/1024).toFixed(1)} MB`);
    console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
