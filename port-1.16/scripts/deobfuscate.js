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
    const renames = new Map();
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
            default: return buf;
        }
    }

    if (renames.size === 0) return buf;

    const chunks = [];

    // Copy header + cp_count
    chunks.push(buf.subarray(0, 10));

    pos = 10;

    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos++];
        chunks.push(Buffer.from([tag]));

        switch (tag) {
            case 1: {
                const len = buf.readUInt16BE(pos); pos += 2;
                let str = buf.toString('utf8', pos, pos + len);
                for (const [oldStr, newStr] of renames) {
                    let idx = 0;
                    while ((idx = str.indexOf(oldStr, idx)) !== -1) {
                        str = str.substring(0, idx) + newStr + str.substring(idx + oldStr.length);
                        idx += newStr.length;
                    }
                }
                const lenBuf = Buffer.alloc(2);
                lenBuf.writeUInt16BE(str.length, 0);
                chunks.push(lenBuf);
                chunks.push(Buffer.from(str, 'utf8'));
                pos += len;
                break;
            }
            case 3: case 4: chunks.push(buf.subarray(pos, pos + 4)); pos += 4; break;
            case 5: case 6: chunks.push(buf.subarray(pos, pos + 8)); pos += 8; i++; break;
            case 7: case 8: chunks.push(buf.subarray(pos, pos + 2)); pos += 2; break;
            case 9: case 10: case 11: case 12: case 17: case 18: chunks.push(buf.subarray(pos, pos + 4)); pos += 4; break;
            case 15: chunks.push(buf.subarray(pos, pos + 3)); pos += 3; break;
            case 16: case 19: case 20: chunks.push(buf.subarray(pos, pos + 2)); pos += 2; break;
            default: return buf;
        }
    }

    // Copy remaining bytes after constant pool
    chunks.push(buf.subarray(pos));

    return Buffer.concat(chunks);
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
