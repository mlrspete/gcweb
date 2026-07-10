# Environment Checklist

Use this checklist when configuring Vercel or any production-like environment.

## Required

- `NEXT_PUBLIC_SITE_URL`
  - Production site origin.
  - Used for canonical URLs, sitemap, metadata and application source context.
- `LEAD_TO_EMAIL`
  - Inbox that receives Growth Specialists review-system applications.
- `LEAD_FROM_EMAIL`
  - Verified sender address from the email provider.
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`
  - Server-only email provider key.
  - `RESEND_API_KEY` is preferred by the current adapter.

## Optional

- `NEXT_PUBLIC_CONTACT_EMAIL`
  - Visible contact address for policy pages. If absent, the Privacy page instructs users to reply to application correspondence.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - Optional if a supported analytics script is installed separately.
- `NEXT_PUBLIC_GTM_ID`
  - Optional if a supported tag-manager script is installed separately.

## Notes

- There is no public checkout route and no Stripe dependency.
- Accepted applicants receive any payment invitation outside the public landing-page flow.
- Keep secret keys out of client-side code.
- Do not commit `.env.local`.
- In development, missing email provider settings return a development-mode success and log only non-sensitive categories.
