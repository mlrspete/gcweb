type AnalyticsEventName = "cta_click" | "form_submit" | "package_select";
type AnalyticsPayload = Record<string, string>;

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

export function trackFormSubmit(status: string) {
  emitAnalyticsEvent("form_submit", {
    status,
  });
}

export function trackPackageSelect(packageName: string) {
  emitAnalyticsEvent("package_select", {
    packageName,
  });
}
