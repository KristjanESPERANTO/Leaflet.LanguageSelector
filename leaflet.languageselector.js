/* global L */

/**
 * Adds a language selector to Leaflet based maps.
 * License: CC0 (Creative Commons Zero), see https://creativecommons.org/publicdomain/zero/1.0/
 * Project page: https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector
 */

const buttonClassName = "leaflet-control-languageselector-button";
const buttonDisabledClassName = "leaflet-control-languageselector-button-disabled";

L.LanguageSelector = L.Control.extend({
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
    for (let i1 = 0; i1 < this.options.languages.length; i1 += 1) {
      const lang = this.options.languages[i1];
      const langDiv = L.DomUtil.create(
        "div", `leaflet-languageselector-langdiv${this.options.vertical
          ? ""
          : " leaflet-languageselector-float-left"}${i1 > 0
          ? " leaflet-languageselector-mleft"
          : ""}`, languagesDiv);
      // Accessibility: make the language option operable via keyboard/screen readers
      const label = lang.displayText ? lang.displayText : lang.id;
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
      langDiv.addEventListener("mouseup", this._languageChanged, false);
      // Keyboard support: activate on Enter/Space
      langDiv._langselKeydown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this._languageChanged({ target: langDiv });
        }
      };
      langDiv.addEventListener("keydown", langDiv._langselKeydown, false);
      if (this.options.hideSelected && this.options.initialLanguage && this.options.initialLanguage === lang.id) {
        langDiv.style.display = "none";
      }
      if (this.options.initialLanguage === lang.id) {
        langDiv.style.backgroundColor = "#0005";
        langDiv.style.pointerEvents = "none";
        langDiv.setAttribute("aria-pressed", "true");
        langDiv.setAttribute("aria-disabled", "true");
      }
      else {
        langDiv.setAttribute("aria-pressed", "false");
        langDiv.setAttribute("aria-disabled", "false");
      }
      this._buttons.push(langDiv);
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
    for (let i = 0; i < inst._buttons.length; i += 1) {
      const button = inst._buttons[i];
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
      for (let i = 0; i < this._buttons.length; i += 1) {
        const button = this._buttons[i];
        button.removeEventListener("mouseup", this._languageChanged, false);
        if (button._langselKeydown) {
          button.removeEventListener("keydown", button._langselKeydown, false);
          button._langselKeydown = null;
        }
      }
    }
    this._container.style.display = "none";
    this._map = null;
  }
});

L.langObject = (langId, text, img) => ({
  displayText: text,
  id: langId,
  image: img
});

L.languageSelector = options => new L.LanguageSelector(options);
