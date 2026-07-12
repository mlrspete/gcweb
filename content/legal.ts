import { reviewSystemContent } from "@/content/reviewSystem";
import { siteContent } from "@/content/site";

// Australian legal review remains a launch gate before accepting payments.

export type LegalSection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly {
    label: string;
    href: string;
  }[];
};

export type LegalPageContent = {
  title: string;
  description: string;
  sections: readonly LegalSection[];
};

const privacyRequestContact = siteContent.contactEmail
  ? `Email ${siteContent.contactEmail} to request access to, correction of, or deletion of application information.`
  : "Reply to any application correspondence from Growth Specialists to make a privacy request.";

export const legalPages = {
  privacy: {
    title: "Privacy",
    description:
      "How Growth Specialists handles Custom Review Capture System application information.",
    sections: [
      {
        heading: "Fit-check information",
        paragraphs: [
          "The first stage of the fit check remains in the browser until you choose to request a manual review and submit the second stage.",
          "When you submit the second stage, the final application includes the supplied business URL, category answers, compliance confirmation, preliminary result category, optional contact information and any notes you choose to provide.",
        ],
      },
      {
        heading: "How the information is used",
        paragraphs: [
          "Growth Specialists uses application information to assess whether the Custom Review Capture System is likely to be suitable and to respond to the application.",
          "The application is not a mailing-list signup. Email is delivered through the configured provider, and service providers such as hosting, email delivery and analytics services may process information as part of operating the website.",
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "Aggregate analytics may record fit-check progress and result categories, but the analytics implementation is designed to exclude URLs, work emails, contact names, business names, notes and other free-text personal information.",
        ],
      },
      {
        heading: "Security and retention",
        paragraphs: [
          "Growth Specialists uses reasonable technical and operational measures to protect application information and keeps it only for as long as reasonably needed to assess and respond to applications, operate the service and maintain appropriate business records.",
          privacyRequestContact,
        ],
      },
    ],
  },
  terms: {
    title: "Terms",
    description:
      "Product terms for the Custom Review Capture System suitability and setup process.",
    sections: [
      {
        heading: "Invitation and suitability",
        paragraphs: [
          "The website provides a fit check and manual review process for the Custom Review Capture System. Completing the fit check or requesting a manual review does not mean a business has been accepted.",
          "Accepted businesses receive a separate invitation before payment is requested.",
        ],
      },
      {
        heading: "$299 AUD setup",
        paragraphs: [
          "The setup fee is $299 AUD one-off for accepted businesses. The agreed scope is defined before payment, and included deliverables depend on the system Growth Specialists agrees to build for that business.",
          "If the recommended system requires third-party software, SMS credits, NFC hardware, a paid app plan, domain or hosting costs, those costs are disclosed before the business accepts. Growth Specialists does not add hidden recurring fees without approval.",
        ],
      },
      {
        heading: "Customer responsibilities",
        paragraphs: [
          "The customer is responsible for providing accurate information, lawful access to compatible tools where access is needed, and confirming that review requests are made only to people with genuine customer experiences.",
        ],
      },
      {
        heading: "Review and platform outcomes",
        paragraphs: [
          "Growth Specialists does not guarantee review volume, star rating, review wording, customer sentiment, Google publication or ranking improvement. Google controls whether reviews are published, delayed, filtered, removed or otherwise treated by its platform.",
          "The Satisfaction Guarantee explains the system-deliverable guarantee and the excluded review or platform outcomes.",
        ],
        links: [
          {
            label: "Satisfaction Guarantee",
            href: "/satisfaction-guarantee",
          },
        ],
      },
      {
        heading: "Legal review",
        paragraphs: [
          "These terms and the payment/refund wording should be reviewed by an Australian lawyer before payment operations begin.",
        ],
      },
    ],
  },
  satisfactionGuarantee: {
    title: "Satisfaction Guarantee",
    description:
      "What the Custom Review Capture System satisfaction guarantee covers and excludes.",
    sections: [
      {
        heading: reviewSystemContent.legal.satisfactionGuarantee.title,
        paragraphs: reviewSystemContent.legal.satisfactionGuarantee.paragraphs,
      },
      {
        heading: "Third-party costs",
        paragraphs: [reviewSystemContent.offer.offers[0].scopeNote],
      },
      {
        heading: "What is guaranteed",
        bullets: [
          "Growth Specialists checks the finished system against the agreed scope.",
          "One reasonable revision is included.",
          "The refund applies when Growth Specialists cannot deliver the agreed system or bring it to an agreed usable standard.",
        ],
      },
      {
        heading: "What is not guaranteed",
        bullets: [
          "Review volume.",
          "Star rating.",
          "Review wording.",
          "Customer sentiment.",
          "Google publication, filtering, removal or later treatment of a review.",
        ],
      },
    ],
  },
} satisfies Record<string, LegalPageContent>;
