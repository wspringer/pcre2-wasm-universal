# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Browser-compatible fork of `@stephen-riley/pcre2-wasm` that provides PCRE2 (Perl Compatible Regular Expressions 2) compiled to WebAssembly. This package removes Node.js dependencies from the original to enable browser usage.

## Build & Development

This is a pre-built package with no build system configured:
- **No build scripts** - WASM binary (`dist/libpcre2.wasm`) is pre-compiled
- **No test framework** - Testing infrastructure not set up
- **No dev dependencies** - Pure runtime package

The WASM was compiled externally using Emscripten from the PCRE2 C library.

## Architecture

### Key Files

- `src/PCRE.js` - Main wrapper class around WASM PCRE2 library (ESM module)
- `dist/libpcre2.js` - Emscripten-generated WASM loader
- `dist/libpcre2.wasm` - Compiled PCRE2 WebAssembly binary (~588KB)

### PCRE Class Structure

The `PCRE` class uses Symbol-based private properties to protect WASM pointers:
- `ptrSym` - Compiled pattern pointer
- `nametableSym` - Named capture group table
- `patternSym` - Original pattern string

**Static methods:**
- `PCRE.init()` - Must be called before any PCRE usage (loads WASM)
- `PCRE.version()` - Returns PCRE2 version

**Instance lifecycle:**
1. `new PCRE(pattern, flags)` - Compiles pattern to WASM
2. `match()`, `matchAll()`, `substitute()` - Use pattern
3. `destroy()` - Frees WASM memory (important for cleanup)

### Browser Adaptations from Original

The original package used Node.js APIs. This fork replaces them with browser equivalents:
- `require("path")` / `__dirname` → Emscripten's `scriptDirectory` detection
- `require("assert")` → Inline assertion function
- `require("util").TextDecoder` → Browser-native `TextDecoder('utf-16le')`
- `Buffer.from(str, 'utf16le')` → Custom `encodeUTF16LE()` function

### Memory Management

WASM memory requires manual management:
- Strings are converted to UTF-16LE and allocated via `Module._malloc()`
- Match data structures allocated with `createMatchData()` / freed with `destroyMatchData()`
- Pattern memory freed in `destroy()`

### Error Handling

PCRE2 error codes (-1 through -66) are mapped to human-readable names. Common codes:
- `PCRE2_NO_MATCH = -1`
- `PCRE2_ERROR_NOMEMORY = -48`

## Bundler Configuration

When using with Vite or similar bundlers, configure WASM handling:

```javascript
// vite.config.js
export default {
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['pcre2-wasm-browser']
  }
}
```

The WASM file must be served from the same directory as `libpcre2.js`.
