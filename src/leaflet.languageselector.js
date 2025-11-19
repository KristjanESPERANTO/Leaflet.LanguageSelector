/**
 * Adds a language selector to Leaflet based maps.
 * License: CC0 (Creative Commons Zero), see https://creativecommons.org/publicdomain/zero/1.0/
 * Project page: https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector
 */

// Import Leaflet components (peer dependency)
import { Control, DomEvent, DomUtil, Util } from "leaflet";

const buttonClassName = "leaflet-control-languageselector-button";
const buttonDisabledClassName = "leaflet-control-languageselector-button-disabled";
const selectedClassName = "languageselector-selected";

// WeakMap to associate DOM elements with LanguageSelector instances
// Avoids DOM pollution and prevents memory leaks
const instanceMap = new WeakMap();

/**
 * LanguageSelector Control for Leaflet maps.
 * Extends Leaflet's Control class.
 */
const LanguageSelector = Control.extend({
  options: {
    languages: [],
    callback: null,
    title: null,
    position: "topright",
    vertical: true,
    initialLanguage: null,
    button: true
  },

  initialize(options) {
    this._buttons = [];
    Util.setOptions(this, options);

    // Validate that languages array is not empty
    if (!this.options.languages || this.options.languages.length === 0) {
      throw new Error("LanguageSelector: languages array cannot be empty");
    }

    this._container = DomUtil.create("div", "leaflet-control-layers leaflet-languageselector-control");
    DomEvent.disableClickPropagation(this._container);
    this._createLanguageSelector(this._container);
  },

  _createLanguageSelector(container) {
    if (this.options.title) {
      const titleDiv = DomUtil.create("div", "leaflet-languageselector-title", container);
      titleDiv.textContent = this.options.title;
    }
    const languagesDiv = DomUtil.create("div", "leaflet-languageselector-languagesdiv", container);
    for (const [index, lang] of this.options.languages.entries()) {
      const langButton = this._createLanguageButton(lang, index);
      languagesDiv.append(langButton);
      this._buttons.push(langButton);
    }

    // Set initial language if specified (reuse setLanguage logic)
    if (this.options.initialLanguage) {
      this.setLanguage(this.options.initialLanguage);
    }
  },

  /**
   * Creates a single language button element
   * @param {object} lang - Language object with id, displayText, and optional image
   * @param {number} index - Index of the language in the languages array
   * @returns {HTMLElement} The created language button element
   * @private
   */
  _createLanguageButton(lang, index) {
    // Build CSS classes
    const classes = ["leaflet-languageselector-langdiv"];
    if (!this.options.vertical) {
      classes.push("leaflet-languageselector-float-left");
    }
    if (index > 0) {
      classes.push("leaflet-languageselector-mleft");
    }

    const langDiv = DomUtil.create("div", classes.join(" "));
    const label = lang.displayText ?? lang.id;

    // Accessibility attributes
    langDiv.setAttribute("role", "button");
    langDiv.setAttribute("tabindex", "0");
    langDiv.setAttribute("aria-label", label);
    langDiv.setAttribute("aria-pressed", "false");
    langDiv.setAttribute("aria-disabled", "false");

    // Content: image or text
    if (lang.image) {
      const img = DomUtil.create("img", "", langDiv);
      img.src = lang.image;
      img.title = label;
      img.alt = label;
    }
    else {
      langDiv.textContent = label;
    }

    // Set ID and instance reference
    langDiv.id = `languageselector_${lang.id}`;
    instanceMap.set(langDiv, this);

    // Event listeners
    langDiv.addEventListener("mouseup", this._languageChanged);
    langDiv._langselKeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this._languageChanged({ target: langDiv });
      }
    };
    langDiv.addEventListener("keydown", langDiv._langselKeydown);

    return langDiv;
  },

  _isButton() {
    return DomUtil.hasClass(this._container, buttonClassName);
  },

  _languageChanged(pEvent) {
    let elem = pEvent.target;
    let inst = instanceMap.get(elem);
    if (!inst) {
      elem = elem.parentElement;
      inst = instanceMap.get(elem);
    }
    const lang = elem.id.startsWith("languageselector_")
      ? elem.id.slice(17)
      : null;

    inst._updateButtonStates(elem.id);
    inst._closeButtonIfOpen(pEvent);

    // Callback
    if (inst.options.callback && typeof inst.options.callback === "function") {
      inst.options.callback(lang);
    }
  },

  /**
   * Updates the visual and ARIA states of all language buttons
   * @param {string} selectedId - The ID of the selected button element
   * @private
   */
  _updateButtonStates(selectedId) {
    for (const button of this._buttons) {
      const isCurrent = button.id === selectedId;
      if (isCurrent) {
        DomUtil.addClass(button, selectedClassName);
        button.setAttribute("aria-pressed", "true");
        button.setAttribute("aria-disabled", "true");
      }
      else {
        DomUtil.removeClass(button, selectedClassName);
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-disabled", "false");
      }
    }
  },

  /**
   * Closes the button selector if it was in extended/open state
   * @param {Event} pEvent - The event that triggered the language change
   * @private
   */
  _closeButtonIfOpen(pEvent) {
    if (this.options.button && !this._isButton()) {
      DomUtil.removeClass(this._container, buttonDisabledClassName);
      DomUtil.addClass(this._container, buttonClassName);
      // Stop event propagation to prevent _openSelector from being called again
      if (pEvent.stopPropagation) {
        pEvent.stopPropagation();
      }
    }
  },

  _openSelector() {
    if (this._isButton()) {
      DomUtil.removeClass(this._container, buttonClassName);
      DomUtil.addClass(this._container, buttonDisabledClassName);
    }
  },

  /**
   * Programmatically set the language without user interaction.
   * @param {string} langId - The language ID to switch to
   * @returns {boolean} True if language was found and set, false otherwise
   * @example
   * const control = languageSelector({ languages: [...], callback });
   * map.addControl(control);
   * control.setLanguage('de'); // Switch to German programmatically
   */
  setLanguage(langId) {
    // Find the button element for this language
    const targetButton = this._buttons.find(button =>
      button.id === `languageselector_${langId}`
    );

    if (!targetButton) {
      console.warn(`Language '${langId}' not found in language selector`);
      return false;
    }

    // Simulate a click event to reuse existing logic
    this._languageChanged({ target: targetButton });
    return true;
  },

  onAdd(map) {
    this._map = map;
    if (this.options.button) {
      DomUtil.addClass(this._container, buttonClassName);
      DomEvent.on(this._container, "mouseup", this._openSelector, this);

      // Add listener to the map to close the button on click on the map
      this._onMapClick = () => {
        if (DomUtil.hasClass(this._container, buttonDisabledClassName)) {
          DomUtil.removeClass(this._container, buttonDisabledClassName);
          DomUtil.addClass(this._container, buttonClassName);
        }
      };
      DomEvent.on(this._map, "click", this._onMapClick, this);
    }
    return this._container;
  },

  onRemove() {
    if (this.options.button) {
      DomEvent.off(this._container, "mouseup", this._openSelector, this);
      if (this._onMapClick && this._map) {
        DomEvent.off(this._map, "click", this._onMapClick, this);
      }
    }
    // Detach event listeners from language buttons to avoid leaks
    if (Array.isArray(this._buttons)) {
      for (const button of this._buttons) {
        button.removeEventListener("mouseup", this._languageChanged);
        if (button._langselKeydown) {
          button.removeEventListener("keydown", button._langselKeydown);
          button._langselKeydown = null;
        }
        // Clean up WeakMap entry
        instanceMap.delete(button);
      }
    }
    this._map = null;
  }
});

/**
 * Creates a language object for use with the language selector.
 * @param {string} langId - The language identifier (e.g., 'en', 'de')
 * @param {string} text - The display text for the language
 * @param {string} [img] - Optional path to a flag/icon image
 * @returns {object} Language object with id, displayText, and optional image
 * @example
 * const lang = langObject('en', 'English', './flags/en.svg');
 */
const langObject = (langId, text, img) => ({
  displayText: text,
  id: langId,
  image: img
});

/**
 * Callback function for language changes
 * @callback LanguageChangeCallback
 * @param {string} langId - The ID of the selected language
 */

/**
 * Factory function to create a LanguageSelector control.
 * @param {object} options - Configuration options for the language selector
 * @param {Array} options.languages - Array of language objects created with langObject()
 * @param {LanguageChangeCallback} options.callback - Callback function invoked when language changes
 * @param {string} [options.title] - Optional title displayed above the language selector
 * @param {string} [options.position] - Position on the map ('topright', 'topleft', 'bottomright', 'bottomleft')
 * @param {boolean} [options.vertical] - Whether to display languages vertically (true) or horizontally (false)
 * @param {string} [options.initialLanguage] - Initial language to be selected
 * @param {boolean} [options.button] - Whether to display as a collapsible button
 * @returns {LanguageSelector} New LanguageSelector control instance
 * @example
 * const control = languageSelector({
 *   languages: [langObject('en', 'English'), langObject('de', 'Deutsch')],
 *   callback: (langId) => console.log('Language changed to:', langId)
 * });
 * map.addControl(control);
 */
const languageSelector = options => new LanguageSelector(options);

// Named exports for ES6 modules
export { LanguageSelector, languageSelector, langObject };
