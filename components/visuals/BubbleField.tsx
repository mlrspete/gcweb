import type { CSSProperties, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const bubbles = [
  {
    x: "8%",
    y: "72%",
    size: "10px",
    delay: "-2s",
    duration: "11s",
    opacity: "0.44",
  },
  {
    x: "18%",
    y: "58%",
    size: "6px",
    delay: "-7s",
    duration: "13s",
    opacity: "0.32",
  },
  {
    x: "31%",
    y: "80%",
    size: "14px",
    delay: "-5s",
    duration: "15s",
    opacity: "0.28",
  },
  {
    x: "46%",
    y: "64%",
    size: "8px",
    delay: "-3s",
    duration: "12s",
    opacity: "0.36",
  },
  {
    x: "62%",
    y: "76%",
    size: "11px",
    delay: "-8s",
    duration: "16s",
    opacity: "0.3",
  },
  {
    x: "74%",
    y: "52%",
    size: "7px",
    delay: "-4s",
    duration: "14s",
    opacity: "0.34",
  },
  {
    x: "88%",
    y: "70%",
    size: "13px",
    delay: "-9s",
    duration: "17s",
    opacity: "0.26",
  },
] as const;

type BubbleStyle = CSSProperties & {
  "--bubble-x": string;
  "--bubble-y": string;
  "--bubble-size": string;
  "--bubble-delay": string;
  "--bubble-duration": string;
  "--bubble-opacity": string;
};

export type BubbleFieldProps = HTMLAttributes<HTMLDivElement>;

export function BubbleField({ className, ...props }: BubbleFieldProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("bubble-field motion-reduce-hide", className)}
      {...props}
    >
      {bubbles.map((bubble) => (
        <span
          key={`${bubble.x}-${bubble.y}`}
          style={
            {
              "--bubble-x": bubble.x,
              "--bubble-y": bubble.y,
              "--bubble-size": bubble.size,
              "--bubble-delay": bubble.delay,
              "--bubble-duration": bubble.duration,
              "--bubble-opacity": bubble.opacity,
            } as BubbleStyle
          }
        />
      ))}
    </div>
  );
}
