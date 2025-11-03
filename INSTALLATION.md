# Installation Guide

Complete installation instructions for all platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Web Installation](#web-installation)
3. [Desktop Installation](#desktop-installation)
4. [Mobile Installation](#mobile-installation)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Rust** (1.70+): https://rustup.rs/
- **Node.js/Bun**: https://bun.sh/ or https://nodejs.org/
- **Git**: For cloning the repository

### Platform-Specific

- **Windows**: Visual Studio Build Tools with C++ workload
- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Linux**: Build tools and WebKit development libraries
- **Android**: Android Studio, Android NDK
- **iOS**: Xcode (macOS only)

## Web Installation

### Quick Start (Development)

```bash
# 1. Clone repository
git clone <repository-url>
cd Browser-tasks-trial-Est

# 2. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 3. Install wasm-pack
cargo install wasm-pack

# 4. Install frontend dependencies
bun install

# 5. Build Rust WASM backend
npm run build:rust:wasm

# 6. Start development server
bun run dev
```

Open `http://localhost:8080` in your browser.

### Production Build

```bash
# Build everything
npm run build:all

# Output in dist/ directory
# Deploy dist/ to your web server
```

## Desktop Installation

### Windows

#### Step 1: Install Prerequisites

1. Download and install [Rust](https://rustup.rs/) (MSVC toolchain)
2. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
   - Select "C++ build tools" workload
3. Install [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)

#### Step 2: Build

```powershell
# Open PowerShell in project directory

# Install Rust Windows target
rustup target add x86_64-pc-windows-msvc

# Build Rust library
cd rust-browser
cargo build --release --target x86_64-pc-windows-msvc
cd ..

# Build frontend
bun install
bun run build
```

#### Step 3: Package

Create a Windows installer:
- Option 1: Use [NSIS](https://nsis.sourceforge.io/)
- Option 2: Use [WiX Toolset](https://wixtoolset.org/)
- Option 3: Create portable ZIP with all files

### macOS

#### Step 1: Install Prerequisites

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Bun
curl -fsSL https://bun.sh/install | bash
```

#### Step 2: Build

```bash
# Install Rust targets
rustup target add aarch64-apple-darwin  # Apple Silicon
rustup target add x86_64-apple-darwin   # Intel (if needed)

# Build Rust library
cd rust-browser
cargo build --release --target aarch64-apple-darwin
cd ..

# Build frontend
bun install
bun run build
```

#### Step 3: Create .app Bundle

```bash
# Create app structure
mkdir -p MyBrowser.app/Contents/{MacOS,Resources}

# Copy binaries
cp target/aarch64-apple-darwin/release/lib*.dylib MyBrowser.app/Contents/MacOS/

# Create Info.plist (see macOS app bundle documentation)
# Sign and notarize for distribution
```

### Linux

#### Step 1: Install Prerequisites

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install build-essential libwebkit2gtk-4.1-dev curl
```

**Fedora:**
```bash
sudo dnf install gcc webkit2gtk3-devel curl
```

**Arch Linux:**
```bash
sudo pacman -S base-devel webkit2gtk curl
```

#### Step 2: Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### Step 3: Build

```bash
# Build Rust library
cd rust-browser
cargo build --release
cd ..

# Build frontend
bun install
bun run build
```

#### Step 4: Package

**Create .deb (Debian/Ubuntu):**
```bash
cargo install cargo-deb
cd rust-browser
cargo deb
# Output: target/debian/rust-browser_*.deb
```

**Create .rpm (Fedora/RHEL):**
```bash
cargo install cargo-rpm
cd rust-browser
cargo rpm
# Output: target/rpmbuild/RPMS/*/rust-browser-*.rpm
```

**Create AppImage:**
- Use [linuxdeploy](https://github.com/linuxdeploy/linuxdeploy)
- Or package manually with AppDir structure

## Mobile Installation

### Android

#### Step 1: Install Prerequisites

1. Install [Android Studio](https://developer.android.com/studio)
2. Install Android NDK via Android Studio SDK Manager
3. Set environment variable:
   ```bash
   export ANDROID_NDK_HOME=$HOME/Android/Sdk/ndk/<version>
   export PATH=$PATH:$ANDROID_NDK_HOME
   ```

#### Step 2: Install Rust Android Targets

```bash
rustup target add aarch64-linux-android
rustup target add armv7-linux-androideabi
rustup target add i686-linux-android
rustup target add x86_64-linux-android
```

#### Step 3: Create Android Project

1. Open Android Studio
2. Create new "Native C++" project
3. Configure `build.gradle`:
   ```gradle
   android {
       externalNativeBuild {
           cmake {
               path "src/main/cpp/CMakeLists.txt"
           }
       }
   }
   ```

#### Step 4: Build Rust Library

```bash
cd rust-browser
cargo build --release --target aarch64-linux-android
cd ..
```

#### Step 5: Integrate into Android Project

1. Copy Rust library to `app/src/main/jniLibs/<arch>/`
2. Create JNI wrapper in `src/main/cpp/`
3. Add Java/Kotlin bindings
4. Build APK/AAB in Android Studio

#### Step 6: Install on Device

```bash
# Enable USB debugging on Android device
# Connect device and run:
adb install app-debug.apk
```

### iOS

#### Step 1: Install Prerequisites

1. Install [Xcode](https://developer.apple.com/xcode/) from App Store
2. Install Rust:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

#### Step 2: Install Rust iOS Targets

```bash
rustup target add aarch64-apple-ios      # Device
rustup target add aarch64-apple-ios-sim # Simulator
rustup target add x86_64-apple-ios       # Intel Simulator (if needed)
```

#### Step 3: Create Xcode Project

1. Open Xcode
2. Create new iOS App project
3. Add Rust library:

   - In Build Phases:
     - Add Rust static library to "Link Binary With Libraries"
     - Add build script to compile Rust code:
       ```bash
       cd rust-browser
       cargo build --release --target aarch64-apple-ios
       ```

#### Step 4: Build

1. Select target device or simulator
2. Click Build (⌘B)
3. Run (⌘R) to deploy

#### Step 5: Deploy to Device

1. Connect iOS device via USB
2. Select device in Xcode
3. Sign with your Apple Developer account
4. Run on device

## Troubleshooting

### Rust Installation Issues

**Problem**: `rustup` command not found
**Solution**: Add to PATH:
```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

**Problem**: Build fails on Windows
**Solution**: Install Visual Studio Build Tools with C++ workload

### WebAssembly Build Issues

**Problem**: `wasm-pack` not found
**Solution**: 
```bash
cargo install wasm-pack
```

**Problem**: WASM build fails
**Solution**: Ensure Rust target is installed:
```bash
rustup target add wasm32-unknown-unknown
```

### Platform-Specific Issues

**Linux**: WebKit not found
```bash
# Ubuntu/Debian
sudo apt-get install libwebkit2gtk-4.1-dev

# Fedora
sudo dnf install webkit2gtk3-devel
```

**macOS**: Code signing errors
- Add signing certificate in Xcode
- Or use ad-hoc signing for development

**Android**: NDK not found
```bash
export ANDROID_NDK_HOME=$HOME/Android/Sdk/ndk/<version>
```

### Memory Issues

If you encounter memory issues during build:
- Increase swap space (Linux)
- Close other applications
- Build in release mode: `cargo build --release`

## Getting Help

- Check [PLATFORM_BUILD.md](./PLATFORM_BUILD.md) for detailed build instructions
- See [QUICKSTART.md](./QUICKSTART.md) for quick setup
- Review [BROWSER_ARCHITECTURE.md](./BROWSER_ARCHITECTURE.md) for architecture details

