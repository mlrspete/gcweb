"use client";

import type { ReviewCollectionGapContent } from "@/types/content";
import { useGSAPContext } from "@/hooks/useGSAPContext";
import { cn } from "@/lib/utils";

type ReviewFlowDiagramProps = {
  flow: ReviewCollectionGapContent["flow"];
  className?: string;
};

function NodeMarker({ variant }: { variant: "without" | "with" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold",
        variant === "with"
          ? "border border-seafoam/80 bg-seafoam/30 text-deep-ocean-navy"
          : "border border-deep-ocean-navy/20 bg-warm-sand text-reef-coral",
      )}
    >
      {variant === "with" ? "✓" : "!"}
    </span>
  );
}

function Rail({
  label,
  nodes,
  variant,
}: {
  label: string;
  nodes: ReviewCollectionGapContent["flow"]["withoutSystem"]["nodes"];
  variant: "without" | "with";
}) {
  return (
    <div
      className={cn(
        "review-flow-rail relative z-10 rounded-lg border p-4 sm:p-5",
        variant === "with"
          ? "border-seafoam/55 bg-seafoam/[0.16]"
          : "border-deep-ocean-navy/10 bg-pearl-white/70",
      )}
    >
      <p
        className={cn(
          "text-sm font-extrabold uppercase tracking-normal",
          variant === "with" ? "text-abyss-blue" : "text-deep-ocean-navy/70",
        )}
      >
        {label}
      </p>
      <ol className="mt-5 grid gap-4">
        {nodes.map((node, index) => (
          <li
            key={`${variant}-${node.id}-${index}`}
            data-review-flow-node
            className="review-flow-node relative flex gap-3 text-sm font-extrabold leading-6 text-deep-ocean-navy sm:text-[0.95rem]"
          >
            <NodeMarker variant={variant} />
            <span>{node.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ReviewFlowDiagram({ flow, className }: ReviewFlowDiagramProps) {
  const panelRef = useGSAPContext<HTMLDivElement>(
    ({ gsap, scope, ScrollTrigger }) => {
      if (!ScrollTrigger || !window.matchMedia("(min-width: 768px)").matches) {
        return;
      }

      const paths = Array.from(
        scope.querySelectorAll<SVGPathElement>("[data-review-flow-path]"),
      );
      const withPath = scope.querySelector<SVGPathElement>(
        '[data-review-flow-path="with"]',
      );
      const nodes = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-review-flow-node]"),
      );
      const leaks = Array.from(
        scope.querySelectorAll<SVGElement>("[data-review-flow-leak]"),
      );

      gsap.set(paths, {
        strokeDasharray: 1,
        strokeDashoffset: 1,
      });
      gsap.set(nodes, {
        autoAlpha: 0,
        y: 10,
      });
      gsap.set(leaks, {
        autoAlpha: 0,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          once: true,
        },
      });

      timeline
        .to(paths, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power3.out",
        })
        .to(
          nodes,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.16,
        )
        .to(
          leaks,
          {
            autoAlpha: 0.25,
            x: (index) => (index === 0 ? -16 : -12),
            y: (index) => (index === 0 ? 14 : -18),
            duration: 0.85,
            ease: "power2.out",
            stagger: 0.12,
          },
          0.42,
        );

      if (withPath) {
        timeline.to(
          withPath,
          {
            filter: "drop-shadow(0 0 12px rgb(191 239 227 / 0.58))",
            duration: 0.5,
            ease: "sine.out",
          },
          0.82,
        );
      }

      return () => {
        timeline.kill();
      };
    },
    { scrollTrigger: true },
  );

  return (
    <figure
      ref={panelRef}
      data-review-flow-panel
      className={cn(
        "glass-border relative overflow-hidden rounded-lg border border-pearl-white/80 bg-[linear-gradient(145deg,rgb(255_252_246_/_0.94),rgb(223_247_255_/_0.72))] p-4 shadow-ocean-soft sm:p-6 lg:min-h-[820px] lg:p-7",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgb(255_107_95_/_0.12),transparent_24%),radial-gradient(circle_at_82%_28%,rgb(191_239_227_/_0.38),transparent_32%)]"
      />

      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden size-full md:block"
        viewBox="0 0 760 780"
        preserveAspectRatio="none"
      >
        <path
          data-review-flow-path="without"
          pathLength="1"
          d="M184 132 C152 210 226 260 184 342 C142 424 216 482 184 648"
          fill="none"
          stroke="#092A3A"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="0.14 0.08"
          opacity="0.42"
        />
        <path
          data-review-flow-path="with"
          pathLength="1"
          d="M578 132 C632 220 522 296 578 384 C634 476 522 554 578 648"
          fill="none"
          stroke="#BFEFE3"
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.92"
        />
        <g data-review-flow-leak opacity="0.25">
          <path
            d="M226 374 C270 384 292 404 316 438"
            fill="none"
            stroke="#FF6B5F"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 10"
          />
          <circle cx="320" cy="444" r="8" fill="#FF6B5F" />
        </g>
        <g data-review-flow-leak opacity="0.25">
          <path
            d="M212 484 C252 474 278 448 300 410"
            fill="none"
            stroke="#FF6B5F"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="7 9"
          />
          <circle cx="304" cy="404" r="6" fill="#FF6B5F" />
        </g>
      </svg>

      <div className="relative z-10 grid gap-5 md:grid-cols-2 lg:min-h-[700px] lg:items-stretch">
        <Rail
          label={flow.withoutSystem.label}
          nodes={flow.withoutSystem.nodes}
          variant="without"
        />
        <Rail
          label={flow.withTailoredSystem.label}
          nodes={flow.withTailoredSystem.nodes}
          variant="with"
        />
      </div>

      <figcaption className="relative z-10 mt-5 rounded-lg border border-deep-ocean-navy/10 bg-pearl-white/76 p-4 text-sm font-extrabold leading-6 text-abyss-blue sm:text-base sm:leading-7">
        {flow.caption}
      </figcaption>
    </figure>
  );
}
