"use client";

import * as Dialog from "@radix-ui/react-dialog";

import type { FitCheckResultContent } from "@/types/content";
import type { PreliminaryResultCategory } from "@/lib/validation/reviewSystemApplicationSchema";

type FitCheckResultProps = {
  category: PreliminaryResultCategory;
  content: FitCheckResultContent;
  onRequestManualReview: () => void;
  onStartAgain: () => void;
};

export function FitCheckResult({
  category,
  content,
  onRequestManualReview,
  onStartAgain,
}: FitCheckResultProps) {
  return (
    <div
      data-fit-check-step="result"
      data-fit-result={category}
      className="grid gap-5"
      role="status"
      aria-live="polite"
    >
      <div>
        <Dialog.Title className="text-3xl font-extrabold leading-tight text-pearl-white sm:text-4xl">
          {content.title}
        </Dialog.Title>
        <Dialog.Description className="mt-4 text-base font-semibold leading-8 text-clear-water-blue/[0.86]">
          {content.body}
        </Dialog.Description>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <button
          type="button"
          className="motion-cta inline-flex min-h-14 items-center justify-center rounded-full bg-reef-coral px-7 text-base font-extrabold text-deep-ocean-navy shadow-coral-glow transition hover:-translate-y-0.5 hover:bg-soft-coral-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
          onClick={onRequestManualReview}
        >
          {content.button}
        </button>
        <button
          type="button"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-pearl-white/[0.22] px-5 text-sm font-extrabold text-pearl-white transition hover:border-seafoam/70 hover:text-seafoam focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
          onClick={onStartAgain}
        >
          Start again
        </button>
      </div>
    </div>
  );
}
