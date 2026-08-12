const fs = require('fs');
const path = require('path');
const https = require('https');

const CLIENT_JAR_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';
const VERSION_MANIFEST = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
const OUT_DIR = path.resolve(__dirname, '..', 'libs');
const OUT_JAR = path.join(OUT_DIR, 'minecraft-1.16.5-deobf.jar');

function download(url) {
    console.log(`  GET ${url.substring(0, 80)}...`);
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return download(res.headers.location).then(resolve).catch(reject);
            }
            const chunks = [];
            res.on('data', c => chunks.push(c));
            res.on('end', () => resolve(Buffer.concat(chunks)));
            res.on('error', reject);
        }).on('error', reject);
    });
}

function parseMappings(text) {
    const classMap = {};
    const lines = text.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        if (trimmed.startsWith('    ')) continue;
        const arrow = trimmed.indexOf(' -> ');
        if (arrow === -1) continue;
        const left = trimmed.substring(0, arrow);
        const right = trimmed.substring(arrow + 4).replace(/:$/, '').trim();
        if (!left.includes('.')) continue;
        const officialName = left.trim().replace(/\./g, '/');
        classMap[right] = officialName;
    }
    return classMap;
}

function rebuildClass(buf, classMap) {
    if (buf.length < 10 || buf.readUInt32BE(0) !== 0xCAFEBABE) return buf;

    const cpCount = buf.readUInt16BE(8);
    const cpEntries = [];
    let pos = 10;
    for (let i = 1; i < cpCount; i++) {
        const start = pos;
        const tag = buf[pos++];
        const entry = { tag, start };
        switch (tag) {
            case 1: {
                const len = buf.readUInt16BE(pos); pos += 2;
                entry.value = buf.toString('utf8', pos, pos + len);
                entry.len = len;
                pos += len;
                break;
            }
            case 3: case 4: pos += 4; break;
            case 5: case 6: pos += 8; i++; break;
            case 7: case 8: pos += 2; break;
            case 9: case 10: case 11: case 12: case 17: case 18: pos += 4; break;
            case 15: pos += 3; break;
            case 16: case 19: case 20: pos += 2; break;
            default: return buf;
        }
        entry.end = pos;
        cpEntries.push(entry);
    }
    const cpEnd = pos;

    const replacements = [];
    let sizeDelta = 0;
    for (const e of cpEntries) {
        if (e.tag === 1 && e.value) {
            const mapped = classMap[e.value];
            if (mapped) {
                replacements.push({ entry: e, newVal: mapped });
                sizeDelta += mapped.length - e.len;
            }
        }
    }

    if (replacements.length === 0) return buf;

    const newSize = buf.length + sizeDelta;
    const out = Buffer.alloc(newSize);
    buf.copy(out, 0, 0, cpEnd);

    let outPos = cpEnd;
    let srcPos = cpEnd;
    let offsetShift = 0;

    for (const r of replacements) {
        const e = r.entry;
        const before = e.start - srcPos;
        if (before > 0) {
            buf.copy(out, outPos, srcPos, srcPos + before);
            outPos += before;
            srcPos += before;
        }

        out[outPos++] = 1;
        out.writeUInt16BE(r.newVal.length, outPos); outPos += 2;
        out.write(r.newVal, outPos, r.newVal.length, 'utf8'); outPos += r.newVal.length;
        srcPos = e.end;
    }

    if (srcPos < buf.length) {
        buf.copy(out, outPos, srcPos);
    }

    return out;
}

async function main() {
    console.log('=== Minecraft 1.16.5 Deobfuscator ===\n');

    console.log('1. Getting version manifest...');
    const manifest = JSON.parse((await download(VERSION_MANIFEST)).toString());
    const v1165 = manifest.versions.find(v => v.id === '1.16.5');
    if (!v1165) throw new Error('1.16.5 not found');
    const versionMeta = JSON.parse((await download(v1165.url)).toString());
    const mappingsURL = versionMeta.downloads?.client_mappings?.url;
    if (!mappingsURL) throw new Error('No mappings URL');
    console.log(`   Mappings: ${mappingsURL}`);

    console.log('2. Downloading mappings...');
    const mappingsText = (await download(mappingsURL)).toString();
    const classMap = parseMappings(mappingsText);
    console.log(`   ${Object.keys(classMap).length} class mappings`);

    console.log('3. Downloading client JAR...');
    const jarData = await download(CLIENT_JAR_URL);
    console.log(`   ${(jarData.length/1024/1024).toFixed(1)} MB`);

    console.log('4. Deobfuscating classes...');
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(jarData);
    const newZip = new AdmZip();
    const entries = zip.getEntries();
    let renamed = 0, skipped = 0;

    for (const entry of entries) {
        const name = entry.entryName;
        if (entry.isDirectory) continue;
        if (name.startsWith('org/lwjgl/') || name.startsWith('META-INF/')) { skipped++; continue; }

        if (name.endsWith('.class')) {
            const obfName = name.replace(/\.class$/, '');
            const deobfName = classMap[obfName];
            if (deobfName) {
                const data = entry.getData();
                const patched = rebuildClass(data, classMap);
                newZip.addFile(deobfName + '.class', Buffer.from(patched));
                renamed++;
            } else {
                newZip.addFile(name, entry.getData());
                skipped++;
            }
        } else {
            newZip.addFile(name, entry.getData());
        }
    }

    console.log(`   ${renamed} renamed, ${skipped} passthrough`);

    console.log('5. Writing output...');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    newZip.writeZip(OUT_JAR);
    console.log(`   Wrote ${(fs.statSync(OUT_JAR).size/1024/1024).toFixed(1)} MB to ${OUT_JAR}`);
    console.log('Done!');
}

main().catch(e => { console.error(e); process.exit(1); });
