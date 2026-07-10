# Deployment Checklist

## Install And Validate

- Install dependencies with `npm install`.
- Run `npm run format`.
- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run check:frozen`.
- Run `npm run check:pivot-content`.
- Run `npm run check:pivot`.
- Run `npm run build`.

## Environment And Preview

- Configure the variables in `docs/env-checklist.md` without exposing values.
- Set `NEXT_PUBLIC_SITE_URL` to the intended origin and redeploy after changing
  it.
- Confirm preview deployments return a disallow-all robots policy.
- Confirm the production deployment allows public pages and disallows `/api/`.

## Email Provider

- Verify `LEAD_FROM_EMAIL` with Resend.
- Confirm `LEAD_TO_EMAIL` is the intended recipient inbox.
- Submit a controlled test application with synthetic contact data.
- Confirm the subject is `New Growth Specialists review system application`.
- Confirm the message includes fit-check answers, result categories, contact
  details, timestamp, source page and compliance confirmation.
- Confirm honeypot submissions return success and send no email.

## Metadata And Indexing

- Check `/`, `/privacy`, `/terms` and `/satisfaction-guarantee`.
- Check `/sitemap.xml` contains exactly those four public routes.
- Check `/robots.txt` uses the environment-derived sitemap URL.
- Confirm the root title, title template, canonical, description, Open Graph and
  Twitter values match `content/site.ts`.
- Confirm policy pages have unique titles and canonicals.
- Confirm `/og-growth-specialists.png` is a legible `1200x630` image.
- Validate the root JSON-LD serialization and the `$299 AUD` service offer.
- Confirm JSON-LD contains no ratings, reviews, counts, address, phone, awards or
  promised outcomes.
- Open the BrightLocal, Google ranking guidance and Google contribution policy
  links from the rendered page.

## Analytics And Privacy

- Inspect the event sequence against `docs/analytics-events.md`.
- Confirm fixed CTA labels use `destination` values for the review-system offer
  or journey.
- Confirm payloads contain no URL, email, contact name, business name, notes,
  arbitrary text or raw form object.
- Confirm the page works without GA, GTM or any analytics environment variable.

## Manual QA

- Check one H1 and a logical heading order.
- Check 360px, 390px, 768px, 1024px, 1440px and 1920px viewports.
- Check reduced-motion mode and keyboard navigation.
- Check the nav, fit-check dialog, FAQ accordion and Compliance hash link.
- Check Chrome, Safari, Firefox and iOS Safari before launch.
- Confirm Stage One has no name, email or phone fields.

## Launch Gate

- Complete Australian legal review before accepting payment invitations.
- Complete live email, accessibility, performance and cross-browser checks.
- Do not add rating schema, fake testimonials or promised review outcomes.
