import type { ReviewSystemContent } from "@/types/content";

export const reviewSystemContent = {
  reviewCollectionGap: {
    id: "review-system",
    eyebrow: "THE REVIEW COLLECTION GAP",
    h2: "Happy customers do not automatically become Google reviews.",
    bodyParagraphs: [
      "Most small businesses do not have a review problem. They have a process problem. The request is late, inconsistent, awkward, buried in a generic link — or left to a busy staff member to remember.",
      "Growth Specialists audits the way customers move through your business, finds the moments where genuine reviews are being left on the table, and builds a tailored review collection system into the workflow you already use.",
    ],
    highlightLine:
      "Not a campaign. Not a generic template. A working review collection system built around your business.",
    closingLine: "One setup. A repeatable way to ask. Less left to chance.",
    statistics: [
      {
        value: "97%",
        body: "of U.S. consumers surveyed read reviews for local businesses.",
        sourceLabel: "BrightLocal 2026",
      },
      {
        value: "47%",
        body: "said they would not use a business with fewer than 20 reviews.",
        sourceLabel: "BrightLocal 2026",
      },
      {
        value: "65%",
        body: "of consumers who were asked to write a review in the previous year said they did.",
        sourceLabel: "BrightLocal 2026",
      },
    ],
    sourceNote:
      "Source: BrightLocal Local Consumer Review Survey 2026, survey of U.S. adult consumers. Consumer behaviour varies by market and business category.",
    sources: {
      brightLocal: {
        label: "BrightLocal Local Consumer Review Survey 2026",
        url: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
    },
    flow: {
      withoutSystem: {
        label: "WITHOUT A SYSTEM",
        nodes: [
          {
            id: "experience-completed",
            text: "Customer experience completed",
          },
          {
            id: "customer-satisfied",
            text: "Customer leaves satisfied",
          },
          {
            id: "nobody-asks",
            text: "Nobody asks at the right moment",
          },
          {
            id: "review-never-appears",
            text: "The review never appears",
          },
        ],
      },
      withTailoredSystem: {
        label: "WITH A TAILORED SYSTEM",
        nodes: [
          {
            id: "experience-completed",
            text: "Customer experience completed",
          },
          {
            id: "trigger-reached",
            text: "The agreed trigger is reached",
          },
          {
            id: "neutral-request-sent",
            text: "A clear, neutral request is sent",
          },
          {
            id: "simple-feedback-path",
            text: "The customer gets a simple path to honest feedback",
          },
        ],
      },
      caption:
        "The system does not change what customers think. It makes the request timely, consistent and easy to complete.",
    },
  },
  journey: {
    id: "how-it-works",
    eyebrow: "HOW THE PROGRAM WORKS",
    h2: "You make four decisions. We do the work in between.",
    intro:
      "The part you see is deliberately simple. The value sits in the audit, workflow design, copy, build, placement logic, implementation and testing happening behind it.",
    customerLaneLabel: "YOUR PART",
    growthSpecialistsLaneLabel: "WHAT WE BUILD BEHIND THE SCENES",
    customerSteps: [
      {
        number: "01",
        title: "Complete the fit check",
        body: "Answer a few business questions in under 60 seconds. No name, phone number or email is required.",
      },
      {
        number: "02",
        title: "Give us the operational detail",
        body: "If your business looks suitable, we invite you to continue. We may send one short questionnaire about your customer flow, tools and hand-off points.",
      },
      {
        number: "03",
        title: "Review and approve",
        body: "You check the customer-facing wording, branding, timing and placements. One reasonable revision is included.",
      },
      {
        number: "04",
        title: "Learn it and launch",
        body: "In a 20-minute handoff, we install or transfer the finished system, show your team when to use it and make sure the process is clear.",
      },
    ],
    phases: [
      {
        id: "diagnose",
        label: "Phase A",
        title: "Diagnose",
        modules: [
          {
            number: 1,
            text: "Suitability and policy screen",
          },
          {
            number: 2,
            text: "Google Business Profile baseline",
          },
          {
            number: 3,
            text: "Existing tool and workflow audit",
          },
        ],
      },
      {
        id: "map",
        label: "Phase B",
        title: "Map",
        modules: [
          {
            number: 4,
            text: "Customer journey map",
          },
          {
            number: 5,
            text: "Missed review-request points",
          },
          {
            number: 6,
            text: "Trigger, timing and channel decisions",
          },
        ],
      },
      {
        id: "build",
        label: "Phase C",
        title: "Build",
        modules: [
          {
            number: 7,
            text: "Customer-facing request wording",
          },
          {
            number: 8,
            text: "Mobile review page, QR or short-link assets where useful",
          },
          {
            number: 9,
            text: "Email, SMS, receipt or staff-prompt assets",
          },
          {
            number: 10,
            text: "Standard setup inside compatible existing tools",
          },
        ],
      },
      {
        id: "validate-handover",
        label: "Phase D",
        title: "Validate and hand over",
        modules: [
          {
            number: 11,
            text: "Mobile, link and request-path QA",
          },
          {
            number: 12,
            text: "Team trigger guide and usage checklist",
          },
          {
            number: 13,
            text: "20-minute implementation and handoff session",
          },
        ],
      },
    ],
    bottomStatement:
      "The finished system should feel like part of the business — not another marketing task your team has to remember.",
  },
  offer: {
    id: "pricing",
    eyebrow: "ONE-OFF SYSTEM SETUP",
    h2: "Build the system once. Stop relying on memory.",
    bodyParagraphs: [
      "For $299 AUD, we design and implement a tailored review-request process around your genuine customers, existing tools and normal workflow.",
      "No retainer. No purchased reviews. No promise about ratings. Just a professionally built system your team can use consistently.",
    ],
    impacts: [
      {
        value: "74%",
        body: "of U.S. consumers surveyed seek reviews written within the previous three months.",
        sourceLabel: "BrightLocal 2026",
      },
      {
        value: "85%",
        body: "said positive reviews make them more likely to use a business.",
        sourceLabel: "BrightLocal 2026",
      },
      {
        value: "LOCAL VISIBILITY",
        body: "Google says more reviews and positive ratings can help a business’s local ranking.",
        sourceLabel: "Google Business Profile Help",
      },
    ],
    sourceNote:
      "BrightLocal Local Consumer Review Survey 2026, survey of U.S. adult consumers; Google Business Profile Help. These findings do not guarantee results for an individual business.",
    sources: {
      brightLocal: {
        label: "BrightLocal Local Consumer Review Survey 2026",
        url: "https://www.brightlocal.com/research/local-consumer-review-survey/",
      },
      googleBusinessProfileHelp: {
        label: "Google Business Profile Help",
        url: "https://support.google.com/business/answer/7091?hl=en",
      },
    },
    offers: [
      {
        badge: "ONE-OFF • NO RETAINER",
        productName: "Custom Review Capture System",
        price: "$299 AUD",
        priceQualifier: "one-off setup",
        bestFor:
          "Built for small businesses with genuine customers but no reliable, repeatable review-request process.",
        deliverables: [
          {
            text: "Review profile and operational workflow audit",
          },
          {
            text: "Custom customer-journey and review-opportunity map",
          },
          {
            text: "Tailored trigger, timing and channel plan",
          },
          {
            text: "Customer-facing request copy for the agreed touchpoints",
          },
          {
            text: "Professionally built digital assets for the agreed system",
          },
          {
            text: "Mobile review handoff page, QR code or short link where useful",
          },
          {
            text: "Standard setup inside compatible tools already used by the business",
          },
          {
            text: "Team trigger guide and usage checklist",
          },
          {
            text: "20-minute review, implementation and handoff session",
          },
          {
            text: "One reasonable revision after review",
          },
          {
            text: "Satisfaction guarantee described below",
          },
        ],
        primaryCta: "See if my business is a fit",
        ctaMicrocopy:
          "Takes less than 60 seconds. No name, phone number or email required. No commitment. No payment.",
        guarantee: {
          title: "Satisfaction guarantee",
          paragraphs: [
            "We check the finished system against the agreed scope and include one reasonable revision. If we cannot deliver the agreed system or bring it to an agreed usable standard, we refund the $299 setup fee.",
            "This guarantee covers the system we deliver. It does not guarantee review volume, star rating, review wording, customer sentiment, Google publication or Google’s later treatment of a review.",
          ],
        },
        scopeNote:
          "If the recommended system requires third-party software, SMS credits, NFC hardware, a paid app plan, domain or hosting costs, those costs must be disclosed before the business accepts its invitation. Growth Specialists must not add recurring fees without approval.",
      },
    ],
  },
  fitCheck: {
    stageOne: {
      eyebrow: "60-SECOND FIT CHECK",
      title: "See whether your business would benefit.",
      intro:
        "This first step asks for business information only. No name, phone number or email is required.",
      fields: {
        businessUrl: {
          id: "businessUrl",
          label: "Business website or Google Business Profile",
          helper: "Paste either link.",
          required: true,
        },
        industry: {
          id: "industry",
          label: "What type of business is it?",
          required: true,
          options: [
            {
              value: "Trades and home services",
              label: "Trades and home services",
            },
            {
              value: "Health and allied health",
              label: "Health and allied health",
            },
            {
              value: "Beauty and personal care",
              label: "Beauty and personal care",
            },
            {
              value: "Automotive",
              label: "Automotive",
            },
            {
              value: "Hospitality",
              label: "Hospitality",
            },
            {
              value: "Retail",
              label: "Retail",
            },
            {
              value: "Professional services",
              label: "Professional services",
            },
            {
              value: "Education or training",
              label: "Education or training",
            },
            {
              value: "Other",
              label: "Other",
            },
          ],
        },
        customerVolume: {
          id: "customerVolume",
          label:
            "Approximately how many customer jobs, appointments or sales are completed each month?",
          required: true,
          options: [
            {
              value: "0–4",
              label: "0–4",
            },
            {
              value: "5–19",
              label: "5–19",
            },
            {
              value: "20–49",
              label: "20–49",
            },
            {
              value: "50–199",
              label: "50–199",
            },
            {
              value: "200+",
              label: "200+",
            },
          ],
        },
        requestMethod: {
          id: "requestMethod",
          label: "How are Google reviews currently requested?",
          required: true,
          options: [
            {
              value: "We do not ask",
              label: "We do not ask",
            },
            {
              value: "Staff ask manually when they remember",
              label: "Staff ask manually when they remember",
            },
            {
              value: "We share a link or QR code",
              label: "We share a link or QR code",
            },
            {
              value: "We send email or SMS requests",
              label: "We send email or SMS requests",
            },
            {
              value: "We already use an automated system",
              label: "We already use an automated system",
            },
            {
              value: "Other",
              label: "Other",
            },
          ],
        },
        tools: {
          id: "tools",
          label: "Which tools are already part of the customer journey?",
          required: false,
          options: [
            {
              value: "Booking system",
              label: "Booking system",
            },
            {
              value: "CRM",
              label: "CRM",
            },
            {
              value: "POS or checkout",
              label: "POS or checkout",
            },
            {
              value: "Invoicing software",
              label: "Invoicing software",
            },
            {
              value: "Email",
              label: "Email",
            },
            {
              value: "SMS",
              label: "SMS",
            },
            {
              value: "Website form or online checkout",
              label: "Website form or online checkout",
            },
            {
              value: "None of these",
              label: "None of these",
            },
            {
              value: "Other",
              label: "Other",
            },
          ],
        },
        compliance: {
          id: "complianceAccepted",
          label:
            "This business serves genuine customers, and I understand that review requests must be honest, voluntary and not conditioned on a particular rating or wording.",
          required: true,
        },
        honeypot: {
          id: "honeypot",
          enabled: true,
        },
      },
      submitButton: "Show me my fit",
    },
    results: {
      potentialFit: {
        title: "This looks like a potential fit.",
        body: "Your business appears to have genuine customer volume and a review-request gap we may be able to solve. Request a manual review and we will invite you if the $299 system is suitable.",
        button: "Request a manual review",
      },
      manualReview: {
        title: "A manual review would be better.",
        body: "Your answers do not make the value obvious yet. You can still request a manual review. We will tell you honestly if the $299 setup is unlikely to be worthwhile.",
        button: "Request a manual review",
      },
    },
    stageTwo: {
      title: "Where should we send the decision?",
      body: "We will use these details only to assess this application and respond. This is not a mailing-list signup.",
      fields: [
        {
          id: "workEmail",
          label: "Work email",
          required: true,
        },
        {
          id: "contactName",
          label: "Contact name",
          required: false,
        },
        {
          id: "businessName",
          label: "Business name",
          helper: "Optional if it cannot be inferred from the supplied URL.",
          required: false,
        },
        {
          id: "notes",
          label: "Anything we should know?",
          helper: "Optional textarea.",
          required: false,
        },
      ],
      submitButton: "Submit for review",
      success: {
        title: "Application received.",
        body: "We will review the business and send an invitation if the system is a suitable fit. No payment has been taken.",
      },
      error: {
        title: "The application could not be sent.",
        body: "Please try again. Your fit-check answers will remain in the form.",
      },
    },
  },
  faq: {
    title: "You might be wondering...",
    items: [
      {
        id: "faq-what-we-build",
        question: "What exactly do you build?",
        answer:
          "We build the review-request process your business should already have, tailored to the way customers move through it. Depending on the workflow, that can include request timing, trigger points, customer-facing wording, a mobile review handoff page, a direct Google review link, QR or short-link assets, email or SMS templates, staff prompts, and standard setup inside tools you already use. Before payment, the invitation will state exactly what your build includes.",
      },
      {
        id: "faq-what-299-pays-for",
        question: "What am I actually paying $299 for?",
        answer:
          "You are not paying $299 for a QR code or a generic message template. You are paying for the diagnosis, customer-journey mapping, compliance decisions, copywriting, web development, setup, testing and handoff needed to make the system fit naturally inside your operation. We know where businesses commonly leave reviews on the table and how to remove friction without using fake, paid, pressured or selective review tactics.",
      },
      {
        id: "faq-do-it-yourself",
        question: "Can I do this myself?",
        answer:
          "Absolutely. Every service we sell is technically something you could learn and build yourself. You could also build your own website, house or car; most people pay a specialist when the time saved, lower risk and better finish produce a worthwhile return. You can spend your time working out what should be built, which genuine customers to ask, when to ask them, where the request should appear, how it should be worded and how it should connect to your tools — or have us design, build and test it for you.",
      },
      {
        id: "faq-after-fit-check",
        question: "What happens after the 60-second fit check?",
        answer:
          "The fit check asks for business information only. It does not require your name, phone number or email. At the end, you can see whether the service is likely to help. If you want a manual review, you can then provide an email address so we can assess the business and send an invitation if it is suitable. Accepted businesses pay the one-off fee, answer any final operational questions, approve the system and complete the 20-minute handoff.",
      },
      {
        id: "faq-compliance",
        question: "Is the system compliant with Google’s review policies?",
        answer:
          "The system is designed around genuine, voluntary customer feedback. It must not offer incentives, pressure customers, prescribe a rating or specific wording, or selectively ask only customers expected to leave positive feedback. Google permits businesses to ask for reviews that represent genuine experiences under those conditions. We design around those rules, but Google controls whether a review is published, delayed, filtered or later removed.",
      },
      {
        id: "faq-results",
        question: "How many reviews will I get?",
        answer:
          "We do not promise a number, star rating or timeframe. A better system can improve consistency, timing and ease, but results still depend on customer volume, experience quality, team adoption, response rates and Google’s platform decisions. We guarantee the agreed system deliverables — not customer behaviour or platform outcomes.",
      },
      {
        id: "faq-guarantee-fees",
        question:
          "What does the satisfaction guarantee cover, and are there ongoing fees?",
        answer:
          "The $299 is Growth Specialists’ one-off setup fee. At handoff, we check the build against the agreed scope and include one reasonable revision. If we cannot deliver the agreed system or bring it to an agreed usable standard, we refund the setup fee. If the recommended system requires third-party software, SMS credits, NFC hardware, a paid app plan, domain or hosting costs, those costs are disclosed before you accept. The guarantee does not cover review volume, ratings, wording, publication or Google’s removal decisions.",
      },
    ],
  },
  footer: {
    positioning:
      "Tailored Google review collection systems for small businesses that want a better process — not shortcuts.",
    links: [
      {
        label: "How it works",
        href: "#how-it-works",
      },
      {
        label: "$299 setup",
        href: "#pricing",
      },
      {
        label: "FAQ",
        href: "#faq",
      },
      {
        label: "Privacy",
        href: "/privacy",
      },
      {
        label: "Terms",
        href: "/terms",
      },
      {
        label: "Satisfaction Guarantee",
        href: "/satisfaction-guarantee",
      },
    ],
    bottomComplianceLine:
      "Reviews must be honest and based on genuine customer experience. Growth Specialists does not sell reviews, guarantee ratings, control review wording or guarantee Google publication.",
  },
  legal: {
    satisfactionGuarantee: {
      title: "Satisfaction guarantee",
      paragraphs: [
        "We check the finished system against the agreed scope and include one reasonable revision. If we cannot deliver the agreed system or bring it to an agreed usable standard, we refund the $299 setup fee.",
        "This guarantee covers the system we deliver. It does not guarantee review volume, star rating, review wording, customer sentiment, Google publication or Google’s later treatment of a review.",
      ],
    },
    dataHandlingFacts: [
      "Stage One fit-check data is not sent to the server until the user chooses to submit Stage Two.",
      "Application data includes fit-check answers, preliminary result category, contact details, source page, timestamp and compliance confirmation.",
      "Work email is used only to assess the application and respond; this is not a mailing-list signup.",
      "No phone number is requested.",
      "Spam-filled honeypot submissions should return a generic success and send nothing.",
      "Aggregate analytics may record fit-check progress but must not contain URLs, business names, email addresses, contact names, notes or other personal information.",
      "Accepted applicants should be sent a separate invitation and secure payment link after manual review.",
    ],
    requiresLegalReview: true,
  },
} satisfies ReviewSystemContent;
