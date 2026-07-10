"use client";

import type { HTMLAttributes } from "react";

import { FishIcon } from "@/components/visuals";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import { cn } from "@/lib/utils";

export type TickerProps = HTMLAttributes<HTMLDivElement> & {
  items: readonly string[];
  duration?: number;
  pauseOnHover?: boolean;
  showFishIcon?: boolean;
};

export function Ticker({
  items,
  duration = 28,
  pauseOnHover = true,
  showFishIcon = false,
  className,
  ...props
}: TickerProps) {
  const tickerRef = useGSAPContext<HTMLDivElement>(({ gsap, scope }) => {
    const track = scope.querySelector<HTMLElement>("[data-ticker-track]");

    if (!track) {
      return;
    }

    const tween = gsap.to(track, {
      xPercent: -50,
      duration,
      ease: "none",
      repeat: -1,
    });

    if (!pauseOnHover) {
      return () => tween.kill();
    }

    const pause = () => tween.pause();
    const resume = () => tween.resume();

    scope.addEventListener("mouseenter", pause);
    scope.addEventListener("mouseleave", resume);
    scope.addEventListener("focusin", pause);
    scope.addEventListener("focusout", resume);

    return () => {
      scope.removeEventListener("mouseenter", pause);
      scope.removeEventListener("mouseleave", resume);
      scope.removeEventListener("focusin", pause);
      scope.removeEventListener("focusout", resume);
      tween.kill();
    };
  });

  const loopItems = [...items, ...items];

  return (
    <div
      ref={tickerRef}
      className={cn("gsap-ticker overflow-hidden", className)}
      {...props}
    >
      <div data-ticker-track className="gsap-ticker-track">
        {loopItems.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length}
            className="gsap-ticker-item"
          >
            {showFishIcon ? (
              <FishIcon
                variant={index % 5 === 0 ? "standout" : "default"}
                size={18}
                className="mr-2 opacity-80"
              />
            ) : null}
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
