"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/* Official launch — 15 Aug 2026, 00:00 Europe/Paris (CEST, UTC+2). */
const LAUNCH_DATE = new Date("2026-08-15T00:00:00+02:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

/* Segment order is fixed; each key also maps to its `launch` i18n label. */
const SEGMENT_KEYS = ["days", "hours", "minutes", "seconds"] as const;

const computeTimeLeft = (): TimeLeft => {
  const total = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor(total / (1000 * 60 * 60)) % 24,
    minutes: Math.floor(total / (1000 * 60)) % 60,
    seconds: Math.floor(total / 1000) % 60,
    total,
  };
};

/*
 * Live launch countdown. The remaining time is intentionally never computed
 * during SSR — `mounted` stays false on the server and the first client render,
 * so both emit the same placeholder ("--") segments and there is no hydration
 * mismatch. Once mounted, a 1s interval ticks the real values; it is cleared on
 * unmount. When the target passes, the timer is replaced by the "live" message.
 */
export const LaunchCountdown = () => {
  const t = useTranslations("launch");
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(computeTimeLeft());
    const id = setInterval(() => setTimeLeft(computeTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Gentle fade-up on mount (above the fold, so it plays directly — no
  // ScrollTrigger that could leave content stuck invisible).
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".lc-seg", {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
        });
      });
    },
    { scope: rootRef }
  );

  // Target reached — swap the timer for the live message + placeholder.
  if (mounted && timeLeft && timeLeft.total <= 0) {
    return (
      <div ref={rootRef} className="flex flex-col items-center gap-3">
        <p className="lc-seg text-shimmer text-3xl font-bold tracking-tight sm:text-4xl">
          {t("live")}
        </p>
        <p className="lc-seg max-w-md text-sm text-white/60">{t("livePlaceholder")}</p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4"
    >
      {SEGMENT_KEYS.map((key) => {
        const value = mounted && timeLeft ? timeLeft[key] : null;
        return (
          <div
            key={key}
            className="lc-seg flex flex-col items-center justify-center rounded-2xl border border-primary/25 bg-white/5 px-2 py-5 backdrop-blur-sm sm:py-6"
          >
            <span className="text-primary font-bold leading-none tabular-nums text-[clamp(2rem,8vw,3.25rem)]">
              {value === null ? "--" : String(value).padStart(2, "0")}
            </span>
            <span className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.18em] text-white/60 sm:text-xs">
              {t(key)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
