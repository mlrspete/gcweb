# Growth Specialists — Final Website Pivot Master Plan

## 1. Final Strategic Direction

### The pivot

The website must stop selling coordinated promotional campaigns, activations, campaign waves, audience matching, review opportunity targets and monthly campaign reporting.

Below the existing hero and ticker, the website must sell one clear product:

# Custom Review Capture System

A one-off, tailored implementation service that identifies where a small business is currently leaving genuine Google reviews on the table, then designs and installs a repeatable review-request process around the business’s existing customer journey, tools and operational workflow.

### Offer name used publicly

**Custom Review Capture System**

### Price

**$299 AUD one-off**

### Core promise

Growth Specialists does not create, purchase, coordinate or guarantee reviews. It builds the process that helps a business ask genuine customers for honest feedback more consistently, at appropriate moments, through appropriate channels.

### The customer’s simple mental model

> You tell us how customers move through your business.  
> We find the missed review-request moments.  
> We build the right system around them.  
> You approve it, learn it in 20 minutes and start using it.

### What the $299 buys

The customer is paying for the diagnosis, operational mapping, compliance decisions, copywriting, web-development work, digital asset production, standard implementation, testing and handoff required to create a system that fits naturally inside the business.

The customer is not paying for:

- a number of reviews;
- a star rating;
- review wording;
- Google publication;
- purchased or coordinated reviewers;
- a generic QR code;
- a downloadable template pack;
- an agency retainer;
- an ongoing campaign.

---

## 2. Non-Negotiable Frozen Area

Everything from the top edge of the website through the bottom edge of the scrolling signal ticker is frozen.

This includes:

1. Desktop and mobile header layout.
2. Wordmark.
3. Navigation labels.
4. Header microcopy.
5. Header button label.
6. Hero eyebrow.
7. Hero headline.
8. Hero subheading.
9. Hero trust statement.
10. Both hero button labels.
11. Hero fish composition.
12. Coral standout fish.
13. Floating labels.
14. WebGL capability checks.
15. Mobile and reduced-motion fallback.
16. Ocean gradients.
17. Light rays.
18. Bubbles.
19. GSAP entrance timing.
20. Exact responsive layout.
21. Signal ticker design.
22. Signal ticker phrases.
23. Ticker duration, fish separators and reduced-motion fallback.

### Frozen components

Do not visually or editorially alter:

- `components/layout/SiteHeader.tsx`
- `components/sections/HeroSection.tsx`
- `components/hero/FishSchoolCanvas.tsx`
- `components/hero/HeroFallbackAnimation.tsx`
- `components/sections/SignalTicker.tsx`
- `components/motion/Ticker.tsx`
- hero-specific and ticker-specific rules in `app/globals.css`
- the existing hero and ticker content strings

### Permitted invisible navigation changes

The only permitted changes inside the frozen area are anchor destinations:

- `How it works` → `#how-it-works`
- `Compliance` → `#faq-compliance`
- `Pricing` → `#pricing`
- `FAQ` → `#faq`
- `Join Now` → `#pricing`
- Header CTA → `#pricing`
- Hero primary CTA → `#pricing`
- Hero secondary CTA → `#how-it-works`

The `Compliance` link should scroll to the FAQ and automatically open the compliance question. This changes behaviour only, not appearance or wording.

### Important legacy-language decision

The frozen ticker still contains campaign-era phrases such as `DISCREET ACTIVATIONS` and `QUALITY LOCAL AUDIENCES`, and the frozen hero refers to a `campaign system`. Those phrases must not be repeated or reinforced anywhere below the ticker. All new sections must clearly establish the new systems offer.

---

## 3. Final Page Architecture

The final page order is:

1. Header — unchanged
2. Hero — unchanged
3. Signal ticker — unchanged
4. **The Review Collection Gap**
5. **How the Program Works**
6. **$299 Custom Review Capture System**
7. **Sales-Closing FAQ**
8. Footer

No other main-page sections should remain.

### Sections removed from the public page

Remove:

- current Visibility Gap section;
- current campaign-system journey;
- One System / Many Business Types;
- Campaign Example;
- Philosophy;
- standalone Compliance section;
- standalone Why Reviews Matter section;
- Foundation Wave and Momentum Wave packages;
- Suitability section;
- Guarantees section;
- Discreet Client Work section;
- current Final CTA and Join Wave form.

Relevant ideas from those sections are redistributed into the three new sections and FAQ rather than retained as separate page blocks.

---

# 4. Section One — The Review Collection Gap

## Purpose

This is the shortest explanatory section. It must answer three questions quickly:

1. What is the problem?
2. What does Growth Specialists build?
3. Why does it matter?

It should occupy approximately one desktop viewport, not become another long information section.

## Section identity

**ID:** `review-system`  
**Eyebrow:** `THE REVIEW COLLECTION GAP`

## Exact public copy

### H2

**Happy customers do not automatically become Google reviews.**

### Main body

Most small businesses do not have a review problem. They have a process problem. The request is late, inconsistent, awkward, buried in a generic link — or left to a busy staff member to remember.

Growth Specialists audits the way customers move through your business, finds the moments where genuine reviews are being left on the table, and builds a tailored review collection system into the workflow you already use.

### Highlight line

**Not a campaign. Not a generic template. A working review collection system built around your business.**

### Closing line

**One setup. A repeatable way to ask. Less left to chance.**

## Exact statistic copy

Use three compact statistic modules. Each statistic must include a visible source label and the section must include one consolidated source note.

### Statistic 1

**97%**

of U.S. consumers surveyed read reviews for local businesses.

### Statistic 2

**47%**

said they would not use a business with fewer than 20 reviews.

### Statistic 3

**65%**

of consumers who were asked to write a review in the previous year said they did.

### Source note

Source: BrightLocal Local Consumer Review Survey 2026, survey of U.S. adult consumers. Consumer behaviour varies by market and business category.

## Core visual: Review leakage versus review flow

The right side of the section should be a bespoke glass-panel flow diagram, not three disconnected cards.

### Left rail label

`WITHOUT A SYSTEM`

### Left rail nodes

1. `Customer experience completed`
2. `Customer leaves satisfied`
3. `Nobody asks at the right moment`
4. `The review never appears`

Between nodes 2 and 4, show two small coral “leaks” moving away from the main line. Do not attach invented percentages or conversion numbers to the leaks.

### Right rail label

`WITH A TAILORED SYSTEM`

### Right rail nodes

1. `Customer experience completed`
2. `The agreed trigger is reached`
3. `A clear, neutral request is sent`
4. `The customer gets a simple path to honest feedback`

### Diagram caption

**The system does not change what customers think. It makes the request timely, consistent and easy to complete.**

## Desktop layout

- Background: Warm Sand `#F7F3EA`.
- Maximum width: existing `88rem`.
- Two-column grid:
  - left content: approximately 5 columns;
  - right visual: approximately 7 columns.
- Minimum desktop section height: approximately 820px.
- Main visual uses Pearl White with subtle Clear Water Blue gradient.
- Use current glass border, ocean shadow and coral accent primitives.
- Statistics sit under the main copy on desktop as three equal compact modules.
- The highlight line sits inside a Pearl White panel with a four-pixel Reef Coral left edge.

## Mobile layout

Order:

1. Eyebrow.
2. H2.
3. Main body.
4. Highlight line.
5. Diagram.
6. Three statistics.
7. Closing line.

- Diagram becomes two vertically stacked rails.
- No text smaller than 14px.
- No horizontal scroll.
- No complex moving paths on mobile.
- Keep section padding consistent with current mobile spacing.

## Animation specification

Use the existing GSAP infrastructure.

### Heading and copy

- Fade from opacity 0 to 1.
- Translate from `y: 22px` to `0`.
- Duration `0.75s`.
- Ease `power3.out`.
- Run once.
- Stagger body/highlight by `0.08s`.

### Diagram

Desktop only:

- Draw each rail using SVG `stroke-dashoffset`.
- Duration `1.1s`.
- Start when the visual reaches approximately 78% of the viewport.
- Reveal nodes in sequence at `0.10s` intervals.
- Coral leak markers drift 12–18px away and fade to 0.25 opacity.
- The completed “with system” path gains a restrained Seafoam glow.
- Do not scrub the entire animation.

Mobile:

- Fade each rail in once.
- No animated path drawing required.

Reduced motion:

- Show the completed diagram immediately.
- No drifting leak markers.
- All text visible on initial render.

---

# 5. Section Two — How the Program Works

## Purpose

This is the main value section.

It must make the customer’s side look deliberately simple while showing the substantial audit, design, writing, development, implementation and QA happening behind the scenes.

## Section identity

**ID:** `how-it-works`  
**Eyebrow:** `HOW THE PROGRAM WORKS`

## Exact public copy

### H2

**You make four decisions. We do the work in between.**

### Intro

The part you see is deliberately simple. The value sits in the audit, workflow design, copy, build, placement logic, implementation and testing happening behind it.

## Customer lane label

`YOUR PART`

## Customer lane cards

### 01 — Complete the fit check

Answer a few business questions in under 60 seconds. No name, phone number or email is required.

### 02 — Give us the operational detail

If your business looks suitable, we invite you to continue. We may send one short questionnaire about your customer flow, tools and hand-off points.

### 03 — Review and approve

You check the customer-facing wording, branding, timing and placements. One reasonable revision is included.

### 04 — Learn it and launch

In a 20-minute handoff, we install or transfer the finished system, show your team when to use it and make sure the process is clear.

## Growth Specialists lane label

`WHAT WE BUILD BEHIND THE SCENES`

## Background work modules

Group these modules into four phases.

### Phase A — Diagnose

1. `Suitability and policy screen`
2. `Google Business Profile baseline`
3. `Existing tool and workflow audit`

### Phase B — Map

4. `Customer journey map`
5. `Missed review-request points`
6. `Trigger, timing and channel decisions`

### Phase C — Build

7. `Customer-facing request wording`
8. `Mobile review page, QR or short-link assets where useful`
9. `Email, SMS, receipt or staff-prompt assets`
10. `Standard setup inside compatible existing tools`

### Phase D — Validate and hand over

11. `Mobile, link and request-path QA`
12. `Team trigger guide and usage checklist`
13. `20-minute implementation and handoff session`

## Bottom statement

**The finished system should feel like part of the business — not another marketing task your team has to remember.**

## Desktop visual specification

Use a two-lane pinned journey.

### Overall container

- Background: Pearl White `#FFFCF6`.
- A large dark Ocean Navy journey panel sits inside the light section.
- Panel radius must match the current large-card language.
- Panel uses:
  - dark navy base;
  - low-opacity light rays;
  - subtle Coral glow at the active phase;
  - faint fish silhouettes;
  - no new photographic assets.

### Upper lane: Your Part

- Four large Pearl/transparent glass cards.
- Coral phase numbers.
- Cards have more breathing room than the background work modules.
- A single Coral standout fish travels along the customer lane from step 1 to step 4.

### Lower lane: What We Build

- Thirteen smaller Seafoam/Clear Water modules.
- Modules are grouped under the four phase headings.
- Connections appear as a current flowing between modules.
- The greater number of lower-lane modules is intentional: it visually demonstrates that Growth Specialists does more work than the customer.

### Phase relationship

- Customer step 1 aligns with Phase A.
- Customer step 2 aligns with Phase B.
- Customer step 3 aligns with Phase C.
- Customer step 4 aligns with Phase D.

## Desktop animation specification

Apply only at `min-width: 1024px`.

- Pin the journey panel, not the section heading.
- Total ScrollTrigger travel: approximately `+=2600px`.
- Scrub: `0.8`.
- `anticipatePin: 1`.
- `invalidateOnRefresh: true`.
- Native page scroll only; no smooth-scroll or scroll hijacking library.

At each quarter of the timeline:

1. Customer card becomes active:
   - opacity from 0.52 to 1;
   - scale from 0.985 to 1;
   - border changes to Reef Coral at 38% opacity;
   - soft coral glow.
2. Associated lower-lane modules reveal:
   - opacity 0.24 to 1;
   - translate y 14px to 0;
   - stagger 0.06s.
3. Completed modules settle to 0.72 opacity rather than disappearing.
4. The Coral fish moves to the next customer node.
5. A Seafoam current progresses through the related lower modules.

Do not make the panel bounce, rotate or zoom.

## Tablet behaviour

At widths from 768px to 1023px:

- No pinning.
- Use four phase groups.
- Each group contains the customer action first and the associated Growth Specialists modules underneath.
- Use normal reveal animations.
- Keep the dark journey-panel treatment.

## Mobile behaviour

- Fully stacked.
- Four phase cards.
- Each phase card contains:
  - customer action;
  - short divider;
  - related behind-the-scenes modules.
- The customer action is Coral-accented.
- Growth Specialists work uses Seafoam chips.
- Do not show all thirteen modules as tiny unreadable pills; allow them to wrap as full-width mini cards.
- No pinning.
- No horizontal timeline.

## Reduced motion

- All phases visible.
- No pin.
- No travelling fish.
- No animated current.
- Active-state styling should not imply that only one phase is available.

---

# 6. Section Three — $299 Custom Review Capture System

## Purpose

This is the primary conversion section.

It combines:

- the price;
- the exact deliverable;
- relevant proof;
- the satisfaction guarantee;
- the no-commitment fit check.

There must be one offer only.

## Section identity

**ID:** `pricing`  
**Eyebrow:** `ONE-OFF SYSTEM SETUP`

## Exact left-column copy

### H2

**Build the system once. Stop relying on memory.**

### Body

For $299 AUD, we design and implement a tailored review-request process around your genuine customers, existing tools and normal workflow.

No retainer. No purchased reviews. No promise about ratings. Just a professionally built system your team can use consistently.

## Impact modules

Use three proof modules beside or immediately above the price card.

### Impact 1

**74%**

of U.S. consumers surveyed seek reviews written within the previous three months.

### Impact 2

**85%**

said positive reviews make them more likely to use a business.

### Impact 3

**LOCAL VISIBILITY**

Google says more reviews and positive ratings can help a business’s local ranking.

### Proof source note

BrightLocal Local Consumer Review Survey 2026, survey of U.S. adult consumers; Google Business Profile Help. These findings do not guarantee results for an individual business.

## Exact price card copy

### Badge

`ONE-OFF • NO RETAINER`

### Product name

**Custom Review Capture System**

### Price

**$299 AUD**

### Price qualifier

`one-off setup`

### Best-for line

Built for small businesses with genuine customers but no reliable, repeatable review-request process.

### Included deliverables

- Review profile and operational workflow audit
- Custom customer-journey and review-opportunity map
- Tailored trigger, timing and channel plan
- Customer-facing request copy for the agreed touchpoints
- Professionally built digital assets for the agreed system
- Mobile review handoff page, QR code or short link where useful
- Standard setup inside compatible tools already used by the business
- Team trigger guide and usage checklist
- 20-minute review, implementation and handoff session
- One reasonable revision after review
- Satisfaction guarantee described below

### Primary CTA

**See if my business is a fit**

### CTA microcopy

Takes less than 60 seconds. No name, phone number or email required. No commitment. No payment.

### Guarantee block

**Satisfaction guarantee**

We check the finished system against the agreed scope and include one reasonable revision. If we cannot deliver the agreed system or bring it to an agreed usable standard, we refund the $299 setup fee.

This guarantee covers the system we deliver. It does not guarantee review volume, star rating, review wording, customer sentiment, Google publication or Google’s later treatment of a review.

### Scope note

If the recommended system requires third-party software, SMS credits, NFC hardware, a paid app plan, domain or hosting costs, those costs must be disclosed before the business accepts its invitation. Growth Specialists must not add recurring fees without approval.

## Visual specification

### Section background

Use the existing Clear Water gradient:

- Pearl White at top;
- Clear Water Blue through the middle;
- Seafoam toward the bottom.

Add a restrained coral glow behind the price card.

### Desktop layout

- Maximum width: 88rem.
- Left: approximately 7 columns.
- Right price card: approximately 5 columns.
- Price card background: Deep Ocean Navy.
- Card text: Pearl White/Clear Water Blue.
- Price: Reef Coral.
- Deliverable checks: Seafoam.
- CTA: Reef Coral with current hover lift/glow.
- Guarantee sits inside a low-opacity Pearl White inset panel within the price card.
- Proof modules on the left should feel attached to the purchase decision, not like an unrelated statistics section.

### Mobile layout

Order:

1. Eyebrow.
2. H2.
3. Body.
4. Three impact modules.
5. Price card.
6. Source note.

- Price card fills available width.
- CTA is full width.
- Deliverables remain readable and do not become a two-column checklist.
- Guarantee must not be hidden behind a tooltip or modal.

## Animation specification

- Section heading: standard existing Reveal.
- Proof modules: stagger `0.08s`, y 18px, duration 0.7s.
- Price card: y 28px, opacity 0, scale 0.985 → 1, duration 0.85s, `power3.out`.
- Animated counters run once for 74 and 85.
- `LOCAL VISIBILITY` remains text, not a fake numeric counter.
- Coral glow intensifies slightly on CTA hover only.
- No persistent pulsing price card.
- No countdown, fake scarcity or urgency animation.

---

# 7. Fit Check and Invitation Flow

## Core interaction

Clicking `See if my business is a fit` opens a two-stage Radix Dialog.

The first stage requires no personal contact information.

The second stage is offered only after the user sees the preliminary fit result and chooses to request a manual review.

## Dialog styling

- Desktop: centered modal, maximum width approximately 720px.
- Mobile: near-full-screen sheet with safe top/bottom spacing.
- Deep Ocean Navy background.
- Pearl White text.
- Coral progress indicator.
- Seafoam selected states.
- Close button visible and keyboard accessible.
- Focus trapped while open.
- Escape closes the dialog.
- Focus returns to the CTA after close.
- State remains intact if the user closes and reopens during the same page session.

## Stage One copy

### Dialog eyebrow

`60-SECOND FIT CHECK`

### Dialog title

**See whether your business would benefit.**

### Intro

This first step asks for business information only. No name, phone number or email is required.

## Stage One fields

### 1. Business website or Google Business Profile

Label: `Business website or Google Business Profile`

Helper: `Paste either link.`

At least one valid URL is required.

### 2. Industry

Label: `What type of business is it?`

Use a select with:

- Trades and home services
- Health and allied health
- Beauty and personal care
- Automotive
- Hospitality
- Retail
- Professional services
- Education or training
- Other

### 3. Monthly completed customer experiences

Label: `Approximately how many customer jobs, appointments or sales are completed each month?`

Options:

- 0–4
- 5–19
- 20–49
- 50–199
- 200+

### 4. Current review-request method

Label: `How are Google reviews currently requested?`

Options:

- We do not ask
- Staff ask manually when they remember
- We share a link or QR code
- We send email or SMS requests
- We already use an automated system
- Other

### 5. Existing customer tools

Label: `Which tools are already part of the customer journey?`

Multi-select:

- Booking system
- CRM
- POS or checkout
- Invoicing software
- Email
- SMS
- Website form or online checkout
- None of these
- Other

This field is optional.

### 6. Compliance confirmation

Required checkbox:

`This business serves genuine customers, and I understand that review requests must be honest, voluntary and not conditioned on a particular rating or wording.`

### Honeypot

Include a hidden honeypot field.

### Stage One button

**Show me my fit**

## Preliminary fit logic

The preliminary result is guidance, not an automatic acceptance or rejection.

### Potential-fit result

Show when:

- monthly customer volume is at least 5; and
- the business has no system, relies on staff memory, or uses only a basic link/QR approach.

#### Result title

**This looks like a potential fit.**

#### Result body

Your business appears to have genuine customer volume and a review-request gap we may be able to solve. Request a manual review and we will invite you if the $299 system is suitable.

#### Button

**Request a manual review**

### Manual-review result

Show when:

- customer volume is 0–4; or
- the business says it already has an automated system; or
- the answers do not make the value obvious.

#### Result title

**A manual review would be better.**

#### Result body

Your answers do not make the value obvious yet. You can still request a manual review. We will tell you honestly if the $299 setup is unlikely to be worthwhile.

#### Button

**Request a manual review**

### Compliance failure

The form cannot continue unless the compliance confirmation is accepted. Do not present a “fit” result without it.

## Stage Two copy

### Title

**Where should we send the decision?**

### Body

We will use these details only to assess this application and respond. This is not a mailing-list signup.

### Fields

- `Work email` — required
- `Contact name` — optional
- `Business name` — optional if it cannot be inferred from the supplied URL
- `Anything we should know?` — optional textarea

Do not ask for a phone number.

### Submit button

**Submit for review**

### Success state

**Application received.**

We will review the business and send an invitation if the system is a suitable fit. No payment has been taken.

### Error state

**The application could not be sent.**

Please try again. Your fit-check answers will remain in the form.

## Backend and privacy requirements

- Do not send Stage One data to the server until the user chooses to submit Stage Two.
- Aggregate analytics may record that the fit check was opened/completed, but must not contain URLs, business names, email addresses, notes or other personal information.
- Validate Stage Two on client and server.
- Keep the current email-provider abstraction.
- New email subject: `New Growth Specialists review system application`.
- Email body includes:
  - fit-check answers;
  - preliminary result category;
  - contact details;
  - source page;
  - timestamp;
  - compliance confirmation.
- Spam-filled honeypot submissions should return a generic success and send nothing.
- No Stripe checkout should be available on the public landing page.
- Accepted applicants should be sent a separate invitation and secure payment link after manual review.

## Analytics events

Extend the existing no-op-safe analytics adapter with:

- `fit_check_opened`
- `fit_check_started`
- `fit_check_completed`
- `fit_result_viewed`
- `manual_review_started`
- `manual_review_submitted`
- `manual_review_failed`

Allowed event properties:

- result category;
- industry category;
- customer-volume range;
- request-method category;
- presence of tool categories;
- CTA location.

Do not send:

- URL;
- email;
- contact name;
- business name;
- free-text notes.

---

# 8. Sales-Closing FAQ

## Section identity

**ID:** `faq`

Keep the existing FAQ visual style:

- Pearl White background;
- very large `You might be wondering...` heading;
- two columns on desktop;
- one column on mobile;
- thin divider lines;
- Coral numbers;
- circular arrow control;
- keyboard-accessible Radix accordion.

Add stable item IDs so the header’s Compliance link can open the relevant answer.

## Exact FAQ copy

### FAQ 01

**Question:**  
What exactly do you build?

**Answer:**  
We build the review-request process your business should already have, tailored to the way customers move through it. Depending on the workflow, that can include request timing, trigger points, customer-facing wording, a mobile review handoff page, a direct Google review link, QR or short-link assets, email or SMS templates, staff prompts, and standard setup inside tools you already use. Before payment, the invitation will state exactly what your build includes.

### FAQ 02

**Question:**  
What am I actually paying $299 for?

**Answer:**  
You are not paying $299 for a QR code or a generic message template. You are paying for the diagnosis, customer-journey mapping, compliance decisions, copywriting, web development, setup, testing and handoff needed to make the system fit naturally inside your operation. We know where businesses commonly leave reviews on the table and how to remove friction without using fake, paid, pressured or selective review tactics.

### FAQ 03

**Question:**  
Can I do this myself?

**Answer:**  
Absolutely. Every service we sell is technically something you could learn and build yourself. You could also build your own website, house or car; most people pay a specialist when the time saved, lower risk and better finish produce a worthwhile return. You can spend your time working out what should be built, which genuine customers to ask, when to ask them, where the request should appear, how it should be worded and how it should connect to your tools — or have us design, build and test it for you.

### FAQ 04

**Question:**  
What happens after the 60-second fit check?

**Answer:**  
The fit check asks for business information only. It does not require your name, phone number or email. At the end, you can see whether the service is likely to help. If you want a manual review, you can then provide an email address so we can assess the business and send an invitation if it is suitable. Accepted businesses pay the one-off fee, answer any final operational questions, approve the system and complete the 20-minute handoff.

### FAQ 05

**ID:** `faq-compliance`

**Question:**  
Is the system compliant with Google’s review policies?

**Answer:**  
The system is designed around genuine, voluntary customer feedback. It must not offer incentives, pressure customers, prescribe a rating or specific wording, or selectively ask only customers expected to leave positive feedback. Google permits businesses to ask for reviews that represent genuine experiences under those conditions. We design around those rules, but Google controls whether a review is published, delayed, filtered or later removed.

### FAQ 06

**Question:**  
How many reviews will I get?

**Answer:**  
We do not promise a number, star rating or timeframe. A better system can improve consistency, timing and ease, but results still depend on customer volume, experience quality, team adoption, response rates and Google’s platform decisions. We guarantee the agreed system deliverables — not customer behaviour or platform outcomes.

### FAQ 07

**Question:**  
What does the satisfaction guarantee cover, and are there ongoing fees?

**Answer:**  
The $299 is Growth Specialists’ one-off setup fee. At handoff, we check the build against the agreed scope and include one reasonable revision. If we cannot deliver the agreed system or bring it to an agreed usable standard, we refund the setup fee. If the recommended system requires third-party software, SMS credits, NFC hardware, a paid app plan, domain or hosting costs, those costs are disclosed before you accept. The guarantee does not cover review volume, ratings, wording, publication or Google’s removal decisions.

## FAQ animation

- Keep existing accordion interaction.
- Heading uses one standard fade-up.
- Each column reveals once with a 0.08s offset.
- Accordion body height animates through Radix/CSS.
- Circular arrow rotates approximately 45–90 degrees.
- No GSAP scrub.
- Compliance hash opens FAQ 05 after the section scroll completes.
- Reduced-motion users get immediate state changes.

---

# 9. Footer

## Visual

Keep the existing minimal footer structure and Deep Ocean Navy treatment.

## Exact copy

### Wordmark

`growthspecialists`

### One-line positioning

Tailored Google review collection systems for small businesses that want a better process — not shortcuts.

### Links

- How it works
- $299 setup
- FAQ
- Privacy
- Terms
- Satisfaction Guarantee

### Bottom compliance line

Reviews must be honest and based on genuine customer experience. Growth Specialists does not sell reviews, guarantee ratings, control review wording or guarantee Google publication.

---

# 10. Design System Rules

## Existing palette — preserve exactly

- Deep Ocean Navy: `#061826`
- Abyss Blue: `#092A3A`
- Reef Coral: `#FF6B5F`
- Soft Coral Pink: `#FFD1CA`
- Seafoam: `#BFEFE3`
- Clear Water Blue: `#DFF7FF`
- Warm Sand: `#F7F3EA`
- Pearl White: `#FFFCF6`

Do not add a new primary colour.

## Typography

Keep Manrope and the existing weight system.

### Desktop

- H1: unchanged.
- New H2: 52–64px, line-height approximately 1.02–1.08.
- Section body: 17–18px, line-height 1.7–1.8.
- Eyebrows: 12–14px, uppercase, extra-bold.
- Card headings: 19–24px.
- Detail copy: minimum 13px.

### Mobile

- New H2: 38–44px.
- Body: 16px.
- Card heading: 18–21px.
- No meaningful copy below 13px.

## Shape language

- Continue existing rounded cards and full-pill CTAs.
- Use glass borders and frosted panels.
- Avoid excessive nested cards.
- One strong visual container per section is preferable to a grid of unrelated boxes.

## Ocean/fish language

Use fish and currents as system metaphors:

- missed current = missed request;
- guided current = repeatable workflow;
- Coral fish = customer’s simple journey;
- school/current modules = Growth Specialists work.

Do not:

- add faces;
- add limbs;
- add speech bubbles;
- use cartoon mascots;
- place fish beside every paragraph;
- turn the page into an aquarium illustration.

---

# 11. Content and Compliance Guardrails

## Do not use below the frozen ticker

- campaign wave;
- activation schedule;
- audience matching;
- local activation;
- campaign allocation;
- campaign target;
- eligible review outcomes target;
- Foundation Wave;
- Momentum Wave;
- monthly campaign reporting;
- free coffee activation;
- client campaign;
- “experience page” as the primary product.

## Do not claim

- guaranteed reviews;
- guaranteed review numbers;
- guaranteed star ratings;
- guaranteed positive reviews;
- guaranteed Google publication;
- guaranteed ranking improvements;
- industry-leading, unless substantiated;
- that negative customers are routed away from Google;
- that only happy customers are asked;
- that Growth Specialists controls customer wording.

## Review-request system rules

Every implemented system must:

1. Ask only people with a genuine experience.
2. Make the review voluntary.
3. Avoid incentives.
4. Avoid pressure.
5. Avoid prescribed ratings.
6. Avoid prescribed content.
7. Avoid staff quotas for particular review numbers.
8. Avoid sentiment-based review gating.
9. Avoid selectively soliciting only customers expected to be positive.
10. Use the same neutral public-review pathway for all eligible customers included in the agreed request process.
11. Allow a general customer-support/contact path without making access to Google depend on sentiment.
12. State that Google controls publication and removal.

---

# 12. Repository Change Map

## Preserve

Preserve and continue using:

- `components/layout/SiteHeader.tsx` — visual freeze; anchor-map changes only
- `components/sections/HeroSection.tsx`
- `components/hero/FishSchoolCanvas.tsx`
- `components/hero/HeroFallbackAnimation.tsx`
- `components/sections/SignalTicker.tsx`
- `components/motion/*`
- `components/ui/*`
- `components/visuals/*`
- `hooks/useReducedMotion.ts`
- `hooks/useGSAPContext.ts`
- `lib/gsap.ts`
- `lib/email/provider.ts`
- `lib/email/resend.ts`
- `lib/analytics.ts` — extend
- SEO, sitemap and robots infrastructure

## Create

- `components/sections/ReviewCollectionGapSection.tsx`
- `components/visuals/ReviewFlowDiagram.tsx`
- `components/sections/ReviewSystemJourneySection.tsx`
- `components/visuals/ReviewSystemJourney.tsx`
- `components/sections/ReviewSystemOfferSection.tsx`
- `components/forms/FitCheckDialog.tsx`
- `components/forms/FitCheckForm.tsx`
- `components/forms/FitCheckResult.tsx`
- `content/reviewSystem.ts`
- `lib/validation/reviewSystemApplicationSchema.ts`
- `app/actions/reviewSystemApplication.ts`

Optional internal decomposition is permitted, but the public section count must remain unchanged.

## Rewrite

- `app/page.tsx`
- `content/site.ts`
- `content/sections.ts`
- `content/faqs.ts`
- `content/compliance.ts`
- `types/content.ts`
- `components/sections/FAQSection.tsx`
- `components/layout/SiteFooter.tsx`
- `.env.example`
- `README.md`
- launch/QA documentation

## Remove after replacement is verified

- `components/sections/VisibilityGapSection.tsx`
- `components/sections/HowItWorksSection.tsx`
- `components/sections/OneServiceSection.tsx`
- `components/sections/CampaignExampleSection.tsx`
- `components/sections/PhilosophySection.tsx`
- `components/sections/ComplianceSection.tsx`
- `components/sections/WhyReviewsMatterSection.tsx`
- `components/sections/PackagesSection.tsx`
- `components/sections/SuitabilitySection.tsx`
- `components/sections/GuaranteesSection.tsx`
- `components/sections/DiscreetClientWorkSection.tsx`
- `components/sections/FinalCTASection.tsx`
- `components/forms/JoinWaveForm.tsx`
- `content/packages.ts`
- `lib/validation/joinWaveSchema.ts`
- `app/actions/joinWave.ts`
- `app/api/checkout/route.ts`
- `lib/stripe.ts`

Remove the `stripe` package and Stripe environment variables unless a separate accepted-applicant payment flow is being implemented immediately. Do not leave a dormant public checkout flow attached to the page.

---

# 13. SEO and Metadata Changes

## Page title

`Growth Specialists | Custom Google Review Collection Systems`

## Meta description

`Tailored Google review collection systems for small businesses, built around genuine customers, existing tools and compliant requests for honest feedback.`

## Open Graph title

`Custom Review Capture Systems | Growth Specialists`

## Open Graph description

`We audit your customer journey, find missed review-request moments and build a repeatable system into the workflow your business already uses.`

## Schema

Use conservative `ProfessionalService` or `Service` schema.

### Service name

`Custom Google Review Collection System Setup`

### Service description

`A one-off workflow audit, review-request system design, digital asset build, standard implementation and handoff for suitable small businesses.`

Do not add:

- aggregate rating schema;
- review schema;
- fake testimonials;
- review counts;
- promised results;
- invented address or phone data.

---

# 14. Performance and Accessibility Requirements

## Performance

- Keep WebGL confined to the frozen hero.
- New diagrams must use SVG, CSS and HTML, not another canvas.
- Only one pinned section is permitted.
- Do not add a smooth-scroll library.
- Do not add large video or photographic assets.
- Dynamically load the Fit Check Dialog if useful.
- Keep main copy server-rendered.
- Avoid turning the whole page into a client component.
- Preserve current low-power/reduced-motion hero gating.

## Accessibility

- One H1 only.
- Each new major section uses an H2.
- Fit Check Dialog has labelled title and description.
- All fields have visible labels.
- Multi-select tool options are keyboard accessible.
- Validation errors use an assertive region.
- Fit result uses a polite status region.
- Accordion supports keyboard navigation.
- Compliance hash opens the correct accordion item.
- Fish, currents and decorative paths are `aria-hidden`.
- Information must not depend on colour alone.
- Focus-visible states preserve the current Coral system.
- Reduced-motion mode disables:
  - journey pin;
  - travelling fish;
  - animated current;
  - counters;
  - path drawing;
  - parallax.

---

# 15. QA and Final Acceptance Matrix

The redesign is complete only when every condition below passes.

## Frozen-zone acceptance

- No public copy in the header, hero or ticker has changed.
- Hero layout is visually equivalent at:
  - 360px;
  - 390px;
  - 768px;
  - 1024px;
  - 1440px;
  - 1920px.
- Hero WebGL/fallback logic is unchanged.
- Ticker phrases, speed and reduced-motion state are unchanged.
- Only anchor destinations may differ.

## Architecture acceptance

The rendered section order is exactly:

1. Hero
2. Signal ticker
3. Review Collection Gap
4. How the Program Works
5. $299 Custom Review Capture System
6. FAQ
7. Footer

No legacy public section remains.

## Offer acceptance

- One offer only.
- Price shown as `$299 AUD`.
- Clearly marked one-off.
- No public checkout before suitability review.
- CTA opens Fit Check Dialog.
- First fit-check stage requests no:
  - name;
  - phone;
  - email.
- First stage can reasonably be completed in under 60 seconds.
- Stage Two explains that email is used only to assess/respond.
- No payment is taken on the public page.

## Copy acceptance

Below the ticker, public copy must not contain:

- `Foundation Wave`
- `Momentum Wave`
- `campaign target`
- `activation schedule`
- `audience matching`
- `monthly reporting`
- `free coffee`
- promises of review volume
- promises of ratings
- sentiment-gating language

The word `campaign` may remain only inside the frozen header/hero/ticker content.

## Compliance acceptance

- All review requests are framed as honest and voluntary.
- No incentives.
- No pressure.
- No prescribed rating.
- No prescribed wording.
- No selective positive solicitation.
- No sentiment gate.
- No review-number guarantee.
- No Google-publication guarantee.
- Guarantee is limited to the system deliverable.

## Visual acceptance

- Existing palette preserved.
- No new primary colour.
- No generic SaaS icon grid.
- No childish fish.
- No horizontal overflow.
- New sections look like the same website, not a separate template.
- Statistics are attached to the relevant problem or purchase decision.
- Price card is the strongest visual object below the hero.
- Journey visually shows more Growth Specialists work than customer work.

## Animation acceptance

- Journey pin active only at 1024px and above.
- No pin on mobile/tablet.
- No scroll hijacking.
- No content hidden after animation.
- GSAP contexts clean up.
- Reduced-motion mode displays all content immediately.
- No persistent price-card pulse.
- No fake urgency animation.

## Technical acceptance

Run:

- `npm run format`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Also confirm:

- no hydration errors;
- no browser console errors;
- no orphaned imports;
- no dead public Stripe checkout route;
- application email sends in a Vercel preview;
- honeypot works;
- analytics contain no personal data;
- FAQ Compliance anchor opens the correct item;
- Privacy, Terms and Satisfaction Guarantee links resolve.

## Launch/legal acceptance

Before accepting payments:

- publish a Privacy Policy covering application data;
- publish Terms describing scope, third-party costs and exclusions;
- publish the exact Satisfaction Guarantee;
- obtain an Australian legal review of the payment/refund terms and public compliance claims;
- test the application and invitation process end to end;
- verify every statistical source and source label remains current at launch.

---

# 16. Final Product Positioning Summary

The final website should leave a prospect with this exact understanding:

> Growth Specialists charges $299 to inspect how genuine customers move through a business, find where review requests are being missed, and build a professional, compliant review-request system into the tools and customer moments the business already uses. The business completes a quick fit check, provides operational detail if invited, approves the build and receives a 20-minute handoff. Growth Specialists guarantees the agreed system deliverable, not any number or type of review.

That is the final decision-making standard for every copy, visual, interaction and implementation choice in the redesign.

