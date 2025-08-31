# Project Updates Log

This file tracks major updates and improvements made to the codebase over time.

---

## August 31, 2025

## August 31, 2025 (continued)
- Virtual nested tab groups: extension UI now supports true nested tab grouping, even though Chrome and other browsers only support flat groups. All new tabs opened from a parent are tracked as children, and the tree view displays full hierarchy.
- Improved spellcheck/autocorrect tab detection: now checks for contenteditable, textarea, and autocomplete fields to reload current tab instead of opening a new one.
