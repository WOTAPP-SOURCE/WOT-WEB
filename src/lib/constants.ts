export const SITE_NAME = "Way of Trading";
export const SITE_DOMAIN = "wayoftrading.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

export const APP_STORE_URL = "https://apps.apple.com"; // TBD
export const GOOGLE_PLAY_URL = "https://play.google.com"; // TBD

export const LOCALES = ["fr", "en", "es"] as const;
export const DEFAULT_LOCALE = "fr" as const;

/* Primary navigation: `key` maps to the `nav` i18n namespace, `href` is locale-relative. */
export const NAV_LINKS = [
  { key: "features", href: "/features" },
  { key: "glossary", href: "/glossary" },
  { key: "pricing", href: "/pricing" },
  { key: "faq", href: "/faq" },
  { key: "about", href: "/about" },
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

/* Headline stat figures (labels are translated in the `stats` namespace).
   `termsLabel` is rendered from the live glossary count (StatsSection), so its
   value here is just a typed placeholder. */
export const STATS = [
  { key: "tradersLabel", value: 10000, suffix: "+" },
  { key: "termsLabel", value: 0, suffix: "" },
  { key: "toolsLabel", value: 6, suffix: "" },
  { key: "languagesLabel", value: 3, suffix: "" },
] as const;

/* Hero stats strip — number is brand-fixed, label translated in `hero`.
   `statTerms` is overridden with the live glossary count in HeroSection. */
export const HERO_STATS = [
  { value: "8", labelKey: "statTools" },
  { value: "3", labelKey: "statModels" },
  { value: "", labelKey: "statTerms" },
  { value: "18", labelKey: "statCategories" },
] as const;

/* Hero orbiting glassmorphism info cards. Labels translated in `hero`. */
export const HERO_ORBIT_CARDS = [
  { titleKey: "orbitCoachTitle", meta1Key: "orbitCoachMeta1", meta2Key: "orbitCoachMeta2", live: true, className: "left-[-6%] top-[10%]", delay: "0s" },
  { titleKey: "orbitChartTitle", meta1Key: "orbitChartMeta1", meta2Key: "orbitChartMeta2", live: false, className: "right-[-8%] top-[6%]", delay: "1.4s" },
  { titleKey: "orbitHistoryTitle", meta1Key: "orbitHistoryMeta1", meta2Key: "orbitHistoryMeta2", live: false, className: "left-[-4%] bottom-[14%]", delay: "2.6s" },
  { titleKey: "orbitGlossaryTitle", meta1Key: "orbitGlossaryMeta1", meta2Key: "orbitGlossaryMeta2", live: false, className: "right-[-6%] bottom-[10%]", delay: "3.8s" },
] as const;

/* 6 sample glossary terms for the homepage preview. Term names are proper nouns
   (kept across locales); category label + definition come from `glossaryPreview`
   arrays aligned by index. `dot` is the category color swatch. */
export const GLOSSARY_SAMPLE = [
  { term: "Pip", slug: "pip", dot: "#2dd4bf" },
  { term: "RSI", slug: "rsi", dot: "#ec4899" },
  { term: "Stop Loss", slug: "stop-loss", dot: "#22c55e" },
  { term: "Leverage", slug: "leverage", dot: "#f59e0b" },
  { term: "Smart Money", slug: "smart-money", dot: "#b366ff" },
  { term: "Lot Size", slug: "lot-size", dot: "#3b82f6" },
] as const;

/* Lessons tag-cloud sizing/emphasis, aligned by index with `lessons.items`. */
export const LESSON_TOPICS = [
  { size: "lg", highlight: true },
  { size: "lg", highlight: true },
  { size: "lg", highlight: true },
  { size: "md", highlight: false },
  { size: "md", highlight: true },
  { size: "md", highlight: false },
  { size: "md", highlight: false },
  { size: "reg", highlight: false },
  { size: "reg", highlight: false },
  { size: "reg", highlight: true },
  { size: "reg", highlight: false },
  { size: "reg", highlight: false },
  { size: "reg", highlight: false },
  { size: "reg", highlight: false },
  { size: "reg", highlight: false },
] as const;

/* Pricing plans. Prices are brand-fixed; names/periods/savings translated in
   the `pricing` namespace. The annual plan is visually highlighted. */
export const PRICING_PLANS = [
  {
    nameKey: "monthlyName",
    price: "19.99",
    periodKey: "periodMonth",
    saveKey: null,
    badgeKey: null,
    highlighted: false,
  },
  {
    nameKey: "annualName",
    price: "139.99",
    periodKey: "periodYear",
    saveKey: "annualSave",
    badgeKey: "annualBadge",
    highlighted: true,
  },
  {
    nameKey: "quarterlyName",
    price: "49.99",
    periodKey: "periodQuarter",
    saveKey: "quarterlySave",
    badgeKey: null,
    highlighted: false,
  },
] as const;

/* Footer social links — proper-noun labels, header translated in `footer`. */
export const FOOTER_SOCIAL = [
  { label: "X", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "YouTube", href: "#" },
] as const;
