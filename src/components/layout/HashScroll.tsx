"use client";

import { useEffect } from "react";
import { scrollToId } from "@/lib/scroll";

/*
 * On mount, if the URL carries a `#section` hash, smooth-scroll to it. Used on the
 * home page so that arriving from another route (e.g. the header "Tarifs" link on
 * /faq) lands on the right section. Retries briefly because below-the-fold sections
 * are code-split and may mount a tick after the page.
 */
export const HashScroll = () => {
  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;

    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    const attempt = () => {
      if (scrollToId(id)) return;
      if (tries++ < 12) timer = setTimeout(attempt, 60);
    };

    const raf = requestAnimationFrame(attempt);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, []);

  return null;
};
