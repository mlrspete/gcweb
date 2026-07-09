import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { guaranteesContent } from "@/content/sections";

import { SectionHeader } from "./SectionHeader";

const icons = [
  "M12 32c10-12 28-12 38 0M20 42h36M22 22h28",
  "M40 12 18 20v16c0 14 10 24 22 28 12-4 22-14 22-28V20L40 12Z",
  "M40 14v52M22 50c10-12 26-12 36 0M28 30h24",
] as const;

export function GuaranteesSection() {
  return (
    <Section id="guarantees" background="sand" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={guaranteesContent.eyebrow}
          title={guaranteesContent.h2}
          align="center"
        />
      </Reveal>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {guaranteesContent.cards.map((card, index) => (
          <Reveal
            key={card.title}
            variant="glass-card-rise"
            delay={index * 0.06}
          >
            <GlassCard className="h-full">
              <div
                aria-hidden="true"
                className="mb-6 flex size-16 items-center justify-center rounded-full bg-clear-water-blue text-deep-ocean-navy"
              >
                <svg viewBox="0 0 80 80" className="size-12" fill="none">
                  <path
                    d={icons[index]}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold">{card.title}</h3>
              <p className="mt-4 text-sm font-semibold leading-7 text-abyss-blue/80">
                {card.body}
              </p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center text-sm font-bold leading-7 text-abyss-blue/70">
        {guaranteesContent.smallNote}
      </p>
    </Section>
  );
}
