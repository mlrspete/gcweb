# Analytics Events

`lib/analytics.ts` is the only public-page analytics adapter. It pushes to an
existing `window.dataLayer`, calls an existing `window.gtag`, and dispatches the
`growth-specialists:analytics` browser event for controlled integrations. The
site does not load GA or GTM and does not consume analytics ID environment
variables. Missing runtimes are therefore no-op-safe.

## Event Contract

| Event                     | Trigger                                      | Allowed properties                                                                            |
| ------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `cta_click`               | A tracked header or hero CTA is selected     | `label`, `location`, `destination`                                                            |
| `fit_check_opened`        | The fit-check dialog opens                   | `ctaLocation`                                                                                 |
| `fit_check_started`       | The visitor first changes a Stage One field  | `ctaLocation`, boolean tool-presence properties                                               |
| `fit_check_completed`     | Valid Stage One answers are evaluated        | Result, industry, volume, request-method and CTA categories; boolean tool-presence properties |
| `fit_result_viewed`       | The preliminary result is shown              | Result, industry, volume, request-method and CTA categories; boolean tool-presence properties |
| `manual_review_started`   | The visitor chooses to continue to Stage Two | Result, industry, volume, request-method and CTA categories; boolean tool-presence properties |
| `manual_review_submitted` | The application server action succeeds       | Result, industry, volume, request-method and CTA categories; boolean tool-presence properties |
| `manual_review_failed`    | The application server action fails          | Result, industry, volume, request-method and CTA categories; boolean tool-presence properties |

The category property names are `resultCategory`, `industryCategory`,
`customerVolumeRange`, `requestMethodCategory` and `ctaLocation`. Tool presence
uses the fixed string booleans `hasBookingSystem`, `hasCrm`,
`hasPosOrCheckout`, `hasInvoicingSoftware`, `hasEmailTool`, `hasSmsTool`,
`hasWebsiteFormOrCheckout`, `hasNoCustomerTools` and `hasOtherTool`.

For `cta_click`, `label` is the visible fixed CTA copy. `location` identifies
the fixed interface location and `destination` is either
`review-system-offer` or `review-system-journey`. None of these properties may
be populated from visitor input.

## Expected Funnel

```text
cta_click (optional)
  -> fit_check_opened
  -> fit_check_started
  -> fit_check_completed
  -> fit_result_viewed
  -> manual_review_started (optional)
  -> manual_review_submitted | manual_review_failed
```

The CTA event is optional because the pricing-card trigger opens the fit check
directly. Manual-review events are optional because a visitor may stop after the
preliminary result. Opens and failures may repeat during one browser session.

## Prohibited Data

No event may include:

- business or Google profile URLs;
- email addresses, contact names or business names;
- phone numbers;
- notes or other free text;
- query strings, page URLs or referrer values that could contain identifiers;
- raw form values, form objects, server responses or email-provider data;
- analytics user IDs derived from application data.

Only the enumerated categories, fixed labels, fixed locations, fixed
destinations and boolean tool-presence flags above are permitted.
