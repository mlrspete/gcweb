import { AnimatedCounter, Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { whyReviewsMatterContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

export function WhyReviewsMatterSection() {
  return (
    <Section id="why-reviews-matter" background="sand" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={whyReviewsMatterContent.eyebrow}
          title={whyReviewsMatterContent.h2}
          align="center"
        />
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {whyReviewsMatterContent.stats.map((stat, index) => (
          <Reveal
            key={stat.value}
            variant="glass-card-rise"
            delay={index * 0.06}
          >
            <GlassCard className="h-full">
              <p className="text-4xl font-extrabold leading-none text-reef-coral">
                {/\d/.test(stat.value) ? (
                  <AnimatedCounter value={stat.value} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-5 text-sm font-semibold leading-7 text-abyss-blue/[0.82]">
                {stat.body}
              </p>
              {stat.source ? (
                <p className="mt-4 text-xs font-extrabold uppercase text-abyss-blue/[0.55]">
                  {stat.source}
                </p>
              ) : null}
            </GlassCard>
          </Reveal>
        ))}
      </div>
      <p className="mx-auto mt-8 max-w-4xl text-center text-base font-extrabold leading-8 text-deep-ocean-navy">
        {whyReviewsMatterContent.bottomLine}
      </p>
    </Section>
  );
}
