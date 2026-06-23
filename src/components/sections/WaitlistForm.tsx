"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-text placeholder:text-text-muted/60 transition-colors duration-200 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

/*
 * Pre-launch email capture for the countdown page. Collects interested visitors
 * in exchange for a launch perk (WOT coins + first-subscription discount).
 *
 *  - POSTs { email, locale, consent, source: "launch_page" } to the n8n webhook
 *    at NEXT_PUBLIC_WAITLIST_WEBHOOK_URL (set by Dov on Vercel).
 *  - Submit stays disabled until the email is valid AND consent is checked, and
 *    while a request is in flight (guards double submission).
 *  - Honeypot field "company" (visually hidden) traps bots: if filled, we no-op
 *    as success and send nothing — same pattern as the contact form.
 *  - GDPR: the consent box is never pre-checked; no email leaves the page unless
 *    the visitor ticks it.
 *  - On a genuine 2xx the form is replaced by an on-brand success state.
 */
export const WaitlistForm = () => {
  const t = useTranslations("launch.waitlist");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const webhookUrl = process.env.NEXT_PUBLIC_WAITLIST_WEBHOOK_URL;

  const isValid = EMAIL_RE.test(email.trim()) && consent;
  const isSubmitting = status === "submitting";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never see/fill this. Pretend success, send nothing.
    if ((data.get("company") as string)?.trim()) {
      setStatus("success");
      return;
    }

    if (!isValid || isSubmitting) return;

    // No webhook configured → cannot confirm capture, so surface an error rather
    // than a misleading success. In production the env var is always set.
    if (!webhookUrl) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          locale,
          consent,
          source: "launch_page",
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const cardBase =
    "mx-auto mt-12 w-full max-w-md rounded-2xl border border-border bg-[#151520]/70 p-6 text-left backdrop-blur-sm sm:p-8";

  if (status === "success") {
    return (
      <div className={cn(cardBase, "text-center")}>
        <motion.svg
          aria-hidden="true"
          viewBox="0 0 52 52"
          className="mx-auto h-14 w-14"
          style={{ filter: "drop-shadow(0 0 10px rgba(34,197,94,0.35))" }}
        >
          <motion.circle
            cx="26"
            cy="26"
            r="23"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2.5"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
          />
          <motion.path
            d="M16 27 L23 34 L37 19"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: reduce ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { delay: 0.35, duration: 0.35, ease: "easeOut" }}
          />
        </motion.svg>
        <p
          role="status"
          aria-live="polite"
          className="text-text mx-auto mt-5 max-w-sm text-base leading-relaxed font-medium text-balance"
        >
          {t("success")}
        </p>
      </div>
    );
  }

  return (
    <div className={cardBase}>
      <h2 className="text-text text-xl font-bold tracking-tight sm:text-2xl">{t("headline")}</h2>
      <p className="text-text-muted mt-2 text-sm leading-relaxed">{t("subtext")}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            aria-label={t("emailPlaceholder")}
            placeholder={t("emailPlaceholder")}
            className={cn(fieldBase, "sm:flex-1")}
          />
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#941EFE,#5B0FA8)] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(148,30,254,0.45)] transition-all duration-200 hover:shadow-[0_0_44px_rgba(148,30,254,0.65)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:brightness-100"
          >
            {isSubmitting ? t("submitting") : t("button")}
          </button>
        </div>

        <label className="text-text-muted flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="accent-primary mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border"
          />
          <span>{t("consent")}</span>
        </label>

        {/* Honeypot — visually hidden, off the tab order, ignored by humans. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="waitlist-company">Company</label>
          <input
            id="waitlist-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p
          aria-live="polite"
          role="status"
          className={cn("min-h-5 text-sm", status === "error" && "text-error")}
        >
          {status === "error" ? t("error") : ""}
        </p>
      </form>
    </div>
  );
};
