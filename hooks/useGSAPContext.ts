"use client";

import { useEffect, useRef, type RefObject } from "react";

import {
  getGSAP,
  registerScrollTrigger,
  type GSAP,
  type ScrollTriggerPlugin,
} from "@/lib/gsap";
import { useReducedMotion } from "./useReducedMotion";

type GSAPContextCallback<T extends HTMLElement> = (helpers: {
  gsap: GSAP;
  scope: T;
  ScrollTrigger: ScrollTriggerPlugin | null;
}) => void | (() => void);

type UseGSAPContextOptions<T extends HTMLElement> = {
  disabled?: boolean;
  scrollTrigger?: boolean;
  scope?: RefObject<T | null>;
};

export function useGSAPContext<T extends HTMLElement>(
  callback: GSAPContextCallback<T>,
  options: UseGSAPContextOptions<T> = {},
) {
  const internalRef = useRef<T>(null);
  const callbackRef = useRef(callback);
  const reducedMotion = useReducedMotion();
  const {
    disabled = false,
    scrollTrigger = false,
    scope: externalScopeRef,
  } = options;

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const targetElement = externalScopeRef?.current ?? internalRef.current;

    if (!targetElement) {
      return;
    }

    const scopedElement = targetElement;

    if (reducedMotion || disabled) {
      return;
    }

    let mounted = true;
    let context: ReturnType<GSAP["context"]> | null = null;
    let cleanup: void | (() => void);

    async function runAnimation() {
      const gsap = getGSAP();
      const ScrollTrigger = scrollTrigger
        ? await registerScrollTrigger()
        : null;

      if (!mounted || !scopedElement.isConnected) {
        return;
      }

      context = gsap.context(() => {
        cleanup = callbackRef.current({
          gsap,
          scope: scopedElement,
          ScrollTrigger,
        });
      }, scopedElement);
    }

    void runAnimation();

    return () => {
      mounted = false;

      if (typeof cleanup === "function") {
        cleanup();
      }

      context?.revert();
    };
  }, [disabled, externalScopeRef, reducedMotion, scrollTrigger]);

  return externalScopeRef ?? internalRef;
}
