#!/bin/bash
# Cross-platform build script for iOS, Android, Windows, Linux, macOS

set -e

PLATFORM=${1:-all}

echo "Building Rust browser for: $PLATFORM"

# Build for WebAssembly (web)
build_wasm() {
    echo "Building WebAssembly target..."
    cd rust-browser
    cargo build --target wasm32-unknown-unknown --release
    wasm-pack build --target web --out-dir ../pkg
    cd ..
}

# Build for iOS
build_ios() {
    echo "Building iOS targets..."
    cd rust-browser
    
    # Build for iOS simulator
    cargo build --target aarch64-apple-ios-sim --release
    
    # Build for iOS device
    cargo build --target aarch64-apple-ios --release
    
    cd ..
}

# Build for Android
build_android() {
    echo "Building Android targets..."
    cd rust-browser
    
    # Install Android targets if needed
    rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
    
    # Build for Android architectures
    cargo build --target aarch64-linux-android --release
    cargo build --target armv7-linux-androideabi --release
    cargo build --target i686-linux-android --release
    cargo build --target x86_64-linux-android --release
    
    cd ..
}

# Build for Linux
build_linux() {
    echo "Building Linux target..."
    cd rust-browser
    cargo build --target x86_64-unknown-linux-gnu --release
    cd ..
}

# Build for macOS
build_macos() {
    echo "Building macOS targets..."
    cd rust-browser
    
    # Intel Mac
    cargo build --target x86_64-apple-darwin --release
    
    # Apple Silicon
    cargo build --target aarch64-apple-darwin --release
    
    cd ..
}

# Build for Windows
build_windows() {
    echo "Building Windows targets..."
    cd rust-browser
    
    # Windows MSVC
    cargo build --target x86_64-pc-windows-msvc --release
    
    # Windows GNU (alternative)
    cargo build --target x86_64-pc-windows-gnu --release
    
    cd ..
}

case "$PLATFORM" in
    wasm)
        build_wasm
        ;;
    ios)
        build_ios
        ;;
    android)
        build_android
        ;;
    linux)
        build_linux
        ;;
    macos)
        build_macos
        ;;
    windows)
        build_windows
        ;;
    all)
        build_wasm
        build_ios
        build_android
        build_linux
        build_macos
        build_windows
        ;;
    *)
        echo "Unknown platform: $PLATFORM"
        echo "Usage: $0 [wasm|ios|android|linux|macos|windows|all]"
        exit 1
        ;;
esac

echo "Build complete!"

