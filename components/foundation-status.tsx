import Image from "next/image";

import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

const swatches = [
  ["deep-ocean-navy", "bg-deep-ocean-navy"],
  ["abyss-blue", "bg-abyss-blue"],
  ["reef-coral", "bg-reef-coral"],
  ["soft-coral-pink", "bg-soft-coral-pink"],
  ["seafoam", "bg-seafoam"],
  ["clear-water-blue", "bg-clear-water-blue"],
  ["warm-sand", "bg-warm-sand"],
  ["pearl-white", "bg-pearl-white"],
] as const;

export function FoundationStatus() {
  const foundationStatus = siteContent.foundationStatus;

  return (
    <main className="min-h-screen bg-warm-sand px-5 py-8 text-deep-ocean-navy sm:px-8 lg:px-12">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-between gap-12 rounded-none py-8">
        <div className="flex items-center justify-between gap-4 border-b border-deep-ocean-navy/15 pb-5">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/growth-specialists-mark.svg"
              alt=""
              width={44}
              height={44}
              priority
              className="size-11 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-abyss-blue">
                Foundation ready
              </p>
              <h1 className="text-3xl font-extrabold sm:text-5xl">
                {siteContent.displayName}
              </h1>
            </div>
          </div>
          <div className="hidden rounded-full bg-pearl-white px-4 py-2 text-sm font-bold text-abyss-blue ring-1 ring-deep-ocean-navy/10 sm:block">
            Next.js App Router
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-l-4 border-reef-coral bg-pearl-white p-6 shadow-sm ring-1 ring-deep-ocean-navy/10 sm:p-8">
            <p className="max-w-2xl text-xl font-semibold leading-8 sm:text-2xl">
              {foundationStatus.summary}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {foundationStatus.confirmations.map((item) => (
                <div
                  key={item}
                  className="min-h-24 bg-warm-sand/65 p-4 ring-1 ring-deep-ocean-navy/10"
                >
                  <p className="text-sm font-bold leading-6">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-abyss-blue p-6 text-pearl-white shadow-sm ring-1 ring-deep-ocean-navy/10 sm:p-8">
            <p className="text-sm font-semibold uppercase text-seafoam">
              Design tokens
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {swatches.map(([name, className]) => (
                <div key={name} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-8 shrink-0 rounded-full ring-1 ring-pearl-white/30",
                      className,
                    )}
                  />
                  <span className="text-sm font-semibold">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-deep-ocean-navy/15 pt-5 text-sm font-semibold text-abyss-blue sm:flex-row sm:items-center sm:justify-between">
          <p>{foundationStatus.complianceLine}</p>
          <a
            href="/api/health"
            className="w-fit rounded-full bg-deep-ocean-navy px-4 py-2 text-pearl-white transition hover:bg-abyss-blue focus-visible:outline-reef-coral"
          >
            API health route
          </a>
        </div>
      </section>
    </main>
  );
}
