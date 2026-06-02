import type { GlossaryTerm, GlossaryCategory } from "@/types/glossary";
import type { Locale } from "@/types";

export const getGlossaryTerms = async (locale: Locale): Promise<GlossaryTerm[]> => {
  const data = await import(`@/data/glossary/${locale}.json`);
  return data.default as GlossaryTerm[];
};

export const getTermBySlug = async (slug: string, locale: Locale): Promise<GlossaryTerm | null> => {
  const terms = await getGlossaryTerms(locale);
  return terms.find((term) => term.slug === slug) ?? null;
};

export const getTermsByCategory = async (
  category: GlossaryCategory,
  locale: Locale
): Promise<GlossaryTerm[]> => {
  const terms = await getGlossaryTerms(locale);
  return terms.filter((term) => term.category === category);
};

export const getRelatedTerms = async (
  relatedSlugs: string[],
  locale: Locale
): Promise<GlossaryTerm[]> => {
  const terms = await getGlossaryTerms(locale);
  return terms.filter((term) => relatedSlugs.includes(term.slug));
};

export const getAllSlugs = async (locale: Locale): Promise<string[]> => {
  const terms = await getGlossaryTerms(locale);
  return terms.map((term) => term.slug);
};
