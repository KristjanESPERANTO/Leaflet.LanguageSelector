/* global L */

/**
 * Adds a language selector to Leaflet based maps.
 * License: CC0 (Creative Commons Zero), see https://creativecommons.org/publicdomain/zero/1.0/
 * Project page: https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector
 */

const buttonClassName = "leaflet-control-languageselector-button";
const buttonDisabledClassName = "leaflet-control-languageselector-button-disabled";

/**
 * LanguageSelector Control for Leaflet maps.
 * Extends Leaflet's Control class.
 */
const LanguageSelector = L.Control.extend({
  options: {
    languages: [],
    callback: null,
    title: null,
    position: "topright",
    hideSelected: false,
    vertical: true,
    initialLanguage: null,
    button: true
  },

  initialize(options) {
    this._buttons = [];
    L.Util.setOptions(this, options);
    this._container = L.DomUtil.create("div", "leaflet-control-layers leaflet-languageselector-control");
    L.DomEvent.disableClickPropagation(this._container);
    this._createLanguageSelector(this._container);
  },

  _createLanguageSelector(container) {
    if (this.options.title) {
      const titleDiv = L.DomUtil.create("div", "leaflet-languageselector-title", container);
      titleDiv.textContent = this.options.title;
    }
    const languagesDiv = L.DomUtil.create("div", "leaflet-languageselector-languagesdiv", container);
    for (const [index, lang] of this.options.languages.entries()) {
      const langDiv = L.DomUtil.create(
        "div", `leaflet-languageselector-langdiv${this.options.vertical
          ? ""
          : " leaflet-languageselector-float-left"}${index > 0
          ? " leaflet-languageselector-mleft"
          : ""}`, languagesDiv);
      // Accessibility: make the language option operable via keyboard/screen readers
      const label = lang.displayText ?? lang.id;
      langDiv.setAttribute("role", "button");
      langDiv.setAttribute("tabindex", "0");
      langDiv.setAttribute("aria-label", label);
      if (lang.image) {
        const img = L.DomUtil.create("img", "", langDiv);
        img.src = lang.image;
        img.title = label;
        img.alt = label;
      }
      else {
        langDiv.textContent = label;
      }
      langDiv.id = `languageselector_${lang.id}`;
      langDiv._langselinstance = this;
      langDiv.addEventListener("mouseup", this._languageChanged);
      // Keyboard support: activate on Enter/Space
      langDiv._langselKeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this._languageChanged({ target: langDiv });
        }
      };
      langDiv.addEventListener("keydown", langDiv._langselKeydown);

      // Set initial ARIA attributes
      langDiv.setAttribute("aria-pressed", "false");
      langDiv.setAttribute("aria-disabled", "false");

      this._buttons.push(langDiv);
    }

    // Set initial language if specified (reuse setLanguage logic)
    if (this.options.initialLanguage) {
      // Use setTimeout to ensure DOM is ready and _buttons array is populated
      setTimeout(() => {
        this.setLanguage(this.options.initialLanguage);
      }, 0);
    }
  },

  _isButton() {
    return L.DomUtil.hasClass(this._container, buttonClassName);
  },

  _languageChanged(pEvent) {
    let elem = pEvent.target;
    if (!elem._langselinstance) {
      elem = elem.parentElement;
    }
    const inst = elem._langselinstance;
    const lang = elem.id.startsWith("languageselector_")
      ? elem.id.slice(17)
      : null;

    // Hide/Show and mark selected language in a single pass
    for (const button of inst._buttons) {
      const isCurrent = button.id === elem.id;
      if (inst.options.hideSelected) {
        button.style.display = isCurrent ? "none" : "block";
      }
      if (isCurrent) {
        button.style.backgroundColor = "#0005";
        button.style.pointerEvents = "none";
        button.setAttribute("aria-pressed", "true");
        button.setAttribute("aria-disabled", "true");
      }
      else {
        button.style.background = "";
        button.style.pointerEvents = "";
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-disabled", "false");
      }
    }

    // Callback
    if (inst.options.callback && typeof inst.options.callback === "function") {
      inst.options.callback(lang);
    }
  },

  _openSelector() {
    if (this._isButton()) {
      L.DomUtil.removeClass(this._container, buttonClassName);
      L.DomUtil.addClass(this._container, buttonDisabledClassName);
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
      L.DomUtil.addClass(this._container, buttonClassName);
      L.DomEvent.on(this._container, "mouseup", this._openSelector, this);

      // Add listener to the map to close the button on click on the map
      this._onMapClick = () => {
        const languageButtonDisabled = document.getElementsByClassName(buttonDisabledClassName)[0];
        if (typeof languageButtonDisabled !== "undefined") {
          languageButtonDisabled.classList.remove(buttonDisabledClassName);
          languageButtonDisabled.classList.add(buttonClassName);
        }
      };
      L.DomEvent.on(this._map, "click", this._onMapClick, this);
    }
    return this._container;
  },

  onRemove() {
    if (this.options.button) {
      L.DomEvent.off(this._container, "mouseup", this._openSelector, this);
      if (this._onMapClick && this._map) {
        L.DomEvent.off(this._map, "click", this._onMapClick, this);
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
      }
    }
    this._container.style.display = "none";
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
 * @param {boolean} [options.hideSelected] - Whether to hide the currently selected language
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
