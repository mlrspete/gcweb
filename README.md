# Growth Specialists Landing Page

Premium one-page landing page for Growth Specialists, built around compliance-first local visibility campaigns, genuine local experiences, honest feedback, and clear conversion paths.

## Tech Stack

- Next.js App Router
- TypeScript with strict checking
- Tailwind CSS
- GSAP for subtle reveal and scroll motion
- React Three Fiber and Three.js for the decorative desktop hero scene
- React Hook Form, Zod, and `@hookform/resolvers`
- Stripe server SDK for optional checkout readiness
- Email provider abstraction with a Resend adapter

## Local Setup

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Run the dev server:

```bash
npm run dev
```

## Scripts

```bash
npm run format
npm run typecheck
npm run lint
npm run build
npm run start
```

## Environment Variables

Required for production:

- `NEXT_PUBLIC_SITE_URL`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`

Required only when Stripe Checkout is enabled:

- `STRIPE_SECRET_KEY`
- `STRIPE_FOUNDATION_PRICE_ID`
- `STRIPE_MOMENTUM_PRICE_ID`

Optional analytics placeholders:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GTM_ID`

See `docs/env-checklist.md` for deployment notes.

## Deployment Notes

- Deploy to Vercel as a Next.js App Router project.
- Add environment variables in Vercel before testing the join form.
- Configure the production domain and set `NEXT_PUBLIC_SITE_URL` to that origin.
- Confirm email delivery with a real test enquiry.
- Confirm Stripe in test mode before switching to live keys and live price IDs.
- Check `/sitemap.xml`, `/robots.txt`, metadata, Open Graph image, favicon, mobile layout, and reduced-motion mode.

## Compliance Wording Note

Keep public copy aligned with genuine local experiences, honest feedback, eligible review opportunities, non-incentivised review requests, public review pathways for eligible users, and private feedback pathways.

Do not add claims about controlled ratings, controlled review wording, fake customer proof, incentives for public reviews, or guaranteed platform treatment.

## Placeholder Replacement Notes

- Replace fish SVGs and coral visuals only if final brand illustrations are supplied.
- Replace `public/og-growth-specialists.png` with a final 1200 by 630 Open Graph image before launch if available.
- Replace `public/favicon.svg`, `public/apple-touch-icon.svg`, and `public/growth-specialists-mark.svg` with final approved brand assets if supplied.
- Replace placeholder client-work cards only with approved real quotes.
- Replace footer Privacy, Terms, and Refund Policy links with final legal URLs.
- Configure email provider keys and Stripe price IDs before testing production workflows.
