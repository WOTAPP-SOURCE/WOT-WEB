"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpIcon } from "@/components/ui/Icons";

/*
 * Fixed bottom-right "back to top" button. Fades in only after the user has
 * scrolled past 500px and smooth-scrolls to the top on click. Uses the native
 * smooth scroll — Lenis (when active) tracks the resulting scroll position via
 * its own scroll listener, and falls back to native smooth under reduced motion.
 */
export const ScrollToTop = () => {
  const t = useTranslations("nav");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t("scrollToTop")}
      className={`bg-primary fixed right-8 bottom-8 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_0_24px_-2px_rgba(148,30,254,0.7)] transition-all duration-300 hover:scale-110 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
};
