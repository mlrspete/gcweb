# Environment Checklist

Use this checklist when configuring Vercel or any production-like environment.

## Required

- `NEXT_PUBLIC_SITE_URL`
  - Production site origin, for example `https://example.com`.
  - Used for canonical URLs, sitemap, metadata, and Stripe redirect URLs.
- `LEAD_TO_EMAIL`
  - Inbox that receives Growth Specialists lead enquiries.
- `LEAD_FROM_EMAIL`
  - Verified sender address from the email provider.
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`
  - Server-only email provider key.
  - `RESEND_API_KEY` is preferred by the current adapter.

## Payment-Ready Stripe Variables

- `STRIPE_SECRET_KEY`
  - Server-only Stripe secret key.
  - Use test mode before live mode.
- `STRIPE_FOUNDATION_PRICE_ID`
  - Stripe Price ID for Foundation Wave at `$299`.
- `STRIPE_MOMENTUM_PRICE_ID`
  - Stripe Price ID for Momentum Wave at `$500`.

If Stripe variables are absent, the form still works and package CTAs still preselect the requested package. Checkout simply remains unavailable.

## Optional Analytics Placeholders

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - Placeholder for a future Google Analytics measurement ID.
- `NEXT_PUBLIC_GTM_ID`
  - Placeholder for a future Google Tag Manager container ID.

The current analytics helper is no-op safe. It emits browser events and supports existing `dataLayer` or `gtag` globals if another script provides them.

## Local Development Notes

- Copy `.env.example` to `.env.local`.
- Keep secret keys out of client-side code.
- Do not commit `.env.local`.
- In development, missing email provider settings return a development-mode success and log a safe summary.
