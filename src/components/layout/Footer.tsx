import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "@/components/ui/Icons";

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

const SOCIAL_LINKS = [
  { label: "X", href: "#", Icon: XIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "YouTube", href: "#", Icon: YouTubeIcon },
];

export const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="relative border-t border-white/5">
      {/* Faint top accent glow */}
      <div className="via-primary/30 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
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
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
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
              <h3 className="text-text text-sm font-semibold">{t(column.titleKey)}</h3>
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
        </div>

        <div className="mt-16 border-t border-white/5 pt-8">
          <p className="text-text-muted text-sm">{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};
