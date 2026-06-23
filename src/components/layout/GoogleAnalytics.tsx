"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";

interface GoogleAnalyticsProps {
  gaId: string;
}

/*
 * GA4 loader. This component is rendered ONLY once the user has explicitly
 * accepted analytics cookies (see CookieConsent) — it must never be mounted
 * on first visit. The gtag.js bundle is injected with strategy="afterInteractive"
 * so it stays out of the initial/server payload.
 *
 * The inline init sends the first page_view; subsequent App Router navigations
 * are tracked manually via the pathname effect, with the very first render
 * skipped to avoid double-counting that initial view.
 */
export const GoogleAnalytics = ({ gaId }: GoogleAnalyticsProps) => {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
};
