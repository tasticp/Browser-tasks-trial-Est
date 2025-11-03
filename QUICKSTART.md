# Quick Start Guide

## Building the Rust Browser

### Prerequisites

1. **Install Rust**: https://rustup.rs/
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Install wasm-pack** (for WebAssembly builds):
   ```bash
   cargo install wasm-pack
   ```

3. **Install Node.js/Bun** for frontend:
   ```bash
   # Using Bun (recommended)
   curl -fsSL https://bun.sh/install | bash
   ```

### Building

1. **Build Rust backend for WebAssembly**:
   ```bash
   cd rust-browser
   wasm-pack build --target web --out-dir ../pkg
   cd ..
   ```

2. **Install frontend dependencies**:
   ```bash
   bun install
   ```

3. **Start development server**:
   ```bash
   bun run dev
   ```

4. **Or build everything**:
   ```bash
   bun run build:all
   ```

## Building for Specific Platforms

### iOS
```bash
# Install iOS targets
rustup target add aarch64-apple-ios aarch64-apple-ios-sim

# Build
./.cross-platform/build.sh ios
```

### Android
```bash
# Install Android targets
rustup target add aarch64-linux-android armv7-linux-androideabi

# Set Android NDK path
export ANDROID_NDK_HOME=/path/to/android-ndk

# Build
./.cross-platform/build.sh android
```

### Desktop (Windows/Linux/macOS)
```bash
# Windows
.\.cross-platform\build.ps1 -Platform windows

# Linux
./.cross-platform/build.sh linux

# macOS
./.cross-platform/build.sh macos
```

## Memory Optimization

The browser is optimized for minimal memory usage:

- **Rust backend**: ~10-50MB baseline
- **Memory pooling**: Efficient allocations
- **Zero-copy**: Where possible
- **Size-optimized**: Release builds use `opt-level = "z"`

### Monitoring Memory

The browser includes built-in memory tracking. Check the memory stats in the browser UI (top bar) or via:

```typescript
import { RustBrowserService } from '@/services/RustBrowserService';
const service = await RustBrowserService.getInstance();
// Memory stats available in service
```

## Performance Tips

1. **Use release builds**: `cargo build --release`
2. **Enable LTO**: Already enabled in `Cargo.toml`
3. **Strip symbols**: `strip target/release/lib*.so`
4. **Use Servo engine**: More memory-efficient than WebKit

## Troubleshooting

### Build fails on Linux
Install WebKit development libraries:
```bash
sudo apt-get install libwebkit2gtk-4.1-dev
```

### Build fails on Android
Set `ANDROID_NDK_HOME` environment variable:
```bash
export ANDROID_NDK_HOME=/path/to/android-ndk
```

### WASM module not found
Build the WASM module first:
```bash
npm run build:rust:wasm
```

## Next Steps

- See [PLATFORM_BUILD.md](./PLATFORM_BUILD.md) for detailed platform-specific instructions
- See [BROWSER_ARCHITECTURE.md](./BROWSER_ARCHITECTURE.md) for architecture details
- See [README.md](./README.md) for full documentation

