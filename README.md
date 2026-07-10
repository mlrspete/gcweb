# Growth Specialists

Next.js website for the Growth Specialists Custom Review Capture System: a
one-off `$299 AUD` workflow audit, system design, implementation and handoff for
suitable small businesses.

The public flow does not take payment. A visitor completes an anonymous
first-stage fit check, sees a preliminary result, and can then choose to submit
contact details for manual review. There is no public Stripe integration;
accepted applicants receive any payment invitation separately.

## Stack

- Next.js App Router, React and strict TypeScript
- Tailwind CSS
- GSAP for reveal and journey motion
- React Three Fiber and Three.js for the frozen desktop hero scene
- Radix Accordion and Dialog
- React Hook Form, Zod and `@hookform/resolvers`
- Server Actions and a Resend-backed email adapter

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. In local development, a valid application returns
a development success when email settings are absent; the server logs only
non-sensitive categories.

## Scripts

| Command                       | Purpose                                     |
| ----------------------------- | ------------------------------------------- |
| `npm run dev`                 | Start the local development server          |
| `npm run format`              | Check Prettier formatting                   |
| `npm run format:write`        | Apply Prettier formatting                   |
| `npm run typecheck`           | Run TypeScript without emitting files       |
| `npm run lint`                | Run ESLint with zero warnings allowed       |
| `npm run check:frozen`        | Protect frozen header, hero and ticker copy |
| `npm run check:pivot-content` | Validate the canonical pivot content        |
| `npm run check:pivot`         | Validate final architecture and invariants  |
| `npm run build`               | Create a production Next.js build           |
| `npm run start`               | Serve the production build                  |

## Environment

Production application delivery requires:

- `NEXT_PUBLIC_SITE_URL`: public origin used for canonical URLs and sitemap
- `LEAD_TO_EMAIL`: recipient inbox for applications
- `LEAD_FROM_EMAIL`: verified sender address
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`: server-only Resend credential

`NEXT_PUBLIC_CONTACT_EMAIL` is optional and appears on policy pages when set.
The application does not currently load GA or GTM scripts and supports no
analytics ID environment variables. Its adapter safely forwards events only
when a runtime `dataLayer` or `gtag` already exists.

## Privacy And Analytics

Stage One remains in the browser and asks for no name, phone number or email.
Its answers reach the server only when the visitor submits Stage Two. Analytics
may contain fixed categories and boolean tool-presence flags, but never URLs,
email addresses, names, business names, notes, arbitrary text or raw form
objects. The full contract is in `docs/analytics-events.md`.

## Deployment

1. Configure the variables in `docs/env-checklist.md` for the preview and
   production environments.
2. Run every validation command in `docs/deployment-checklist.md`.
3. Deploy a preview, confirm it is not indexable, and submit a controlled email
   test without real customer information.
4. Verify canonical, social, schema, sitemap, robots and policy routes against
   the intended production origin.
5. Promote only after the legal and release gates are complete.

## Release Gates

The header, hero and signal ticker are intentionally frozen and protected by
`npm run check:frozen`; only approved anchor destinations may differ. Privacy,
Terms and Satisfaction Guarantee pages are present, but Australian legal review
of payment/refund wording and public compliance claims is required before
accepting payment invitations.
