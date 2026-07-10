"use client";

import { AnimatedCounter } from "@/components/motion";
import { Eyebrow, Section } from "@/components/ui";
import { ReviewFlowDiagram } from "@/components/visuals";
import { reviewSystemContent } from "@/content/reviewSystem";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import { cn } from "@/lib/utils";

const content = reviewSystemContent.reviewCollectionGap;

function GapStatistic({
  value,
  body,
  sourceLabel,
}: (typeof content.statistics)[number]) {
  const numericValue = Number.parseInt(value, 10);

  return (
    <article
      data-stat={String(numericValue)}
      className="rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/82 p-4 shadow-sm backdrop-blur-sm"
    >
      <p className="text-4xl font-extrabold leading-none text-reef-coral sm:text-5xl">
        <AnimatedCounter value={value} duration={1.05} />
      </p>
      <p className="mt-3 text-sm font-bold leading-6 text-abyss-blue/84">
        {body}
      </p>
      <p className="mt-4 text-sm font-extrabold uppercase tracking-normal text-deep-ocean-navy/58">
        Source:{" "}
        <a
          href={content.sources.brightLocal.url}
          target="_blank"
          rel="noreferrer"
          className="underline decoration-deep-ocean-navy/20 underline-offset-4 transition hover:text-reef-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
        >
          {sourceLabel}
        </a>
      </p>
    </article>
  );
}

export function ReviewCollectionGapSection() {
  const sectionRef = useGSAPContext<HTMLElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!ScrollTrigger) {
        return;
      }

      const revealItems = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-review-gap-copy]"),
      );

      if (revealItems.length === 0) {
        return;
      }

      const tween = gsap.fromTo(
        revealItems,
        {
          autoAlpha: 0,
          y: 22,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: scope,
            start: "top 82%",
            once: true,
          },
        },
      );

      return () => {
        tween.kill();
      };
    },
    { scrollTrigger: true },
  );

  return (
    <Section
      id={content.id}
      ref={sectionRef}
      data-section="review-collection-gap"
      background="sand"
      spacing="loose"
      maxWidth="wide"
      className="overflow-hidden"
      innerClassName="lg:min-h-[820px]"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center xl:gap-14">
        <div className="flex flex-col">
          <div data-review-gap-copy>
            <Eyebrow className="text-sm">{content.eyebrow}</Eyebrow>
          </div>

          <h2
            data-review-gap-copy
            className="mt-4 max-w-[11ch] text-[2.38rem] font-extrabold leading-[1.04] text-deep-ocean-navy sm:text-[2.75rem] lg:text-[3.65rem] xl:text-[4rem]"
          >
            {content.h2}
          </h2>

          <div
            data-review-gap-copy
            className="mt-6 grid gap-5 text-base font-semibold leading-8 text-abyss-blue/84 sm:text-lg sm:leading-8"
          >
            {content.bodyParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <p
            data-review-gap-copy
            className="mt-6 rounded-lg border border-deep-ocean-navy/10 border-l-4 border-l-reef-coral bg-pearl-white px-5 py-4 text-base font-extrabold leading-7 text-deep-ocean-navy shadow-sm"
          >
            {content.highlightLine}
          </p>
        </div>

        <div className="lg:col-start-2 lg:row-span-2">
          <ReviewFlowDiagram flow={content.flow} />
        </div>

        <div className="flex flex-col">
          <div
            data-review-gap-copy
            className="grid gap-3 sm:grid-cols-3 lg:gap-4"
          >
            {content.statistics.map((statistic) => (
              <GapStatistic key={statistic.value} {...statistic} />
            ))}
          </div>

          <p className="mt-4 rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/70 p-4 text-sm font-semibold leading-6 text-abyss-blue/76">
            Source:{" "}
            <a
              href={content.sources.brightLocal.url}
              target="_blank"
              rel="noreferrer"
              className="font-extrabold text-deep-ocean-navy underline decoration-deep-ocean-navy/20 underline-offset-4 transition hover:text-reef-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
            >
              {content.sources.brightLocal.label}
            </a>
            {content.sourceNote.slice(
              `Source: ${content.sources.brightLocal.label}`.length,
            )}
          </p>

          <p
            className={cn(
              "mt-6 text-xl font-extrabold leading-8 text-deep-ocean-navy",
              "sm:text-2xl sm:leading-9",
            )}
          >
            {content.closingLine}
          </p>
        </div>
      </div>
    </Section>
  );
}
