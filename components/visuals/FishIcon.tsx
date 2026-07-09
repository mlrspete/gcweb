import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

export type FishIconVariant =
  | "default"
  | "standout"
  | "carpenter"
  | "cafe"
  | "mechanic"
  | "clinic"
  | "beauty"
  | "product/canned"
  | "product"
  | "canned";

export type FishIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  variant?: FishIconVariant;
  size?: number;
  title?: string;
};

const palettes: Record<
  FishIconVariant,
  { body: string; accent: string; detail: string }
> = {
  default: {
    body: "#DFF7FF",
    accent: "#092A3A",
    detail: "#FF6B5F",
  },
  standout: {
    body: "#FF6B5F",
    accent: "#061826",
    detail: "#FFD1CA",
  },
  carpenter: {
    body: "#BFEFE3",
    accent: "#092A3A",
    detail: "#FF6B5F",
  },
  cafe: {
    body: "#FFD1CA",
    accent: "#061826",
    detail: "#BFEFE3",
  },
  mechanic: {
    body: "#DFF7FF",
    accent: "#061826",
    detail: "#FF6B5F",
  },
  clinic: {
    body: "#FFFCF6",
    accent: "#092A3A",
    detail: "#FF6B5F",
  },
  beauty: {
    body: "#FFD1CA",
    accent: "#092A3A",
    detail: "#FFFCF6",
  },
  "product/canned": {
    body: "#BFEFE3",
    accent: "#061826",
    detail: "#DFF7FF",
  },
  product: {
    body: "#BFEFE3",
    accent: "#061826",
    detail: "#DFF7FF",
  },
  canned: {
    body: "#BFEFE3",
    accent: "#061826",
    detail: "#DFF7FF",
  },
};

// Placeholder icon system: replace with final brand illustrations only if the
// production identity moves beyond the current lightweight SVG set.
function renderMotif(variant: FishIconVariant, detail: string, accent: string) {
  switch (variant) {
    case "carpenter":
      return (
        <path
          d="M21 17l8 8M27 15l-8 8"
          stroke={detail}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      );
    case "cafe":
      return (
        <path
          d="M21 14c-2 2 2 3 0 5M27 13c-2 2 2 3 0 5"
          stroke={detail}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      );
    case "mechanic":
      return (
        <path
          d="M22 17.5h6l3 4-3 4h-6l-3-4 3-4Z"
          stroke={detail}
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case "clinic":
      return (
        <path
          d="M25 16v10M20 21h10"
          stroke={detail}
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    case "beauty":
      return (
        <path
          d="M25 14l1.7 4.2L31 20l-4.3 1.8L25 26l-1.7-4.2L19 20l4.3-1.8L25 14Z"
          fill={detail}
          opacity="0.9"
        />
      );
    case "product/canned":
    case "product":
    case "canned":
      return (
        <path
          d="M20 17.5h10M20 21.5h10M20 25.5h10"
          stroke={accent}
          strokeWidth="1.35"
          strokeLinecap="round"
          opacity="0.78"
        />
      );
    default:
      return (
        <path
          d="M20 24c5-2 9-2 14 0"
          stroke={detail}
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.82"
        />
      );
  }
}

export function FishIcon({
  variant = "default",
  size = 40,
  title,
  className,
  ...props
}: FishIconProps) {
  const palette = palettes[variant];
  const accessibilityProps = title
    ? { role: "img", "aria-label": title }
    : { "aria-hidden": true, focusable: false };

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="none"
      {...accessibilityProps}
      {...props}
    >
      <path
        d="M6 25c7.7-11.5 20.6-13.2 33-3.9 1.5 1.1 1.5 3.7 0 4.8C26.6 35.2 13.7 33.5 6 22v3Z"
        fill={palette.body}
        stroke={palette.accent}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 23.5 2.8 16.8c-.8-1.3.7-2.7 1.9-1.8l7.4 5.3M7 24.5l-4.2 6.7c-.8 1.3.7 2.7 1.9 1.8l7.4-5.3"
        fill={palette.detail}
        stroke={palette.accent}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M35.5 22.4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        fill={palette.accent}
      />
      <path
        d="M17 19c3.4-4.7 8.2-5.7 14.2-3"
        stroke={palette.accent}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.34"
      />
      {renderMotif(variant, palette.detail, palette.accent)}
    </svg>
  );
}
