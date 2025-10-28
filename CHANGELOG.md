# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-10-28

### Breaking changes

- Labels are now rendered using `textContent` instead of `innerHTML` to prevent XSS. If you previously relied on HTML markup inside labels (`displayText`), it will now be escaped. Provide plain text or render HTML outside of the selector.

### Added

- Leaflet 2.0 compatibility (removal of legacy mixins and event APIs).
- Accessibility: role=button, tabindex=0, `aria-label` for items, `aria-pressed`/`aria-disabled` on selection.
- Keyboard support for language selection via Enter/Space.

### Fixed

- Memory leak prevention: detach language button and map click listeners on control removal.
- CSS cleanup and modernization (avoid floats, remove empty rules).
- README example modernization (array literals) and minor docs improvements.

[2.0.0]: https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/releases/tag/v2.0.0
