# Deployment Checklist

## Install And Build

- Install dependencies with `npm install`.
- Run `npm run format`.
- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run build`.

## Vercel Environment

- Add all production environment variables from `docs/env-checklist.md`.
- Set `NEXT_PUBLIC_SITE_URL` to the final domain origin.
- Configure the production domain in Vercel.
- Confirm the project uses the intended Node.js/runtime defaults for Next.js.

## Email Provider

- Verify `LEAD_FROM_EMAIL` with the provider.
- Confirm `LEAD_TO_EMAIL` is the correct recipient inbox.
- Submit a test lead from the deployed site.
- Confirm the email includes the selected package, timestamp, source page, and compliance checkbox value.

## Stripe

- Confirm Stripe starts in test mode.
- Confirm `STRIPE_FOUNDATION_PRICE_ID` maps to Foundation Wave at `$299`.
- Confirm `STRIPE_MOMENTUM_PRICE_ID` maps to Momentum Wave at `$500`.
- Test package selection and checkout session creation.
- Switch to live keys and live price IDs only after test checkout succeeds.

## Domain, SEO, And Indexing

- Check `/sitemap.xml`.
- Check `/robots.txt`.
- Confirm canonical metadata uses the production domain.
- Confirm Open Graph image resolves at `/og-growth-specialists.png`.
- Confirm favicon and app icon resolve.
- Check page title and description in the browser or deployed HTML.

## Manual QA

- Check mobile at 360px and 390px.
- Check tablet at 768px.
- Check laptop and desktop at 1024px, 1440px, and a large desktop width.
- Check reduced-motion mode.
- Check keyboard navigation through nav, CTAs, FAQ accordion, and form.
- Check Chrome, Safari, Firefox, and iOS Safari before launch.
- Confirm mobile navigation opens and closes cleanly.
- Confirm pricing CTAs preselect the correct package in the join form.
- Confirm form success and error states are announced and visible.

## Placeholder Replacement

- Replace placeholder Privacy, Terms, and Refund Policy links.
- Replace placeholder brand assets if final assets are supplied.
- Replace placeholder review-style cards only with approved client quotes.
- Confirm no fake clients, awards, ratings, or review schema are added.
