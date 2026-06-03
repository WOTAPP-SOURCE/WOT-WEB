"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { LESSON_TOPICS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SIZE_STYLES: Record<string, string> = {
  lg: "px-6 py-3 text-lg sm:text-xl",
  md: "px-5 py-2.5 text-base",
  reg: "px-4 py-2 text-sm",
};

export const LessonsCloudSection = () => {
  const t = useTranslations("lessons");
  const items = t.raw("items") as string[];
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lc-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".lc-heading", start: "top 85%" },
        });
        gsap.from(".lc-pill", {
          scale: 0.8,
          autoAlpha: 0,
          duration: 0.45,
          ease: "back.out(1.6)",
          stagger: 0.05,
          scrollTrigger: { trigger: ".lc-cloud", start: "top 82%" },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="lc-heading mx-auto max-w-3xl text-center">
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

        <div className="lc-cloud mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {items.map((item, i) => {
            const config = LESSON_TOPICS[i] ?? { size: "reg", highlight: false };
            return (
              <span
                key={item}
                className={cn(
                  "lc-pill cursor-default rounded-full font-medium transition-all duration-300 hover:-translate-y-1",
                  SIZE_STYLES[config.size],
                  config.highlight
                    ? "bg-[linear-gradient(135deg,#941EFE,#5B0FA8)] text-white shadow-[0_0_24px_rgba(148,30,254,0.45)] hover:shadow-[0_0_36px_rgba(148,30,254,0.65)]"
                    : "border-border text-text-muted hover:border-primary/50 hover:text-text border bg-surface/50 hover:shadow-glow"
                )}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};
