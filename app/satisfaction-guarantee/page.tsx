import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/content/legal";
import { getCanonicalUrl, siteContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Satisfaction Guarantee",
  description: legalPages.satisfactionGuarantee.description,
  alternates: {
    canonical: getCanonicalUrl("/satisfaction-guarantee"),
  },
  openGraph: {
    title: `Satisfaction Guarantee | ${siteContent.displayName}`,
    description: legalPages.satisfactionGuarantee.description,
    url: getCanonicalUrl("/satisfaction-guarantee"),
  },
};

export default function SatisfactionGuaranteePage() {
  return <LegalPage content={legalPages.satisfactionGuarantee} />;
}
