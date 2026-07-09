import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { FishIcon } from "@/components/visuals";
import { philosophyContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

export function PhilosophySection() {
  return (
    <Section
      id="philosophy"
      background="ocean"
      spacing="loose"
      className="underwater-rays"
    >
      <div aria-hidden="true" className="absolute right-8 top-20 opacity-10">
        <FishIcon variant="default" size={180} />
      </div>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <SectionHeader
            eyebrow={philosophyContent.eyebrow}
            title={philosophyContent.h2}
            inverse
          />
          <blockquote className="mt-8 border-l-4 border-reef-coral pl-5 text-2xl font-extrabold leading-tight text-pearl-white sm:text-3xl">
            {philosophyContent.pullQuote}
          </blockquote>
        </Reveal>

        <div>
          <div className="grid gap-5 text-base font-semibold leading-8 text-clear-water-blue/[0.82]">
            {philosophyContent.body.map((body) => (
              <p key={body}>{body}</p>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold leading-7 text-pearl-white/[0.76]">
            {philosophyContent.supportingCopy}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {philosophyContent.cards.map((card, index) => (
              <Reveal key={card} variant="glass-card-rise" delay={index * 0.06}>
                <GlassCard variant="dark">
                  <p className="text-lg font-extrabold">{card}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
