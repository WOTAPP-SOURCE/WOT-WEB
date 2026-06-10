"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { AccordionItem } from "@/components/ui/AccordionItem";
import { SearchIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { CategoryColor, PreparedTerm } from "@/types/glossary";

interface GlossaryBrowserProps {
  grouped: Record<string, PreparedTerm[]>;
  letters: string[];
  categories: { key: string; label: string }[];
  categoryColors: Record<string, CategoryColor>;
}

const ALL = "all";

/** Lowercase + strip accents, so "café" matches "cafe". */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

/*
 * On-page glossary browser. The user never leaves this page: search, category
 * filter, and A–Z jump all operate in place, and every term expands inline.
 * All 339 terms stay mounted — filtering toggles CSS visibility rather than
 * unmounting — to avoid layout thrash on a large list.
 */
export const GlossaryBrowser = ({
  grouped,
  letters,
  categories,
  categoryColors,
}: GlossaryBrowserProps) => {
  const t = useTranslations("glossary");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [openByLetter, setOpenByLetter] = useState<Record<string, string | null>>({});
  const sectionRef = useRef<HTMLElement>(null);

  const count = useMemo(
    () => Object.values(grouped).reduce((n, terms) => n + terms.length, 0),
    [grouped]
  );

  const q = norm(query.trim());
  const isVisible = (term: PreparedTerm) => {
    if (activeCategory !== ALL && term.categoryKey !== activeCategory) return false;
    if (!q) return true;
    return norm(term.term).includes(q) || norm(term.definition).includes(q);
  };

  // How many terms remain visible per letter — drives letter-bar dimming and
  // hides empty letter sections.
  const visibleByLetter = letters.reduce<Record<string, number>>((acc, letter) => {
    acc[letter] = (grouped[letter] ?? []).filter(isVisible).length;
    return acc;
  }, {});
  const totalVisible = Object.values(visibleByLetter).reduce((a, b) => a + b, 0);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".glx-head", { y: 24, autoAlpha: 0, duration: 0.6, ease: "power3.out" });
      });
    },
    { scope: sectionRef }
  );

  const scrollToLetter = (letter: string) => {
    if (!visibleByLetter[letter]) return;
    const el = document.getElementById(`glx-letter-${letter}`);
    if (!el) return;
    gsap.to(window, { duration: 0.8, ease: "power2.inOut", scrollTo: { y: el, offsetY: 96 } });
  };

  const pills = [{ key: ALL, label: t("allCategories") }, ...categories];

  return (
    <section ref={sectionRef} className="relative px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-4xl">
        <div className="glx-head text-center">
          <h1 className="text-text inline-flex flex-wrap items-center justify-center gap-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("title")}
            <span className="text-gradient-purple font-mono text-2xl font-bold sm:text-3xl">
              +{count}
            </span>
          </h1>
          <p className="text-text-muted mx-auto mt-4 max-w-xl text-base leading-relaxed">
            {t("subtitle", { count })}
          </p>
        </div>

        {/* Search */}
        <div className="relative mt-10">
          <SearchIcon className="text-text-muted pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="text-text placeholder:text-text-muted w-full rounded-2xl border border-white/10 bg-surface/60 py-3.5 pr-4 pl-12 text-base outline-none transition-colors duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Category pills — horizontally scrollable */}
        <div className="no-scrollbar mt-5 flex gap-2.5 overflow-x-auto pb-1">
          {pills.map((pill) => {
            const isActive = activeCategory === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setActiveCategory(pill.key)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200",
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

        {/* A–Z letter bar */}
        <div className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-y border-white/[0.06] py-3">
          {letters.map((letter) => {
            const hasResults = visibleByLetter[letter] > 0;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => scrollToLetter(letter)}
                disabled={!hasResults}
                className={cn(
                  "h-8 w-8 shrink-0 rounded-md text-sm font-semibold transition-colors duration-200",
                  hasResults
                    ? "text-primary hover:bg-primary/10 cursor-pointer"
                    : "cursor-default text-text-muted/30"
                )}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* No results */}
        {totalVisible === 0 && (
          <p className="text-text-muted mt-16 text-center text-base">{t("noResults")}</p>
        )}

        {/* Term groups */}
        <div className="mt-8">
          {letters.map((letter) => {
            const terms = grouped[letter] ?? [];
            const hasResults = visibleByLetter[letter] > 0;
            return (
              <div
                key={letter}
                id={`glx-letter-${letter}`}
                className={cn("scroll-mt-24", !hasResults && "hidden")}
              >
                <h2 className="text-primary border-b border-white/[0.06] pb-2 font-mono text-lg font-bold">
                  {letter}
                </h2>
                <div>
                  {terms.map((term) => {
                    const color = categoryColors[term.categoryKey];
                    const badge = (
                      <span
                        className="rounded-full px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.08em] uppercase"
                        style={{
                          backgroundColor: color.bg,
                          color: color.text,
                          border: `1px solid ${color.border}`,
                        }}
                      >
                        {term.category}
                      </span>
                    );
                    return (
                      <AccordionItem
                        key={term.slug}
                        className={cn(!isVisible(term) && "hidden")}
                        title={term.term}
                        body={term.definition}
                        badge={badge}
                        isOpen={openByLetter[letter] === term.slug}
                        onToggle={() =>
                          setOpenByLetter((prev) => ({
                            ...prev,
                            [letter]: prev[letter] === term.slug ? null : term.slug,
                          }))
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
