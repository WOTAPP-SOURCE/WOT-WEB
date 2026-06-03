import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/Icons";
import { FOOTER_SOCIAL } from "@/lib/constants";

interface FooterColumn {
  titleKey: string;
  links: { key: string; href: string }[];
}

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    titleKey: "productTitle",
    links: [
      { key: "features", href: "/features" },
      { key: "pricing", href: "/pricing" },
      { key: "glossary", href: "/glossary" },
      { key: "faq", href: "/faq" },
    ],
  },
  {
    titleKey: "companyTitle",
    links: [
      { key: "about", href: "/about" },
      { key: "blog", href: "/blog" },
      { key: "contact", href: "/contact" },
    ],
  },
  {
    titleKey: "legalTitle",
    links: [
      { key: "privacyPolicy", href: "/privacy" },
      { key: "termsOfService", href: "/terms" },
      { key: "cookies", href: "/cookies" },
    ],
  },
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

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" aria-label="Way of Trading — home" className="inline-flex">
              <Image
                src="/images/brand/logo-photoroom.png"
                alt="Way of Trading"
                width={150}
                height={44}
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-text-muted mt-5 max-w-xs text-sm leading-relaxed">{t("tagline")}</p>

            <ul className="mt-7 flex items-center gap-3">
              {SOCIAL_ICONS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className="text-text-muted hover:border-primary/50 hover:text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.titleKey} className="md:col-span-2">
              <h3 className={columnHeader}>{t(column.titleKey)}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-text-muted hover:text-text text-sm transition-colors duration-200"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social column */}
          <div className="md:col-span-2">
            <h3 className={columnHeader}>{t("socialTitle")}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {FOOTER_SOCIAL.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="text-text-muted hover:text-text text-sm transition-colors duration-200"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-text-muted text-sm">{t("copyright")}</p>
          <p className="text-text-muted/70 text-xs">{t("disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
};
