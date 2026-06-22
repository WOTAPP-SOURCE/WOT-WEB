"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { LessonCards } from "@/components/sections/LessonCards";

export const LessonsCloudSection = () => {
  const t = useTranslations("lessons");
  const cards = t.raw("cards") as string[];
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
        // immediateRender:false keeps the steps at their natural (visible) state
        // until the trigger actually enters — so a trigger that never fires can
        // never leave them stuck at autoAlpha:0. The entrance only enhances.
        // A staggered top-down slide reinforces the roadmap's sequence.
        gsap.from(".lc-card, .lc-more", {
          y: 20,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.07,
          immediateRender: false,
          scrollTrigger: { trigger: ".lc-grid", start: "top 85%", once: true },
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

        <LessonCards cards={cards} more={t("more")} />
      </div>
    </section>
  );
};
