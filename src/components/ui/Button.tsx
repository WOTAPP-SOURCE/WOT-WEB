import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
  /** Native button type — only applies when no `href` is provided. */
  type?: "button" | "submit" | "reset";
  /** Disables the rendered <button> (e.g. while a form is submitting). */
  disabled?: boolean;
  /** Click handler — fires on the link/anchor/button (e.g. analytics tracking). */
  onClick?: () => void;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,#941EFE,#5B0FA8)] text-white shadow-[0_0_30px_rgba(148,30,254,0.5)] hover:shadow-[0_0_44px_rgba(148,30,254,0.7)] hover:brightness-110",
  secondary:
    "border border-border bg-surface/60 text-text hover:border-primary/60 hover:bg-surface",
  ghost: "text-text-muted hover:text-text",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export const Button = ({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ariaLabel,
  type = "button",
  disabled = false,
  onClick,
}: ButtonProps) => {
  const classes = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && "pointer-events-none opacity-60",
    className
  );

  if (href) {
    // Internal app paths route through the locale-aware Link so the active locale
    // prefix is preserved; hash anchors and external URLs use a plain anchor.
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return (
        <Link href={href} aria-label={ariaLabel} className={classes} onClick={onClick}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} aria-label={ariaLabel} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
