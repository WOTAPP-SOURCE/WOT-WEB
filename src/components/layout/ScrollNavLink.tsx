"use client";

import { type MouseEvent, type ReactNode } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { scrollToId } from "@/lib/scroll";

interface ScrollNavLinkProps {
  /** Target element id on the home page (without the leading "#"). */
  hash: string;
  className?: string;
  children: ReactNode;
  /** Runs after the scroll/navigation is triggered (e.g. close the mobile menu). */
  onClick?: () => void;
}

/*
 * A nav link that resolves to an in-page section on the home route rather than a
 * standalone page. On home, it intercepts the click and smooth-scrolls to the
 * target. From any other route, it navigates home with a `#<hash>` so the home
 * page can scroll to the section on mount (see HashScroll). Locale-aware via the
 * next-intl Link/router.
 */
export const ScrollNavLink = ({ hash, className, children, onClick }: ScrollNavLinkProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, etc.) fall through to default behavior.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();

    if (pathname === "/") {
      scrollToId(hash);
      window.history.replaceState(null, "", `#${hash}`);
    } else {
      router.push(`/#${hash}`);
    }

    onClick?.();
  };

  return (
    <Link href={`/#${hash}`} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};
