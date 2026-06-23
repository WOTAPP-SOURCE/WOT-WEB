"use client";

import { useTranslations } from "next-intl";

interface CookieSettingsButtonProps {
  className?: string;
}

const CONSENT_KEY = "wot-cookie-consent";
const REOPEN_EVENT = "wot:open-cookie-consent";

/*
 * Footer link that lets visitors revisit their cookie choice: it clears the
 * stored consent and dispatches an event CookieConsent listens for to re-show
 * the banner.
 */
export const CookieSettingsButton = ({ className }: CookieSettingsButtonProps) => {
  const t = useTranslations("cookieConsent");

  const reopen = () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(CONSENT_KEY);
    window.dispatchEvent(new Event(REOPEN_EVENT));
  };

  return (
    <button type="button" onClick={reopen} className={className}>
      {t("manage")}
    </button>
  );
};
