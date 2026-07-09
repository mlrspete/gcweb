import { Reveal } from "@/components/motion";
import { Badge, GlassCard, Section } from "@/components/ui";
import { packagesContent } from "@/content/packages";

import { SectionHeader } from "./SectionHeader";

function getPackageSlug(packageName: string) {
  return packageName === "Foundation Wave"
    ? "foundation-wave"
    : "momentum-wave";
}

export function PackagesSection() {
  return (
    <Section id="pricing" background="clearWater" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={packagesContent.eyebrow}
          title={packagesContent.h2}
          body={packagesContent.body}
          align="center"
        />
      </Reveal>
      <p className="mx-auto mt-5 max-w-4xl text-center text-base font-semibold leading-8 text-abyss-blue/80">
        {packagesContent.secondBody}
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        {packagesContent.timeline.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <Badge variant={index === 0 ? "coral" : "seafoam"}>{item}</Badge>
            {index < packagesContent.timeline.length - 1 ? (
              <span aria-hidden="true" className="text-reef-coral">
                <svg viewBox="0 0 24 24" className="size-4" fill="none">
                  <path
                    d="M5 12h14M14 7l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {packagesContent.packages.map((item, index) => (
          <Reveal
            key={item.name}
            variant="glass-card-rise"
            delay={index * 0.08}
          >
            <GlassCard className="flex h-full flex-col p-6 sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-3xl font-extrabold">{item.name}</h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-abyss-blue/[0.72]">
                    {item.bestFor}
                  </p>
                </div>
                <p className="text-4xl font-extrabold text-reef-coral">
                  {item.price}
                </p>
              </div>
              <p className="mt-6 rounded-lg bg-warm-sand p-4 text-sm font-semibold leading-7 text-abyss-blue/[0.82]">
                {item.campaignTarget}
              </p>
              <ul className="mt-6 grid gap-3 text-sm font-bold text-deep-ocean-navy">
                {item.includes.map((include) => (
                  <li key={include} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-reef-coral text-deep-ocean-navy"
                    >
                      <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
                        <path
                          d="M2.2 6.4 4.8 9l5-6"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span>{include}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#join"
                data-cta="join-next-wave"
                data-package={getPackageSlug(item.name)}
                data-package-name={item.name}
                className="motion-cta mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-deep-ocean-navy px-6 text-sm font-extrabold text-pearl-white"
              >
                {item.cta}
              </a>
            </GlassCard>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/70 p-5 text-sm font-semibold leading-7 text-abyss-blue/80">
        {packagesContent.pricingDisclaimer}
      </p>
      <p className="mt-4 text-center text-sm font-bold text-abyss-blue/[0.68]">
        {packagesContent.microcopy}
      </p>
    </Section>
  );
}
