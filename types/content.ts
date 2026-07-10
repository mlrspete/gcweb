// Legacy campaign model: remove during integration milestone.
export type SectionId =
  | "nav"
  | "hero"
  | "signalTicker"
  | "visibilityGap"
  | "howItWorks"
  | "oneService"
  | "campaignExample"
  | "philosophy"
  | "compliance"
  | "whyReviewsMatter"
  | "packages"
  | "suitability"
  | "guarantees"
  | "discreetClientWork"
  | "faq"
  | "finalCta";

export type NavLink = {
  label: string;
  href: string;
};

export type SiteContent = {
  displayName: string;
  wordmark: string;
  contactEmail?: string;
  metadata: {
    title: string;
    titleTemplate: string;
    description: string;
    siteName: string;
    ogImagePath: string;
    twitterCard: "summary_large_image";
    canonicalPath: string;
  };
  nav: {
    logoLabel: string;
    links: NavLink[];
    buttonLabel: string;
    microcopy: string;
  };
  foundationStatus: {
    summary: string;
    confirmations: string[];
    complianceLine: string;
  };
};

export type SectionOrderItem = {
  id: SectionId;
  label: string;
};

export type TextCard = {
  title: string;
  body?: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export type StatItem = {
  value: string;
  body: string;
  source?: string;
};

export type HeroContent = {
  eyebrow: string;
  h1: string;
  subheading: string;
  trustLine: string;
  primaryCta: string;
  scrollCue: string;
};

export type VisibilityGapContent = {
  eyebrow: string;
  h2: string;
  body: string;
  sourceNote: string;
  cards: TextCard[];
};

export type HowItWorksContent = {
  eyebrow: string;
  h2: string;
  intro: string;
  steps: ProcessStep[];
};

export type OneServiceContent = {
  eyebrow: string;
  h2: string;
  body: string;
  secondBody: string;
  miniBlocks: TextCard[];
};

export type CampaignExampleContent = {
  eyebrow: string;
  h2: string;
  body: string;
  secondBody: string;
  exampleActivation: string;
  complianceNote: string;
};

export type PhilosophyContent = {
  eyebrow: string;
  h2: string;
  body: string[];
  pullQuote: string;
  supportingCopy: string;
  cards: string[];
};

export type WhyReviewsMatterContent = {
  eyebrow: string;
  h2: string;
  stats: StatItem[];
  bottomLine: string;
};

export type SuitabilityContent = {
  eyebrow: string;
  h2: string;
  goodFit: string[];
  notFit: string[];
  ctaLine: string;
};

export type GuaranteesContent = {
  eyebrow: string;
  h2: string;
  cards: TextCard[];
  smallNote: string;
};

export type DiscreetClientWorkContent = {
  eyebrow: string;
  h2: string;
  body: string[];
  embeddedReviewsHeading: string;
  microcopy: string;
};

export type FinalCtaContent = {
  h2: string;
  body: string;
  cta: string;
  secondaryText: string;
  formFields: string[];
  finalCheckbox: string;
};

export type PackageContent = {
  name: string;
  price: string;
  bestFor: string;
  campaignTarget: string;
  includes: string[];
  cta: string;
};

export type PackagesContent = {
  eyebrow: string;
  h2: string;
  body: string;
  secondBody: string;
  microcopy: string;
  timeline: string[];
  packages: PackageContent[];
  pricingDisclaimer: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqContent = {
  title: string;
  items: FaqItem[];
};

export type ComplianceContent = {
  eyebrow: string;
  h2: string;
  body: string;
  policyNote: string;
  neverDo: string[];
  doInstead: string[];
  importantNote: string;
};

export type LandingSectionsContent = {
  order: SectionOrderItem[];
  hero: HeroContent;
  signalTicker: string[];
  visibilityGap: VisibilityGapContent;
  howItWorks: HowItWorksContent;
  oneService: OneServiceContent;
  campaignExample: CampaignExampleContent;
  philosophy: PhilosophyContent;
  compliance: ComplianceContent;
  whyReviewsMatter: WhyReviewsMatterContent;
  packages: PackagesContent;
  suitability: SuitabilityContent;
  guarantees: GuaranteesContent;
  discreetClientWork: DiscreetClientWorkContent;
  faq: FaqContent;
  finalCta: FinalCtaContent;
};

export type SourceReference = {
  label: string;
  url: string;
};

export type ReviewFlowNode = {
  id: string;
  text: string;
};

export type ReviewFlowRail = {
  label: string;
  nodes: readonly ReviewFlowNode[];
};

export type ReviewSystemStatistic = {
  value: string;
  body: string;
  sourceLabel: string;
};

export type ReviewCollectionGapContent = {
  id: "review-system";
  eyebrow: string;
  h2: string;
  bodyParagraphs: readonly [string, string];
  highlightLine: string;
  closingLine: string;
  statistics: readonly [
    ReviewSystemStatistic,
    ReviewSystemStatistic,
    ReviewSystemStatistic,
  ];
  sourceNote: string;
  sources: {
    brightLocal: SourceReference;
  };
  flow: {
    withoutSystem: ReviewFlowRail;
    withTailoredSystem: ReviewFlowRail;
    caption: string;
  };
};

export type ReviewSystemJourneyStep = {
  number: "01" | "02" | "03" | "04";
  title: string;
  body: string;
};

export type ReviewSystemWorkModule = {
  number: number;
  text: string;
};

export type ReviewSystemPhase = {
  id: "diagnose" | "map" | "build" | "validate-handover";
  label: "Phase A" | "Phase B" | "Phase C" | "Phase D";
  title: string;
  modules: readonly ReviewSystemWorkModule[];
};

export type ReviewSystemJourneyContent = {
  id: "how-it-works";
  eyebrow: string;
  h2: string;
  intro: string;
  customerLaneLabel: string;
  growthSpecialistsLaneLabel: string;
  customerSteps: readonly [
    ReviewSystemJourneyStep,
    ReviewSystemJourneyStep,
    ReviewSystemJourneyStep,
    ReviewSystemJourneyStep,
  ];
  phases: readonly [
    ReviewSystemPhase,
    ReviewSystemPhase,
    ReviewSystemPhase,
    ReviewSystemPhase,
  ];
  bottomStatement: string;
};

export type ReviewSystemImpact = {
  value: string;
  body: string;
  sourceLabel: string;
};

export type ReviewSystemDeliverable = {
  text: string;
};

export type ReviewSystemGuarantee = {
  title: string;
  paragraphs: readonly [string, string];
};

export type ReviewSystemOffer = {
  badge: string;
  productName: string;
  price: "$299 AUD";
  priceQualifier: string;
  bestFor: string;
  deliverables: readonly [
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
    ReviewSystemDeliverable,
  ];
  primaryCta: string;
  ctaMicrocopy: string;
  guarantee: ReviewSystemGuarantee;
  scopeNote: string;
};

export type ReviewSystemOfferContent = {
  id: "pricing";
  eyebrow: string;
  h2: string;
  bodyParagraphs: readonly [string, string];
  impacts: readonly [
    ReviewSystemImpact,
    ReviewSystemImpact,
    ReviewSystemImpact,
  ];
  sourceNote: string;
  sources: {
    brightLocal: SourceReference;
    googleBusinessProfileHelp: SourceReference;
  };
  offers: readonly [ReviewSystemOffer];
};

export type FitCheckOption = {
  value: string;
  label: string;
};

export type FitCheckFieldBase = {
  id: string;
  label: string;
  helper?: string;
  required: boolean;
};

export type FitCheckOptionField = FitCheckFieldBase & {
  options: readonly FitCheckOption[];
};

export type FitCheckResultContent = {
  title: string;
  body: string;
  button: string;
};

export type FitCheckContent = {
  stageOne: {
    eyebrow: string;
    title: string;
    intro: string;
    fields: {
      businessUrl: FitCheckFieldBase;
      industry: FitCheckOptionField;
      customerVolume: FitCheckOptionField;
      requestMethod: FitCheckOptionField;
      tools: FitCheckOptionField;
      compliance: FitCheckFieldBase;
      honeypot: {
        id: string;
        enabled: true;
      };
    };
    submitButton: string;
  };
  results: {
    potentialFit: FitCheckResultContent;
    manualReview: FitCheckResultContent;
  };
  stageTwo: {
    title: string;
    body: string;
    fields: readonly FitCheckFieldBase[];
    submitButton: string;
    success: {
      title: string;
      body: string;
    };
    error: {
      title: string;
      body: string;
    };
  };
};

export type ReviewSystemFaqItem = {
  id:
    | "faq-what-we-build"
    | "faq-what-299-pays-for"
    | "faq-do-it-yourself"
    | "faq-after-fit-check"
    | "faq-compliance"
    | "faq-results"
    | "faq-guarantee-fees";
  question: string;
  answer: string;
};

export type ReviewSystemFooterContent = {
  positioning: string;
  links: readonly NavLink[];
  bottomComplianceLine: string;
};

export type ReviewSystemLegalContent = {
  satisfactionGuarantee: ReviewSystemGuarantee;
  dataHandlingFacts: readonly string[];
  requiresLegalReview: true;
};

export type ReviewSystemContent = {
  reviewCollectionGap: ReviewCollectionGapContent;
  journey: ReviewSystemJourneyContent;
  offer: ReviewSystemOfferContent;
  fitCheck: FitCheckContent;
  faq: {
    title: string;
    items: readonly [
      ReviewSystemFaqItem,
      ReviewSystemFaqItem,
      ReviewSystemFaqItem,
      ReviewSystemFaqItem,
      ReviewSystemFaqItem,
      ReviewSystemFaqItem,
      ReviewSystemFaqItem,
    ];
  };
  footer: ReviewSystemFooterContent;
  legal: ReviewSystemLegalContent;
};
