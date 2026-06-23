"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import { COOKIE_CONSENT_KEY } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ConsentChoice = "accepted" | "rejected";

interface StoredConsent {
  value: ConsentChoice;
  timestamp: string;
}

interface CookieConsentProps {
  /** GA4 Measurement ID, injected from NEXT_PUBLIC_GA_ID. */
  gaId?: string;
}

/** The custom event the footer link uses to re-open the banner. */
const REOPEN_EVENT = "wot:open-cookie-consent";

const readConsent = (): ConsentChoice | null => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (parsed.value === "accepted" || parsed.value === "rejected") return parsed.value;
  } catch {
    // Tolerate an older plain-string value if the format ever changes.
    if (raw === "accepted" || raw === "rejected") return raw;
  }
  return null;
};

const baseButton =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

/*
 * GDPR-compliant analytics gate. On first visit nothing is tracked and the
 * banner is shown. GoogleAnalytics is rendered ONLY when the stored choice is
 * "accepted" — a rejection never loads GA and never shows the banner again.
 *
 * Server and first client render output nothing (state starts null/false), so
 * there is no hydration mismatch; the banner mounts after the localStorage read.
 */
export const CookieConsent = ({ gaId }: CookieConsentProps) => {
  const t = useTranslations("cookieConsent");
  const [consent, setConsent] = useState<ConsentChoice | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const choice = readConsent();
    setConsent(choice);
    setShowBanner(choice === null);
  }, []);

  useEffect(() => {
    const reopen = () => {
      setConsent(null);
      setShowBanner(true);
    };
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  const persist = (value: ConsentChoice) => {
    if (typeof window !== "undefined") {
      const payload: StoredConsent = { value, timestamp: new Date().toISOString() };
      window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
    }
    setConsent(value);
    setShowBanner(false);
  };

  return (
    <>
      {gaId && consent === "accepted" && <GoogleAnalytics gaId={gaId} />}

      {showBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label={t("ariaLabel")}
          className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
        >
          <div className="border-border mx-auto flex max-w-7xl flex-col gap-4 rounded-2xl border bg-[#0A0A0F]/95 p-5 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-text-muted text-sm leading-relaxed">
              {t("text")}{" "}
              <Link
                href="/cookies"
                className="text-primary hover:text-accent underline underline-offset-2 transition-colors duration-200"
              >
                {t("learnMore")}
              </Link>
            </p>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => persist("rejected")}
                className={cn(
                  baseButton,
                  "border-border bg-surface/60 text-text hover:border-primary/60 hover:bg-surface border"
                )}
              >
                {t("refuse")}
              </button>
              <button
                type="button"
                onClick={() => persist("accepted")}
                className={cn(
                  baseButton,
                  "bg-[linear-gradient(135deg,#941EFE,#5B0FA8)] text-white shadow-[0_0_30px_rgba(148,30,254,0.5)] hover:shadow-[0_0_44px_rgba(148,30,254,0.7)] hover:brightness-110"
                )}
              >
                {t("accept")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
