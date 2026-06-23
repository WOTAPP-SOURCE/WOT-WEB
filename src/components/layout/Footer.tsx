import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/Icons";
import { FooterVideo } from "@/components/layout/FooterVideo";
import { ScrollNavLink } from "@/components/layout/ScrollNavLink";
import { CookieSettingsButton } from "@/components/layout/CookieSettingsButton";

interface FooterColumn {
  titleKey: string;
  links: { key: string; href: string; scrollTo?: string }[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    titleKey: "productTitle",
    links: [
      { key: "features", href: "/", scrollTo: "fonctionnalites" },
      { key: "pricing", href: "/", scrollTo: "pricing" },
      { key: "glossary", href: "/glossary" },
      { key: "faq", href: "/faq" },
    ],
  },
  {
    titleKey: "companyTitle",
    links: [
      { key: "about", href: "/about" },
      { key: "contact", href: "/contact" },
    ],
  },
];

const LEGAL_LINKS: { key: string; href: string }[] = [
  { key: "privacyPolicy", href: "/privacy" },
  { key: "termsOfService", href: "/terms" },
  { key: "cookies", href: "/cookies" },
];

const SOCIAL_ICONS = [
  { label: "X", href: "#", Icon: XIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
];

const columnHeader = "font-mono text-[0.7rem] uppercase tracking-[0.16em] text-primary";

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="relative border-t border-[#B86BFF]/[0.18]">
      {/* Faint top accent glow */}
      <div className="via-primary/40 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      {/* Background brand-reveal video — right side, behind content, hidden on mobile. */}
      <FooterVideo />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* Brand — tagline + social icons (logo removed) */}
          <div className="col-span-2 md:col-span-3">
            <p className="text-text-muted max-w-xs text-sm leading-relaxed">{t("tagline")}</p>

            <ul className="mt-7 flex items-center gap-4">
              {SOCIAL_ICONS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="text-text-muted hover:border-primary/50 hover:text-primary flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/10 transition-all duration-200"
                  >
                    <Icon className="h-8 w-8" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns — pulled left, beside the brand column */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.titleKey} className="md:col-span-2">
              <h3 className={columnHeader}>{t(column.titleKey)}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => {
                  const linkClass =
                    "text-text-muted hover:text-text text-sm transition-colors duration-200";
                  return (
                    <li key={link.key}>
                      {link.scrollTo ? (
                        <ScrollNavLink hash={link.scrollTo} className={linkClass}>
                          {t(link.key)}
                        </ScrollNavLink>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {t(link.key)}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom legal bar — single line on desktop: copyright · disclaimer · legal links */}
        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/5 pt-8 text-center text-xs md:flex-row md:flex-nowrap md:justify-between md:gap-6 md:text-left">
          <p className="text-text-muted md:whitespace-nowrap">{t("copyright")}</p>
          <p className="text-text-muted/70 md:whitespace-nowrap">{t("disclaimer")}</p>
          <ul className="flex items-center md:whitespace-nowrap">
            {LEGAL_LINKS.map((link, index) => (
              <li key={link.key} className="flex items-center">
                {index > 0 && (
                  <span aria-hidden="true" className="text-text-muted/40 mx-3">
                    ·
                  </span>
                )}
                <Link
                  href={link.href}
                  className="text-text-muted hover:text-text transition-colors duration-200"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li className="flex items-center">
              <span aria-hidden="true" className="text-text-muted/40 mx-3">
                ·
              </span>
              <CookieSettingsButton className="text-text-muted hover:text-text cursor-pointer transition-colors duration-200" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
