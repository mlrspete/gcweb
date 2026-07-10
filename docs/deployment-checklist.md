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

## Vercel Environment

- Add all production environment variables from `docs/env-checklist.md`.
- Set `NEXT_PUBLIC_SITE_URL` to the production origin.
- Redeploy production after changing `NEXT_PUBLIC_SITE_URL`.
- Confirm the project uses the intended Node.js/runtime defaults for Next.js.

## Email Provider

- Verify `LEAD_FROM_EMAIL` with the provider.
- Confirm `LEAD_TO_EMAIL` is the correct recipient inbox.
- Submit a controlled test application from the deployed site.
- Confirm the email subject is `New Growth Specialists review system application`.
- Confirm the email includes fit-check answers, result categories, contact details, timestamp, source page and compliance confirmation.
- Confirm honeypot submissions return success and send no email.

## Domain, SEO And Indexing

- Check `/`.
- Check `/privacy`.
- Check `/terms`.
- Check `/satisfaction-guarantee`.
- Check `/sitemap.xml`.
- Check `/robots.txt`.
- Confirm canonical metadata uses the production domain.
- Confirm Open Graph image resolves at `/og-growth-specialists.png`.
- Confirm favicon and app icon resolve.
- Check `/api/health` on the Vercel deployment if the route is retained.
- Confirm `/api/checkout` returns 404.

## Manual QA

- Check mobile at 360px and 390px.
- Check tablet at 768px.
- Check laptop and desktop at 1024px, 1440px and 1920px.
- Check reduced-motion mode.
- Check keyboard navigation through nav, CTAs, fit-check dialog and FAQ accordion.
- Check Chrome, Safari, Firefox and iOS Safari before launch.
- Confirm mobile navigation opens and closes cleanly.
- Confirm the fit-check Stage One has no name, email or phone fields.
- Confirm the Compliance nav opens FAQ 05.

## Launch Gate

- Do not accept payment invitations until Australian legal review is complete.
- Do not add a public checkout route.
- Do not add rating schema, fake testimonials or promised review outcomes.
