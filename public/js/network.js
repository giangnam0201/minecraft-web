class NetworkManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.receiveBuffer = [];
    }

    connect(host, port) {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const url = `${protocol}//${host}:${port}`;
            this.socket = new WebSocket(url);
            this.socket.binaryType = 'arraybuffer';

            this.socket.onopen = () => {
                this.connected = true;
                console.log('Connected to server:', host, port);
            };

            this.socket.onmessage = (event) => {
                const data = new Uint8Array(event.data);
                for (let i = 0; i < data.length; i++) {
                    this.receiveBuffer.push(data[i]);
                }
            };

            this.socket.onclose = () => {
                this.connected = false;
                console.log('Disconnected from server');
            };

            this.socket.onerror = (err) => {
                console.error('Socket error:', err);
                this.connected = false;
            };
        } catch (e) {
            console.error('Failed to connect:', e);
            this.connected = false;
        }
    }

    send(dataPtr, length) {
        if (!this.socket || !this.connected) return;
        const data = new Uint8Array(Module.HEAPU8.buffer, dataPtr, length);
        this.socket.send(data);
    }

    receive(bufferPtr, maxLength) {
        const len = Math.min(this.receiveBuffer.length, maxLength);
        if (len === 0) return 0;
        const data = this.receiveBuffer.splice(0, len);
        for (let i = 0; i < len; i++) {
            Module.setValue(bufferPtr + i, data[i], 'i8');
        }
        return len;
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.connected = false;
    }

    isConnected() {
        return this.connected;
    }

    available() {
        return this.receiveBuffer.length;
    }
}

const networkManager = new NetworkManager();
export { networkManager };
