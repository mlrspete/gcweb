import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type HeroFallbackAnimationProps = {
  className?: string;
};

const fish = [
  {
    x: 58,
    y: 52,
    scale: 1,
    body: "#DFF7FF",
    accent: "#BFEFE3",
    opacity: 0.72,
    delay: "-2s",
    duration: "9s",
  },
  {
    x: 128,
    y: 82,
    scale: 0.68,
    body: "#BFEFE3",
    accent: "#DFF7FF",
    opacity: 0.52,
    delay: "-5s",
    duration: "11s",
  },
  {
    x: 86,
    y: 145,
    scale: 0.78,
    body: "#FFFCF6",
    accent: "#BFEFE3",
    opacity: 0.44,
    delay: "-7s",
    duration: "12s",
  },
  {
    x: 185,
    y: 132,
    scale: 1.2,
    body: "#FF6B5F",
    accent: "#FFD1CA",
    opacity: 0.9,
    delay: "-3s",
    duration: "10s",
  },
  {
    x: 232,
    y: 64,
    scale: 0.62,
    body: "#DFF7FF",
    accent: "#BFEFE3",
    opacity: 0.42,
    delay: "-4s",
    duration: "13s",
  },
] as const;

export function HeroFallbackAnimation({
  className,
}: HeroFallbackAnimationProps) {
  return (
    <div
      data-hero-fallback="true"
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative mx-auto aspect-[1.32] w-full max-w-[34rem] overflow-hidden rounded-lg border border-pearl-white/[0.12] bg-pearl-white/[0.04]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgb(255_107_95_/_0.18),transparent_28%),radial-gradient(circle_at_35%_40%,rgb(223_247_255_/_0.13),transparent_34%)]" />
      <svg viewBox="0 0 300 220" className="absolute inset-0 size-full">
        <path
          d="M28 66c58-31 119-35 182-13 25 9 44 22 62 39"
          stroke="#DFF7FF"
          strokeOpacity="0.16"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M45 148c50-20 104-20 162 0 21 7 38 17 52 31"
          stroke="#BFEFE3"
          strokeOpacity="0.14"
          strokeWidth="2"
          fill="none"
        />
        {fish.map((item) => (
          <g
            key={`${item.x}-${item.y}`}
            className="hero-fallback-fish"
            style={
              {
                "--hero-fish-delay": item.delay,
                "--hero-fish-duration": item.duration,
              } as CSSProperties
            }
            transform={`translate(${item.x} ${item.y}) scale(${item.scale})`}
            opacity={item.opacity}
          >
            <path
              className="hero-fallback-tail"
              d="M-20 0-35-11c-3-2-6 1-4 4l9 12-9 12c-2 3 1 6 4 4L-20 10Z"
              fill={item.accent}
            />
            <path
              d="M-23 0C-9-16 17-16 34 0 17 16-9 16-23 0Z"
              fill={item.body}
            />
            <path
              d="M-3-7c8-4 18-3 28 3"
              stroke="#061826"
              strokeOpacity="0.28"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="25" cy="-3" r="2" fill="#061826" opacity="0.8" />
          </g>
        ))}
      </svg>
    </div>
  );
}
