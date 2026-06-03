"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { PlusIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection = () => {
  const t = useTranslations("faq");
  const items = t.raw("items") as FaqItem[];
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(0);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".faq-heading", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".faq-heading", start: "top 85%" },
        });
        gsap.from(".faq-item", {
          y: 24,
          autoAlpha: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".faq-list", start: "top 82%" },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="faq-heading text-center">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h2>
        </div>

        <div className="faq-list mt-12 flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className={cn(
                  "faq-item rounded-2xl border bg-surface/50 transition-colors duration-300",
                  isOpen ? "border-primary/50" : "border-border"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-text text-base font-medium sm:text-lg">{item.q}</span>
                  <PlusIcon
                    className={cn(
                      "text-accent h-5 w-5 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-45"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-text-muted px-6 pb-6 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
