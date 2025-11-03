#!/bin/bash
# Setup and Build Script for Linux/macOS
# Run this script to install prerequisites and build the browser

set -e

echo "=== Browser Setup and Build Script ==="
echo ""

# Check if Rust is installed
echo "Checking for Rust..."
if command -v rustc &> /dev/null; then
    RUST_VERSION=$(rustc --version)
    echo "✓ Rust is installed: $RUST_VERSION"
else
    echo "✗ Rust not found. Installing..."
    echo ""
    echo "Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo "✓ Rust installed successfully"
fi

# Check if wasm-pack is installed
echo ""
echo "Checking for wasm-pack..."
if command -v wasm-pack &> /dev/null; then
    WASM_VERSION=$(wasm-pack --version)
    echo "✓ wasm-pack is installed: $WASM_VERSION"
else
    echo "✗ wasm-pack not found. Installing..."
    echo "Installing wasm-pack..."
    cargo install wasm-pack
    echo "✓ wasm-pack installed successfully"
fi

# Check for Bun or Node.js
echo ""
echo "Checking for Bun/Node.js..."
HAS_BUN=false
HAS_NODE=false

if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun --version)
    echo "✓ Bun is installed: $BUN_VERSION"
    HAS_BUN=true
elif command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js is installed: $NODE_VERSION"
    HAS_NODE=true
else
    echo "✗ Neither Bun nor Node.js found"
    echo "Install Bun: curl -fsSL https://bun.sh/install | bash"
    echo "Or Node.js: https://nodejs.org/"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
if [ "$HAS_BUN" = true ]; then
    bun install
else
    npm install
fi

echo "✓ Dependencies installed"

# Build Rust WASM backend
echo ""
echo "Building Rust WASM backend..."
if [ -d "rust-browser" ]; then
    cd rust-browser
    
    # Install WASM target
    echo "Installing WASM target..."
    rustup target add wasm32-unknown-unknown
    
    # Build with wasm-pack
    echo "Building with wasm-pack..."
    wasm-pack build --target web --out-dir ../pkg
    
    if [ $? -eq 0 ]; then
        echo "✓ Rust WASM backend built successfully"
    else
        echo "✗ Failed to build Rust WASM backend"
        echo "You can still run the dev server, but Rust features won't work"
    fi
    
    cd ..
else
    echo "✗ rust-browser directory not found"
fi

# Build frontend
echo ""
echo "Building frontend..."
if [ "$HAS_BUN" = true ]; then
    bun run build
else
    npm run build
fi

if [ $? -eq 0 ]; then
    echo "✓ Frontend built successfully"
else
    echo "✗ Failed to build frontend"
    exit 1
fi

# Summary
echo ""
echo "=== Build Complete ==="
echo ""
echo "To run the development server:"
if [ "$HAS_BUN" = true ]; then
    echo "  bun run dev"
else
    echo "  npm run dev"
fi
echo ""
echo "The browser will be available at: http://localhost:8080"
echo ""

