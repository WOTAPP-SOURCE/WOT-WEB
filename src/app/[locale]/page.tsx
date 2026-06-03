import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";

/*
 * Below-the-fold sections are code-split with next/dynamic to keep the initial
 * bundle lean. They still server-render (no ssr:false) so the content stays
 * crawlable for SEO.
 */
const PhoneMockupSection = dynamic(() =>
  import("@/components/sections/PhoneMockupSection").then((mod) => mod.PhoneMockupSection)
);
const StatsSection = dynamic(() =>
  import("@/components/sections/StatsSection").then((mod) => mod.StatsSection)
);
const HowItWorksSection = dynamic(() =>
  import("@/components/sections/HowItWorksSection").then((mod) => mod.HowItWorksSection)
);
const CTASection = dynamic(() =>
  import("@/components/sections/CTASection").then((mod) => mod.CTASection)
);
const Footer = dynamic(() => import("@/components/layout/Footer").then((mod) => mod.Footer));

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Background />
      <BackgroundEffects />
      <Header />
      <main>
        <HeroSection />
        <PhoneMockupSection />
        <StatsSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
