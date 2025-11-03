# Browser Architecture

This is a new browser built from scratch, **not based on Chromium or Firefox**. Similar to Ladybird, it uses an independent rendering engine architecture.

## Architecture Overview

### Core Engine Abstraction

The browser uses an abstraction layer (`src/core/engine/`) that allows switching between different rendering engines:

- **WebKit Engine** (`WebKitEngine.ts`) - Similar to Ladybird's LibWeb
- **Servo Engine** (`ServoEngine.ts`) - Mozilla's experimental Rust-based engine
- **Custom Engine** - Framework for adding your own engine

### Engine Interface

All engines implement the `BrowserEngine` interface:

```typescript
interface BrowserEngine {
  initialize(): Promise<void>;
  loadURL(url: string, tabId: string): Promise<void>;
  goBack(tabId: string): Promise<void>;
  goForward(tabId: string): Promise<void>;
  reload(tabId: string): Promise<void>;
  stop(tabId: string): Promise<void>;
  // ... more methods
}
```

This abstraction allows the browser UI to work with any compatible rendering engine without being tied to Chromium or Firefox.

## Current Implementation

### WebKit Engine (Default)

The WebKit engine is currently implemented as a mock/prototype. In production, this would connect to:

- **Native WebKit libraries** via Node.js bindings (using `node-webkit` or similar)
- **WebKitGTK** on Linux
- **WebKit framework** on macOS
- **WebKit2** for multi-process architecture

### Servo Engine (Alternative)

The Servo engine provides an alternative Rust-based implementation. This would connect to:

- **Servo library** via WebAssembly or native bindings
- **Servo's layout engine** for parallel rendering

## Browser Services

### BrowserService (`src/services/BrowserService.ts`)

Manages:
- Tab creation and lifecycle
- Navigation history
- Parent-child tab relationships
- Session management
- Engine communication

## UI Components

### BrowserWindow (`src/components/browser/BrowserWindow.tsx`)
Main browser window container

### AddressBar (`src/components/browser/AddressBar.tsx`)
Address bar with navigation controls

### TabBar (`src/components/browser/TabBar.tsx`)
Tab management interface

### BrowserView (`src/components/browser/BrowserView.tsx`)
Renders the actual web page (currently uses iframe as placeholder)

## Integration with Native Engines

To connect to a real native rendering engine:

1. **Install native bindings**:
   - For WebKit: `npm install webkit` or build custom bindings
   - For Servo: Use Servo's embedding API

2. **Update Engine Implementation**:
   - Replace mock methods in `WebKitEngine.ts` or `ServoEngine.ts`
   - Connect to native WebView components
   - Handle native events (navigation, loading, etc.)

3. **Update BrowserView**:
   - Embed native WebView component instead of iframe
   - Connect to engine's rendering output

## Example: WebKit Integration

```typescript
// In WebKitEngine.ts (simplified)
import { WebKit } from 'native-webkit-bindings';

async loadURL(url: string, tabId: string): Promise<void> {
  const webkitView = await WebKit.createView(tabId);
  await webkitView.loadURL(url);
  
  webkitView.on('navigation-state-changed', (state) => {
    this.notifyNavigationState(tabId, state);
  });
}
```

## Example: Servo Integration

```typescript
// In ServoEngine.ts (simplified)
import { Servo } from 'native-servo-bindings';

async loadURL(url: string, tabId: string): Promise<void> {
  const servoView = await Servo.createView(tabId);
  await servoView.loadURL(url);
  
  servoView.on('navigation-state-changed', (state) => {
    this.notifyNavigationState(tabId, state);
  });
}
```

## Features

- ✅ Multi-tab browsing
- ✅ Navigation controls (back, forward, reload, stop)
- ✅ Address bar with URL/search
- ✅ Tab management (create, close, switch)
- ✅ Parent-child tab relationships
- ✅ Engine abstraction layer
- ✅ Session management
- ✅ History tracking

## Development

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

## Future Enhancements

- [ ] Connect to native WebKit/Servo libraries
- [ ] Add bookmarks management
- [ ] Add download manager
- [ ] Add developer tools
- [ ] Add extension support (custom API, not Chrome/Firefox)
- [ ] Add privacy features
- [ ] Add custom rendering optimizations

## Comparison to Ladybird

Like Ladybird browser, this implementation:
- Uses WebKit (or alternative) instead of Chromium/Blink
- Provides independent browser architecture
- Allows custom UI and features
- Not tied to Chrome/Firefox extension APIs

## License

[Your License Here]

