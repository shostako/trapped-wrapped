// Locale detection and loading

import { ja, TITLE_JA, type LocaleStrings } from "./ja";
import { en, TITLE_EN } from "./en";

export type SupportedLocale = "ja" | "en";

const locales: Record<SupportedLocale, LocaleStrings> = { ja, en };
const titleMaps: Record<SupportedLocale, Record<string, string>> = {
  ja: TITLE_JA,
  en: TITLE_EN,
};

/**
 * Detect locale from environment
 * Priority: 1. CLI argument  2. Environment variable  3. Default (en)
 */
export function detectLocale(cliLang?: string): SupportedLocale {
  // 1. CLI argument
  if (cliLang) {
    const normalized = cliLang.toLowerCase();
    if (normalized === "ja" || normalized === "jp" || normalized === "japanese") {
      return "ja";
    }
    if (normalized === "en" || normalized === "english") {
      return "en";
    }
  }

  // 2. Environment variable
  // Windows: LANG, LC_ALL, or check for Japanese locale indicators
  const lang = process.env.LANG || process.env.LC_ALL || "";
  if (lang.toLowerCase().startsWith("ja")) {
    return "ja";
  }

  // Windows-specific: Check USERLANGUAGE or system locale
  const userLang = process.env.USERLANGUAGE || "";
  if (userLang.toLowerCase().includes("japanese") || userLang.toLowerCase().includes("日本語")) {
    return "ja";
  }

  // 3. Default to English
  return "en";
}

/**
 * Get locale strings for the given locale
 */
export function getLocale(locale: SupportedLocale): LocaleStrings {
  return locales[locale];
}

/**
 * Get title translation map for the given locale
 */
export function getTitleMap(locale: SupportedLocale): Record<string, string> {
  return titleMaps[locale];
}

// Re-export types
export type { LocaleStrings };
