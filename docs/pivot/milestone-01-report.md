# Milestone 01 Report

## Branch

- Branch: `feature/custom-review-capture-system-pivot`
- Previous pivot baseline commit: `43db339 docs: establish review system pivot baseline`

## Files Created Or Updated

- Created: `content/reviewSystem.ts`
- Created: `lib/validation/reviewSystemApplicationSchema.ts`
- Created: `scripts/check-pivot-content.mjs`
- Created: `docs/pivot/content-map.md`
- Created: `docs/pivot/milestone-01-report.md`
- Updated: `types/content.ts`
- Updated: `package.json`

## Content Decisions

- All approved Custom Review Capture System copy now lives in `content/reviewSystem.ts`.
- The canonical module contains the gap, journey, offer, fit-check, FAQ, footer and legal content in one strongly typed object.
- BrightLocal and Google source URLs are structured metadata, not extra public prose.
- The offer is represented as a single-item tuple to prevent accidental second-tier offers.
- The legal block includes the public satisfaction guarantee copy, data-handling facts for later legal pages and `requiresLegalReview: true`.

## Type Decisions

- Legacy campaign content types remain in `types/content.ts` for the current page and are marked with `// Legacy campaign model: remove during integration milestone.`
- New review-system types use explicit section/content contracts and tuple lengths where the master plan requires exact counts.
- FAQ IDs are typed as a fixed union.
- The offer price type is constrained to the literal `$299 AUD`.
- No `any` types were added.

## Validation Decisions

- `fitCheckSchema` validates only business information, trims string inputs and rejects non-http URL protocols.
- Customer tools are optional, unique and enforce `None of these` as mutually exclusive.
- `manualReviewContactSchema` validates Stage Two contact fields separately from Stage One.
- `reviewSystemApplicationSchema` combines Stage One, preliminary result category and Stage Two contact data.
- `evaluateFit()` is pure guidance logic only. It returns `potential-fit` only for non-`0–4` volume plus no/manual/basic-link request methods, and `manual-review` otherwise.
- No phone field was introduced.

## Contract Checks

- Added `npm run check:pivot-content`.
- The checker uses Node built-ins only and reads the canonical TypeScript source.
- It verifies the product name, price, single-offer constraint, FAQ IDs, exact content counts, absence of Stage One personal-contact fields, absence of phone fields and required compliance/guarantee exclusions.

## Commands Run

- `npm.cmd run check:pivot-content` - initially failed because the checker treated `Email` as a customer-tool option as though it were a contact field.
- Updated the checker to inspect Stage One field IDs rather than option labels.
- `npm.cmd run check:pivot-content` - passed.
- `npm.cmd run typecheck` - passed.
- `npm.cmd run format:write` - passed; changed only new milestone files.
- `npm.cmd run format` - passed.
- `npm.cmd run typecheck` - passed.
- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- `npm.cmd run check:frozen` - passed.
- `npm.cmd run check:pivot-content` - passed.

## Known Risks

- The root page still renders the legacy campaign sections. This is intentional for Milestone 1.
- The public Stripe checkout route and legacy join-wave flow still exist. This milestone does not change checkout behavior.
- Footer legal destinations in the canonical pivot content are prepared as `/privacy`, `/terms` and `/satisfaction-guarantee`, but the route/page implementation is still future work.
- Existing unrelated dirty files from the pre-pivot workspace remain outside this milestone.
- Statistical URLs were added as metadata and should be reverified before launch, per the master plan.

## Public-Facing Product Code

No public architecture, current rendered sections, frozen header copy, hero copy, ticker copy, hero visuals, ticker visuals, legacy components or checkout behavior were changed.
