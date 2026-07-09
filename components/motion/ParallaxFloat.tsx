"use client";

import { createElement, type HTMLAttributes } from "react";

import { useGSAPContext } from "@/hooks/useGSAPContext";
import { isDesktopPinViewport } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ParallaxElement = "div" | "span" | "figure";

export type ParallaxFloatProps = HTMLAttributes<HTMLElement> & {
  as?: ParallaxElement;
  distance?: number;
  scrub?: number;
  desktopOnly?: boolean;
};

export function ParallaxFloat({
  as: Component = "div",
  distance = 28,
  scrub = 1.4,
  desktopOnly = false,
  className,
  children,
  ...props
}: ParallaxFloatProps) {
  const floatRef = useGSAPContext<HTMLElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!ScrollTrigger || (desktopOnly && !isDesktopPinViewport())) {
        return;
      }

      gsap.fromTo(
        scope,
        { y: -distance * 0.5 },
        {
          y: distance * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top bottom",
            end: "bottom top",
            scrub,
          },
        },
      );
    },
    {
      scrollTrigger: true,
    },
  );

  return createElement(
    Component,
    {
      ref: floatRef,
      className: cn("gsap-parallax-float", className),
      ...props,
    },
    children,
  );
}
