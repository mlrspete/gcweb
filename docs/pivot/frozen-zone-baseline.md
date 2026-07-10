# Frozen-Zone Baseline

The frozen zone runs from the top edge of the website through the bottom edge of the scrolling signal ticker.

## Header

- Component path: `components/layout/SiteHeader.tsx`
- Wordmark: `growthspecialists`
- Home aria label: `Growth Specialists home`
- Desktop/mobile navigation labels:
  - `How it works`
  - `Compliance`
  - `Pricing`
  - `FAQ`
  - `Join Now`
- Header button label: `Join the next wave`
- Header microcopy: `No quote call. No long consultation. Just a clean campaign slot.`
- Current baseline anchor behavior:
  - Content source has `How it works` -> `#how-it-works`
  - Content source has `Compliance` -> `#compliance`
  - Component remaps `Pricing` -> `#pricing`
  - Content source has `FAQ` -> `#faq`
  - Component remaps `Join Now` -> `#join`
  - Header CTA links to `#pricing`

## Hero

- Component path: `components/sections/HeroSection.tsx`
- WebGL component path: `components/hero/FishSchoolCanvas.tsx`
- Fallback component path: `components/hero/HeroFallbackAnimation.tsx`
- Eyebrow: `LOCAL VISIBILITY FOR NEW & GROWING BUSINESSES`
- H1: `We help ambitious brands be seen by the people who matter most.`
- Subheading: `A done-for-you campaign system that helps suitable small businesses create genuine local experiences, collect honest feedback and build the visibility layer that makes customers more confident when they search.`
- Trust line: `No fake reviews. No paid ratings. No pressure tactics. Just real-world campaigns designed around genuine experience, honest feedback and long-term visibility.`
- Primary CTA label: `Join the next wave`
- Secondary CTA / scroll cue label: `See how it works`
- Current primary CTA anchor: `#pricing`
- Current secondary CTA anchor: `#how-it-works`
- Floating labels:
  - `More visible`
  - `More trusted`
  - `More recent proof`
  - `More local confidence`

## Signal Ticker

- Component path: `components/sections/SignalTicker.tsx`
- Motion component path: `components/motion/Ticker.tsx`
- Section id: `signal-ticker`
- Aria label: `Campaign signals`
- Duration: `34`
- Fish separators: enabled through `showFishIcon`
- Ticker phrases:
  - `REAL LOCAL EXPERIENCES`
  - `HONEST FEEDBACK`
  - `NO REVIEW BUYING`
  - `NO INCENTIVES FOR REVIEWS`
  - `DISCREET ACTIVATIONS`
  - `TAILORED EXPERIENCE PAGES`
  - `QUALITY LOCAL AUDIENCES`
  - `GOOGLE-SAFE REQUESTS`
  - `VISIBILITY MOMENTUM`
  - `BUILT FOR SMALL BUSINESS`

## Responsive Behavior

- Header is fixed, transparent over the hero at the top of the page, then switches after scroll to a Pearl White blurred background with Deep Ocean Navy text.
- Desktop header navigation and CTA show at `lg` and above; the compact menu button is used below `lg`.
- Mobile menu opens as a Pearl White panel under the fixed header and closes when a mobile link or CTA is selected.
- Hero uses `min-h-[100svh]`, ocean gradients, underwater rays, bubbles and a two-column desktop/tablet composition.
- The WebGL/fallback visual column is hidden below `md`; mobile renders `HeroFallbackAnimation` below the CTA group.
- Desktop/tablet hero visual occupies the right side with floating labels over the fish school.
- Signal ticker is a full-width Pearl White band with border-y styling and a continuously translated duplicated track.

## WebGL And Reduced-Motion Behavior

- `FishSchoolCanvas` is dynamically imported with `ssr: false`; `HeroFallbackAnimation` is used as the loading fallback.
- The hero checks:
  - viewport at least `768px`
  - WebGL support
  - hardware concurrency of at least 4 when available
  - device memory of at least 4 GB when available
  - reduced motion disabled
- Fine pointer devices get canvas parallax; other eligible devices get canvas without parallax.
- Reduced-motion users do not get the WebGL canvas.
- `useGSAPContext` skips animations when reduced motion is active.
- CSS reduced-motion rules effectively stop ticker translation, hero fallback fish/tail motion, hero label float, bubbles, light rays and reveal transforms.

## Guardrail

Only permitted invisible anchor destinations may change inside the frozen zone. Public copy, layout, visuals, fish composition, ticker phrases, ticker duration, WebGL gating and reduced-motion behavior are not to be visually or editorially changed.
