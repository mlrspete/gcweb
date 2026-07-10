# Milestone 05 Report - FAQ, Compliance Link, Footer and Policy Pages

## Summary

Milestone 5 replaced the rendered campaign FAQ with the canonical seven-item sales FAQ, added controlled accordion support for the compliance deep link, updated footer content and destinations, and added factual Privacy, Terms and Satisfaction Guarantee pages.

The frozen header copy and visual structure were not changed. Header changes were limited to permitted anchor destinations from `content/site.ts`.

## Branch

`feature/custom-review-capture-system-pivot`

## Files Changed

- `components/ui/Accordion.tsx`
- `components/sections/FAQSection.tsx`
- `components/layout/SiteHeader.tsx`
- `components/layout/SiteFooter.tsx`
- `components/legal/LegalPage.tsx`
- `content/site.ts`
- `content/legal.ts`
- `types/content.ts`
- `app/privacy/page.tsx`
- `app/terms/page.tsx`
- `app/satisfaction-guarantee/page.tsx`
- `app/globals.css`
- `.env.example`

## Implementation Notes

- `Accordion` now supports controlled `value` / `onValueChange`, retains `defaultValue`, and supports stable per-item DOM IDs.
- Accordion visual language is preserved: thin dividers, Coral numbering, circular arrow control, typography, and focus treatment.
- Accordion content height now animates with Radix CSS variables and respects reduced-motion preferences.
- `FAQSection` consumes `reviewSystemContent.faq` and renders exactly seven canonical FAQ items.
- FAQ 05 uses `id="faq-compliance"` and opens from direct hash load, `hashchange`, and repeated Compliance-nav clicks.
- FAQ 05 links the approved Google policy phrase to `https://support.google.com/contributionpolicy/answer/7400114?hl=en` without changing the visible phrase.
- Footer now consumes `reviewSystemContent.footer`, uses the new policy routes, and includes `data-site-footer`.
- Policy pages are factual implementation pages with no heavy animation, no invented phone/address/contact details, and unique metadata.
- `content/site.ts` exposes `contactEmail` only when `NEXT_PUBLIC_CONTACT_EMAIL` is configured. Without it, the Privacy page uses the factual fallback: "Reply to any application correspondence from Growth Specialists to make a privacy request."

## Anchor Destinations

- `How it works` -> `#how-it-works`
- `Compliance` -> `#faq-compliance`
- `Pricing` -> `#pricing`
- `FAQ` -> `#faq`
- `Join Now` -> `#pricing`
- Header CTA remains `#pricing`

## Browser Findings

Tested against a local production server at `http://localhost:3015`.

- Desktop FAQ trigger count: 7.
- Desktop FAQ item count: 7.
- Desktop FAQ columns at 1440px: 2.
- Tablet FAQ columns at 768px: 1.
- Direct navigation to `/#faq-compliance` opened FAQ 05 and scrolled it below the fixed header.
- Desktop Compliance nav click opened FAQ 05 and set the hash to `#faq-compliance`.
- Browser history back/forward after the Compliance hash remained usable.
- All seven FAQ triggers opened and closed with keyboard Space activation.
- Footer link count: 6.
- `/privacy`, `/terms`, and `/satisfaction-guarantee` returned HTTP 200.
- Policy pages expose unique title/description metadata.
- Policy pages did not expose source TODO or draft language.
- Rendered FAQ did not include old campaign FAQ questions.
- Browser console warnings/errors during the tested paths: 0.

## Checks Run

- `npm.cmd run format:write` - passed.
- `npm.cmd run format` - passed.
- `npm.cmd run typecheck` - passed.
- `npm.cmd run lint` - passed after deferring initial hash handling outside the effect body.
- `npm.cmd run build` - passed.
- `npm.cmd run check:frozen` - passed.
- `npm.cmd run check:pivot-content` - passed.

## Known Risks

- The root page still intentionally contains later legacy sections until Milestone 6 performs the destructive final integration and cleanup.
- Site metadata still contains pre-pivot campaign wording; this is scheduled for Milestone 7.
- Stripe and old checkout routes remain in the repository by design until Milestone 6.
- Policy wording is factual but still requires Australian legal review before accepting payment invitations.

## Acceptance Confirmation

- Final seven sales-closing FAQs are rendered from canonical content.
- Compliance navigation opens the correct FAQ item.
- Footer matches the new product positioning and policy routes.
- Footer policy links resolve.
- Policy pages reflect the implemented fit-check and application flow without invented legal terms.
- Frozen copy check passes.
