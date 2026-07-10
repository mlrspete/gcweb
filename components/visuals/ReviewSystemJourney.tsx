"use client";

import { FishIcon } from "@/components/visuals/FishIcon";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import type {
  ReviewSystemJourneyContent,
  ReviewSystemPhase,
} from "@/types/content";
import { cn } from "@/lib/utils";

type ReviewSystemJourneyProps = {
  content: ReviewSystemJourneyContent;
  className?: string;
};

const phaseDataAttrs: Record<ReviewSystemPhase["id"], string> = {
  diagnose: "diagnose",
  map: "map",
  build: "build",
  "validate-handover": "validate",
};

function getStepIndex(stepNumber: string) {
  return Number.parseInt(stepNumber, 10);
}

export function ReviewSystemJourney({
  content,
  className,
}: ReviewSystemJourneyProps) {
  const panelRef = useGSAPContext<HTMLDivElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!ScrollTrigger) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const customerCards = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-customer-step]"),
        );
        const phases = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-work-phase]"),
        );
        const fish = scope.querySelector<HTMLElement>("[data-journey-fish]");
        const glow = scope.querySelector<HTMLElement>("[data-journey-glow]");
        const nodes = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-journey-node]"),
        );
        const currents = Array.from(
          scope.querySelectorAll<HTMLElement>("[data-journey-current]"),
        );

        if (
          customerCards.length !== 4 ||
          phases.length !== 4 ||
          nodes.length !== 4 ||
          currents.length !== 4 ||
          !fish
        ) {
          return;
        }

        const getNodePosition = (index: number) => {
          const nodeRect = nodes[index].getBoundingClientRect();
          const scopeRect = scope.getBoundingClientRect();

          return {
            x: nodeRect.left - scopeRect.left + nodeRect.width / 2 - 25,
            y: nodeRect.top - scopeRect.top + nodeRect.height / 2 - 25,
          };
        };

        const modulesByPhase = phases.map((phase) =>
          Array.from(phase.querySelectorAll<HTMLElement>("[data-work-module]")),
        );

        gsap.set(customerCards, {
          opacity: 0.52,
          scale: 0.985,
          borderColor: "rgb(255 252 246 / 0.14)",
          boxShadow: "0 0 0 rgb(255 107 95 / 0)",
          transformOrigin: "center center",
        });
        gsap.set(modulesByPhase.flat(), {
          opacity: 0.24,
          y: 14,
        });
        gsap.set(currents, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(fish, {
          opacity: 1,
          x: () => getNodePosition(0).x,
          y: () => getNodePosition(0).y,
        });

        if (glow) {
          gsap.set(glow, {
            opacity: 0.28,
            x: () => getNodePosition(0).x - 90,
            y: () => getNodePosition(0).y - 100,
          });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top+=88",
            end: "+=2600",
            scrub: 0.8,
            pin: scope,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        customerCards.forEach((_, index) => {
          const position = index;
          const label = `phase-${index + 1}`;

          timeline.addLabel(label, position);

          customerCards.forEach((card, cardIndex) => {
            timeline.to(
              card,
              {
                opacity:
                  cardIndex < index ? 0.72 : cardIndex === index ? 1 : 0.52,
                scale: cardIndex === index ? 1 : 0.985,
                borderColor:
                  cardIndex === index
                    ? "rgb(255 107 95 / 0.38)"
                    : "rgb(255 252 246 / 0.14)",
                boxShadow:
                  cardIndex === index
                    ? "0 22px 70px rgb(255 107 95 / 0.18)"
                    : "0 0 0 rgb(255 107 95 / 0)",
                duration: 0.28,
                ease: "power3.out",
              },
              position,
            );
          });

          modulesByPhase.forEach((modules, modulePhaseIndex) => {
            if (modulePhaseIndex < index) {
              timeline.to(
                modules,
                {
                  opacity: 0.72,
                  y: 0,
                  duration: 0.2,
                  stagger: 0.02,
                  ease: "power3.out",
                },
                position,
              );
              return;
            }

            if (modulePhaseIndex === index) {
              timeline.to(
                modules,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.38,
                  stagger: 0.06,
                  ease: "power3.out",
                },
                position + 0.03,
              );
              return;
            }

            timeline.to(
              modules,
              {
                opacity: 0.24,
                y: 14,
                duration: 0.16,
              },
              position,
            );
          });

          timeline.to(
            fish,
            {
              x: () => getNodePosition(index).x,
              y: () => getNodePosition(index).y,
              duration: 0.44,
              ease: "power2.out",
            },
            position,
          );

          if (glow) {
            timeline.to(
              glow,
              {
                x: () => getNodePosition(index).x - 90,
                y: () => getNodePosition(index).y - 100,
                opacity: 0.34,
                duration: 0.44,
                ease: "power2.out",
              },
              position,
            );
          }

          timeline.to(
            currents[index],
            {
              scaleX: 1,
              duration: 0.55,
              ease: "power3.out",
            },
            position + 0.08,
          );
        });

        return () => {
          timeline.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scrollTrigger: true },
  );

  return (
    <div
      ref={panelRef}
      data-journey-panel
      className={cn(
        "review-journey-panel glass-border underwater-rays relative overflow-hidden rounded-lg bg-deep-ocean-navy p-4 text-pearl-white shadow-ocean-soft sm:p-6 lg:min-h-[760px] lg:p-8",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgb(223_247_255_/_0.14),transparent_28%),radial-gradient(circle_at_82%_18%,rgb(255_107_95_/_0.12),transparent_24%),linear-gradient(145deg,rgb(6_24_38_/_0.92),rgb(9_42_58_/_0.78))]"
      />
      <div
        data-journey-glow
        aria-hidden="true"
        className="pointer-events-none absolute hidden size-56 rounded-full bg-reef-coral/18 blur-3xl lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-[0.11] lg:block"
      >
        <FishIcon
          variant="default"
          size={96}
          className="absolute left-[8%] top-[14%] rotate-6"
        />
        <FishIcon
          variant="default"
          size={72}
          className="absolute right-[12%] top-[44%] -rotate-12"
        />
        <FishIcon
          variant="default"
          size={84}
          className="absolute bottom-[12%] left-[42%] rotate-3"
        />
      </div>

      <div
        data-journey-fish
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-30 hidden lg:block"
      >
        <FishIcon variant="standout" size={50} />
      </div>

      <div className="relative z-10">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr] lg:gap-5">
          <p className="rounded-full border border-reef-coral/30 bg-reef-coral/[0.12] px-4 py-2 text-sm font-extrabold uppercase tracking-normal text-soft-coral-pink">
            {content.customerLaneLabel}
          </p>
          <p className="rounded-full border border-seafoam/30 bg-seafoam/[0.12] px-4 py-2 text-sm font-extrabold uppercase tracking-normal text-seafoam">
            {content.growthSpecialistsLaneLabel}
          </p>
        </div>

        <ol className="mt-5 grid gap-5 lg:grid-cols-4 lg:gap-4 xl:gap-5">
          {content.phases.map((phase, index) => {
            const step = content.customerSteps[index];
            const stepNumber = getStepIndex(step.number);

            return (
              <li
                key={phase.id}
                data-work-phase={phaseDataAttrs[phase.id]}
                className="review-journey-phase rounded-lg border border-pearl-white/[0.12] bg-pearl-white/[0.05] p-4 backdrop-blur-sm lg:flex lg:min-h-[620px] lg:flex-col"
              >
                <article
                  data-customer-step={String(stepNumber)}
                  className="review-journey-customer-card relative rounded-lg border border-pearl-white/[0.14] bg-pearl-white/[0.09] p-5 text-pearl-white shadow-[0_18px_70px_rgb(6_24_38_/_0.22)] backdrop-blur-md lg:min-h-[15rem]"
                >
                  <span
                    data-journey-node
                    aria-hidden="true"
                    className="absolute right-4 top-4 size-3 rounded-full bg-reef-coral shadow-[0_0_24px_rgb(255_107_95_/_0.58)]"
                  />
                  <p className="text-sm font-extrabold text-reef-coral">
                    {step.number}
                  </p>
                  <h3 className="mt-3 text-xl font-extrabold leading-tight text-pearl-white lg:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm font-semibold leading-7 text-clear-water-blue/[0.86]">
                    {step.body}
                  </p>
                </article>

                <div className="my-5 flex items-center gap-3 lg:my-6">
                  <span className="h-px flex-1 bg-reef-coral/35" />
                  <span className="text-sm font-extrabold uppercase tracking-normal text-soft-coral-pink">
                    {phase.label}
                  </span>
                  <span className="h-px flex-1 bg-seafoam/35" />
                </div>

                <div className="lg:flex lg:flex-1 lg:flex-col">
                  <h4 className="text-lg font-extrabold text-seafoam lg:text-xl">
                    {phase.title}
                  </h4>
                  <div
                    data-journey-current
                    aria-hidden="true"
                    className="mt-3 h-1 origin-left rounded-full bg-gradient-to-r from-seafoam via-clear-water-blue to-reef-coral"
                  />
                  <ul className="mt-4 grid gap-3 lg:flex lg:flex-1 lg:flex-col">
                    {phase.modules.map((module) => (
                      <li
                        key={module.number}
                        data-work-module
                        className="review-journey-work-module rounded-lg border border-seafoam/[0.22] bg-seafoam/[0.12] p-3 text-sm font-bold leading-6 text-clear-water-blue shadow-[0_12px_40px_rgb(6_24_38_/_0.16)]"
                      >
                        <span className="mr-2 font-extrabold text-seafoam">
                          {String(module.number).padStart(2, "0")}
                        </span>
                        {module.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
