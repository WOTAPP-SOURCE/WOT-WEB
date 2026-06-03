import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import type { Locale } from "@/types";

/*
 * next/font/google downloads Poppins at build time and serves it from
 * the Next.js server — no requests go to Google CDN at page load.
 * Swap for next/font/local + public/fonts/*.woff2 files when ready.
 */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

/*
 * JetBrains Mono powers every technical/mono label — badges, stat labels,
 * section numbers, category tags, footer column headers. next/font/google
 * self-hosts it at build time (no runtime Google CDN request), matching Poppins.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("homeTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("homeDescription"),
    metadataBase: new URL("https://wayoftrading.com"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        es: "/es",
      },
    },
    openGraph: {
      siteName: t("siteName"),
      locale,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>{children}</SmoothScroll>
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
