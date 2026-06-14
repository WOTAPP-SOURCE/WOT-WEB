"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { PlusIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  /** Header text (question / term name). */
  title: string;
  /** Body content (answer / definition) — plain text or rich nodes. */
  body: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  /** Optional node rendered next to the title (e.g. a category badge). */
  badge?: React.ReactNode;
  /** Extra classes on the root — parents use this to target stagger entrances. */
  className?: string;
}

/*
 * Controlled accordion row reused by the FAQ page, the homepage FAQ section,
 * and the glossary browser. Open/closed state is owned by the parent so it can
 * enforce "only one open at a time". The body panel height + opacity are
 * animated with GSAP (0.3s) rather than CSS, matching the brand motion system.
 */
export const AccordionItem = ({
  title,
  body,
  isOpen,
  onToggle,
  badge,
  className,
}: AccordionItemProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      gsap.to(panel, {
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.3,
        ease: isOpen ? "power2.out" : "power2.in",
      });
    },
    { dependencies: [isOpen], scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "border-b border-white/[0.06] transition-colors duration-300",
        className
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
      >
        <span className="flex flex-wrap items-center gap-3">
          <span className="text-text text-base font-semibold sm:text-lg">{title}</span>
          {badge}
        </span>
        <PlusIcon
          className={cn(
            "text-accent h-5 w-5 shrink-0 transition-transform duration-300",
            isOpen && "rotate-45"
          )}
        />
      </button>

      <div ref={panelRef} className="h-0 overflow-hidden opacity-0">
        <p className="pb-5 text-[15px] leading-relaxed text-[#A0A0B0]">{body}</p>
      </div>
    </div>
  );
};
