import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const failures = [];

function fail(message) {
  failures.push(message);
}

function readProjectFile(filePath) {
  return readFileSync(join(rootDir, filePath), "utf8");
}

function projectPathExists(filePath) {
  return existsSync(join(rootDir, filePath));
}

function listFiles(dir, extensions = [".ts", ".tsx", ".js", ".jsx", ".md"]) {
  const dirPath = join(rootDir, dir);

  if (!existsSync(dirPath)) {
    return [];
  }

  return readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dirPath, entry.name);
    const projectPath = relative(rootDir, fullPath).replaceAll("\\", "/");

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") {
        return [];
      }

      return listFiles(projectPath, extensions);
    }

    if (!entry.isFile()) {
      return [];
    }

    return extensions.some((extension) => entry.name.endsWith(extension))
      ? [projectPath]
      : [];
  });
}

function findBalanced(sourceText, startIndex, openChar, closeChar) {
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaping = false;

  for (let index = startIndex; index < sourceText.length; index += 1) {
    const char = sourceText[index];

    if (inString) {
      if (escaping) {
        escaping = false;
        continue;
      }

      if (char === "\\") {
        escaping = true;
        continue;
      }

      if (char === quote) {
        inString = false;
        quote = "";
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = true;
      quote = char;
      continue;
    }

    if (char === openChar) {
      depth += 1;
    }

    if (char === closeChar) {
      depth -= 1;

      if (depth === 0) {
        return sourceText.slice(startIndex, index + 1);
      }
    }
  }

  return "";
}

function getFirstObject(source, propertyName) {
  const propertyIndex = source.indexOf(`${propertyName}: {`);

  if (propertyIndex === -1) {
    return "";
  }

  const objectStart = source.indexOf("{", propertyIndex);
  return findBalanced(source, objectStart, "{", "}");
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

const deletedFiles = [
  "components/sections/VisibilityGapSection.tsx",
  "components/sections/HowItWorksSection.tsx",
  "components/sections/OneServiceSection.tsx",
  "components/sections/CampaignExampleSection.tsx",
  "components/sections/PhilosophySection.tsx",
  "components/sections/ComplianceSection.tsx",
  "components/sections/WhyReviewsMatterSection.tsx",
  "components/sections/PackagesSection.tsx",
  "components/sections/SuitabilitySection.tsx",
  "components/sections/GuaranteesSection.tsx",
  "components/sections/DiscreetClientWorkSection.tsx",
  "components/sections/FinalCTASection.tsx",
  "components/forms/JoinWaveForm.tsx",
  "components/foundation-status.tsx",
  "content/packages.ts",
  "content/faqs.ts",
  "content/compliance.ts",
  "lib/validation/joinWaveSchema.ts",
  "app/actions/joinWave.ts",
  "app/api/checkout/route.ts",
  "lib/stripe.ts",
];

for (const filePath of deletedFiles) {
  if (projectPathExists(filePath)) {
    fail(`Deleted legacy file still exists: ${filePath}`);
  }
}

const pageSource = readProjectFile("app/page.tsx");
const legacySectionNames = [
  "VisibilityGapSection",
  "HowItWorksSection",
  "OneServiceSection",
  "CampaignExampleSection",
  "PhilosophySection",
  "ComplianceSection",
  "WhyReviewsMatterSection",
  "PackagesSection",
  "SuitabilitySection",
  "GuaranteesSection",
  "DiscreetClientWorkSection",
  "FinalCTASection",
];

for (const sectionName of legacySectionNames) {
  if (pageSource.includes(sectionName)) {
    fail(`Root page still references ${sectionName}.`);
  }
}

const requiredRootOrder = [
  "<SiteHeader",
  "<main>",
  "<HeroSection",
  "<SignalTicker",
  "<ReviewCollectionGapSection",
  "<ReviewSystemJourneySection",
  "<ReviewSystemOfferSection",
  "<FAQSection",
  "</main>",
  "<SiteFooter",
];
let previousIndex = -1;

for (const marker of requiredRootOrder) {
  const markerIndex = pageSource.indexOf(marker);

  if (markerIndex === -1) {
    fail(`Root page is missing ${marker}.`);
    continue;
  }

  if (markerIndex <= previousIndex) {
    fail(`Root page order is incorrect around ${marker}.`);
  }

  previousIndex = markerIndex;
}

const rootSectionTags = [
  "HeroSection",
  "SignalTicker",
  "ReviewCollectionGapSection",
  "ReviewSystemJourneySection",
  "ReviewSystemOfferSection",
  "FAQSection",
];

for (const sectionTag of rootSectionTags) {
  if (countMatches(pageSource, new RegExp(`<${sectionTag}\\b`, "g")) !== 1) {
    fail(`Root page must render exactly one ${sectionTag}.`);
  }
}

const reviewSystemSource = readProjectFile("content/reviewSystem.ts");

if (countMatches(reviewSystemSource, /\bproductName:/g) !== 1) {
  fail("Canonical pivot content must contain exactly one offer product name.");
}

if (countMatches(reviewSystemSource, /\bprice:\s*"\$299 AUD"/g) !== 1) {
  fail("Canonical pivot content must contain exactly one $299 AUD price.");
}

const packageJson = JSON.parse(readProjectFile("package.json"));

if (packageJson.dependencies?.stripe || packageJson.devDependencies?.stripe) {
  fail("stripe remains in package dependencies.");
}

if (projectPathExists("package-lock.json")) {
  const packageLock = readProjectFile("package-lock.json");

  if (/"node_modules\/stripe"|"stripe":/i.test(packageLock)) {
    fail("stripe remains in package-lock.json.");
  }
}

const scannedFiles = [
  ...listFiles("app"),
  ...listFiles("components"),
  ...listFiles("content"),
  ...listFiles("lib"),
  ...listFiles("types"),
  "README.md",
  ".env.example",
  "docs/deployment-checklist.md",
  "docs/env-checklist.md",
  "docs/final-launch-report.md",
  "docs/qa-report.md",
].filter((filePath) => projectPathExists(filePath));

const legacyTerms = [
  "Foundation Wave",
  "Momentum Wave",
  "campaign target",
  "activation schedule",
  "audience matching",
  "monthly reporting",
  "free coffee",
  "JoinWave",
  "joinWave",
  "Visibility Wave",
  "package_select",
  "trackPackageSelect",
  "packagesContent",
  "packageName",
  "Selected package",
  "STRIPE_",
];

for (const filePath of scannedFiles) {
  const source = readProjectFile(filePath);

  for (const term of legacyTerms) {
    if (source.includes(term)) {
      fail(`Legacy term "${term}" remains in ${filePath}.`);
    }
  }
}

const campaignAllowlist = new Map([
  [
    "content/site.ts",
    ["No quote call. No long consultation. Just a clean campaign slot."],
  ],
  [
    "content/sections.ts",
    [
      "A done-for-you campaign system that helps suitable small businesses create genuine local experiences, collect honest feedback and build the visibility layer that makes customers more confident when they search.",
      "No fake reviews. No paid ratings. No pressure tactics. Just real-world campaigns designed around genuine experience, honest feedback and long-term visibility.",
    ],
  ],
  ["components/sections/SignalTicker.tsx", ['aria-label="Campaign signals"']],
  [
    "content/reviewSystem.ts",
    [
      "Not a campaign. Not a generic template. A working review collection system built around your business.",
    ],
  ],
]);

for (const filePath of scannedFiles) {
  let source = readProjectFile(filePath);

  for (const allowed of campaignAllowlist.get(filePath) ?? []) {
    source = source.replaceAll(allowed, "");
  }

  const campaignMatches = source.match(/\bcampaigns?\b/gi);

  if (campaignMatches) {
    fail(
      `Unexpected campaign wording remains in ${filePath}: ${[
        ...new Set(campaignMatches),
      ].join(", ")}`,
    );
  }
}

const complianceRiskPatterns = [
  /\bguaranteed reviews?\b/i,
  /\bguaranteed (?:5-star|five-star)\b/i,
  /\bguaranteed (?:star )?ratings?\b/i,
  /\bguaranteed (?:Google )?publication\b/i,
  /\bguaranteed ranking\b/i,
  /\bonly positive reviews?\b/i,
  /\bsentiment[- ]gating\b/i,
  /\bnegative customers? (?:are )?routed away\b/i,
  /\bfilter(?:ing)? out negative\b/i,
  /\bpromise(?:s|d)? (?:review count|review volume|ratings?|publication|ranking)\b/i,
];

for (const filePath of scannedFiles) {
  const source = readProjectFile(filePath);

  for (const pattern of complianceRiskPatterns) {
    if (pattern.test(source)) {
      fail(`Compliance-risk wording matched ${pattern} in ${filePath}.`);
    }
  }
}

const fitCheck = getFirstObject(reviewSystemSource, "fitCheck");
const stageOne = getFirstObject(fitCheck, "stageOne");

if (!stageOne) {
  fail("Could not locate Stage One fit-check content.");
} else if (/\bid:\s*"[^"]*(?:name|email|phone)[^"]*"/i.test(stageOne)) {
  fail("Stage One content includes a contact-field id.");
}

const formSources = scannedFiles
  .filter((filePath) =>
    /components\/forms\/|content\/reviewSystem\.ts/.test(filePath),
  )
  .map((filePath) => [filePath, readProjectFile(filePath)]);

for (const [filePath, source] of formSources) {
  if (/\b(?:id|name):\s*"[^"]*phone[^"]*"/i.test(source)) {
    fail(`Phone field appears in ${filePath}.`);
  }

  if (/\btype:\s*"tel"|\btype="tel"/i.test(source)) {
    fail(`Telephone input appears in ${filePath}.`);
  }
}

const obsoleteTargets = ["#packages", "#join", "#join-now", "#compliance"];

for (const filePath of scannedFiles) {
  const source = readProjectFile(filePath);

  for (const target of obsoleteTargets) {
    if (source.includes(target)) {
      fail(`Obsolete target ${target} remains in ${filePath}.`);
    }
  }
}

if (failures.length > 0) {
  console.error("Pivot invariant check failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Pivot invariant check passed.");
