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
    openGraphTitle: string;
    openGraphDescription: string;
    siteName: string;
    ogImagePath: string;
    ogImageAlt: string;
    twitterCard: "summary_large_image";
    canonicalPath: string;
  };
  nav: {
    logoLabel: string;
    links: NavLink[];
    buttonLabel: string;
    microcopy: string;
  };
};

export type HeroContent = {
  eyebrow: string;
  h1: string;
  subheading: string;
  trustLine: string;
  primaryCta: string;
  scrollCue: string;
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
