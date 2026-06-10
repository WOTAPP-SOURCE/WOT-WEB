import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";
import { getAllSlugs } from "@/lib/glossary";

/*
 * Static sitemap covering every built route across all locales: the homepage,
 * glossary index, FAQ, About, and one entry per glossary term page. Each entry
 * carries hreflang alternates so search engines understand the fr/en/es
 * variants. Routes that aren't implemented yet (features, pricing, …) are
 * intentionally excluded — listing 404s would hurt crawl quality.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { locales } = routing;
  const staticPaths = ["", "/glossary", "/faq", "/about"];
  const slugs = getAllSlugs();

  const altLanguages = (path: string) =>
    Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]));

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
        alternates: { languages: altLanguages(path) },
      });
    }

    for (const slug of slugs) {
      const path = `/glossary/${slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: altLanguages(path) },
      });
    }
  }

  return entries;
}
