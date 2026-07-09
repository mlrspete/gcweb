import type { SiteContent } from "@/types/content";

export const siteContent = {
  displayName: "Growth Specialists",
  wordmark: "growthspecialists",
  metadata: {
    title: "Growth Specialists | Local Visibility Campaigns",
    titleTemplate: "%s | Growth Specialists",
    description:
      "Compliance-first local visibility campaigns that help suitable small businesses create genuine local experiences, collect honest feedback and build the visibility layer customers look for when they search.",
    siteName: "Growth Specialists",
    ogImagePath: "/og-growth-specialists.png",
    twitterCard: "summary_large_image",
    canonicalPath: "/",
  },
  nav: {
    logoLabel: "growthspecialists",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Compliance", href: "#compliance" },
      { label: "Pricing", href: "#packages" },
      { label: "FAQ", href: "#faq" },
      { label: "Join Now", href: "#join-now" },
    ],
    buttonLabel: "Join the next wave",
    microcopy:
      "No quote call. No long consultation. Just a clean campaign slot.",
  },
  foundationStatus: {
    summary:
      "Ocean/coral design system loaded, structured landing page content ready, and the temporary App Router page is server-rendered to avoid hydration drift.",
    confirmations: [
      "Growth Specialists",
      "Ocean/coral design system loaded",
      "Structured content architecture ready",
    ],
    complianceLine:
      "Foundation copy stays aligned to genuine local experiences, honest feedback, eligible review opportunities, and non-incentivised review requests.",
  },
} satisfies SiteContent;

export const foundationStatusContent = siteContent.foundationStatus;

export function getSiteUrl() {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return "https://growth-specialists.example";
}

export function getCanonicalUrl(path = siteContent.metadata.canonicalPath) {
  return new URL(path, getSiteUrl()).toString();
}
