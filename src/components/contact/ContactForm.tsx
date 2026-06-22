"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { CONTACT_EMAIL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const fieldBase =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-text placeholder:text-text-muted/60 transition-colors duration-200 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const labelBase = "text-sm font-medium text-text";

/*
 * Contact form with zero external config required.
 *  - If NEXT_PUBLIC_CONTACT_WEBHOOK_URL is set, the payload is POSTed there.
 *  - Otherwise it falls back to a prefilled mailto: so the page is never dead.
 * A hidden honeypot field ("company") traps bots: if filled, we no-op as success.
 * Success/error states are surfaced via an aria-live region.
 */
export const ContactForm = () => {
  const t = useTranslations("contactPage");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState<string>("");

  const webhookUrl = process.env.NEXT_PUBLIC_CONTACT_WEBHOOK_URL;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never see/fill this. Pretend success, send nothing.
    if ((data.get("company") as string)?.trim()) {
      setStatus("success");
      setFeedback(t("success"));
      form.reset();
      return;
    }

    const payload = {
      name: (data.get("name") as string)?.trim() ?? "",
      email: (data.get("email") as string)?.trim() ?? "",
      subject: (data.get("subject") as string)?.trim() ?? "",
      message: (data.get("message") as string)?.trim() ?? "",
    };

    // No webhook configured → graceful mailto: fallback.
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

      setStatus("success");
      setFeedback(t("success"));
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(t("error"));
    }
  };

  const isSubmitting = status === "submitting";

  return (
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

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-1 w-full sm:w-auto sm:self-start"
      >
        {isSubmitting ? t("submitting") : t("submit")}
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
};
