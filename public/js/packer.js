class JarPacker {
    constructor() {
        this.strings = [];
        this.stringMap = new Map();
        this.classes = [];
        this.resources = [];
        this.classData = [];
        this.resourceData = [];
    }

    addString(s) {
        if (this.stringMap.has(s)) return this.stringMap.get(s);
        const off = this._currentStringOffset();
        this.strings.push(s);
        this.stringMap.set(s, off);
        return off;
    }

    _currentStringOffset() {
        let off = 0;
        for (const s of this.strings) off += s.length + 1;
        return off;
    }

    addClass(name, superName, data) {
        const nameOff = this.addString(name);
        const superOff = this.addString(superName || 'java/lang/Object');
        const dataOff = this.classData.length;
        this.classData.push(data);
        this.classes.push({ nameOff, superOff, dataOff, dataSize: data.length });
    }

    addResource(name, data) {
        const nameOff = this.addString(name);
        const dataOff = this.resourceData.length;
        this.resourceData.push(data);
        this.resources.push({ nameOff, dataOff, dataSize: data.length });
    }

    build() {
        const stringTable = new TextEncoder().encode(this.strings.join('\0') + '\0');
        const headerSize = 4 + 4 + 4 + 4 + 4;
        const classEntrySize = this.classes.length * 16;
        const resEntrySize = this.resources.length * 12;
        const classBlockSize = this.classData.reduce((s, d) => s + d.length, 0);
        const resBlockSize = this.resourceData.reduce((s, d) => s + d.length, 0);
        const totalSize = headerSize + stringTable.length + classEntrySize + resEntrySize + classBlockSize + resBlockSize;

        const buf = new ArrayBuffer(totalSize);
        const v = new DataView(buf);
        let pos = 0;

        v.setUint32(pos, 0x4D43574A, true); pos += 4;
        v.setUint32(pos, totalSize, true); pos += 4;
        v.setUint32(pos, this.classes.length, true); pos += 4;
        v.setUint32(pos, this.resources.length, true); pos += 4;
        v.setUint32(pos, stringTable.length, true); pos += 4;

        new Uint8Array(buf).set(stringTable, pos);
        pos += stringTable.length;

        for (const c of this.classes) {
            v.setUint32(pos, c.nameOff, true); pos += 4;
            v.setUint32(pos, c.superOff, true); pos += 4;
            v.setUint32(pos, headerSize + stringTable.length + classEntrySize + resEntrySize + c.dataOff, true); pos += 4;
            v.setUint32(pos, c.dataSize, true); pos += 4;
        }

        for (const r of this.resources) {
            v.setUint32(pos, r.nameOff, true); pos += 4;
            v.setUint32(pos, headerSize + stringTable.length + classEntrySize + resEntrySize + classBlockSize + r.dataOff, true); pos += 4;
            v.setUint32(pos, r.dataSize, true); pos += 4;
        }

        for (const d of this.classData) {
            new Uint8Array(buf).set(d, pos);
            pos += d.length;
        }
        for (const d of this.resourceData) {
            new Uint8Array(buf).set(d, pos);
            pos += d.length;
        }

        return new Uint8Array(buf);
    }
}

export { JarPacker };
