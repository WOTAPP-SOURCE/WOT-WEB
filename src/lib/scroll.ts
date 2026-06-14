import { gsap } from "@/lib/gsap";

/** Fixed-header clearance kept above a section's top. */
const HEADER_OFFSET = 96;
/** Breathing room left below a section's bottom when bottom-aligning. */
const BOTTOM_MARGIN = 24;

/*
 * Smooth-scroll the window to a section by id, using the same GSAP ScrollToPlugin
 * tween as the glossary letter-jump (GlossaryBrowser). Returns false if the target
 * isn't in the DOM yet (caller may retry).
 *
 * We vertically CENTER the section in the viewport, then clamp so we never scroll
 * past the section's bottom and never cut the section's top harder than the fixed
 * header clearance. This keeps tall blocks (e.g. pricing: title + cards + footnote)
 * comfortably framed rather than landing on the top or bottom edge.
 */
export const scrollToId = (id: string): boolean => {
  const el = document.getElementById(id);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const sectionTop = rect.top + window.scrollY;
  const sectionCenter = sectionTop + rect.height / 2;

  let y = sectionCenter - window.innerHeight / 2;
  // Don't scroll below the section (keep its bottom + a small margin in view).
  y = Math.max(0, Math.min(y, sectionTop + rect.height - window.innerHeight + BOTTOM_MARGIN));
  // Keep header clearance — don't cut the section top too hard.
  y = Math.max(y, sectionTop - HEADER_OFFSET);

  gsap.to(window, {
    duration: 0.8,
    ease: "power2.inOut",
    scrollTo: { y, offsetY: 0 },
  });
  return true;
};
