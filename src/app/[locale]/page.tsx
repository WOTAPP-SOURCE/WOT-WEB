import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";
import { Background } from "@/components/layout/Background";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";
import { HashScroll } from "@/components/layout/HashScroll";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeTicker } from "@/components/sections/MarqueeTicker";
import { getTermCount } from "@/lib/glossary";
import { getFeaturedFaqQuestions } from "@/lib/faq";
import type { Locale } from "@/types";

/*
 * Below-the-fold sections are code-split with next/dynamic to keep the initial
 * bundle lean. They still server-render (no ssr:false) so the content stays
 * crawlable for SEO.
 */
const PhoneMockupSection = dynamic(() =>
  import("@/components/sections/PhoneMockupSection").then((mod) => mod.PhoneMockupSection)
);
const AiSuiteSection = dynamic(() =>
  import("@/components/sections/AiSuiteSection").then((mod) => mod.AiSuiteSection)
);
const GlossaryPreviewSection = dynamic(() =>
  import("@/components/sections/GlossaryPreviewSection").then((mod) => mod.GlossaryPreviewSection)
);
const LessonsCloudSection = dynamic(() =>
  import("@/components/sections/LessonsCloudSection").then((mod) => mod.LessonsCloudSection)
);
const StatsSection = dynamic(() =>
  import("@/components/sections/StatsSection").then((mod) => mod.StatsSection)
);
const HowItWorksSection = dynamic(() =>
  import("@/components/sections/HowItWorksSection").then((mod) => mod.HowItWorksSection)
);
const RewardsSection = dynamic(() =>
  import("@/components/sections/RewardsSection").then((mod) => mod.RewardsSection)
);
const PricingSection = dynamic(() =>
  import("@/components/sections/PricingSection").then((mod) => mod.PricingSection)
);
const FaqSection = dynamic(() =>
  import("@/components/sections/FaqSection").then((mod) => mod.FaqSection)
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

  // Single source of truth for the glossary count — derived from glossary.json
  // and threaded into every section that displays it (no hardcoded "288").
  const count = getTermCount();
  // Homepage FAQ preview: drop the "pricing" entry — the full pricing section sits
  // directly above it, so "Quels sont les tarifs ?" is redundant here. It stays on
  // the dedicated /faq page (which uses getFaqQuestions, untouched), and the
  // `featured` flag is left intact to avoid affecting /faq ordering.
  const featuredFaq = getFeaturedFaqQuestions(locale as Locale).filter((q) => q.id !== "pricing");

  return (
    <>
      <Background />
      <BackgroundEffects />
      <HashScroll />
      <Header />
      <main>
        <HeroSection count={count} />
        <MarqueeTicker count={count} />
        <PhoneMockupSection count={count} />
        <AiSuiteSection />
        <GlossaryPreviewSection count={count} />
        <LessonsCloudSection />
        <StatsSection count={count} />
        <HowItWorksSection />
        <RewardsSection />
        <PricingSection count={count} />
        <FaqSection questions={featuredFaq} />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
