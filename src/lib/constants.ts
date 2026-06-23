export const SITE_NAME = "Way of Trading";
export const SITE_DOMAIN = "wayoftrading.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/* Contact inbox used by the mailto: fallback on the contact form (when no
   NEXT_PUBLIC_CONTACT_WEBHOOK_URL is configured). Dev: change to your real
   inbox if it differs. */
export const CONTACT_EMAIL = "contact@wayoftrading.com";

export const APP_STORE_URL = "https://apps.apple.com"; // TBD
export const GOOGLE_PLAY_URL = "https://play.google.com"; // TBD

/* localStorage key holding the visitor's analytics-cookie choice, stored as
   { value: "accepted" | "rejected", timestamp }. Shared by the consent banner
   (CookieConsent), the re-open link (CookieSettingsButton), and the analytics
   helper (lib/analytics) so GA events never fire without explicit consent. */
export const COOKIE_CONSENT_KEY = "wot-cookie-consent";

/* Until the app ships, every "download" CTA routes to the launch / countdown page
   instead of the (not-yet-live) store listings. Locale-relative — pair with the
   next-intl Link so the active locale prefix is preserved. */
export const LAUNCH_PATH = "/lancement";

export const LOCALES = ["fr", "en", "es"] as const;
export const DEFAULT_LOCALE = "fr" as const;

/* Primary navigation: `key` maps to the `nav` i18n namespace, `href` is locale-relative.
   `scrollTo` marks an in-page section on the home route (smooth-scrolled, not a page). */
export const NAV_LINKS = [
  { key: "features", href: "/", scrollTo: "fonctionnalites" },
  { key: "glossary", href: "/glossary" },
  { key: "pricing", href: "/", scrollTo: "pricing" },
  { key: "faq", href: "/faq" },
  { key: "about", href: "/about" },
] as const;

/* Maps a NAV_LINKS `key` to the snake_case `item` value sent with nav_click
   analytics events, so header + mobile-menu clicks report a consistent label. */
export const NAV_ANALYTICS_ITEM: Record<string, string> = {
  features: "fonctionnalites",
  glossary: "glossaire",
  pricing: "tarifs",
  faq: "faq",
  about: "about",
};

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
  { key: "tradersLabel", value: 30000, suffix: "+" },
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

/* Hero orbiting glassmorphism info cards. Each card shows an eyebrow + two
   feature names (no quota/usage lines). Labels translated in `hero`. */
export const HERO_ORBIT_CARDS = [
  { titleKey: "orbitCoachTitle", feature1Key: "orbitCoachFeature1", feature2Key: "orbitCoachFeature2", live: true, className: "left-[-6%] top-[10%]", delay: "0s" },
  { titleKey: "orbitAnalysisTitle", feature1Key: "orbitAnalysisFeature1", feature2Key: "orbitAnalysisFeature2", live: false, className: "right-[-8%] top-[6%]", delay: "1.4s" },
  { titleKey: "orbitLearnTitle", feature1Key: "orbitLearnFeature1", feature2Key: "orbitLearnFeature2", live: false, className: "left-[-4%] bottom-[14%]", delay: "2.6s" },
  { titleKey: "orbitMarketsTitle", feature1Key: "orbitMarketsFeature1", feature2Key: "orbitMarketsFeature2", live: false, className: "right-[-6%] bottom-[10%]", delay: "3.8s" },
] as const;

/* 6 sample glossary terms for the homepage preview. `term` is the short display
   label (a proper noun, kept across locales). `enTerm` is the EXACT English term as
   it appears in glossary.json; the card link is built by running it through the
   shared slugify() — the same source generateStaticParams uses — so the href always
   resolves to a generated /glossary/[slug] page (never a 404). Category label +
   definition come from `glossaryPreview` arrays aligned by index. `dot` = swatch. */
export const GLOSSARY_SAMPLE = [
  { term: "Pip", enTerm: "Pip", dot: "#2dd4bf" },
  { term: "RSI", enTerm: "RSI (Relative Strength Index)", dot: "#ec4899" },
  { term: "Stop Loss", enTerm: "Stop-Loss", dot: "#22c55e" },
  { term: "Leverage", enTerm: "Leverage", dot: "#f59e0b" },
  { term: "Smart Money", enTerm: "Smart Money", dot: "#b366ff" },
  { term: "Lot Size", enTerm: "Lot", dot: "#3b82f6" },
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
