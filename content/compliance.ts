import type { ComplianceContent } from "@/types/content";

export const complianceContent = {
  eyebrow: "BUILT FOR REPUTATION-SENSITIVE BUSINESSES",
  h2: "No fake reviews. No review buying. No pressure tactics.",
  body: "We know your Google Business Profile is valuable. That is why the campaign system is built around genuine experiences, transparent requests and non-incentivised feedback.",
  policyNote:
    "Google's policy does not ban businesses from asking for reviews. It allows merchants to solicit content that represents a genuine experience, as long as there is no incentive and no attempt to influence the rating or contents of the review.",
  neverDo: [
    "We never write reviews for customers.",
    "We never pay people to leave reviews.",
    "We never offer freebies tied to reviews.",
    "We never tell people what rating to leave.",
    "We never pressure people to review on the spot.",
    "We never request specific wording.",
    "We never run campaigns for unsuitable businesses.",
  ],
  doInstead: [
    "We create real-world local exposure.",
    "We build tailored experience pages.",
    "We invite honest feedback from eligible people.",
    "We separate private feedback from public review requests.",
    "We make the process clear and transparent.",
    "We pace campaigns to maintain quality.",
    "We report campaign activity in plain English.",
  ],
  importantNote:
    "Private feedback can be routed privately. Public Google reviews should not be gated or selectively requested only from people expected to leave positive feedback.",
} satisfies ComplianceContent;
