import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));

const frozenChecks = [
  {
    label: "header copy",
    file: "content/site.ts",
    strings: [
      "growthspecialists",
      "How it works",
      "Compliance",
      "Pricing",
      "FAQ",
      "Join Now",
      "Join the next wave",
      "No quote call. No long consultation. Just a clean campaign slot.",
    ],
  },
  {
    label: "hero copy",
    file: "content/sections.ts",
    strings: [
      "LOCAL VISIBILITY FOR NEW & GROWING BUSINESSES",
      "We help ambitious brands be seen by the people who matter most.",
      "A done-for-you campaign system that helps suitable small businesses create genuine local experiences, collect honest feedback and build the visibility layer that makes customers more confident when they search.",
      "No fake reviews. No paid ratings. No pressure tactics. Just real-world campaigns designed around genuine experience, honest feedback and long-term visibility.",
      "Join the next wave",
      "See how it works",
    ],
  },
  {
    label: "ticker copy",
    file: "content/sections.ts",
    strings: [
      "REAL LOCAL EXPERIENCES",
      "HONEST FEEDBACK",
      "NO REVIEW BUYING",
      "NO INCENTIVES FOR REVIEWS",
      "DISCREET ACTIVATIONS",
      "TAILORED EXPERIENCE PAGES",
      "QUALITY LOCAL AUDIENCES",
      "GOOGLE-SAFE REQUESTS",
      "VISIBILITY MOMENTUM",
      "BUILT FOR SMALL BUSINESS",
    ],
  },
  {
    label: "hero floating labels",
    file: "components/sections/HeroSection.tsx",
    strings: [
      "More visible",
      "More trusted",
      "More recent proof",
      "More local confidence",
    ],
  },
];

const failures = [];

for (const check of frozenChecks) {
  const filePath = join(rootDir, check.file);
  const source = readFileSync(filePath, "utf8");

  for (const expected of check.strings) {
    if (!source.includes(expected)) {
      failures.push(`${check.label}: missing "${expected}" in ${check.file}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Frozen copy check failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Frozen copy check passed.");
