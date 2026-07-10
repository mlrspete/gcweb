"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore, type CSSProperties } from "react";

import { HeroFallbackAnimation } from "@/components/hero/HeroFallbackAnimation";
import { Reveal } from "@/components/motion";
import { BubbleField } from "@/components/visuals";
import { heroContent } from "@/content/sections";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { trackCTAClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const FishSchoolCanvas = dynamic(
  () => import("@/components/hero/FishSchoolCanvas"),
  {
    ssr: false,
    loading: () => <HeroFallbackAnimation className="h-full max-w-none" />,
  },
);

const heroLabels = [
  {
    text: "More visible",
    className: "left-[8%] top-[18%]",
    delay: "-2s",
  },
  {
    text: "More trusted",
    className: "right-[9%] top-[30%]",
    delay: "-5s",
  },
  {
    text: "More recent proof",
    className: "left-[18%] bottom-[24%]",
    delay: "-7s",
  },
  {
    text: "More local confidence",
    className: "right-[13%] bottom-[16%]",
    delay: "-3s",
  },
] as const;

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

type CanvasCapability = "none" | "canvas" | "canvas-parallax";

let cachedWebGLSupport: boolean | null = null;

function hasWebGLSupport() {
  if (cachedWebGLSupport !== null) {
    return cachedWebGLSupport;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    cachedWebGLSupport = Boolean(gl);
    return cachedWebGLSupport;
  } catch {
    cachedWebGLSupport = false;
    return false;
  }
}

function getCanvasCapabilitySnapshot(): CanvasCapability {
  if (typeof window === "undefined") {
    return "none";
  }

  const navigatorWithMemory = navigator as NavigatorWithMemory;
  const isLargeEnough = window.matchMedia("(min-width: 768px)").matches;
  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  const hasEnoughCores =
    typeof navigator.hardwareConcurrency !== "number" ||
    navigator.hardwareConcurrency >= 4;
  const hasEnoughMemory =
    typeof navigatorWithMemory.deviceMemory !== "number" ||
    navigatorWithMemory.deviceMemory >= 4;

  const canUseCanvas =
    isLargeEnough && hasEnoughCores && hasEnoughMemory && hasWebGLSupport();

  if (!canUseCanvas) {
    return "none";
  }

  return hasFinePointer ? "canvas-parallax" : "canvas";
}

function getCanvasCapabilityServerSnapshot(): CanvasCapability {
  return "none";
}

function subscribeToCanvasCapability(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const sizeQuery = window.matchMedia("(min-width: 768px)");
  const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  sizeQuery.addEventListener("change", callback);
  pointerQuery.addEventListener("change", callback);
  window.addEventListener("resize", callback);

  return () => {
    sizeQuery.removeEventListener("change", callback);
    pointerQuery.removeEventListener("change", callback);
    window.removeEventListener("resize", callback);
  };
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const canvasCapability = useSyncExternalStore(
    subscribeToCanvasCapability,
    getCanvasCapabilitySnapshot,
    getCanvasCapabilityServerSnapshot,
  );
  const canUseCanvas = !reducedMotion && canvasCapability !== "none";
  const enableParallax = canvasCapability === "canvas-parallax";

  return (
    <section
      id="hero"
      className="ocean-gradient underwater-rays relative isolate min-h-[100svh] overflow-hidden bg-deep-ocean-navy text-pearl-white"
    >
      <BubbleField className="z-0 opacity-75" />

      <div
        aria-hidden="true"
        className="absolute -left-28 top-20 z-0 size-72 rounded-full bg-reef-coral/[0.18] blur-3xl sm:size-96 lg:left-[38%] lg:top-12"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-14rem] right-[-10rem] z-0 size-[28rem] rounded-full bg-clear-water-blue/10 blur-3xl lg:size-[42rem]"
      />
      <div aria-hidden="true" className="hero-light-rays z-0" />

      <div className="absolute inset-y-0 right-0 z-0 hidden w-[58%] md:block lg:w-[54%]">
        <div className="absolute inset-0 opacity-55 lg:opacity-100">
          {canUseCanvas ? (
            <FishSchoolCanvas enableParallax={enableParallax} />
          ) : (
            <div className="flex h-full items-center justify-center px-8">
              <HeroFallbackAnimation className="max-w-[44rem] opacity-80" />
            </div>
          )}
        </div>

        <div aria-hidden="true" className="absolute inset-0">
          {heroLabels.map((label) => (
            <span
              key={label.text}
              className={cn(
                "hero-float-label absolute rounded-full border border-pearl-white/[0.14] bg-pearl-white/[0.08] px-4 py-2 text-xs font-bold text-clear-water-blue shadow-[0_18px_60px_rgb(6_24_38_/_0.24)] backdrop-blur-md",
                label.className,
              )}
              style={{ "--hero-label-delay": label.delay } as CSSProperties}
            >
              {label.text}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-[88rem] items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 md:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.85fr)] lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,0.95fr)] lg:px-10">
        <div className="mx-auto max-w-[47.5rem] text-center md:mx-0 md:text-left">
          <Reveal
            as="p"
            trigger="load"
            delay={0.05}
            className="text-xs font-extrabold uppercase tracking-normal text-seafoam sm:text-sm"
          >
            {heroContent.eyebrow}
          </Reveal>

          <Reveal
            as="h1"
            trigger="load"
            delay={0.16}
            className="mt-5 text-5xl font-extrabold leading-[0.98] text-pearl-white sm:text-6xl lg:text-7xl"
          >
            {heroContent.h1}
          </Reveal>

          <Reveal
            as="p"
            trigger="load"
            delay={0.46}
            className="mt-6 max-w-[43rem] text-base font-semibold leading-8 text-clear-water-blue/[0.88] sm:text-lg md:mx-0"
          >
            {heroContent.subheading}
          </Reveal>

          <Reveal
            as="p"
            variant="glass-card-rise"
            trigger="load"
            delay={0.58}
            className="mx-auto mt-6 max-w-[42rem] border-l-0 border-reef-coral/70 bg-pearl-white/[0.06] px-5 py-4 text-sm font-semibold leading-7 text-pearl-white/[0.86] ring-1 ring-pearl-white/[0.1] backdrop-blur-sm md:mx-0 md:border-l-4"
          >
            {heroContent.trustLine}
          </Reveal>

          <Reveal
            trigger="load"
            delay={0.72}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:justify-start"
          >
            <a
              href="#pricing"
              data-cta="join-next-wave"
              className="motion-cta inline-flex min-h-14 items-center justify-center rounded-full bg-reef-coral px-7 text-base font-extrabold text-deep-ocean-navy shadow-coral-glow hover:bg-soft-coral-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral focus-visible:ring-4 focus-visible:ring-reef-coral/25"
              onClick={() =>
                trackCTAClick(
                  heroContent.primaryCta,
                  "hero-primary",
                  "review-system-offer",
                )
              }
            >
              {heroContent.primaryCta}
            </a>
            <a
              href="#how-it-works"
              className="motion-cta inline-flex min-h-14 items-center justify-center rounded-full border border-pearl-white/[0.16] bg-pearl-white/[0.07] px-7 text-base font-extrabold text-pearl-white backdrop-blur-sm hover:border-seafoam/60 hover:bg-pearl-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral focus-visible:ring-4 focus-visible:ring-reef-coral/25"
              onClick={() =>
                trackCTAClick(
                  heroContent.scrollCue,
                  "hero-secondary",
                  "review-system-journey",
                )
              }
            >
              {heroContent.scrollCue}
            </a>
          </Reveal>

          <div className="mt-10 md:hidden">
            <HeroFallbackAnimation />
          </div>
        </div>
      </div>
    </section>
  );
}
