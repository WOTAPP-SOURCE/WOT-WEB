"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { PRICING_PLANS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const PricingSection = () => {
  const t = useTranslations("pricing");
  const features = t.raw("features") as string[];
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pr-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".pr-heading", start: "top 85%" },
        });
        gsap.from(".pr-card", {
          y: 40,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: { trigger: ".pr-grid", start: "top 80%" },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="pr-heading mx-auto max-w-3xl text-center">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="text-text-muted mx-auto mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="pr-grid mx-auto mt-16 grid max-w-5xl grid-cols-1 items-center gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => {
            const Inner = (
              <div
                className={cn(
                  "flex h-full flex-col rounded-[calc(1.5rem-1px)] p-7",
                  plan.highlighted ? "bg-surface" : "border-border border bg-surface/50"
                )}
              >
                {plan.badgeKey && (
                  <span className="bg-primary mx-auto -mt-11 mb-4 inline-flex rounded-full px-4 py-1.5 font-mono text-[0.62rem] tracking-[0.14em] text-white uppercase shadow-glow">
                    {t(plan.badgeKey)}
                  </span>
                )}

                <h3 className="text-text-muted font-mono text-sm tracking-[0.12em] uppercase">
                  {t(plan.nameKey)}
                </h3>

                <div className="mt-4 flex items-end gap-1">
                  <span className="text-text text-4xl font-bold tracking-tight sm:text-5xl">
                    €{plan.price}
                  </span>
                  <span className="text-text-muted mb-1.5 text-sm">{t(plan.periodKey)}</span>
                </div>

                <p className="text-accent mt-2 h-5 text-sm font-medium">
                  {plan.saveKey ? t(plan.saveKey) : ""}
                </p>

                <ul className="mt-6 flex flex-col gap-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <CheckIcon className="text-accent mt-0.5 h-4 w-4 shrink-0" />
                      <span className="text-text-muted text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-2">
                  <Button
                    href="#download"
                    variant={plan.highlighted ? "primary" : "secondary"}
                    size="lg"
                    className="w-full"
                  >
                    {t("ctaLabel")}
                  </Button>
                </div>
              </div>
            );

            return (
              <div
                key={plan.nameKey}
                className={cn(
                  "pr-card relative rounded-3xl",
                  plan.highlighted
                    ? "shadow-glow-lg bg-[linear-gradient(135deg,#941EFE,#5B0FA8)] p-px md:scale-105"
                    : "p-px"
                )}
              >
                {Inner}
              </div>
            );
          })}
        </div>

        <p className="text-text-muted mt-10 text-center text-sm">{t("footnote")}</p>
      </div>
    </section>
  );
};
