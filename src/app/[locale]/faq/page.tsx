import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FaqPageContent } from "@/components/faq/FaqPageContent";
import { getFaqCategories, getFaqQuestions } from "@/lib/faq";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { fr: "/fr/faq", en: "/en/faq", es: "/es/faq" },
    },
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const categories = getFaqCategories(locale as Locale);
  const questions = getFaqQuestions(locale as Locale);

  // FAQPage structured data — every question in the current locale.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
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
        <FaqPageContent categories={categories} questions={questions} />
      </main>
      <Footer />
    </>
  );
}
