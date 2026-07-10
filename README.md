# Growth Specialists

Next.js landing page for the Growth Specialists Custom Review Capture System.

The public page keeps the frozen header, hero and signal ticker intact, then presents one offer: a `$299 AUD` one-off review-request system setup for suitable small businesses. The public site does not include checkout. Applicants submit a fit-check application and receive any payment invitation separately after manual review.

## Tech Stack

- Next.js App Router
- TypeScript with strict checking
- Tailwind CSS
- GSAP for reveal and journey motion
- React Three Fiber and Three.js for the frozen desktop hero scene
- Radix Accordion and Dialog
- React Hook Form, Zod and `@hookform/resolvers`
- Email provider abstraction with a Resend adapter

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Scripts

```bash
npm run format
npm run typecheck
npm run lint
npm run check:frozen
npm run check:pivot-content
npm run check:pivot
npm run build
npm run start
```

## Environment Variables

Required for production application delivery:

- `NEXT_PUBLIC_SITE_URL`
- `LEAD_TO_EMAIL`
- `LEAD_FROM_EMAIL`
- `RESEND_API_KEY` or `EMAIL_PROVIDER_API_KEY`

Optional:

- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GTM_ID`

## Product Notes

- The first fit-check stage stays client-side and requests no name, phone number or email.
- Application email is sent only after the user chooses to submit contact details in Stage Two.
- Analytics events must not include URLs, email addresses, contact names, business names, notes or raw form objects.
- The frozen header, hero and signal ticker copy are protected by `npm run check:frozen`.
- Pivot content counts and constraints are protected by `npm run check:pivot-content`.
- Final architecture and no-checkout invariants are protected by `npm run check:pivot`.

## Legal Gate

Privacy, Terms and Satisfaction Guarantee pages are present, but payment/refund wording and public compliance claims still require Australian legal review before accepting payment invitations.
