"use client";

import { Reveal } from "@/components/motion";
import { GlassCard, Section } from "@/components/ui";
import { FishIcon } from "@/components/visuals";
import { howItWorksContent } from "@/content/sections";
import { useGSAPContext } from "@/hooks/useGSAPContext";

import { SectionHeader } from "./SectionHeader";

export function HowItWorksSection() {
  const sectionRef = useGSAPContext<HTMLElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!ScrollTrigger || !window.matchMedia("(min-width: 900px)").matches) {
        return;
      }

      const desktopPanel =
        scope.querySelector<HTMLElement>("[data-how-desktop]");
      const fish = scope.querySelector<HTMLElement>("[data-step-fish]");
      const nodes = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-pipeline-node]"),
      );

      if (!desktopPanel || !fish || nodes.length < 2) {
        return;
      }

      const first = nodes[0].offsetTop;
      const last = nodes[nodes.length - 1].offsetTop;

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: `+=${howItWorksContent.steps.length * 290}`,
          scrub: 0.8,
          pin: desktopPanel,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.fromTo(
        fish,
        { y: first },
        { y: last, ease: "none", duration: 1 },
        0,
      );

      return () => {
        timeline.kill();
      };
    },
    { scrollTrigger: true },
  );

  return (
    <Section
      id="how-it-works"
      ref={sectionRef}
      background="pearl"
      spacing="loose"
      className="overflow-visible"
    >
      <Reveal>
        <SectionHeader
          eyebrow={howItWorksContent.eyebrow}
          title={howItWorksContent.h2}
          body={howItWorksContent.intro}
          className="mb-12"
        />
      </Reveal>

      <div
        data-how-desktop
        className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
      >
        <div className="relative hidden min-h-[42rem] rounded-lg bg-deep-ocean-navy p-8 text-pearl-white shadow-ocean-soft lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_40%_12%,rgb(223_247_255_/_0.18),transparent_28%)]"
          />
          <div className="relative mx-auto h-full max-w-xs">
            <div className="absolute left-1/2 top-8 h-[36rem] w-px -translate-x-1/2 bg-gradient-to-b from-seafoam via-clear-water-blue to-reef-coral opacity-60" />
            <div data-step-fish className="absolute left-1/2 top-2 -ml-6">
              <FishIcon variant="standout" size={48} />
            </div>
            <div className="relative grid gap-8 pt-8">
              {howItWorksContent.steps.map((step) => (
                <div
                  key={step.number}
                  data-pipeline-node
                  className="relative flex items-center gap-4"
                >
                  <span className="flex size-12 items-center justify-center rounded-full border border-seafoam/40 bg-pearl-white/[0.08] text-sm font-extrabold text-seafoam backdrop-blur">
                    {step.number}
                  </span>
                  <span className="text-sm font-bold text-clear-water-blue/[0.82]">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {howItWorksContent.steps.map((step, index) => (
            <Reveal
              key={step.number}
              variant="glass-card-rise"
              delay={index * 0.04}
            >
              <GlassCard className="grid gap-4 sm:grid-cols-[4rem_1fr]">
                <div className="text-sm font-extrabold text-reef-coral">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold">{step.title}</h3>
                  <p className="mt-3 text-sm font-semibold leading-7 text-abyss-blue/80">
                    {step.body}
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
