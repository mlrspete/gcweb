# Growth Specialists QA Report

Date: 2026-07-10

## Current Scope

This report covers the integrated Custom Review Capture System through
Milestone 7, including operational and machine-readable surfaces.

## Automated Validation

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm run check:frozen`
- `npm run check:pivot-content`
- `npm run check:pivot`
- `npm run build`

## Acceptance Checks

- Root page renders the approved final order and exactly one H1.
- Frozen header, hero and ticker copy remains protected.
- One `$299 AUD` offer is represented in both public copy and service schema.
- Stage One requests no name, phone number or email.
- Root metadata uses the approved search, Open Graph and Twitter copy.
- Policy pages have unique templated titles and canonical URLs.
- Open Graph artwork is `1200x630` and contains no ratings, counts or third-party
  logos.
- JSON-LD serializes validly and includes no rating or review schema.
- Sitemap exposes only `/`, `/privacy`, `/terms` and
  `/satisfaction-guarantee`.
- Preview robots block indexing; production robots allow public pages and
  disallow `/api/`.
- Source labels link to the approved BrightLocal and Google pages.
- Analytics taxonomy contains only generic CTA, fit-check and manual-review
  events, with no intended PII.
- The site remains functional when no analytics runtime is present.

## Manual Browser Areas For Milestone 8

- Cross-viewport layout at 360, 390, 768, 1024, 1440 and 1920 pixels.
- Compliance hash opening FAQ 05.
- Dialog focus trapping, state persistence and failure preservation.
- Reduced-motion behavior for hero, review flow, journey and counters.
- Console and hydration cleanliness.
- Lighthouse accessibility and performance measurements.
- Native-browser inspection of rendered metadata and JSON-LD.

## Remaining Known Limitations

- Final browser and Lighthouse hardening is scheduled for Milestone 8.
- Real deployed email delivery is a release task.
- Legal review remains required before accepting payment invitations.
