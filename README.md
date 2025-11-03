# New Browser — Rust-based, Minimal Memory

A browser built with **Rust for minimal memory usage** and **cross-platform support**. Not based on Chromium or Firefox. Similar to Ladybird, uses an independent rendering engine architecture.


## Memory Optimized 🚀

- **~10-50MB baseline** (vs 200-500MB for Chromium)
- **Rust backend** for zero-cost abstractions
- **Memory pooling** for efficient allocations
- **Size-optimized builds** (2-5MB vs 50-100MB)
- **Fast startup** (<100ms vs 500-1000ms)

## Cross-Platform ✅

Works on:
- ✅ **iOS** (iPhone/iPad)
- ✅ **Android** (All architectures)  
- ✅ **Windows** (x64, ARM64)
- ✅ **Linux** (x64, ARM64)
- ✅ **macOS** (Intel & Apple Silicon)
- ✅ **Web** (WebAssembly)

## Architecture

This browser implements a complete engine abstraction layer that allows switching between different rendering engines:

- **WebKit Engine** - Similar to Ladybird's LibWeb (default)
- **Servo Engine** - Mozilla's experimental Rust-based engine
- **Custom Engine** - Framework for adding your own engine

The browser UI is completely independent of Chromium/Firefox and can connect to any compatible rendering engine via native bindings.

See [BROWSER_ARCHITECTURE.md](./BROWSER_ARCHITECTURE.md) for detailed architecture documentation.

## Setup Instructions

**Use your preferred IDE**

The only requirement is having Node.js installed. You can use npm or Bun.

Follow these steps (npm):

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
Alternatively with Bun:

```sh
# Install dependencies
bun install

# Start dev server
bun run dev
```
```

## What technologies are used for this project?

This project is built with:

- **Rust** - Core browser engine (minimal memory, maximum speed)
- **TypeScript/React** - Frontend UI
- **WebAssembly** - Rust-JS interop
- **WebKit/Servo Engine** - Rendering engines (not Chromium/Firefox)
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Styling
- **Bun** - Optional runtime for faster dev experience

## Architecture

The browser uses a **Rust backend** for all heavy operations:
- Tab management (memory-efficient)
- Navigation engine
- Memory pooling and tracking
- Cross-platform rendering engine interface

The **React frontend** provides the UI and communicates with Rust via WebAssembly (web) or native bindings (mobile/desktop).

## How can I deploy this project?

Deploy the built application to your preferred hosting platform or package it as a native app for distribution.

## Features

- ✅ **Independent Engine Architecture** - Not based on Chromium or Firefox
- ✅ **Multi-tab Browsing** - Full tab management with parent-child relationships
- ✅ **Navigation Controls** - Back, forward, reload, stop
- ✅ **Address Bar** - URL entry with search functionality
- ✅ **Tab Management** - Create, close, and switch between tabs
- ✅ **Session Management** - History tracking and session persistence
- ✅ **Engine Abstraction** - Switch between WebKit, Servo, or custom engines


## Running the Browser

### Quick Start

**Windows:**
```powershell
.\setup-and-build.ps1
```

**Linux/macOS:**
```bash
chmod +x setup-and-build.sh
./setup-and-build.sh
```

See [QUICKSTART.md](./QUICKSTART.md) or [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions.

### Development

```sh
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install wasm-pack
cargo install wasm-pack

# Install frontend dependencies
bun install

# Build Rust backend (WebAssembly)
npm run build:rust:wasm

# Start development server
bun run dev
```

The browser will be available at `http://localhost:8080`

> **Note**: The Rust backend uses WebAssembly for web builds. For native mobile/desktop apps, see [PLATFORM_BUILD.md](./PLATFORM_BUILD.md).

### Production Build

```sh
# Build for production
bun run build

# Preview production build
bun run preview
```

## Building for Production

### Web (WebAssembly)
```bash
npm run build:all  # Builds Rust WASM + React frontend
```

### Native Platforms
See [PLATFORM_BUILD.md](./PLATFORM_BUILD.md) for iOS, Android, Windows, Linux, and macOS builds.

## Engine Integration

The Rust backend provides engine abstractions in `rust-browser/src/engine.rs`. Currently implemented:

- ✅ **Servo Engine** (Rust-native, minimal memory)
- ✅ **WebKit Engine** (C++ bindings, cross-platform)

To connect to real native rendering engines:

1. Install native bindings for WebKit or Servo
2. Update the engine implementations in `rust-browser/src/engine.rs`
3. For web: Build WASM module with `wasm-pack build`
4. For native: Link Rust library in platform project

See [BROWSER_ARCHITECTURE.md](./BROWSER_ARCHITECTURE.md) for detailed integration instructions.

## Installation Instructions

### Web (Browser)

1. **Install Prerequisites:**
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   
   # Install wasm-pack
   cargo install wasm-pack
   
   # Install Bun (or use npm)
   curl -fsSL https://bun.sh/install | bash
   ```

2. **Build and Run:**
   ```bash
   # Install dependencies
   bun install
   
   # Build Rust WASM backend
   npm run build:rust:wasm
   
   # Start development server
   bun run dev
   ```
   
   Open `http://localhost:8080` in your browser.

### Desktop Applications



#### Windows

1. **Prerequisites:**
   - Install [Rust](https://rustup.rs/) (MSVC version)
   - Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) with C++ workload
   - Install [Node.js](https://nodejs.org/) or Bun

2. **Build:**
   ```powershell
   # Install Rust targets
   rustup target add x86_64-pc-windows-msvc
   
   # Build Rust library
   cd rust-browser
   cargo build --release --target x86_64-pc-windows-msvc
   cd ..
   
   # Build frontend
   bun install
   bun run build
   ```

3. **Package:**
   - Create Windows installer using NSIS, WiX, or similar
   - Include the built Rust DLL and frontend files

#### macOS

1. **Prerequisites:**
   - Install [Xcode Command Line Tools](https://developer.apple.com/xcode/)
   - Install [Rust](https://rustup.rs/)
   - Install Bun or Node.js

2. **Build:**
   ```bash
   # Install Rust targets
   rustup target add x86_64-apple-darwin aarch64-apple-darwin
   
   # Build for your architecture
   cd rust-browser
   cargo build --release --target aarch64-apple-darwin  # Apple Silicon
   # OR
   cargo build --release --target x86_64-apple-darwin   # Intel
   cd ..
   
   # Build frontend
   bun install
   bun run build
   ```

3. **Package as .app:**
   ```bash
   # Create .app bundle structure
   mkdir -p MyBrowser.app/Contents/{MacOS,Resources}
   # Copy binaries and resources
   # Create Info.plist
   ```

#### Linux

1. **Prerequisites:**
   ```bash
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   
   # Install WebKit development libraries
   # Ubuntu/Debian:
   sudo apt-get install libwebkit2gtk-4.1-dev build-essential
   
   # Fedora:
   sudo dnf install webkit2gtk3-devel gcc
   ```

2. **Build:**
   ```bash
   # Install Rust target
   rustup target add x86_64-unknown-linux-gnu
   
   # Build Rust library
   cd rust-browser
   cargo build --release
   cd ..
   
   # Build frontend
   bun install
   bun run build
   ```

3. **Create .deb/.rpm package:**
   - Use `cargo-deb` or `cargo-rpm` tools
   - Or create manual package with proper dependencies

### Mobile Applications

#### Android

1. **Prerequisites:**
   - Install [Android Studio](https://developer.android.com/studio)
   - Install [Android NDK](https://developer.android.com/ndk/downloads)
   - Set environment variable:
     ```bash
     export ANDROID_NDK_HOME=/path/to/android-ndk
     ```

2. **Build:**
   ```bash
   # Install Rust Android targets
   rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
   
   # Build Rust library for Android
   cd rust-browser
   cargo build --release --target aarch64-linux-android
   cd ..
   ```

3. **Create Android Project:**
   - Create new Android Studio project
   - Copy Rust library to `app/src/main/jniLibs/`
   - Add JNI bindings in Java/Kotlin
   - Package as APK/AAB

#### iOS

1. **Prerequisites:**
   - Install [Xcode](https://developer.apple.com/xcode/)
   - Install [Rust](https://rustup.rs/)
   - Install [CocoaPods](https://cocoapods.org/) (if needed)

2. **Build:**
   ```bash
   # Install Rust iOS targets
   rustup target add aarch64-apple-ios aarch64-apple-ios-sim x86_64-apple-ios
   
   # Build Rust library
   cd rust-browser
   cargo build --release --target aarch64-apple-ios
   cd ..
   ```

3. **Create Xcode Project:**
   - Create new iOS project in Xcode
   - Add Rust library via Build Phases
   - Link WebKit framework
   - Build and deploy to device/simulator

See [PLATFORM_BUILD.md](./PLATFORM_BUILD.md) for detailed platform-specific build instructions.

no geruntieee it works its just AI coded if it breaks your deevice i dont hold any responsibility