import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type SectionBackground = "sand" | "pearl" | "ocean" | "clearWater";
type SectionSpacing = "compact" | "default" | "loose";
type SectionMaxWidth = "sm" | "md" | "lg" | "xl" | "wide" | "full";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  background?: SectionBackground;
  spacing?: SectionSpacing;
  maxWidth?: SectionMaxWidth;
  innerClassName?: string;
};

const backgroundClasses: Record<SectionBackground, string> = {
  sand: "bg-warm-sand text-deep-ocean-navy",
  pearl: "bg-pearl-white text-deep-ocean-navy",
  ocean: "ocean-gradient text-pearl-white",
  clearWater: "ocean-gradient-soft text-deep-ocean-navy",
};

const spacingClasses: Record<SectionSpacing, string> = {
  compact: "py-12 sm:py-14 lg:py-16",
  default: "py-16 sm:py-20 lg:py-28",
  loose: "py-20 sm:py-28 lg:py-36",
};

const maxWidthClasses: Record<SectionMaxWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  wide: "max-w-[88rem]",
  full: "max-w-none",
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      background = "sand",
      spacing = "default",
      maxWidth = "xl",
      className,
      innerClassName,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate overflow-hidden",
          backgroundClasses[background],
          spacingClasses[spacing],
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "mx-auto w-full px-5 sm:px-8 lg:px-10",
            maxWidthClasses[maxWidth],
            innerClassName,
          )}
        >
          {children}
        </div>
      </section>
    );
  },
);

Section.displayName = "Section";
