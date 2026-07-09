import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark" | "coral";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidthOnMobile?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-deep-ocean-navy text-pearl-white shadow-ocean-soft hover:bg-abyss-blue",
  secondary:
    "border border-deep-ocean-navy/[0.18] bg-pearl-white text-deep-ocean-navy hover:border-reef-coral/50 hover:bg-clear-water-blue",
  ghost: "bg-transparent text-deep-ocean-navy hover:bg-deep-ocean-navy/[0.06]",
  dark: "bg-abyss-blue text-pearl-white hover:bg-deep-ocean-navy",
  coral:
    "bg-reef-coral text-deep-ocean-navy shadow-coral-glow hover:bg-soft-coral-pink",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-sm",
  lg: "min-h-14 px-7 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidthOnMobile = false,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        data-magnetic-ready="true"
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-bold",
          "transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-out will-change-transform",
          "hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral focus-visible:ring-4 focus-visible:ring-reef-coral/20",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          sizeClasses[size],
          variantClasses[variant],
          fullWidthOnMobile && "w-full sm:w-auto",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
