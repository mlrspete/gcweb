"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  useWatch,
  type FieldError,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";

import {
  submitReviewSystemApplication,
  type ReviewSystemApplicationActionResult,
} from "@/app/actions/reviewSystemApplication";
import { FitCheckForm, emptyFitCheckFormDraft } from "./FitCheckForm";
import type { FitCheckFormDraft } from "./FitCheckForm";
import { FitCheckResult } from "./FitCheckResult";
import { reviewSystemContent } from "@/content/reviewSystem";
import {
  evaluateFit,
  manualReviewContactSchema,
  type FitCheckValues,
  type ManualReviewContactValues,
  type PreliminaryResultCategory,
} from "@/lib/validation/reviewSystemApplicationSchema";
import {
  trackFitCheckCompleted,
  trackFitCheckOpened,
  trackFitCheckStarted,
  trackFitResultViewed,
  trackManualReviewFailed,
  trackManualReviewStarted,
  trackManualReviewSubmitted,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

type FitCheckDialogProps = {
  triggerLabel: string;
  ctaLocation: string;
  className?: string;
};

type DialogStep = "fit-check" | "result" | "contact" | "submitting" | "success";

type ContactFormDraft = {
  workEmail: string;
  contactName: string;
  businessName: string;
  notes: string;
  honeypot: string;
};

const content = reviewSystemContent.fitCheck;

const emptyContactFormDraft: ContactFormDraft = {
  workEmail: "",
  contactName: "",
  businessName: "",
  notes: "",
  honeypot: "",
};

const inputClassName =
  "min-h-12 rounded-lg border border-pearl-white/[0.16] bg-pearl-white/[0.08] px-4 text-base font-semibold text-pearl-white outline-none transition placeholder:text-clear-water-blue/[0.42] focus-visible:border-reef-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reef-coral";

const labelClassName = "grid gap-2 text-sm font-bold text-pearl-white";

function FieldErrorText({ error }: { error?: FieldError }) {
  if (!error?.message) {
    return null;
  }

  return (
    <span className="text-sm font-bold text-soft-coral-pink" role="alert">
      {error.message}
    </span>
  );
}

function ErrorSummary<T extends Record<string, unknown>>({
  errors,
}: {
  errors: FieldErrors<T>;
}) {
  const messages = Object.values(errors)
    .map((error) => error?.message)
    .filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-lg border border-reef-coral/50 bg-reef-coral/[0.12] p-4 text-sm font-bold text-soft-coral-pink"
      role="alert"
      aria-live="assertive"
    >
      <p>Please check the highlighted fields:</p>
      <ul className="mt-2 grid gap-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

function getStageTwoField(
  id: "workEmail" | "contactName" | "businessName" | "notes",
) {
  const field = content.stageTwo.fields.find((item) => item.id === id);

  if (!field) {
    throw new Error(`Missing fit-check contact field: ${id}`);
  }

  return field;
}

function getSourcePage() {
  if (typeof window === "undefined") {
    return "Unknown source page";
  }

  return window.location.href;
}

function getResultContent(category: PreliminaryResultCategory) {
  return category === "potential-fit"
    ? content.results.potentialFit
    : content.results.manualReview;
}

function getStepNumber(step: DialogStep) {
  if (step === "fit-check") {
    return 1;
  }

  if (step === "result") {
    return 2;
  }

  return 3;
}

function ProgressIndicator({ step }: { step: DialogStep }) {
  const currentStep = getStepNumber(step);

  return (
    <ol
      className="grid grid-cols-3 gap-2 text-xs font-extrabold uppercase tracking-normal"
      aria-label="Fit check progress"
    >
      {["Fit check", "Result", "Contact"].map((label, index) => {
        const stepNumber = index + 1;
        const active = stepNumber <= currentStep;

        return (
          <li
            key={label}
            className={cn(
              "rounded-full border px-3 py-2 text-center transition",
              active
                ? "border-reef-coral bg-reef-coral text-deep-ocean-navy"
                : "border-pearl-white/[0.14] bg-pearl-white/[0.06] text-clear-water-blue/[0.72]",
            )}
          >
            {label}
          </li>
        );
      })}
    </ol>
  );
}

function getAnalyticsInput(
  values: FitCheckValues | null,
  resultCategory: PreliminaryResultCategory | null,
  ctaLocation: string,
) {
  return {
    ...(resultCategory ? { resultCategory } : {}),
    ...(values
      ? {
          industryCategory: values.industry,
          customerVolumeRange: values.customerVolume,
          requestMethodCategory: values.requestMethod,
          tools: values.tools,
        }
      : {}),
    ctaLocation,
  };
}

function ContactForm({
  initialValues,
  disabled,
  serverFieldErrors,
  onDraftChange,
  onSubmit,
}: {
  initialValues: ContactFormDraft;
  disabled: boolean;
  serverFieldErrors?: ReviewSystemApplicationActionResult extends infer Result
    ? Result extends { fieldErrors?: infer FieldErrors }
      ? FieldErrors
      : never
    : never;
  onDraftChange: (values: ContactFormDraft) => void;
  onSubmit: (values: ManualReviewContactValues) => void;
}) {
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<ContactFormDraft>({
    resolver: zodResolver(
      manualReviewContactSchema,
    ) as unknown as Resolver<ContactFormDraft>,
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const watchedValues = useWatch({ control });
  const workEmail = getStageTwoField("workEmail");
  const contactName = getStageTwoField("contactName");
  const businessName = getStageTwoField("businessName");
  const notes = getStageTwoField("notes");

  useEffect(() => {
    onDraftChange({
      ...emptyContactFormDraft,
      ...watchedValues,
      honeypot: watchedValues.honeypot ?? "",
    });
  }, [onDraftChange, watchedValues]);

  useEffect(() => {
    if (!serverFieldErrors) {
      return;
    }

    for (const [field, message] of Object.entries(serverFieldErrors)) {
      if (!message) {
        continue;
      }

      setError(field as keyof ContactFormDraft, {
        type: "server",
        message,
      });
    }
  }, [serverFieldErrors, setError]);

  function submitContact(values: ContactFormDraft) {
    const parsed = manualReviewContactSchema.safeParse(values);

    if (!parsed.success) {
      return;
    }

    onSubmit(parsed.data);
  }

  return (
    <form
      data-manual-review-form
      className="grid gap-5"
      onSubmit={handleSubmit(submitContact)}
      noValidate
    >
      <ErrorSummary<ContactFormDraft> errors={errors} />

      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input
            {...register("honeypot")}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />
        </label>
      </div>

      <label className={labelClassName}>
        <span>{workEmail.label}</span>
        <input
          {...register("workEmail")}
          className={inputClassName}
          type="email"
          inputMode="email"
          autoComplete="email"
          disabled={disabled}
          aria-invalid={Boolean(errors.workEmail)}
        />
        <FieldErrorText error={errors.workEmail} />
      </label>

      <label className={labelClassName}>
        <span>{contactName.label}</span>
        <input
          {...register("contactName")}
          className={inputClassName}
          type="text"
          autoComplete="name"
          disabled={disabled}
          aria-invalid={Boolean(errors.contactName)}
        />
        <FieldErrorText error={errors.contactName} />
      </label>

      <label className={labelClassName}>
        <span>{businessName.label}</span>
        <input
          {...register("businessName")}
          className={inputClassName}
          type="text"
          autoComplete="organization"
          disabled={disabled}
          aria-invalid={Boolean(errors.businessName)}
        />
        {businessName.helper ? (
          <span className="text-sm font-semibold text-clear-water-blue/[0.72]">
            {businessName.helper}
          </span>
        ) : null}
        <FieldErrorText error={errors.businessName} />
      </label>

      <label className={labelClassName}>
        <span>{notes.label}</span>
        <textarea
          {...register("notes")}
          className={cn(inputClassName, "min-h-32 py-3")}
          disabled={disabled}
          aria-invalid={Boolean(errors.notes)}
        />
        {notes.helper ? (
          <span className="text-sm font-semibold text-clear-water-blue/[0.72]">
            {notes.helper}
          </span>
        ) : null}
        <FieldErrorText error={errors.notes} />
      </label>

      <button
        type="submit"
        disabled={disabled}
        aria-busy={disabled}
        className="motion-cta inline-flex min-h-14 w-full items-center justify-center rounded-full bg-reef-coral px-7 text-base font-extrabold text-deep-ocean-navy shadow-coral-glow transition hover:-translate-y-0.5 hover:bg-soft-coral-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral disabled:cursor-wait disabled:opacity-60"
      >
        {content.stageTwo.submitButton}
      </button>
    </form>
  );
}

export function FitCheckDialog({
  triggerLabel,
  ctaLocation,
  className,
}: FitCheckDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<DialogStep>("fit-check");
  const [fitDraft, setFitDraft] = useState<FitCheckFormDraft>(
    emptyFitCheckFormDraft,
  );
  const [contactDraft, setContactDraft] = useState<ContactFormDraft>(
    emptyContactFormDraft,
  );
  const [fitCheckValues, setFitCheckValues] = useState<FitCheckValues | null>(
    null,
  );
  const [resultCategory, setResultCategory] =
    useState<PreliminaryResultCategory | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<ReviewSystemApplicationActionResult | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const hasStartedRef = useRef(false);
  const submissionErrorRef = useRef<HTMLDivElement>(null);

  const analyticsInput = useMemo(
    () => getAnalyticsInput(fitCheckValues, resultCategory, ctaLocation),
    [ctaLocation, fitCheckValues, resultCategory],
  );

  const handleFitDraftChange = useCallback((values: FitCheckFormDraft) => {
    setFitDraft(values);
  }, []);

  const handleContactDraftChange = useCallback((values: ContactFormDraft) => {
    setContactDraft(values);
  }, []);

  useEffect(() => {
    if (submissionResult && !submissionResult.ok) {
      submissionErrorRef.current?.focus();
    }
  }, [submissionResult]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      trackFitCheckOpened(ctaLocation);
      return;
    }
  }

  function handleStarted() {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    trackFitCheckStarted({ ctaLocation });
  }

  function resetFlow() {
    setStep("fit-check");
    setFitDraft(emptyFitCheckFormDraft);
    setContactDraft(emptyContactFormDraft);
    setFitCheckValues(null);
    setResultCategory(null);
    setSubmissionResult(null);
    hasStartedRef.current = false;
    setResetKey((current) => current + 1);
  }

  function completeFitCheck(values: FitCheckValues) {
    const category = evaluateFit(values);

    setFitCheckValues(values);
    setResultCategory(category);
    setSubmissionResult(null);
    setStep("result");

    const nextAnalyticsInput = getAnalyticsInput(values, category, ctaLocation);

    trackFitCheckCompleted(nextAnalyticsInput);
    trackFitResultViewed(nextAnalyticsInput);
  }

  function startManualReview() {
    if (!fitCheckValues || !resultCategory) {
      return;
    }

    trackManualReviewStarted(analyticsInput);
    setSubmissionResult(null);
    setStep("contact");
  }

  async function submitManualReview(values: ManualReviewContactValues) {
    if (!fitCheckValues || !resultCategory) {
      return;
    }

    const contactValues = {
      ...values,
      honeypot: values.honeypot || fitDraft.honeypot,
    };

    setContactDraft({
      workEmail: contactValues.workEmail,
      contactName: contactValues.contactName ?? "",
      businessName: contactValues.businessName ?? "",
      notes: contactValues.notes ?? "",
      honeypot: contactValues.honeypot ?? "",
    });
    setSubmissionResult(null);
    setStep("submitting");

    const response = await submitReviewSystemApplication(
      {
        fitCheck: fitCheckValues,
        preliminaryResultCategory: resultCategory,
        contact: contactValues,
      },
      getSourcePage(),
    );

    setSubmissionResult(response);

    if (response.ok) {
      trackManualReviewSubmitted(analyticsInput);
      setStep("success");
      return;
    }

    trackManualReviewFailed(analyticsInput);
    setStep("contact");
  }

  const resultContent = resultCategory
    ? getResultContent(resultCategory)
    : null;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          data-fit-check-trigger
          className={cn(
            "motion-cta inline-flex min-h-14 w-full items-center justify-center rounded-full bg-reef-coral px-7 text-base font-extrabold text-deep-ocean-navy shadow-coral-glow transition hover:-translate-y-0.5 hover:bg-soft-coral-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral",
            className,
          )}
        >
          {triggerLabel}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-deep-ocean-navy/76 backdrop-blur-sm" />
        <Dialog.Content
          data-fit-check-step={step}
          className={cn(
            "fixed inset-x-3 bottom-3 top-3 z-50 flex overflow-hidden rounded-lg border border-pearl-white/[0.16] bg-deep-ocean-navy text-pearl-white shadow-ocean-soft outline-none",
            "sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[min(90dvh,760px)] sm:w-[min(45rem,calc(100vw-2rem))] sm:-translate-x-1/2 sm:-translate-y-1/2",
          )}
        >
          <div className="flex min-h-0 w-full flex-col">
            <div className="sticky top-0 z-20 border-b border-pearl-white/[0.12] bg-deep-ocean-navy px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-normal text-reef-coral">
                    {content.stageOne.eyebrow}
                  </p>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-pearl-white/[0.2] px-4 text-sm font-extrabold text-pearl-white transition hover:border-seafoam/70 hover:text-seafoam focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
                  >
                    Close
                  </button>
                </Dialog.Close>
              </div>
              <div className="mt-4">
                <ProgressIndicator step={step} />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6 sm:py-7">
              {step === "fit-check" ? (
                <div className="grid gap-6">
                  <div>
                    <Dialog.Title className="text-3xl font-extrabold leading-tight text-pearl-white sm:text-4xl">
                      {content.stageOne.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-4 text-base font-semibold leading-8 text-clear-water-blue/[0.86]">
                      {content.stageOne.intro}
                    </Dialog.Description>
                  </div>
                  <FitCheckForm
                    key={`fit-${resetKey}`}
                    content={content.stageOne}
                    initialValues={fitDraft}
                    onDraftChange={handleFitDraftChange}
                    onComplete={completeFitCheck}
                    onStarted={handleStarted}
                  />
                </div>
              ) : null}

              {step === "result" && resultCategory && resultContent ? (
                <FitCheckResult
                  category={resultCategory}
                  content={resultContent}
                  onRequestManualReview={startManualReview}
                  onStartAgain={resetFlow}
                />
              ) : null}

              {step === "contact" || step === "submitting" ? (
                <div className="grid gap-6">
                  <div>
                    <Dialog.Title className="text-3xl font-extrabold leading-tight text-pearl-white sm:text-4xl">
                      {content.stageTwo.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-4 text-base font-semibold leading-8 text-clear-water-blue/[0.86]">
                      {content.stageTwo.body}
                    </Dialog.Description>
                  </div>

                  {submissionResult && !submissionResult.ok ? (
                    <div
                      ref={submissionErrorRef}
                      tabIndex={-1}
                      className="rounded-lg border border-reef-coral/50 bg-reef-coral/[0.12] p-4 text-sm font-bold leading-6 text-soft-coral-pink outline-none"
                      role="alert"
                      aria-live="assertive"
                    >
                      <p className="text-base font-extrabold">
                        {submissionResult.title}
                      </p>
                      <p className="mt-1">{submissionResult.body}</p>
                    </div>
                  ) : null}

                  <ContactForm
                    key={`contact-${resetKey}`}
                    initialValues={contactDraft}
                    disabled={step === "submitting"}
                    serverFieldErrors={
                      submissionResult && !submissionResult.ok
                        ? submissionResult.fieldErrors
                        : undefined
                    }
                    onDraftChange={handleContactDraftChange}
                    onSubmit={submitManualReview}
                  />

                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-pearl-white/[0.22] px-5 text-sm font-extrabold text-pearl-white transition hover:border-seafoam/70 hover:text-seafoam focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
                    onClick={resetFlow}
                  >
                    Start again
                  </button>
                </div>
              ) : null}

              {step === "success" && submissionResult?.ok ? (
                <div
                  data-fit-check-step="success"
                  className="grid gap-5"
                  role="status"
                  aria-live="polite"
                >
                  <div>
                    <Dialog.Title className="text-3xl font-extrabold leading-tight text-pearl-white sm:text-4xl">
                      {submissionResult.title}
                    </Dialog.Title>
                    <Dialog.Description className="mt-4 text-base font-semibold leading-8 text-clear-water-blue/[0.86]">
                      {submissionResult.body}
                    </Dialog.Description>
                  </div>
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-pearl-white/[0.22] px-5 text-sm font-extrabold text-pearl-white transition hover:border-seafoam/70 hover:text-seafoam focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral sm:w-fit"
                    onClick={resetFlow}
                  >
                    Start again
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
