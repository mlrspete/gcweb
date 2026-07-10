import type { SiteContent } from "@/types/content";

const configuredContactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

export const siteContent = {
  displayName: "Growth Specialists",
  wordmark: "growthspecialists",
  ...(configuredContactEmail ? { contactEmail: configuredContactEmail } : {}),
  metadata: {
    title: "Growth Specialists | Custom Google Review Collection Systems",
    titleTemplate: "%s | Growth Specialists",
    description:
      "Tailored Google review collection systems for small businesses, built around genuine customers, existing tools and compliant requests for honest feedback.",
    openGraphTitle: "Custom Review Capture Systems | Growth Specialists",
    openGraphDescription:
      "We audit your customer journey, find missed review-request moments and build a repeatable system into the workflow your business already uses.",
    siteName: "Growth Specialists",
    ogImagePath: "/og-growth-specialists.png",
    ogImageAlt: "Growth Specialists Custom Review Capture Systems social card",
    twitterCard: "summary_large_image",
    canonicalPath: "/",
  },
  nav: {
    logoLabel: "growthspecialists",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Compliance", href: "#faq-compliance" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Join Now", href: "#pricing" },
    ],
    buttonLabel: "Join the next wave",
    microcopy:
      "No quote call. No long consultation. Just a clean campaign slot.",
  },
} satisfies SiteContent;

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
