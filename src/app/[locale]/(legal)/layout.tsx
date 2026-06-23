import { getTranslations, setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LegalShell } from "@/components/legal/LegalShell";
import { LEGAL_DOCS } from "@/lib/legal";
import { routing } from "@/i18n/routing";

interface LegalLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

/*
 * Shared frame for the four Legal Center documents. The Header/Background/Footer
 * and the sticky sidebar (LegalShell) live here so they persist across the four
 * routes — navigating between documents only swaps the {children} content area.
 */
export default async function LegalLayout({ children, params }: LegalLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "legal" });
  const nav = LEGAL_DOCS.map((doc) => ({ href: doc.href, label: t(`nav.${doc.slug}`) }));

  return (
    <>
      <Background />
      <BackgroundEffects />
      <Header />
      <main>
        <LegalShell nav={nav} heading={t("centerTitle")}>
          {children}
        </LegalShell>
      </main>
      <Footer />
    </>
  );
}
