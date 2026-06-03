"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Button } from "@/components/ui/Button";
import { MenuIcon } from "@/components/ui/Icons";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const Header = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Deepen the glass + reveal the hairline border only after the hero scrolls
  // under the bar, so it floats transparently over the fold.
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-[#B86BFF]/[0.18] bg-[#06030D]/70 backdrop-blur-[22px] backdrop-saturate-[1.8]"
            : "border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="Way of Trading — home" className="flex shrink-0 items-center">
            <Image
              src="/images/brand/logo-photoroom.png"
              alt="Way of Trading"
              width={140}
              height={42}
              priority
              className="h-auto w-[124px] sm:w-[140px]"
            />
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-9">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      data-active={isActive}
                      className={cn(
                        "nav-underline text-sm font-medium transition-colors duration-200 hover:text-accent hover:[text-shadow:0_0_14px_rgba(184,107,255,0.5)]",
                        isActive ? "text-text" : "text-text-muted"
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            <div className="hidden sm:block">
              <Button href="#download" size="sm">
                {t("downloadApp")}
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu")}
              className="text-text-muted hover:border-primary/50 hover:text-text flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 transition-colors duration-200 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};
