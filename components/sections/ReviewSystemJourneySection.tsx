import { Reveal } from "@/components/motion";
import { ReviewSystemJourney } from "@/components/visuals";
import { reviewSystemContent } from "@/content/reviewSystem";
import { cn } from "@/lib/utils";

const content = reviewSystemContent.journey;

export function ReviewSystemJourneySection() {
  return (
    <section
      id={content.id}
      data-section="review-system-journey"
      className="relative isolate overflow-visible bg-pearl-white px-5 py-20 text-deep-ocean-navy sm:px-8 sm:py-28 lg:px-10 lg:py-36"
    >
      <div className="mx-auto w-full max-w-[88rem]">
        <div className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-normal text-[#a92f27]">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 max-w-4xl text-[2.38rem] font-extrabold leading-[1.04] text-deep-ocean-navy sm:text-[2.75rem] lg:text-[3.65rem] xl:text-[4rem]">
            {content.h2}
          </h2>
          <p className="mt-6 max-w-3xl text-base font-semibold leading-8 text-abyss-blue/82 sm:text-lg sm:leading-8">
            {content.intro}
          </p>
        </div>

        <div className="mt-10 lg:mt-14">
          <ReviewSystemJourney content={content} />
        </div>

        <Reveal>
          <p
            className={cn(
              "mt-8 rounded-lg border border-deep-ocean-navy/10 bg-warm-sand px-5 py-4 text-xl font-extrabold leading-8 text-deep-ocean-navy",
              "sm:text-2xl sm:leading-9 lg:mt-10 lg:max-w-4xl",
            )}
          >
            {content.bottomStatement}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
