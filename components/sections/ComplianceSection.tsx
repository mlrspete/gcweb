import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { complianceContent } from "@/content/compliance";

import { SectionHeader } from "./SectionHeader";

function CheckIcon({ tone }: { tone: "no" | "yes" }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 flex size-6 shrink-0 items-center justify-center rounded-full ${
        tone === "yes"
          ? "bg-seafoam text-deep-ocean-navy"
          : "bg-soft-coral-pink text-deep-ocean-navy"
      }`}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
        {tone === "yes" ? (
          <path
            d="M3 8.2 6.4 11.5 13 4.8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
      </svg>
    </span>
  );
}

export function ComplianceSection() {
  return (
    <Section id="compliance" background="pearl" spacing="loose">
      <Reveal>
        <SectionHeader
          eyebrow={complianceContent.eyebrow}
          title={complianceContent.h2}
          body={complianceContent.body}
          align="center"
        />
      </Reveal>
      <p className="mx-auto mt-6 max-w-4xl rounded-lg border border-deep-ocean-navy/10 bg-warm-sand p-5 text-sm font-semibold leading-7 text-abyss-blue/[0.82]">
        {complianceContent.policyNote}
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <GlassCard className="h-full">
          <h3 className="text-2xl font-extrabold">What we never do</h3>
          <ul className="mt-6 grid gap-4">
            {complianceContent.neverDo.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm font-semibold leading-7"
              >
                <CheckIcon tone="no" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="h-full">
          <h3 className="text-2xl font-extrabold">What we do instead</h3>
          <ul className="mt-6 grid gap-4">
            {complianceContent.doInstead.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm font-semibold leading-7"
              >
                <CheckIcon tone="yes" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
      <p className="mt-6 rounded-lg border border-reef-coral/25 bg-soft-coral-pink/40 p-5 text-sm font-extrabold leading-7 text-deep-ocean-navy">
        {complianceContent.importantNote}
      </p>
    </Section>
  );
}
