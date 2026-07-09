import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { discreetClientWorkContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

export function DiscreetClientWorkSection() {
  return (
    <Section id="discreet-client-work" background="ocean" spacing="loose">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <Reveal>
          <SectionHeader
            eyebrow={discreetClientWorkContent.eyebrow}
            title={discreetClientWorkContent.h2}
            inverse
          />
          <div className="mt-6 grid gap-4 text-base font-semibold leading-8 text-clear-water-blue/[0.82]">
            {discreetClientWorkContent.body.map((body) => (
              <p key={body}>{body}</p>
            ))}
          </div>
          <p className="mt-5 text-sm font-bold text-seafoam/80">
            {discreetClientWorkContent.microcopy}
          </p>
        </Reveal>

        <GlassCard variant="dark" className="p-6 sm:p-8">
          <div aria-hidden="true" className="grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="h-20 rounded-lg border border-pearl-white/[0.1] bg-pearl-white/[0.08] blur-[0.5px]"
              />
            ))}
          </div>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-reef-coral text-deep-ocean-navy">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
              >
                <path
                  d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="text-xl font-extrabold">
              {discreetClientWorkContent.embeddedReviewsHeading}
            </h3>
          </div>
          {/* Placeholder review cards; replace only with approved client quotes. */}
          <div className="mt-5 grid gap-3">
            {[
              "Clear process. Private campaign handling.",
              "Useful reporting without public exposure.",
              "Permission-led proof, never sensitive details.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-pearl-white/[0.1] bg-pearl-white/[0.06] p-4 text-sm font-semibold leading-6 text-pearl-white/80"
              >
                {item}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Section>
  );
}
