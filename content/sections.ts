import { complianceContent } from "@/content/compliance";
import { faqsContent } from "@/content/faqs";
import { packagesContent } from "@/content/packages";
import type { LandingSectionsContent } from "@/types/content";

export const landingSectionsContent = {
  order: [
    { id: "nav", label: "Nav" },
    { id: "hero", label: "Hero" },
    { id: "signalTicker", label: "Signal ticker" },
    { id: "visibilityGap", label: "Visibility gap" },
    { id: "howItWorks", label: "How it works" },
    { id: "oneService", label: "One service, all business types" },
    { id: "campaignExample", label: "Campaign example" },
    { id: "philosophy", label: "Philosophy" },
    { id: "compliance", label: "Compliance" },
    { id: "whyReviewsMatter", label: "Why reviews matter" },
    { id: "packages", label: "Join the next wave / packages" },
    { id: "suitability", label: "Suitability" },
    { id: "guarantees", label: "Guarantees" },
    { id: "discreetClientWork", label: "Discreet client work" },
    { id: "faq", label: "FAQ" },
    { id: "finalCta", label: "Final CTA" },
  ],
  hero: {
    eyebrow: "LOCAL VISIBILITY FOR NEW & GROWING BUSINESSES",
    h1: "We help ambitious brands be seen by the people who matter most.",
    subheading:
      "A done-for-you campaign system that helps suitable small businesses create genuine local experiences, collect honest feedback and build the visibility layer that makes customers more confident when they search.",
    trustLine:
      "No fake reviews. No paid ratings. No pressure tactics. Just real-world campaigns designed around genuine experience, honest feedback and long-term visibility.",
    primaryCta: "Join the next wave",
    scrollCue: "See how it works",
  },
  signalTicker: [
    "REAL LOCAL EXPERIENCES",
    "HONEST FEEDBACK",
    "NO REVIEW BUYING",
    "NO INCENTIVES FOR REVIEWS",
    "DISCREET ACTIVATIONS",
    "TAILORED EXPERIENCE PAGES",
    "QUALITY LOCAL AUDIENCES",
    "GOOGLE-SAFE REQUESTS",
    "VISIBILITY MOMENTUM",
    "BUILT FOR SMALL BUSINESS",
  ],
  visibilityGap: {
    eyebrow: "THE VISIBILITY GAP",
    h2: "You might be excellent in real life - but still look invisible online.",
    body: "When people compare local businesses, they do not only look at your website. They look at your Google Business Profile, reviews, photos, recent activity and whether other real people seem to trust you.",
    sourceNote:
      "Google says local ranking is based on relevance, distance and prominence, and that review count and review score can factor into local search ranking.",
    cards: [
      {
        title: "Low reviews make you look untested",
        body: "A strong business with only a handful of reviews can look riskier than a weaker competitor with stronger public proof.",
      },
      {
        title: "Old reviews lose power",
        body: "Customers want signs that your business is active, reliable and still delivering good experiences today.",
      },
      {
        title: "Marketing works harder when trust is already there",
        body: "Better visible proof helps every click, referral, quote request and search impression convert with less friction.",
      },
    ],
  },
  howItWorks: {
    eyebrow: "THE CAMPAIGN SYSTEM",
    h2: "No long consultation. No custom quote process. Just join the next wave.",
    intro:
      "We already run planned promotional activations with quality local audiences. When a suitable business joins, we request the details we need, build your campaign experience, review it with you and add your business into the next available campaign wave.",
    steps: [
      {
        number: "01",
        title: "Join the next campaign wave",
        body: "Choose the campaign size that suits your business and secure your slot. No drawn-out sales call or vague proposal process.",
      },
      {
        number: "02",
        title: "Complete the business intake form",
        body: "We email you a simple form asking for your business details, service area, Google Business Profile, ideal customer type, examples of work and any important compliance notes.",
      },
      {
        number: "03",
        title: "We build your custom experience within 48 hours",
        body: "We create your tailored campaign experience page: what you do, who you help, examples of your work, key services and the correct honest-feedback pathway.",
      },
      {
        number: "04",
        title: "You review before anything goes live",
        body: "You check the page for accuracy, wording and brand fit. This is not about approving only positive reviews - it is about making sure your business is represented clearly and honestly.",
      },
      {
        number: "05",
        title: "We add you into our event schedule",
        body: "Your business is introduced through discreet local activations designed around the audience first. The promotion is useful, low-pressure and never conditional on leaving a review.",
      },
      {
        number: "06",
        title: "Eligible people are invited to leave honest feedback",
        body: "Where someone has genuinely experienced your business, product, service or campaign experience, they can be invited to leave honest public feedback. If someone is only curious or not eligible for a Google review, we can route them to private feedback or enquiry instead.",
      },
      {
        number: "07",
        title: "You receive simple reporting",
        body: "We show what was delivered, what audience was reached, what feedback pathways were used, what review opportunities were created and what we recommend next.",
      },
    ],
  },
  oneService: {
    eyebrow: "ONE SYSTEM. MANY BUSINESS TYPES.",
    h2: "We do one thing: help suitable businesses become easier to find, trust and choose.",
    body: "Every business is different. But the early visibility problem is usually the same: people need enough real proof to feel confident before they call, book or buy.",
    secondBody:
      "Growth Specialists is built around one clear outcome - creating genuine local experiences that can lead to honest feedback, stronger customer proof and better visibility when people search.",
    miniBlocks: [
      {
        title: "For new businesses",
        body: "Build the signals customers expect before they take a chance on you.",
      },
      {
        title: "For growing businesses",
        body: "Strengthen your profile before scaling ads, SEO, referrals or outreach.",
      },
      {
        title: "For competitive sectors",
        body: "Create a more credible presence in markets where customers compare heavily.",
      },
      {
        title: "For product and service brands",
        body: "Show real people what you do, then give eligible customers a clean way to share honest feedback.",
      },
    ],
  },
  campaignExample: {
    eyebrow: "WHAT A CAMPAIGN LOOKS LIKE",
    h2: "Discreet, useful and built around the audience.",
    body: "Most people do not want to be ambushed by advertising. So we do not run loud promotions or plaster your branding everywhere.",
    secondBody:
      "A typical campaign is simple: a useful local activation, a carefully matched audience, a discreet QR code and a tailored online experience that introduces your business through real work, clear services and honest feedback options.",
    exampleActivation:
      "A local business joins a campaign wave that includes a free coffee-style activation for a relevant community group. Attendees can enjoy the activation with no obligation. People who are curious can scan a discreet QR code to learn about the business, view examples of work and, where eligible, leave honest feedback.",
    complianceNote:
      "Reviews are never required, rewarded or scripted. Public review requests are only used where the person's feedback reflects a genuine experience.",
  },
  philosophy: {
    eyebrow: "OUR PHILOSOPHY",
    h2: "Visibility before scale.",
    body: [
      "Most businesses rush into ads, SEO, flyers, content or outreach before fixing the layer underneath: what people see when they search.",
      "We focus on that first layer. The proof layer. The part that helps a new customer decide whether you look active, credible and worth choosing.",
      "We are not trying to run your entire marketing forever. We specialise in a focused early step: creating real-world visibility campaigns that help good businesses generate honest feedback, stronger customer proof and better search confidence.",
    ],
    pullQuote:
      "A stronger visibility layer makes every future click work harder.",
    supportingCopy:
      "Our work is human-powered and data-informed. We use local audience matching, search behaviour and campaign reporting to guide decisions - but we do not hide behind jargon, fake metrics or vague optimisation scores.",
    cards: [
      "Visibility before scale",
      "Experience before review",
      "Trust before traffic",
      "No shortcuts",
    ],
  },
  compliance: complianceContent,
  whyReviewsMatter: {
    eyebrow: "WHY THIS FOUNDATION MATTERS",
    h2: "Reviews influence how people find you, compare you and decide whether to trust you.",
    stats: [
      {
        value: "97%",
        body: "of consumers still rely on reviews to guide purchase decisions, according to BrightLocal's 2026 Local Consumer Review Survey.",
        source: "BrightLocal 2026",
      },
      {
        value: "47%",
        body: "of consumers won't use a business with fewer than 20 reviews.",
      },
      {
        value: "85%",
        body: "of consumers are more likely to use a business after reading positive reviews.",
      },
      {
        value: "Local ranking",
        body: "Google says review count and review score can factor into local ranking, and more reviews and positive ratings can help local ranking.",
        source: "Google Business Profile guidance",
      },
    ],
    bottomLine:
      "This is why we focus on visibility first. When your business looks more credible in search, every future ad, referral, quote request and website visit has a better chance of converting.",
  },
  packages: packagesContent,
  suitability: {
    eyebrow: "IS THIS RIGHT FOR YOU?",
    h2: "Best suited to good businesses that are under-seen online.",
    goodFit: [
      "You provide a real product or service people can honestly experience.",
      "You have happy customers or strong examples of work.",
      "Your Google profile looks weaker than your actual business.",
      "You want a visibility foundation before scaling ads or SEO.",
      "You care about doing this properly.",
      "You plan to continue collecting reviews from real customers.",
    ],
    notFit: [
      "You want to purchase Google reviews.",
      "You want promised ratings.",
      "You want scripted or controlled review wording.",
      "You do not have a real customer experience to review.",
      "You are already established with a strong, recent review base.",
      "Your business does not align with our values.",
    ],
    ctaLine:
      "More reviews can help, but more is not always the right next step. If your business is already highly established, we may recommend you do nothing. For many new and growing businesses, a strong first visibility base is enough to stop reviews being the bottleneck.",
  },
  guarantees: {
    eyebrow: "OUR GUARANTEES",
    h2: "Clear promises. No impossible claims.",
    cards: [
      {
        title: "Campaign Delivery Guarantee",
        body: "If we accept your business, we will deliver the agreed campaign assets, experience page, feedback pathway, activation inclusion and reporting. If something on our side is not delivered, we fix it.",
      },
      {
        title: "Compliance-First Process Guarantee",
        body: "We design every campaign around genuine experiences, transparent requests and non-incentivised feedback. We do not use tactics that require fake, paid, pressured or scripted reviews.",
      },
      {
        title: "Target Effort Guarantee",
        body: "If the agreed campaign target is not reached because of campaign execution, we continue working within the agreed scope until the campaign has been properly exhausted.",
      },
    ],
    smallNote:
      "We cannot and do not guarantee star ratings, review wording, customer sentiment, Google publication or whether Google later removes a review.",
  },
  discreetClientWork: {
    eyebrow: "DISCREET BY DESIGN",
    h2: "We do not use your business as our trophy.",
    body: [
      "Many business owners do not want their visibility strategy publicly advertised. We respect that.",
      "We do not plaster client names across our website, publish sensitive campaign details or turn your growth journey into our content without permission.",
      "The only public proof we focus on is our own: how we communicate, operate and deliver.",
    ],
    embeddedReviewsHeading: "What people say about working with us",
    microcopy:
      "Client campaign details are kept private unless explicitly approved.",
  },
  faq: faqsContent,
  finalCta: {
    h2: "Ready to stop blending in?",
    body: "Join the next Visibility Wave and give your business a stronger foundation when people search, compare and decide who to trust.",
    cta: "Join the next wave",
    secondaryText:
      "No long consultation. No agency retainer. If your business is not suitable, we will let you know.",
    formFields: [
      "Business name",
      "Website",
      "Google Business Profile link",
      "Suburb / service area",
      "Industry",
      "Current number of Google reviews",
      "Approximate number of recent customers",
      "Which package are you joining?",
      "Anything we should know before building your experience page?",
    ],
    finalCheckbox:
      "I understand this service does not sell fake reviews, guarantee positive ratings, incentivise reviews or control review wording.",
  },
} satisfies LandingSectionsContent;

export const sectionOrder = landingSectionsContent.order;
export const heroContent = landingSectionsContent.hero;
export const signalTickerContent = landingSectionsContent.signalTicker;
export const visibilityGapContent = landingSectionsContent.visibilityGap;
export const howItWorksContent = landingSectionsContent.howItWorks;
export const oneServiceContent = landingSectionsContent.oneService;
export const campaignExampleContent = landingSectionsContent.campaignExample;
export const philosophyContent = landingSectionsContent.philosophy;
export const complianceSectionContent = landingSectionsContent.compliance;
export const whyReviewsMatterContent = landingSectionsContent.whyReviewsMatter;
export const packagesSectionContent = landingSectionsContent.packages;
export const suitabilityContent = landingSectionsContent.suitability;
export const guaranteesContent = landingSectionsContent.guarantees;
export const discreetClientWorkContent =
  landingSectionsContent.discreetClientWork;
export const faqSectionContent = landingSectionsContent.faq;
export const finalCtaContent = landingSectionsContent.finalCta;
export { complianceContent, faqsContent, packagesContent };
