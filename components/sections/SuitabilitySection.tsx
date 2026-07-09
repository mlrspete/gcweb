import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { FishIcon } from "@/components/visuals";
import { suitabilityContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

export function SuitabilitySection() {
  return (
    <Section id="suitability" background="pearl" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={suitabilityContent.eyebrow}
          title={suitabilityContent.h2}
          align="center"
        />
      </Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <GlassCard className="relative overflow-hidden">
          <div aria-hidden="true" className="absolute right-5 top-5 opacity-35">
            <FishIcon variant="standout" size={96} />
          </div>
          <h3 className="text-2xl font-extrabold">Good fit</h3>
          <ul className="mt-6 grid gap-4">
            {suitabilityContent.goodFit.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm font-semibold leading-7"
              >
                <span className="mt-2 size-2 rounded-full bg-seafoam" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard className="relative overflow-hidden">
          <div className="absolute right-6 top-6 flex size-20 items-center justify-center rounded-full border-4 border-reef-coral text-reef-coral opacity-40">
            <span
              aria-hidden="true"
              className="h-1 w-14 rotate-45 bg-current"
            />
          </div>
          <h3 className="text-2xl font-extrabold">Not a fit</h3>
          <ul className="mt-6 grid gap-4">
            {suitabilityContent.notFit.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm font-semibold leading-7"
              >
                <span className="mt-2 size-2 rounded-full bg-reef-coral" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
      <p className="mt-8 rounded-lg bg-deep-ocean-navy p-6 text-base font-extrabold leading-8 text-pearl-white">
        {suitabilityContent.ctaLine}
      </p>
    </Section>
  );
}
