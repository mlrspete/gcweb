# Growth Specialists QA Report

Date: 2026-07-10

## Current Scope

This report reflects the integrated Custom Review Capture System pivot after legacy public sections and checkout code were removed.

## Automated Validation

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm run check:frozen`
- `npm run check:pivot-content`
- `npm run check:pivot`
- `npm run build`

## Key Acceptance Checks

- Root page renders the final order only: hero, signal ticker, review gap, journey, offer and FAQ.
- The frozen header, hero and ticker copy remain protected by `check:frozen`.
- The canonical pivot content remains protected by `check:pivot-content`.
- The integrated architecture, removed checkout route and legacy-term constraints are protected by `check:pivot`.
- The public offer shows one product and one price: `$299 AUD`.
- Stage One of the fit check contains no name, phone or email fields.
- `/privacy`, `/terms` and `/satisfaction-guarantee` resolve.
- `/api/checkout` returns 404 after build/start.

## Manual Browser Areas For Milestone 8

- Cross-viewport layout at 360, 390, 768, 1024, 1440 and 1920.
- Compliance hash opening FAQ 05.
- Fit-check dialog focus trapping, state persistence and failure preservation.
- Reduced-motion behavior for hero, review flow, journey, counters and FAQ.
- Console and hydration cleanliness.
- Lighthouse/accessibility/performance measurements.

## Remaining Known Limitations

- Final native browser and Lighthouse hardening is scheduled for Milestone 8.
- Real deployed email delivery is scheduled for the release milestone.
- Legal review remains required before accepting payment invitations.
