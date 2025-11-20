/**
 * Adds a language selector to Leaflet based maps.
 * License: CC0 (Creative Commons Zero), see https://creativecommons.org/publicdomain/zero/1.0/
 * Project page: https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector
 */

// Import Leaflet components (peer dependency)
import { Control, DomUtil, Util } from "leaflet";

const buttonClassName = "leaflet-control-languageselector-button";
const buttonDisabledClassName = "leaflet-control-languageselector-button-disabled";
const selectedClassName = "languageselector-selected";

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
    this._disableMapEvents(this._container);
    this._createLanguageSelector(this._container);
  },

  /**
   * Prevents events from propagating to the map
   * @param {HTMLElement} element - The element to disable event propagation for
   * @private
   */
  _disableMapEvents(element) {
    ["click", "dblclick", "mousedown", "touchstart", "contextmenu"].forEach(event =>
      element.addEventListener(event, e => e.stopPropagation())
    );
  },

  _createLanguageSelector(container) {
    if (this.options.title) {
      const titleDiv = DomUtil.create("div", "leaflet-languageselector-title", container);
      titleDiv.textContent = this.options.title;
    }
    this._languagesDiv = DomUtil.create("div", "leaflet-languageselector-languagesdiv", container);
    for (const lang of this.options.languages) {
      const langButton = this._createLanguageButton(lang);
      this._languagesDiv.append(langButton);
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
   * @returns {HTMLElement} The created language button element
   * @private
   */
  _createLanguageButton(lang) {
    // Build CSS classes
    const classes = ["leaflet-languageselector-langdiv"];
    if (!this.options.vertical) {
      classes.push("leaflet-languageselector-float-left");
    }

    const langDiv = DomUtil.create("div", classes.join(" "));
    const label = lang.displayText ?? lang.id;

    // Set data-lang attribute for CSS-based icons (from leaflet.languageselector-flags.css)
    langDiv.setAttribute("data-lang", lang.id);

    // Accessibility attributes
    langDiv.setAttribute("role", "button");
    langDiv.setAttribute("tabindex", "0");
    langDiv.setAttribute("aria-label", label);
    langDiv.setAttribute("aria-pressed", "false");
    langDiv.setAttribute("aria-disabled", "false");

    // Set text content (icon will be added via CSS ::before if flags CSS is imported)
    langDiv.textContent = label;

    // Set ID for identification
    langDiv.id = `languageselector_${lang.id}`;

    return langDiv;
  },

  /**
   * Checks if the button selector is in closed state
   * @returns {boolean} True if button is closed (collapsed)
   * @private
   */
  _isButtonClosed() {
    return this._container.classList.contains(buttonClassName);
  },

  /**
   * Toggles the button selector between open and closed states
   * @param {boolean} forceClose - If true, forces closed state regardless of current state
   * @private
   */
  _toggleButtonMode(forceClose = false) {
    if (!this.options.button) {
      return;
    }

    const isClosed = this._isButtonClosed();

    if (forceClose || !isClosed) {
      // Close: either forced or currently open
      this._container.classList.remove(buttonDisabledClassName);
      this._container.classList.add(buttonClassName);
      this._container.setAttribute("aria-expanded", "false");
    }
    else {
      // Open: currently closed
      this._container.classList.remove(buttonClassName);
      this._container.classList.add(buttonDisabledClassName);
      this._container.setAttribute("aria-expanded", "true");
    }
  },

  /**
   * Handles click events on language buttons via event delegation
   * @param {Event} event - The mouseup event
   * @private
   */
  _onLanguageClick(event) {
    const button = this._findLanguageButton(event.target);
    if (button) {
      this._selectLanguage(button, event);
    }
  },

  /**
   * Handles keyboard events on language buttons via event delegation
   * @param {KeyboardEvent} event - The keydown event
   * @private
   */
  _onLanguageKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      const button = this._findLanguageButton(event.target);
      if (button) {
        event.preventDefault();
        this._selectLanguage(button, event);
      }
    }
  },

  /**
   * Finds the language button element from event target (handles img clicks)
   * @param {HTMLElement} target - The event target
   * @returns {HTMLElement|null} The button element or null
   * @private
   */
  _findLanguageButton(target) {
    // Direct button click
    if (target.id && target.id.startsWith("languageselector_")) {
      return target;
    }
    // Click on img inside button
    if (target.parentElement && target.parentElement.id
      && target.parentElement.id.startsWith("languageselector_")) {
      return target.parentElement;
    }
    return null;
  },

  /**
   * Executes language selection logic
   * @param {HTMLElement} button - The language button element
   * @param {Event} event - The triggering event
   * @private
   */
  _selectLanguage(button, event) {
    const langId = button.id.slice(17); // Remove "languageselector_" prefix

    // Stop event propagation first to prevent container's toggle from firing
    if (event.stopPropagation) {
      event.stopPropagation();
    }

    this._updateButtonStates(button.id);
    this._toggleButtonMode(true); // Force close after selection

    // Invoke callback
    if (this.options.callback && typeof this.options.callback === "function") {
      this.options.callback(langId);
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
        button.classList.add(selectedClassName);
        button.setAttribute("aria-pressed", "true");
        button.setAttribute("aria-disabled", "true");
      }
      else {
        button.classList.remove(selectedClassName);
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-disabled", "false");
      }
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

    // Use internal selection logic (no event needed)
    this._selectLanguage(targetButton, {});
    return true;
  },

  onAdd(map) {
    this._map = map;
    if (this.options.button) {
      this._container.classList.add(buttonClassName);

      // Make container keyboard accessible
      this._container.setAttribute("tabindex", "0");
      this._container.setAttribute("role", "button");
      this._container.setAttribute("aria-expanded", "false");
      this._container.setAttribute("aria-label", "Language selector");

      // Toggle handler: only toggle if not clicking on language buttons
      this._onContainerClick = (event) => {
        if (!this._languagesDiv.contains(event.target)) {
          this._toggleButtonMode();
        }
      };
      this._container.addEventListener("mouseup", this._onContainerClick);

      // Keyboard handler for container
      this._onContainerKeydown = (event) => {
        if (event.target === this._container && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          this._toggleButtonMode();
        }
      };
      this._container.addEventListener("keydown", this._onContainerKeydown);

      // Close button when clicking on map
      this._onMapClick = () => {
        this._toggleButtonMode(true);
      };
      this._map.on("click", this._onMapClick);
    }

    // Event delegation for language buttons
    this._boundOnLanguageClick = this._onLanguageClick.bind(this);
    this._boundOnLanguageKeydown = this._onLanguageKeydown.bind(this);
    this._languagesDiv.addEventListener("mouseup", this._boundOnLanguageClick);
    this._languagesDiv.addEventListener("keydown", this._boundOnLanguageKeydown);

    return this._container;
  },

  onRemove() {
    if (this.options.button) {
      this._container.removeEventListener("mouseup", this._onContainerClick);
      this._container.removeEventListener("keydown", this._onContainerKeydown);
      if (this._onMapClick && this._map) {
        this._map.off("click", this._onMapClick);
      }
    }
    // Remove delegated event listeners
    if (this._languagesDiv) {
      this._languagesDiv.removeEventListener("mouseup", this._boundOnLanguageClick);
      this._languagesDiv.removeEventListener("keydown", this._boundOnLanguageKeydown);
    }
    this._map = null;
  }
});

/**
 * Helper function to create a language object for the language selector.
 * @param {string} langId - The language identifier (e.g., 'en', 'de')
 * @param {string} text - The display text for the language
 * @returns {object} Language object with id and displayText
 * Icons can be added via CSS using [data-lang] attribute selector.
 * Import 'leaflet.languageselector-flags.css' for built-in flag icons.
 * @example
 * const lang = langObject('en', 'English');
 */
const langObject = (langId, text) => ({
  displayText: text,
  id: langId
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
