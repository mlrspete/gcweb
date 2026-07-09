import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { FishIcon, type FishIconVariant } from "@/components/visuals";
import { oneServiceContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

const variants: FishIconVariant[] = [
  "carpenter",
  "cafe",
  "mechanic",
  "clinic",
  "beauty",
  "product/canned",
];

export function OneServiceSection() {
  return (
    <Section id="one-service" background="clearWater" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={oneServiceContent.eyebrow}
          title={oneServiceContent.h2}
          body={oneServiceContent.body}
          align="center"
        />
      </Reveal>
      <p className="mx-auto mt-5 max-w-3xl text-center text-base font-semibold leading-8 text-abyss-blue/80">
        {oneServiceContent.secondBody}
      </p>

      <div className="relative mt-12 grid gap-6 lg:grid-cols-[1fr_22rem_1fr] lg:items-center">
        <div className="grid grid-cols-2 gap-4">
          {variants.slice(0, 3).map((variant) => (
            <GlassCard
              key={variant}
              className="flex items-center justify-center"
            >
              <FishIcon variant={variant} size={60} />
            </GlassCard>
          ))}
        </div>
        <Reveal variant="coral-glow-in">
          <div className="rounded-lg border border-reef-coral/30 bg-pearl-white/[0.78] p-8 text-center shadow-coral-glow backdrop-blur">
            <p className="text-sm font-extrabold uppercase text-reef-coral">
              Growth Specialists system
            </p>
            <p className="mt-4 text-2xl font-extrabold">
              One visibility engine. Many real-world businesses.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4">
          {variants.slice(3).map((variant) => (
            <GlassCard
              key={variant}
              className="flex items-center justify-center"
            >
              <FishIcon variant={variant} size={60} />
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {oneServiceContent.miniBlocks.map((block, index) => (
          <Reveal
            key={block.title}
            variant="glass-card-rise"
            delay={index * 0.06}
          >
            <GlassCard className="h-full">
              <h3 className="text-lg font-extrabold">{block.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-7 text-abyss-blue/80">
                {block.body}
              </p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
