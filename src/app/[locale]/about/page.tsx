import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutContent } from "@/components/about/AboutContent";
import { getAboutData } from "@/lib/about";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/about`,
      languages: { fr: "/fr/about", en: "/en/about", es: "/es/about" },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = getAboutData(locale as Locale);

  return (
    <>
      <Background />
      <BackgroundEffects />
      <Header />
      <main>
        <AboutContent data={data} />
      </main>
      <Footer />
    </>
  );
}
