"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { StoreButtons } from "@/components/ui/StoreButtons";

/*
 * Depth without a 3D engine: three layers (glow → mascot → copy) are scrubbed
 * up the viewport at increasing speeds as the section passes through, so the
 * copy outruns the mascot which outruns the background glow. A separate one-shot
 * timeline reveals the copy and pops the mascot in the first time it enters.
 */
export const CTASection = () => {
  const t = useTranslations("cta");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        const parallax = (selector: string, yPercent: number) => {
          gsap.to(selector, {
            yPercent,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        };

        parallax(".cta-glow", -8); // slowest
        parallax(".cta-mascot", -22); // medium
        parallax(".cta-copy", -38); // fastest

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          })
          .from(".cta-mascot", { scale: 0.85, autoAlpha: 0, duration: 0.8 })
          .from(".cta-item", { y: 28, autoAlpha: 0, duration: 0.6, stagger: 0.13 }, "-=0.4");
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28 sm:py-36">
      {/* Layer 1 — background glow (slowest) */}
      <div className="cta-glow pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(148,30,254,0.15),transparent_70%)]" />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8">
        {/* Layer 2 — mascot (medium) */}
        <div className="cta-mascot relative mb-8 h-44 w-44 sm:h-52 sm:w-52">
          <div className="glow-radial animate-pulse-glow pointer-events-none absolute inset-0 scale-125 blur-2xl" />
          <div className="animate-float relative h-full w-full">
            <Image
              src="/images/mascot/mascot-original.png"
              alt="Rudy, the WOT AI trading coach robot"
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className="object-contain drop-shadow-[0_16px_50px_rgba(148,30,254,0.4)]"
            />
          </div>
        </div>

        {/* Layer 3 — copy (fastest) */}
        <div className="cta-copy flex flex-col items-center">
          <h2 className="cta-item text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-gradient-purple text-glow-lg">{t("headline")}</span>
          </h2>

          <p className="cta-item text-text-muted mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            {t("subheadline")}
          </p>

          <div className="cta-item mt-10 flex justify-center">
            <StoreButtons />
          </div>

          <p className="cta-item text-text-muted mt-7 text-xs tracking-[0.18em] uppercase">
            {t("trustNote")}
          </p>
        </div>
      </div>
    </section>
  );
};
