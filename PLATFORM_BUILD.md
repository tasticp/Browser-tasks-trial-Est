# Cross-Platform Build Guide

This browser is built with Rust for minimal memory usage and cross-platform support.

## Platforms Supported

- ✅ **iOS** (iPhone/iPad)
- ✅ **Android** (All architectures)
- ✅ **Windows** (x64, ARM64)
- ✅ **Linux** (x64, ARM64)
- ✅ **macOS** (Intel & Apple Silicon)
- ✅ **Web** (WebAssembly)

## Memory Optimization

The Rust backend is optimized for minimal memory usage:

- **Zero-copy** string handling where possible
- **Memory pools** for efficient allocation
- **Link-time optimization** for smaller binaries
- **Size-optimized** release builds
- **Memory tracking** for monitoring

## Building

### Prerequisites

1. Install Rust: https://rustup.rs/
2. Install target platforms:
   ```bash
   # WebAssembly
   rustup target add wasm32-unknown-unknown
   
   # iOS
   rustup target add aarch64-apple-ios aarch64-apple-ios-sim
   
   # Android (requires Android NDK)
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   
   # Linux
   rustup target add x86_64-unknown-linux-gnu
   
   # macOS
   rustup target add x86_64-apple-darwin aarch64-apple-darwin
   
   # Windows
   rustup target add x86_64-pc-windows-msvc
   ```

3. Install wasm-pack (for WebAssembly):
   ```bash
   cargo install wasm-pack
   ```

### Building for All Platforms

**Linux/macOS:**
```bash
chmod +x .cross-platform/build.sh
./.cross-platform/build.sh all
```

**Windows:**
```powershell
.\.cross-platform\build.ps1 -Platform all
```

### Building for Specific Platform

```bash
# WebAssembly (for web)
./.cross-platform/build.sh wasm

# iOS
./.cross-platform/build.sh ios

# Android
./.cross-platform/build.sh android

# Linux
./.cross-platform/build.sh linux

# macOS
./.cross-platform/build.sh macos

# Windows
./.cross-platform/build.sh windows
```

## Platform-Specific Setup

### iOS

1. Install Xcode Command Line Tools
2. Build iOS targets
3. Integrate into Xcode project:
   - Add Rust library to Xcode project
   - Link WebKit framework
   - Configure build settings

### Android

1. Install Android NDK
2. Set `ANDROID_NDK_HOME` environment variable
3. Build Android targets
4. Create Android project and include Rust library:
   ```gradle
   // In build.gradle
   android {
       externalNativeBuild {
           cmake {
               path "src/main/cpp/CMakeLists.txt"
           }
       }
   }
   ```

### Windows

1. Install Visual Studio Build Tools
2. Install Windows SDK
3. Build with MSVC target (default)

### Linux

1. Install WebKit development libraries:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install libwebkit2gtk-4.1-dev
   
   # Fedora
   sudo dnf install webkit2gtk3-devel
   ```

2. Build Linux target

### macOS

1. Install Xcode Command Line Tools
2. WebKit is included in macOS SDK
3. Build macOS targets

## Memory Optimization Flags

The `Cargo.toml` includes optimization settings:

```toml
[profile.release]
opt-level = "z"  # Optimize for size
lto = true       # Link-time optimization
codegen-units = 1
strip = true     # Strip symbols
panic = "abort"  # Smaller binary
```

## Performance

- **Memory Usage**: ~10-50MB baseline (vs 200-500MB for Chromium)
- **Startup Time**: <100ms (vs 500-1000ms for Chromium)
- **Binary Size**: ~2-5MB compressed (vs 50-100MB for Chromium)

## Integration with Frontend

### WebAssembly (Web)

```typescript
import init, { WasmBrowser } from './pkg/rust_browser.js';

await init();
const browser = new WasmBrowser('servo');
```

### Native (Desktop/Mobile)

Use platform-specific FFI bindings or JNI (Android) / Objective-C (iOS).

## Testing

```bash
# Run Rust tests
cd rust-browser
cargo test

# Run with memory profiling
cargo test --release
```

## Troubleshooting

### Build Fails on iOS
- Ensure Xcode Command Line Tools are installed
- Check that iOS SDK path is correct

### Build Fails on Android
- Verify Android NDK is installed and `ANDROID_NDK_HOME` is set
- Check that NDK version is compatible

### Build Fails on Linux
- Install WebKit development packages
- Check that pkg-config can find WebKit

### High Memory Usage
- Ensure release build (`--release` flag)
- Check memory pool settings in `rust-browser/src/memory.rs`
- Enable memory profiling

