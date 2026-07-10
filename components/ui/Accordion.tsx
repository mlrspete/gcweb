"use client";

import * as RadixAccordion from "@radix-ui/react-accordion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: string;
  title: string;
  content: ReactNode;
  number?: string;
  domId?: string;
};

export type AccordionProps = {
  items: AccordionItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function Accordion({
  items,
  defaultValue,
  value,
  onValueChange,
  className,
}: AccordionProps) {
  return (
    <RadixAccordion.Root
      type="single"
      collapsible
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      className={cn("border-t border-deep-ocean-navy/[0.14]", className)}
    >
      {items.map((item, index) => (
        <RadixAccordion.Item
          key={item.id}
          id={item.domId}
          value={item.id}
          data-faq-id={item.id}
          className="border-b border-deep-ocean-navy/[0.14]"
        >
          <RadixAccordion.Header>
            <RadixAccordion.Trigger className="group flex w-full items-center gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reef-coral sm:gap-6 sm:py-6">
              <span className="w-9 shrink-0 text-sm font-extrabold text-reef-coral">
                {item.number ?? String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 text-base font-extrabold text-deep-ocean-navy sm:text-lg">
                {item.title}
              </span>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-deep-ocean-navy/[0.14] bg-pearl-white text-deep-ocean-navy transition duration-300 group-hover:border-reef-coral/50 group-hover:text-reef-coral group-data-[state=open]:rotate-45 motion-reduce:transition-none">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="size-4"
                  fill="none"
                >
                  <path
                    d="M4 12L12 4M6 4h6v6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </RadixAccordion.Trigger>
          </RadixAccordion.Header>
          <RadixAccordion.Content className="accordion-content overflow-hidden text-sm leading-7 text-abyss-blue">
            <div className="pb-5 pl-[3.25rem] pr-14 sm:pb-6 sm:pl-[3.75rem] sm:pr-16">
              {item.content}
            </div>
          </RadixAccordion.Content>
        </RadixAccordion.Item>
      ))}
    </RadixAccordion.Root>
  );
}
