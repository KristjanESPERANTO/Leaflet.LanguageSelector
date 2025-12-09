# Changelog

All notable changes to this project will be documented in this file.

## [3.4.0](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v3.3.0...v3.4.0) (2025-12-09)

### Added

- add buttonTitle option for collapsed control tooltip ([d36da07](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/commit/d36da0783de3cff88bc61eed428df511d5ed29c2))

## [3.3.0](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v3.2.1...v3.3.0) - 2025-11-20

### Added

- feat: add `showText` option to toggle display of language text labels
  - when disabled, only flags/icons are shown with tooltips
  - when enabled, both flags/icons and text labels are displayed

## [3.2.1](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v3.2.0...v3.2.1) - 2025-11-20

### Fixed

- fix: change postinstall script to prepare in package.json

## [3.2.0](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v3.1.0...v3.2.0) - 2025-11-20

### Changed

- refactor: modernize event handling
- refactor: modernize spacing with CSS flexbox and gap

### Chore

- chore: add maintainer information to package.json
- chore: replace `stylelint` with `@eslint/css`
- docs: review and reorganize README
- docs: update README to include flag icons for language selector

### Demo

- fix(demo): update deployment branch from v3 to main
- refactor(demo): upgrade demo to Leaflet 2.0.0-alpha.1

## [3.1.0](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v3.0.0...v3.1.0) - 2025-11-20

### Added

- feat: implement CSS-based icon system with Base64 Data URLs
- docs: add references section to demo/index.html

### Changed

- refactor: use native classList API for Leaflet 2.0 compatibility

## [3.0.0](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v2.0.0...v3.0.0) - 2025-11-19

### Breaking Changes

- **ES6 Modules only**: No global `L.*` namespace registration anymore. Must use named imports: `import { languageSelector, langObject } from '@kristjan.esperanto/leaflet-language-selector'`
- **No IIFE/UMD build**: Only ES module format is provided. Use Import Maps for browser usage without bundler
- **Browser requirements**: Chrome 89+, Firefox 108+, Safari 16.4+ (ES6 Modules + Import Maps support required)
- **Removed option**: `hideSelected` option removed (was UX anti-pattern - active language should always be visible)
- **CSS changes**: Selected language now uses `.languageselector-selected` CSS class instead of inline `font-weight` style
- **Package structure**: Plugin files moved to `src/` directory. Import paths need updating for non-bundler usage

### Added

- **Programmatic API**: New `setLanguage(langId)` method for programmatic language switching
- **CSS Custom Properties**: 9 theming variables for full visual customization (`--languageselector-*`)
- **TypeScript support**: Full TypeScript definitions included (`index.d.ts`)
- **JSDoc documentation**: Complete JSDoc comments for all public APIs
- **Enhanced accessibility**:
  - Full keyboard navigation (Enter/Space) for both container and language buttons
  - ARIA attributes: `aria-expanded`, `aria-pressed`, `aria-disabled`, `aria-label`
  - `role="button"` and `tabindex="0"` on closed button mode container
- **Event delegation**: Single event listeners on container (better performance, cleaner code)
- **Modern demo**: Interactive demo with 16 examples + programmatic `setLanguage()` buttons + URL parameter integration

### Changed

- **Package exports**: Modern `exports` field with style export: `import '@kristjan.esperanto/leaflet-language-selector/style'`
- **Code modernization**:
  - `var` → `const`/`let`
  - Legacy for-loops → `for...of`
  - Nullish coalescing operator (`??`)
  - Event delegation pattern
- **Button toggle logic**: Unified `_toggleButtonMode()` method (clearer open/close state management)
- **Method refactoring**: Extracted `_createLanguageButton()`, `_selectLanguage()`, `_findLanguageButton()` for better separation of concerns
- **Peer dependencies**: Updated to support both Leaflet 1.9.x and 2.x (`^1.9.4 || ^2.0.0`)

### Removed

- **Global namespace**: All `L.*` registrations removed
- **IIFE build**: No more standalone browser build (use Import Maps instead)
- **Legacy patterns**: Removed `setTimeout(..., 0)` hack, DOM property pollution
- **UMD support**: No Universal Module Definition build anymore

## [2.0.0](https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector/compare/v1.2.5...v2.0.0) - 2025-10-28

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
