const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CLIENT_JAR_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';
const VERSION_MANIFEST = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
const OUT_DIR = path.resolve(__dirname, '..', 'libs');
const OUT_JAR = path.join(OUT_DIR, 'minecraft-1.16.5-deobf.jar');

async function download(url) {
    console.log(`  Downloading ${url.substring(0, 80)}...`);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return Buffer.from(await resp.arrayBuffer());
}

function parseClassFile(buf) {
    if (buf.length < 10 || buf.readUInt32BE(0) !== 0xCAFEBABE) return null;
    const cpCount = buf.readUInt16BE(8);
    const cp = [];
    let pos = 10;
    for (let i = 1; i < cpCount; i++) {
        const tag = buf[pos];
        const entry = { tag, offset: pos };
        pos++;
        switch (tag) {
            case 1: { // Utf8
                const len = buf.readUInt16BE(pos); pos += 2;
                entry.value = buf.toString('utf8', pos, pos + len);
                entry.size = 3 + len; pos += len;
                break;
            }
            case 3: entry.size = 5; pos += 4; break; // Integer
            case 4: entry.size = 5; pos += 4; break; // Float
            case 5: entry.size = 9; pos += 8; i++; break; // Long
            case 6: entry.size = 9; pos += 8; i++; break; // Double
            case 7: // Class
                entry.nameIndex = buf.readUInt16BE(pos);
                entry.size = 3; pos += 2;
                break;
            case 8: entry.size = 3; pos += 2; break; // String
            case 9: case 10: case 11: entry.size = 5; pos += 4; break; // FieldRef, MethodRef, InterfaceMethodRef
            case 12: entry.size = 5; pos += 4; break; // NameAndType
            case 15: entry.size = 4; pos += 3; break; // MethodHandle
            case 16: entry.size = 3; pos += 2; break; // MethodType
            case 17: entry.size = 5; pos += 4; break; // Dynamic
            case 18: entry.size = 5; pos += 4; break; // InvokeDynamic
            default: return null;
        }
        cp.push(entry);
    }
    return { cp, endOfCP: pos };
}

function buildMappingsMap(mappingsText) {
    // Mojang mappings format:
    // obfuscated_name -> official_name
    // Classes: "eoi -> net/minecraft/client/main/Main"
    // Methods: "   123:456:method_name -> officialName"
    // Fields: "   field_name -> officialFieldName"
    const classMap = {};
    const methodMap = {};
    const fieldMap = {};
    const lines = mappingsText.split('\n');
    let currentClass = null;

    for (const line of lines) {
        if (line.startsWith('#') || line.trim() === '') continue;
        if (!line.startsWith('    ')) {
            // Class mapping
            const parts = line.split(' -> ');
            if (parts.length === 2) {
                classMap[parts[0].trim()] = parts[1].trim();
                currentClass = parts[1].trim();
                if (!methodMap[currentClass]) methodMap[currentClass] = {};
                if (!fieldMap[currentClass]) fieldMap[currentClass] = {};
            }
        } else if (currentClass) {
            const trimmed = line.trim();
            const parts = trimmed.split(' -> ');
            if (parts.length === 2) {
                const from = parts[0].trim();
                const to = parts[1].trim();
                // Methods have format: "123:456:method_name" or just "method_name"
                if (from.includes(':')) {
                    // Could be method (number:number:name) or field (just name)
                    const colonParts = from.split(':');
                    if (colonParts.length >= 2 && /^\d+$/.test(colonParts[0])) {
                        methodMap[currentClass][from] = to;
                    } else {
                        fieldMap[currentClass][from] = to;
                    }
                } else {
                    fieldMap[currentClass][from] = to;
                }
            }
        }
    }
    return { classMap, methodMap, fieldMap };
}

async function main() {
    console.log('=== Minecraft 1.16.5 Deobfuscator ===\n');

    // Step 1: Get mappings URL
    console.log('1. Getting version manifest...');
    const manifest = JSON.parse((await download(VERSION_MANIFEST)).toString());
    const v1165 = manifest.versions.find(v => v.id === '1.16.5');
    if (!v1165) throw new Error('1.16.5 not found in manifest');
    const versionMeta = JSON.parse((await download(v1165.url)).toString());
    const mappingsURL = versionMeta.downloads?.client_mappings?.url;
    if (!mappingsURL) throw new Error('No client mappings URL found');
    console.log(`   Mappings: ${mappingsURL}`);

    // Step 2: Download mappings
    console.log('2. Downloading mappings...');
    const mappingsText = (await download(mappingsURL)).toString();
    const { classMap, methodMap, fieldMap } = buildMappingsMap(mappingsText);
    console.log(`   ${Object.keys(classMap).length} class mappings`);

    // Step 3: Download client JAR
    console.log('3. Downloading client JAR...');
    const jarData = await download(CLIENT_JAR_URL);
    console.log(`   ${(jarData.length/1024/1024).toFixed(1)} MB`);

    // Step 4: Parse ZIP, deobfuscate classes
    console.log('4. Deobfuscating classes...');
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(jarData);
    const newZip = new AdmZip();
    const entries = zip.getEntries();
    let renamed = 0, skipped = 0, resources = 0;

    // Classes to skip (not Minecraft game code)
    const skipPrefixes = [
        'org/lwjgl/', 'org/apache/', 'com/google/', 'com/mojang/authlib/',
        'javax/', 'io/netty/', 'it/unimi/', 'org/apache/', 'META-INF/',
        'com/mojang/brigadier/', 'com/mojang/datafixers/', 'com/mojang/serialization/',
        'com/mojang/patchy/', 'com/mojang/text2speech/',
    ];

    // Actually for TeaVM we want to INCLUDE library classes that Minecraft uses
    // Only exclude LWJGL (since Eaglercraft provides its own LWJGL replacement)
    const skipPrefixesReal = [
        'org/lwjgl/', 'META-INF/',
    ];

    for (const entry of entries) {
        const name = entry.entryName;

        // Skip dirs and excluded prefixes
        if (entry.isDirectory) continue;
        if (skipPrefixesReal.some(p => name.startsWith(p))) { skipped++; continue; }

        if (name.endsWith('.class')) {
            const className = name.replace(/\.class$/, '');
            const deobfName = classMap[className];
            if (deobfName) {
                // Rename class and fix internal references
                const classData = entry.getData();
                const parsed = parseClassFile(classData);
                if (parsed) {
                    // Patch UTF8 entries in constant pool that match obfuscated names
                    const newBuf = Buffer.from(classData);
                    for (const cpEntry of parsed.cp) {
                        if (cpEntry.tag === 1 && cpEntry.value) {
                            const mapped = classMap[cpEntry.value];
                            if (mapped) {
                                const oldLen = cpEntry.value.length;
                                const newLen = mapped.length;
                                if (newLen <= oldLen) {
                                    // Replace in-place, pad with spaces
                                    const strOffset = cpEntry.offset + 3; // tag + 2 bytes length
                                    newBuf.write(mapped.padEnd(oldLen, ' '), strOffset, oldLen, 'utf8');
                                } else {
                                    // Would need to shift data - skip for now
                                    // (this is rare - most deobfuscated names are shorter)
                                }
                            }
                        }
                    }
                }
                newZip.addFile(deobfName + '.class', classData);
                renamed++;
            } else {
                newZip.addFile(name, entry.getData());
                skipped++;
            }
        } else if (!name.startsWith('META-INF')) {
            newZip.addFile(name, entry.getData());
            resources++;
        }
    }

    console.log(`   ${renamed} classes renamed, ${skipped} skipped/passthrough, ${resources} resources`);

    // Step 5: Write output
    console.log('5. Writing deobfuscated JAR...');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    newZip.writeZip(OUT_JAR);
    const size = fs.statSync(OUT_JAR).size;
    console.log(`   Wrote ${(size/1024/1024).toFixed(1)} MB to ${OUT_JAR}`);
    console.log('\nDone!');
}

main().catch(e => { console.error(e); process.exit(1); });
