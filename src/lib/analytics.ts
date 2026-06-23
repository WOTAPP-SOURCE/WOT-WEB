import { COOKIE_CONSENT_KEY } from "@/lib/constants";

/*
 * GA4 event helper. Single entry point for every custom analytics event on the
 * site. It is GDPR-gated and fully silent: it tracks ONLY when the visitor has
 * explicitly accepted analytics cookies AND gtag.js is loaded. If consent is not
 * granted (or GA never loaded), every call is a harmless no-op — no errors, no
 * cookies, no network. Always guarded with `typeof window !== "undefined"` so it
 * is safe to import/call from any component, including during SSR.
 *
 * The consent gate mirrors the logic in CookieConsent: GoogleAnalytics is only
 * mounted once the stored choice is "accepted", so checking both the stored
 * choice and the presence of window.gtag is belt-and-braces.
 */

const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") return false;

  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as { value?: string };
    return parsed.value === "accepted";
  } catch {
    // Tolerate an older plain-string value if the stored format ever changes.
    return raw === "accepted";
  }
};

export const trackEvent = (eventName: string, params?: Record<string, unknown>): void => {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params ?? {});
};
