# Setup and Build Script for Windows
# Run this script to install prerequisites and build the browser

Write-Host "=== Browser Setup and Build Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if Rust is installed
Write-Host "Checking for Rust..." -ForegroundColor Yellow
try {
    $rustVersion = rustc --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Rust is installed: $rustVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Rust not found. Installing..." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Rust from: https://rustup.rs/" -ForegroundColor Yellow
    Write-Host "Or run: irm https://win.rustup.rs/x86_64 | iex" -ForegroundColor Yellow
    Write-Host ""
    $installRust = Read-Host "Press Enter after installing Rust, or 'S' to skip"
    if ($installRust -eq 'S') {
        Write-Host "Skipping Rust installation. Build will fail without it." -ForegroundColor Yellow
    }
}

# Check if wasm-pack is installed
Write-Host ""
Write-Host "Checking for wasm-pack..." -ForegroundColor Yellow
try {
    $wasmPackVersion = wasm-pack --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ wasm-pack is installed: $wasmPackVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ wasm-pack not found. Installing..." -ForegroundColor Yellow
    Write-Host "Installing wasm-pack..." -ForegroundColor Cyan
    cargo install wasm-pack
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ wasm-pack installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install wasm-pack" -ForegroundColor Red
    }
}

# Check for Bun or Node.js
Write-Host ""
Write-Host "Checking for Bun/Node.js..." -ForegroundColor Yellow
$hasBun = $false
$hasNode = $false

try {
    $bunVersion = bun --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Bun is installed: $bunVersion" -ForegroundColor Green
        $hasBun = $true
    }
} catch {
    Write-Host "Bun not found, checking for Node.js..." -ForegroundColor Yellow
    try {
        $nodeVersion = node --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
            $hasNode = $true
        }
    } catch {
        Write-Host "✗ Neither Bun nor Node.js found" -ForegroundColor Red
        Write-Host "Install Bun from: https://bun.sh/" -ForegroundColor Yellow
        Write-Host "Or Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    }
}

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
if ($hasBun) {
    bun install
} elseif ($hasNode) {
    npm install
} else {
    Write-Host "✗ Cannot install dependencies without Bun or Node.js" -ForegroundColor Red
    exit 1
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Build Rust WASM backend
Write-Host ""
Write-Host "Building Rust WASM backend..." -ForegroundColor Cyan
if (Test-Path "rust-browser") {
    Set-Location rust-browser
    
    # Install WASM target
    Write-Host "Installing WASM target..." -ForegroundColor Yellow
    rustup target add wasm32-unknown-unknown
    
    # Build with wasm-pack
    Write-Host "Building with wasm-pack..." -ForegroundColor Yellow
    wasm-pack build --target web --out-dir ../pkg
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Rust WASM backend built successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to build Rust WASM backend" -ForegroundColor Red
        Write-Host "You can still run the dev server, but Rust features won't work" -ForegroundColor Yellow
    }
    
    Set-Location ..
} else {
    Write-Host "✗ rust-browser directory not found" -ForegroundColor Red
}

# Build frontend
Write-Host ""
Write-Host "Building frontend..." -ForegroundColor Cyan
if ($hasBun) {
    bun run build
} else {
    npm run build
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to build frontend" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "=== Build Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To run the development server:" -ForegroundColor Yellow
if ($hasBun) {
    Write-Host "  bun run dev" -ForegroundColor White
} else {
    Write-Host "  npm run dev" -ForegroundColor White
}
Write-Host ""
Write-Host "The browser will be available at: http://localhost:8080" -ForegroundColor Green
Write-Host ""

