/* global L */

/**
 * Add or replace a parameter (with value) in the given URL.
 * @param String url the URL
 * @param String param the parameter
 * @param String paramVal the value of the parameter
 * @return String the changed URL
 */
function updateURLParameter(url, param, paramVal) {
  let theAnchor = null;
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
  } else {
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
 * Change the language
 * @param String id of the language
 */
function changeLanguage(selectedLanguage) {
  // Add or replace the language parameter of the URL
  window.history.replaceState({}, "", updateURLParameter(window.location.href, "lang", selectedLanguage));

  // Set HTML lang attribut
  document.body.parentElement.lang = selectedLanguage;

  // Change the texts
  document.getElementById("language").innerText = `Swiched to: '${selectedLanguage}'`;
}

function main() {
  const map = L.map("map", {
    zoomControl: false
  }).setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const languageArray = [
    L.langObject("de", "Deutsch"),
    L.langObject("en", "English"),
    L.langObject("eo", "Esperanto"),
    L.langObject("fi", "Suomi"),
    L.langObject("fr", "Français"),
    L.langObject("ko", "한국어"),
    L.langObject("ru", "Русский")
  ];
  const languageArrayWithIcons = [
    L.langObject("de", "Deutsch", "../images/de.svg"),
    L.langObject("en", "English", "../images/en.svg"),
    L.langObject("eo", "Esperanto", "../images/eo.svg"),
    L.langObject("fi", "Suomi", "../images/fi.svg"),
    L.langObject("fr", "Français", "../images/fr.svg"),
    L.langObject("ko", "한국어", "../images/ko.svg"),
    L.langObject("ru", "Русский", "../images/ru.svg")
  ];

  // Add horizontal versions as button
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: false,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);

  // Add vertical versions as button
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: true,
    position: "topleft",
    initialLanguage: "en",
    button: true
  }).addTo(map);

  // Add vertical versions without button
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: true,
    position: "topright",
    initialLanguage: "en",
    button: false
  }).addTo(map);
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topright",
    initialLanguage: "en",
    button: false
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: true,
    position: "topright",
    initialLanguage: "en",
    button: false
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: true,
    position: "topright",
    initialLanguage: "en",
    button: false
  }).addTo(map);

  // Add horizontal versions without button
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    vertical: false,
    position: "bottomleft",
    initialLanguage: "en",
    button: false
  }).addTo(map);
  L.languageSelector({
    languages: languageArray,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "bottomleft",
    initialLanguage: "en",
    button: false
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    vertical: false,
    position: "bottomleft",
    initialLanguage: "en",
    button: false
  }).addTo(map);
  L.languageSelector({
    languages: languageArrayWithIcons,
    callback: changeLanguage,
    title: "Language",
    vertical: false,
    position: "bottomleft",
    initialLanguage: "en",
    button: false
  }).addTo(map);
}

main();
