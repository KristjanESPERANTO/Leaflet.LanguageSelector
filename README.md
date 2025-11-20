# Leaflet.LanguageSelector

A language selector control for Leaflet based maps.

## Installation

Install via npm:

```bash
npm install @kristjan.esperanto/leaflet-language-selector
```

**[🌍 View Live Demo](https://kristjanesperanto.github.io/Leaflet.LanguageSelector/)**

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
    <link rel="stylesheet" href="https://unpkg.com/leaflet@2.0.0/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/@kristjan.esperanto/leaflet-language-selector@3.0.0-alpha.1/src/leaflet.languageselector.css" />
    <script type="importmap">
      {
        "imports": {
          "leaflet": "https://unpkg.com/leaflet@2.0.0/dist/leaflet-src.esm.js",
          "leaflet-language-selector": "https://unpkg.com/@kristjan.esperanto/leaflet-language-selector@3.0.0-alpha.1/src/leaflet.languageselector.js"
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

## Description

[Leaflet](https://leafletjs.com/) is an open-source JavaScript library for online maps. **Leaflet.LanguageSelector** is an extension for Leaflet that adds a language selector control to the map. Languages can be represented by text or images. The display can be horizontal or vertical. When a language is selected, a callback function is called with the language ID.

**Note:** This is a fork of the original [Leaflet.LanguageSelector](https://github.com/buche/Leaflet.LanguageSelector) by [buche](https://github.com/buche). Many thanks to the original author for creating this useful plugin!

## Compatibility

- **Leaflet**: 2.0.x (ES6 Modules)

## Demo

**[View live interactive demo →](https://kristjanesperanto.github.io/Leaflet.LanguageSelector/)**

The demo showcases 16 different configurations with vertical/horizontal layouts, button/always-visible modes, with and without icons, plus programmatic `setLanguage()` examples.

Maps using this library (and others) can be seen here:

- <https://www.veggiekarte.de> [(Codeberg)](https://codeberg.org/piratenpanda/veggiekarte)

## License

This code is licensed under [CC0](http://creativecommons.org/publicdomain/zero/1.0/ "Creative Commons Zero - Public Domain").

## API

### `languageSelector(options)`

Factory function to create a new language selector control.

**Parameters:**

- `options` (Object) - Configuration options

**Returns:** LanguageSelector control instance

### `langObject(id, displayText?, image?)`

Helper function to create language objects.

**Parameters:**

- `id` (String) - Language identifier (e.g., 'en', 'de')
- `displayText` (String, optional) - Display text for the language
- `image` (String, optional) - Path to flag/icon image

**Returns:** Language object

**Examples:**

```js
langObject("en", "English", "./flags/en.svg"); // Image with tooltip
langObject("en", "English"); // Text only
langObject("en"); // ID as text
```

### Programmatic API

#### `control.setLanguage(langId)`

Programmatically change the selected language without user interaction.

**Parameters:**

- `langId` (String) - The language ID to switch to

**Returns:** Boolean - true if language was found and set, false otherwise

**Example:**

```js
const control = languageSelector({
  languages: [langObject("en", "English"), langObject("de", "Deutsch")],
  callback: (langId) => console.log(langId)
});
map.addControl(control);

// Programmatically switch to German
control.setLanguage("de");

// Integration with URL parameters
const urlParams = new URLSearchParams(window.location.search);
const lang = urlParams.get("lang");
if (lang) {
  control.setLanguage(lang);
}
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
