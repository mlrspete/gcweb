import { ParallaxFloat, Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { FishIcon } from "@/components/visuals";
import { campaignExampleContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

function ActivationScene() {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[28rem] overflow-hidden rounded-lg bg-deep-ocean-navy p-6 shadow-ocean-soft"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgb(223_247_255_/_0.18),transparent_28%),radial-gradient(circle_at_80%_62%,rgb(255_107_95_/_0.2),transparent_30%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-abyss-blue to-transparent" />
      <div className="absolute bottom-12 left-8 h-28 w-36 rounded-t-[4rem] border border-soft-coral-pink/40 bg-reef-coral/75 shadow-coral-glow" />
      <div className="absolute bottom-[5.25rem] left-12 h-10 w-28 rounded-full bg-soft-coral-pink/80" />
      <div className="absolute bottom-28 left-12 rounded-full bg-pearl-white/[0.88] px-3 py-1 text-[0.62rem] font-extrabold text-deep-ocean-navy">
        Supported by Example Business
      </div>
      <div className="absolute bottom-16 right-10 rounded-lg border border-pearl-white/30 bg-pearl-white/[0.12] p-3 backdrop-blur">
        <div className="grid size-16 grid-cols-3 gap-1">
          {Array.from({ length: 9 }).map((_, index) => (
            <span
              key={index}
              className="rounded-[2px] bg-pearl-white/80 odd:bg-seafoam/80"
            />
          ))}
        </div>
      </div>
      {[18, 34, 54, 68].map((left, index) => (
        <FishIcon
          key={left}
          variant={index === 2 ? "standout" : "default"}
          size={42}
          className="absolute"
          style={{ left: `${left}%`, top: `${32 + index * 10}%` }}
        />
      ))}
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-[22rem] rounded-[2.4rem] border border-deep-ocean-navy/20 bg-deep-ocean-navy p-3 shadow-ocean-soft">
      <div className="overflow-hidden rounded-[1.8rem] bg-pearl-white text-deep-ocean-navy">
        <div className="bg-clear-water-blue px-5 py-6">
          <p className="text-xs font-extrabold uppercase text-reef-coral">
            Example Local Business
          </p>
          <h3 className="mt-2 text-2xl font-extrabold">
            See the work. Meet the business.
          </h3>
        </div>
        <div className="grid gap-3 p-5 text-sm font-bold">
          {[
            "Case study card",
            "Services",
            "Customer experience summary",
            "Leave honest feedback",
            "Make an enquiry",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-deep-ocean-navy/10 bg-warm-sand px-4 py-3"
            >
              {item}
            </div>
          ))}
          <p className="text-xs font-semibold leading-5 text-abyss-blue/75">
            Only leave a public review if it reflects a genuine experience.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CampaignExampleSection() {
  return (
    <Section id="campaign-example" background="sand" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={campaignExampleContent.eyebrow}
          title={campaignExampleContent.h2}
          body={campaignExampleContent.body}
          align="center"
          className="mb-10"
        />
      </Reveal>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
        <div>
          <ParallaxFloat desktopOnly distance={36}>
            <ActivationScene />
          </ParallaxFloat>
          <GlassCard className="mt-6">
            <p className="text-sm font-semibold leading-7">
              {campaignExampleContent.exampleActivation}
            </p>
          </GlassCard>
        </div>
        <div>
          <ParallaxFloat desktopOnly distance={-28}>
            <PhoneMockup />
          </ParallaxFloat>
          <p className="mt-6 text-base font-semibold leading-8 text-abyss-blue/80">
            {campaignExampleContent.secondBody}
          </p>
          <p className="mt-4 text-sm font-bold leading-6 text-abyss-blue/70">
            {campaignExampleContent.complianceNote}
          </p>
        </div>
      </div>
    </Section>
  );
}
