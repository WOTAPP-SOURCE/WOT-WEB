"use client";

import { useTranslations } from "next-intl";
import { StoreButtons } from "@/components/ui/StoreButtons";
import { cn } from "@/lib/utils";

interface DownloadCtaProps {
  className?: string;
}

/*
 * Shared download block: the two app-store badges plus the "free download" tagline.
 * Rendered by the homepage closing CTA (CTASection) and at the bottom of the About
 * page, so both show the identical block from a single source (no duplicated markup).
 */
export const DownloadCta = ({ className }: DownloadCtaProps) => {
  const t = useTranslations("cta");

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <StoreButtons />
      <p className="text-text-muted mt-7 font-mono text-[0.62rem] tracking-[0.18em] uppercase">
        {t("trustNote")}
      </p>
    </div>
  );
};
