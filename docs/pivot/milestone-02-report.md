# Milestone 02 Report

## Branch

- Branch: `feature/custom-review-capture-system-pivot`
- Previous pivot commit: `8df4bc6 refactor: add review system content contracts`

## Files Created Or Updated

- Created: `components/sections/ReviewCollectionGapSection.tsx`
- Created: `components/visuals/ReviewFlowDiagram.tsx`
- Created: `docs/pivot/milestone-02-report.md`
- Updated: `app/page.tsx`
- Updated: `components/visuals/index.ts`
- Updated: `app/globals.css`

## Implementation Notes

- Replaced the rendered `VisibilityGapSection` with `ReviewCollectionGapSection`.
- Kept the legacy `VisibilityGapSection` file and all later legacy sections in place.
- The new section reads exact public copy from `reviewSystemContent.reviewCollectionGap`; no second copy was hardcoded into the component.
- Added a single semantic review-flow diagram instance so CSS-disabled reading does not duplicate list content.
- Diagram node text is real HTML list content. SVG paths and leak markers are decorative and contain no essential text.
- Added only narrowly scoped `review-flow-*` CSS utilities for connector lines; hero and ticker CSS rules were not edited.
- Statistics use `AnimatedCounter` and stable `data-stat` hooks for `97`, `47` and `65`.

## Browser Findings

Headless Chrome inspected `http://localhost:3034` after `npm run build` and `next start -p 3034`.

| Viewport | Overflow | Result                                                                                                                |
| -------- | -------: | --------------------------------------------------------------------------------------------------------------------- |
| 360px    |      0px | Passed. New section present, old `#visibility-gap` absent, mobile order copy -> diagram -> stats -> closing verified. |
| 390px    |      0px | Passed. New section present, no horizontal overflow, source/stat text minimum 14px.                                   |
| 768px    |      0px | Passed. Single review-flow panel, eight semantic nodes, two SVG paths, two leak markers.                              |
| 1024px   |      0px | Passed. Desktop two-column treatment active; diagram height measured 896px.                                           |
| 1440px   |      0px | Passed. Diagram height measured 868px; hero H1 and ticker phrases unchanged.                                          |
| 1920px   |      0px | Passed. Diagram height measured 868px; no console errors.                                                             |

Additional browser checks:

- Main order begins `hero`, `signal-ticker`, `review-system`, then the temporary legacy sections.
- `data-section="review-collection-gap"` exists.
- `data-review-flow-panel` count is 1.
- `data-review-flow-node` count is 8.
- `svg text` count inside the section is 0.
- CSS-disabled check retained the H2, one figure, eight list items and the exact caption as readable DOM text.
- Reduced-motion check showed `html[data-motion="reduced"]`, visible paths, zero hidden flow nodes and static leak markers with no transform.
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

- Later legacy campaign sections still render after the new gap section. This is intentional for Milestone 2.
- The public checkout route and join-wave form remain unchanged for later milestones.
- Browser QA used headless Chrome metrics rather than committed screenshot artifacts.
- The source note and statistic source labels are rendered from the canonical content, but statistical source currency still requires final launch verification.

## Public-Facing Product Code

Only the first post-ticker section changed. The frozen header, hero, hero fish/fallback behavior, ticker copy, ticker duration and ticker visuals were not edited.
