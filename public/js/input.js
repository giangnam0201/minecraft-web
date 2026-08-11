const KEYBOARD_KEYS = {
    KEY_NONE: 0x00,
    KEY_ESCAPE: 0x01,
    KEY_1: 0x02,
    KEY_2: 0x03,
    KEY_3: 0x04,
    KEY_4: 0x05,
    KEY_5: 0x06,
    KEY_6: 0x07,
    KEY_7: 0x08,
    KEY_8: 0x09,
    KEY_9: 0x0A,
    KEY_0: 0x0B,
    KEY_MINUS: 0x0C,
    KEY_EQUALS: 0x0D,
    KEY_BACK: 0x0E,
    KEY_TAB: 0x0F,
    KEY_Q: 0x10,
    KEY_W: 0x11,
    KEY_E: 0x12,
    KEY_R: 0x13,
    KEY_T: 0x14,
    KEY_Y: 0x15,
    KEY_U: 0x16,
    KEY_I: 0x17,
    KEY_O: 0x18,
    KEY_P: 0x19,
    KEY_LBRACKET: 0x1A,
    KEY_RBRACKET: 0x1B,
    KEY_RETURN: 0x1C,
    KEY_LCONTROL: 0x1D,
    KEY_A: 0x1E,
    KEY_S: 0x1F,
    KEY_D: 0x20,
    KEY_F: 0x21,
    KEY_G: 0x22,
    KEY_H: 0x23,
    KEY_J: 0x24,
    KEY_K: 0x25,
    KEY_L: 0x26,
    KEY_SEMICOLON: 0x27,
    KEY_APOSTROPHE: 0x28,
    KEY_GRAVE: 0x29,
    KEY_LSHIFT: 0x2A,
    KEY_BACKSLASH: 0x2B,
    KEY_Z: 0x2C,
    KEY_X: 0x2D,
    KEY_C: 0x2E,
    KEY_V: 0x2F,
    KEY_B: 0x30,
    KEY_N: 0x31,
    KEY_M: 0x32,
    KEY_COMMA: 0x33,
    KEY_PERIOD: 0x34,
    KEY_SLASH: 0x35,
    KEY_RSHIFT: 0x36,
    KEY_MULTIPLY: 0x37,
    KEY_LMENU: 0x38,
    KEY_SPACE: 0x39,
    KEY_CAPITAL: 0x3A,
    KEY_F1: 0x3B,
    KEY_F2: 0x3C,
    KEY_F3: 0x3D,
    KEY_F4: 0x3E,
    KEY_F5: 0x3F,
    KEY_F6: 0x40,
    KEY_F7: 0x41,
    KEY_F8: 0x42,
    KEY_F9: 0x43,
    KEY_F10: 0x44,
    KEY_NUMLOCK: 0x45,
    KEY_SCROLL: 0x46,
    KEY_NUMPAD7: 0x47,
    KEY_NUMPAD8: 0x48,
    KEY_NUMPAD9: 0x49,
    KEY_SUBTRACT: 0x4A,
    KEY_NUMPAD4: 0x4B,
    KEY_NUMPAD5: 0x4C,
    KEY_NUMPAD6: 0x4D,
    KEY_ADD: 0x4E,
    KEY_NUMPAD1: 0x4F,
    KEY_NUMPAD2: 0x50,
    KEY_NUMPAD3: 0x51,
    KEY_NUMPAD0: 0x52,
    KEY_DECIMAL: 0x53,
    KEY_F11: 0x57,
    KEY_F12: 0x58,
    KEY_F13: 0x64,
    KEY_F14: 0x65,
    KEY_F15: 0x66,
    KEY_KANA: 0x70,
    KEY_CONVERT: 0x79,
    KEY_NOCONVERT: 0x7B,
    KEY_YEN: 0x7D,
    KEY_NUMPADEQUALS: 0x8D,
    KEY_CIRCUMFLEX: 0x90,
    KEY_AT: 0x91,
    KEY_COLON: 0x92,
    KEY_UNDERLINE: 0x93,
    KEY_KANJI: 0x94,
    KEY_STOP: 0x95,
    KEY_AX: 0x96,
    KEY_UNLABELED: 0x97,
    KEY_NUMPADENTER: 0x9C,
    KEY_RCONTROL: 0x9D,
    KEY_NUMPADCOMMA: 0xB3,
    KEY_DIVIDE: 0xB5,
    KEY_SYSRQ: 0xB7,
    KEY_RMENU: 0xB8,
    KEY_PAUSE: 0xC5,
    KEY_HOME: 0xC7,
    KEY_UP: 0xC8,
    KEY_PRIOR: 0xC9,
    KEY_LEFT: 0xCB,
    KEY_RIGHT: 0xCD,
    KEY_END: 0xCF,
    KEY_DOWN: 0xD0,
    KEY_NEXT: 0xD1,
    KEY_INSERT: 0xD2,
    KEY_DELETE: 0xD3,
    KEY_LMETA: 0xDB,
    KEY_RMETA: 0xDC,
    KEY_APPS: 0xDD,
    KEY_POWER: 0xDE,
    KEY_SLEEP: 0xDF,
};

const DOM_TO_LWJGL = {
    'Escape': 0x01,
    'Digit1': 0x02, 'Digit2': 0x03, 'Digit3': 0x04, 'Digit4': 0x05,
    'Digit5': 0x06, 'Digit6': 0x07, 'Digit7': 0x08, 'Digit8': 0x09,
    'Digit9': 0x0A, 'Digit0': 0x0B,
    'Minus': 0x0C, 'Equal': 0x0D,
    'Backspace': 0x0E, 'Tab': 0x0F,
    'KeyQ': 0x10, 'KeyW': 0x11, 'KeyE': 0x12, 'KeyR': 0x13,
    'KeyT': 0x14, 'KeyY': 0x15, 'KeyU': 0x16, 'KeyI': 0x17,
    'KeyO': 0x18, 'KeyP': 0x19,
    'BracketLeft': 0x1A, 'BracketRight': 0x1B,
    'Enter': 0x1C,
    'ControlLeft': 0x1D,
    'KeyA': 0x1E, 'KeyS': 0x1F, 'KeyD': 0x20, 'KeyF': 0x21,
    'KeyG': 0x22, 'KeyH': 0x23, 'KeyJ': 0x24, 'KeyK': 0x25,
    'KeyL': 0x26,
    'Semicolon': 0x27, 'Quote': 0x28, 'Backquote': 0x29,
    'ShiftLeft': 0x2A, 'Backslash': 0x2B,
    'KeyZ': 0x2C, 'KeyX': 0x2D, 'KeyC': 0x2E, 'KeyV': 0x2F,
    'KeyB': 0x30, 'KeyN': 0x31, 'KeyM': 0x32,
    'Comma': 0x33, 'Period': 0x34, 'Slash': 0x35,
    'ShiftRight': 0x36,
    'NumpadMultiply': 0x37,
    'AltLeft': 0x38,
    'Space': 0x39,
    'CapsLock': 0x3A,
    'F1': 0x3B, 'F2': 0x3C, 'F3': 0x3D, 'F4': 0x3E,
    'F5': 0x3F, 'F6': 0x40, 'F7': 0x41, 'F8': 0x42,
    'F9': 0x43, 'F10': 0x44,
    'NumLock': 0x45, 'ScrollLock': 0x46,
    'Numpad7': 0x47, 'Numpad8': 0x48, 'Numpad9': 0x49,
    'NumpadSubtract': 0x4A,
    'Numpad4': 0x4B, 'Numpad5': 0x4C, 'Numpad6': 0x4D,
    'NumpadAdd': 0x4E,
    'Numpad1': 0x4F, 'Numpad2': 0x50, 'Numpad3': 0x51,
    'Numpad0': 0x52, 'NumpadDecimal': 0x53,
    'F11': 0x57, 'F12': 0x58,
    'F13': 0x64, 'F14': 0x65, 'F15': 0x66,
    'NumpadEnter': 0x9C,
    'ControlRight': 0x9D,
    'NumpadDivide': 0xB5,
    'AltRight': 0xB8,
    'Pause': 0xC5,
    'Home': 0xC7, 'ArrowUp': 0xC8, 'PageUp': 0xC9,
    'ArrowLeft': 0xCB, 'ArrowRight': 0xCD,
    'End': 0xCF, 'ArrowDown': 0xD0, 'PageDown': 0xD1,
    'Insert': 0xD2, 'Delete': 0xD3,
    'MetaLeft': 0xDB, 'MetaRight': 0xDC,
    'ContextMenu': 0xDD,
};

class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = new Uint8Array(256);
        this.mouseButtons = new Uint8Array(8);
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDX = 0;
        this.mouseDY = 0;
        this.mouseDWheel = 0;
        this.keyStates = {};
        this.grabMouse = false;
        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => {
            const code = DOM_TO_LWJGL[e.code];
            if (code !== undefined) {
                this.keys[code] = 1;
                this.keyStates[code] = true;
            }
            if (e.code === 'Escape' || e.code === 'F1' || e.code === 'F2' ||
                e.code === 'F3' || e.code === 'F4' || e.code === 'F5' ||
                e.code === 'F6' || e.code === 'F7' || e.code === 'F8' ||
                e.code === 'F9' || e.code === 'F10' || e.code === 'F11' ||
                e.code === 'F12' || e.code === 'Tab' || e.code === 'AltLeft' ||
                e.code === 'AltRight') {
                e.preventDefault();
            }
        });

        document.addEventListener('keyup', (e) => {
            const code = DOM_TO_LWJGL[e.code];
            if (code !== undefined) {
                this.keys[code] = 0;
                this.keyStates[code] = false;
            }
        });

        this.canvas.addEventListener('mousedown', (e) => {
            const btn = e.button;
            if (btn >= 0 && btn < 8) {
                this.mouseButtons[btn] = 1;
            }
            this.canvas.requestPointerLock();
        });

        this.canvas.addEventListener('mouseup', (e) => {
            const btn = e.button;
            if (btn >= 0 && btn < 8) {
                this.mouseButtons[btn] = 0;
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            if (document.pointerLockElement === this.canvas) {
                this.mouseDX += e.movementX;
                this.mouseDY += e.movementY;
                this.mouseX += e.movementX;
                this.mouseY += e.movementY;
            } else {
                this.mouseX = e.clientX - rect.left;
                this.mouseY = e.clientY - rect.top;
            }
            this.mouseX = Math.max(0, Math.min(this.canvas.width, this.mouseX));
            this.mouseY = Math.max(0, Math.min(this.canvas.height, this.mouseY));
        });

        this.canvas.addEventListener('wheel', (e) => {
            this.mouseDWheel += e.deltaY;
        });

        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    isKeyDown(keyCode) {
        return this.keys[keyCode] || 0;
    }

    isMouseButtonDown(button) {
        return this.mouseButtons[button] || 0;
    }

    getMouseX() {
        return Math.round(this.mouseX);
    }

    getMouseY() {
        return Math.round(this.mouseY);
    }

    getDX() {
        const dx = this.mouseDX;
        this.mouseDX = 0;
        return dx;
    }

    getDY() {
        const dy = this.mouseDY;
        this.mouseDY = 0;
        return dy;
    }

    getDWheel() {
        const dw = this.mouseDWheel;
        this.mouseDWheel = 0;
        return dw;
    }

    next() {
        return true;
    }

    poll() {
        return true;
    }

    isCloseRequested() {
        return false;
    }

    isCreated() {
        return true;
    }

    destroy() {
    }

    setGrabbed(grabbed) {
        this.grabMouse = grabbed;
        if (grabbed) {
            this.canvas.requestPointerLock();
        } else {
            if (document.pointerLockElement === this.canvas) {
                document.exitPointerLock();
            }
        }
    }

    isGrabbed() {
        return document.pointerLockElement === this.canvas;
    }
}

const inputManager = new InputManager(document.getElementById('game-canvas'));
export { inputManager, KEYBOARD_KEYS };
