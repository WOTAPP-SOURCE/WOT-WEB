import type { ReactNode } from "react";
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
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-glow hover:bg-accent hover:shadow-glow-lg",
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
}: ButtonProps) => {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" aria-label={ariaLabel} className={classes}>
      {children}
    </button>
  );
};
