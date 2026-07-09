import { JsonLd } from "@/components/seo/JsonLd";
import { HeroSection } from "@/components/sections/HeroSection";
import { CampaignExampleSection } from "@/components/sections/CampaignExampleSection";
import { ComplianceSection } from "@/components/sections/ComplianceSection";
import { DiscreetClientWorkSection } from "@/components/sections/DiscreetClientWorkSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { GuaranteesSection } from "@/components/sections/GuaranteesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { OneServiceSection } from "@/components/sections/OneServiceSection";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { SignalTicker } from "@/components/sections/SignalTicker";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SuitabilitySection } from "@/components/sections/SuitabilitySection";
import { VisibilityGapSection } from "@/components/sections/VisibilityGapSection";
import { WhyReviewsMatterSection } from "@/components/sections/WhyReviewsMatterSection";
import { getCanonicalUrl, siteContent } from "@/content/site";

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${getCanonicalUrl()}#professional-service`,
  name: siteContent.displayName,
  url: getCanonicalUrl(),
  description: siteContent.metadata.description,
  serviceType: "Local visibility campaigns",
  areaServed: "Local service areas",
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Local visibility campaigns",
      description:
        "Compliance-first campaigns built around genuine local experiences, honest feedback and customer visibility signals.",
    },
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={professionalServiceSchema} />
      <SiteHeader />
      <main>
        <HeroSection />
        <SignalTicker />
        <VisibilityGapSection />
        <HowItWorksSection />
        <OneServiceSection />
        <CampaignExampleSection />
        <PhilosophySection />
        <ComplianceSection />
        <WhyReviewsMatterSection />
        <PackagesSection />
        <SuitabilitySection />
        <GuaranteesSection />
        <DiscreetClientWorkSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <SiteFooter />
    </>
  );
}
