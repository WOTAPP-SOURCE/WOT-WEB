/*
 * Central GSAP entry point. Importing from here guarantees ScrollTrigger is
 * registered exactly once before any component creates a trigger, regardless of
 * child/parent effect ordering. The window guard keeps it inert during SSR of
 * client components (ScrollTrigger touches `window` only when triggers run).
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export { gsap, ScrollTrigger, ScrollToPlugin };
