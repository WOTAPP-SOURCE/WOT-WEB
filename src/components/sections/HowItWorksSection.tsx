"use client";

import { useRef, type ComponentType } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DownloadIcon, SparklesIcon, TrendingUpIcon } from "@/components/ui/Icons";

interface StepConfig {
  titleKey: string;
  descKey: string;
  Icon: ComponentType<{ className?: string }>;
}

const STEPS: StepConfig[] = [
  { titleKey: "step1Title", descKey: "step1Desc", Icon: DownloadIcon },
  { titleKey: "step2Title", descKey: "step2Desc", Icon: SparklesIcon },
  { titleKey: "step3Title", descKey: "step3Desc", Icon: TrendingUpIcon },
];

export const HowItWorksSection = () => {
  const t = useTranslations("howItWorks");
  const sectionRef = useRef<HTMLElement>(null);
  const stepsWrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".how-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: ".how-heading", start: "top 85%" },
        });

        // Connecting line draws itself via stroke-dashoffset as steps scroll past.
        const line = lineRef.current;
        if (line) {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(line, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: stepsWrapRef.current,
              start: "top 75%",
              end: "center 55%",
              scrub: 1,
            },
          });
        }

        // Steps pop in with a stagger; each ring pulses as it becomes active.
        const steps = gsap.utils.toArray<HTMLElement>(".how-step");
        steps.forEach((step, i) => {
          gsap.from(step, {
            scale: 0.8,
            autoAlpha: 0,
            duration: 0.55,
            ease: "back.out(1.6)",
            delay: i * 0.2,
            scrollTrigger: { trigger: stepsWrapRef.current, start: "top 75%" },
          });

          const ring = step.querySelector(".how-ring");
          if (!ring) return;
          gsap.fromTo(
            ring,
            { scale: 0.7, autoAlpha: 0.7 },
            {
              scale: 1.8,
              autoAlpha: 0,
              duration: 1.4,
              ease: "power1.out",
              repeat: 1,
              scrollTrigger: { trigger: step, start: "top 65%", once: true },
            }
          );
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="how-heading mx-auto max-w-2xl text-center">
          <span className="text-accent text-xs font-semibold tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
          <p className="text-text-muted mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div ref={stepsWrapRef} className="relative mt-20">
          {/* Self-drawing connecting line (desktop) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 20"
            preserveAspectRatio="none"
            className="absolute top-8 left-0 hidden h-5 w-full lg:block"
          >
            <defs>
              <linearGradient id="howitworks-line" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#941efe" stopOpacity="0" />
                <stop offset="20%" stopColor="#941efe" />
                <stop offset="80%" stopColor="#b366ff" />
                <stop offset="100%" stopColor="#b366ff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="160" y1="10" x2="840" y2="10" stroke="#1e1e2e" strokeWidth="2" />
            <line
              ref={lineRef}
              x1="160"
              y1="10"
              x2="840"
              y2="10"
              stroke="url(#howitworks-line)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-3 lg:gap-8">
            {STEPS.map((step, index) => (
              <div
                key={step.titleKey}
                className="how-step relative flex flex-col items-center text-center"
              >
                {/* Gradient-ring numbered circle */}
                <div className="from-primary to-accent shadow-glow relative h-20 w-20 rounded-2xl bg-gradient-to-br p-px">
                  {/* Pulsing active-step ring */}
                  <div className="how-ring border-primary pointer-events-none absolute inset-0 rounded-2xl border-2 opacity-0" />
                  <div className="bg-surface flex h-full w-full items-center justify-center rounded-2xl">
                    <step.Icon className="text-accent h-8 w-8" />
                  </div>
                  <span className="bg-primary shadow-glow absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-text mt-7 text-xl font-semibold">{t(step.titleKey)}</h3>
                <p className="text-text-muted mt-3 max-w-xs text-sm leading-relaxed">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
