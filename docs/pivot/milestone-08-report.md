# Milestone 08 Report

Date: 2026-07-12
Branch: `feature/custom-review-capture-system-pivot`
Commit message: `fix: harden pivot experience`

## Outcome

Milestone 8 is complete at code level. The pivot now has a cross-platform,
production-browser QA harness; responsive, keyboard, reduced-motion, runtime and
API gates pass; and the remaining local Lighthouse performance limitation is
measured and documented without changing the approved frozen hero.

## QA Harness

Rebuilt `.codex-qa-hardening.cjs` around Chrome DevTools Protocol and Node.js
built-ins. It now:

- respects `CHROME_PATH` and checks common Windows, Linux and macOS locations;
- captures six required viewports plus mobile menu-open evidence;
- checks overflow, H1 count, section order, FAQ structure, hero mode, journey
  pinning, offer/form counts and footer links;
- exercises the complete fit-check, persistence, reset, manual-review and
  compliance paths;
- rejects forbidden analytics PII keys;
- validates the compliance hash, accordion keyboard operation, reduced motion,
  resize cleanup, console output, repeated dialog lifecycle and API routes; and
- writes machine-readable results and screenshots under the ignored
  `.codex-qa-artifacts` directory.

Added `npm run qa:pivot` and the complete `npm run validate` command.

## Product Hardening

- Mobile navigation closes with Escape and returns focus to its trigger.
- Dialog focus trapping and browser-managed trigger restoration are verified.
- Fit-check selection state has a visible check mark and is not color-only.
- Source links identify new-tab behavior in their accessible names.
- Compliance hash navigation waits for pinned-layout initialization and keeps
  FAQ 05 below the fixed header.
- The journey section heading remains available before its H3/H4 card hierarchy.
- The visible wordmark supplies its link name without a mismatched override.
- The journey eyebrow uses a darker brand-compatible coral that passes contrast.

## Objective Results

Final browser QA passed on Chrome `150.0.7871.101` at:

- `360x740`
- `390x844`
- `768x1024`
- `1024x900`
- `1440x1000`
- `1920x1080`

All widths had 0px horizontal overflow, one H1, seven FAQ triggers, correct
single/two-column behavior and the expected canvas/fallback/pin thresholds.
Reduced motion had no canvas, pin, hidden content or running animation. Console
issues and harness failures were both zero. `/api/checkout` returned 404.

## Accessibility And Performance

Final mobile Lighthouse:

- Accessibility: 100
- Best Practices: 100
- SEO: 100
- Performance: 68
- LCP: 3.88s
- TBT: 831ms
- CLS: 0

Performance varied from 64 to 68 on repeated local runs and remains below the
aspirational 85 target. A fit-dialog code-split trial did not materially improve
blocking time and was removed. The remaining cost is concentrated in the frozen
dynamic hero and client animation stack. Changing those would violate the
approved frozen-zone constraints, so the measured limitation is non-blocking
and must be monitored after deployment.

Lighthouse consistently wrote complete JSON reports but returned a Windows
`EPERM` while removing its temporary Chrome profile. This cleanup-only error did
not prevent score or audit inspection.

The clean install reports two moderate PostCSS advisories through Next.js. The
latest stable Next release remains `16.2.10`, and npm proposes a breaking
downgrade rather than a patched stable version. The app does not stringify
user-provided CSS at runtime, so this is documented as a monitored non-blocking
risk and no forced dependency change was made.

## Frozen-Zone Regression

Compared current 360, 390, 768, 1024, 1440 and 1920 screenshots with repository
baselines and frozen-copy checks. Public copy, layout, colors, spacing, CTA
labels and composition remain equivalent. Live WebGL frame positions naturally
vary. Mobile evidence includes both the untouched hero and menu-open state.

## Verification

Required gates:

- `npm run format:write`
- `npm run validate`
- local optimized production server
- `npm run qa:pivot`
- mobile Lighthouse and audit inspection

Detailed results are recorded in `docs/qa-report.md`.

## Remaining Release Gates

- Vercel preview and deployed smoke testing.
- Environment-variable presence audit without exposing values.
- Controlled real-email receipt and reply-to verification.
- Honeypot no-send verification.
- Production deployment and rollback record only after all gates pass.
- Australian legal review before accepting payment invitations.
