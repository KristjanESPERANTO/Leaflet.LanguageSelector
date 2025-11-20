# Leaflet.LanguageSelector

A language selector control for Leaflet based maps.

**[🌍 View Live Demo](https://kristjanesperanto.github.io/Leaflet.LanguageSelector/)**

## Description

[Leaflet](https://leafletjs.com/) is an open-source JavaScript library for online maps. **Leaflet.LanguageSelector** is an extension for Leaflet that adds a language selector control to the map. Languages can be represented by text or images. The display can be horizontal or vertical. When a language is selected, a callback function is called with the language ID.

**Note:** This is a fork of the original [Leaflet.LanguageSelector](https://github.com/buche/Leaflet.LanguageSelector) by [buche](https://github.com/buche). Many thanks to the original author for creating this useful plugin!

## Compatibility

- **Leaflet**: 2.0.0-alpha.1 (or later)

## Installation

Install via npm:

```bash
npm install @kristjan.esperanto/leaflet-language-selector
```

## Usage

### With a bundler (Webpack, Vite, etc.)

```js
import { Map, TileLayer } from "leaflet";
import { languageSelector, langObject } from "@kristjan.esperanto/leaflet-language-selector";
import "leaflet/dist/leaflet.css";
import "@kristjan.esperanto/leaflet-language-selector/style";

const map = new Map("map").setView([51.505, -0.09], 13);
new TileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

const control = languageSelector({
  languages: [langObject("en", "English"), langObject("de", "Deutsch"), langObject("fr", "Français")],
  callback: (langId) => {
    console.log("Language changed to:", langId);
    // Implement your language change logic here
  }
});
map.addControl(control);
```

### In the browser with Import Maps (no bundler)

Using CDN for easy browser usage:

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@2.0.0-alpha.1/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/@kristjan.esperanto/leaflet-language-selector@3.2.0/src/leaflet.languageselector.css" />
    <script type="importmap">
      {
        "imports": {
          "leaflet": "https://cdn.jsdelivr.net/npm/leaflet@2.0.0-alpha.1/dist/leaflet-src.js",
          "leaflet-language-selector": "https://unpkg.com/@kristjan.esperanto/leaflet-language-selector@3.2.0/src/leaflet.languageselector.js"
        }
      }
    </script>
  </head>
  <body>
    <div id="map" style="height: 600px;"></div>

    <script type="module">
      import { Map, TileLayer } from "leaflet";
      import { languageSelector, langObject } from "leaflet-language-selector";

      const map = new Map("map").setView([51.505, -0.09], 13);
      new TileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map);

      const control = languageSelector({
        languages: [langObject("en", "English"), langObject("de", "Deutsch")],
        callback: (langId) => console.log(langId)
      });
      map.addControl(control);
    </script>
  </body>
</html>
```

**Note:** Replace version numbers with the latest versions. You can also use `@latest` for automatic updates (not recommended for production).

## API

### `languageSelector(options)`

Factory function to create a new language selector control.

**Parameters:**

- `options` (Object) - Configuration options

**Returns:** LanguageSelector control instance

### `langObject(id, displayText)`

Helper function to create language objects.

**Parameters:**

- `id` (String) - Language identifier (e.g., 'en', 'de')
- `displayText` (String, optional) - Display text for the language

**Returns:** Language object

**Example:**

```js
langObject("en", "English"); // With text
langObject("en"); // ID as text
```

### `control.setLanguage(langId)`

Programmatically change the selected language.

**Parameters:** `langId` (String) - The language ID to switch to

**Returns:** Boolean - true if successful, false if language not found

**Example:**

```js
control.setLanguage("de"); // Switch to German

// Integration with URL parameters
const lang = new URLSearchParams(window.location.search).get("lang");
if (lang) control.setLanguage(lang);
```

## Options

Configuration options for `languageSelector()`:

| Option          | Type     | Default      | Description                                                                         |
| --------------- | -------- | ------------ | ----------------------------------------------------------------------------------- |
| **languages**   | Array    | **required** | Array of language objects (use `langObject()` to create them)                       |
| **callback**    | Function | **required** | Callback function invoked when language changes. Receives language ID as parameter. |
| title           | String   | `null`       | Optional title displayed above the selector                                         |
| vertical        | Boolean  | `true`       | Display languages vertically (true) or horizontally (false)                         |
| initialLanguage | String   | `null`       | Language ID to be initially selected                                                |
| position        | String   | `'topright'` | Control position: 'topright', 'topleft', 'bottomright', 'bottomleft'                |
| button          | Boolean  | `true`       | Display as collapsible button (true) or always expanded (false)                     |

## Language Images

Some flag images are provided in the `/images` folder - see [Image info](/images/image_info.md). For additional flags:

- <https://openclipart.org/>
- <https://commons.wikimedia.org/>
- <https://github.com/lipis/flag-icons>

**Best Practice:** Consider the guidance at [Flags Are Not Languages](http://www.flagsarenotlanguages.com/blog/best-practice-for-presenting-languages/) when representing languages.
