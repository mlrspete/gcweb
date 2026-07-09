"use client";

import { createElement, type HTMLAttributes } from "react";

import { useGSAPContext } from "@/hooks/useGSAPContext";
import { underwaterMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealVariant = "fade-up" | "glass-card-rise" | "coral-glow-in";
type RevealTrigger = "load" | "scroll";
type RevealElement =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "span"
  | "li";

export type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: RevealElement;
  variant?: RevealVariant;
  trigger?: RevealTrigger;
  delay?: number;
  once?: boolean;
};

const revealVariants = {
  "fade-up": {
    from: { autoAlpha: 0, y: 26, filter: "blur(8px)" },
    to: { autoAlpha: 1, y: 0, filter: "blur(0px)" },
    config: underwaterMotion.slowRise,
  },
  "glass-card-rise": {
    from: { autoAlpha: 0, y: 34, scale: 0.985, filter: "blur(10px)" },
    to: { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" },
    config: underwaterMotion.glassRise,
  },
  "coral-glow-in": {
    from: {
      autoAlpha: 0,
      y: 18,
      boxShadow: "0 0 0 rgb(255 107 95 / 0)",
    },
    to: {
      autoAlpha: 1,
      y: 0,
      boxShadow: "0 22px 70px rgb(255 107 95 / 0.2)",
    },
    config: underwaterMotion.coralGlow,
  },
} satisfies Record<RevealVariant, Record<string, unknown>>;

export function Reveal({
  as: Component = "div",
  variant = "fade-up",
  trigger = "scroll",
  delay = 0,
  once = true,
  className,
  children,
  ...props
}: RevealProps) {
  const revealRef = useGSAPContext<HTMLElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      const motion = revealVariants[variant];
      const tweenVars = {
        ...motion.to,
        ...motion.config,
        delay,
        clearProps: "filter",
      };

      if (trigger === "scroll" && ScrollTrigger) {
        gsap.fromTo(scope, motion.from, {
          ...tweenVars,
          scrollTrigger: {
            trigger: scope,
            start: "top 86%",
            once,
          },
        });
        return;
      }

      gsap.fromTo(scope, motion.from, tweenVars);
    },
    {
      scrollTrigger: trigger === "scroll",
    },
  );

  return createElement(
    Component,
    {
      ref: revealRef,
      className: cn("gsap-reveal", className),
      ...props,
    },
    children,
  );
}
