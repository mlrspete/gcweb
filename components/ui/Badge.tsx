import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "coral" | "seafoam" | "dark";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  coral:
    "border-reef-coral/30 bg-soft-coral-pink text-deep-ocean-navy shadow-[0_10px_30px_rgb(255_107_95_/_0.16)]",
  seafoam: "border-seafoam/50 bg-seafoam/70 text-deep-ocean-navy",
  dark: "border-pearl-white/[0.14] bg-deep-ocean-navy text-pearl-white",
};

export function Badge({ variant = "coral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-bold",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
