"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { ChevronDownIcon, SparklesIcon } from "@/components/ui/Icons";

// Split a translated string into per-character spans for the stagger reveal.
// inline-block + whitespace-pre lets each glyph transform while keeping spaces.
const splitChars = (text: string, keyPrefix: string) =>
  text.split("").map((char, i) => (
    <span key={`${keyPrefix}-${i}`} className="hero-char inline-block whitespace-pre">
      {char}
    </span>
  ));

export const HeroSection = () => {
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
          .from(".hero-char", { yPercent: 120, opacity: 0, stagger: 0.03, duration: 0.6 })
          .from(".hero-badge", { y: 20, opacity: 0, duration: 0.6 }, 0.1)
          .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.4")
          .from(
            ".hero-cta",
            { scale: 0.8, opacity: 0, duration: 0.9, ease: "elastic.out(1, 0.6)" },
            "-=0.4"
          )
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

        // 4. Pin the hero for an extra 50vh, drifting content out as it releases.
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=50%",
            pin: true,
            scrub: 1,
          },
        });
        pinTl
          .to(contentRef.current, { yPercent: -14, opacity: 0.25, ease: "none" }, 0)
          .to(mascotTiltRef.current, { yPercent: -10, ease: "none" }, 0);
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
        className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-[55fr_45fr] lg:gap-6"
      >
        {/* Left — content */}
        <div className="text-center lg:text-left">
          <div className="hero-badge border-primary/40 bg-primary/10 text-accent inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium shadow-[0_0_24px_-6px_rgba(148,30,254,0.6)]">
            <SparklesIcon className="h-3.5 w-3.5" />
            {t("badge")}
          </div>

          <h1 className="text-text mt-7 text-5xl leading-[1.05] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            {splitChars(t("headlineLine1"), "l1")}
            <br />
            <span className="text-gradient-purple text-glow-lg">
              {splitChars(t("headlineLine2"), "l2")}
            </span>
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
        </div>

        {/* Right — mascot (perspective parent for 3D tilt) */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none" style={{ perspective: 800 }}>
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            {/* Pulsing purple aura behind the mascot */}
            <div className="hero-aura glow-radial pointer-events-none absolute inset-[8%] -z-10 rounded-full opacity-[0.15] blur-3xl" />

            {/* Tilt wrapper (cursor) wraps float wrapper (idle) */}
            <div
              ref={mascotTiltRef}
              className="relative h-full w-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div ref={mascotFloatRef} className="relative h-full w-full">
                <Image
                  src="/images/mascot/mascot-original.png"
                  alt="Rudy, the WOT AI trading coach robot"
                  fill
                  priority
                  sizes="(max-width: 768px) 80vw, 45vw"
                  className="object-contain drop-shadow-[0_20px_60px_rgba(148,30,254,0.35)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll-to-explore cue */}
      <div className="hero-scroll-cue absolute inset-x-0 bottom-7 hidden flex-col items-center gap-2 lg:flex">
        <span className="text-text-muted text-[0.7rem] tracking-[0.3em] uppercase">
          {t("scrollHint")}
        </span>
        <ChevronDownIcon className="animate-chevron text-accent h-5 w-5" />
      </div>
    </section>
  );
};
