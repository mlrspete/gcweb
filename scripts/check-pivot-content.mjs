import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("..", import.meta.url));
const contentPath = join(rootDir, "content", "reviewSystem.ts");
const source = readFileSync(contentPath, "utf8");
const failures = [];

function fail(message) {
  failures.push(message);
}

function countMatches(pattern) {
  return [...source.matchAll(pattern)].length;
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

function getFirstArray(propertyName, searchSource = source) {
  const propertyIndex = searchSource.indexOf(`${propertyName}: [`);

  if (propertyIndex === -1) {
    return "";
  }

  const arrayStart = searchSource.indexOf("[", propertyIndex);
  return findBalanced(searchSource, arrayStart, "[", "]");
}

function getAllArrays(propertyName) {
  const arrays = [];
  let offset = 0;
  const needle = `${propertyName}: [`;

  while (offset < source.length) {
    const propertyIndex = source.indexOf(needle, offset);

    if (propertyIndex === -1) {
      break;
    }

    const arrayStart = source.indexOf("[", propertyIndex);
    const arraySource = findBalanced(source, arrayStart, "[", "]");

    if (!arraySource) {
      break;
    }

    arrays.push(arraySource);
    offset = propertyIndex + arraySource.length;
  }

  return arrays;
}

function getFirstObject(propertyName, searchSource = source) {
  const propertyIndex = searchSource.indexOf(`${propertyName}: {`);

  if (propertyIndex === -1) {
    return "";
  }

  const objectStart = searchSource.indexOf("{", propertyIndex);
  return findBalanced(searchSource, objectStart, "{", "}");
}

function countTopLevelObjects(arraySource) {
  let depth = 0;
  let count = 0;
  let inString = false;
  let quote = "";
  let escaping = false;

  for (const char of arraySource) {
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

    if (char === "{") {
      depth += 1;

      if (depth === 1) {
        count += 1;
      }
    }

    if (char === "}") {
      depth -= 1;
    }
  }

  return count;
}

function expectIncludes(expected, label = expected) {
  if (!source.includes(expected)) {
    fail(`Missing ${label}.`);
  }
}

expectIncludes('productName: "Custom Review Capture System"', "product name");
expectIncludes('price: "$299 AUD"', "price");

if (countMatches(/\bproductName:/g) !== 1) {
  fail("There must be exactly one offer product name.");
}

if (countMatches(/\bprice:\s*"\$299 AUD"/g) !== 1) {
  fail("There must be exactly one $299 AUD price.");
}

const requiredFaqIds = [
  "faq-what-we-build",
  "faq-what-299-pays-for",
  "faq-do-it-yourself",
  "faq-after-fit-check",
  "faq-compliance",
  "faq-results",
  "faq-guarantee-fees",
];

for (const faqId of requiredFaqIds) {
  expectIncludes(`id: "${faqId}"`, `FAQ ID ${faqId}`);
}

const customerSteps = getFirstArray("customerSteps");
const statistics = getFirstArray("statistics");
const impacts = getFirstArray("impacts");
const deliverables = getFirstArray("deliverables");
const offers = getFirstArray("offers");
const moduleCount = getAllArrays("modules").reduce(
  (total, arraySource) => total + countTopLevelObjects(arraySource),
  0,
);

if (countTopLevelObjects(customerSteps) !== 4) {
  fail("There must be exactly four customer steps.");
}

if (moduleCount !== 13) {
  fail("There must be exactly thirteen background-work modules.");
}

if (countTopLevelObjects(statistics) !== 3) {
  fail("There must be exactly three gap statistics.");
}

if (countTopLevelObjects(impacts) !== 3) {
  fail("There must be exactly three offer impacts.");
}

if (countTopLevelObjects(deliverables) !== 11) {
  fail("There must be exactly eleven deliverables.");
}

if (countTopLevelObjects(offers) !== 1) {
  fail("There must be exactly one canonical offer.");
}

const fitCheck = getFirstObject("fitCheck");
const stageOne = getFirstObject("stageOne", fitCheck);

if (/\bid:\s*"[^"]*(?:name|email|phone)[^"]*"/i.test(stageOne)) {
  fail("Stage One must not include name, email or phone fields.");
}

if (/\b(?:id|label):\s*"[^"]*phone[^"]*"/i.test(fitCheck)) {
  fail("Fit-check content must not contain a phone field.");
}

const requiredExclusions = [
  "review volume",
  "star rating",
  "review wording",
  "customer sentiment",
  "Google publication",
  "Google’s later treatment of a review",
  "must not offer incentives",
  "pressure customers",
  "prescribe a rating or specific wording",
  "selectively ask only customers expected to leave positive feedback",
  "The guarantee does not cover review volume, ratings, wording, publication or Google’s removal decisions.",
];

for (const exclusion of requiredExclusions) {
  expectIncludes(exclusion, `compliance/guarantee exclusion "${exclusion}"`);
}

if (failures.length > 0) {
  console.error("Pivot content check failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Pivot content check passed.");
