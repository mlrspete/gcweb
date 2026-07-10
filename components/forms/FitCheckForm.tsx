"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  useForm,
  useWatch,
  type FieldError,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";

import type { FitCheckContent } from "@/types/content";
import { cn } from "@/lib/utils";
import {
  fitCheckSchema,
  type CustomerTool,
  type CustomerVolumeRange,
  type FitCheckValues,
  type Industry,
  type RequestMethod,
} from "@/lib/validation/reviewSystemApplicationSchema";

export type FitCheckFormDraft = {
  businessUrl: string;
  industry: Industry | "";
  customerVolume: CustomerVolumeRange | "";
  requestMethod: RequestMethod | "";
  tools: CustomerTool[];
  complianceAccepted: boolean;
  honeypot: string;
};

type FitCheckFormProps = {
  content: FitCheckContent["stageOne"];
  initialValues: FitCheckFormDraft;
  onDraftChange: (values: FitCheckFormDraft) => void;
  onComplete: (values: FitCheckValues, honeypot: string) => void;
  onStarted: () => void;
};

export const emptyFitCheckFormDraft: FitCheckFormDraft = {
  businessUrl: "",
  industry: "",
  customerVolume: "",
  requestMethod: "",
  tools: [],
  complianceAccepted: false,
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

function ErrorSummary({ errors }: { errors: FieldErrors<FitCheckFormDraft> }) {
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

export function FitCheckForm({
  content,
  initialValues,
  onDraftChange,
  onComplete,
  onStarted,
}: FitCheckFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FitCheckFormDraft>({
    resolver: zodResolver(
      fitCheckSchema,
    ) as unknown as Resolver<FitCheckFormDraft>,
    defaultValues: initialValues,
    mode: "onTouched",
  });

  const watchedValues = useWatch({ control });
  const selectedTools = useWatch({ control, name: "tools" }) ?? [];

  useEffect(() => {
    onDraftChange({
      ...emptyFitCheckFormDraft,
      ...watchedValues,
      tools: watchedValues.tools ?? [],
      complianceAccepted: Boolean(watchedValues.complianceAccepted),
      honeypot: watchedValues.honeypot ?? "",
    });
  }, [onDraftChange, watchedValues]);

  function updateToolSelection(tool: CustomerTool, checked: boolean) {
    const currentTools = new Set(getValues("tools") ?? []);

    if (tool === "None of these") {
      setValue("tools", checked ? ["None of these"] : [], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      return;
    }

    currentTools.delete("None of these");

    if (checked) {
      currentTools.add(tool);
    } else {
      currentTools.delete(tool);
    }

    setValue("tools", Array.from(currentTools), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function completeStageOne(values: FitCheckFormDraft) {
    const parsed = fitCheckSchema.safeParse(values);

    if (!parsed.success) {
      return;
    }

    onComplete(parsed.data, getValues("honeypot"));
  }

  return (
    <form
      data-fit-check-step="fit-check"
      className="grid gap-5"
      onChangeCapture={(event) => {
        const target = event.target;

        if (
          target instanceof HTMLInputElement &&
          target.name === content.fields.honeypot.id
        ) {
          return;
        }

        onStarted();
      }}
      onSubmit={handleSubmit(completeStageOne)}
      noValidate
    >
      <ErrorSummary errors={errors} />

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
        <span>{content.fields.businessUrl.label}</span>
        <input
          {...register("businessUrl")}
          className={inputClassName}
          type="url"
          inputMode="url"
          placeholder="https://"
          autoComplete="url"
          aria-invalid={Boolean(errors.businessUrl)}
          autoFocus
        />
        <span className="text-sm font-semibold text-clear-water-blue/[0.72]">
          {content.fields.businessUrl.helper}
        </span>
        <FieldErrorText error={errors.businessUrl} />
      </label>

      <label className={labelClassName}>
        <span>{content.fields.industry.label}</span>
        <select
          {...register("industry")}
          className={cn(inputClassName, "appearance-none")}
          aria-invalid={Boolean(errors.industry)}
        >
          <option value="">Select an industry</option>
          {content.fields.industry.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldErrorText error={errors.industry} />
      </label>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-pearl-white">
          {content.fields.customerVolume.label}
        </legend>
        <div className="grid gap-2 sm:grid-cols-5">
          {content.fields.customerVolume.options.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center text-sm font-extrabold transition",
                selectedRadioClass(
                  watchedValues.customerVolume === option.value,
                ),
              )}
            >
              <input
                {...register("customerVolume")}
                type="radio"
                value={option.value}
                className="sr-only"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FieldErrorText error={errors.customerVolume} />
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-pearl-white">
          {content.fields.requestMethod.label}
        </legend>
        <div className="grid gap-2">
          {content.fields.requestMethod.options.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition",
                selectedRadioClass(
                  watchedValues.requestMethod === option.value,
                ),
              )}
            >
              <input
                {...register("requestMethod")}
                type="radio"
                value={option.value}
                className="size-4 shrink-0 accent-reef-coral focus-visible:outline-reef-coral"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        <FieldErrorText error={errors.requestMethod} />
      </fieldset>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-pearl-white">
          {content.fields.tools.label}
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {content.fields.tools.options.map((option) => {
            const checked = selectedTools.includes(
              option.value as CustomerTool,
            );

            return (
              <label
                key={option.value}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition",
                  checked
                    ? "border-seafoam bg-seafoam text-deep-ocean-navy shadow-[0_14px_38px_rgb(191_239_227_/_0.16)]"
                    : "border-pearl-white/[0.14] bg-pearl-white/[0.07] text-pearl-white hover:border-seafoam/60",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  className="size-4 shrink-0 accent-seafoam focus-visible:outline-reef-coral"
                  onChange={(event) =>
                    updateToolSelection(
                      option.value as CustomerTool,
                      event.target.checked,
                    )
                  }
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
        <FieldErrorText error={errors.tools as FieldError | undefined} />
      </fieldset>

      <div>
        <label className="flex gap-3 rounded-lg border border-pearl-white/[0.12] bg-pearl-white/[0.06] p-4 text-sm font-semibold leading-6 text-pearl-white/[0.88]">
          <input
            {...register("complianceAccepted")}
            type="checkbox"
            className="mt-1 size-5 shrink-0 accent-reef-coral focus-visible:outline-reef-coral"
            aria-invalid={Boolean(errors.complianceAccepted)}
          />
          <span>{content.fields.compliance.label}</span>
        </label>
        <div className="mt-2">
          <FieldErrorText error={errors.complianceAccepted} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="motion-cta inline-flex min-h-14 w-full items-center justify-center rounded-full bg-reef-coral px-7 text-base font-extrabold text-deep-ocean-navy shadow-coral-glow transition hover:-translate-y-0.5 hover:bg-soft-coral-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral disabled:cursor-not-allowed disabled:opacity-60"
      >
        {content.submitButton}
      </button>
    </form>
  );
}

function selectedRadioClass(selected: boolean) {
  return selected
    ? "border-seafoam bg-seafoam text-deep-ocean-navy shadow-[0_14px_38px_rgb(191_239_227_/_0.16)]"
    : "border-pearl-white/[0.14] bg-pearl-white/[0.07] text-pearl-white hover:border-seafoam/60";
}
