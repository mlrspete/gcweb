# Milestone 03 Report

## Branch

- Branch: `feature/custom-review-capture-system-pivot`
- Previous pivot commit: `95c51ac feat: build review collection gap`

## Files Created Or Updated

- Created: `components/sections/ReviewSystemJourneySection.tsx`
- Created: `components/visuals/ReviewSystemJourney.tsx`
- Created: `docs/pivot/milestone-03-report.md`
- Updated: `app/page.tsx`
- Updated: `components/visuals/index.ts`
- Updated: `app/globals.css`

## Implementation Notes

- Replaced the rendered legacy `HowItWorksSection` with `ReviewSystemJourneySection`.
- Kept the legacy `HowItWorksSection.tsx` file in place for the later cleanup milestone.
- The new section renders exact journey copy from `reviewSystemContent.journey`.
- The heading and intro stay outside the pinned panel; the bottom statement stays after the panel in normal document flow.
- The journey panel uses one semantic structure across desktop, tablet and mobile. There is no duplicated desktop/mobile content exposed to assistive technology.
- Customer actions render as four ordered phase cards with `data-customer-step="1"` through `4`.
- Growth Specialists work renders as thirteen list modules grouped under Diagnose, Map, Build, and Validate and hand over.
- Decorative fish/current/glow elements are `aria-hidden`.
- Desktop animation uses existing GSAP and ScrollTrigger only, with `gsap.matchMedia()` cleanup inside `useGSAPContext`.
- Pinning starts at 1024px and above, with `start: "top top+=88"`, `end: "+=2600"`, `scrub: 0.8`, `anticipatePin: 1`, and `invalidateOnRefresh: true`.
- Reduced-motion users receive the static, fully visible structure with no travelling fish, no pin spacer and no current animation.
- Added only scoped `review-journey-*` utilities to `app/globals.css`; frozen hero/ticker rules were not edited.

## Browser Findings

Headless Chrome inspected `http://localhost:3036` after `npm run build` and `next start -p 3036`.

| Viewport | Overflow | Customer steps | Work modules | Pin spacers | Result                                                                                     |
| -------- | -------: | -------------: | -----------: | ----------: | ------------------------------------------------------------------------------------------ |
| 360px    |      0px |              4 |           13 |           0 | Passed. Stacked mobile structure, no horizontal overflow, minimum journey text size 14px.  |
| 390px    |      0px |              4 |           13 |           0 | Passed. Stacked mobile structure, no horizontal overflow, bottom statement present in DOM. |
| 768px    |      0px |              4 |           13 |           0 | Passed. Static tablet structure, dark journey panel retained.                              |
| 1023px   |      0px |              4 |           13 |           0 | Passed. No tablet pin spacer.                                                              |
| 1024px   |      0px |              4 |           13 |           1 | Passed. Desktop pin initialized at the breakpoint.                                         |
| 1440px   |      0px |              4 |           13 |           1 | Passed. Pinned panel cleared the fixed header.                                             |
| 1920px   |      0px |              4 |           13 |           1 | Passed. Desktop layout remained stable.                                                    |

Additional browser checks:

- `data-section="review-system-journey"` exists.
- `data-journey-panel` count is 1.
- `data-work-phase` count is 4.
- `data-work-module` count is 13.
- `data-journey-current` count is 4.
- Old campaign journey text was not present inside the new journey section.
- Resizing across `1440 -> 900 -> 1200 -> 1023 -> 1024 -> 900` left one pin spacer only at widths of 1024px and above, and zero below 1024px.
- Reduced-motion mode produced zero pin spacers, zero hidden customer steps, zero hidden work modules, hidden travelling fish and no horizontal overflow.
- Scrolling through the desktop pin released normally; the footer was reachable at document bottom.
- Browser console warnings/errors: 0.

## Commands Run

- `npm.cmd run typecheck` - passed.
- `npm.cmd run lint` - passed.
- `npm.cmd run format:write` - passed.
- `npm.cmd run format` - passed.
- `npm.cmd run build` - passed.
- `npm.cmd run check:frozen` - passed.
- `npm.cmd run check:pivot-content` - passed.

## Known Risks

- Later legacy campaign sections still render after the new journey section. This is intentional for Milestone 3.
- The public checkout route, legacy package sections and join-wave form remain unchanged for later milestones.
- Browser QA used headless Chrome measurements rather than committed screenshot artifacts.
- The active-phase glow and current animation are intentionally restrained; later visual QA can tune intensity without changing copy or structure.

## Public-Facing Product Code

Only the second post-ticker section changed. The frozen header, hero, hero fish/fallback behavior, ticker copy, ticker duration and ticker visuals were not edited.
