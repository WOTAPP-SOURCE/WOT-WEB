export const SITE_NAME = "Way of Trading";
export const SITE_DOMAIN = "wayoftrading.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const APP_STORE_URL = "https://apps.apple.com"; // TBD
export const GOOGLE_PLAY_URL = "https://play.google.com"; // TBD

export const LOCALES = ["fr", "en", "es"] as const;
export const DEFAULT_LOCALE = "fr" as const;

export const GLOSSARY_TERM_COUNT = 288;

/* Primary navigation: `key` maps to the `nav` i18n namespace, `href` is locale-relative. */
export const NAV_LINKS = [
  { key: "features", href: "/features" },
  { key: "glossary", href: "/glossary" },
  { key: "pricing", href: "/pricing" },
  { key: "faq", href: "/faq" },
] as const;

/* Locale display labels for the language switcher. */
export const LOCALE_LABELS: Record<string, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
};

export const LOCALE_SHORT: Record<string, string> = {
  fr: "FR",
  en: "EN",
  es: "ES",
};

/* Headline stat figures (labels are translated in the `stats` namespace). */
export const STATS = [
  { key: "tradersLabel", value: 10000, suffix: "+" },
  { key: "termsLabel", value: GLOSSARY_TERM_COUNT, suffix: "" },
  { key: "toolsLabel", value: 6, suffix: "" },
  { key: "languagesLabel", value: 3, suffix: "" },
] as const;
