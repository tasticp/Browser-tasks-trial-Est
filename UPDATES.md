# Project Updates Log

This file tracks major updates and improvements made to the codebase over time.

---

## August 31, 2025

## August 31, 2025 (continued)
- Virtual nested tab groups: extension UI now supports true nested tab grouping, even though Chrome and other browsers only support flat groups. All new tabs opened from a parent are tracked as children, and the tree view displays full hierarchy.
- Improved spellcheck/autocorrect tab detection: now checks for contenteditable, textarea, and autocomplete fields to reload current tab instead of opening a new one.

---

## October 31, 2025

- Added a left-side parent navigation arrow to each non-root title row in the trail tree. This mirrors the close button behavior on the right, appears on hover, and selects the parent when clicked.
- Tree items are fully clickable; children remain collapsible under their respective parent. Closing a parent hides its children, unless those children have been moved/reparented elsewhere.
- Improved breadcrumb-like visual affordance for both horizontal and vertical layouts, matching the examples in `todo.md`.
- Verified extension workflow on Firefox-based browsers, including Zen Browser. Zen Browser is based on Firefox, so the Firefox temporary add-on flow applies; see README for details and the Zen repo for context: [Zen Browser (desktop)](https://github.com/zen-browser/desktop).
