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
