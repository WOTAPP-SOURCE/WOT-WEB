import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants";
import { AppleIcon, GooglePlayIcon } from "@/components/ui/Icons";

interface StoreButtonsProps {
  className?: string;
}

const buttonBase =
  "group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-left backdrop-blur-sm transition-all duration-200 hover:border-primary/60 hover:bg-white/[0.07] hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

export const StoreButtons = ({ className }: StoreButtonsProps) => {
  const t = useTranslations("store");

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <a
        href={APP_STORE_URL}
        aria-label={`${t("appStoreLine1")} ${t("appStoreLine2")}`}
        className={buttonBase}
      >
        <AppleIcon className="h-7 w-7 shrink-0 text-text" />
        <span className="flex flex-col leading-tight">
          <span className="text-[0.65rem] uppercase tracking-wide text-text-muted">
            {t("appStoreLine1")}
          </span>
          <span className="text-base font-semibold text-text">{t("appStoreLine2")}</span>
        </span>
      </a>

      <a
        href={GOOGLE_PLAY_URL}
        aria-label={`${t("googlePlayLine1")} ${t("googlePlayLine2")}`}
        className={buttonBase}
      >
        <GooglePlayIcon className="h-7 w-7 shrink-0" />
        <span className="flex flex-col leading-tight">
          <span className="text-[0.65rem] uppercase tracking-wide text-text-muted">
            {t("googlePlayLine1")}
          </span>
          <span className="text-base font-semibold text-text">{t("googlePlayLine2")}</span>
        </span>
      </a>
    </div>
  );
};
