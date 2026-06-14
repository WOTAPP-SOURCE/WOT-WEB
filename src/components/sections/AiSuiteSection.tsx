"use client";

import { useRef, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { BarChartIcon, ChatBubbleIcon, ClockIcon } from "@/components/ui/Icons";

interface AiCard {
  titleKey: string;
  descKey: string;
  Icon: ComponentType<{ className?: string }>;
}

const CARDS: AiCard[] = [
  { titleKey: "card1Title", descKey: "card1Desc", Icon: ChatBubbleIcon },
  { titleKey: "card2Title", descKey: "card2Desc", Icon: BarChartIcon },
  { titleKey: "card3Title", descKey: "card3Desc", Icon: ClockIcon },
];

export const AiSuiteSection = () => {
  const t = useTranslations("aiSuite");
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        // immediateRender:false keeps these visible until their trigger actually
        // enters, so a trigger that never fires (code-split section + Lenis) can
        // never leave the 3 AI cards stuck at autoAlpha:0 — which previously left
        // them invisible-but-space-occupying as a large empty band below the title.
        gsap.from(".ai-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: ".ai-heading", start: "top 85%", once: true },
        });
        gsap.from(".ai-card", {
          y: 40,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.15,
          immediateRender: false,
          scrollTrigger: { trigger: ".ai-grid", start: "top 80%", once: true },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="ai-heading mx-auto max-w-3xl text-center">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("titleLead")} <span className="text-shimmer">{t("titleHighlight")}</span>
          </h2>
          <p className="text-primary mt-5 font-mono text-xs tracking-[0.22em] uppercase sm:text-sm">
            {t("titleKicker")}
          </p>
        </div>

        <div className="ai-grid mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CARDS.map((card, index) => (
            <article
              key={card.titleKey}
              className="ai-card group border-primary/30 relative overflow-hidden rounded-2xl border bg-gradient-to-br from-[#1a0f33] to-[#0c0717] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-glow-lg"
            >
              <span className="text-text-muted/40 absolute top-6 right-6 font-mono text-sm">
                0{index + 1}
              </span>

              <div className="from-primary to-accent shadow-glow flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br">
                <card.Icon className="h-6 w-6 text-white" />
              </div>

              <h3 className="text-text mt-6 text-xl font-semibold">{t(card.titleKey)}</h3>
              <p className="text-text-muted mt-3 text-sm leading-relaxed">{t(card.descKey)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
