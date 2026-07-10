import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/content/legal";
import { getCanonicalUrl, siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms",
  description: legalPages.terms.description,
  alternates: {
    canonical: getCanonicalUrl("/terms"),
  },
  openGraph: {
    title: `Terms | ${siteContent.displayName}`,
    description: legalPages.terms.description,
    url: getCanonicalUrl("/terms"),
  },
};

export default function TermsPage() {
  return <LegalPage content={legalPages.terms} />;
}
