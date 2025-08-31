# Project Updates Log

This file tracks major updates and improvements made to the codebase over time.

---

## August 31, 2025
- Refactored directory structure for maintainability (`components`, `hooks`, `utils`, `services`)
- Standardized coding conventions (naming, indentation, semicolons)
- Extracted duplicated logic into reusable functions/components (e.g., tab utilities, toast, classnames)
- Converted all source and extension files to TypeScript for type safety
- Improved browser extension compatibility (Chrome, Chromium, Firefox)
- Added type annotations and fixed extension API usage
- Made tree view UI always visible and responsive, with clear parent-child indicators
- Visually distinguished parent and child tabs in UI (badges, indentation)
- Recursive child tab closure: closing a parent tab closes all its children
- Enforced configurable child tab limit (default 10)
- Spellcheck/autocorrect tab opening reloads current tab instead of opening a new one
