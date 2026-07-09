"use client";

import { useEffect, type ReactNode } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

type MotionProviderProps = {
  children: ReactNode;
};

export function MotionProvider({ children }: MotionProviderProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion
      ? "reduced"
      : "enabled";
  }, [reducedMotion]);

  return children;
}
