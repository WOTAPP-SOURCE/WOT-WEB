import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { getAllSlugs, getCategoryColor, getTermBySlug, getTermCount } from "@/lib/glossary";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/types";

interface TermPageProps {
  params: Promise<{ locale: string; term: string }>;
}

export const generateStaticParams = () => getAllSlugs().map((term) => ({ term }));

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { locale, term: slug } = await params;
  const term = getTermBySlug(slug, locale as Locale);
  if (!term) return {};

  const t = await getTranslations({ locale, namespace: "glossary" });

  return {
    title: { absolute: `${term.term} - ${t("seoSuffix")}` },
    description: term.definition.slice(0, 155),
    alternates: {
      canonical: `/${locale}/glossary/${slug}`,
      languages: {
        fr: `/fr/glossary/${slug}`,
        en: `/en/glossary/${slug}`,
        es: `/es/glossary/${slug}`,
      },
    },
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const { locale, term: slug } = await params;
  setRequestLocale(locale);

  const term = getTermBySlug(slug, locale as Locale);
  if (!term) notFound();

  const t = await getTranslations({ locale, namespace: "glossary" });
  const count = getTermCount();
  const color = getCategoryColor(term.categoryKey);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    inDefinedTermSet: `${SITE_URL}/${locale}/glossary`,
    url: `${SITE_URL}/${locale}/glossary/${slug}`,
  };

  return (
    <>
      <Background />
      <BackgroundEffects />
      <Header />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="relative px-5 pt-36 pb-28 sm:px-8 sm:pt-44">
          <div className="mx-auto max-w-[640px] text-center">
            <span
              className="inline-flex rounded-full px-3 py-1 font-mono text-[0.65rem] tracking-[0.1em] uppercase"
              style={{
                backgroundColor: color.bg,
                color: color.text,
                border: `1px solid ${color.border}`,
              }}
            >
              {term.category}
            </span>

            <h1 className="text-text mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              {term.term}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[#C0C0C8]">{term.definition}</p>

            <div className="mt-10">
              <Link
                href="/glossary"
                className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border px-7 py-3.5 text-base font-medium transition-all duration-200 hover:text-white"
              >
                {t("exploreAllCta", { count })}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
