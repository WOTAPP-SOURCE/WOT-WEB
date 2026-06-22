import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { LaunchCountdown } from "@/components/sections/LaunchCountdown";
import { ArrowLeftIcon } from "@/components/ui/Icons";
import { routing } from "@/i18n/routing";

interface LaunchPageProps {
  params: Promise<{ locale: string }>;
}

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: LaunchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "launch" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/lancement`,
      languages: {
        fr: "/fr/lancement",
        en: "/en/lancement",
        es: "/es/lancement",
      },
    },
  };
}

export default async function LaunchPage({ params }: LaunchPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "launch" });

  return (
    <>
      <Background />
      <BackgroundEffects />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
        <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
          {t("eyebrow")}
        </span>

        <h1 className="text-shimmer mt-5 font-extrabold leading-[1.05] tracking-tight text-[clamp(2.25rem,9vw,4.5rem)]">
          {t("title")}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-12 flex w-full flex-col items-center">
          <LaunchCountdown />

          <p className="text-text-muted mt-6 font-mono text-xs tracking-[0.18em] uppercase">
            {t("date_label")}
          </p>
        </div>

        <Link
          href="/"
          className="text-text-muted hover:text-text mt-14 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:border-primary/60 hover:bg-white/[0.05]"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("back")}
        </Link>
      </main>
    </>
  );
}
