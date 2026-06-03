"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/*
 * Atmospheric backdrop layered above the static Background blobs:
 *  1. Film-grain noise (mix-blend overlay, ~3%).
 *  2. 20 purple particles drifting upward on randomized CSS loops.
 *  3. 3 large blurred gradient orbs that parallax-shift on scroll (GSAP).
 * Purely decorative, fixed, pointer-events-none. Particles use a deterministic
 * pseudo-random so server and client markup match (no hydration mismatch).
 */

const PARTICLE_COUNT = 20;

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  size: 3 + rand(i) * 2, // 3–5px
  left: rand(i + 100) * 100, // 0–100vw
  opacity: 0.15 + rand(i + 200) * 0.1, // 0.15–0.25
  duration: 20 + rand(i + 300) * 20, // 20–40s
  delay: -rand(i + 400) * 40, // mid-flight on first paint
  drift: `${(rand(i + 500) - 0.5) * 140}px`, // horizontal sway
}));

const ORBS = [
  { className: "left-[-10%] top-[8%]", size: 520, depth: 22 },
  { className: "right-[-12%] top-[42%]", size: 600, depth: -28 },
  { className: "left-[15%] top-[78%]", size: 440, depth: 18 },
];

export const BackgroundEffects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const orbs = gsap.utils.toArray<HTMLElement>("[data-orb]");
        orbs.forEach((orb) => {
          gsap.to(orb, {
            yPercent: Number(orb.dataset.depth),
            ease: "none",
            scrollTrigger: {
              trigger: document.documentElement,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.2,
            },
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Gradient orbs (parallax on scroll) */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          data-orb
          data-depth={orb.depth}
          className={`absolute rounded-full blur-[120px] ${orb.className}`}
          style={{
            width: orb.size,
            height: orb.size,
            background:
              "radial-gradient(circle, rgba(148,30,254,0.08), transparent 70%)",
          }}
        />
      ))}

      {/* Purple grid overlay, masked to fade at the edges */}
      <div className="bg-grid-overlay absolute inset-0" />

      {/* Twinkling starfield */}
      <div className="bg-stars animate-twinkle absolute inset-0" />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-5vh] rounded-full bg-primary"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}vw`,
            opacity: p.opacity,
            ["--drift" as string]: p.drift,
            animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Film-grain noise overlay */}
      <div className="bg-noise absolute inset-0 opacity-[0.03] mix-blend-overlay" />
    </div>
  );
};
