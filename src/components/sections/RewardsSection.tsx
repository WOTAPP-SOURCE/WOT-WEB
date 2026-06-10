"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { CheckIcon } from "@/components/ui/Icons";

/* Heavy WebGL bundle — load client-side only, never on the server. */
const CoinRain = dynamic(
  () => import("@/components/sections/CoinRain").then((mod) => mod.CoinRain),
  { ssr: false }
);

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

        {/* Right — 3D coin rain (replaces the static WOT Coins card) */}
        <div className="rw-visual relative mx-auto aspect-square w-full max-w-md">
          <CoinRain />
        </div>
      </div>
    </section>
  );
};
