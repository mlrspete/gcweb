import type {
  CustomerTool,
  CustomerVolumeRange,
  Industry,
  PreliminaryResultCategory,
  RequestMethod,
} from "@/lib/validation/reviewSystemApplicationSchema";

type AnalyticsEventName =
  | "cta_click"
  | "fit_check_opened"
  | "fit_check_started"
  | "fit_check_completed"
  | "fit_result_viewed"
  | "manual_review_started"
  | "manual_review_submitted"
  | "manual_review_failed";
type AnalyticsPayload = Record<string, string>;

type FitCheckAnalyticsInput = {
  resultCategory?: PreliminaryResultCategory;
  industryCategory?: Industry;
  customerVolumeRange?: CustomerVolumeRange;
  requestMethodCategory?: RequestMethod;
  tools?: readonly CustomerTool[];
  ctaLocation?: string;
};

type AnalyticsWindow = Window & {
  dataLayer?: Array<Record<string, string>>;
  gtag?: (
    command: "event",
    eventName: string,
    payload: AnalyticsPayload,
  ) => void;
};

function emitAnalyticsEvent(
  eventName: AnalyticsEventName,
  payload: AnalyticsPayload,
) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  const eventPayload = {
    event: eventName,
    ...payload,
  };

  analyticsWindow.dataLayer?.push(eventPayload);
  analyticsWindow.gtag?.("event", eventName, payload);
  window.dispatchEvent(
    new CustomEvent("growth-specialists:analytics", {
      detail: eventPayload,
    }),
  );
}

export function trackCTAClick(label: string, location: string) {
  emitAnalyticsEvent("cta_click", {
    label,
    location,
  });
}

function getToolPresencePayload(tools: readonly CustomerTool[] = []) {
  const selectedTools = new Set(tools);

  return {
    hasBookingSystem: String(selectedTools.has("Booking system")),
    hasCrm: String(selectedTools.has("CRM")),
    hasPosOrCheckout: String(selectedTools.has("POS or checkout")),
    hasInvoicingSoftware: String(selectedTools.has("Invoicing software")),
    hasEmailTool: String(selectedTools.has("Email")),
    hasSmsTool: String(selectedTools.has("SMS")),
    hasWebsiteFormOrCheckout: String(
      selectedTools.has("Website form or online checkout"),
    ),
    hasNoCustomerTools: String(selectedTools.has("None of these")),
    hasOtherTool: String(selectedTools.has("Other")),
  };
}

function getFitCheckAnalyticsPayload(input: FitCheckAnalyticsInput = {}) {
  return {
    ...(input.resultCategory ? { resultCategory: input.resultCategory } : {}),
    ...(input.industryCategory
      ? { industryCategory: input.industryCategory }
      : {}),
    ...(input.customerVolumeRange
      ? { customerVolumeRange: input.customerVolumeRange }
      : {}),
    ...(input.requestMethodCategory
      ? { requestMethodCategory: input.requestMethodCategory }
      : {}),
    ...(input.ctaLocation ? { ctaLocation: input.ctaLocation } : {}),
    ...getToolPresencePayload(input.tools),
  };
}

export function trackFitCheckOpened(ctaLocation: string) {
  emitAnalyticsEvent("fit_check_opened", {
    ctaLocation,
  });
}

export function trackFitCheckStarted(input: FitCheckAnalyticsInput = {}) {
  emitAnalyticsEvent("fit_check_started", getFitCheckAnalyticsPayload(input));
}

export function trackFitCheckCompleted(input: FitCheckAnalyticsInput) {
  emitAnalyticsEvent("fit_check_completed", getFitCheckAnalyticsPayload(input));
}

export function trackFitResultViewed(input: FitCheckAnalyticsInput) {
  emitAnalyticsEvent("fit_result_viewed", getFitCheckAnalyticsPayload(input));
}

export function trackManualReviewStarted(input: FitCheckAnalyticsInput) {
  emitAnalyticsEvent(
    "manual_review_started",
    getFitCheckAnalyticsPayload(input),
  );
}

export function trackManualReviewSubmitted(input: FitCheckAnalyticsInput) {
  emitAnalyticsEvent(
    "manual_review_submitted",
    getFitCheckAnalyticsPayload(input),
  );
}

export function trackManualReviewFailed(input: FitCheckAnalyticsInput) {
  emitAnalyticsEvent(
    "manual_review_failed",
    getFitCheckAnalyticsPayload(input),
  );
}
