/*
 * Convert a glossary term (always slugified from its English name) into a
 * URL-safe slug: accents stripped, lowercased, spaces -> hyphens, specials
 * removed. Shared by generateStaticParams and getTermBySlug so the slugs a
 * page is built with always match the slug it is looked up by.
 */
export const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
