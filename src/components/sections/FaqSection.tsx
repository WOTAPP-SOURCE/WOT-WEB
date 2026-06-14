"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Link } from "@/i18n/navigation";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { FaqAnswerText } from "@/components/faq/FaqAnswerText";
import { ArrowRightIcon } from "@/components/ui/Icons";
import type { FaqQuestion } from "@/lib/faq";

interface FaqSectionProps {
  /** Featured questions from faq.json (localized server-side). */
  questions: FaqQuestion[];
}

export const FaqSection = ({ questions }: FaqSectionProps) => {
  const t = useTranslations("faq");
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string | null>(questions[0]?.id ?? null);

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

        <div className="faq-list mt-12 border-t border-white/[0.06]">
          {questions.map((q) => (
            <AccordionItem
              key={q.id}
              className="faq-item"
              title={q.question}
              body={<FaqAnswerText answer={q.answer} />}
              isOpen={openId === q.id}
              onToggle={() => setOpenId(openId === q.id ? null : q.id)}
            />
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href="/faq"
            className="border-primary text-primary hover:bg-primary inline-flex items-center gap-2 rounded-full border px-7 py-3 text-base font-medium transition-all duration-200 hover:text-white"
          >
            {t("learnMore")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
