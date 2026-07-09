import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type EyebrowVariant = "coral" | "seafoam" | "navy" | "pearl";

export type EyebrowProps = HTMLAttributes<HTMLParagraphElement> & {
  variant?: EyebrowVariant;
};

const variantClasses: Record<EyebrowVariant, string> = {
  coral: "text-reef-coral",
  seafoam: "text-seafoam",
  navy: "text-abyss-blue",
  pearl: "text-pearl-white",
};

export function Eyebrow({
  variant = "coral",
  className,
  ...props
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-xs font-extrabold uppercase tracking-normal sm:text-sm",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
