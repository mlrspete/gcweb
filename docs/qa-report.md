# Growth Specialists QA Report

Date: 2026-07-12
Branch: `feature/custom-review-capture-system-pivot`

## Test Environment

- Windows 10.0.26200 x64
- Node.js `v24.15.0`
- Next.js `16.2.10`
- Chrome `150.0.7871.101`
- Local optimized production build at `http://127.0.0.1:3000`
- Browser harness: `.codex-qa-hardening.cjs`

## Static Validation

The release validation command covers formatting, TypeScript, ESLint, frozen
copy, pivot content, pivot invariants and the production build:

```text
npm run validate
```

The browser gate is:

```text
npm run qa:pivot
```

## Viewport Results

| Viewport  | Overflow |  H1 | FAQ | Columns | Hero            | Pin spacers |
| --------- | -------: | --: | --: | ------: | --------------- | ----------: |
| 360x740   |      0px |   1 |   7 |       1 | static fallback |           0 |
| 390x844   |      0px |   1 |   7 |       1 | static fallback |           0 |
| 768x1024  |      0px |   1 |   7 |       1 | WebGL canvas    |           0 |
| 1024x900  |      0px |   1 |   7 |       2 | WebGL canvas    |           1 |
| 1440x1000 |      0px |   1 |   7 |       2 | WebGL canvas    |           1 |
| 1920x1080 |      0px |   1 |   7 |       2 | WebGL canvas    |           1 |

Every viewport also passed the final section order, all ten ticker phrases, one
`$299 AUD` product, one fit-check trigger, four customer steps, thirteen work
modules, six footer links, no checkout surface, no phone field and no Stage One
contact field. Policy pages had one visible H1 and no horizontal overflow.

## Interaction Results

- Mobile menu opened with Enter, closed with Escape and returned focus.
- Dialog initial focus, focus trap and return-to-trigger behavior passed.
- Stage One contained no name, email or phone input.
- Potential-fit and manual-review paths returned the expected categories.
- Work email appeared only after the preliminary result; no phone field appeared.
- Close/reopen preserved state and Start again cleared it.
- Missing compliance confirmation produced an alert and `aria-invalid="true"`.
- FAQ activation, ArrowDown, End and Home keyboard behavior passed.
- `/#faq-compliance` opened FAQ 05 and placed it below the fixed header, 305px
  from the top in the final run.
- Captured analytics contained all expected funnel events and no forbidden PII
  keys.
- `/api/checkout` returned 404 and `/api/health` returned 200.

## Motion And Runtime

- Reduced motion set `data-motion="reduced"`.
- Reduced motion had no visible canvas, hidden Reveal content, pin spacer,
  non-final journey state, hidden review-flow node or running animation.
- Resize checks produced exactly one pin at widths of 1024px and above, and none
  below 1024px, with no stale pin or overflow.
- Console warnings, errors and exceptions: 0.
- Repeated dialog open/close delta: -2 nodes, 0 listeners and approximately
  277KB heap growth. This did not indicate a retained DOM or listener leak.
- CLS was 0 at every custom-harness viewport.

## Accessibility Review

The static and browser review confirmed one H1, logical headings, named
landmarks, valid dialog title/description references, visible labels, error
announcements, `aria-invalid`, native accordion semantics, visible focus,
new-tab labels, no duplicate IDs and practical touch targets.

Lighthouse Accessibility scored 100 after:

- allowing the visible wordmark to supply its link name;
- keeping the journey H2 available before lower-level card headings; and
- changing the journey eyebrow to a darker coral with sufficient contrast.

## Performance Findings

Final local mobile Lighthouse results:

| Category/metric     | Result |
| ------------------- | -----: |
| Performance         |     68 |
| Accessibility       |    100 |
| Best Practices      |    100 |
| SEO                 |    100 |
| LCP                 |  3.88s |
| Total Blocking Time |  831ms |
| Speed Index         |  3.47s |
| CLS                 |      0 |

The Performance target of 85 was not met. Repeated local mobile runs scored
64-68. A trial split of the below-fold fit dialog reduced estimated unused
transfer by only about 9KiB and did not improve blocking time, so it was removed.
The remaining cost is dominated by frozen hero/client animation work. Reducing
that cost materially would change the explicitly frozen WebGL composition or
motion behavior. The custom harness recorded LCP between 560ms and 2.29s across
its six warm production-browser runs with CLS 0.

Lighthouse wrote valid reports but exited nonzero while deleting its Chrome
temporary profile on Windows (`EPERM`). Scores and audit data were preserved in
`.codex-qa-artifacts`; that directory is intentionally ignored.

`npm audit --omit=dev` reports two moderate findings for PostCSS bundled by
Next.js. The advisory concerns unsafe CSS stringification; this application does
not stringify user-supplied CSS at runtime. On 2026-07-12, `16.2.10` was still
the latest stable Next release and npm's proposed forced fix was a breaking
downgrade to Next 9. No forced downgrade was applied. This is a monitored,
non-blocking dependency risk pending a patched stable Next release.

The sub-85 local score is a documented, non-blocking launch risk because the
approved hero must remain dynamic, capability-gated and visually unchanged.
Field performance should be monitored after deployment. Accessibility, Best
Practices and SEO meet the requested thresholds.

## Frozen-Zone Comparison

Current screenshots were compared at 360, 390, 768, 1024, 1440 and 1920 pixels
against the repository baselines and frozen source assertions.

- Header, hero and ticker copy remained exact.
- Layout, colors, spacing, CTA labels and desktop composition remained
  equivalent.
- WebGL fish positions vary because the scene is live; composition and
  capability threshold were unchanged.
- Saved mobile baselines show the menu-open state. The final artifact set keeps
  both closed-page and open-menu screenshots for like-for-like inspection.
- The only frozen-zone behavior change is the approved anchor destination.

## Defects Found And Fixed

- Replaced obsolete multi-package QA assumptions with pivot assertions.
- Added cross-platform Chrome discovery and clear missing-browser errors.
- Fixed mobile menu Escape handling and focus return.
- Fixed dialog focus-driver coverage by using native pointer input.
- Added visible selected-state information that is not color-only.
- Added descriptive new-tab labels to source links.
- Stabilized compliance hash scrolling after ScrollTrigger initialization.
- Corrected accordion keyboard group boundaries and asynchronous focus timing.
- Corrected screenshot timing so untouched and menu-open states are separate.
- Removed two Lighthouse accessibility failures and corrected contrast.

## Remaining Limitations And Launch Blockers

No known code-level launch blocker remains from Milestone 8.

Production remains blocked until Milestone 9 proves:

- required Vercel environment variables are present at the correct scopes;
- the preview deployment passes the same browser and content gates;
- a controlled real application email is received with correct fields and
  reply-to behavior;
- the honeypot sends no email;
- production smoke tests pass; and
- Australian legal review is complete before accepting payment invitations.
