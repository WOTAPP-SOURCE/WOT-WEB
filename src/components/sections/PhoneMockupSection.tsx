"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { PhoneFeaturePanel } from "@/components/sections/PhoneFeaturePanel";

interface FeatureConfig {
  labelKey: string;
  titleKey: string;
  descKey: string;
  image: string;
  video?: string;
}

const FEATURES: FeatureConfig[] = [
  {
    labelKey: "coachLabel",
    titleKey: "coachTitle",
    descKey: "coachDesc",
    image: "/images/screenshots/coach-rudy.png",
  },
  {
    labelKey: "chartLabel",
    titleKey: "chartTitle",
    descKey: "chartDesc",
    image: "/images/screenshots/graph-analyzer.png",
    video: "/videos/fr/chart-analyzer.mp4",
  },
  {
    labelKey: "tradeLabel",
    titleKey: "tradeTitle",
    descKey: "tradeDesc",
    image: "/images/screenshots/trade-analyzer.png",
  },
  {
    labelKey: "toolsLabel",
    titleKey: "toolsTitle",
    descKey: "toolsDesc",
    image: "/images/screenshots/tools.png",
  },
];

interface PhoneMockupSectionProps {
  /** Live glossary term count from glossary.json. */
  count: number;
}

export const PhoneMockupSection = ({ count }: PhoneMockupSectionProps) => {
  const t = useTranslations("phone");
  const introRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(introRef.current, {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: introRef.current, start: "top 85%" },
        });
      });
    },
    { scope: introRef }
  );

  return (
    <section className="relative">
      {/* Section intro */}
      <div className="mx-auto max-w-7xl px-5 pt-20 pb-4 sm:px-8 sm:pt-24">
        <div ref={introRef} className="mx-auto max-w-3xl text-center">
          <span className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="text-text-muted mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Cinematic sticky-scroll feature panels */}
      {FEATURES.map((feature, index) => (
        <PhoneFeaturePanel
          key={feature.titleKey}
          labelKey={feature.labelKey}
          titleKey={feature.titleKey}
          descKey={feature.descKey}
          image={feature.image}
          video={feature.video}
          index={index}
          reversed={index % 2 === 1}
          priority={index === 0}
          count={count}
        />
      ))}
    </section>
  );
};
