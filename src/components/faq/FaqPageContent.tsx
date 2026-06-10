"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { cn } from "@/lib/utils";

interface FaqCategory {
  id: string;
  label: string;
}

interface FaqQuestion {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface FaqPageContentProps {
  categories: FaqCategory[];
  questions: FaqQuestion[];
}

const ALL = "all";

/*
 * Client island for the FAQ page: category pills + single-open accordions.
 * All copy is passed in from faq.json (localized server-side) — only the
 * page heading and the "All" pill come from the next-intl `faqPage` namespace.
 */
export const FaqPageContent = ({ categories, questions }: FaqPageContentProps) => {
  const t = useTranslations("faqPage");
  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [openId, setOpenId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const visible =
    activeCategory === ALL
      ? questions
      : questions.filter((q) => q.category === activeCategory);

  // Heading + pills entrance.
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".faq-head", {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
        });
      });
    },
    { scope: sectionRef }
  );

  // Stagger entrance + crossfade whenever the visible set changes (initial
  // mount and every category switch).
  useGSAP(
    () => {
      gsap.fromTo(
        ".faq-q",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 }
      );
    },
    { dependencies: [activeCategory], scope: listRef }
  );

  const pills = [{ id: ALL, label: t("allCategories") }, ...categories];

  return (
    <section ref={sectionRef} className="relative px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-3xl">
        <div className="faq-head text-center">
          <span className="text-accent font-mono text-xs tracking-[0.3em] uppercase">
            {t("eyebrow")}
          </span>
          <h1 className="text-text mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Category pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {pills.map((pill) => {
            const isActive = activeCategory === pill.id;
            return (
              <button
                key={pill.id}
                type="button"
                onClick={() => {
                  setActiveCategory(pill.id);
                  setOpenId(null);
                }}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-white shadow-[0_0_20px_-4px_rgba(148,30,254,0.7)]"
                    : "border border-white/10 text-text-muted hover:border-primary/50 hover:text-text"
                )}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Accordions */}
        <div ref={listRef} className="mt-12 border-t border-white/[0.06]">
          {visible.map((q) => (
            <AccordionItem
              key={q.id}
              className="faq-q"
              title={q.question}
              body={q.answer}
              isOpen={openId === q.id}
              onToggle={() => setOpenId(openId === q.id ? null : q.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
