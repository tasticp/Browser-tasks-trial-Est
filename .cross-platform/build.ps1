# PowerShell build script for Windows
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('wasm','ios','android','linux','macos','windows','all')]
    [string]$Platform = 'all'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Write-Host "Building Rust browser for: $Platform" -ForegroundColor Green

function Build-Wasm {
    Write-Host "Building WebAssembly target..." -ForegroundColor Cyan
    Set-Location rust-browser
    cargo build --target wasm32-unknown-unknown --release
    wasm-pack build --target web --out-dir ../pkg
    Set-Location ..
}

function Build-Windows {
    Write-Host "Building Windows targets..." -ForegroundColor Cyan
    Set-Location rust-browser
    cargo build --target x86_64-pc-windows-msvc --release
    cargo build --target x86_64-pc-windows-gnu --release
    Set-Location ..
}

function Build-All {
    Build-Wasm
    Build-Windows
}

switch ($Platform) {
    'wasm' { Build-Wasm }
    'windows' { Build-Windows }
    'all' { Build-All }
    default {
        Write-Host "Platform $Platform not supported on Windows" -ForegroundColor Yellow
        Write-Host "Use: wasm, windows, or all" -ForegroundColor Yellow
    }
}

Write-Host "Build complete!" -ForegroundColor Green

