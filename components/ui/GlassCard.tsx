import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type GlassCardVariant = "pearl" | "dark";

export type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: GlassCardVariant;
};

const variantClasses: Record<GlassCardVariant, string> = {
  pearl:
    "border border-pearl-white/70 bg-pearl-white/[0.72] text-deep-ocean-navy shadow-ocean-soft backdrop-blur-xl",
  dark: "border border-pearl-white/[0.14] bg-deep-ocean-navy/[0.72] text-pearl-white shadow-ocean-soft backdrop-blur-xl",
};

export function GlassCard({
  variant = "pearl",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-border relative overflow-hidden rounded-lg p-5 sm:p-6",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
