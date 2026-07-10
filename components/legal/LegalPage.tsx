import type { LegalPageContent } from "@/content/legal";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

type LegalPageProps = {
  content: LegalPageContent;
};

export function LegalPage({ content }: LegalPageProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-40 h-[4.5rem] bg-deep-ocean-navy"
      />
      <SiteHeader />
      <main className="bg-pearl-white px-5 pb-20 pt-28 text-deep-ocean-navy sm:px-8 lg:px-10 lg:pb-28 lg:pt-36">
        <article className="mx-auto max-w-4xl">
          <header className="border-b border-deep-ocean-navy/[0.12] pb-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-reef-coral">
              Growth Specialists
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {content.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base font-semibold leading-8 text-abyss-blue/78 sm:text-lg">
              {content.description}
            </p>
          </header>

          <div className="mt-10 grid gap-8">
            {content.sections.map((section) => (
              <section
                key={section.heading}
                className="border-b border-deep-ocean-navy/[0.1] pb-8 last:border-b-0"
              >
                <h2 className="text-2xl font-extrabold leading-tight">
                  {section.heading}
                </h2>
                {section.paragraphs ? (
                  <div className="mt-4 grid gap-4 text-base leading-8 text-abyss-blue/82">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
                {section.bullets ? (
                  <ul className="mt-4 grid gap-3 text-base leading-7 text-abyss-blue/82">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-2 shrink-0 rounded-full bg-reef-coral"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.links ? (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {section.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-11 items-center justify-center rounded-full bg-deep-ocean-navy px-5 text-sm font-extrabold text-pearl-white transition hover:bg-reef-coral hover:text-deep-ocean-navy focus-visible:outline-reef-coral"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
