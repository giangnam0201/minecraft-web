const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

const JAR_URL = 'https://piston-data.mojang.com/v1/objects/37fd3c903861eeff3bc24b71eed48f828b5269c8/client.jar';
const OUT_DIR = path.resolve(__dirname, '..', 'public');
const OUT_FILE = path.join(OUT_DIR, 'minecraft.blob');

function download(url) {
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

function* zipEntries(buf) {
    let pos = 0;
    while (pos < buf.length - 30) {
        if (buf.readUInt32LE(pos) !== 0x04034b50) { pos++; continue; }
        const comp = buf.readUInt16LE(pos + 8);
        let cs = buf.readUInt32LE(pos + 18);
        let us = buf.readUInt32LE(pos + 22);
        const nl = buf.readUInt16LE(pos + 26);
        const el = buf.readUInt16LE(pos + 28);
        const name = buf.toString('utf8', pos + 30, pos + 30 + nl);
        const fs = pos + 30 + nl + el;
        const flags = buf.readUInt16LE(pos + 6);

        if ((flags & 0x0008) && cs === 0) {
            for (let i = fs; i < buf.length - 4; i++) {
                if (buf[i]===0x50&&buf[i+1]===0x4B&&buf[i+2]===0x03&&buf[i+3]===0x04) { cs = i - fs; break; }
            }
            if (cs <= 0) { pos = fs; continue; }
        }

        let data;
        if (comp === 0) {
            data = buf.subarray(fs, fs + us);
        } else if (comp === 8) {
            try {
                data = zlib.inflateRawSync(buf.subarray(fs, fs + cs));
            } catch(e) {
                try { data = zlib.inflateSync(buf.subarray(fs, fs + cs)); } catch(e2) {}
            }
        }

        yield { name, data };
        pos = fs + (comp > 0 ? cs : us);
    }
}

// Build packed blob format:
// [4] magic 0x4D43574A
// [4] total_size
// [4] class_count
// [4] resource_count
// [4] string_table_size
// [string_table: \0-separated]
// [class_entry * class_count: name_off, super_off, data_off, data_sz (4+4+4+4)]
// [resource_entry * resource_count: name_off, data_off, data_sz (4+4+4)]
// [class_data...]
// [resource_data...]

async function main() {
    console.log('Downloading Minecraft JAR...');
    const jar = await download(JAR_URL);
    console.log(`Downloaded ${(jar.length/1024/1024).toFixed(1)} MB`);

    const classes = [];
    const resources = [];
    const strings = new Map();
    const strs = [];

    function addString(s) {
        if (strings.has(s)) return strings.get(s);
        let off = 0;
        for (const x of strs) off += x.length + 1;
        strings.set(s, off);
        strs.push(s);
        return off;
    }

    const classDataBuffers = [];
    const resourceDataBuffers = [];
    let classCount = 0, resourceCount = 0;

    for (const entry of zipEntries(jar)) {
        if (!entry.data) continue;
        if (entry.name.endsWith('.class')) {
            const className = entry.name.replace(/\.class$/, '').replace(/\\/g, '/');
            const nameOff = addString(className);
            const superOff = addString('java/lang/Object');
            const dataOff = classDataBuffers.reduce((s, b) => s + b.length, 0);
            classDataBuffers.push(entry.data);
            classes.push({ nameOff, superOff, dataOff, dataSize: entry.data.length });
            classCount++;
        } else if (!entry.name.endsWith('/') && !entry.name.startsWith('META-INF')) {
            const nameOff = addString(entry.name);
            const dataOff = resourceDataBuffers.reduce((s, b) => s + b.length, 0);
            resourceDataBuffers.push(entry.data);
            resources.push({ nameOff, dataOff, dataSize: entry.data.length });
            resourceCount++;
        }
        if (classCount % 100 === 0) {
            console.log(`  Extracted: ${classCount} classes, ${resourceCount} resources...`);
        }
    }

    console.log(`Packing ${classCount} classes, ${resourceCount} resources...`);

    const stringBytes = Buffer.concat(strs.map(s => Buffer.concat([Buffer.from(s, 'utf8'), Buffer.alloc(1)])));
    const classBlock = Buffer.concat(classDataBuffers);
    const resBlock = Buffer.concat(resourceDataBuffers);
    const headerSize = 20;
    const classEntriesSize = classes.length * 16;
    const resEntriesSize = resources.length * 12;
    const dataStart = headerSize + stringBytes.length + classEntriesSize + resEntriesSize;

    const totalSize = dataStart + classBlock.length + resBlock.length;
    const buf = Buffer.alloc(totalSize);

    let pos = 0;
    buf.writeUInt32LE(0x4D43574A, pos); pos += 4;
    buf.writeUInt32LE(totalSize, pos); pos += 4;
    buf.writeUInt32LE(classCount, pos); pos += 4;
    buf.writeUInt32LE(resourceCount, pos); pos += 4;
    buf.writeUInt32LE(stringBytes.length, pos); pos += 4;

    stringBytes.copy(buf, pos); pos += stringBytes.length;

    for (const c of classes) {
        buf.writeUInt32LE(c.nameOff, pos); pos += 4;
        buf.writeUInt32LE(c.superOff, pos); pos += 4;
        buf.writeUInt32LE(dataStart + c.dataOff, pos); pos += 4;
        buf.writeUInt32LE(c.dataSize, pos); pos += 4;
    }
    for (const r of resources) {
        buf.writeUInt32LE(r.nameOff, pos); pos += 4;
        buf.writeUInt32LE(dataStart + classBlock.length + r.dataOff, pos); pos += 4;
        buf.writeUInt32LE(r.dataSize, pos); pos += 4;
    }

    classBlock.copy(buf, pos); pos += classBlock.length;
    resBlock.copy(buf, pos);

    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(OUT_FILE, buf);
    console.log(`Wrote ${(buf.length/1024/1024).toFixed(1)} MB to ${OUT_FILE}`);
    console.log(`  Classes: ${classCount}, Resources: ${resourceCount}`);
}

main().catch(e => { console.error(e); process.exit(1); });
