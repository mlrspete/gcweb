# Milestone 04 Report

## Branch

- Branch: `feature/custom-review-capture-system-pivot`
- Previous pivot commit: `3d273a6 feat: build review system journey`

## Files Created Or Updated

- Created: `components/sections/ReviewSystemOfferSection.tsx`
- Created: `components/forms/FitCheckDialog.tsx`
- Created: `components/forms/FitCheckForm.tsx`
- Created: `components/forms/FitCheckResult.tsx`
- Created: `app/actions/reviewSystemApplication.ts`
- Created: `docs/pivot/milestone-04-report.md`
- Updated: `app/page.tsx`
- Updated: `lib/email/provider.ts`
- Updated: `lib/analytics.ts`

No `.env.example` change was required in this milestone because the existing email variables cover the new application flow.

## Implementation Notes

- Replaced the rendered `PackagesSection` with `ReviewSystemOfferSection`.
- Removed the rendered `FinalCTASection` from the root page. The legacy files remain for the cleanup milestone.
- The offer section reads exact canonical offer copy from `reviewSystemContent.offer`.
- The price card renders one offer only, `$299 AUD`, all eleven deliverables, the visible guarantee inset and the visible scope note.
- The offer CTA opens a Radix Dialog and does not call `/api/checkout`.
- Stage One uses React Hook Form with `zodResolver(fitCheckSchema)` and stays entirely client-side.
- Stage One contains no name, phone, email or business-name field.
- Stage One stores a honeypot value locally and includes it only when the user submits Stage Two.
- The fit result is local guidance only. Both `potential-fit` and `manual-review` can proceed to manual review.
- Stage Two uses `manualReviewContactSchema`, asks for work email and optional non-phone details, and preserves values after failure.
- The server action revalidates the combined payload, recomputes the fit guidance server-side, handles honeypot submissions before email delivery and sends through the existing email provider abstraction.
- The new email subject is `New Growth Specialists review system application`.
- Review-system email HTML escapes output and makes the submitted business URL a clickable escaped link.
- Development-mode missing email configuration returns the approved success state and logs only non-sensitive categories/configuration presence.
- Production-mode missing email configuration returns the approved public failure state and does not pretend to send.
- Analytics helpers now cover the approved fit-check/application events with only category and tool-presence properties.

## Browser Findings

Headless Chrome inspected `http://localhost:3037` after `npm run build` and `next start -p 3037`.

Offer checks:

- `data-section="review-system-offer"` count: 1.
- `data-offer="custom-review-capture-system"` count: 1.
- `data-price="299-aud"` count: 1.
- Fit-check trigger count: 1.
- Old `#join-form` was not rendered.
- Visible package CTA hooks: 0.
- Checkout requests during interaction: 0.
- Desktop and 360px mobile dialog checks showed no horizontal overflow.

Fit-check interaction checks:

- CTA opened the dialog.
- Initial focus landed on `businessUrl`.
- Escape closed the dialog; after the trigger reveal completed, focus returned to the CTA.
- Closing and reopening during the contact step preserved `workEmail`.
- Stage One had zero email/name/phone inputs.
- Invalid URL was rejected.
- Compliance unchecked blocked progress.
- `5-19` plus `We do not ask` produced `potential-fit`.
- `0-4` produced `manual-review`.
- `We already use an automated system` produced `manual-review`.
- `None of these` deselected other tools, and choosing another tool deselected `None of these`.
- Result state used `role="status"` and `data-fit-result`.
- Contact stage had one work-email input and zero phone inputs.
- Production-mode missing email configuration showed the exact approved error state and preserved values.
- Honeypot submission showed the exact approved success state and skipped the provider path.
- `Start again` intentionally reset the flow.
- 360px mobile dialog stayed within viewport bounds.
- Browser console warnings/errors: 0.

Development email-configuration check:

- A separate `next dev -p 3038` run with email environment variables blank submitted a controlled application successfully.
- The UI showed `Application received.` and `No payment has been taken.`
- No production send was claimed for the development no-configuration path.

Analytics checks:

- Observed events included:
  - `fit_check_opened`
  - `fit_check_started`
  - `fit_check_completed`
  - `fit_result_viewed`
  - `manual_review_started`
  - `manual_review_submitted`
  - `manual_review_failed`
- Payload inspection found no URL, email, contact name, business name, notes or raw form object.
- Tool properties were boolean-presence strings only.

## Commands Run

- `npm.cmd run typecheck` - passed.
- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- `npm.cmd run format:write` - passed.
- `npm.cmd run format` - passed.
- `npm.cmd run check:frozen` - passed.
- `npm.cmd run check:pivot-content` - passed.

## Known Risks

- Later legacy campaign sections and the old campaign FAQ still render after the new offer section. This is intentional until Milestones 5 and 6.
- The public Stripe route and Stripe dependency still exist in the repository, but no rendered CTA or form calls checkout after this milestone. Removal is scheduled for the final integration cleanup milestone.
- Real email delivery with credentials was not performed locally. The production missing-configuration failure path and development no-configuration success path were verified.
- Browser QA used headless Chrome measurements rather than committed screenshot artifacts.

## Public-Facing Product Code

The new public change is limited to the offer/pricing slot and removal of the rendered final join form. The frozen header, hero, hero fish/fallback behavior, ticker copy, ticker duration and ticker visuals were not edited.
