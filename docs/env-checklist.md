# Environment Checklist

Use this checklist for every Vercel preview and production-like environment.

## Required In Production

- `NEXT_PUBLIC_SITE_URL`
  - Set to the public site origin with no path.
  - Supplies canonical URLs, Open Graph URLs, sitemap entries and application
    source context.
- `LEAD_TO_EMAIL`
  - Inbox that receives review-system applications.
- `LEAD_FROM_EMAIL`
  - Sender address verified with Resend.
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`
  - Server-only Resend credential.
  - `EMAIL_PROVIDER_API_KEY` is a fallback variable name for the same current
    adapter, not a separate provider integration.

## Optional

- `NEXT_PUBLIC_CONTACT_EMAIL`
  - Visible contact address on policy pages.
  - When absent, the Privacy page directs applicants to reply to application
    correspondence.

## Analytics

No analytics environment variable is currently consumed. The site does not
load GA or GTM scripts. `lib/analytics.ts` is no-op-safe when neither a runtime
`dataLayer` nor `gtag` exists and must remain free of personal information.

## Configuration Safety

- Keep API keys server-only and out of logs, screenshots and browser bundles.
- Do not commit `.env.local` or production values.
- There is no public payment integration. Accepted applicants receive any
  payment invitation outside the landing-page flow.
- Missing email settings return a non-sensitive development-mode success only
  when `NODE_ENV` is not `production`.

The committed `.env.example` is the canonical variable-name reference.
