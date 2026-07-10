# Repository Audit

## Snapshot

- Branch established for pivot work: `feature/custom-review-capture-system-pivot`.
- Starting commit: `7f02c16 Merge branch 'main' of https://github.com/mlrspete/gcweb`.
- Initial dirty state found before the branch switch:
  - Modified: `.github/workflows/nextjs.yml`
  - Modified: `.gitignore`
  - Modified: `README.md`
  - Modified: `docs/deployment-checklist.md`
  - Modified: `next-env.d.ts`
  - Untracked: `docs/vercel-migration.md`
- These pre-existing changes were preserved and not reset, discarded or overwritten.

## Framework And Package Versions

- Next.js App Router: `next` `^16.2.10`
- React: `react` / `react-dom` `^19.2.7`
- TypeScript: `^5.9.3`
- Tailwind CSS: `^3.4.17`
- ESLint: `^9.39.4` with `eslint-config-next` `^16.2.10`
- Prettier: `^3.9.4`
- GSAP: `^3.15.0`
- Three.js stack: `three` `0.182.0`, `@react-three/fiber` `^9.6.1`, `@react-three/drei` `^10.7.7`
- UI/form stack: Radix Accordion `^1.2.16`, Radix Dialog `^1.1.19`, Radix Label `^2.1.11`, React Hook Form `^7.81.0`, `@hookform/resolvers` `^5.4.0`, Zod `^4.4.3`
- Email/payment: custom Resend fetch adapter, `stripe` `^22.3.0`
- CI workflow uses Node `24` and runs install, format, typecheck, lint and build.

## Current Architecture

- `app/layout.tsx` defines the Manrope font, global metadata from `content/site.ts`, Open Graph/Twitter metadata and the `MotionProvider`.
- `app/page.tsx` is a server component that renders `JsonLd`, `SiteHeader`, every public landing section, `FAQSection`, `FinalCTASection` and `SiteFooter`.
- Content is centralized in `content/site.ts`, `content/sections.ts`, `content/faqs.ts`, `content/packages.ts` and `content/compliance.ts`, with shape definitions in `types/content.ts`.
- Reusable UI lives in `components/ui/*`, motion helpers in `components/motion/*`, visual primitives in `components/visuals/*`, and hero-specific WebGL/fallback assets in `components/hero/*`.
- GSAP loading and ScrollTrigger registration are abstracted through `lib/gsap.ts` and `hooks/useGSAPContext.ts`.
- Lead capture currently flows through `components/forms/JoinWaveForm.tsx`, `lib/validation/joinWaveSchema.ts`, `app/actions/joinWave.ts`, `lib/email/provider.ts` and `lib/email/resend.ts`.
- Optional public checkout is available through `app/api/checkout/route.ts` and `lib/stripe.ts`.
- SEO support is already present through `components/seo/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts` and metadata in `app/layout.tsx`.

## Reusable Systems

- Next.js App Router structure, metadata plumbing, sitemap/robots and JSON-LD component.
- Tailwind design tokens and existing palette in `app/globals.css`.
- `Section`, `GlassCard`, `Badge`, `Button`, `StatCard`, `Accordion` and `SectionHeader` UI conventions.
- `Reveal`, `Ticker`, `AnimatedCounter`, `SplitTextReveal`, `ParallaxFloat`, `MotionProvider`, `useGSAPContext`, `useReducedMotion` and `lib/gsap`.
- `BubbleField`, `FishIcon` and coral/ocean visual primitives, as long as the frozen hero/ticker are not visually changed.
- Email provider abstraction and Resend transport.
- No-op-safe analytics adapter pattern in `lib/analytics.ts`.
- Zod + React Hook Form pattern for validation and accessible form errors.

## Campaign-Specific Areas

- `app/page.tsx` currently renders many campaign-era sections that the pivot will replace below the ticker.
- `content/site.ts` metadata/nav copy still sells local visibility campaigns.
- `content/sections.ts`, `content/packages.ts`, `content/compliance.ts` and `content/faqs.ts` contain campaign-era positioning, package names, campaign-wave language, review-outcome targets and monthly reporting language.
- `components/sections/VisibilityGapSection.tsx`, `HowItWorksSection.tsx`, `OneServiceSection.tsx`, `CampaignExampleSection.tsx`, `PhilosophySection.tsx`, `ComplianceSection.tsx`, `WhyReviewsMatterSection.tsx`, `PackagesSection.tsx`, `SuitabilitySection.tsx`, `GuaranteesSection.tsx`, `DiscreetClientWorkSection.tsx` and `FinalCTASection.tsx` are public campaign-era sections.
- `components/forms/JoinWaveForm.tsx`, `app/actions/joinWave.ts` and `lib/validation/joinWaveSchema.ts` implement the current campaign-wave lead flow.
- `lib/stripe.ts`, `app/api/checkout/route.ts` and Stripe env vars support the current public checkout path.

## Frozen Files

The master plan freezes the public area from the top edge of the page through the bottom edge of the signal ticker. Frozen files are:

- `components/layout/SiteHeader.tsx`
- `components/sections/HeroSection.tsx`
- `components/hero/FishSchoolCanvas.tsx`
- `components/hero/HeroFallbackAnimation.tsx`
- `components/sections/SignalTicker.tsx`
- `components/motion/Ticker.tsx`
- hero-specific and ticker-specific rules in `app/globals.css`
- existing header, hero, floating-label and ticker content strings in `content/site.ts` and `content/sections.ts`

Only the permitted anchor destination changes may be made in this zone during later milestones.

## Dependencies That Can Ultimately Be Removed

- `stripe` can be removed when the public checkout route and campaign package payment flow are removed, unless a separate accepted-applicant payment flow is implemented immediately.
- Stripe environment variables in `.env.example` can be removed at the same time.
- `@radix-ui/react-dialog` and `@radix-ui/react-label` are currently not imported, but they are expected dependencies for the fit-check dialog and labelled fields in the pivot.
- The Three/R3F packages must remain because the frozen hero WebGL scene depends on them.

## Refactor Strategy

1. Keep the frozen header, hero, fish canvas, fallback animation and ticker visually/editorially intact. Permit only the anchor map described in the source of truth.
2. Introduce pivot content in a new `content/reviewSystem.ts` module rather than editing campaign content piecemeal.
3. Build new sections and visuals alongside existing components, then switch `app/page.tsx` to the final section order once replacements are ready.
4. Replace the public join-wave form with a two-stage fit-check dialog that defers server submission until Stage Two.
5. Reuse the email abstraction and analytics adapter, extending types/events without adding personal data to analytics payloads.
6. Remove campaign-era sections, content models, Stripe checkout route and dormant payment env vars only after replacement sections and application flow pass verification.
7. Update metadata/schema, footer links, legal docs and launch checklist after the visible pivot is complete and before accepting payment.

## Risks

- The working tree began dirty; unrelated modified/untracked files must remain separate from pivot commits unless explicitly intended.
- `README.md` and `.github/workflows/nextjs.yml` were already modified before this milestone, so QA failures involving them must be evaluated as possibly pre-existing.
- The public checkout route currently exists and is reachable, but Milestone 0 intentionally does not remove it.
- Footer legal links are placeholders.
- Existing QA hardening script targets the old campaign page structure and will need to be rewritten for the final pivot acceptance matrix.
