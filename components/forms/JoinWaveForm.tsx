"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  useWatch,
  type FieldError,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";

import {
  submitJoinWave,
  type JoinWaveActionResult,
} from "@/app/actions/joinWave";
import { trackFormSubmit, trackPackageSelect } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  complianceStatement,
  joinWavePackages,
  joinWaveSchema,
  paidJoinWavePackages,
  type JoinWaveFormValues,
  type JoinWavePackage,
  type PaidJoinWavePackage,
} from "@/lib/validation/joinWaveSchema";

const defaultValues: JoinWaveFormValues = {
  businessName: "",
  website: "",
  googleBusinessProfile: "",
  serviceArea: "",
  industry: "",
  currentGoogleReviews: "",
  recentCustomers: "",
  packageName: "Not sure yet",
  notes: "",
  complianceAccepted: false,
  honeypot: "",
};

const inputClassName =
  "min-h-12 rounded-lg border border-pearl-white/[0.14] bg-pearl-white/[0.08] px-4 text-pearl-white outline-none transition placeholder:text-clear-water-blue/[0.38] focus-visible:border-reef-coral focus-visible:outline-reef-coral";

const labelClassName = "grid gap-2 text-sm font-bold text-pearl-white";

function isJoinWavePackage(value: string): value is JoinWavePackage {
  return joinWavePackages.some((packageName) => packageName === value);
}

function isPaidJoinWavePackage(value: string): value is PaidJoinWavePackage {
  return paidJoinWavePackages.some((packageName) => packageName === value);
}

function getPackageFromTrackingValue(value: string) {
  if (isJoinWavePackage(value)) {
    return value;
  }

  if (value === "foundation-wave") {
    return "Foundation Wave";
  }

  if (value === "momentum-wave") {
    return "Momentum Wave";
  }

  return null;
}

function FieldErrorText({ error }: { error?: FieldError }) {
  if (!error?.message) {
    return null;
  }

  return (
    <span className="text-xs font-bold text-soft-coral-pink" role="alert">
      {error.message}
    </span>
  );
}

function ErrorSummary({ errors }: { errors: FieldErrors<JoinWaveFormValues> }) {
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

export function JoinWaveForm() {
  const statusRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<JoinWaveActionResult | null>(null);
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "loading" | "unavailable" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JoinWaveFormValues>({
    resolver: zodResolver(joinWaveSchema, undefined, {
      raw: true,
    }) as Resolver<JoinWaveFormValues>,
    defaultValues,
    mode: "onTouched",
  });

  const selectedPackage = useWatch({
    control,
    name: "packageName",
  });
  const canCheckout = isPaidJoinWavePackage(selectedPackage);

  const sourcePage = useMemo(() => {
    if (typeof window === "undefined") {
      return "Unknown source page";
    }

    return window.location.href;
  }, []);

  useEffect(() => {
    const handlePackageClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const packageLink = target.closest<HTMLElement>("[data-package]");
      const packageTrackingValue =
        packageLink?.dataset.packageName || packageLink?.dataset.package;
      const packageName = packageTrackingValue
        ? getPackageFromTrackingValue(packageTrackingValue)
        : null;

      if (!packageName) {
        return;
      }

      trackPackageSelect(packageName);
      setValue("packageName", packageName, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      setCheckoutState("idle");
    };

    document.addEventListener("click", handlePackageClick);

    return () => {
      document.removeEventListener("click", handlePackageClick);
    };
  }, [setValue]);

  useEffect(() => {
    if (result) {
      statusRef.current?.focus();
    }
  }, [result]);

  async function onSubmit(values: JoinWaveFormValues) {
    setResult(null);
    setCheckoutState("idle");

    const response = await submitJoinWave(values, sourcePage);
    setResult(response);
    trackFormSubmit(response.ok ? response.mode : "error");

    if (!response.ok && response.fieldErrors) {
      for (const [field, message] of Object.entries(response.fieldErrors)) {
        if (!message) {
          continue;
        }

        setError(field as keyof JoinWaveFormValues, {
          type: "server",
          message,
        });
      }
    }
  }

  async function startCheckout() {
    if (!canCheckout) {
      return;
    }

    setCheckoutState("loading");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageName: selectedPackage }),
      });
      const data = (await response.json()) as {
        checkoutAvailable?: boolean;
        url?: string;
      };

      if (data.checkoutAvailable && data.url) {
        window.location.assign(data.url);
        return;
      }

      setCheckoutState("unavailable");
    } catch {
      setCheckoutState("error");
    }
  }

  return (
    <form
      id="join-form"
      className="grid gap-5"
      aria-label="Join the next wave form"
      onSubmit={handleSubmit(onSubmit, () =>
        trackFormSubmit("validation_error"),
      )}
      noValidate
    >
      <div
        ref={statusRef}
        tabIndex={-1}
        className={cn(
          "rounded-lg border p-4 text-sm font-bold leading-6 outline-none",
          result?.ok
            ? "border-seafoam/50 bg-seafoam/[0.14] text-seafoam"
            : result
              ? "border-reef-coral/50 bg-reef-coral/[0.12] text-soft-coral-pink"
              : "hidden",
        )}
        role={result ? (result.ok ? "status" : "alert") : undefined}
        aria-live={result?.ok ? "polite" : "assertive"}
      >
        {result?.message}
        {result?.ok && result.mode === "development" ? (
          <span className="mt-2 block text-xs text-clear-water-blue/[0.82]">
            Development mode: email delivery is not configured locally.
          </span>
        ) : null}
      </div>

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

      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClassName}>
          <span>Business name</span>
          <input
            {...register("businessName")}
            className={inputClassName}
            autoComplete="organization"
            aria-invalid={Boolean(errors.businessName)}
          />
          <FieldErrorText error={errors.businessName} />
        </label>

        <label className={labelClassName}>
          <span>Website</span>
          <input
            {...register("website")}
            className={inputClassName}
            type="url"
            inputMode="url"
            placeholder="https://example.com"
            autoComplete="url"
            aria-invalid={Boolean(errors.website)}
          />
          <FieldErrorText error={errors.website} />
        </label>

        <label className={labelClassName}>
          <span>Google Business Profile link</span>
          <input
            {...register("googleBusinessProfile")}
            className={inputClassName}
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-invalid={Boolean(errors.googleBusinessProfile)}
          />
          <FieldErrorText error={errors.googleBusinessProfile} />
        </label>

        <label className={labelClassName}>
          <span>Suburb / service area</span>
          <input
            {...register("serviceArea")}
            className={inputClassName}
            autoComplete="address-level2"
            aria-invalid={Boolean(errors.serviceArea)}
          />
          <FieldErrorText error={errors.serviceArea} />
        </label>

        <label className={labelClassName}>
          <span>Industry</span>
          <input
            {...register("industry")}
            className={inputClassName}
            autoComplete="organization-title"
            aria-invalid={Boolean(errors.industry)}
          />
          <FieldErrorText error={errors.industry} />
        </label>

        <label className={labelClassName}>
          <span>Current number of Google reviews</span>
          <input
            {...register("currentGoogleReviews")}
            className={inputClassName}
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            aria-invalid={Boolean(errors.currentGoogleReviews)}
          />
          <FieldErrorText error={errors.currentGoogleReviews} />
        </label>

        <label className={cn(labelClassName, "md:col-span-2")}>
          <span>Approximate number of recent customers</span>
          <input
            {...register("recentCustomers")}
            className={inputClassName}
            placeholder="Optional"
            aria-invalid={Boolean(errors.recentCustomers)}
          />
          <FieldErrorText error={errors.recentCustomers} />
        </label>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-bold text-pearl-white">
          Which package are you joining?
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {joinWavePackages.map((packageName) => (
            <label
              key={packageName}
              className={cn(
                "flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-lg border px-4 py-3 text-center text-sm font-extrabold transition",
                selectedPackage === packageName
                  ? "border-reef-coral bg-reef-coral text-deep-ocean-navy shadow-coral-glow"
                  : "border-pearl-white/[0.14] bg-pearl-white/[0.08] text-pearl-white hover:border-seafoam/60",
              )}
            >
              <input
                {...register("packageName")}
                type="radio"
                value={packageName}
                className="size-4 shrink-0 accent-reef-coral focus-visible:outline-reef-coral"
              />
              <span>{packageName}</span>
            </label>
          ))}
        </div>
        <FieldErrorText error={errors.packageName} />
      </fieldset>

      <label className={labelClassName}>
        <span>
          Anything we should know before building your experience page?
        </span>
        <textarea
          {...register("notes")}
          className={cn(inputClassName, "min-h-32 py-3")}
          aria-invalid={Boolean(errors.notes)}
        />
        <FieldErrorText error={errors.notes} />
      </label>

      <label className="flex gap-3 rounded-lg border border-pearl-white/[0.12] bg-pearl-white/[0.06] p-4 text-sm font-semibold leading-6 text-pearl-white/[0.86]">
        <input
          {...register("complianceAccepted")}
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-reef-coral focus-visible:outline-reef-coral"
          aria-invalid={Boolean(errors.complianceAccepted)}
        />
        <span>{complianceStatement}</span>
      </label>
      <FieldErrorText error={errors.complianceAccepted} />

      <button
        type="submit"
        data-cta="join-next-wave"
        disabled={isSubmitting}
        className="motion-cta inline-flex min-h-14 items-center justify-center rounded-full bg-reef-coral px-7 text-base font-extrabold text-deep-ocean-navy disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting..." : "Join the next wave"}
      </button>

      {result?.ok && canCheckout ? (
        <div className="rounded-lg border border-seafoam/[0.24] bg-pearl-white/[0.06] p-4">
          <p className="text-sm font-semibold leading-6 text-clear-water-blue/[0.84]">
            Your enquiry is captured. If you want to reserve the selected
            package now, secure checkout can be opened when payment settings are
            configured. Campaign suitability is reviewed before launch.
          </p>
          <button
            type="button"
            disabled={checkoutState === "loading"}
            className="motion-cta mt-4 inline-flex min-h-12 items-center justify-center rounded-full border border-seafoam/50 px-5 text-sm font-extrabold text-seafoam disabled:cursor-not-allowed disabled:opacity-60"
            onClick={startCheckout}
          >
            {checkoutState === "loading"
              ? "Opening checkout..."
              : `Continue to secure checkout for ${selectedPackage}`}
          </button>
          {checkoutState === "unavailable" ? (
            <p className="mt-3 text-xs font-bold text-clear-water-blue/[0.78]">
              Secure checkout is not configured yet. We will follow up with the
              next step.
            </p>
          ) : null}
          {checkoutState === "error" ? (
            <p className="mt-3 text-xs font-bold text-soft-coral-pink">
              Checkout could not be opened. We will follow up from your enquiry.
            </p>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
