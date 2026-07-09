"use client";

import type { HTMLAttributes } from "react";

import { useGSAPContext } from "@/hooks/useGSAPContext";
import { underwaterEase } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type AnimatedCounterProps = HTMLAttributes<HTMLSpanElement> & {
  value: number | string;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

function parseCounterValue(value: number | string) {
  if (typeof value === "number") {
    return {
      end: value,
      suffix: "",
    };
  }

  const match = value.match(/^([^0-9.-]*)(-?\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return null;
  }

  return {
    prefix: match[1] ?? "",
    end: Number(match[2]),
    suffix: match[3] ?? "",
  };
}

function formatCounter(
  value: number,
  decimals: number,
  prefix: string,
  suffix: string,
) {
  return `${prefix}${value.toLocaleString("en", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  })}${suffix}`;
}

export function AnimatedCounter({
  value,
  from = 0,
  duration = 1.4,
  decimals = 0,
  prefix,
  suffix,
  className,
  ...props
}: AnimatedCounterProps) {
  const parsed = parseCounterValue(value);
  const displayValue = String(value);
  const counterRef = useGSAPContext<HTMLSpanElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!parsed || !ScrollTrigger) {
        return;
      }

      const counter = { value: from };
      const resolvedPrefix = prefix ?? parsed.prefix ?? "";
      const resolvedSuffix = suffix ?? parsed.suffix ?? "";

      scope.textContent = formatCounter(
        from,
        decimals,
        resolvedPrefix,
        resolvedSuffix,
      );

      gsap.to(counter, {
        value: parsed.end,
        duration,
        ease: underwaterEase,
        scrollTrigger: {
          trigger: scope,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          scope.textContent = formatCounter(
            counter.value,
            decimals,
            resolvedPrefix,
            resolvedSuffix,
          );
        },
      });
    },
    {
      disabled: !parsed,
      scrollTrigger: Boolean(parsed),
    },
  );

  return (
    <span ref={counterRef} className={cn("gsap-counter", className)} {...props}>
      {displayValue}
    </span>
  );
}
