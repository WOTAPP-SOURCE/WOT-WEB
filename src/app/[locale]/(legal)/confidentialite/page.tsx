import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getLegalDocument } from "@/lib/legal";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/types";

const SLUG = "confidentialite" as const;

interface LegalPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t(`meta.${SLUG}.title`),
    description: t(`meta.${SLUG}.description`),
    alternates: {
      canonical: `/${locale}/${SLUG}`,
      languages: { fr: `/fr/${SLUG}`, en: `/en/${SLUG}`, es: `/es/${SLUG}` },
    },
  };
}

export default async function PrivacyPage({ params }: LegalPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalDocument doc={getLegalDocument(locale as Locale, SLUG)} locale={locale as Locale} />;
}
