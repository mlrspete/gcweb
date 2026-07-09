import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { visibilityGapContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

const visualPaths = [
  "M16 32c14-20 35-20 52 0-17 20-38 20-52 0Z",
  "M20 16h40v48H20zM28 26h24M28 36h18M28 46h22",
  "M14 22h34v22H14zM52 28l14 12-14 12",
] as const;

export function VisibilityGapSection() {
  return (
    <Section id="visibility-gap" background="sand" spacing="loose">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <Reveal>
          <SectionHeader
            eyebrow={visibilityGapContent.eyebrow}
            title={visibilityGapContent.h2}
            body={visibilityGapContent.body}
          />
          <p className="mt-6 rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/70 p-4 text-sm font-semibold leading-7 text-abyss-blue shadow-sm">
            {visibilityGapContent.sourceNote}
          </p>
        </Reveal>

        <div className="grid gap-4">
          {visibilityGapContent.cards.map((card, index) => (
            <Reveal
              key={card.title}
              variant="glass-card-rise"
              delay={index * 0.08}
            >
              <GlassCard className="grid gap-5 sm:grid-cols-[4.5rem_1fr] sm:items-center">
                <div
                  aria-hidden="true"
                  className="flex size-16 items-center justify-center rounded-full bg-clear-water-blue text-deep-ocean-navy"
                >
                  <svg viewBox="0 0 80 80" className="size-12" fill="none">
                    <path
                      d={visualPaths[index]}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.74"
                    />
                    <circle cx="57" cy="31" r="3" fill="#FF6B5F" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">{card.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-abyss-blue/80">
                    {card.body}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
