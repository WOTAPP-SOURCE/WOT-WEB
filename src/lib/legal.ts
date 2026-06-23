import en from "@/data/legal/en.json";
import fr from "@/data/legal/fr.json";
import es from "@/data/legal/es.json";
import type { LegalDocumentData } from "@/types/legal";
import type { Locale } from "@/types";

/*
 * The four Legal Center documents, in sidebar order. `slug` is both the route
 * segment under [locale]/(legal) and the key into the locale JSON files;
 * `labelKey` resolves to the translated nav label via the `legal.nav` namespace.
 */
export const LEGAL_DOCS = [
  { slug: "avertissement", href: "/avertissement" },
  { slug: "confidentialite", href: "/confidentialite" },
  { slug: "cookies", href: "/cookies" },
  { slug: "mentions-legales", href: "/mentions-legales" },
] as const;

export type LegalSlug = (typeof LEGAL_DOCS)[number]["slug"];

const DATA: Record<Locale, Record<string, LegalDocumentData>> = {
  en: en as Record<string, LegalDocumentData>,
  fr: fr as Record<string, LegalDocumentData>,
  es: es as Record<string, LegalDocumentData>,
};

/** Returns the document for the given locale, falling back to French (default locale). */
export const getLegalDocument = (locale: Locale, slug: LegalSlug): LegalDocumentData =>
  DATA[locale]?.[slug] ?? DATA.fr[slug];
