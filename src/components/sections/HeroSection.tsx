"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { TickerAmbience } from "@/components/sections/TickerAmbience";
import { ChevronDownIcon, SparklesIcon } from "@/components/ui/Icons";
import { HERO_ORBIT_CARDS, HERO_STATS } from "@/lib/constants";

// Concentric rings: diameter, spin duration, reverse direction.
const RINGS = [
  { size: 480, duration: "26s", reverse: false },
  { size: 620, duration: "34s", reverse: true },
  { size: 760, duration: "44s", reverse: false },
];

interface HeroSectionProps {
  /** Live glossary term count from glossary.json. */
  count: number;
}

export const HeroSection = ({ count }: HeroSectionProps) => {
  const t = useTranslations("hero");

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const mascotTiltRef = useRef<HTMLDivElement>(null);
  const mascotFloatRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Intro timeline — runs once on load.
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 }, 0.1)
          .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.4")
          .from(
            ".hero-cta",
            { scale: 0.85, opacity: 0, duration: 0.8, ease: "elastic.out(1, 0.65)" },
            "-=0.4"
          )
          .from(".hero-stat", { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, "-=0.3")
          .from(".hero-orbit", { scale: 0.7, autoAlpha: 0, duration: 0.7, stagger: 0.12 }, "-=0.8")
          .from(".hero-scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.2");

        // 2. Idle float on the mascot.
        gsap.to(mascotFloatRef.current, {
          y: "+=15",
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // 3. Pulsing aura behind the mascot.
        gsap.to(".hero-aura", {
          opacity: 0.35,
          scale: 1.05,
          duration: 4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // 4. Pin the hero for only 30vh so the user scrolls through quickly.
        //    A light parallax drift on the mascot as the section leaves — the
        //    headline/content stay fully visible throughout.
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=30%",
            pin: true,
            scrub: 1,
          },
        });
        pinTl.to(mascotTiltRef.current, { yPercent: -8, duration: 1, ease: "none" });
      });
    },
    { scope: sectionRef }
  );

  // Cursor parallax + subtle 3D tilt on the mascot.
  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (!mascotTiltRef.current) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;
    gsap.to(mascotTiltRef.current, {
      x: px * 36,
      y: py * 36,
      rotateY: px * 18,
      rotateX: -py * 14,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  const handlePointerLeave = () => {
    if (!mascotTiltRef.current) return;
    gsap.to(mascotTiltRef.current, {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      className="relative flex min-h-screen items-center overflow-hidden px-5 pt-32 pb-20 sm:px-8 sm:pt-36"
    >
      <div
        ref={contentRef}
        className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[52fr_48fr] lg:gap-6"
      >
        {/* Left — content */}
        <div className="text-center lg:text-left">
          {/* Brand eyebrow — literal wordmark, identical across all locales (NOT
              routed through next-intl). The `hero.badge` i18n key is intentionally
              left in place but no longer rendered here. */}
          <div className="hero-badge border-primary/40 bg-primary/10 text-accent inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.14em] uppercase shadow-[0_0_24px_-6px_rgba(148,30,254,0.6)]">
            <SparklesIcon className="h-3.5 w-3.5" />
            WAY OF TRADING
          </div>

          <h1
            className="mt-7 font-extrabold tracking-tight text-[clamp(42px,5.5vw,80px)] leading-[1.05]"
            style={{ opacity: 1, filter: "none" }}
          >
            <span className="text-gradient block">{t("line1")}</span>
            <span className="text-gradient-purple block">{t("line2")}</span>
            <span className="text-gradient block">{t("line3")}</span>
          </h1>

          <p className="hero-sub text-text-muted mx-auto mt-7 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
            {t("subheadline")}
          </p>

          <div
            id="download"
            className="hero-cta mt-9 flex scroll-mt-28 justify-center lg:justify-start"
          >
            <StoreButtons />
          </div>

          {/* Hero stats strip */}
          <dl className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4 lg:mx-0">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.labelKey}
                className="hero-stat rounded-xl border border-[#B86BFF]/[0.18] bg-[#941EFE]/[0.06] px-3 py-3 text-center"
              >
                <dd className="text-gradient-purple text-2xl font-bold tracking-tight">
                  {stat.labelKey === "statTerms" ? `+${count}` : stat.value}
                </dd>
                {/* text-[0.55rem] + tighter tracking keeps long single-word
                    labels (e.g. FONCTIONNALITÉS / FUNCIONALIDADES) on one line in
                    the narrow 4-col card; break-words + leading-tight is a tidy
                    wrap fallback so nothing can overflow at any width. */}
                <dt className="text-text-muted mt-1 font-mono text-[0.55rem] leading-tight tracking-[0.08em] break-words uppercase">
                  {t(stat.labelKey)}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        {/* Right — mascot stage (beam + rings + orbiting cards) */}
        <div
          className="relative mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center sm:max-w-md lg:max-w-none"
          style={{ perspective: 800 }}
        >
          {/* Spinning conic-gradient beam */}
          <div
            aria-hidden="true"
            className="animate-beam pointer-events-none absolute h-[900px] w-[900px] rounded-full opacity-55 blur-[50px]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, rgba(148,30,254,0.55) 60deg, transparent 140deg, transparent 220deg, rgba(179,102,255,0.4) 290deg, transparent 360deg)",
            }}
          />

          {/* Concentric rotating rings, each with a glowing dot */}
          {RINGS.map((ring) => (
            <div
              key={ring.size}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full border border-[#B86BFF]/20"
              style={{
                width: ring.size,
                height: ring.size,
                animation: `rotate360 ${ring.duration} linear infinite${ring.reverse ? " reverse" : ""}`,
              }}
            >
              <span
                className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
                style={{ boxShadow: "0 0 14px 3px rgba(179,102,255,0.8)" }}
              />
            </div>
          ))}

          {/* Pulsing purple aura behind the mascot */}
          <div className="hero-aura glow-radial pointer-events-none absolute inset-[12%] rounded-full opacity-[0.18] blur-3xl" />

          {/* Ambient ephemeral ticker pills (behind robot + cards).
              Self-contained & additive — remove this line + its import to drop it. */}
          <TickerAmbience />

          {/* Mascot — tilt wrapper (cursor) wraps float wrapper (idle) */}
          <div
            ref={mascotTiltRef}
            className="relative z-10 aspect-square w-[78%]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div ref={mascotFloatRef} className="relative h-full w-full">
              <Image
                src="/images/mascot/mascot-original.png"
                alt="Rudy, the WOT AI trading coach robot"
                fill
                priority
                sizes="(max-width: 768px) 70vw, 38vw"
                className="object-contain drop-shadow-[0_20px_60px_rgba(148,30,254,0.35)]"
              />
            </div>
          </div>

          {/* Orbiting glassmorphism info cards — eyebrow + two feature names */}
          {HERO_ORBIT_CARDS.map((card) => (
            <div
              key={card.titleKey}
              className={`hero-orbit glass-card absolute z-20 w-[150px] rounded-2xl p-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.7)] ${card.className}`}
              style={{ animation: `orbit-bob 8s ease-in-out infinite`, animationDelay: card.delay }}
            >
              <div className="flex items-center gap-1.5">
                {card.live && (
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-success"
                    style={{ animation: "live-pulse 2s ease-in-out infinite" }}
                  />
                )}
                <span className="text-text font-mono text-[0.62rem] tracking-[0.14em] uppercase">
                  {t(card.titleKey)}
                </span>
              </div>
              <p className="text-accent mt-1.5 text-[0.7rem] leading-snug font-medium">
                {t(card.feature1Key)}
              </p>
              <p className="text-text-muted mt-0.5 text-[0.66rem] leading-snug">
                {t(card.feature2Key)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll-to-explore cue */}
      <div className="hero-scroll-cue absolute inset-x-0 bottom-7 hidden flex-col items-center gap-2 lg:flex">
        <span className="text-text-muted font-mono text-[0.62rem] tracking-[0.3em] uppercase">
          {t("scrollHint")}
        </span>
        <ChevronDownIcon className="animate-chevron text-accent h-5 w-5" />
      </div>
    </section>
  );
};
