import { gsap } from "gsap";

export type GSAP = typeof gsap;
export type GSAPContext = ReturnType<typeof gsap.context>;
export type ScrollTriggerPlugin =
  typeof import("gsap/ScrollTrigger").ScrollTrigger;

export const underwaterEase = "power3.out";
export const underwaterMotion = {
  slowRise: {
    duration: 1.15,
    ease: underwaterEase,
  },
  glassRise: {
    duration: 1.25,
    ease: "power2.out",
  },
  coralGlow: {
    duration: 1.05,
    ease: "sine.out",
  },
} as const;

let scrollTriggerPromise: Promise<ScrollTriggerPlugin | null> | null = null;
let scrollTriggerRegistered = false;

export function canUseDOM() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

export function getGSAP() {
  return gsap;
}

export async function registerScrollTrigger() {
  if (!canUseDOM()) {
    return null;
  }

  if (!scrollTriggerPromise) {
    scrollTriggerPromise = import("gsap/ScrollTrigger").then(
      ({ ScrollTrigger }) => {
        if (!scrollTriggerRegistered) {
          gsap.registerPlugin(ScrollTrigger);
          scrollTriggerRegistered = true;
        }

        return ScrollTrigger;
      },
    );
  }

  return scrollTriggerPromise;
}

export function isDesktopPinViewport(minWidth = 900) {
  return canUseDOM() && window.matchMedia(`(min-width: ${minWidth}px)`).matches;
}
