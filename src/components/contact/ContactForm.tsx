"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Script from "next/script";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ContactSuccess } from "@/components/contact/ContactSuccess";
import { CONTACT_EMAIL } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-text placeholder:text-text-muted/60 transition-colors duration-200 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const labelBase = "text-sm font-medium text-text";

// Shared card surface — applied to BOTH flip faces so they are pixel-identical
// in size/style and the flip stays perfectly within bounds.
const cardSurface = "border-border bg-surface/40 rounded-2xl border p-6 backdrop-blur-sm sm:p-8";
const backfaceHidden = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" } as const;

/*
 * Contact form with zero external config required.
 *  - If NEXT_PUBLIC_CONTACT_WEBHOOK_URL is set, the payload is POSTed there.
 *  - Otherwise it falls back to a prefilled mailto: so the page is never dead.
 * A hidden honeypot field ("company") traps bots: if filled, we no-op as success.
 *
 * SPAM PROTECTION (defense in depth): in addition to the honeypot, a Cloudflare
 * Turnstile (managed/invisible) challenge gates the webhook path. When a site key
 * is configured (NEXT_PUBLIC_TURNSTILE_SITE_KEY) the submit button stays locked
 * ("verifying" state) until Turnstile issues a token; that token rides along in
 * the payload as `turnstileToken` and is validated SERVER-SIDE in the n8n webhook
 * (the secret key never touches the client). The widget is reset after every send
 * so each submission requires a fresh token.
 *
 * SUCCESS ANIMATION (see `sent`): the celebratory 3D flip to <ContactSuccess/>
 * fires ONLY on a genuine webhook 2xx response. The mailto fallback and the
 * honeypot path deliberately do NOT set `sent` — opening a mail client (or a bot
 * trap) is not a confirmed delivery, so they keep the plain inline text only.
 * Under prefers-reduced-motion the flip is replaced by a simple cross-fade.
 */
export const ContactForm = () => {
  const t = useTranslations("contactPage");
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");
  const [sent, setSent] = useState(false); // true ONLY after a confirmed webhook send

  const webhookUrl = process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Turnstile token + widget handle. When a site key is set, submission is gated
  // on `turnstileToken` being non-empty (the widget calls back once it solves).
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  // Render the widget exactly once. Safe to call repeatedly: it no-ops if the
  // script isn't ready, the container isn't mounted, or a widget already exists.
  const renderTurnstile = useCallback(() => {
    if (!turnstileSiteKey || turnstileWidgetIdRef.current) return;
    const container = turnstileContainerRef.current;
    if (!window.turnstile || !container) return;

    turnstileWidgetIdRef.current = window.turnstile.render(container, {
      sitekey: turnstileSiteKey,
      theme: "dark",
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [turnstileSiteKey]);

  // Covers the case where the script is already cached/loaded on (re)mount, so
  // the <Script> onLoad won't fire again.
  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  // Force a fresh challenge for the next attempt and clear the stale token.
  const resetTurnstile = useCallback(() => {
    setTurnstileToken("");
    if (window.turnstile && turnstileWidgetIdRef.current) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never see/fill this. Pretend success, send nothing.
    // No `sent` flip — nothing was actually delivered.
    if ((data.get("company") as string)?.trim()) {
      setStatus("success");
      setFeedback(t("success"));
      form.reset();
      return;
    }

    // Turnstile gate: with a site key configured the button is disabled until a
    // token exists, but guard here too in case a submit slips through.
    if (turnstileSiteKey && !turnstileToken) return;

    const payload = {
      name: (data.get("name") as string)?.trim() ?? "",
      email: (data.get("email") as string)?.trim() ?? "",
      subject: (data.get("subject") as string)?.trim() ?? "",
      message: (data.get("message") as string)?.trim() ?? "",
      turnstileToken,
    };

    // No webhook configured → graceful mailto: fallback. NOT a confirmed send,
    // so we keep the plain inline notice and do NOT trigger the success flip.
    if (!webhookUrl) {
      const body = `${payload.message}\n\n— ${payload.name} (${payload.email})`;
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        payload.subject
      )}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      setStatus("success");
      setFeedback(t("mailtoSuccess"));
      form.reset();
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      // Genuine delivery confirmed (HTTP 2xx) → play the success animation.
      form.reset();
      setFeedback("");
      setStatus("success");
      setSent(true);
      // Track only confirmed webhook deliveries — not the mailto/honeypot paths.
      trackEvent("contact_submit");
    } catch {
      setStatus("error");
      setFeedback(t("error"));
    } finally {
      // Whether it succeeded or failed, the token is single-use → reset so the
      // next attempt must solve a fresh challenge.
      resetTurnstile();
    }
  };

  const isSubmitting = status === "submitting";
  // Awaiting a Turnstile token (only when a site key is configured).
  const isVerifying = Boolean(turnstileSiteKey) && !turnstileToken;

  // Front face — the form itself. Extracted so it can be reused by both the
  // flip layout and the reduced-motion cross-fade layout.
  const formContent = (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={labelBase}>
            {t("nameLabel")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            className={fieldBase}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={labelBase}>
            {t("emailLabel")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className={fieldBase}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subject" className={labelBase}>
          {t("subjectLabel")}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          placeholder={t("subjectPlaceholder")}
          className={fieldBase}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={labelBase}>
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder={t("messagePlaceholder")}
          className={cn(fieldBase, "resize-y")}
        />
      </div>

      {/* Honeypot — visually hidden, off the tab order, ignored by humans. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Cloudflare Turnstile (managed/invisible). Renders only when a site key
          is configured; the widget container is sized via min-height to avoid
          layout shift while it mounts. The secret key lives server-side only. */}
      {turnstileSiteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="lazyOnload"
            onLoad={renderTurnstile}
          />
          <div ref={turnstileContainerRef} className="min-h-[65px]" />
        </>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || isVerifying}
        className="mt-1 w-full sm:w-auto sm:self-start"
      >
        {isSubmitting ? t("submitting") : isVerifying ? t("verifying") : t("submit")}
      </Button>

      <p
        aria-live="polite"
        role="status"
        className={cn(
          "min-h-5 text-sm",
          status === "success" && "text-success",
          status === "error" && "text-error"
        )}
      >
        {feedback}
      </p>
    </form>
  );

  // Reduced motion: skip the 3D flip/rocket — just cross-fade to the checkmark
  // + message (the check renders statically inside <ContactSuccess/>).
  if (reduce) {
    return (
      <div className={cardSurface}>
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ContactSuccess message={t("successCardMessage")} />
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0 }}>
              {formContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Default: 3D flip. The flipping element is `relative` so the front face
  // (in normal flow) defines the height; the back face is `absolute inset-0`,
  // guaranteeing both faces share the exact same box. rotateY foreshortens the
  // card horizontally mid-flip (never wider), so it can't cause overflow.
  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: sent ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* FRONT — form */}
        <div className={cardSurface} style={backfaceHidden} aria-hidden={sent}>
          {formContent}
        </div>

        {/* BACK — success state (mounted only when sent, so its animation
            begins as the flip reveals it). */}
        <div
          className={cn(cardSurface, "absolute inset-0 flex items-center justify-center")}
          style={{ ...backfaceHidden, transform: "rotateY(180deg)" }}
          aria-hidden={!sent}
        >
          {sent && <ContactSuccess message={t("successCardMessage")} />}
        </div>
      </motion.div>
    </div>
  );
};
