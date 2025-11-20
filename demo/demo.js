// ES6 Module imports
import { Map, TileLayer } from "leaflet";
// eslint-disable-next-line import-x/no-unresolved -- Import Maps resolve at runtime
import { languageSelector, langObject } from "leaflet-language-selector";

/**
 * Add or replace a parameter (with value) in the given URL.
 * @param String url the URL
 * @param String param the parameter
 * @param String paramVal the value of the parameter
 * @return String the changed URL
 */
function updateURLParameter(url, param, paramVal) {
  let theAnchor;
  let newAdditionalURL = "";
  let tempArray = url.split("?");
  let baseURL = tempArray[0];
  let additionalURL = tempArray[1];
  let temp = "";

  if (additionalURL) {
    const tmpAnchor = additionalURL.split("#");
    const theParams = tmpAnchor[0];
    theAnchor = tmpAnchor[1];
    if (theAnchor) {
      additionalURL = theParams;
    }

    tempArray = additionalURL.split("&");

    for (let i = 0; i < tempArray.length; i += 1) {
      if (tempArray[i].split("=")[0] !== param) {
        newAdditionalURL += temp + tempArray[i];
        temp = "&";
      }
    }
  }
  else {
    const tmpAnchor = baseURL.split("#");
    const theParams = tmpAnchor[0];
    theAnchor = tmpAnchor[1];

    if (theParams) {
      baseURL = theParams;
    }
  }

  if (theAnchor) {
    paramVal += `#${theAnchor}`;
  }

  const rowsTxt = `${temp}${param}=${paramVal}`;
  return `${baseURL}?${newAdditionalURL}${rowsTxt}`;
}

/**
 * Get URL parameter value
 * @param String param the parameter name
 * @return String|null the parameter value or null if not found
 */
function getURLParameter(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Change the language
 * @param String id of the language
 */
function changeLanguage(selectedLanguage) {
  // Add or replace the language parameter of the URL
  window.history.replaceState({}, "", updateURLParameter(window.location.href, "lang", selectedLanguage));

  // Set HTML lang attribute
  document.body.parentElement.lang = selectedLanguage;

  // Change the texts
  document.getElementById("language").innerText = `Switched to: '${selectedLanguage}'`;
}

function main() {
  // Read initial language from URL parameter, fallback to English
  const initialLanguage = getURLParameter("lang") || "en";

  const map = new Map("map", {
    zoomControl: false
  }).setView([0, 0], 2);

  new TileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(map);

  // Store all language selector controls for programmatic access
  const controls = [];

  // Icons are now provided via CSS (leaflet.languageselector-flags.css)
  const languageArray = [
    langObject("ca", "Català"),
    langObject("de", "Deutsch"),
    langObject("en", "English"),
    langObject("eo", "Esperanto"),
    langObject("es", "Español"),
    langObject("fi", "Suomi"),
    langObject("fr", "Français"),
    langObject("it", "Italiano"),
    langObject("ko", "한국어"),
    langObject("ru", "Русский")
  ];

  // Horizontal + button + text+flags + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: true
  }).addTo(map));
  // Horizontal + button + text+flags + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: true
  }).addTo(map));
  // Horizontal + button + flags only + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: false
  }).addTo(map));
  // Horizontal + button + flags only + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: false
  }).addTo(map));

  // Vertical + button + text+flags + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: true
  }).addTo(map));
  // Vertical + button + text+flags + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: true
  }).addTo(map));
  // Vertical + button + flags only + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: false
  }).addTo(map));
  // Vertical + button + flags only + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true,
    showText: false
  }).addTo(map));

  // Vertical + no button + text+flags + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false,
    showText: true
  }).addTo(map));
  // Vertical + no button + text+flags + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false,
    showText: true
  }).addTo(map));
  // Vertical + no button + flags only + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false,
    showText: false
  }).addTo(map));
  // Vertical + no button + flags only + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false,
    showText: false
  }).addTo(map));

  // Horizontal + no button + text+flags + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false,
    showText: true
  }).addTo(map));
  // Horizontal + no button + text+flags + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false,
    showText: true
  }).addTo(map));
  // Horizontal + no button + flags only + title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false,
    showText: false
  }).addTo(map));
  // Horizontal + no button + flags only + no title
  controls.push(languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false,
    showText: false
  }).addTo(map));

  // Set up programmatic language switching buttons
  const setupLanguageButton = (buttonId, langId) => {
    const button = document.getElementById(buttonId);
    button.addEventListener("click", () => {
      // Call setLanguage() on all controls
      controls.forEach(control => control.setLanguage(langId));
      // Update URL and display
      changeLanguage(langId);
    });
  };

  setupLanguageButton("btn-en", "en");
  setupLanguageButton("btn-de", "de");
  setupLanguageButton("btn-es", "es");
  setupLanguageButton("btn-fr", "fr");
  setupLanguageButton("btn-eo", "eo");

  // Initialize the display with current language
  changeLanguage(initialLanguage);
}

main();
