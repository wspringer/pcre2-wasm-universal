# pcre2-wasm-universal

A universal (Node.js + browser) fork of [@stephen-riley/pcre2-wasm](https://github.com/stephen-riley/pcre2-wasm).

This package provides PCRE2 (Perl Compatible Regular Expressions 2) compiled to WebAssembly, modified to work in both Node.js and browser environments.

## Changes from Original

The original `@stephen-riley/pcre2-wasm` package has several Node.js-specific dependencies that prevent it from working in browsers:

1. **`libpcre2.js`** - Uses `require("path")` and `__dirname` to locate WASM file
2. **`PCRE.js`** - Uses `require("assert")` for assertions
3. **`PCRE.js`** - Uses `require("util").TextDecoder` instead of browser-native `TextDecoder`
4. **`PCRE.js`** - Uses `Buffer.from(str, 'utf16le')` for UTF-16 encoding

This fork addresses all these issues:

- Removed Node.js-specific WASM file locator (browsers use `scriptDirectory` detection)
- Replaced `require("assert")` with inline assertion function
- Uses browser-native `TextDecoder('utf-16le')`
- Replaced `Buffer.from()` with custom `encodeUTF16LE()` function
- Converted to ESM module format

## Installation

```bash
npm install ../pcre2-wasm-universal
```

Or copy the package to your project.

## Usage

```javascript
import PCRE from 'pcre2-wasm-universal';

// Initialize PCRE2 (required before first use)
await PCRE.init();

// Create a regex pattern
const regex = new PCRE('\\d+');

// Match against a string
const result = regex.match('abc123def');
console.log(result[0].match); // "123"

// Clean up when done
regex.destroy();
```

## WASM File Location

In browser environments, the WASM file (`libpcre2.wasm`) needs to be served from the same directory as `libpcre2.js`. If using a bundler like Vite, you may need to configure it to handle the WASM file correctly.

For Vite, you can use the `?url` import suffix or configure `assetsInclude` in `vite.config.js`:

```javascript
// vite.config.js
export default {
  assetsInclude: ['**/*.wasm'],
  optimizeDeps: {
    exclude: ['pcre2-wasm-universal']
  }
}
```

## API

### `PCRE.init()`

Initializes the PCRE2 WASM module. Must be called before creating any PCRE instances.

### `new PCRE(pattern, flags)`

Creates a new PCRE regex instance.

- `pattern` - The regex pattern string
- `flags` - Optional flags string

### `pcre.match(subject, start)`

Matches the pattern against the subject string.

- `subject` - The string to match against
- `start` - Optional starting offset (default: 0)

Returns match object with capture groups, or `null` if no match.

### `pcre.matchAll(subject)`

Returns all matches in the subject string.

### `pcre.substitute(subject, replacement, startOffset, options)`

Performs regex substitution.

### `pcre.destroy()`

Frees WASM memory. Call when done with the regex instance.

## License

MIT License - see [LICENSE](LICENSE)

Original package by J. Stephen Riley.
