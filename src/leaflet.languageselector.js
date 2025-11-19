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
    this._languagesDiv = DomUtil.create("div", "leaflet-languageselector-languagesdiv", container);
    for (const [index, lang] of this.options.languages.entries()) {
      const langButton = this._createLanguageButton(lang, index);
      this._languagesDiv.append(langButton);
      this._buttons.push(langButton);
    }

    // Event delegation: Single listener for all language buttons
    DomEvent.on(this._languagesDiv, "mouseup", this._onLanguageClick, this);
    DomEvent.on(this._languagesDiv, "keydown", this._onLanguageKeydown, this);

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
    return DomUtil.hasClass(this._container, buttonClassName);
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
      DomUtil.removeClass(this._container, buttonDisabledClassName);
      DomUtil.addClass(this._container, buttonClassName);
      this._container.setAttribute("aria-expanded", "false");
    }
    else {
      // Open: currently closed
      DomUtil.removeClass(this._container, buttonClassName);
      DomUtil.addClass(this._container, buttonDisabledClassName);
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
      DomUtil.addClass(this._container, buttonClassName);

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
      DomEvent.on(this._container, "mouseup", this._onContainerClick, this);

      // Keyboard handler for container
      this._onContainerKeydown = (event) => {
        if (event.target === this._container && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          this._toggleButtonMode();
        }
      };
      DomEvent.on(this._container, "keydown", this._onContainerKeydown, this);

      // Close button when clicking on map
      this._onMapClick = () => {
        this._toggleButtonMode(true);
      };
      DomEvent.on(this._map, "click", this._onMapClick, this);
    }
    return this._container;
  },

  onRemove() {
    if (this.options.button) {
      DomEvent.off(this._container, "mouseup", this._onContainerClick, this);
      DomEvent.off(this._container, "keydown", this._onContainerKeydown, this);
      if (this._onMapClick && this._map) {
        DomEvent.off(this._map, "click", this._onMapClick, this);
      }
    }
    // Remove delegated event listeners
    if (this._languagesDiv) {
      DomEvent.off(this._languagesDiv, "mouseup", this._onLanguageClick, this);
      DomEvent.off(this._languagesDiv, "keydown", this._onLanguageKeydown, this);
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
