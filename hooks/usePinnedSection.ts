"use client";

import { isDesktopPinViewport } from "@/lib/gsap";
import { useGSAPContext } from "./useGSAPContext";

type UsePinnedSectionOptions = {
  enabled?: boolean;
  minWidth?: number;
  start?: string;
  end?: string;
  pinSpacing?: boolean;
};

export function usePinnedSection({
  enabled = true,
  minWidth = 900,
  start = "top top",
  end = "+=140%",
  pinSpacing = true,
}: UsePinnedSectionOptions = {}) {
  return useGSAPContext<HTMLElement>(
    ({ scope, ScrollTrigger }) => {
      if (!ScrollTrigger || !isDesktopPinViewport(minWidth)) {
        return;
      }

      const pin = ScrollTrigger.create({
        trigger: scope,
        pin: true,
        start,
        end,
        pinSpacing,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });

      return () => {
        pin.kill();
      };
    },
    {
      disabled: !enabled,
      scrollTrigger: true,
    },
  );
}
