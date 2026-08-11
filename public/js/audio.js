class AudioManager {
    constructor() {
        this.ctx = null;
        this.sources = {};
        this.buffers = {};
        this.masterGain = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return true;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 1.0;
            this.masterGain.connect(this.ctx.destination);
            this.initialized = true;
            return true;
        } catch (e) {
            console.warn('Web Audio API not available:', e);
            return false;
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
    }

    createSource(id) {
        if (!this.ctx) return -1;
        const source = this.ctx.createBufferSource();
        this.sources[id] = source;
        return id;
    }

    setBuffer(sourceId, bufferId) {
        const source = this.sources[sourceId];
        const buffer = this.buffers[bufferId];
        if (source && buffer) {
            source.buffer = buffer;
        }
    }

    loadBuffer(bufferId, audioData, sampleRate) {
        if (!this.ctx) return;
        const buffer = this.ctx.createBuffer(1, audioData.length, sampleRate);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < audioData.length; i++) {
            channelData[i] = audioData[i];
        }
        this.buffers[bufferId] = buffer;
    }

    createBufferFromData(bufferId, dataPtr, size, sampleRate, bitsPerSample) {
        if (!this.ctx) return;
        const data = new Int16Array(Module.HEAP16.buffer, dataPtr, size / 2);
        const numChannels = 1;
        const length = data.length;
        const buffer = this.ctx.createBuffer(numChannels, length, sampleRate);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            channelData[i] = data[i] / 32768.0;
        }
        this.buffers[bufferId] = buffer;
    }

    play(sourceId, gainValue) {
        if (!this.ctx) return;
        this.resume();
        const source = this.sources[sourceId];
        if (!source || !source.buffer) return;

        if (source.playbackState === source.PLAYING_STATE || 
            source.playbackState === this.ctx.PLAYING_STATE) {
            source.stop();
            const newSource = this.ctx.createBufferSource();
            newSource.buffer = source.buffer;
            this.sources[sourceId] = newSource;
        }

        const s = this.sources[sourceId];
        const gainNode = this.ctx.createGain();
        gainNode.gain.value = gainValue || 1.0;
        s.connect(gainNode);
        gainNode.connect(this.masterGain);
        s.start(0);
    }

    stop(sourceId) {
        const source = this.sources[sourceId];
        if (source) {
            try { source.stop(); } catch(e) {}
        }
    }

    setVolume(sourceId, volume) {
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    createSourceFromId(id) {
        if (!this.ctx) return;
        const source = this.ctx.createBufferSource();
        this.sources[id] = source;
    }

    deleteSource(id) {
        const source = this.sources[id];
        if (source) {
            try { source.stop(); } catch(e) {}
            delete this.sources[id];
        }
    }

    deleteBuffer(id) {
        delete this.buffers[id];
    }

    isSourcePlaying(id) {
        const source = this.sources[id];
        if (!source) return false;
        return source.playbackState === (this.ctx ? this.ctx.PLAYING_STATE : 2);
    }
}

const audioManager = new AudioManager();
export { audioManager };
