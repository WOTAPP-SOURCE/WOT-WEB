import glossaryJson from "@/data/glossary.json";
import type {
  CategoryColor,
  GlossaryData,
  GlossaryEntry,
  PreparedTerm,
} from "@/types/glossary";
import type { Locale } from "@/types";
import { slugify } from "@/lib/slugify";

/*
 * Single source of truth for the glossary. The data lives in one unified file
 * (src/data/glossary.json) keyed by uppercase first letter, each entry holding
 * fr/en/es translations of the term, definition, and category.
 *
 * These helpers are server-only by design — they import the full ~280KB JSON,
 * so they must never be imported from a "use client" module (that would bundle
 * the entire trilingual dataset into the browser). Server pages call them and
 * pass the lightweight, locale-resolved result down as props.
 */
const data = glossaryJson as unknown as GlossaryData;

/** Uppercase A–Z letter groups, in source order. */
export const getLetters = (): string[] => Object.keys(data);

/** Every entry, flattened across all letter groups. */
export const getAllEntries = (): GlossaryEntry[] => Object.values(data).flat();

/** Total number of glossary terms — the single source for the "+{count}" badge. */
export const getTermCount = (): number => getAllEntries().length;

const prepare = (entry: GlossaryEntry, locale: Locale): PreparedTerm => ({
  slug: slugify(entry.term.en),
  term: entry.term[locale],
  definition: entry.definition[locale],
  category: entry.category[locale],
  categoryKey: entry.category.en,
});

/** Prepared terms grouped by letter, localized for the given locale. */
export const getGroupedTerms = (locale: Locale): Record<string, PreparedTerm[]> => {
  const grouped: Record<string, PreparedTerm[]> = {};
  for (const [letter, entries] of Object.entries(data)) {
    grouped[letter] = entries.map((entry) => prepare(entry, locale));
  }
  return grouped;
};

/** Unique categories for the filter bar — `key` is the English label, `label` localized. */
export const getCategories = (locale: Locale): { key: string; label: string }[] => {
  const seen = new Map<string, string>();
  for (const entry of getAllEntries()) {
    if (!seen.has(entry.category.en)) {
      seen.set(entry.category.en, entry.category[locale]);
    }
  }
  return Array.from(seen, ([key, label]) => ({ key, label })).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
};

/** All unique slugs, for generateStaticParams. */
export const getAllSlugs = (): string[] =>
  Array.from(new Set(getAllEntries().map((entry) => slugify(entry.term.en))));

/** A single prepared term by slug, or null. Used by the SEO term page. */
export const getTermBySlug = (slug: string, locale: Locale): PreparedTerm | null => {
  const entry = getAllEntries().find((e) => slugify(e.term.en) === slug);
  return entry ? prepare(entry, locale) : null;
};

/**
 * Deterministic, low-saturation badge color for a category — hashed from its
 * stable English key so the same category always renders the same color across
 * every page (index badges, filter pills, SEO term page).
 */
export const getCategoryColor = (categoryKey: string): CategoryColor => {
  let hash = 0;
  for (let i = 0; i < categoryKey.length; i++) {
    hash = categoryKey.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue} 45% 13%)`,
    border: `hsl(${hue} 38% 30%)`,
    text: `hsl(${hue} 60% 80%)`,
  };
};
