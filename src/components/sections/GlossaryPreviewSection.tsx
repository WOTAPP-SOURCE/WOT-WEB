"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { GLOSSARY_SAMPLE } from "@/lib/constants";
import { slugify } from "@/lib/slugify";

interface GlossaryPreviewSectionProps {
  /** Live glossary term count from glossary.json. */
  count: number;
}

export const GlossaryPreviewSection = ({ count }: GlossaryPreviewSectionProps) => {
  const t = useTranslations("glossaryPreview");
  const categories = t.raw("categories") as string[];
  const definitions = t.raw("definitions") as string[];
  const sectionRef = useRef<HTMLElement>(null);

  const STAT_CARDS = [
    { value: `+${count}`, labelKey: "statTermsLabel" },
    { value: "18", labelKey: "statCategoriesLabel" },
    { value: "3", labelKey: "statLanguagesLabel" },
  ];

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // immediateRender:false keeps these visible until their trigger actually
        // enters, so a trigger that never fires (code-split section + Lenis) can
        // never leave them stuck at autoAlpha:0 — which previously left the
        // invisible-but-space-occupying term cards as a large empty band.
        gsap.from(".glx-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".glx-heading", start: "top 85%", once: true },
        });
        gsap.from(".glx-stat", {
          y: 24,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.12,
          immediateRender: false,
          scrollTrigger: { trigger: ".glx-stats", start: "top 82%", once: true },
        });
        gsap.from(".glx-term", {
          y: 30,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          immediateRender: false,
          scrollTrigger: { trigger: ".glx-terms", start: "top 82%", once: true },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="glx-heading mx-auto max-w-3xl text-center">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title", { count })} <span className="text-gradient-purple">{t("titleAccent")}</span>
          </h2>
          <p className="text-text-muted mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        {/* Big stat cards */}
        <div className="glx-stats mt-14 grid grid-cols-3 gap-4 sm:gap-6">
          {STAT_CARDS.map((stat) => (
            <div
              key={stat.labelKey}
              className="glx-stat border-primary/20 rounded-2xl border bg-[#941EFE]/[0.06] px-4 py-8 text-center"
            >
              <div className="text-gradient-purple text-4xl font-bold tracking-tight sm:text-6xl">
                {stat.value}
              </div>
              <div className="text-text-muted mt-2 font-mono text-[0.65rem] tracking-[0.16em] uppercase sm:text-xs">
                {t(stat.labelKey)}
              </div>
            </div>
          ))}
        </div>

        {/* Sample term cards */}
        <div className="glx-terms mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GLOSSARY_SAMPLE.map((sample, i) => (
            <Link
              key={sample.enTerm}
              href={`/glossary/${slugify(sample.enTerm)}`}
              className="glx-term group border-border hover:border-primary/50 hover:shadow-glow block rounded-2xl border bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1.5"
            >
              <span className="border-border text-text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.6rem] tracking-[0.12em] uppercase">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: sample.dot }}
                />
                {categories[i]}
              </span>
              <h3 className="text-text group-hover:text-accent mt-4 text-lg font-semibold transition-colors duration-200">
                {sample.term}
              </h3>
              <p className="text-text-muted mt-2 text-sm leading-relaxed">{definitions[i]}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/glossary"
            className="text-accent hover:text-primary inline-flex items-center gap-2 font-medium transition-colors duration-200"
          >
            {t("exploreCta", { count })}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
