import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { FAQSection } from "@/components/sections/FAQSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ReviewCollectionGapSection } from "@/components/sections/ReviewCollectionGapSection";
import { ReviewSystemJourneySection } from "@/components/sections/ReviewSystemJourneySection";
import { ReviewSystemOfferSection } from "@/components/sections/ReviewSystemOfferSection";
import { SignalTicker } from "@/components/sections/SignalTicker";
import { getCanonicalUrl, siteContent } from "@/content/site";

const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${getCanonicalUrl()}#professional-service`,
  name: siteContent.displayName,
  url: getCanonicalUrl(),
  description:
    "Tailored Google review collection systems for small businesses, built around genuine customers, existing tools and compliant requests for honest feedback.",
  serviceType: "Custom Google Review Collection System Setup",
  makesOffer: {
    "@type": "Offer",
    price: "299",
    priceCurrency: "AUD",
    itemOffered: {
      "@type": "Service",
      name: "Custom Google Review Collection System Setup",
      description:
        "A one-off workflow audit, review-request system design, digital asset build, standard implementation and handoff for suitable small businesses.",
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
        <ReviewCollectionGapSection />
        <ReviewSystemJourneySection />
        <ReviewSystemOfferSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}
