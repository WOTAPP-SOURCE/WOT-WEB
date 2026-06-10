import type { Locale } from "@/types";

/** A field translated into every supported locale (fr / en / es). */
export type LocalizedField = Record<Locale, string>;

/** A single glossary entry exactly as stored in src/data/glossary.json. */
export interface GlossaryEntry {
  term: LocalizedField;
  definition: LocalizedField;
  category: LocalizedField;
}

/** The glossary JSON shape: entries grouped by uppercase first letter (A–Z). */
export type GlossaryData = Record<string, GlossaryEntry[]>;

/** A glossary entry flattened and localized for one locale, ready to render. */
export interface PreparedTerm {
  /** URL slug, derived from the English term name. */
  slug: string;
  /** Localized term name. */
  term: string;
  /** Localized definition. */
  definition: string;
  /** Localized category label (for display). */
  category: string;
  /** Stable English category key (for filtering + deterministic coloring). */
  categoryKey: string;
}

/** Resolved badge colors for a glossary category. */
export interface CategoryColor {
  bg: string;
  border: string;
  text: string;
}
