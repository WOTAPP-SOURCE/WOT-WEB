"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DownloadCta } from "@/components/ui/DownloadCta";

/*
 * Cinematic closing statement — no mascot, just type. Two oversized lines with
 * the second ("The desk is on.") carrying an animated shimmer gradient. The glow
 * layer drifts slower than the copy on scroll for a parallax sense of depth, and
 * a one-shot timeline reveals the badge, headline, subtitle and store buttons.
 */
export const CTASection = () => {
  const t = useTranslations("cta");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(".cta-glow", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          })
          .from(".cta-item", { y: 32, autoAlpha: 0, duration: 0.7, stagger: 0.14 });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 sm:py-24">
      {/* Background glow (parallax) */}
      <div className="cta-glow pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(148,30,254,0.18),transparent_70%)]" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center sm:px-8">
        <span className="cta-item border-success/30 bg-success/10 text-text inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          <span
            className="bg-success h-2 w-2 rounded-full"
            style={{ animation: "live-pulse 2s ease-in-out infinite" }}
          />
          {t("badge")}
        </span>

        <h2 className="cta-item mt-8 font-extrabold leading-[0.95] tracking-tight text-[clamp(32px,7vw,80px)] sm:text-[clamp(48px,8vw,140px)]">
          <span className="text-gradient block whitespace-normal sm:whitespace-nowrap">
            {t("line1")}
          </span>
          <span className="text-shimmer block whitespace-normal sm:whitespace-nowrap">
            {t("line2")}
          </span>
        </h2>

        <p className="cta-item text-text-muted mt-8 max-w-xl text-base leading-relaxed sm:text-lg">
          {t("subheadline")}
        </p>

        <DownloadCta className="cta-item mt-10" />
      </div>
    </section>
  );
};
