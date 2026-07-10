"use client";

import type { ReactNode } from "react";

import { AnimatedCounter, Reveal } from "@/components/motion";
import { FitCheckDialog } from "@/components/forms/FitCheckDialog";
import { Eyebrow } from "@/components/ui";
import { reviewSystemContent } from "@/content/reviewSystem";
import { useGSAPContext } from "@/hooks/useGSAPContext";

const content = reviewSystemContent.offer;
const offer = content.offers[0];

function getSourceUrl(sourceLabel: string) {
  if (sourceLabel.includes("BrightLocal")) {
    return content.sources.brightLocal.url;
  }

  return content.sources.googleBusinessProfileHelp.url;
}

function ImpactModule({
  impact,
}: {
  impact: (typeof content.impacts)[number];
}) {
  const isCounter = /^\d+%$/.test(impact.value);

  return (
    <article
      data-offer-impact
      className="rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/78 p-5 shadow-sm backdrop-blur-sm"
    >
      <p className="text-4xl font-extrabold leading-none text-reef-coral sm:text-5xl">
        {isCounter ? (
          <AnimatedCounter value={impact.value} duration={1.05} />
        ) : (
          impact.value
        )}
      </p>
      <p className="mt-4 text-sm font-bold leading-6 text-abyss-blue/84">
        {impact.body}
      </p>
      <a
        href={getSourceUrl(impact.sourceLabel)}
        target="_blank"
        rel="noreferrer"
        aria-label={`${impact.sourceLabel} (opens in a new tab)`}
        className="mt-4 inline-flex text-sm font-extrabold uppercase tracking-normal text-deep-ocean-navy/58 underline decoration-deep-ocean-navy/20 underline-offset-4 transition hover:text-reef-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
      >
        {impact.sourceLabel}
      </a>
    </article>
  );
}

function SourceNote() {
  const links = [
    content.sources.brightLocal,
    content.sources.googleBusinessProfileHelp,
  ];
  const nodes: ReactNode[] = [];
  let remaining = content.sourceNote;

  links.forEach((source, index) => {
    const sourceIndex = remaining.indexOf(source.label);

    if (sourceIndex === -1) {
      return;
    }

    if (sourceIndex > 0) {
      nodes.push(remaining.slice(0, sourceIndex));
    }

    nodes.push(
      <a
        key={source.label}
        href={source.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`${source.label} (opens in a new tab)`}
        className="font-extrabold text-deep-ocean-navy underline decoration-deep-ocean-navy/20 underline-offset-4 transition hover:text-reef-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
      >
        {source.label}
      </a>,
    );

    remaining = remaining.slice(sourceIndex + source.label.length);

    if (index === links.length - 1 && remaining.length > 0) {
      nodes.push(remaining);
    }
  });

  if (nodes.length === 0) {
    nodes.push(content.sourceNote);
  } else if (remaining.length > 0 && !nodes.includes(remaining)) {
    nodes.push(remaining);
  }

  return (
    <p className="rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/72 p-4 text-sm font-semibold leading-6 text-abyss-blue/78">
      {nodes}
    </p>
  );
}

function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-seafoam text-deep-ocean-navy"
    >
      <svg viewBox="0 0 12 12" className="size-3" fill="none">
        <path
          d="M2.2 6.4 4.8 9l5-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ReviewSystemOfferSection() {
  const sectionRef = useGSAPContext<HTMLElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!ScrollTrigger) {
        return;
      }

      const impacts = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-offer-impact]"),
      );
      const priceCard = scope.querySelector<HTMLElement>("[data-offer-card]");

      const impactTween = gsap.fromTo(
        impacts,
        {
          autoAlpha: 0,
          y: 18,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: scope,
            start: "top 78%",
            once: true,
          },
        },
      );

      const priceTween = priceCard
        ? gsap.fromTo(
            priceCard,
            {
              autoAlpha: 0,
              y: 28,
              scale: 0.985,
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: priceCard,
                start: "top 82%",
                once: true,
              },
            },
          )
        : null;

      return () => {
        impactTween.kill();
        priceTween?.kill();
      };
    },
    { scrollTrigger: true },
  );

  return (
    <section
      id={content.id}
      ref={sectionRef}
      data-section="review-system-offer"
      className="ocean-gradient-soft relative isolate overflow-hidden px-5 py-20 text-deep-ocean-navy sm:px-8 sm:py-28 lg:px-10 lg:py-36"
    >
      <div className="mx-auto grid w-full max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(22rem,5fr)] lg:items-start xl:gap-14">
        <div>
          <Reveal>
            <div className="max-w-4xl">
              <Eyebrow className="text-sm">{content.eyebrow}</Eyebrow>
              <h2 className="mt-4 max-w-4xl text-[2.38rem] font-extrabold leading-[1.04] text-deep-ocean-navy sm:text-[2.75rem] lg:text-[3.65rem] xl:text-[4rem]">
                {content.h2}
              </h2>
              <div className="mt-6 grid gap-5 text-base font-semibold leading-8 text-abyss-blue/84 sm:text-lg sm:leading-8">
                {content.bodyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:gap-4">
            {content.impacts.map((impact) => (
              <ImpactModule key={impact.value} impact={impact} />
            ))}
          </div>
        </div>

        <div className="group/price relative lg:row-span-2">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2rem] bg-reef-coral/22 blur-3xl opacity-55 transition-opacity duration-300 group-hover/price:opacity-80 group-focus-within/price:opacity-80"
          />
          <article
            data-offer="custom-review-capture-system"
            data-price="299-aud"
            data-offer-card
            className="glass-border relative overflow-hidden rounded-lg border border-pearl-white/[0.14] bg-deep-ocean-navy p-6 text-pearl-white shadow-ocean-soft sm:p-7 lg:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgb(255_107_95_/_0.16),transparent_28%),linear-gradient(145deg,rgb(6_24_38),rgb(9_42_58_/_0.92))]"
            />
            <div className="relative z-10">
              <p className="inline-flex rounded-full border border-reef-coral/35 bg-reef-coral/[0.12] px-4 py-2 text-xs font-extrabold uppercase tracking-normal text-soft-coral-pink">
                {offer.badge}
              </p>
              <h3 className="mt-5 text-3xl font-extrabold leading-tight text-pearl-white sm:text-4xl">
                {offer.productName}
              </h3>
              <p className="mt-5 text-5xl font-extrabold leading-none text-reef-coral sm:text-6xl">
                {offer.price}
              </p>
              <p className="mt-2 text-sm font-extrabold uppercase tracking-normal text-clear-water-blue/[0.72]">
                {offer.priceQualifier}
              </p>
              <p className="mt-5 rounded-lg border border-pearl-white/[0.12] bg-pearl-white/[0.07] p-4 text-sm font-semibold leading-6 text-clear-water-blue/[0.88]">
                {offer.bestFor}
              </p>

              <ul className="mt-6 grid gap-3 text-sm font-bold leading-6 text-pearl-white">
                {offer.deliverables.map((deliverable) => (
                  <li key={deliverable.text} className="flex gap-3">
                    <CheckIcon />
                    <span>{deliverable.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <FitCheckDialog
                  triggerLabel={offer.primaryCta}
                  ctaLocation="pricing-card"
                />
                <p className="mt-3 text-center text-sm font-semibold leading-6 text-clear-water-blue/[0.78]">
                  {offer.ctaMicrocopy}
                </p>
              </div>

              <div className="mt-7 rounded-lg border border-pearl-white/[0.16] bg-pearl-white/[0.09] p-5">
                <h4 className="text-xl font-extrabold text-pearl-white">
                  {offer.guarantee.title}
                </h4>
                <div className="mt-3 grid gap-3 text-sm font-semibold leading-6 text-clear-water-blue/[0.86]">
                  {offer.guarantee.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>

              <p className="mt-5 text-sm font-semibold leading-6 text-clear-water-blue/[0.78]">
                {offer.scopeNote}
              </p>
            </div>
          </article>
        </div>

        <div className="lg:col-start-1">
          <SourceNote />
        </div>
      </div>
    </section>
  );
}
