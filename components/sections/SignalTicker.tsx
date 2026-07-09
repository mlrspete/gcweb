import { Ticker } from "@/components/motion";
import { signalTickerContent } from "@/content/sections";

export function SignalTicker() {
  return (
    <section
      id="signal-ticker"
      aria-label="Campaign signals"
      className="border-y border-deep-ocean-navy/[0.08] bg-pearl-white py-4 text-deep-ocean-navy"
    >
      <Ticker
        items={signalTickerContent}
        showFishIcon
        duration={34}
        className="text-abyss-blue"
      />
    </section>
  );
}
