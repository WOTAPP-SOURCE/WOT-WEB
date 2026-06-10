import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlossaryBrowser } from "@/components/glossary/GlossaryBrowser";
import {
  getCategories,
  getCategoryColor,
  getGroupedTerms,
  getLetters,
} from "@/lib/glossary";
import { routing } from "@/i18n/routing";
import type { CategoryColor } from "@/types/glossary";
import type { Locale } from "@/types";

interface GlossaryPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: GlossaryPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "glossary" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/glossary`,
      languages: { fr: "/fr/glossary", en: "/en/glossary", es: "/es/glossary" },
    },
  };
}

export default async function GlossaryPage({ params }: GlossaryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const typedLocale = locale as Locale;
  const grouped = getGroupedTerms(typedLocale);
  const letters = getLetters();
  const categories = getCategories(typedLocale);

  // Resolve a deterministic color per category once, server-side, so the
  // client browser never has to import the full glossary data.
  const categoryColors: Record<string, CategoryColor> = {};
  for (const { key } of categories) {
    categoryColors[key] = getCategoryColor(key);
  }

  return (
    <>
      <Background />
      <BackgroundEffects />
      <Header />
      <main>
        <GlossaryBrowser
          grouped={grouped}
          letters={letters}
          categories={categories}
          categoryColors={categoryColors}
        />
      </main>
      <Footer />
    </>
  );
}
