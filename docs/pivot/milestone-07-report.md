# Milestone 07 Report

Date: 2026-07-10
Branch: `feature/custom-review-capture-system-pivot`
Commit message: `chore: update pivot metadata and operations`

## Outcome

Milestone 7 is complete. Search, social, schema, analytics, public-route and
operational surfaces now describe the one-off Custom Review Capture System
consistently.

## Metadata And Schema

- Root search title, title template and description use the approved exact copy.
- Open Graph and Twitter use the approved social title and description with
  `summary_large_image`.
- Canonicals and metadata URLs remain environment-derived through
  `NEXT_PUBLIC_SITE_URL`, with the existing Vercel and local fallbacks.
- Manrope loading and the global `MotionProvider` structure were unchanged.
- Root JSON-LD remains a conservative `ProfessionalService` with a nested
  `Service` offer for `299 AUD`.
- The offer description states that the product is a workflow audit, system
  design, digital asset build, implementation and handoff.
- No rating, review, count, address, phone, award or promised-outcome schema was
  added.

## Open Graph Asset

Replaced `public/og-growth-specialists.png` because the previous image contained
`Local Visibility Campaigns` and the old wave motif.

Final asset:

- dimensions: `1200x630`;
- file size: 373,736 bytes;
- palette: Ocean Navy, Abyss Blue, Coral, Seafoam and Pearl White;
- text: `Growth Specialists`, `Custom Review Capture Systems`, and
  `Built around your customer journey`;
- exclusions: no campaign wording, rating stars, review counts, testimonials or
  third-party logos.

The built-in image-generation tool created the raster artwork. The normalized
generation prompt was:

```text
Create a premium 1200x630 Open Graph card for Growth Specialists using an Ocean
Navy and Abyss Blue underwater abstract background, restrained Coral and Seafoam
accents, organic directional currents and an elegant fish-school silhouette.
Use a strong left-aligned hierarchy with the exact text "Growth Specialists",
"Custom Review Capture Systems" and "Built around your customer journey".
Keep the artwork crisp and legible at social-card size. Do not include campaign
language or waves, rating stars, review counts, testimonials, third-party logos,
Google branding, badges, UI, borders or watermarks.
```

A precise follow-up edit removed an invented circular symbol while preserving
the wordmark text, typography, layout, currents, fish and required copy. The
final image was resized with a centre fit and palette compression; no generated
source file remains in the public directory.

## Analytics

- Retained only `cta_click`, fit-check and manual-review events.
- Added fixed `destination` values to CTA events so frozen labels point to the
  current review-system offer or journey in reporting.
- Documented event triggers, allowed properties, prohibited PII and expected
  funnel order in `docs/analytics-events.md`.
- Confirmed the adapter remains safe without GA or GTM.
- Removed unsupported GA/GTM ID placeholders from `.env.example` and active
  environment documentation.

## Routes And Sources

- Sitemap now contains only `/`, `/privacy`, `/terms` and
  `/satisfaction-guarantee`.
- Preview and development robots policies block indexing.
- Production robots allows public routes, excludes `/api/` and uses an
  environment-derived sitemap URL.
- BrightLocal statistic labels and the consolidated note now link to the 2026
  survey.
- Existing offer links point to BrightLocal and Google local-ranking guidance.
- Existing FAQ compliance wording points to Google's contribution policy.
- All three source destinations were rechecked on 2026-07-10 without adding new
  claims.

## Operations And Documentation

- Rewrote `README.md` for the current product, stack, scripts, setup, email,
  privacy, analytics, deployment, frozen-zone and legal-review requirements.
- Updated the environment, deployment, final-launch and QA documents.
- Deleted the obsolete `grubclub.gg` migration guide, which described the old
  join form and payment integration.
- Retained favicon and mark files because they contain no obsolete product
  wording.
- Expanded `check:pivot` to validate metadata, schema exclusions, event names,
  source URLs, sitemap/robots behavior, analytics documentation, unsupported
  environment variables and Open Graph dimensions.

## Verification

All required commands passed:

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm run check:frozen`
- `npm run check:pivot-content`
- `npm run check:pivot`
- `npm run build`

Built-output inspection confirmed:

- exactly one H1 on the root page;
- approved root search, Open Graph and Twitter values;
- unique `Privacy`, `Terms` and `Satisfaction Guarantee` titles;
- environment-derived canonicals;
- one parseable `ProfessionalService` JSON-LD block;
- service type, offer description, `299` price and `AUD` currency;
- no aggregate rating, review, address, phone or award schema;
- exactly four public sitemap entries;
- production robots allows `/`, disallows `/api/` and references the derived
  sitemap URL;
- the Open Graph PNG is exactly `1200x630`.

## Remaining Release Gates

- Milestone 8 browser, responsive, accessibility and performance hardening.
- Live preview email delivery and honeypot verification.
- Australian legal review before accepting payment invitations.
