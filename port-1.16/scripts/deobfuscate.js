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
    "java/net/Proxy$Type": "org/eaglercraft/network/Proxy$Type",
    "bfw": "net/minecraft/world/entity/player/Player",
    "afd": "net/minecraft/util/GsonHelper",
    "l": "net/minecraft/CrashReport",
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
        const left = t.substring(0, a), right = t.substring(a + 4).replace(/:$/, '').trim();
        if (!left.includes('.')) continue;
        classMap[right] = left.trim().replace(/\./g, '/');
    }
    return classMap;
}

function rebuildClass(buf, classMap) {
    let patches = 0;
    if (buf.length < 10 || buf.readUInt32BE(0) !== 0xCAFEBABE) return { buf, patches };

    const cpCount = buf.readUInt16BE(8);
    const renames = new Map();
    // Always include REPLACE_MAP
    for (const [k, v] of Object.entries(REPLACE_MAP)) renames.set(k, v);

    let pos = 10;
    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos++];
        switch (tag) {
            case 1: { const l = buf.readUInt16BE(pos); pos += 2; const v = buf.toString('utf8', pos, pos + l); const m = classMap[v]; if (m && m !== v) renames.set(v, m); pos += l; break; }
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

    const chunks = [buf.subarray(0, 10)];
    pos = 10;
    const sortedKeys = [...renames.keys()].sort((a, b) => b.length - a.length);

    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos++];
        chunks.push(Buffer.from([tag]));
        switch (tag) {
            case 1: {
                const len = buf.readUInt16BE(pos); pos += 2;
                let str = buf.toString('utf8', pos, pos + len);
                for (const oldStr of sortedKeys) {
                    const newStr = renames.get(oldStr);
                    if (oldStr.length > 2) {
                        const parts = str.split(oldStr);
                        patches += parts.length - 1;
                        str = parts.join(newStr);
                    } else {
                        const esc = oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const re1 = new RegExp('(?<![a-zA-Z0-9_/])' + esc + '(?![a-zA-Z0-9_])', 'g');
                        const m1 = str.match(re1); if (m1) patches += m1.length;
                        str = str.replace(re1, newStr);
                        const re2 = new RegExp('(?<=L)' + esc + '(?=[;<])', 'g');
                        const m2 = str.match(re2); if (m2) patches += m2.length;
                        str = str.replace(re2, newStr);
                    }
                }
                const lb = Buffer.alloc(2); lb.writeUInt16BE(str.length, 0);
                chunks.push(lb, Buffer.from(str, 'utf8'));
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
    console.log(`   ${Object.keys(classMap).length} class mappings`);

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

    console.log(`   ${renamed} renamed, ${skipped} passthrough, ${GLOBAL_PATCHES} total CP patches`);

    console.log('5. Writing output...');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    newZip.writeZip(OUT_JAR);
    console.log(`   Wrote ${(fs.statSync(OUT_JAR).size/1024/1024).toFixed(1)} MB`);
    console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
