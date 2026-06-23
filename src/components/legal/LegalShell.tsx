"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LegalNavItem {
  href: string;
  label: string;
}

interface LegalShellProps {
  nav: LegalNavItem[];
  heading: string;
  children: React.ReactNode;
}

/*
 * Shared Legal Center frame: a sticky left sidebar on desktop and a horizontal
 * scrollable tab bar on mobile, with the active document highlighted. Lives in
 * the (legal) route-group layout so it never unmounts when switching documents —
 * cross-links between the four pages keep the sidebar in place.
 */
export const LegalShell = ({ nav, heading, children }: LegalShellProps) => {
  // next-intl's usePathname returns the locale-stripped path, e.g. "/cookies".
  const pathname = usePathname();

  return (
    <div className="relative mx-auto max-w-7xl px-5 pt-28 pb-28 sm:px-8 sm:pt-36">
      <div className="lg:grid lg:grid-cols-[248px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
        {/* Mobile / tablet: horizontal scrollable tab bar */}
        <nav
          aria-label={heading}
          className="-mx-5 mb-10 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex w-max gap-2">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                      active
                        ? "border-primary/60 bg-primary/15 text-primary font-semibold"
                        : "border-border bg-surface/60 text-text-muted hover:border-primary/40 hover:text-text"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop: sticky sidebar */}
        <aside className="hidden lg:block">
          <nav
            aria-label={heading}
            className="border-border bg-surface/70 sticky top-28 rounded-2xl border p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm"
          >
            <p className="text-primary mb-4 px-2 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
              {heading}
            </p>
            <ul className="flex flex-col gap-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-lg py-2.5 pr-3 pl-4 text-sm transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-text-muted hover:text-text hover:bg-white/5"
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="bg-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-full"
                        />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Content area */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
};
