"use client";

import type { HTMLAttributes, Ref } from "react";

import { useGSAPContext } from "@/hooks/useGSAPContext";
import { underwaterEase } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type SplitTextElement = "h1" | "h2" | "h3" | "p";
type SplitTextTrigger = "load" | "scroll";

export type SplitTextRevealProps = HTMLAttributes<HTMLHeadingElement> & {
  text: string;
  as?: SplitTextElement;
  trigger?: SplitTextTrigger;
  delay?: number;
  stagger?: number;
  wordClassName?: string;
};

export function SplitTextReveal({
  text,
  as: Component = "h2",
  trigger = "scroll",
  delay = 0,
  stagger = 0.045,
  className,
  wordClassName,
  ...props
}: SplitTextRevealProps) {
  const words = text.split(" ");
  const splitRef = useGSAPContext<HTMLHeadingElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      const wordElements = scope.querySelectorAll("[data-split-word]");
      const tweenVars = {
        yPercent: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.05,
        ease: underwaterEase,
        stagger,
        delay,
        clearProps: "filter",
      };

      if (trigger === "scroll" && ScrollTrigger) {
        gsap.fromTo(
          wordElements,
          { yPercent: 86, autoAlpha: 0, filter: "blur(8px)" },
          {
            ...tweenVars,
            scrollTrigger: {
              trigger: scope,
              start: "top 86%",
              once: true,
            },
          },
        );
        return;
      }

      gsap.fromTo(
        wordElements,
        { yPercent: 86, autoAlpha: 0, filter: "blur(8px)" },
        tweenVars,
      );
    },
    {
      scrollTrigger: trigger === "scroll",
    },
  );

  return (
    <Component
      ref={splitRef as Ref<HTMLHeadingElement>}
      aria-label={text}
      className={cn("gsap-split-text", className)}
      {...props}
    >
      <span aria-hidden="true">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className={cn(
              "gsap-split-word-mask",
              index < words.length - 1 && "gsap-split-word-spaced",
            )}
          >
            <span
              data-split-word
              className={cn("gsap-split-word", wordClassName)}
            >
              {word}
            </span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Component>
  );
}
