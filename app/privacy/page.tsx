import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/content/legal";
import { getCanonicalUrl, siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: legalPages.privacy.description,
  alternates: {
    canonical: getCanonicalUrl("/privacy"),
  },
  openGraph: {
    title: `Privacy | ${siteContent.displayName}`,
    description: legalPages.privacy.description,
    url: getCanonicalUrl("/privacy"),
  },
};

export default function PrivacyPage() {
  return <LegalPage content={legalPages.privacy} />;
}
