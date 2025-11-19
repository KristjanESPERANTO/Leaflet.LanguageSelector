/**
 * Type definitions for @kristjan.esperanto/leaflet-language-selector
 * Project: https://github.com/KristjanESPERANTO/Leaflet.LanguageSelector
 */

import * as L from "leaflet";

/**
 * Language object configuration
 */
export interface LanguageObject {
  /** Language identifier (e.g., 'en', 'de') */
  id: string;
  /** Display text for the language */
  displayText?: string;
  /** Optional path to a flag/icon image */
  image?: string;
}

/**
 * Callback function invoked when language changes
 */
export type LanguageChangeCallback = (langId: string) => void;

/**
 * Configuration options for the language selector
 */
export interface LanguageSelectorOptions extends L.ControlOptions {
  /** Array of language objects */
  languages: LanguageObject[];
  /** Callback function invoked when language changes */
  callback: LanguageChangeCallback | null;
  /** Optional title displayed above the language selector */
  title?: string | null;
  /** Whether to display languages vertically (true) or horizontally (false) */
  vertical?: boolean;
  /** Initial language to be selected */
  initialLanguage?: string | null;
  /** Whether to display as a collapsible button */
  button?: boolean;
}

/**
 * LanguageSelector Control for Leaflet maps
 */
export class LanguageSelector extends L.Control {
  options: LanguageSelectorOptions;

  /**
   * Create a new LanguageSelector control
   * @param options Configuration options
   */
  constructor(options: LanguageSelectorOptions);

  /**
   * Programmatically set the language without user interaction
   * @param langId The language ID to switch to
   * @returns True if language was found and set, false otherwise
   */
  setLanguage(langId: string): boolean;
}

/**
 * Factory function to create a LanguageSelector control
 * @param options Configuration options for the language selector
 * @returns New LanguageSelector control instance
 * @example
 * ```typescript
 * import { languageSelector, langObject } from '@kristjan.esperanto/leaflet-language-selector';
 * import '@kristjan.esperanto/leaflet-language-selector/style';
 *
 * const control = languageSelector({
 *   languages: [langObject('en', 'English'), langObject('de', 'Deutsch')],
 *   callback: (langId) => console.log('Language changed to:', langId)
 * });
 * map.addControl(control);
 * ```
 */
export function languageSelector(options: LanguageSelectorOptions): LanguageSelector;

/**
 * Creates a language object for use with the language selector
 * @param langId The language identifier (e.g., 'en', 'de')
 * @param text The display text for the language
 * @param img Optional path to a flag/icon image
 * @returns Language object with id, displayText, and optional image
 * @example
 * ```typescript
 * const lang = langObject('en', 'English', './flags/en.svg');
 * ```
 */
export function langObject(langId: string, text?: string, img?: string): LanguageObject;
