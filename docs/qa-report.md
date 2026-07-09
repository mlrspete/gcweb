# Growth Specialists QA Report

Date: 2026-07-09

## What Was Checked

- Production build smoke-tested in headless Chrome at 360, 390, 768, 1024, 1440, and 1920 pixel viewport widths.
- Responsive layout checks covered horizontal overflow, mobile navigation, hero readability, WebGL/fallback behavior, pricing card stacking, FAQ columns, form controls, and desktop-only pinned How It Works behavior.
- Accessibility checks covered one rendered H1, heading counts, mobile menu disclosure state, FAQ trigger count, form label/control presence, focusable status messaging, decorative canvas focusability, and reduced-motion behavior.
- Animation checks covered reduced-motion disabling, reveal visibility, ScrollTrigger pinning below 900px, console warnings/errors, and production hydration smoke behavior.
- Performance checks covered dynamic WebGL isolation, mobile fallback rendering, lack of heavy image assets, and production console cleanliness.
- Compliance wording scan checked public source for the banned phrases requested in the QA brief.

## Issues Found

- The decorative React Three Fiber canvas could receive focus in some browser implementations.
- The current `three` r183+ line emits repeated `THREE.Clock` deprecation warnings through React Three Fiber internals, even when app code avoids direct clock usage.
- The mobile navigation QA assertion initially checked the menu before React had committed the state update. The actual menu opened correctly after a frame wait.
- Mobile nav toggle copy was accessible but generic.
- Form success and error messages used a polite status region for both outcomes.
- `npm audit --omit=dev` reports a moderate Next/PostCSS advisory. The available npm fix suggests a breaking framework change, so it was not forced during this QA hardening pass.

## Fixes Made

- Added `tabIndex={-1}` to the decorative hero canvas so it cannot enter the keyboard tab order.
- Switched hero fish frame timing away from direct `clock.getElapsedTime()` usage.
- Pinned `three` to `0.182.0` to avoid production console warnings until React Three Fiber no longer constructs the deprecated Three clock internally.
- Added a dynamic mobile nav label: "Open navigation menu" and "Close navigation menu".
- Strengthened mobile nav focus/hover styling without changing the visual design.
- Updated form result announcements so successful submissions use a polite `status` region and errors use an assertive `alert`.
- Added an assertive error summary for validation errors.

## Automated Results

- 360px mobile: no horizontal overflow, no WebGL canvas, fallback hero present, mobile menu opens, FAQ single-column, pricing stacks, pinned section disabled.
- 390px mobile: no horizontal overflow, no WebGL canvas, fallback hero present, mobile menu opens, FAQ single-column, pricing stacks, pinned section disabled.
- 768px tablet: no horizontal overflow, WebGL allowed, mobile menu opens, FAQ single-column, pricing stacks, pinned section disabled.
- 1024px laptop: no horizontal overflow, desktop nav active, FAQ two-column, pricing side-by-side, pinned How It Works active.
- 1440px desktop: no horizontal overflow, desktop nav active, WebGL active, pinned How It Works active.
- 1920px large desktop: no horizontal overflow, desktop nav active, WebGL active, pinned How It Works active.
- Reduced motion: `html[data-motion="reduced"]` set, WebGL disabled, reveal content visible, pinned sections disabled, no horizontal overflow.
- Production console: no warnings or errors captured after dependency pin.

## Compliance Review

- No exact matches were found for the eight banned phrases listed in the QA
  brief.
- Review-related copy remains framed around genuine local experiences, honest feedback, eligible review opportunities, non-incentivised review requests, public review pathways for eligible users, and clear disclaimers.

## Browser Assumptions

- Chrome was tested through a production build using headless Chrome.
- Safari, Firefox, and iOS Safari were reviewed by code and responsive constraints, but not physically run in native browsers during this pass.
- iOS-specific constraints considered: `100svh` hero sizing, touch mobile nav, no mandatory WebGL on mobile, native scroll, and reduced-motion CSS fallbacks.

## Remaining Known Limitations

- Final brand assets are still placeholders: favicon, app icons, OG image, fish/coral visuals, and abstract client tiles.
- Email delivery and Stripe Checkout remain environment-dependent placeholders until production keys and price IDs are configured.
- Privacy, Terms, and Refund Policy links remain placeholder destinations.
- The Next/PostCSS audit advisory should be revisited when a stable Next release provides a non-breaking fix.

## Launch Blockers

- No QA launch blockers were found in layout, accessibility smoke checks, animation gating, build output, or compliance wording.
- Before launch, run a final manual pass in real Safari/iOS Safari and Firefox, then verify live form delivery and Stripe mode with production environment variables.
