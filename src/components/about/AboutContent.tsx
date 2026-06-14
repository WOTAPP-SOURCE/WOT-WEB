"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { DownloadCta } from "@/components/ui/DownloadCta";
import type { AboutContentData } from "@/lib/about";

interface AboutContentProps {
  data: AboutContentData;
}

/*
 * About page body. Pure typography, generous whitespace — no cards, no rules.
 * Tagline scales in on load, each section reveals on scroll, the closing quote
 * fades in last. All copy comes from src/data/about.json (localized server-side).
 */
export const AboutContent = ({ data }: AboutContentProps) => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".about-tagline", {
          autoAlpha: 0,
          scale: 0.95,
          duration: 0.9,
          ease: "power3.out",
        });

        gsap.utils.toArray<HTMLElement>(".about-section").forEach((section) => {
          gsap.from(section, {
            autoAlpha: 0,
            y: 30,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 85%" },
          });
        });

        gsap.from(".about-closing", {
          autoAlpha: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".about-closing", start: "top 88%" },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative px-5 pt-36 pb-28 sm:px-8 sm:pt-44">
      <div className="mx-auto max-w-[800px]">
        <h1 className="about-tagline text-primary text-center text-[28px] font-bold leading-tight tracking-tight sm:text-[40px] lg:text-[48px]">
          {data.tagline}
        </h1>
      </div>

      <div className="mx-auto mt-16 max-w-[720px]">
        {data.sections.map((section) => (
          <div key={section.id} className="about-section mt-14 first:mt-0">
            {section.title && (
              <h2 className="text-text mb-5 text-center text-[24px] font-semibold tracking-tight sm:text-[28px]">
                {section.title}
              </h2>
            )}
            {section.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className="mx-auto mt-5 max-w-[720px] text-center text-[17px] leading-[1.7] text-[#C0C0C8] first:mt-0 sm:text-[18px]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-20 max-w-[720px]">
        <p className="about-closing text-primary text-center text-[18px] font-bold italic sm:text-[20px]">
          {data.closing}
        </p>
      </div>

      {/* Download CTA — same dual app-store-badges + free-download tagline block as the homepage. */}
      <DownloadCta className="mt-16 sm:mt-20" />
    </section>
  );
};
