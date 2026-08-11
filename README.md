# Minecraft Web - Pure WASM JVM Implementation

Minecraft 1.16.5 client running fully in the browser via a custom WASM-based Java Virtual Machine. No server-side, no external libraries.

## Architecture

```
Minecraft Client JAR
        |
  WASM JVM (C via Emscripten)
  - Bytecode interpreter
  - Class loader & verifier
  - Object model & GC
  - Native method bridge
        |
  JavaScript Bridge
  - LWJGL -> WebGL 2.0
  - OpenAL -> Web Audio API
  - Input -> DOM Events
  - Networking -> WebSocket
        |
  HTML5 Canvas Rendering
```

## Components

| Layer | File | Purpose |
|-------|------|---------|
| JVM Core | `jvm/jvm.c` | Class loading, memory management, native calls |
| Bytecode | `jvm/bytecode.c` | ~120 JVM bytecode instructions |
| Renderer | `src/renderer.js` | WebGL 2.0 rendering bridge |
| Audio | `src/audio.js` | Web Audio API bridge |
| Input | `src/input.js` | Keyboard & mouse handling |
| Network | `src/network.js` | WebSocket connection layer |
| Loader | `src/main.js` | JVM bootstrap & main loop |

## Build

Requires Emscripten SDK.

```
make all
```

## Development

```
make serve
```

Then open http://localhost:8080

## How It Works

1. The browser loads `index.html`
2. `jvm.js` (compiled via Emscripten) initializes the WASM JVM
3. The JVM loads Minecraft's `.class` files from the JAR
4. The bytecode interpreter executes Java methods
5. Native LWJGL calls are forwarded to JavaScript
6. JavaScript renders via WebGL and handles input/audio

## License

MIT
