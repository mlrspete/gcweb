# Pivot Build Plan

## Milestone 1 - Content Model And Page Skeleton

- Expected files: `content/reviewSystem.ts`, `types/content.ts`, `app/page.tsx`, `content/site.ts`, `components/layout/SiteHeader.tsx` anchor map only.
- Work: add the new source content, metadata draft, final section order placeholders and permitted frozen-zone anchors.
- Dependencies: Milestone 0 source of truth and frozen-copy checker.
- Risks: accidentally changing frozen copy or leaving legacy sections rendered.

## Milestone 2 - Review Collection Gap

- Expected files: `components/sections/ReviewCollectionGapSection.tsx`, `components/visuals/ReviewFlowDiagram.tsx`, `content/reviewSystem.ts`, possible section-level CSS utilities.
- Work: build the problem/statistics section and leakage-versus-flow SVG visual.
- Dependencies: content model and existing motion primitives.
- Risks: source labels must remain visible, diagram must not invent conversion numbers, mobile must avoid horizontal overflow.

## Milestone 3 - Program Journey

- Expected files: `components/sections/ReviewSystemJourneySection.tsx`, `components/visuals/ReviewSystemJourney.tsx`, `hooks/useGSAPContext.ts` usage only.
- Work: implement the two-lane journey with desktop pinning at 1024px and stacked tablet/mobile phases.
- Dependencies: GSAP infrastructure, reduced-motion behavior and palette primitives.
- Risks: pinning below desktop, hidden content after animation, overcomplicated mobile modules.

## Milestone 4 - Offer And Pricing

- Expected files: `components/sections/ReviewSystemOfferSection.tsx`, `content/reviewSystem.ts`, `lib/analytics.ts`.
- Work: render the single $299 AUD offer, impact modules, deliverables, CTA trigger and guarantee block.
- Dependencies: final content, animated counter primitive, future fit-check dialog entry point.
- Risks: implying guaranteed review outcomes, making checkout public, adding fake urgency animation.

## Milestone 5 - Fit Check Dialog

- Expected files: `components/forms/FitCheckDialog.tsx`, `components/forms/FitCheckForm.tsx`, `components/forms/FitCheckResult.tsx`, `lib/validation/reviewSystemApplicationSchema.ts`, `lib/analytics.ts`.
- Work: create the two-stage Radix Dialog, fit logic, client validation, session-preserved state and privacy-safe analytics.
- Dependencies: Radix Dialog/Label, React Hook Form, Zod, offer CTA.
- Risks: Stage One collecting personal data, analytics leaking URLs/names/email/notes, inaccessible multiselect controls.

## Milestone 6 - Application Server Action And Email

- Expected files: `app/actions/reviewSystemApplication.ts`, `lib/email/provider.ts`, `lib/email/resend.ts`, `lib/validation/reviewSystemApplicationSchema.ts`.
- Work: validate Stage Two server-side, handle honeypot, send the new application email and return generic spam success.
- Dependencies: fit-check schema and existing provider abstraction.
- Risks: sending Stage One data before explicit Stage Two submission, exposing free-text data in analytics/logs, breaking development-mode email behavior.

## Milestone 7 - FAQ, Footer, Legal Links And Compliance Anchor

- Expected files: `content/faqs.ts`, `components/sections/FAQSection.tsx`, `components/layout/SiteFooter.tsx`, legal route/docs/link targets as chosen.
- Work: replace FAQ copy, add stable item IDs, implement compliance hash opening, update footer copy and resolve Privacy/Terms/Satisfaction Guarantee links.
- Dependencies: final FAQ content and legal destination decision.
- Risks: Compliance link changing appearance in the frozen header, inaccessible accordion state, unresolved legal links.

## Milestone 8 - Remove Legacy Campaign Surface

- Expected files removed or detached: old campaign section components, `components/forms/JoinWaveForm.tsx`, `content/packages.ts`, `lib/validation/joinWaveSchema.ts`, `app/actions/joinWave.ts`, `app/api/checkout/route.ts`, `lib/stripe.ts`.
- Expected files updated: `package.json`, `package-lock.json`, `.env.example`, `README.md`, launch/QA docs.
- Work: remove dormant public checkout, Stripe dependency/env vars and old content that is no longer rendered or imported.
- Dependencies: replacement application flow verified.
- Risks: orphaned imports, accidentally deleting reusable UI, removing Stripe before a separate accepted-applicant flow exists.

## Milestone 9 - QA, Accessibility And Launch Readiness

- Expected files: `.codex-qa-hardening.cjs`, `docs/qa-report.md`, `docs/final-launch-report.md`, `README.md`, any legal/launch docs.
- Work: run format, typecheck, lint, build, frozen-copy check, browser QA at required viewports, reduced-motion checks, fit-check flow tests and email preview verification.
- Dependencies: all visible and backend pivot work complete.
- Risks: statistical sources must be reverified at launch, payment/refund terms require Australian legal review before accepting payments, preview email needs real provider credentials.
