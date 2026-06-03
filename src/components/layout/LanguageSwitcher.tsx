"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LOCALE_LABELS, LOCALE_SHORT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, GlobeIcon } from "@/components/ui/Icons";

const menuVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.12 } },
};

export const LanguageSwitcher = () => {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const switchLocale = (nextLocale: string) => {
    setOpen(false);
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t("language")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="border-border bg-surface/60 text-text-muted hover:border-primary/50 hover:text-text flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium transition-colors duration-200"
      >
        <GlobeIcon className="h-4 w-4" />
        <span>{LOCALE_SHORT[locale]}</span>
        <ChevronDownIcon
          className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="border-border bg-surface/95 shadow-glow absolute top-full right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border p-1 backdrop-blur-xl"
          >
            {routing.locales.map((loc) => (
              <li key={loc}>
                <button
                  type="button"
                  role="option"
                  aria-selected={loc === locale}
                  onClick={() => switchLocale(loc)}
                  className={cn(
                    "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-200",
                    loc === locale
                      ? "bg-primary/15 text-text"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  )}
                >
                  <span>{LOCALE_LABELS[loc]}</span>
                  <span className="text-text-muted text-xs">{LOCALE_SHORT[loc]}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
