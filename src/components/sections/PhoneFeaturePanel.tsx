"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { cn } from "@/lib/utils";

interface PhoneFeaturePanelProps {
  labelKey: string;
  titleKey: string;
  descKey: string;
  image: string;
  video?: string;
  index: number;
  reversed?: boolean;
  priority?: boolean;
}

/*
 * One cinematic, GSAP-pinned feature panel. While the panel is pinned the phone
 * is scrubbed through a 3D arc — rotating in from off-screen, resting at center,
 * then banking out — with a ground shadow that tracks its scale. The copy reveals
 * in sequence (badge from the side, title via clip-path wipe, accent line draw,
 * description fade) the first time the panel enters, independent of the scrub.
 * Everything is gated behind prefers-reduced-motion via gsap.matchMedia.
 */
export const PhoneFeaturePanel = ({
  labelKey,
  titleKey,
  descKey,
  image,
  video,
  index,
  reversed = false,
  priority = false,
}: PhoneFeaturePanelProps) => {
  const t = useTranslations("phone");

  const trackRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Enter from the phone's own side, bank out toward the opposite side.
      const enterRotateY = reversed ? -25 : 25;
      const exitRotateY = reversed ? 24 : -24;
      const exitX = reversed ? 200 : -200;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Scrubbed 3D choreography, pinned for the length of the panel.
        const scrub = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=60%",
            pin: true,
            scrub: 0.5,
          },
        });

        scrub
          // 1. Rotate/scale in from off-screen depth.
          .fromTo(
            phoneRef.current,
            { rotateY: enterRotateY, rotateX: 5, z: -120, scale: 0.85, autoAlpha: 0 },
            { rotateY: 0, rotateX: 0, z: 0, scale: 1, autoAlpha: 1, ease: "power2.out", duration: 1 }
          )
          .fromTo(
            shadowRef.current,
            { scaleX: 0.45, autoAlpha: 0 },
            { scaleX: 1, autoAlpha: 0.6, ease: "power2.out", duration: 1 },
            0
          )
          // 2. Hold at rest through the middle of the scroll.
          .to({}, { duration: 0.5 })
          // 3. Bank out and fade toward the opposite edge.
          .to(
            phoneRef.current,
            { rotateY: exitRotateY, x: exitX, scale: 0.92, autoAlpha: 0, ease: "power2.in", duration: 1 }
          )
          .to(
            shadowRef.current,
            { scaleX: 0.4, autoAlpha: 0, ease: "power2.in", duration: 1 },
            "<"
          );

        // One-shot copy reveal, sequenced, replays if scrolled back past.
        const reveal = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        reveal
          .from(".panel-badge", { x: reversed ? 40 : -40, autoAlpha: 0, duration: 0.6 })
          .from(
            ".panel-title",
            { clipPath: "inset(0 100% 0 0)", autoAlpha: 0, duration: 0.7 },
            "-=0.3"
          )
          .from(".panel-line", { scaleX: 0, duration: 0.7 }, "-=0.4")
          .from(".panel-desc", { y: 24, autoAlpha: 0, duration: 0.6 }, "-=0.3");
      });
    },
    { scope: trackRef }
  );

  return (
    <section ref={trackRef} className="relative">
      <div ref={pinRef} className="flex min-h-screen items-center overflow-hidden">
        {/* Per-panel ambient glow shifts to the phone's side for depth */}
        <div
          className={cn(
            "glow-radial pointer-events-none absolute top-1/2 h-[80vh] w-[80vh] -translate-y-1/2 blur-3xl",
            reversed ? "right-[-20%]" : "left-[-20%]"
          )}
        />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          {/* Phone — 3D rotate-in driven by the scrub timeline */}
          <div
            className={cn("relative flex justify-center", reversed && "lg:order-2")}
            style={{ perspective: 1200 }}
          >
            <div ref={phoneRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
              <PhoneFrame src={image} alt={t(titleKey)} video={video} priority={priority} />
            </div>

            {/* Ground shadow that grows/shrinks with the phone */}
            <div
              ref={shadowRef}
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-56 -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl"
            />
          </div>

          {/* Text — sequenced entrance */}
          <div ref={textRef} className={cn("text-center lg:text-left", reversed && "lg:order-1")}>
            <span className="panel-badge text-text-muted inline-flex items-center gap-2 font-mono text-xs tracking-[0.18em] uppercase">
              <span className="text-primary font-semibold">0{index + 1}</span>
              <span className="text-primary/40">/</span>
              {t(labelKey)}
            </span>

            <h3 className="panel-title text-gradient-accent mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t(titleKey)}
            </h3>

            <div className="panel-line from-primary mx-auto mt-5 h-px w-24 origin-left bg-gradient-to-r to-transparent lg:mx-0" />

            <p className="panel-desc text-text-muted mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg lg:mx-0">
              {t(descKey)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
