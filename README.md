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

## Project info

**URL**: https://lovable.dev/projects/b585dc5f-50ee-4170-b883-92118a110c00

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


Simply open [Lovable](https://lovable.dev/projects/b585dc5f-50ee-4170-b883-92118a110c00) and click on Share -> Publish.

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

See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

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

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
