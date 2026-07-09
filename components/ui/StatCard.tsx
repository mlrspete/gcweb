import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StatCardVariant = "pearl" | "dark";

export type StatCardProps = HTMLAttributes<HTMLDivElement> & {
  stat: string;
  body: string;
  source?: string;
  variant?: StatCardVariant;
};

const variantClasses: Record<StatCardVariant, string> = {
  pearl:
    "border-deep-ocean-navy/10 bg-pearl-white text-deep-ocean-navy shadow-ocean-soft",
  dark: "border-pearl-white/[0.14] bg-abyss-blue text-pearl-white shadow-ocean-soft",
};

export function StatCard({
  stat,
  body,
  source,
  variant = "pearl",
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 sm:p-6",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <p className="text-4xl font-extrabold leading-none text-reef-coral sm:text-5xl">
        {stat}
      </p>
      <p className="mt-4 text-sm font-semibold leading-6 opacity-[0.88]">
        {body}
      </p>
      {source ? (
        <p className="mt-4 text-xs font-bold uppercase tracking-normal opacity-[0.68]">
          {source}
        </p>
      ) : null}
    </div>
  );
}
