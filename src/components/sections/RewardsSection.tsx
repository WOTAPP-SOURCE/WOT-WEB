"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CheckIcon, CoinsIcon, TrophyIcon } from "@/components/ui/Icons";

export const RewardsSection = () => {
  const t = useTranslations("rewards");
  const sectionRef = useRef<HTMLElement>(null);

  const points = [t("point1"), t("point2"), t("point3")];

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".rw-copy > *", {
          y: 28,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
        gsap.from(".rw-visual", {
          scale: 0.9,
          autoAlpha: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Left — copy */}
        <div className="rw-copy text-center lg:text-left">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="text-text-muted mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
            {t("description")}
          </p>

          <ul className="mx-auto mt-8 flex max-w-md flex-col gap-4 text-left lg:mx-0">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="from-primary to-accent flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br">
                  <CheckIcon className="h-4 w-4 text-white" />
                </span>
                <span className="text-text text-sm sm:text-base">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — visual */}
        <div className="rw-visual relative mx-auto w-full max-w-md">
          <div className="border-primary/30 relative overflow-hidden rounded-3xl border bg-gradient-to-br from-[#1f1140] to-[#0b0617] p-10">
            <div className="glow-radial pointer-events-none absolute inset-0 opacity-60" />

            {/* Coin badge */}
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <div className="animate-pulse-glow absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.35),transparent_70%)] blur-xl" />
              <div className="from-warning shadow-glow relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br to-[#b45309] ring-4 ring-white/10">
                <CoinsIcon className="h-14 w-14 text-white" />
              </div>
              {/* Floating trophy chip */}
              <div className="glass-card absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-2xl">
                <TrophyIcon className="text-warning h-6 w-6" />
              </div>
            </div>

            <p className="text-text relative mt-8 text-center text-2xl font-bold">
              {t("visualTitle")}
            </p>
            <p className="text-text-muted relative mt-1 text-center font-mono text-[0.65rem] tracking-[0.16em] uppercase">
              {t("visualSubtitle")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
