# TODO: Browser Features

## Installation & Setup

- ✅ Rust backend with minimal memory footprint
- ✅ Cross-platform build system (iOS, Android, Windows, Linux, macOS)
- ✅ WebAssembly bindings for web
- ✅ Installation documentation
- ⏳ Native mobile app packaging
- ⏳ Desktop app installers (Windows .msi, macOS .dmg, Linux .deb/.rpm)

## Core Browser Features

### Tab Management
- ✅ Multi-tab browsing
- ✅ Parent-child tab relationships
- ⏳ Visual indicators in tab bar showing parent/child relationships
- ⏳ Close parent tab closes all child tabs
- ⏳ Restore closed tabs with children (history/reopen functionality)
- ⏳ Drag and drop tabs between task groups

### Navigation
- ✅ Address bar with search
- ✅ Back/Forward/Reload/Stop controls
- ⏳ Fix hyperlink behavior (only open child tabs when intended)
- ⏳ Prevent unwanted tab creation on link clicks

### Task Management
- ⏳ Task sidebar (collapsible on right side)
- ⏳ Display active tasks in sidebar
- ⏳ Each task acts as separate browser session (isolated tabs)
- ⏳ Drag tabs between tasks

### Breadcrumb Trail UI

**Closed breadcrumb example:**
```
> {emoji} {Title_of_website}
```

**Partial breadcrumb example:**
```
∨  {emoji} {Title_of_website}
  > {emoji} {Title_of_website}
  ∨  {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
        {emoji} {Title_of_website}
    > {emoji} {Title_of_website}
```

**Open breadcrumb example:**
```
∨  {emoji} {Title_of_website}
  ∨  {emoji} {Title_of_website}
      {emoji} {Title_of_website}
  ∨  {emoji} {Title_of_website}
    ∨  {emoji} {Title_of_website}
        {emoji} {Title_of_website}
```

## Completed Features

✅ Rust-based engine with minimal memory usage  
✅ Cross-platform support  
✅ Engine abstraction (Servo/WebKit)  
✅ Memory pooling and tracking  
✅ Tab management infrastructure  
✅ Navigation controls  
✅ Address bar  
✅ Browser window UI  
✅ Installation documentation

## Installation Instructions

See [INSTALLATION.md](./INSTALLATION.md) for detailed setup instructions for:
- Web (Browser)
- Desktop (Windows, macOS, Linux)
- Mobile (Android, iOS)