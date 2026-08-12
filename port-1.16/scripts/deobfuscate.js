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
    "bfw": "net/minecraft/world/entity/player/Player",
    "afd": "net/minecraft/util/GsonHelper",
};

let GLOBAL_PATCHES = 0;

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
    const classMap = {};
    for (const line of text.split('\n')) {
        const t = line.trim();
        if (!t || t.startsWith('#') || t.startsWith('    ')) continue;
        const a = t.indexOf(' -> ');
        if (a === -1) continue;
        const left = t.substring(0, a);
        const right = t.substring(a + 4).replace(/:$/, '').trim();
        // Class mappings: contain dots, no spaces/parens/colons before ->
        if (!left.includes('.') || left.includes(' ') || left.includes('(') || left.includes(':')) continue;
        classMap[right] = left.trim().replace(/\./g, '/');
    }
    return classMap;
}

function applyRenames(str, renames, allKeys) {
    if (allKeys.length === 0) return { str, patches: 0 };
    let patches = 0;
    const escapedKeys = allKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = '(?<=L)(' + escapedKeys.join('|') + ')(?=[;<])|(?<![a-zA-Z0-9_/])(' + escapedKeys.join('|') + ')(?![a-zA-Z0-9_])';
    const re = new RegExp(pattern, 'g');
    str = str.replace(re, (match, descMatch, wordMatch) => {
        const matched = descMatch || wordMatch;
        const replacement = renames.get(matched);
        if (replacement) { patches++; return replacement; }
        return match;
    });
    return { str, patches };
}

function rebuildClass(buf, classMap) {
    let patches = 0;
    if (buf.length < 10 || buf.readUInt32BE(0) !== 0xCAFEBABE) return { buf, patches };

    const cpCount = buf.readUInt16BE(8);
    const renames = new Map();
    for (const [k, v] of Object.entries(REPLACE_MAP)) renames.set(k, v);

    let pos = 10;
    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos++];
        switch (tag) {
            case 1: {
                const len = buf.readUInt16BE(pos); pos += 2;
                const val = buf.toString('utf8', pos, pos + len);
                const mapped = classMap[val];
                if (mapped && mapped !== val) renames.set(val, mapped);
                pos += len;
                break;
            }
            case 3: case 4: pos += 4; break;
            case 5: case 6: pos += 8; i++; break;
            case 7: case 8: pos += 2; break;
            case 9: case 10: case 11: case 12: case 17: case 18: pos += 4; break;
            case 15: pos += 3; break;
            case 16: case 19: case 20: pos += 2; break;
            default: return { buf, patches };
        }
    }

    if (renames.size === 0) return { buf, patches };

    // Pre-compile a regex for fast needsMod check
    const allKeys = [...renames.keys()].filter(k => k.length > 1);
    const needsModRegex = allKeys.length > 0 ? new RegExp(allKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')) : null;

    const chunks = [buf.subarray(0, 10)];
    pos = 10;

    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos++];
        chunks.push(Buffer.from([tag]));

        switch (tag) {
            case 1: {
                const len = buf.readUInt16BE(pos);
                const rawStr = buf.toString('utf8', pos + 2, pos + 2 + len);
                if (needsModRegex && needsModRegex.test(rawStr)) {
                    pos += 2;
                    const { str, patches: p } = applyRenames(rawStr, renames, allKeys);
                    if (p > 0 && str.length < 65536) {
                        patches += p;
                        const lb = Buffer.alloc(2); lb.writeUInt16BE(str.length, 0);
                        chunks.push(lb, Buffer.from(str, 'utf8'));
                    } else {
                        chunks.push(buf.subarray(pos - 2, pos - 2 + 2 + len));
                    }
                } else {
                    chunks.push(buf.subarray(pos, pos + 2 + len));
                    pos += 2 + len;
                }
                pos += len;
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
    Object.assign(classMap, REPLACE_MAP);
    console.log(`   ${Object.keys(classMap).length} mappings`);

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
        if (nm.startsWith('org/lwjgl/') || nm.startsWith('META-INF/')) { skipped++; continue; }
        if (nm.endsWith('.class')) {
            const obf = nm.replace(/\.class$/, '');
            const deobf = classMap[obf];
            const { buf: patched, patches } = rebuildClass(e.getData(), classMap);
            GLOBAL_PATCHES += patches;
            newZip.addFile((deobf || obf) + '.class', Buffer.from(patched));
            if (deobf) renamed++; else skipped++;
        } else {
            newZip.addFile(nm, e.getData());
        }
    }

    console.log(`   ${renamed} renamed, ${skipped} passthrough, ${GLOBAL_PATCHES} CP patches`);

    // Add prebuilt java.net stubs directly to JAR
    const prebuiltDir = path.resolve(__dirname, '..', 'libs', 'prebuilt');
    if (fs.existsSync(prebuiltDir)) {
        function addDir(dir, prefix) {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                const entryName = prefix + entry.name;
                if (entry.isDirectory()) {
                    addDir(full, entryName + '/');
                } else {
                    newZip.addFile(entryName, fs.readFileSync(full));
                }
            }
        }
        addDir(prebuiltDir, '');
        console.log('   Added prebuilt stubs');
    }

    console.log('5. Writing output...');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    newZip.writeZip(OUT_JAR);
    console.log(`   Wrote ${(fs.statSync(OUT_JAR).size/1024/1024).toFixed(1)} MB`);
    console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
