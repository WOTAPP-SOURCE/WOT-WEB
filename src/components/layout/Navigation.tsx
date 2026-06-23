"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ScrollNavLink } from "@/components/layout/ScrollNavLink";
import { NAV_ANALYTICS_ITEM, NAV_LINKS } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}

export const Navigation = ({ className, onNavigate, variant = "desktop" }: NavigationProps) => {
  const t = useTranslations("nav");

  const linkStyles =
    variant === "desktop"
      ? "text-sm font-medium text-text-muted transition-colors duration-200 hover:text-text"
      : "block py-3 text-2xl font-medium text-text transition-colors duration-200 hover:text-primary";

  return (
    <nav className={className} aria-label="Primary">
      <ul className={cn(variant === "desktop" ? "flex items-center gap-8" : "flex flex-col gap-1")}>
        {NAV_LINKS.map((link) => {
          const handleClick = () => {
            trackEvent("nav_click", { item: NAV_ANALYTICS_ITEM[link.key] });
            onNavigate?.();
          };

          return (
            <li key={link.key}>
              {"scrollTo" in link ? (
                <ScrollNavLink hash={link.scrollTo} onClick={handleClick} className={linkStyles}>
                  {t(link.key)}
                </ScrollNavLink>
              ) : (
                <Link href={link.href} onClick={handleClick} className={linkStyles}>
                  {t(link.key)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
