import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/constants";
import { routing } from "@/i18n/routing";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: { fr: "/fr/contact", en: "/en/contact", es: "/es/contact" },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contactPage" });

  return (
    <>
      <Background />
      <BackgroundEffects />
      <Header />
      <main className="relative px-5 pt-36 pb-28 sm:px-8 sm:pt-44">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
              {t("eyebrow")}
            </span>
            <h1 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {t("title")}
            </h1>
            <p className="text-text-muted mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
              {t("subtitle")}
            </p>
          </div>

          {/* Card surface lives inside ContactForm so the whole card can flip
              to its success face on a confirmed send. */}
          <div className="mt-12">
            <ContactForm />
          </div>

          <p className="text-text-muted mt-8 text-center text-sm">
            {t("directEmailPrefix")}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-primary hover:text-accent underline underline-offset-4 transition-colors duration-200"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
