const GL = {
    DEPTH_BUFFER_BIT: 0x00000100,
    STENCIL_BUFFER_BIT: 0x00000400,
    COLOR_BUFFER_BIT: 0x00004000,
    POINTS: 0x0000,
    LINES: 0x0001,
    LINE_LOOP: 0x0002,
    LINE_STRIP: 0x0003,
    TRIANGLES: 0x0004,
    TRIANGLE_STRIP: 0x0005,
    TRIANGLE_FAN: 0x0006,
    QUADS: 0x0007,
    NEVER: 0x0200,
    LESS: 0x0201,
    EQUAL: 0x0202,
    LEQUAL: 0x0203,
    GREATER: 0x0204,
    NOTEQUAL: 0x0205,
    GEQUAL: 0x0206,
    ALWAYS: 0x0207,
    ZERO: 0,
    ONE: 1,
    SRC_COLOR: 0x0300,
    ONE_MINUS_SRC_COLOR: 0x0301,
    SRC_ALPHA: 0x0302,
    ONE_MINUS_SRC_ALPHA: 0x0303,
    DST_ALPHA: 0x0304,
    ONE_MINUS_DST_ALPHA: 0x0305,
    DST_COLOR: 0x0306,
    ONE_MINUS_DST_COLOR: 0x0307,
    SRC_ALPHA_SATURATE: 0x0308,
    FRONT: 0x0404,
    BACK: 0x0405,
    FRONT_AND_BACK: 0x0408,
    CULL_FACE: 0x0B44,
    DEPTH_TEST: 0x0B71,
    BLEND: 0x0BE2,
    TEXTURE_2D: 0x0DE1,
    UNSIGNED_BYTE: 0x1401,
    UNSIGNED_SHORT: 0x1403,
    UNSIGNED_INT: 0x1405,
    FLOAT: 0x1406,
    RGBA: 0x1908,
    RGB: 0x1907,
    NEAREST: 0x2600,
    LINEAR: 0x2601,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    CLAMP: 0x2900,
    REPEAT: 0x2901,
    ARRAY_BUFFER: 0x8892,
    ELEMENT_ARRAY_BUFFER: 0x8893,
    STATIC_DRAW: 0x88E4,
    DYNAMIC_DRAW: 0x88E8,
    STREAM_DRAW: 0x88E0,
    VERTEX_SHADER: 0x8B31,
    FRAGMENT_SHADER: 0x8B30,
    COMPILE_STATUS: 0x8B81,
    LINK_STATUS: 0x8B82,
    TRUE: 1,
    FALSE: 0,
    NO_ERROR: 0,
    INVALID_ENUM: 0x0500,
    INVALID_VALUE: 0x0501,
    INVALID_OPERATION: 0x0502,
    OUT_OF_MEMORY: 0x0505,
    COLOR_ATTACHMENT0: 0x8CE0,
    FRAMEBUFFER: 0x8D40,
    RENDERBUFFER: 0x8D41,
    DEPTH_COMPONENT16: 0x81A5,
    FRAMEBUFFER_COMPLETE: 0x8CD5,
    PACK_ALIGNMENT: 0x0D05,
    UNPACK_ALIGNMENT: 0x0CF5,
    MAX_TEXTURE_SIZE: 0x0D33,
    MAX_VIEWPORT_DIMS: 0x0D3A,
    ALIASED_POINT_SIZE_RANGE: 0x846D,
    ALIASED_LINE_WIDTH_RANGE: 0x846E,
    SMOOTH_POINT_SIZE_RANGE: 0x0B12,
    SMOOTH_LINE_WIDTH_RANGE: 0x0B22,
    VERSION: 0x1F02,
    EXTENSIONS: 0x1F03,
    SHADING_LANGUAGE_VERSION: 0x8B8C,
    KEEP: 0x1E00,
    REPLACE: 0x1E01,
    INCR: 0x1E02,
    DECR: 0x1E03,
    INVERT: 0x150A,
    INCR_WRAP: 0x8507,
    DECR_WRAP: 0x8508,
    NEAREST_MIPMAP_NEAREST: 0x2700,
    LINEAR_MIPMAP_NEAREST: 0x2701,
    NEAREST_MIPMAP_LINEAR: 0x2702,
    LINEAR_MIPMAP_LINEAR: 0x2703,
    TEXTURE0: 0x84C0,
    TEXTURE1: 0x84C1,
    TEXTURE2: 0x84C2,
    TEXTURE3: 0x84C3,
    TEXTURE4: 0x84C4,
    TEXTURE5: 0x84C5,
    TEXTURE6: 0x84C6,
    TEXTURE7: 0x84C7,
    MODELVIEW: 0x1700,
    PROJECTION: 0x1701,
    TEXTURE: 0x1702,
    COLOR: 0x1800,
    DEPTH: 0x1801,
    STENCIL: 0x1802,
    VIEWPORT: 0x0BA2,
    SCISSOR_BOX: 0x0C10,
    SCISSOR_TEST: 0x0C11,
};

const GL_LWJGL_MAP = {
    0x00000100: 0x00000100,
    0x00000400: 0x00000400,
    0x00004000: 0x00004000,
    0x0B44: 0x0B44,
    0x0B71: 0x0B71,
    0x0BE2: 0x0BE2,
    0x0DE1: 0x0DE1,
    0x2900: 0x2900,
    0x2901: 0x2901,
    0x2600: 0x2600,
    0x2601: 0x2601,
    0x2800: 0x2800,
    0x2801: 0x2801,
    0x2802: 0x2802,
    0x2803: 0x2803,
    0x8892: 0x8892,
    0x8893: 0x8893,
    0x88E4: 0x88E4,
    0x88E8: 0x88E8,
    0x8B31: 0x8B31,
    0x8B30: 0x8B30,
    0x1908: 0x1908,
    0x1907: 0x1907,
    0x1401: 0x1401,
    0x1403: 0x1403,
    0x1406: 0x1406,
    0x0201: 0x0201,
    0x0202: 0x0202,
    0x0203: 0x0203,
    0x0204: 0x0204,
    0x0302: 0x0302,
    0x0303: 0x0303,
    0x0304: 0x0304,
    0x0305: 0x0305,
    0x0306: 0x0306,
    0x0004: 0x0004,
    0x0005: 0x0005,
    0x0006: 0x0006,
    0x0007: 0x0007,
    0x0000: 0x0000,
    0x0001: 0x0001,
    0x0002: 0x0002,
    0x84C0: 0x84C0,
    0x84C1: 0x84C1,
    0x84C2: 0x84C2,
    0x84C3: 0x84C3,
    0x84C4: 0x84C4,
    0x84C5: 0x84C5,
    0x84C6: 0x84C6,
    0x84C7: 0x84C7,
    0x8CE0: 0x8CE0,
    0x8D40: 0x8D40,
    0x8D41: 0x8D41,
    0x0C11: 0x0C11,
    0x0BA2: 0x0BA2,
};

function mapGlConstant(lwjglConst) {
    return GL_LWJGL_MAP[lwjglConst] !== undefined ? GL_LWJGL_MAP[lwjglConst] : lwjglConst;
}

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.textures = {};
        this.buffers = {};
        this.programs = {};
        this.shaders = {};
        this.currentProgram = null;
        this.clearColor = [0, 0, 0, 1];
        this.width = 854;
        this.height = 480;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsTime = 0;
        this.displayCreated = false;
    }

    init() {
        try {
            this.gl = this.canvas.getContext('webgl2', {
                alpha: false,
                antialias: false,
                depth: true,
                stencil: true,
                preserveDrawingBuffer: false,
                powerPreference: 'high-performance'
            });
            if (!this.gl) {
                this.gl = this.canvas.getContext('webgl', {
                    alpha: false,
                    antialias: false,
                    depth: true,
                    stencil: true,
                    preserveDrawingBuffer: false,
                });
            }
        } catch (e) {
            console.error('WebGL init failed:', e);
        }
        if (this.gl) {
            this.gl.enable(this.gl.DEPTH_TEST);
            this.gl.enable(this.gl.CULL_FACE);
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.clearColor(0.4, 0.7, 1.0, 1.0);
            this.gl.viewport(0, 0, this.width, this.height);
        }
        this.displayCreated = true;
        return !!this.gl;
    }

    clear(mask) {
        const gl = this.gl;
        if (!gl) return;
        let glMask = 0;
        if (mask & GL.COLOR_BUFFER_BIT) glMask |= gl.COLOR_BUFFER_BIT;
        if (mask & GL.DEPTH_BUFFER_BIT) glMask |= gl.DEPTH_BUFFER_BIT;
        if (mask & GL.STENCIL_BUFFER_BIT) glMask |= gl.STENCIL_BUFFER_BIT;
        gl.clear(glMask);
    }

    clearColor(r, g, b, a) {
        this.clearColor = [r, g, b, a];
        if (this.gl) this.gl.clearColor(r, g, b, a);
    }

    viewport(x, y, w, h) {
        this.width = w;
        this.height = h;
        if (this.gl) this.gl.viewport(x, y, w, h);
    }

    enable(cap) {
        if (this.gl) this.gl.enable(mapGlConstant(cap));
    }

    disable(cap) {
        if (this.gl) this.gl.disable(mapGlConstant(cap));
    }

    bindTexture(target, texture) {
        if (this.gl) {
            const t = this.textures[texture];
            if (t) this.gl.bindTexture(mapGlConstant(target), t);
            else this.gl.bindTexture(mapGlConstant(target), null);
        }
    }

    genTextures(n, ptr) {
        if (!this.gl) return;
        for (let i = 0; i < n; i++) {
            const tex = this.gl.createTexture();
            const id = Object.keys(this.textures).length + 1;
            this.textures[id] = tex;
            Module.setValue(ptr + i * 4, id, 'i32');
        }
    }

    deleteTextures(n, ptr) {
        if (!this.gl) return;
        for (let i = 0; i < n; i++) {
            const id = Module.getValue(ptr + i * 4, 'i32');
            const tex = this.textures[id];
            if (tex) {
                this.gl.deleteTexture(tex);
                delete this.textures[id];
            }
        }
    }

    texImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
        if (!this.gl) return;
        const glTarget = mapGlConstant(target);
        const glFormat = format === GL.RGBA ? this.gl.RGBA : this.gl.RGB;
        const glType = type === GL.UNSIGNED_BYTE ? this.gl.UNSIGNED_BYTE : this.gl.UNSIGNED_SHORT;
        const glInternal = internalFormat === GL.RGBA ? this.gl.RGBA : this.gl.RGB;

        if (pixels !== 0 && pixels !== null) {
            const size = width * height * (format === GL.RGBA ? 4 : 3);
            const data = new Uint8Array(Module.HEAPU8.buffer, pixels, size);
            this.gl.texImage2D(glTarget, level, glInternal, width, height, border, glFormat, glType, data);
        } else {
            this.gl.texImage2D(glTarget, level, glInternal, width, height, border, glFormat, glType, null);
        }
    }

    drawArrays(mode, first, count) {
        if (this.gl) this.gl.drawArrays(mapGlConstant(mode), first, count);
    }

    drawElements(mode, count, type, offset) {
        if (this.gl) this.gl.drawElements(mapGlConstant(mode), count, mapGlConstant(type), offset);
    }

    genBuffers(n, ptr) {
        if (!this.gl) return;
        for (let i = 0; i < n; i++) {
            const buf = this.gl.createBuffer();
            const id = Object.keys(this.buffers).length + 1;
            this.buffers[id] = buf;
            Module.setValue(ptr + i * 4, id, 'i32');
        }
    }

    deleteBuffers(n, ptr) {
        if (!this.gl) return;
        for (let i = 0; i < n; i++) {
            const id = Module.getValue(ptr + i * 4, 'i32');
            const buf = this.buffers[id];
            if (buf) {
                this.gl.deleteBuffer(buf);
                delete this.buffers[id];
            }
        }
    }

    bindBuffer(target, buffer) {
        if (!this.gl) return;
        const t = this.buffers[buffer];
        if (t) this.gl.bindBuffer(mapGlConstant(target), t);
    }

    bufferData(target, size, data, usage) {
        if (!this.gl) return;
        const glTarget = mapGlConstant(target);
        const glUsage = mapGlConstant(usage);
        if (data !== 0 && data !== null) {
            const arr = new Uint8Array(Module.HEAPU8.buffer, data, size);
            this.gl.bufferData(glTarget, arr, glUsage);
        } else {
            this.gl.bufferData(glTarget, size, glUsage);
        }
    }

    bufferSubData(target, offset, size, data) {
        if (!this.gl) return;
        if (data !== 0 && data !== null) {
            const arr = new Uint8Array(Module.HEAPU8.buffer, data, size);
            this.gl.bufferSubData(mapGlConstant(target), offset, arr);
        }
    }

    createShader(type) {
        if (!this.gl) return 0;
        const glType = type === GL.VERTEX_SHADER ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER;
        const shader = this.gl.createShader(glType);
        const id = Object.keys(this.shaders).length + 1;
        this.shaders[id] = shader;
        return id;
    }

    shaderSource(shaderId, sourcePtr) {
        if (!this.gl) return;
        const shader = this.shaders[shaderId];
        if (!shader) return;
        const source = Module.UTF8ToString(sourcePtr);
        this.gl.shaderSource(shader, source);
    }

    compileShader(shaderId) {
        if (!this.gl) return;
        const shader = this.shaders[shaderId];
        if (shader) this.gl.compileShader(shader);
    }

    createProgram() {
        if (!this.gl) return 0;
        const prog = this.gl.createProgram();
        const id = Object.keys(this.programs).length + 1;
        this.programs[id] = prog;
        return id;
    }

    attachShader(progId, shaderId) {
        if (!this.gl) return;
        const prog = this.programs[progId];
        const shader = this.shaders[shaderId];
        if (prog && shader) this.gl.attachShader(prog, shader);
    }

    linkProgram(progId) {
        if (!this.gl) return;
        const prog = this.programs[progId];
        if (prog) this.gl.linkProgram(prog);
    }

    useProgram(progId) {
        if (!this.gl) return;
        this.currentProgram = progId;
        const prog = this.programs[progId];
        this.gl.useProgram(prog || null);
    }

    getUniformLocation(progId, namePtr) {
        if (!this.gl) return -1;
        const prog = this.programs[progId];
        if (!prog) return -1;
        const name = Module.UTF8ToString(namePtr);
        const loc = this.gl.getUniformLocation(prog, name);
        return loc ? 1 : -1;
    }

    getAttribLocation(progId, namePtr) {
        if (!this.gl) return -1;
        const prog = this.programs[progId];
        if (!prog) return -1;
        const name = Module.UTF8ToString(namePtr);
        return this.gl.getAttribLocation(prog, name);
    }

    uniformMatrix4fv(location, count, transpose, valuePtr) {
        if (!this.gl) return;
        const values = new Float32Array(Module.HEAPF32.buffer, valuePtr, 16 * count);
        this.gl.uniformMatrix4fv(location, !!transpose, values);
    }

    vertexAttribPointer(index, size, type, normalized, stride, offset) {
        if (!this.gl) return;
        const glType = type === GL.FLOAT ? this.gl.FLOAT : this.gl.UNSIGNED_BYTE;
        this.gl.vertexAttribPointer(index, size, glType, !!normalized, stride, offset);
    }

    enableVertexAttribArray(index) {
        if (this.gl) this.gl.enableVertexAttribArray(index);
    }

    disableVertexAttribArray(index) {
        if (this.gl) this.gl.disableVertexAttribArray(index);
    }

    swapBuffers() {
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
        }
    }

    getError() {
        if (!this.gl) return GL.NO_ERROR;
        return this.gl.getError();
    }

    scissor(x, y, w, h) {
        if (this.gl) this.gl.scissor(x, y, w, h);
    }

    depthFunc(func) {
        if (this.gl) this.gl.depthFunc(mapGlConstant(func));
    }

    depthMask(flag) {
        if (this.gl) this.gl.depthMask(!!flag);
    }

    colorMask(r, g, b, a) {
        if (this.gl) this.gl.colorMask(!!r, !!g, !!b, !!a);
    }

    blendFunc(sfactor, dfactor) {
        if (this.gl) this.gl.blendFunc(mapGlConstant(sfactor), mapGlConstant(dfactor));
    }

    cullFace(mode) {
        if (this.gl) this.gl.cullFace(mapGlConstant(mode));
    }

    frontFace(mode) {
        if (this.gl) this.gl.frontFace(mapGlConstant(mode));
    }

    lineWidth(width) {
        if (this.gl) this.gl.lineWidth(width);
    }

    polygonOffset(factor, units) {
        if (this.gl) this.gl.polygonOffset(factor, units);
    }

    activeTexture(texture) {
        if (this.gl) this.gl.activeTexture(mapGlConstant(texture));
    }

    texParameteri(target, pname, param) {
        if (!this.gl) return;
        const t = mapGlConstant(target);
        const p = mapGlConstant(pname);
        const v = mapGlConstant(param);
        this.gl.texParameteri(t, p, v);
    }

    pixelStorei(pname, param) {
        if (this.gl) this.gl.pixelStorei(mapGlConstant(pname), param);
    }

    generateMipmap(target) {
        if (this.gl) this.gl.generateMipmap(mapGlConstant(target));
    }

    readPixels(x, y, width, height, format, type, pixels) {
        if (!this.gl || !pixels) return;
        const glFormat = format === GL.RGBA ? this.gl.RGBA : this.gl.RGB;
        const arr = new Uint8Array(Module.HEAPU8.buffer, pixels, width * height * 4);
        this.gl.readPixels(x, y, width, height, glFormat, this.gl.UNSIGNED_BYTE, arr);
    }

    createWindow(width, height, title) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        if (!this.displayCreated) {
            this.init();
        }
        if (this.gl) {
            this.gl.viewport(0, 0, width, height);
        }
    }

    setDisplayMode(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        if (this.gl) {
            this.gl.viewport(0, 0, width, height);
        }
    }
}

const renderer = new Renderer(document.getElementById('game-canvas'));
export { renderer, GL };
