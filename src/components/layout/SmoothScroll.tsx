"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface SmoothScrollProps {
  children: React.ReactNode;
}

/*
 * Lenis smooth-scroll driven by GSAP's ticker, so smooth scrolling and every
 * ScrollTrigger stay on a single synchronized clock (no double rAF jitter).
 *
 * - lerp 0.1 / duration 1.2 → weighty, premium glide.
 * - lenis.on("scroll", ScrollTrigger.update) keeps pinned/scrubbed timelines
 *   locked to the smoothed scroll position rather than the native one.
 * - Disabled entirely under prefers-reduced-motion: native scroll, no hijack.
 */
export const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // GSAP ticker reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
