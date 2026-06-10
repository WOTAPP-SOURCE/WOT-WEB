"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { STATS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatsSectionProps {
  /** Live glossary term count — replaces the hardcoded terms figure. */
  count: number;
}

export const StatsSection = ({ count }: StatsSectionProps) => {
  const t = useTranslations("stats");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".stats-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".stats-heading", start: "top 85%" },
        });

        gsap.from(".stats-item", {
          y: 24,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".stats-grid", start: "top 80%" },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      {/* Full-width glowing gradient hairlines top and bottom */}
      <div className="via-primary/50 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent shadow-[0_0_15px_rgba(148,30,254,0.6)]" />
      <div className="via-primary/50 absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent shadow-[0_0_15px_rgba(148,30,254,0.6)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="stats-heading mx-auto max-w-2xl text-center">
          <span className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="text-text-muted mx-auto mt-4 max-w-xl text-base">{t("subtitle")}</p>
        </div>

        <dl className="stats-grid mt-14 grid grid-cols-2 gap-y-12 lg:grid-cols-4 lg:gap-y-0">
          {STATS.map((stat, index) => {
            // The glossary terms figure is driven by the live count, shown as +{count}.
            const isTerms = stat.key === "termsLabel";
            return (
            <div
              key={stat.key}
              className={cn(
                "stats-item flex flex-col items-center text-center lg:px-6",
                // Vertical dividers between columns on desktop
                index > 0 && "lg:border-l lg:border-white/10"
              )}
            >
              <dd className="text-gradient-purple text-5xl font-bold tracking-tight sm:text-6xl">
                <AnimatedCounter
                  value={isTerms ? count : stat.value}
                  prefix={isTerms ? "+" : ""}
                  suffix={isTerms ? "" : stat.suffix}
                />
              </dd>
              <dt className="text-text-muted mt-3 text-sm font-medium sm:text-base">
                {t(stat.key)}
              </dt>
            </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};
