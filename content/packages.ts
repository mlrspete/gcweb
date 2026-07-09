import type { PackagesContent } from "@/types/content";

export const packageTargetCopy =
  "Designed to build toward eligible honest review opportunities/outcomes over time, subject to genuine customer experience, campaign suitability, response rates and platform rules.";

export const packagesContent = {
  eyebrow: "JOIN THE NEXT CAMPAIGN WAVE",
  h2: "Choose your slot. We handle the campaign.",
  body: "No long consultation. No complicated proposal. No agency retainer.",
  secondBody:
    "Join the program, complete your business intake form and we will build your custom campaign experience within 48 hours. Once approved for accuracy, your business is added into our upcoming activation schedule and introduced to quality local audiences through our existing campaign waves.",
  microcopy:
    "You can cancel before launch. Refunds are handled according to our refund policy and terms.",
  timeline: [
    "Join",
    "Complete form",
    "48-hour experience build",
    "Review page",
    "Added to campaign wave",
    "Monthly reporting",
  ],
  packages: [
    {
      name: "Foundation Wave",
      price: "$299",
      bestFor: "New or early-stage businesses with low review volume.",
      campaignTarget: packageTargetCopy,
      includes: [
        "Google Business Profile visibility review",
        "Business intake form",
        "Custom experience page built within 48 hours",
        "Client review before launch",
        "Inclusion in local activation schedule",
        "QR feedback pathway",
        "Private feedback option",
        "Honest public review pathway for eligible users",
        "Plain-English reporting",
      ],
      cta: "Join Foundation Wave",
    },
    {
      name: "Momentum Wave",
      price: "$500",
      bestFor:
        "Competitive local sectors or owners who want a stronger visibility base.",
      campaignTarget: packageTargetCopy,
      includes: [
        "Everything in Foundation",
        "Larger campaign allocation",
        "Expanded audience matching",
        "More activation capacity",
        "Additional experience-page content",
        "Review response guidance",
        "Longer reporting window",
      ],
      cta: "Join Momentum Wave",
    },
  ],
  pricingDisclaimer:
    "We do not sell reviews, guarantee positive ratings, control review wording or guarantee Google publication. Reviews must be honest and based on genuine experience. We guarantee campaign delivery, transparent process and continued compliant effort toward the agreed campaign target.",
} satisfies PackagesContent;
