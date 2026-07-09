import { Eyebrow } from "@/components/ui";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  inverse?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  body,
  align = "left",
  inverse = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow variant={inverse ? "seafoam" : "coral"}>{eyebrow}</Eyebrow>
      ) : null}
      <h2
        className={cn(
          "mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl",
          inverse ? "text-pearl-white" : "text-deep-ocean-navy",
        )}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={cn(
            "mt-5 text-base font-semibold leading-8 sm:text-lg",
            inverse ? "text-clear-water-blue/[0.85]" : "text-abyss-blue/[0.82]",
          )}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
