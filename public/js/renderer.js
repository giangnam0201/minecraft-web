const GL = {
    DEPTH_BUFFER_BIT:0x100,STENCIL_BUFFER_BIT:0x400,COLOR_BUFFER_BIT:0x4000,
    POINTS:0x0,LINES:0x1,LINE_LOOP:0x2,LINE_STRIP:0x3,TRIANGLES:0x4,
    TRIANGLE_STRIP:0x5,TRIANGLE_FAN:0x6,QUADS:0x7,QUAD_STRIP:0x8,POLYGON:0x9,
    NEVER:0x200,LESS:0x201,EQUAL:0x202,LEQUAL:0x203,GREATER:0x204,
    NOTEQUAL:0x205,GEQUAL:0x206,ALWAYS:0x207,
    ZERO:0,ONE:1,SRC_COLOR:0x300,ONE_MINUS_SRC_COLOR:0x301,SRC_ALPHA:0x302,
    ONE_MINUS_SRC_ALPHA:0x303,DST_ALPHA:0x304,ONE_MINUS_DST_ALPHA:0x305,
    DST_COLOR:0x306,ONE_MINUS_DST_COLOR:0x307,SRC_ALPHA_SATURATE:0x308,
    FRONT:0x404,BACK:0x405,FRONT_AND_BACK:0x408,
    CULL_FACE:0xB44,DEPTH_TEST:0xB71,BLEND:0xBE2,ALPHA_TEST:0xBC0,
    TEXTURE_2D:0xDE1,LIGHTING:0xB50,LIGHT0:0x4000,LIGHT1:0x4001,
    COLOR_MATERIAL:0xB57,FOG:0xB60,NORMALIZE:0xBA1,RESCALE_NORMAL:0x803A,
    SCISSOR_TEST:0xC11,STENCIL_TEST:0xB90,
    UNSIGNED_BYTE:0x1401,UNSIGNED_SHORT:0x1403,UNSIGNED_INT:0x1405,
    FLOAT:0x1406,DOUBLE:0x140A,BYTE:0x1400,SHORT:0x1402,INT:0x1404,
    RGBA:0x1908,RGB:0x1907,RGBA8:0x8058,BGRA:0x80E1,
    DEPTH_COMPONENT:0x1902,DEPTH_COMPONENT16:0x81A5,
    NEAREST:0x2600,LINEAR:0x2601,
    NEAREST_MIPMAP_NEAREST:0x2700,LINEAR_MIPMAP_NEAREST:0x2701,
    NEAREST_MIPMAP_LINEAR:0x2702,LINEAR_MIPMAP_LINEAR:0x2703,
    TEXTURE_MAG_FILTER:0x2800,TEXTURE_MIN_FILTER:0x2801,
    TEXTURE_WRAP_S:0x2802,TEXTURE_WRAP_T:0x2803,
    CLAMP:0x2900,REPEAT:0x2901,CLAMP_TO_EDGE:0x812F,
    TEXTURE_ENV:0x2300,TEXTURE_ENV_MODE:0x2200,
    TEXTURE_ENV_COLOR:0x2201,MODULATE:0x2100,DECAL:0x2101,BLEND_COLOR:0x8005,
    REPLACE:0x1E01,ADD:0x104,COMBINE:0x8570,COMBINE_RGB:0x8571,
    ARRAY_BUFFER:0x8892,ELEMENT_ARRAY_BUFFER:0x8893,
    STATIC_DRAW:0x88E4,DYNAMIC_DRAW:0x88E8,STREAM_DRAW:0x88E0,
    VERTEX_SHADER:0x8B31,FRAGMENT_SHADER:0x8B30,
    COMPILE_STATUS:0x8B81,LINK_STATUS:0x8B82,
    TRUE:1,FALSE:0,NO_ERROR:0,INVALID_ENUM:0x500,INVALID_VALUE:0x501,
    INVALID_OPERATION:0x502,OUT_OF_MEMORY:0x505,STACK_OVERFLOW:0x503,
    STACK_UNDERFLOW:0x504,
    COLOR_ATTACHMENT0:0x8CE0,FRAMEBUFFER:0x8D40,RENDERBUFFER:0x8D41,
    FRAMEBUFFER_COMPLETE:0x8CD5,
    PACK_ALIGNMENT:0xD05,UNPACK_ALIGNMENT:0xCF5,
    UNPACK_ROW_LENGTH:0xCF2,UNPACK_SKIP_PIXELS:0xCF4,UNPACK_SKIP_ROWS:0xCF3,
    MAX_TEXTURE_SIZE:0xD33,MAX_VIEWPORT_DIMS:0xD3A,
    VERSION:0x1F02,EXTENSIONS:0x1F03,RENDERER:0x1F01,VENDOR:0x1F00,
    SHADING_LANGUAGE_VERSION:0x8B8C,
    KEEP:0x1E00,INCR:0x1E02,DECR:0x1E03,INVERT:0x150A,
    INCR_WRAP:0x8507,DECR_WRAP:0x8508,
    TEXTURE0:0x84C0,TEXTURE1:0x84C1,TEXTURE2:0x84C2,TEXTURE3:0x84C3,
    TEXTURE4:0x84C4,TEXTURE5:0x84C5,TEXTURE6:0x84C6,TEXTURE7:0x84C7,
    TEXTURE8:0x84C8,TEXTURE9:0x84C9,TEXTURE10:0x84CA,TEXTURE11:0x84CB,
    MODELVIEW:0x1700,PROJECTION:0x1701,TEXTURE_MATRIX:0x1702,
    COLOR:0x1800,DEPTH:0x1801,STENCIL:0x1802,
    VIEWPORT:0xBA2,SCISSOR_BOX:0xC10,
    MODELVIEW_MATRIX:0xBA6,PROJECTION_MATRIX:0xBA7,
    MAX_MODELVIEW_STACK_DEPTH:0xD36,MAX_PROJECTION_STACK_DEPTH:0xD38,
    MAX_TEXTURE_STACK_DEPTH:0xD39,
    SMOOTH:0x1D01,FLAT:0x1D00,
    PERSPECTIVE_CORRECTION_HINT:0xC50,FASTEST:0x1100,NICEST:0x1102,
    FOG_MODE:0xB65,FOG_DENSITY:0xB62,FOG_START:0xB63,FOG_END:0xB64,
    FOG_COLOR:0xB66,EXP:0x800,EXP2:0x801,LINEAR_FOG:0x2601,
    LIGHT_MODEL_AMBIENT:0xB53,LIGHT_MODEL_TWO_SIDE:0xB52,
    AMBIENT:0x1200,DIFFUSE:0x1201,SPECULAR:0x1202,
    POSITION:0x1203,SPOT_DIRECTION:0x1204,SPOT_EXPONENT:0x1205,
    SPOT_CUTOFF:0x1206,CONSTANT_ATTENUATION:0x1207,
    LINEAR_ATTENUATION:0x1208,QUADRATIC_ATTENUATION:0x1209,
    EMISSION:0x1600,SHININESS:0x1601,AMBIENT_AND_DIFFUSE:0x1602,
    COLOR_INDEXES:0x1603,
    POINT_SMOOTH:0xB10,POINT_SIZE:0xB11,LINE_SMOOTH:0xB20,LINE_WIDTH:0xB21
};

const GL_CONST_MAP = {};
for (const k in GL) GL_CONST_MAP[GL[k]] = GL[k];

class Matrix4 {
    constructor() { this.data = new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]); }
    identity() { this.data.set([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]); return this; }
    copyFrom(m) { this.data.set(m.data); return this; }
    multiply(b) {
        const a=this.data,e=b.data,r=new Float32Array(16);
        for(let i=0;i<4;i++) for(let j=0;j<4;j++) { let s=0; for(let k=0;k<4;k++) s+=a[k*4+j]*e[i*4+k]; r[i*4+j]=s; }
        this.data.set(r); return this;
    }
    translate(x,y,z) {
        const m=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]);
        const a=this.data.slice(),r=new Float32Array(16);
        for(let i=0;i<4;i++) for(let j=0;j<4;j++) { let s=0; for(let k=0;k<4;k++) s+=a[k*4+j]*m[i*4+k]; r[i*4+j]=s; }
        this.data.set(r); return this;
    }
    rotate(a,x,y,z) {
        const c=Math.cos(a*Math.PI/180),s=Math.sin(a*Math.PI/180),ic=1-c;
        const m=new Float32Array([
            x*x*ic+c,x*y*ic+z*s,x*z*ic-y*s,0,
            y*x*ic-z*s,y*y*ic+c,y*z*ic+x*s,0,
            z*x*ic+y*s,z*y*ic-x*s,z*z*ic+c,0,
            0,0,0,1
        ]);
        const a_=this.data.slice(),r=new Float32Array(16);
        for(let i=0;i<4;i++) for(let j=0;j<4;j++) { let sum=0; for(let k=0;k<4;k++) sum+=a_[k*4+j]*m[i*4+k]; r[i*4+j]=sum; }
        this.data.set(r); return this;
    }
    scale(x,y,z) {
        const m=new Float32Array([x,0,0,0,0,y,0,0,0,0,z,0,0,0,0,1]);
        const a=this.data.slice(),r=new Float32Array(16);
        for(let i=0;i<4;i++) for(let j=0;j<4;j++) { let s_=0; for(let k=0;k<4;k++) s_+=a[k*4+j]*m[i*4+k]; r[i*4+j]=s_; }
        this.data.set(r); return this;
    }
    ortho(l,r,b,t,n,f) {
        this.identity();
        this.data[0]=2/(r-l); this.data[5]=2/(t-b); this.data[10]=-2/(f-n);
        this.data[12]=-(r+l)/(r-l); this.data[13]=-(t+b)/(t-b); this.data[14]=-(f+n)/(f-n);
        return this;
    }
    frustum(l,r,b,t,n,f) {
        this.identity();
        this.data[0]=2*n/(r-l); this.data[5]=2*n/(t-b);
        this.data[8]=(r+l)/(r-l); this.data[9]=(t+b)/(t-b);
        this.data[10]=-(f+n)/(f-n); this.data[11]=-1;
        this.data[14]=-2*f*n/(f-n); this.data[15]=0;
        return this;
    }
    perspective(fov,aspect,n,f) {
        const t=n*Math.tan(fov*Math.PI/360);
        return this.frustum(-t*aspect,t*aspect,-t,t,n,f);
    }
}

class DisplayList {
    constructor(){ this.commands=[]; }
    addCmd(type,args){ this.commands.push({type,args:args.slice()}); }
}

const IMM_SHADER_VS = `#version 300 es
precision highp float;
uniform mat4 u_mvp;
uniform mat4 u_textureMatrix;
in vec4 a_pos;
in vec4 a_color;
in vec2 a_texcoord;
in vec3 a_normal;
out vec4 v_color;
out vec2 v_texcoord;
out vec3 v_normal;
out vec3 v_worldPos;
void main(){
    vec4 wp = u_mvp * a_pos;
    gl_Position = wp;
    v_color = a_color;
    v_texcoord = (u_textureMatrix * vec4(a_texcoord,0,1)).xy;
    v_normal = a_normal;
    v_worldPos = a_pos.xyz;
}`;

const IMM_SHADER_FS = `#version 300 es
precision highp float;
uniform sampler2D u_texture;
uniform bool u_useTexture;
uniform bool u_useLighting;
uniform bool u_useFog;
uniform vec4 u_fogColor;
uniform float u_fogStart;
uniform float u_fogEnd;
uniform int u_fogMode;
uniform vec4 u_lightAmbient;
uniform vec4 u_materialAmbient;
uniform vec4 u_materialDiffuse;
uniform float u_alphaTest;
uniform bool u_useAlphaTest;
in vec4 v_color;
in vec2 v_texcoord;
in vec3 v_normal;
in vec3 v_worldPos;
out vec4 fragColor;
void main(){
    vec4 col = v_color;
    if(u_useTexture){
        vec4 tex = texture(u_texture, v_texcoord);
        col = col * tex;
    }
    if(u_useAlphaTest && col.a < u_alphaTest) discard;
    if(u_useFog){
        float dist = length(v_worldPos);
        float fogFactor = 1.0;
        if(u_fogMode == 0){ fogFactor = (u_fogEnd - dist)/(u_fogEnd - u_fogStart); }
        else if(u_fogMode == 1){ fogFactor = exp(-u_fogStart * dist); }
        else if(u_fogMode == 2){ fogFactor = exp(-u_fogStart * u_fogStart * dist * dist); }
        fogFactor = clamp(fogFactor, 0.0, 1.0);
        col = mix(u_fogColor, col, fogFactor);
    }
    fragColor = col;
}`;

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = null;
        this.width = 854;
        this.height = 480;

        this.textures = [null];
        this.buffers = [null];
        this.programs = [null];
        this.shaders = [null];

        this.currentProgram = 0;
        this.currentTexture = [null,null,null,null,null,null,null,null];
        this.activeTextureUnit = 0;

        this.clearColor = [0,0,0,1];
        this.clearDepth = 1;
        this.clearStencil = 0;

        this.blendSrc = GL.SRC_ALPHA;
        this.blendDst = GL.ONE_MINUS_SRC_ALPHA;

        this.depthFunc = GL.LEQUAL;
        this.depthMask = true;
        this.colorMask = [true,true,true,true];
        this.cullFace = GL.BACK;
        this.frontFace = GL.CCW;
        this.shadeModel = GL.SMOOTH;
        this.polygonOffsetFactor = 0;
        this.polygonOffsetUnits = 0;

        this.fogMode = GL.EXP;
        this.fogColor = [0,0,0,0];
        this.fogStart = 0;
        this.fogEnd = 1;
        this.fogDensity = 1;

        this.alphaFunc = GL.ALWAYS;
        this.alphaRef = 0;

        this.lightAmbient = [0,0,0,1];
        this.materialAmbient = [0.2,0.2,0.2,1];
        this.materialDiffuse = [0.8,0.8,0.8,1];

        this.matrixMode = GL.MODELVIEW;
        this.matrixStack = {
            [GL.MODELVIEW]: [new Matrix4()],
            [GL.PROJECTION]: [new Matrix4()],
            [GL.TEXTURE_MATRIX]: [new Matrix4()]
        };

        this.displayLists = {};
        this.recordingDL = 0;
        this.recordingCmds = null;

        this.immMode = 0;
        this.immVerts = [];
        this.immTexCoords = [];
        this.immColors = [];
        this.immNormals = [];
        this.immCurrentColor = [1,1,1,1];
        this.immCurrentTexCoord = [0,0];
        this.immCurrentNormal = [0,0,1];

        this.immShader = 0;
        this.immVAO = null;
        this.immVBO = null;
        this.immProgramInfo = null;

        this.needsInit = true;
    }

    init() {
        if (!this.needsInit) return true;
        this.needsInit = false;
        try {
            this.gl = this.canvas.getContext('webgl2', {
                alpha:false,antialias:false,depth:true,stencil:true,
                preserveDrawingBuffer:false,powerPreference:'high-performance'
            });
        } catch(e) {}
        if (!this.gl) return false;
        const gl = this.gl;

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.4,0.7,1.0,1.0);
        gl.viewport(0,0,this.width,this.height);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.PACK_ALIGNMENT, 1);

        const vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, IMM_SHADER_VS);
        gl.compileShader(vs);
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, IMM_SHADER_FS);
        gl.compileShader(fs);
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        this.immShader = prog;
        this.immVAO = gl.createVertexArray();
        gl.bindVertexArray(this.immVAO);
        this.immVBO = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.immVBO);
        gl.bufferData(gl.ARRAY_BUFFER, 1024*1024*4, gl.DYNAMIC_DRAW);
        gl.bindVertexArray(null);

        this.immProgramInfo = {
            program: prog,
            u_mvp: gl.getUniformLocation(prog, 'u_mvp'),
            u_textureMatrix: gl.getUniformLocation(prog, 'u_textureMatrix'),
            u_texture: gl.getUniformLocation(prog, 'u_texture'),
            u_useTexture: gl.getUniformLocation(prog, 'u_useTexture'),
            u_useLighting: gl.getUniformLocation(prog, 'u_useLighting'),
            u_useFog: gl.getUniformLocation(prog, 'u_useFog'),
            u_fogColor: gl.getUniformLocation(prog, 'u_fogColor'),
            u_fogStart: gl.getUniformLocation(prog, 'u_fogStart'),
            u_fogEnd: gl.getUniformLocation(prog, 'u_fogEnd'),
            u_fogMode: gl.getUniformLocation(prog, 'u_fogMode'),
            u_lightAmbient: gl.getUniformLocation(prog, 'u_lightAmbient'),
            u_materialAmbient: gl.getUniformLocation(prog, 'u_materialAmbient'),
            u_materialDiffuse: gl.getUniformLocation(prog, 'u_materialDiffuse'),
            u_alphaTest: gl.getUniformLocation(prog, 'u_alphaTest'),
            u_useAlphaTest: gl.getUniformLocation(prog, 'u_useAlphaTest'),
            a_pos: gl.getAttribLocation(prog, 'a_pos'),
            a_color: gl.getAttribLocation(prog, 'a_color'),
            a_texcoord: gl.getAttribLocation(prog, 'a_texcoord'),
            a_normal: gl.getAttribLocation(prog, 'a_normal'),
        };

        return true;
    }

    get curMatrix() { return this.matrixStack[this.matrixMode][this.matrixStack[this.matrixMode].length-1]; }

    _dlCmd(cmd) {
        if (this.recordingDL && this.recordingCmds) {
            this.recordingCmds.addCmd(cmd.type, cmd.args);
        }
    }

    clear(mask) {
        const gl=this.gl; if(!gl) return;
        let m=0;
        if(mask&GL.COLOR_BUFFER_BIT) m|=gl.COLOR_BUFFER_BIT;
        if(mask&GL.DEPTH_BUFFER_BIT) m|=gl.DEPTH_BUFFER_BIT;
        if(mask&GL.STENCIL_BUFFER_BIT) m|=gl.STENCIL_BUFFER_BIT;
        gl.clear(m);
        this._dlCmd({type:'clear',args:[mask]});
    }
    clearColor(r,g,b,a) { this.clearColor=[r,g,b,a]; if(this.gl)this.gl.clearColor(r,g,b,a); this._dlCmd({type:'clearColor',args:[r,g,b,a]}); }
    clearDepth(d) { this.clearDepth=d; if(this.gl)this.gl.clearDepth(d); }
    clearStencil(s) { this.clearStencil=s; if(this.gl)this.gl.clearStencil(s); }
    viewport(x,y,w,h) { this.width=w;this.height=h;if(this.gl)this.gl.viewport(x,y,w,h); this._dlCmd({type:'viewport',args:[x,y,w,h]}); }
    scissor(x,y,w,h) { if(this.gl)this.gl.scissor(x,y,w,h); this._dlCmd({type:'scissor',args:[x,y,w,h]}); }

    enable(cap) {
        const gl=this.gl; if(!gl) return;
        switch(cap){
        case GL.CULL_FACE:gl.enable(gl.CULL_FACE);break;
        case GL.DEPTH_TEST:gl.enable(gl.DEPTH_TEST);break;
        case GL.BLEND:gl.enable(gl.BLEND);break;
        case GL.ALPHA_TEST:break;
        case GL.TEXTURE_2D:break;
        case GL.LIGHTING:break;
        case GL.LIGHT0:case GL.LIGHT1:break;
        case GL.FOG:break;
        case GL.COLOR_MATERIAL:break;
        case GL.SCISSOR_TEST:gl.enable(gl.SCISSOR_TEST);break;
        case GL.NORMALIZE:case GL.RESCALE_NORMAL:break;
        case GL.POINT_SMOOTH:case GL.LINE_SMOOTH:break;
        default:break;
        }
        this._dlCmd({type:'enable',args:[cap]});
    }
    disable(cap) {
        const gl=this.gl; if(!gl) return;
        switch(cap){
        case GL.CULL_FACE:gl.disable(gl.CULL_FACE);break;
        case GL.DEPTH_TEST:gl.disable(gl.DEPTH_TEST);break;
        case GL.BLEND:gl.disable(gl.BLEND);break;
        case GL.TEXTURE_2D:break;
        case GL.LIGHTING:break;
        case GL.FOG:break;
        case GL.SCISSOR_TEST:gl.disable(gl.SCISSOR_TEST);break;
        default:break;
        }
        this._dlCmd({type:'disable',args:[cap]});
    }

    blendFunc(s,d) { this.blendSrc=s;this.blendDst=d;if(this.gl){const g=this.gl;g.blendFunc(this._mapBlend(s),this._mapBlend(d));} this._dlCmd({type:'blendFunc',args:[s,d]}); }
    depthFunc(f) { this.depthFuncVal=f;if(this.gl)this.gl.depthFunc(this._mapCmp(f)); this._dlCmd({type:'depthFunc',args:[f]}); }
    depthMask(f) { this.depthMask=!!f;if(this.gl)this.gl.depthMask(!!f); this._dlCmd({type:'depthMask',args:[f]}); }
    colorMask(r,g,b,a) { this.colorMask=[!!r,!!g,!!b,!!a];if(this.gl)this.gl.colorMask(!!r,!!g,!!b,!!a); this._dlCmd({type:'colorMask',args:[r,g,b,a]}); }
    cullFace(m) { this.cullFace=m;if(this.gl)this.gl.cullFace(this._mapFace(m)); this._dlCmd({type:'cullFace',args:[m]}); }
    frontFace(m) { this.frontFace=m;if(this.gl)this.gl.frontFace(m===GL.CW?this.gl.CW:this.gl.CCW); this._dlCmd({type:'frontFace',args:[m]}); }
    shadeModel(m) { this.shadeModel=m; }
    polygonOffset(f,u) { this.polygonOffsetFactor=f;this.polygonOffsetUnits=u;if(this.gl)this.gl.polygonOffset(f,u); this._dlCmd({type:'polygonOffset',args:[f,u]}); }
    lineWidth(w) { if(this.gl)this.gl.lineWidth(w); }
    pointSize(s) {}
    alphaFunc(f,ref) { this.alphaFunc=f;this.alphaRef=ref; }

    activeTexture(t) { this.activeTextureUnit=t;if(this.gl)this.gl.activeTexture(t); this._dlCmd({type:'activeTexture',args:[t]}); }
    bindTexture(target,tex) {
        const gl=this.gl;if(!gl)return;
        const t=this.textures[tex]||null;
        const tu=this.activeTextureUnit-GL.TEXTURE0;
        this.currentTexture[tu]=tex;
    }
    genTextures(n,ptr) {
        if(!this.gl)return;
        for(let i=0;i<n;i++){
            const t=this.gl.createTexture();
            const id=this.textures.length;
            this.textures.push(t);
            Module.setValue(ptr+i*4,id,'i32');
        }
    }
    deleteTextures(n,ptr) {
        if(!this.gl)return;
        for(let i=0;i<n;i++){
            const id=Module.getValue(ptr+i*4,'i32');
            if(this.textures[id]){this.gl.deleteTexture(this.textures[id]);this.textures[id]=null;}
        }
    }
    texParameteri(target,pname,param) {
        const gl=this.gl;if(!gl)return;
        const t=GL_CONST_MAP[target]===GL.TEXTURE_2D?gl.TEXTURE_2D:gl.TEXTURE_2D;
        let p,v;
        switch(pname){
        case GL.TEXTURE_MIN_FILTER:p=gl.TEXTURE_MIN_FILTER;v=param===GL.NEAREST?gl.NEAREST:param===GL.LINEAR?gl.LINEAR:param===GL.NEAREST_MIPMAP_NEAREST?gl.NEAREST_MIPMAP_NEAREST:param===GL.LINEAR_MIPMAP_NEAREST?gl.LINEAR_MIPMAP_NEAREST:param===GL.NEAREST_MIPMAP_LINEAR?gl.NEAREST_MIPMAP_LINEAR:gl.LINEAR_MIPMAP_LINEAR;break;
        case GL.TEXTURE_MAG_FILTER:p=gl.TEXTURE_MAG_FILTER;v=param===GL.NEAREST?gl.NEAREST:gl.LINEAR;break;
        case GL.TEXTURE_WRAP_S:p=gl.TEXTURE_WRAP_S;v=param===GL.REPEAT?gl.REPEAT:param===GL.CLAMP?gl.CLAMP_TO_EDGE:gl.CLAMP_TO_EDGE;break;
        case GL.TEXTURE_WRAP_T:p=gl.TEXTURE_WRAP_T;v=param===GL.REPEAT?gl.REPEAT:param===GL.CLAMP?gl.CLAMP_TO_EDGE:gl.CLAMP_TO_EDGE;break;
        default:return;
        }
        gl.texParameteri(t,p,v);
    }
    texImage2D(target,level,internal,w,h,border,format,type,pixels) {
        const gl=this.gl;if(!gl)return;
        const t=GL_CONST_MAP[target]===GL.TEXTURE_2D?gl.TEXTURE_2D:gl.TEXTURE_2D;
        let glFormat,glType;
        if(format===GL.RGBA) glFormat=gl.RGBA;
        else if(format===GL.RGB) glFormat=gl.RGB;
        else if(format===GL.BGRA) glFormat=0x80E1;
        else glFormat=gl.RGBA;
        if(type===GL.UNSIGNED_BYTE) glType=gl.UNSIGNED_BYTE;
        else if(type===GL.UNSIGNED_SHORT) glType=gl.UNSIGNED_SHORT;
        else if(type===GL.FLOAT) glType=gl.FLOAT;
        else glType=gl.UNSIGNED_BYTE;
        let glInternal=gl.RGBA;
        if(internal===3) glInternal=gl.RGB;
        else if(internal===4) glInternal=gl.RGBA;
        else if(internal===GL.RGB||internal===0x1907) glInternal=gl.RGB;
        else if(internal===GL.RGBA||internal===0x1908||internal===GL.RGBA8) glInternal=gl.RGBA;
        else glInternal=gl.RGBA;
        const comp=glFormat===gl.RGBA?4:3;
        if(pixels!==0&&pixels!==null){
            const size=w*h*comp;
            const data=new Uint8Array(Module.HEAPU8.buffer,pixels,size);
            gl.texImage2D(t,level,glInternal,w,h,border,glFormat,glType,data);
        }else{
            gl.texImage2D(t,level,glInternal,w,h,border,glFormat,glType,null);
        }
    }
    texSubImage2D(target,level,xoff,yoff,w,h,format,type,pixels) {
        const gl=this.gl;if(!gl)return;
        let glFormat=gl.RGBA;
        if(format===GL.RGBA) glFormat=gl.RGBA;
        else if(format===GL.RGB) glFormat=gl.RGB;
        const comp=glFormat===gl.RGBA?4:3;
        if(pixels!==0&&pixels!==null){
            const size=w*h*comp;
            const data=new Uint8Array(Module.HEAPU8.buffer,pixels,size);
            gl.texSubImage2D(gl.TEXTURE_2D,level,xoff,yoff,w,h,glFormat,gl.UNSIGNED_BYTE,data);
        }
    }
    copyTexSubImage2D(target,level,xoff,yoff,x,y,w,h) {
        const gl=this.gl;if(!gl)return;
        gl.copyTexSubImage2D(gl.TEXTURE_2D,level,xoff,yoff,x,y,w,h);
    }
    generateMipmap(target) { if(this.gl)this.gl.generateMipmap(this.gl.TEXTURE_2D); }
    pixelStorei(p,v) { if(this.gl){const g=this.gl;if(p===GL.UNPACK_ALIGNMENT)g.pixelStorei(g.UNPACK_ALIGNMENT,v);else if(p===GL.PACK_ALIGNMENT)g.pixelStorei(g.PACK_ALIGNMENT,v);} }

    matrixMode(mode) { this.matrixMode=mode; }
    loadIdentity() { this.curMatrix.identity(); this._dlCmd({type:'loadIdentity',args:[]}); }
    pushMatrix() {
        const s=this.matrixStack[this.matrixMode];
        s.push(new Matrix4().copyFrom(s[s.length-1]));
        this._dlCmd({type:'pushMatrix',args:[]});
    }
    popMatrix() {
        const s=this.matrixStack[this.matrixMode];
        if(s.length>1)s.pop();
        this._dlCmd({type:'popMatrix',args:[]});
    }
    translatef(x,y,z) { this.curMatrix.translate(x,y,z); this._dlCmd({type:'translatef',args:[x,y,z]}); }
    rotatef(a,x,y,z) { this.curMatrix.rotate(a,x,y,z); this._dlCmd({type:'rotatef',args:[a,x,y,z]}); }
    scalef(x,y,z) { this.curMatrix.scale(x,y,z); this._dlCmd({type:'scalef',args:[x,y,z]}); }
    ortho(l,r,b,t,n,f) { this.curMatrix.ortho(l,r,b,t,n,f); this._dlCmd({type:'ortho',args:[l,r,b,t,n,f]}); }
    frustum(l,r,b,t,n,f) { this.curMatrix.frustum(l,r,b,t,n,f); this._dlCmd({type:'frustum',args:[l,r,b,t,n,f]}); }

    getFloatv(pname,ptr) {
        let v=null;
        switch(pname){
        case GL.MODELVIEW_MATRIX:v=this.matrixStack[GL.MODELVIEW][this.matrixStack[GL.MODELVIEW].length-1].data;break;
        case GL.PROJECTION_MATRIX:v=this.matrixStack[GL.PROJECTION][this.matrixStack[GL.PROJECTION].length-1].data;break;
        }
        if(v&&ptr){for(let i=0;i<16;i++)Module.setValue(ptr+i*4,v[i],'float');}
    }
    getIntegerv(pname,ptr) {
        let v=0;
        switch(pname){
        case GL.MAX_TEXTURE_SIZE:v=this.gl?this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE):4096;break;
        case GL.MAX_MODELVIEW_STACK_DEPTH:v=32;break;
        case GL.MAX_PROJECTION_STACK_DEPTH:v=32;break;
        case GL.MAX_TEXTURE_STACK_DEPTH:v=10;break;
        case GL.MAX_VIEWPORT_DIMS:v=this.width;Module.setValue(ptr+4,this.height,'i32');break;
        case GL.VIEWPORT:v=this.width;Module.setValue(ptr+4,0,'i32');Module.setValue(ptr+8,this.width,'i32');Module.setValue(ptr+12,this.height,'i32');break;
        }
        if(ptr)Module.setValue(ptr,v,'i32');
    }
    getString(name) {
        switch(name){
        case GL.VENDOR:return 'Minecraft Web WASM';
        case GL.RENDERER:return 'WebGL 2.0 Bridge';
        case GL.VERSION:return '2.1 WebGL 2.0 Emulation';
        case GL.EXTENSIONS:return 'GL_ARB_multitexture';
        case GL.SHADING_LANGUAGE_VERSION:return '3.00';
        default:return '';
        }
    }
    getError() { return GL.NO_ERROR; }

    begin(mode) {
        this.immMode=mode;
        this.immVerts=[];
        this.immTexCoords=[];
        this.immColors=[];
        this.immNormals=[];
    }
    end() {
        if(!this.gl||this.immVerts.length===0){this.immMode=0;return;}
        const gl=this.gl;
        const mode=this.immMode;
        let glMode;
        switch(mode){
        case GL.QUADS:glMode=gl.TRIANGLES;break;
        case GL.QUAD_STRIP:glMode=gl.TRIANGLE_STRIP;break;
        case GL.POLYGON:glMode=gl.TRIANGLE_FAN;break;
        case GL.TRIANGLES:glMode=gl.TRIANGLES;break;
        case GL.TRIANGLE_STRIP:glMode=gl.TRIANGLE_STRIP;break;
        case GL.TRIANGLE_FAN:glMode=gl.TRIANGLE_FAN;break;
        case GL.LINES:glMode=gl.LINES;break;
        case GL.LINE_STRIP:glMode=gl.LINE_STRIP;break;
        case GL.LINE_LOOP:glMode=gl.LINE_LOOP;break;
        case GL.POINTS:glMode=gl.POINTS;break;
        default:glMode=gl.TRIANGLES;
        }

        let verts=this.immVerts;
        if(mode===GL.QUADS){
            const qv=[];
            for(let i=0;i<this.immVerts.length;i+=4){
                qv.push(this.immVerts[i],this.immVerts[i+1],this.immVerts[i+2],this.immVerts[i+2],this.immVerts[i+3],this.immVerts[i]);
            }
            verts=qv;
            if(this.immTexCoords.length>0){
                const qt=[];
                for(let i=0;i<this.immTexCoords.length;i+=4){
                    qt.push(this.immTexCoords[i],this.immTexCoords[i+1],this.immTexCoords[i+2],this.immTexCoords[i+2],this.immTexCoords[i+3],this.immTexCoords[i]);
                }
                this.immTexCoords=qt;
            }
            if(this.immColors.length>0){
                const qc=[];
                for(let i=0;i<this.immColors.length;i+=4){
                    qc.push(this.immColors[i],this.immColors[i+1],this.immColors[i+2],this.immColors[i+2],this.immColors[i+3],this.immColors[i]);
                }
                this.immColors=qc;
            }
        }

        const vertCount=verts.length/3;
        const stride=10;
        const buf=new Float32Array(vertCount*stride);
        for(let i=0;i<vertCount;i++){
            const o=i*stride;
            buf[o]=verts[i*3];buf[o+1]=verts[i*3+1];buf[o+2]=verts[i*3+2];buf[o+3]=1;
            buf[o+4]=this.immColors.length>0?this.immColors[i*4]:this.immCurrentColor[0];
            buf[o+5]=this.immColors.length>0?this.immColors[i*4+1]:this.immCurrentColor[1];
            buf[o+6]=this.immColors.length>0?this.immColors[i*4+2]:this.immCurrentColor[2];
            buf[o+7]=this.immColors.length>0?this.immColors[i*4+3]:this.immCurrentColor[3];
            buf[o+8]=this.immTexCoords.length>0?this.immTexCoords[i*2]:this.immCurrentTexCoord[0];
            buf[o+9]=this.immTexCoords.length>0?this.immTexCoords[i*2+1]:this.immCurrentTexCoord[1];
        }

        const info=this.immProgramInfo;
        const mvp=this._computeMVP();

        gl.useProgram(info.program);
        gl.bindVertexArray(this.immVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.immVBO);
        gl.bufferSubData(gl.ARRAY_BUFFER,0,buf);

        gl.enableVertexAttribArray(info.a_pos);
        gl.enableVertexAttribArray(info.a_color);
        gl.enableVertexAttribArray(info.a_texcoord);
        gl.enableVertexAttribArray(info.a_normal);
        gl.vertexAttribPointer(info.a_pos,4,gl.FLOAT,false,stride*4,0);
        gl.vertexAttribPointer(info.a_color,4,gl.FLOAT,false,stride*4,16);
        gl.vertexAttribPointer(info.a_texcoord,2,gl.FLOAT,false,stride*4,32);
        gl.vertexAttribPointer(info.a_normal,3,gl.FLOAT,false,stride*4,40);

        gl.uniformMatrix4fv(info.u_mvp,false,mvp);
        gl.uniformMatrix4fv(info.u_textureMatrix,false,this.matrixStack[GL.TEXTURE_MATRIX][this.matrixStack[GL.TEXTURE_MATRIX].length-1].data);
        gl.uniform1i(info.u_texture,0);
        gl.uniform1i(info.u_useTexture,1);
        gl.uniform1i(info.u_useLighting,0);
        gl.uniform1i(info.u_useFog,0);
        gl.uniform4fv(info.u_fogColor,this.fogColor);
        gl.uniform1f(info.u_fogStart,this.fogStart);
        gl.uniform1f(info.u_fogEnd,this.fogEnd);
        gl.uniform1i(info.u_fogMode,this.fogMode===GL.LINEAR_FOG?0:this.fogMode===GL.EXP?1:2);
        gl.uniform4fv(info.u_lightAmbient,this.lightAmbient);
        gl.uniform4fv(info.u_materialAmbient,this.materialAmbient);
        gl.uniform4fv(info.u_materialDiffuse,this.materialDiffuse);
        gl.uniform1f(info.u_alphaTest,this.alphaRef);
        gl.uniform1i(info.u_useAlphaTest,this.alphaFunc!==GL.ALWAYS?1:0);

        const tu=this.activeTextureUnit-GL.TEXTURE0;
        const texId=this.currentTexture[tu];
        if(texId&&this.textures[texId]){
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D,this.textures[texId]);
        }

        gl.drawArrays(glMode,0,vertCount);

        gl.bindVertexArray(null);
        this.immMode=0;
    }
    vertex2f(x,y) { this._vertex(x,y,0); }
    vertex3f(x,y,z) { this._vertex(x,y,z); }
    vertex2fv(ptr) { this.vertex2f(Module.getValue(ptr,'float'),Module.getValue(ptr+4,'float')); }
    vertex3fv(ptr) { this.vertex3f(Module.getValue(ptr,'float'),Module.getValue(ptr+4,'float'),Module.getValue(ptr+8,'float')); }
    _vertex(x,y,z) {
        this.immVerts.push(x,y,z);
        this.immTexCoords.push(this.immCurrentTexCoord[0],this.immCurrentTexCoord[1]);
        this.immColors.push(this.immCurrentColor[0],this.immCurrentColor[1],this.immCurrentColor[2],this.immCurrentColor[3]);
        this.immNormals.push(this.immCurrentNormal[0],this.immCurrentNormal[1],this.immCurrentNormal[2]);
    }
    texCoord2f(u,v) { this.immCurrentTexCoord=[u,v]; }
    color3f(r,g,b) { this.immCurrentColor=[r,g,b,this.immCurrentColor[3]]; }
    color4f(r,g,b,a) { this.immCurrentColor=[r,g,b,a]; }
    color3ub(r,g,b) { this.immCurrentColor=[r/255,g/255,b/255,this.immCurrentColor[3]]; }
    color4ub(r,g,b,a) { this.immCurrentColor=[r/255,g/255,b/255,a/255]; }
    normal3f(x,y,z) { this.immCurrentNormal=[x,y,z]; }

    _computeMVP() {
        const proj=this.matrixStack[GL.PROJECTION][this.matrixStack[GL.PROJECTION].length-1].data;
        const model=this.matrixStack[GL.MODELVIEW][this.matrixStack[GL.MODELVIEW].length-1].data;
        const r=new Float32Array(16);
        for(let i=0;i<4;i++) for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++) s+=model[k*4+j]*proj[i*4+k];r[i*4+j]=s;}
        return r;
    }

    newList(list, mode) {
        this.displayLists[list] = new DisplayList();
        this.recordingDL = list;
        this.recordingCmds = this.displayLists[list];
    }
    endList() {
        this.recordingDL = 0;
        this.recordingCmds = null;
    }
    callList(list) {
        const dl = this.displayLists[list];
        if (!dl) return;
        const wasRecording = this.recordingDL;
        const wasCmds = this.recordingCmds;
        this.recordingDL = 0;
        this.recordingCmds = null;
        for (const cmd of dl.commands) {
            this['_replay_'+cmd.type]?.(cmd.args);
        }
        this.recordingDL = wasRecording;
        this.recordingCmds = wasCmds;
    }
    deleteLists(list, range) { delete this.displayLists[list]; }
    genLists(range) { return Math.floor(Math.random()*100000)+1; }
    isList(list) { return !!this.displayLists[list]; }
    _replay_clear(args){this.clear(args[0]);}
    _replay_clearColor(args){this.clearColor(args[0],args[1],args[2],args[3]);}
    _replay_viewport(args){this.viewport(args[0],args[1],args[2],args[3]);}
    _replay_enable(args){this.enable(args[0]);}
    _replay_disable(args){this.disable(args[0]);}
    _replay_blendFunc(args){this.blendFunc(args[0],args[1]);}
    _replay_depthFunc(args){this.depthFunc(args[0]);}
    _replay_depthMask(args){this.depthMask(args[0]);}
    _replay_colorMask(args){this.colorMask(args[0],args[1],args[2],args[3]);}
    _replay_cullFace(args){this.cullFace(args[0]);}
    _replay_frontFace(args){this.frontFace(args[0]);}
    _replay_polygonOffset(args){this.polygonOffset(args[0],args[1]);}
    _replay_loadIdentity(args){this.loadIdentity();}
    _replay_pushMatrix(args){this.pushMatrix();}
    _replay_popMatrix(args){this.popMatrix();}
    _replay_translatef(args){this.translatef(args[0],args[1],args[2]);}
    _replay_rotatef(args){this.rotatef(args[0],args[1],args[2],args[3]);}
    _replay_scalef(args){this.scalef(args[0],args[1],args[2]);}
    _replay_ortho(args){this.ortho(args[0],args[1],args[2],args[3],args[4],args[5]);}
    _replay_frustum(args){this.frustum(args[0],args[1],args[2],args[3],args[4],args[5]);}

    drawArrays(mode,first,count) {
        const gl=this.gl;if(!gl)return;
        gl.drawArrays(this._mapMode(mode),first,count);
    }
    drawElements(mode,count,type,offset) {
        const gl=this.gl;if(!gl)return;
        gl.drawElements(this._mapMode(mode),count,gl.UNSIGNED_INT,offset);
    }
    genBuffers(n,ptr) { if(!this.gl)return;for(let i=0;i<n;i++){const b=this.gl.createBuffer();const id=this.buffers.length;this.buffers.push(b);Module.setValue(ptr+i*4,id,'i32');} }
    deleteBuffers(n,ptr) { if(!this.gl)return;for(let i=0;i<n;i++){const id=Module.getValue(ptr+i*4,'i32');if(this.buffers[id]){this.gl.deleteBuffer(this.buffers[id]);this.buffers[id]=null;}} }
    bindBuffer(target,buf) { if(!this.gl)return;const b=this.buffers[buf];if(b)this.gl.bindBuffer(target===GL.ARRAY_BUFFER?this.gl.ARRAY_BUFFER:this.gl.ELEMENT_ARRAY_BUFFER,b); }
    bufferData(target,size,data,usage) {
        if(!this.gl)return;
        const t=target===GL.ARRAY_BUFFER?this.gl.ARRAY_BUFFER:this.gl.ELEMENT_ARRAY_BUFFER;
        const u=usage===GL.STATIC_DRAW?this.gl.STATIC_DRAW:usage===GL.DYNAMIC_DRAW?this.gl.DYNAMIC_DRAW:this.gl.STREAM_DRAW;
        if(data!==0&&data!==null){const arr=new Uint8Array(Module.HEAPU8.buffer,data,size);this.gl.bufferData(t,arr,u);}
        else this.gl.bufferData(t,size,u);
    }
    bufferSubData(target,offset,size,data) {
        if(!this.gl||!data)return;
        const t=target===GL.ARRAY_BUFFER?this.gl.ARRAY_BUFFER:this.gl.ELEMENT_ARRAY_BUFFER;
        const arr=new Uint8Array(Module.HEAPU8.buffer,data,size);
        this.gl.bufferSubData(t,offset,arr);
    }
    createShader(type) { if(!this.gl)return 0;const t=type===GL.VERTEX_SHADER?this.gl.VERTEX_SHADER:this.gl.FRAGMENT_SHADER;const s=this.gl.createShader(t);const id=this.shaders.length;this.shaders.push(s);return id; }
    shaderSource(id,ptr) { if(!this.gl)return;const s=this.shaders[id];if(s)this.gl.shaderSource(s,Module.UTF8ToString?Module.UTF8ToString(ptr):''); }
    compileShader(id) { const s=this.shaders[id];if(s&&this.gl)this.gl.compileShader(s); }
    createProgram() { if(!this.gl)return 0;const p=this.gl.createProgram();const id=this.programs.length;this.programs.push(p);return id; }
    attachShader(p,s) { if(this.gl&&this.programs[p]&&this.shaders[s])this.gl.attachShader(this.programs[p],this.shaders[s]); }
    linkProgram(p) { if(this.gl&&this.programs[p])this.gl.linkProgram(this.programs[p]); }
    useProgram(p) { this.currentProgram=p;if(this.gl)this.gl.useProgram(this.programs[p]||null); }
    getUniformLocation(p,ptr) { if(!this.gl||!this.programs[p])return -1;const n=Module.UTF8ToString(ptr);const l=this.gl.getUniformLocation(this.programs[p],n);return l?1:-1; }
    getAttribLocation(p,ptr) { if(!this.gl||!this.programs[p])return -1;return this.gl.getAttribLocation(this.programs[p],Module.UTF8ToString(ptr)); }
    uniform1i(loc,v) { if(this.gl)this.gl.uniform1i(loc,v); }
    uniform1f(loc,v) { if(this.gl)this.gl.uniform1f(loc,v); }
    uniform2f(loc,x,y) { if(this.gl)this.gl.uniform2f(loc,x,y); }
    uniform3f(loc,x,y,z) { if(this.gl)this.gl.uniform3f(loc,x,y,z); }
    uniform4f(loc,x,y,z,w) { if(this.gl)this.gl.uniform4f(loc,x,y,z,w); }
    uniformMatrix4fv(loc,count,transpose,ptr) { if(this.gl){const v=new Float32Array(Module.HEAPF32.buffer,ptr,16*count);this.gl.uniformMatrix4fv(loc,!!transpose,v);} }
    vertexAttribPointer(idx,size,type,normalized,stride,offset) {
        if(!this.gl)return;
        const t=type===GL.FLOAT?this.gl.FLOAT:type===GL.UNSIGNED_BYTE?this.gl.UNSIGNED_BYTE:this.gl.FLOAT;
        this.gl.vertexAttribPointer(idx,size,t,!!normalized,stride,offset);
    }
    enableVertexAttribArray(idx) { if(this.gl)this.gl.enableVertexAttribArray(idx); }
    disableVertexAttribArray(idx) { if(this.gl)this.gl.disableVertexAttribArray(idx); }

    readPixels(x,y,w,h,format,type,pixels) {
        if(!this.gl||!pixels)return;
        const glFmt=format===GL.RGBA?this.gl.RGBA:this.gl.RGB;
        const arr=new Uint8Array(Module.HEAPU8.buffer,pixels,w*h*4);
        this.gl.readPixels(x,this.height-y-h,w,h,glFmt,this.gl.UNSIGNED_BYTE,arr);
    }
    readBuffer(mode) {}

    bindFramebuffer(target,fb) {
        if(!this.gl)return;
        this.gl.bindFramebuffer(target===GL.FRAMEBUFFER?this.gl.FRAMEBUFFER:target,fb===0?null:fb);
    }
    genFramebuffers(n,ptr) { if(!this.gl)return;for(let i=0;i<n;i++){const fb=this.gl.createFramebuffer();Module.setValue(ptr+i*4,fb?1:0,'i32');} }
    deleteFramebuffers(n,ptr) {}
    framebufferTexture2D(target,att,textarget,tex,level) {
        if(!this.gl)return;
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.textures[tex]||null,level);
    }
    checkFramebufferStatus(target) { return this.gl?this.gl.FRAMEBUFFER_COMPLETE:0; }

    createWindow(w,h,title) { this.width=w;this.height=h;this.canvas.width=w;this.canvas.height=h;this.init();if(this.gl)this.gl.viewport(0,0,w,h); }
    setDisplayMode(w,h) { this.width=w;this.height=h;this.canvas.width=w;this.canvas.height=h;if(this.gl)this.gl.viewport(0,0,w,h); }
    swapBuffers() {}
    isCloseRequested() { return false; }

    _mapMode(m) { const g=this.gl; switch(m){case GL.QUADS:return g.TRIANGLES;case GL.QUAD_STRIP:return g.TRIANGLE_STRIP;case GL.POLYGON:return g.TRIANGLE_FAN;default:return m;} }
    _mapBlend(f) { const g=this.gl; switch(f){case GL.ZERO:return g.ZERO;case GL.ONE:return g.ONE;case GL.SRC_ALPHA:return g.SRC_ALPHA;case GL.ONE_MINUS_SRC_ALPHA:return g.ONE_MINUS_SRC_ALPHA;case GL.DST_ALPHA:return g.DST_ALPHA;case GL.ONE_MINUS_DST_ALPHA:return g.ONE_MINUS_DST_ALPHA;case GL.SRC_COLOR:return g.SRC_COLOR;case GL.ONE_MINUS_SRC_COLOR:return g.ONE_MINUS_SRC_COLOR;case GL.DST_COLOR:return g.DST_COLOR;case GL.SRC_ALPHA_SATURATE:return g.SRC_ALPHA_SATURATE;default:return g.ONE;} }
    _mapCmp(f) { const g=this.gl; switch(f){case GL.NEVER:return g.NEVER;case GL.LESS:return g.LESS;case GL.EQUAL:return g.EQUAL;case GL.LEQUAL:return g.LEQUAL;case GL.GREATER:return g.GREATER;case GL.NOTEQUAL:return g.NOTEQUAL;case GL.GEQUAL:return g.GEQUAL;case GL.ALWAYS:return g.ALWAYS;default:return g.LESS;} }
    _mapFace(f) { const g=this.gl; switch(f){case GL.FRONT:return g.FRONT;case GL.BACK:return g.BACK;case GL.FRONT_AND_BACK:return g.FRONT_AND_BACK;default:return g.BACK;} }
}

const renderer = new Renderer(document.getElementById('game-canvas'));
export { renderer, GL };
