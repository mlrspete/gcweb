import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

type CoralBlobVariant = "reef" | "soft" | "seafoam" | "light";

export type CoralBlobProps = SVGProps<SVGSVGElement> & {
  variant?: CoralBlobVariant;
};

const variantStops: Record<
  CoralBlobVariant,
  { first: string; second: string; third: string }
> = {
  reef: {
    first: "#FF6B5F",
    second: "#FFD1CA",
    third: "#DFF7FF",
  },
  soft: {
    first: "#FFD1CA",
    second: "#FFFCF6",
    third: "#BFEFE3",
  },
  seafoam: {
    first: "#BFEFE3",
    second: "#DFF7FF",
    third: "#FFFCF6",
  },
  light: {
    first: "#DFF7FF",
    second: "#FFFCF6",
    third: "#FFD1CA",
  },
};

export function CoralBlob({
  variant = "reef",
  className,
  ...props
}: CoralBlobProps) {
  const stops = variantStops[variant];
  const gradientId = `coral-blob-${variant}`;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 320 280"
      className={cn("pointer-events-none absolute h-72 w-80", className)}
      {...props}
    >
      <defs>
        <radialGradient id={gradientId} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={stops.first} stopOpacity="0.92" />
          <stop offset="48%" stopColor={stops.second} stopOpacity="0.58" />
          <stop offset="100%" stopColor={stops.third} stopOpacity="0" />
        </radialGradient>
        <filter
          id={`${gradientId}-blur`}
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
        >
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <path
        d="M48 160C26 106 75 46 135 58c35 7 47 33 80 35 38 2 70 24 72 63 2 47-41 84-94 81-28-1-42-15-70-8-39 9-62-37-75-69Z"
        fill={`url(#${gradientId})`}
        filter={`url(#${gradientId}-blur)`}
      />
      <path
        d="M98 169c27-41 76-52 124-31M123 118c19-5 37-3 54 6M149 191c20 8 40 9 62 3"
        stroke={stops.first}
        strokeOpacity="0.34"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
