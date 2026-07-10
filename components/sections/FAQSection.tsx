"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { Reveal } from "@/components/motion";
import { Accordion } from "@/components/ui";
import { reviewSystemContent } from "@/content/reviewSystem";
import type { ReviewSystemFaqItem } from "@/types/content";

const content = reviewSystemContent.faq;
const complianceFaqId = "faq-compliance";
const googlePolicyUrl =
  "https://support.google.com/contributionpolicy/answer/7400114?hl=en";
const googlePolicyPhrase =
  "Google permits businesses to ask for reviews that represent genuine experiences";

function renderFaqAnswer(item: ReviewSystemFaqItem): ReactNode {
  if (item.id !== complianceFaqId) {
    return item.answer;
  }

  const phraseIndex = item.answer.indexOf(googlePolicyPhrase);

  if (phraseIndex === -1) {
    return item.answer;
  }

  const before = item.answer.slice(0, phraseIndex);
  const after = item.answer.slice(phraseIndex + googlePolicyPhrase.length);

  return (
    <>
      {before}
      <a
        href={googlePolicyUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`${googlePolicyPhrase} (opens in a new tab)`}
        className="font-extrabold text-deep-ocean-navy underline decoration-deep-ocean-navy/20 underline-offset-4 transition hover:text-reef-coral focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral"
      >
        {googlePolicyPhrase}
      </a>
      {after}
    </>
  );
}

function getHeaderOffset() {
  const header = document.querySelector("header");
  const height = header?.getBoundingClientRect().height ?? 72;

  return height + 18;
}

export function FAQSection() {
  const [openItem, setOpenItem] = useState<string>("");
  const midpoint = Math.ceil(content.items.length / 2);
  const columns = [
    content.items.slice(0, midpoint),
    content.items.slice(midpoint),
  ];

  const scrollComplianceIntoView = useCallback(() => {
    const item = document.getElementById(complianceFaqId);

    if (!item) {
      return;
    }

    const targetTop =
      item.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, []);

  const openAndScrollCompliance = useCallback(() => {
    setOpenItem(complianceFaqId);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollComplianceIntoView);
    });
  }, [scrollComplianceIntoView]);

  const openComplianceFromHash = useCallback(() => {
    if (window.location.hash !== `#${complianceFaqId}`) {
      return;
    }

    openAndScrollCompliance();
  }, [openAndScrollCompliance]);

  useEffect(() => {
    const initialHashTimers = [0, 350, 1100, 2200].map((delay) =>
      window.setTimeout(openComplianceFromHash, delay),
    );
    window.addEventListener("hashchange", openComplianceFromHash);

    return () => {
      initialHashTimers.forEach(window.clearTimeout);
      window.removeEventListener("hashchange", openComplianceFromHash);
    };
  }, [openComplianceFromHash]);

  useEffect(() => {
    const handleComplianceLinkClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest<HTMLAnchorElement>(
        `a[href="#${complianceFaqId}"]`,
      );

      if (!link) {
        return;
      }

      window.setTimeout(openAndScrollCompliance, 0);
    };

    document.addEventListener("click", handleComplianceLinkClick);

    return () => {
      document.removeEventListener("click", handleComplianceLinkClick);
    };
  }, [openAndScrollCompliance]);

  return (
    <section
      id="faq"
      data-section="review-system-faq"
      className="bg-pearl-white px-5 py-[4.5rem] text-deep-ocean-navy sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[88rem]">
        <Reveal>
          <h2 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {content.title}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {columns.map((items, columnIndex) => (
            <Reveal key={columnIndex} delay={columnIndex * 0.08}>
              <Accordion
                value={openItem}
                onValueChange={setOpenItem}
                items={items.map((item, index) => ({
                  id: item.id,
                  domId:
                    item.id === complianceFaqId ? complianceFaqId : item.id,
                  title: item.question,
                  content: renderFaqAnswer(item),
                  number: String(columnIndex * midpoint + index + 1).padStart(
                    2,
                    "0",
                  ),
                }))}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
