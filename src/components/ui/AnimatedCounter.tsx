"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationSeconds?: number;
}

/*
 * Count-up driven by GSAP: a proxy object tweens 0 → value with snap so the
 * rendered number only ever shows integers, written straight to textContent to
 * avoid a React re-render per frame. The purple text-shadow intensifies with
 * progress so the figure "charges up" as it reaches its target. Fires once on
 * scroll into view; under reduced-motion the final value is set immediately.
 */
export const AnimatedCounter = ({
  value,
  prefix = "",
  suffix = "",
  durationSeconds = 2,
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const locale = useLocale();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const render = (n: number) => `${prefix}${Math.floor(n).toLocaleString(locale)}${suffix}`;
      const setGlow = (p: number) => {
        el.style.textShadow = `0 0 ${20 + p * 30}px rgba(148, 30, 254, ${0.2 + p * 0.45})`;
      };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.textContent = render(value);
        setGlow(1);
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const proxy = { val: 0 };
        el.textContent = render(0);

        gsap.to(proxy, {
          val: value,
          duration: durationSeconds,
          ease: "power2.out",
          snap: { val: 1 },
          onUpdate: () => {
            el.textContent = render(proxy.val);
            setGlow(value === 0 ? 1 : proxy.val / value);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref}>
      {prefix}0{suffix}
    </span>
  );
};
