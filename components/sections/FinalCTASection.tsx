import { Reveal } from "@/components/motion";
import { JoinWaveForm } from "@/components/forms/JoinWaveForm";
import { GlassCard, Section } from "@/components/ui";
import { finalCtaContent } from "@/content/sections";

export function FinalCTASection() {
  return (
    <Section
      id="join"
      background="ocean"
      spacing="loose"
      className="underwater-rays"
    >
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Reveal>
          <p className="text-sm font-extrabold uppercase text-seafoam">
            Join the next wave
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight text-pearl-white sm:text-5xl lg:text-6xl">
            {finalCtaContent.h2}
          </h2>
          <p className="mt-5 text-base font-semibold leading-8 text-clear-water-blue/[0.84]">
            {finalCtaContent.body}
          </p>
          <p className="mt-5 text-sm font-bold leading-7 text-pearl-white/[0.74]">
            {finalCtaContent.secondaryText}
          </p>
        </Reveal>

        <GlassCard variant="dark" className="p-6 sm:p-8">
          <JoinWaveForm />
        </GlassCard>
      </div>
    </Section>
  );
}
