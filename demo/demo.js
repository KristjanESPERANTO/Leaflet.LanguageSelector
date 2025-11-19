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
  const languageArrayWithIcons = [
    langObject("ca", "Català", "../images/ca.svg"),
    langObject("de", "Deutsch", "../images/de.svg"),
    langObject("en", "English", "../images/en.svg"),
    langObject("eo", "Esperanto", "../images/eo.svg"),
    langObject("es", "Español", "../images/es.svg"),
    langObject("fi", "Suomi", "../images/fi.svg"),
    langObject("fr", "Français", "../images/fr.svg"),
    langObject("it", "Italiano", "../images/it.svg"),
    langObject("ko", "한국어", "../images/ko.svg"),
    langObject("ru", "Русский", "../images/ru.svg")
  ];

  // Add horizontal versions as button
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: false,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);

  // Add vertical versions as button
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: true,
    position: "topleft",
    initialLanguage,
    button: true
  }).addTo(map);

  // Add vertical versions without button
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false
  }).addTo(map);
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topright",
    initialLanguage,
    button: false
  }).addTo(map);

  // Add horizontal versions without button
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false
  }).addTo(map);
  languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false
  }).addTo(map);
  languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "bottomleft",
    initialLanguage,
    button: false
  }).addTo(map);
}

main();
