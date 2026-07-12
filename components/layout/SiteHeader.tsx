"use client";

import { useEffect, useRef, useState } from "react";

import { siteContent } from "@/content/site";
import { trackCTAClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const navLinks = siteContent.nav.links;

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setIsOpen(false);
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        isScrolled
          ? "border-b border-pearl-white/60 bg-pearl-white/[0.82] text-deep-ocean-navy shadow-ocean-soft backdrop-blur-xl"
          : "border-b border-pearl-white/[0.08] bg-transparent text-pearl-white",
      )}
    >
      <div className="mx-auto flex h-[4.5rem] w-full max-w-[88rem] items-center justify-between px-5 sm:px-8 lg:px-10">
        <a
          href="#hero"
          className="rounded-full text-lg font-extrabold tracking-normal focus-visible:outline-reef-coral"
        >
          {siteContent.wordmark}
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cta={
                link.label === "Join Now" ? "join-next-wave" : undefined
              }
              className="text-sm font-bold opacity-[0.86] transition hover:text-reef-coral hover:opacity-100"
              onClick={() => {
                if (link.label === "Join Now") {
                  trackCTAClick(
                    link.label,
                    "desktop-nav",
                    "review-system-offer",
                  );
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <p className="max-w-[12.5rem] text-right text-[0.68rem] font-bold leading-4 opacity-[0.72]">
            {siteContent.nav.microcopy}
          </p>
          <a
            href="#pricing"
            data-cta="join-next-wave"
            className={cn(
              "motion-cta inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-extrabold focus-visible:outline-reef-coral",
              isScrolled
                ? "bg-deep-ocean-navy text-pearl-white"
                : "bg-reef-coral text-deep-ocean-navy",
            )}
            onClick={() =>
              trackCTAClick(
                siteContent.nav.buttonLabel,
                "desktop-header",
                "review-system-offer",
              )
            }
          >
            {siteContent.nav.buttonLabel}
          </a>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex size-11 items-center justify-center rounded-full border border-current/20 transition hover:border-reef-coral/70 focus-visible:outline-reef-coral lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span aria-hidden="true" className="grid gap-1.5">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </div>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="border-t border-deep-ocean-navy/10 bg-pearl-white px-5 py-5 text-deep-ocean-navy shadow-ocean-soft lg:hidden"
        >
          <nav className="grid gap-2" aria-label="Mobile primary">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cta={
                  link.label === "Join Now" ? "join-next-wave" : undefined
                }
                className="rounded-lg px-3 py-3 text-base font-extrabold hover:bg-warm-sand"
                onClick={() => {
                  if (link.label === "Join Now") {
                    trackCTAClick(
                      link.label,
                      "mobile-nav",
                      "review-system-offer",
                    );
                  }

                  setIsOpen(false);
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#pricing"
            data-cta="join-next-wave"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-reef-coral px-5 text-sm font-extrabold text-deep-ocean-navy"
            onClick={() => {
              trackCTAClick(
                siteContent.nav.buttonLabel,
                "mobile-menu",
                "review-system-offer",
              );
              setIsOpen(false);
            }}
          >
            {siteContent.nav.buttonLabel}
          </a>
        </div>
      ) : null}
    </header>
  );
}
