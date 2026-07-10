const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const rootDir = __dirname;
const artifactDir = path.join(rootDir, ".codex-qa-artifacts");
const baseUrl = (process.env.QA_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  "",
);
const debugPort = Number(process.env.CHROME_DEBUG_PORT || 9355);

const viewports = [
  { label: "mobile-360", width: 360, height: 740, mobile: true },
  { label: "mobile-390", width: 390, height: 844, mobile: true },
  { label: "tablet-768", width: 768, height: 1024, mobile: true },
  { label: "laptop-1024", width: 1024, height: 900, mobile: false },
  { label: "desktop-1440", width: 1440, height: 1000, mobile: false },
  { label: "large-1920", width: 1920, height: 1080, mobile: false },
];

const expectedSectionOrder = [
  "review-collection-gap",
  "review-system-journey",
  "review-system-offer",
  "review-system-faq",
];
const expectedHeroH1 =
  "We help ambitious brands be seen by the people who matter most.";
const expectedHeroCtas = ["Join the next wave", "See how it works"];
const expectedTickerPhrases = [
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
];
const policyPaths = ["/privacy", "/terms", "/satisfaction-guarantee"];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pathCandidates() {
  return [
    process.env.PROGRAMFILES &&
      path.join(
        process.env.PROGRAMFILES,
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
    process.env["PROGRAMFILES(X86)"] &&
      path.join(
        process.env["PROGRAMFILES(X86)"],
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
    process.env.LOCALAPPDATA &&
      path.join(
        process.env.LOCALAPPDATA,
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    process.env.HOME &&
      path.join(
        process.env.HOME,
        "Applications",
        "Google Chrome.app",
        "Contents",
        "MacOS",
        "Google Chrome",
      ),
  ].filter(Boolean);
}

function findOnPath(commandNames) {
  const pathEntries = (process.env.PATH || "").split(path.delimiter);
  const extensions = process.platform === "win32" ? [".exe", ".cmd", ""] : [""];

  for (const directory of pathEntries) {
    for (const commandName of commandNames) {
      for (const extension of extensions) {
        const candidate = path.join(directory, `${commandName}${extension}`);

        if (fs.existsSync(candidate)) {
          return candidate;
        }
      }
    }
  }

  return null;
}

function findChrome() {
  if (process.env.CHROME_PATH) {
    if (fs.existsSync(process.env.CHROME_PATH)) {
      return process.env.CHROME_PATH;
    }

    throw new Error(
      `CHROME_PATH points to a missing executable: ${process.env.CHROME_PATH}`,
    );
  }

  const absoluteMatch = pathCandidates().find((candidate) =>
    fs.existsSync(candidate),
  );

  if (absoluteMatch) {
    return absoluteMatch;
  }

  const pathMatch = findOnPath([
    "google-chrome",
    "google-chrome-stable",
    "chromium",
    "chromium-browser",
    "chrome",
  ]);

  if (pathMatch) {
    return pathMatch;
  }

  throw new Error(
    [
      "Chrome or Chromium was not found.",
      "Set CHROME_PATH to the browser executable and rerun npm run qa:pivot.",
      "Checked common Windows, Linux and macOS install locations plus PATH.",
    ].join(" "),
  );
}

function requestJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if ((response.statusCode || 500) >= 400) {
          reject(new Error(body || `HTTP ${response.statusCode}`));
          return;
        }

        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject(error);
        }
      });
    });
    request.on("error", reject);
    request.end();
  });
}

async function waitForChrome() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      return await requestJson(`http://127.0.0.1:${debugPort}/json/version`);
    } catch {
      await wait(200);
    }
  }

  throw new Error(
    `Chrome debugging endpoint did not become available on port ${debugPort}.`,
  );
}

function connect(webSocketDebuggerUrl) {
  if (typeof WebSocket === "undefined") {
    throw new Error(
      "This QA harness requires a Node.js release with the built-in WebSocket API (Node 22 or newer).",
    );
  }

  const socket = new WebSocket(webSocketDebuggerUrl);
  let nextId = 1;
  let currentLabel = "startup";
  const pending = new Map();
  const events = [];

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.method) {
      events.push({ ...message, qaLabel: currentLabel });
    }

    if (!message.id) {
      return;
    }

    const entry = pending.get(message.id);

    if (!entry) {
      return;
    }

    pending.delete(message.id);
    clearTimeout(entry.timer);

    if (message.error) {
      entry.reject(new Error(message.error.message));
      return;
    }

    entry.resolve(message.result);
  });

  const opened = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  return {
    events,
    setLabel(label) {
      currentLabel = label;
    },
    async send(method, params = {}) {
      await opened;
      const id = nextId;
      nextId += 1;

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Chrome DevTools command timed out: ${method}`));
        }, 20000);
        pending.set(id, { resolve, reject, timer });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    async evaluate(expression) {
      const response = await this.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });

      if (response.exceptionDetails) {
        throw new Error(
          response.exceptionDetails.exception?.description ||
            response.exceptionDetails.text ||
            "Browser evaluation failed.",
        );
      }

      return response.result.value;
    },
    close() {
      socket.close();
    },
  };
}

async function setViewport(page, viewport) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.width < 768 ? 3 : 1,
    mobile: viewport.mobile,
  });
  await page.send("Emulation.setTouchEmulationEnabled", {
    enabled: viewport.mobile,
    configuration: viewport.mobile ? "mobile" : "desktop",
  });
}

async function setReducedMotion(page, reduced) {
  await page.send("Emulation.setEmulatedMedia", {
    features: [
      {
        name: "prefers-reduced-motion",
        value: reduced ? "reduce" : "no-preference",
      },
    ],
  });
}

async function waitForCondition(page, expression, label, timeoutMs = 6000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await page.evaluate(`Boolean(${expression})`)) {
      return;
    }

    await wait(100);
  }

  throw new Error(`Timed out waiting for ${label}.`);
}

async function navigate(page, url, label, settleMs = 1400) {
  page.setLabel(label);
  await page.send("Page.navigate", { url });
  await waitForCondition(
    page,
    'document.readyState === "complete"',
    `${label} document readiness`,
  );
  await waitForCondition(
    page,
    'document.documentElement.dataset.motion === "enabled" || document.documentElement.dataset.motion === "reduced"',
    `${label} motion initialization`,
  );
  await wait(settleMs);
}

async function pressKey(page, key, code = key, modifiers = 0) {
  const virtualKeyCodes = {
    Enter: 13,
    Escape: 27,
    Tab: 9,
    Space: 32,
    ArrowDown: 40,
    ArrowUp: 38,
    Home: 36,
    End: 35,
  };
  const virtualKeyCode =
    virtualKeyCodes[key] ||
    (key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0);
  const params = {
    key,
    code,
    modifiers,
    windowsVirtualKeyCode: virtualKeyCode,
    nativeVirtualKeyCode: virtualKeyCode,
  };

  await page.send("Input.dispatchKeyEvent", { type: "keyDown", ...params });
  await page.send("Input.dispatchKeyEvent", { type: "keyUp", ...params });
}

async function captureScreenshot(page, label) {
  const screenshot = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const screenshotPath = path.join(artifactDir, `current-${label}.png`);
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));
  return screenshotPath;
}

async function getRootSnapshot(page) {
  return page.evaluate(`(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const gridColumns = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return 0;
      const value = getComputedStyle(element).gridTemplateColumns;
      return value === "none" ? 0 : value.split(" ").filter(Boolean).length;
    };
    const idCounts = Array.from(document.querySelectorAll("[id]")).reduce((counts, element) => {
      counts[element.id] = (counts[element.id] || 0) + 1;
      return counts;
    }, {});
    const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map((heading) => ({
      level: Number(heading.tagName.slice(1)),
      text: heading.textContent.trim(),
    }));
    const headingSkips = headings.filter((heading, index) => index > 0 && heading.level - headings[index - 1].level > 1);
    const sourceFontSizes = Array.from(document.querySelectorAll('a[href*="brightlocal.com"], a[href*="support.google.com"]'))
      .filter(visible)
      .map((element) => Number.parseFloat(getComputedStyle(element).fontSize));
    const externalLinksMissingLabel = Array.from(document.querySelectorAll('a[target="_blank"]'))
      .filter((link) => !/opens in (a )?new tab/i.test(link.getAttribute("aria-label") || ""))
      .map((link) => link.textContent.trim());
    const touchSelectors = [
      'button[aria-controls="mobile-menu"]',
      '#faq button',
      '[data-fit-check-trigger]',
    ];
    const smallTouchTargets = touchSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector))
        .filter(visible)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { selector, text: element.textContent.trim(), width: rect.width, height: rect.height };
        })
        .filter((target) => target.width < 43 || target.height < 43),
    );
    const offerCard = document.querySelector("[data-offer-card]");
    const fitTrigger = document.querySelector("[data-fit-check-trigger]");
    const hero = document.querySelector("#hero");
    const header = document.querySelector("header");
    const ticker = document.querySelector("#signal-ticker");
    const vitals = window.__qaVitals || {};
    const resources = performance.getEntriesByType("resource");

    return {
      width: window.innerWidth,
      height: window.innerHeight,
      overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      h1Count: document.querySelectorAll("h1").length,
      h1Text: document.querySelector("#hero h1")?.textContent.trim() || "",
      sectionOrder: Array.from(document.querySelectorAll("[data-section]"), (section) => section.dataset.section),
      faqTriggerCount: document.querySelectorAll("#faq button").length,
      faqColumnCount: gridColumns("#faq .mt-10.grid"),
      heroCanvasCount: document.querySelectorAll("#hero canvas").length,
      heroCanvasVisibleCount: Array.from(document.querySelectorAll("#hero canvas")).filter(visible).length,
      heroFallbackCount: document.querySelectorAll("#hero [data-hero-fallback]").length,
      heroFallbackVisibleCount: Array.from(document.querySelectorAll("#hero [data-hero-fallback]")).filter(visible).length,
      pinSpacerCount: document.querySelectorAll(".pin-spacer").length,
      priceCardCount: document.querySelectorAll("[data-offer-card]").length,
      productCount: document.querySelectorAll('[data-offer="custom-review-capture-system"]').length,
      priceCount: document.querySelectorAll('[data-price="299-aud"]').length,
      fitTriggerCount: document.querySelectorAll("[data-fit-check-trigger]").length,
      packageCtaCount: document.querySelectorAll("[data-package], [data-package-cta]").length,
      checkoutSurfaceCount: document.querySelectorAll('form[action*="checkout"], a[href*="/api/checkout"], button[data-checkout]').length,
      customerStepCount: document.querySelectorAll("[data-customer-step]").length,
      workModuleCount: document.querySelectorAll("[data-work-module]").length,
      footerLinkCount: document.querySelectorAll("footer a").length,
      heroCtas: Array.from(document.querySelectorAll("#hero a"), (link) => link.textContent.trim()),
      headerJoinNowCount: Array.from(document.querySelectorAll("header a"))
        .filter((link) => link.textContent.trim() === "Join Now").length,
      headerJoinWaveCount: Array.from(document.querySelectorAll("header a"))
        .filter((link) => link.textContent.trim() === "Join the next wave").length,
      tickerPhrases: Array.from(document.querySelectorAll('#signal-ticker .gsap-ticker-item[aria-hidden="false"]'), (item) => item.textContent.trim()),
      mobileMenuButtonVisible: visible(document.querySelector('button[aria-controls="mobile-menu"]')),
      duplicateIds: Object.entries(idCounts).filter(([, count]) => count > 1).map(([id]) => id),
      headingSkips,
      landmarks: {
        header: document.querySelectorAll("header").length,
        main: document.querySelectorAll("main").length,
        footer: document.querySelectorAll("footer").length,
        namedNavs: Array.from(document.querySelectorAll("nav")).filter((nav) => nav.getAttribute("aria-label")).length,
      },
      sourceFontMin: sourceFontSizes.length ? Math.min(...sourceFontSizes) : 0,
      externalLinksMissingLabel,
      smallTouchTargets,
      guaranteePresent: Array.from(document.querySelectorAll("[data-offer-card] h4"))
        .some((heading) => heading.textContent.trim() === "Satisfaction guarantee"),
      mobileCtaWidthRatio: offerCard && fitTrigger
        ? fitTrigger.getBoundingClientRect().width / offerCard.querySelector(".relative.z-10").getBoundingClientRect().width
        : 0,
      heroGeometry: hero && header && ticker ? {
        heroHeight: hero.getBoundingClientRect().height,
        headerHeight: header.getBoundingClientRect().height,
        tickerHeight: ticker.getBoundingClientRect().height,
      } : null,
      vitals: {
        cls: Number((vitals.cls || 0).toFixed(4)),
        lcp: Math.round(vitals.lcp || 0),
        longTaskCount: vitals.longTaskCount || 0,
        scriptTransferBytes: resources
          .filter((entry) => entry.initiatorType === "script")
          .reduce((total, entry) => total + (entry.transferSize || 0), 0),
        resourceTransferBytes: resources.reduce((total, entry) => total + (entry.transferSize || 0), 0),
      },
    };
  })()`);
}

async function getStageOneSnapshot(page) {
  return page.evaluate(`(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const form = dialog?.querySelector('form[data-fit-check-step="fit-check"]');
    const controls = form ? Array.from(form.querySelectorAll("input,select,textarea")) : [];
    const meaningfulControls = controls.filter((control) => {
      const style = getComputedStyle(control);
      return control.type !== "hidden" && style.display !== "none" && control.tabIndex !== -1;
    });
    const contactPattern = /email|contact.?name|business.?name|phone|telephone/i;
    const phonePattern = /phone|telephone/i;
    const rect = dialog?.getBoundingClientRect();
    const labelledBy = dialog?.getAttribute("aria-labelledby");
    const describedBy = dialog?.getAttribute("aria-describedby");

    return {
      dialogPresent: Boolean(dialog),
      contactFieldCount: meaningfulControls.filter((control) =>
        control.type === "email" || control.type === "tel" ||
        contactPattern.test([control.name, control.id, control.autocomplete].filter(Boolean).join(" ")),
      ).length,
      phoneFieldCount: controls.filter((control) =>
        control.type === "tel" || phonePattern.test([control.name, control.id, control.autocomplete].filter(Boolean).join(" ")),
      ).length,
      unlabelledControlCount: meaningfulControls.filter((control) =>
        !control.labels?.length && !control.getAttribute("aria-label") && !control.getAttribute("aria-labelledby"),
      ).length,
      labelledByValid: Boolean(labelledBy && document.getElementById(labelledBy)),
      describedByValid: Boolean(describedBy && document.getElementById(describedBy)),
      focusInside: Boolean(dialog?.contains(document.activeElement)),
      activeName: document.activeElement?.getAttribute("name") || "",
      safeArea: rect ? {
        top: rect.top,
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom,
        left: rect.left,
      } : null,
    };
  })()`);
}

async function openDialog(page) {
  await page.evaluate(
    `document.querySelector("[data-fit-check-trigger]")?.click()`,
  );
  await waitForCondition(
    page,
    "document.querySelector('[role=\"dialog\"]')",
    "fit-check dialog",
  );
  await wait(150);
}

async function closeDialog(page) {
  await page.evaluate(`(() => {
    const close = Array.from(document.querySelectorAll('[role="dialog"] button'))
      .find((button) => button.textContent.trim() === "Close");
    close?.click();
  })()`);
  await waitForCondition(
    page,
    "!document.querySelector('[role=\"dialog\"]')",
    "fit-check dialog close",
  );
  await wait(80);
}

async function collectViewportMetrics(page, viewport) {
  await setReducedMotion(page, false);
  await setViewport(page, viewport);
  await navigate(
    page,
    `${baseUrl}/?qa=${viewport.label}`,
    `viewport:${viewport.label}`,
    2100,
  );

  const snapshot = await getRootSnapshot(page);
  let mobileMenu = null;

  if (viewport.width < 1024) {
    await page.evaluate(
      `document.querySelector('button[aria-controls="mobile-menu"]')?.focus()`,
    );
    await pressKey(page, "Enter", "Enter");
    await wait(120);

    const opened = await page.evaluate(`(() => ({
      open: Boolean(document.querySelector("#mobile-menu")),
      expanded: document.querySelector('button[aria-controls="mobile-menu"]')?.getAttribute("aria-expanded"),
    }))()`);

    const screenshotPath = await captureScreenshot(page, viewport.label);
    await pressKey(page, "Escape", "Escape");
    await wait(120);

    const closedWithEscape = await page.evaluate(`(() => ({
      closed: !document.querySelector("#mobile-menu"),
      focusReturned: document.activeElement === document.querySelector('button[aria-controls="mobile-menu"]'),
    }))()`);

    if (!closedWithEscape.closed) {
      await page.evaluate(
        `document.querySelector('button[aria-controls="mobile-menu"]')?.click()`,
      );
      await wait(80);
    }

    mobileMenu = { ...opened, ...closedWithEscape, screenshotPath };
  } else {
    mobileMenu = {
      open: false,
      expanded: "false",
      closed: true,
      focusReturned: true,
      screenshotPath: await captureScreenshot(page, viewport.label),
    };
  }

  await openDialog(page);
  const stageOne = await getStageOneSnapshot(page);
  await closeDialog(page);

  await page.evaluate(`(() => {
    const heading = Array.from(document.querySelectorAll("[data-offer-card] h4"))
      .find((candidate) => candidate.textContent.trim() === "Satisfaction guarantee");
    heading?.scrollIntoView({ block: "center" });
  })()`);
  await wait(650);
  const offerVisibility = await page.evaluate(`(() => {
    const heading = Array.from(document.querySelectorAll("[data-offer-card] h4"))
      .find((candidate) => candidate.textContent.trim() === "Satisfaction guarantee");
    const card = document.querySelector("[data-offer-card]");
    const headingRect = heading?.getBoundingClientRect();
    const cardStyle = card ? getComputedStyle(card) : null;
    return {
      guaranteeInViewport: Boolean(
        headingRect && headingRect.bottom > 0 && headingRect.top < window.innerHeight,
      ),
      priceCardOpacity: cardStyle ? Number.parseFloat(cardStyle.opacity) : 0,
    };
  })()`);

  const policyMetrics = [];

  for (const policyPath of policyPaths) {
    await navigate(
      page,
      `${baseUrl}${policyPath}?qa=${viewport.label}`,
      `policy:${viewport.label}:${policyPath}`,
      250,
    );
    policyMetrics.push(
      await page.evaluate(`({
        path: ${JSON.stringify(policyPath)},
        overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
        h1Count: document.querySelectorAll("h1").length,
        h1Visible: Boolean(document.querySelector("h1")?.getBoundingClientRect().height),
      })`),
    );
  }

  return {
    ...snapshot,
    label: viewport.label,
    mobileMenu,
    stageOne,
    offerVisibility,
    policyMetrics,
  };
}

async function setNativeValue(page, selector, value) {
  await page.evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error("Missing control: " + ${JSON.stringify(selector)});
    const prototype = element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : element instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(prototype, "value").set;
    setter.call(element, ${JSON.stringify(value)});
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
}

async function selectIndex(page, selector, index) {
  await page.evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error("Missing select: " + ${JSON.stringify(selector)});
    element.selectedIndex = ${index};
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
  })()`);
}

async function clickNth(page, selector, index) {
  await page.evaluate(`(() => {
    const element = document.querySelectorAll(${JSON.stringify(selector)})[${index}];
    if (!element) throw new Error("Missing indexed control: " + ${JSON.stringify(selector)} + "[${index}]");
    element.click();
  })()`);
}

async function clickButtonByText(page, containerSelector, text) {
  await page.evaluate(`(() => {
    const container = document.querySelector(${JSON.stringify(containerSelector)});
    const button = Array.from(container?.querySelectorAll("button") || [])
      .find((candidate) => candidate.textContent.trim() === ${JSON.stringify(text)});
    if (!button) throw new Error("Missing button: " + ${JSON.stringify(text)});
    button.click();
  })()`);
}

async function fillStageOne(
  page,
  { volumeIndex, requestIndex, compliance = true },
) {
  await setNativeValue(
    page,
    'input[name="businessUrl"]',
    "https://example.com",
  );
  await selectIndex(page, 'select[name="industry"]', 1);
  await clickNth(page, 'input[name="customerVolume"]', volumeIndex);
  await clickNth(page, 'input[name="requestMethod"]', requestIndex);
  await clickNth(
    page,
    'fieldset input[type="checkbox"]:not([name="complianceAccepted"])',
    0,
  );

  if (compliance) {
    await page.evaluate(
      `document.querySelector('input[name="complianceAccepted"]')?.click()`,
    );
  }
}

async function submitStageOne(page) {
  await page.evaluate(
    `document.querySelector('form[data-fit-check-step="fit-check"] button[type="submit"]')?.click()`,
  );
  await wait(220);
}

function findForbiddenAnalyticsKeys(events) {
  const forbiddenKeys = new Set([
    "url",
    "businessurl",
    "email",
    "workemail",
    "contactname",
    "businessname",
    "notes",
    "phone",
    "telephone",
    "sourcepage",
    "formdata",
    "rawform",
  ]);
  const findings = [];

  function inspect(value, pathParts) {
    if (!value || typeof value !== "object") {
      return;
    }

    for (const [key, nestedValue] of Object.entries(value)) {
      const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
      const nextPath = [...pathParts, key];

      if (forbiddenKeys.has(normalized)) {
        findings.push(nextPath.join("."));
      }

      inspect(nestedValue, nextPath);
    }
  }

  events.forEach((event, index) => inspect(event, [`event[${index}]`]));
  return findings;
}

async function testFitCheckInteraction(page) {
  await setReducedMotion(page, false);
  await setViewport(page, {
    label: "fit-check",
    width: 390,
    height: 844,
    mobile: true,
  });
  await navigate(
    page,
    `${baseUrl}/?qa=fit-check`,
    "interaction:fit-check",
    900,
  );
  await openDialog(page);

  const initial = await getStageOneSnapshot(page);
  await fillStageOne(page, { volumeIndex: 1, requestIndex: 0 });
  await submitStageOne(page);
  await waitForCondition(
    page,
    "document.querySelector('[data-fit-result=\"potential-fit\"]')",
    "potential-fit result",
  );

  const potentialResult = await page.evaluate(`(() => ({
    category: document.querySelector("[data-fit-result]")?.dataset.fitResult || "",
    title: document.querySelector("[data-fit-result] h2")?.textContent.trim() || document.querySelector("[data-fit-result] [role=heading]")?.textContent.trim() || "",
    statusRole: document.querySelector("[data-fit-result]")?.getAttribute("role") || "",
  }))()`);

  await clickButtonByText(page, "[data-fit-result]", "Request a manual review");
  await waitForCondition(
    page,
    'document.querySelector("[data-manual-review-form]")',
    "manual-review contact form",
  );

  const contact = await page.evaluate(`(() => ({
    workEmailCount: document.querySelectorAll('[data-manual-review-form] input[type="email"]').length,
    phoneCount: document.querySelectorAll('[data-manual-review-form] input[type="tel"], [data-manual-review-form] input[name*="phone" i]').length,
    title: document.querySelector('[role="dialog"] h2')?.textContent.trim() || "",
    described: Boolean(document.querySelector('[role="dialog"]')?.getAttribute("aria-describedby")),
  }))()`);

  await setNativeValue(
    page,
    '[data-manual-review-form] input[name="workEmail"]',
    "qa@example.test",
  );

  for (let index = 0; index < 20; index += 1) {
    await pressKey(page, "Tab", "Tab");
  }

  const focusTrapHeld = await page.evaluate(
    `document.querySelector('[role="dialog"]')?.contains(document.activeElement) || false`,
  );
  await pressKey(page, "Escape", "Escape");
  await waitForCondition(
    page,
    "!document.querySelector('[role=\"dialog\"]')",
    "Escape dialog close",
  );
  await wait(120);
  const focusAfterEscape = await page.evaluate(`(() => ({
    returned: document.activeElement === document.querySelector("[data-fit-check-trigger]"),
    tag: document.activeElement?.tagName || "",
    text: document.activeElement?.textContent?.trim() || "",
  }))()`);

  await openDialog(page);
  const persisted = await page.evaluate(`(() => ({
    step: document.querySelector('[role="dialog"]')?.dataset.fitCheckStep || "",
    workEmail: document.querySelector('[data-manual-review-form] input[name="workEmail"]')?.value || "",
  }))()`);

  await clickButtonByText(page, "[role=dialog]", "Start again");
  await waitForCondition(
    page,
    "document.querySelector('form[data-fit-check-step=\"fit-check\"]')",
    "fit-check reset",
  );
  const reset = await page.evaluate(`(() => ({
    url: document.querySelector('input[name="businessUrl"]')?.value || "",
    checkedRadioCount: document.querySelectorAll('input[name="customerVolume"]:checked, input[name="requestMethod"]:checked').length,
    complianceChecked: document.querySelector('input[name="complianceAccepted"]')?.checked || false,
  }))()`);

  await fillStageOne(page, { volumeIndex: 0, requestIndex: 4 });
  await submitStageOne(page);
  await waitForCondition(
    page,
    "document.querySelector('[data-fit-result=\"manual-review\"]')",
    "manual-review result",
  );
  const manualResult = await page.evaluate(
    `document.querySelector("[data-fit-result]")?.dataset.fitResult || ""`,
  );

  await clickButtonByText(page, "[data-fit-result]", "Start again");
  await waitForCondition(
    page,
    "document.querySelector('form[data-fit-check-step=\"fit-check\"]')",
    "second fit-check reset",
  );
  await fillStageOne(page, {
    volumeIndex: 1,
    requestIndex: 0,
    compliance: false,
  });
  await submitStageOne(page);

  const complianceError = await page.evaluate(`(() => ({
    resultCount: document.querySelectorAll("[data-fit-result]").length,
    alertText: Array.from(document.querySelectorAll('[role="alert"]')).map((alert) => alert.textContent.trim()).join(" "),
    ariaInvalid: document.querySelector('input[name="complianceAccepted"]')?.getAttribute("aria-invalid") || "",
  }))()`);
  const analyticsEvents = await page.evaluate(
    `window.__qaAnalyticsEvents || []`,
  );
  const analyticsEventNames = analyticsEvents.map((event) => event.event);
  const forbiddenAnalyticsKeys = findForbiddenAnalyticsKeys(analyticsEvents);

  await closeDialog(page);

  return {
    initial,
    potentialResult,
    contact,
    focusTrapHeld,
    focusAfterEscape,
    persisted,
    reset,
    manualResult,
    complianceError,
    analyticsEventNames,
    forbiddenAnalyticsKeys,
  };
}

async function testComplianceHash(page) {
  await setReducedMotion(page, false);
  await setViewport(page, {
    label: "compliance-hash",
    width: 1440,
    height: 1000,
    mobile: false,
  });
  await navigate(
    page,
    `${baseUrl}/?qa=compliance#faq-compliance`,
    "interaction:compliance-hash",
    1900,
  );

  return page.evaluate(`(() => {
    const item = document.getElementById("faq-compliance");
    const trigger = item?.querySelector("button");
    const header = document.querySelector("header");
    const itemRect = item?.getBoundingClientRect();
    const headerRect = header?.getBoundingClientRect();
    return {
      open: item?.dataset.state === "open" && trigger?.getAttribute("aria-expanded") === "true",
      itemTop: itemRect?.top ?? -1,
      headerBottom: headerRect?.bottom ?? -1,
      visibleBelowHeader: Boolean(itemRect && headerRect && itemRect.top >= headerRect.bottom - 8),
      insideViewport: Boolean(itemRect && itemRect.top < window.innerHeight * 0.65),
    };
  })()`);
}

async function testAccordionKeyboard(page) {
  const selector = "#faq button";
  await page.evaluate(
    `document.querySelectorAll(${JSON.stringify(selector)})[0]?.focus()`,
  );
  await pressKey(page, " ", "Space");
  await wait(100);
  const openedWithSpace = await page.evaluate(
    `document.querySelectorAll(${JSON.stringify(selector)})[0]?.getAttribute("aria-expanded") === "true"`,
  );

  await pressKey(page, "ArrowDown", "ArrowDown");
  const arrowDownIndex = await page.evaluate(
    `Array.from(document.querySelectorAll(${JSON.stringify(selector)})).indexOf(document.activeElement)`,
  );
  await pressKey(page, "End", "End");
  const endIndex = await page.evaluate(
    `Array.from(document.querySelectorAll(${JSON.stringify(selector)})).indexOf(document.activeElement)`,
  );
  await pressKey(page, "Home", "Home");
  const homeIndex = await page.evaluate(
    `Array.from(document.querySelectorAll(${JSON.stringify(selector)})).indexOf(document.activeElement)`,
  );

  return { openedWithSpace, arrowDownIndex, endIndex, homeIndex };
}

async function testReducedMotion(page) {
  await setViewport(page, {
    label: "reduced-motion",
    width: 1440,
    height: 1000,
    mobile: false,
  });
  await setReducedMotion(page, true);
  await navigate(page, `${baseUrl}/?qa=reduced-motion`, "motion:reduced", 900);

  return page.evaluate(`(() => {
    const visible = (element) => {
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const hiddenReveals = Array.from(document.querySelectorAll(".gsap-reveal")).filter((element) => {
      const style = getComputedStyle(element);
      return style.opacity === "0" || style.visibility === "hidden";
    });
    const nonFinalJourneyItems = Array.from(document.querySelectorAll("[data-customer-step], [data-work-module], [data-journey-current]")).filter((element) => {
      const style = getComputedStyle(element);
      return Number.parseFloat(style.opacity) < 0.99 || style.transform !== "none";
    });
    const hiddenFlowNodes = Array.from(document.querySelectorAll("[data-review-flow-node]")).filter((element) => !visible(element));
    const runningAnimations = document.getAnimations().filter((animation) => animation.playState === "running");
    return {
      motionAttribute: document.documentElement.dataset.motion || "",
      visibleCanvasCount: Array.from(document.querySelectorAll("#hero canvas")).filter(visible).length,
      visibleFallbackCount: Array.from(document.querySelectorAll("#hero [data-hero-fallback]")).filter(visible).length,
      hiddenRevealCount: hiddenReveals.length,
      pinSpacerCount: document.querySelectorAll(".pin-spacer").length,
      nonFinalJourneyItemCount: nonFinalJourneyItems.length,
      hiddenFlowNodeCount: hiddenFlowNodes.length,
      runningAnimationCount: runningAnimations.length,
      overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
    };
  })()`);
}

async function testJourneyResize(page) {
  await setReducedMotion(page, false);
  await setViewport(page, {
    label: "resize-1440",
    width: 1440,
    height: 1000,
    mobile: false,
  });
  await navigate(page, `${baseUrl}/?qa=resize`, "motion:resize", 1800);

  const widths = [1440, 900, 1200, 1023, 1024, 768];
  const results = [];

  for (const width of widths) {
    await setViewport(page, {
      label: `resize-${width}`,
      width,
      height: width < 1024 ? 900 : 1000,
      mobile: false,
    });
    await wait(650);
    results.push(
      await page.evaluate(`({
        width: window.innerWidth,
        pinSpacerCount: document.querySelectorAll(".pin-spacer").length,
        overflow: Math.max(0, document.documentElement.scrollWidth - window.innerWidth),
      })`),
    );
  }

  return results;
}

function metricValue(metrics, name) {
  return metrics.metrics.find((metric) => metric.name === name)?.value || 0;
}

async function testDialogMemory(page) {
  await setReducedMotion(page, false);
  await setViewport(page, {
    label: "memory",
    width: 1024,
    height: 900,
    mobile: false,
  });
  await navigate(page, `${baseUrl}/?qa=memory`, "performance:memory", 900);

  await openDialog(page);
  await closeDialog(page);
  await page.send("HeapProfiler.collectGarbage");
  const before = await page.send("Performance.getMetrics");

  for (let iteration = 0; iteration < 10; iteration += 1) {
    await openDialog(page);
    await closeDialog(page);
  }

  await page.send("HeapProfiler.collectGarbage");
  const after = await page.send("Performance.getMetrics");

  return {
    nodeDelta: metricValue(after, "Nodes") - metricValue(before, "Nodes"),
    listenerDelta:
      metricValue(after, "JSEventListeners") -
      metricValue(before, "JSEventListeners"),
    heapDeltaBytes:
      metricValue(after, "JSHeapUsedSize") -
      metricValue(before, "JSHeapUsedSize"),
  };
}

function summarizeConsoleEvents(events) {
  const contextLossPattern = /context lost|context_lost_webgl/i;

  return events
    .filter((event) => {
      if (event.method === "Runtime.consoleAPICalled") {
        return ["error", "warning", "assert"].includes(event.params.type);
      }

      if (event.method === "Runtime.exceptionThrown") {
        return true;
      }

      if (event.method === "Log.entryAdded") {
        return ["error", "warning"].includes(event.params.entry.level);
      }

      return false;
    })
    .map((event) => {
      if (event.method === "Runtime.consoleAPICalled") {
        return {
          label: event.qaLabel,
          type: event.params.type,
          text: event.params.args
            .map((argument) => argument.value || argument.description || "")
            .join(" "),
        };
      }

      if (event.method === "Log.entryAdded") {
        return {
          label: event.qaLabel,
          type: event.params.entry.level,
          text: event.params.entry.text,
        };
      }

      return {
        label: event.qaLabel,
        type: "exception",
        text:
          event.params.exceptionDetails.exception?.description ||
          event.params.exceptionDetails.text,
      };
    })
    .filter((entry) => !contextLossPattern.test(entry.text));
}

function sameArray(actual, expected) {
  return (
    actual.length === expected.length &&
    actual.every((value, index) => value === expected[index])
  );
}

function validateResults(results) {
  const failures = [];
  const expect = (condition, message) => {
    if (!condition) {
      failures.push(message);
    }
  };

  for (const metric of results.viewports) {
    const prefix = metric.label;
    expect(
      metric.overflow <= 1,
      `${prefix}: horizontal overflow ${metric.overflow}px`,
    );
    expect(
      metric.h1Count === 1,
      `${prefix}: expected one H1, found ${metric.h1Count}`,
    );
    expect(
      metric.h1Text === expectedHeroH1,
      `${prefix}: frozen hero H1 changed`,
    );
    expect(
      sameArray(metric.sectionOrder, expectedSectionOrder),
      `${prefix}: section order is ${metric.sectionOrder.join(" -> ")}`,
    );
    expect(
      metric.faqTriggerCount === 7,
      `${prefix}: expected seven FAQ triggers`,
    );
    expect(
      metric.faqColumnCount === (metric.width >= 1024 ? 2 : 1),
      `${prefix}: FAQ column count ${metric.faqColumnCount}`,
    );
    expect(
      metric.pinSpacerCount === (metric.width >= 1024 ? 1 : 0),
      `${prefix}: journey pin-spacer count ${metric.pinSpacerCount}`,
    );
    expect(
      metric.priceCardCount === 1,
      `${prefix}: price card missing or duplicated`,
    );
    expect(metric.productCount === 1, `${prefix}: expected one product`);
    expect(
      metric.priceCount === 1,
      `${prefix}: expected one $299 AUD price hook`,
    );
    expect(
      metric.fitTriggerCount === 1,
      `${prefix}: expected one fit-check trigger`,
    );
    expect(metric.packageCtaCount === 0, `${prefix}: package CTA remains`);
    expect(
      metric.checkoutSurfaceCount === 0,
      `${prefix}: checkout surface remains`,
    );
    expect(
      metric.customerStepCount === 4,
      `${prefix}: expected four customer steps`,
    );
    expect(
      metric.workModuleCount === 13,
      `${prefix}: expected thirteen work modules`,
    );
    expect(
      metric.footerLinkCount === 6,
      `${prefix}: expected six footer links`,
    );
    expect(
      sameArray(metric.heroCtas, expectedHeroCtas),
      `${prefix}: frozen hero CTA labels changed`,
    );
    expect(
      metric.headerJoinNowCount === 1,
      `${prefix}: Join Now label count changed`,
    );
    expect(
      metric.headerJoinWaveCount === 1,
      `${prefix}: header CTA label count changed`,
    );
    expect(
      sameArray(metric.tickerPhrases, expectedTickerPhrases),
      `${prefix}: frozen ticker phrases changed`,
    );
    expect(
      metric.duplicateIds.length === 0,
      `${prefix}: duplicate IDs ${metric.duplicateIds.join(", ")}`,
    );
    expect(
      metric.headingSkips.length === 0,
      `${prefix}: skipped heading level`,
    );
    expect(
      metric.landmarks.header === 1 &&
        metric.landmarks.main === 1 &&
        metric.landmarks.footer === 1 &&
        metric.landmarks.namedNavs >= 2,
      `${prefix}: named landmark structure is incomplete`,
    );
    expect(metric.sourceFontMin >= 14, `${prefix}: source text is below 14px`);
    expect(
      metric.externalLinksMissingLabel.length === 0,
      `${prefix}: external links lack new-tab labels: ${metric.externalLinksMissingLabel.join(", ")}`,
    );
    expect(
      metric.smallTouchTargets.length === 0,
      `${prefix}: undersized primary touch target`,
    );
    expect(
      metric.guaranteePresent,
      `${prefix}: satisfaction guarantee is missing`,
    );
    expect(
      metric.offerVisibility.guaranteeInViewport &&
        metric.offerVisibility.priceCardOpacity >= 0.99,
      `${prefix}: satisfaction guarantee did not become visible`,
    );
    expect(
      metric.width >= 640 || metric.mobileCtaWidthRatio >= 0.98,
      `${prefix}: mobile fit-check CTA is not full width`,
    );
    expect(
      metric.stageOne.contactFieldCount === 0,
      `${prefix}: Stage One contains contact fields`,
    );
    expect(
      metric.stageOne.phoneFieldCount === 0,
      `${prefix}: phone field found`,
    );
    expect(
      metric.stageOne.unlabelledControlCount === 0,
      `${prefix}: unlabelled Stage One control`,
    );
    expect(
      metric.stageOne.labelledByValid,
      `${prefix}: dialog title is not programmatically linked`,
    );
    expect(
      metric.stageOne.describedByValid,
      `${prefix}: dialog description is not programmatically linked`,
    );
    expect(
      metric.stageOne.focusInside,
      `${prefix}: dialog did not receive focus`,
    );
    expect(
      metric.stageOne.safeArea &&
        metric.stageOne.safeArea.top >= 0 &&
        metric.stageOne.safeArea.right >= 0 &&
        metric.stageOne.safeArea.bottom >= 0 &&
        metric.stageOne.safeArea.left >= 0,
      `${prefix}: dialog escapes viewport safe area`,
    );
    expect(
      metric.width >= 768 || metric.heroCanvasVisibleCount === 0,
      `${prefix}: WebGL canvas rendered below 768px`,
    );
    expect(
      metric.width >= 768 || metric.heroFallbackVisibleCount === 1,
      `${prefix}: expected one visible mobile hero fallback`,
    );
    expect(
      metric.width < 768 ||
        metric.heroCanvasVisibleCount + metric.heroFallbackVisibleCount === 1,
      `${prefix}: desktop/tablet hero visual is missing or duplicated`,
    );
    expect(
      metric.width >= 1024 ||
        (metric.mobileMenu.open && metric.mobileMenu.expanded === "true"),
      `${prefix}: mobile menu did not open with Enter`,
    );
    expect(
      metric.width >= 1024 || metric.mobileMenu.closed,
      `${prefix}: mobile menu did not close with Escape`,
    );
    expect(
      metric.width >= 1024 || metric.mobileMenu.focusReturned,
      `${prefix}: mobile-menu focus did not return after Escape`,
    );

    for (const policy of metric.policyMetrics) {
      expect(
        policy.overflow <= 1,
        `${prefix}${policy.path}: horizontal overflow`,
      );
      expect(
        policy.h1Count === 1 && policy.h1Visible,
        `${prefix}${policy.path}: policy H1 missing`,
      );
    }
  }

  const fit = results.fitCheck;
  expect(
    fit.initial.contactFieldCount === 0,
    "fit-check: Stage One contact field found",
  );
  expect(
    fit.initial.phoneFieldCount === 0,
    "fit-check: Stage One phone field found",
  );
  expect(
    fit.initial.activeName === "businessUrl",
    "fit-check: initial focus did not reach business URL",
  );
  expect(
    fit.potentialResult.category === "potential-fit",
    "fit-check: potential-fit case failed",
  );
  expect(
    fit.potentialResult.statusRole === "status",
    "fit-check: result status announcement missing",
  );
  expect(
    fit.contact.workEmailCount === 1,
    "fit-check: work-email field missing",
  );
  expect(
    fit.contact.phoneCount === 0,
    "fit-check: contact stage contains phone field",
  );
  expect(fit.focusTrapHeld, "fit-check: dialog focus trap failed");
  expect(
    fit.focusAfterEscape.returned,
    `fit-check: focus did not return after Escape (active: ${fit.focusAfterEscape.tag} ${fit.focusAfterEscape.text})`,
  );
  expect(
    fit.persisted.step === "contact" &&
      fit.persisted.workEmail === "qa@example.test",
    "fit-check: state did not persist after close/reopen",
  );
  expect(
    fit.reset.url === "" &&
      fit.reset.checkedRadioCount === 0 &&
      !fit.reset.complianceChecked,
    "fit-check: Start again did not reset Stage One",
  );
  expect(
    fit.manualResult === "manual-review",
    "fit-check: manual-review case failed",
  );
  expect(
    fit.complianceError.resultCount === 0 &&
      /honest and voluntary/i.test(fit.complianceError.alertText) &&
      fit.complianceError.ariaInvalid === "true",
    "fit-check: compliance-required validation failed",
  );
  for (const eventName of [
    "fit_check_opened",
    "fit_check_started",
    "fit_check_completed",
    "fit_result_viewed",
    "manual_review_started",
  ]) {
    expect(
      fit.analyticsEventNames.includes(eventName),
      `analytics: expected ${eventName}`,
    );
  }
  expect(
    fit.forbiddenAnalyticsKeys.length === 0,
    `analytics: forbidden keys ${fit.forbiddenAnalyticsKeys.join(", ")}`,
  );

  expect(results.complianceHash.open, "compliance hash: FAQ 05 did not open");
  expect(
    results.complianceHash.visibleBelowHeader,
    "compliance hash: FAQ 05 is hidden behind the fixed header",
  );
  expect(
    results.complianceHash.insideViewport,
    `compliance hash: FAQ 05 did not enter the viewport (top ${results.complianceHash.itemTop}px)`,
  );
  expect(
    results.accordionKeyboard.openedWithSpace &&
      results.accordionKeyboard.arrowDownIndex === 1 &&
      results.accordionKeyboard.endIndex === 6 &&
      results.accordionKeyboard.homeIndex === 0,
    "FAQ: accordion keyboard navigation failed",
  );

  const reduced = results.reducedMotion;
  expect(
    reduced.motionAttribute === "reduced",
    "reduced motion: data-motion is not reduced",
  );
  expect(
    reduced.visibleCanvasCount === 0,
    "reduced motion: WebGL canvas is visible",
  );
  expect(
    reduced.visibleFallbackCount === 1,
    "reduced motion: static hero fallback missing",
  );
  expect(
    reduced.hiddenRevealCount === 0,
    "reduced motion: Reveal content is hidden",
  );
  expect(
    reduced.pinSpacerCount === 0,
    "reduced motion: journey remains pinned",
  );
  expect(
    reduced.nonFinalJourneyItemCount === 0,
    "reduced motion: journey final state incomplete",
  );
  expect(
    reduced.hiddenFlowNodeCount === 0,
    "reduced motion: review-flow content hidden",
  );
  expect(
    reduced.runningAnimationCount === 0,
    "reduced motion: running animations remain",
  );
  expect(reduced.overflow <= 1, "reduced motion: horizontal overflow");

  for (const resize of results.resize) {
    expect(
      resize.pinSpacerCount === (resize.width >= 1024 ? 1 : 0),
      `resize ${resize.width}: stale or missing pin spacer`,
    );
    expect(resize.overflow <= 1, `resize ${resize.width}: horizontal overflow`);
  }

  expect(
    results.memory.nodeDelta <= 80,
    `memory: DOM node delta ${results.memory.nodeDelta}`,
  );
  expect(
    results.memory.listenerDelta <= 20,
    `memory: listener delta ${results.memory.listenerDelta}`,
  );
  expect(
    results.memory.heapDeltaBytes <= 3 * 1024 * 1024,
    `memory: heap delta ${results.memory.heapDeltaBytes} bytes`,
  );
  expect(
    results.api.checkoutStatus === 404,
    `API: /api/checkout returned ${results.api.checkoutStatus}`,
  );
  expect(
    results.api.healthStatus === 200,
    `API: /api/health returned ${results.api.healthStatus}`,
  );
  expect(
    results.consoleEvents.length === 0,
    `console: ${results.consoleEvents.length} warning/error/exception event(s)`,
  );

  return failures;
}

async function getStatus(url) {
  const response = await fetch(url, { redirect: "manual" });
  return response.status;
}

async function removeDirectoryWithRetry(directory) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      fs.rmSync(directory, { recursive: true, force: true });
      return;
    } catch {
      await wait(250);
    }
  }
}

async function main() {
  const serverStatus = await getStatus(baseUrl);

  if (serverStatus !== 200) {
    throw new Error(
      `QA_URL must point to a running production build; ${baseUrl} returned ${serverStatus}.`,
    );
  }

  const chromePath = findChrome();
  const userDataDir = path.join(os.tmpdir(), `gcweb-qa-chrome-${process.pid}`);
  fs.mkdirSync(artifactDir, { recursive: true });
  await removeDirectoryWithRetry(userDataDir);

  let chromeErrors = "";
  const chrome = spawn(
    chromePath,
    [
      "--headless=new",
      `--remote-debugging-port=${debugPort}`,
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "--disable-component-update",
      "--disable-extensions",
      "--disable-sync",
      "--metrics-recording-only",
      "--mute-audio",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
      "about:blank",
    ],
    {
      stdio: ["ignore", "ignore", "pipe"],
      windowsHide: true,
    },
  );

  chrome.stderr.on("data", (chunk) => {
    chromeErrors += chunk.toString();
  });

  try {
    const version = await waitForChrome();
    const target = await requestJson(
      `http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(baseUrl)}`,
      "PUT",
    );
    const page = connect(target.webSocketDebuggerUrl);

    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("Log.enable");
    await page.send("Performance.enable");
    await page.send("HeapProfiler.enable");
    await page.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `(() => {
        window.__qaAnalyticsEvents = [];
        window.addEventListener("growth-specialists:analytics", (event) => {
          window.__qaAnalyticsEvents.push(JSON.parse(JSON.stringify(event.detail)));
        });
        window.__qaVitals = { cls: 0, lcp: 0, longTaskCount: 0 };
        try {
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) window.__qaVitals.cls += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) window.__qaVitals.lcp = last.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver((list) => {
            window.__qaVitals.longTaskCount += list.getEntries().length;
          }).observe({ type: "longtask", buffered: true });
        } catch {}
      })();`,
    });

    const viewportMetrics = [];

    for (const viewport of viewports) {
      console.log(`Running viewport ${viewport.label}...`);
      viewportMetrics.push(await collectViewportMetrics(page, viewport));
      console.log(`Completed viewport ${viewport.label}.`);
    }

    console.log("Running fit-check interaction...");
    const fitCheck = await testFitCheckInteraction(page);
    console.log("Running compliance hash check...");
    const complianceHash = await testComplianceHash(page);
    console.log("Running accordion keyboard check...");
    const accordionKeyboard = await testAccordionKeyboard(page);
    console.log("Running reduced-motion check...");
    const reducedMotion = await testReducedMotion(page);
    console.log("Running journey resize check...");
    const resize = await testJourneyResize(page);
    console.log("Running dialog memory check...");
    const memory = await testDialogMemory(page);
    const api = {
      checkoutStatus: await getStatus(`${baseUrl}/api/checkout`),
      healthStatus: await getStatus(`${baseUrl}/api/health`),
    };
    const consoleEvents = summarizeConsoleEvents(page.events);
    const results = {
      environment: {
        timestamp: new Date().toISOString(),
        platform: `${process.platform} ${os.release()} (${os.arch()})`,
        node: process.version,
        chromePath,
        chromeVersion: version.Browser,
        protocolProduct: version.Browser,
        baseUrl,
      },
      viewports: viewportMetrics,
      fitCheck,
      complianceHash,
      accordionKeyboard,
      reducedMotion,
      resize,
      memory,
      api,
      consoleEvents,
    };
    const failures = validateResults(results);
    const report = { ...results, failures };
    const reportPath = path.join(artifactDir, "results.json");
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

    console.log(`Pivot browser QA: ${failures.length ? "FAILED" : "PASSED"}`);
    console.log(`Browser: ${results.environment.protocolProduct}`);
    console.log(`Artifacts: ${artifactDir}`);
    for (const metric of viewportMetrics) {
      console.log(
        `${metric.label}: overflow=${metric.overflow}px h1=${metric.h1Count} faq=${metric.faqTriggerCount}/${metric.faqColumnCount} pin=${metric.pinSpacerCount} canvas=${metric.heroCanvasVisibleCount} fallback=${metric.heroFallbackVisibleCount}`,
      );
    }
    console.log(
      `Reduced motion: canvas=${reducedMotion.visibleCanvasCount} hidden=${reducedMotion.hiddenRevealCount} pin=${reducedMotion.pinSpacerCount} animations=${reducedMotion.runningAnimationCount}`,
    );
    console.log(
      `Memory: nodes=${memory.nodeDelta} listeners=${memory.listenerDelta} heap=${memory.heapDeltaBytes}`,
    );

    if (failures.length) {
      for (const failure of failures) {
        console.error(`- ${failure}`);
      }
      process.exitCode = 1;
    }

    page.close();
  } finally {
    chrome.kill();
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 3000);
      chrome.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
    });
    await removeDirectoryWithRetry(userDataDir);

    if (process.exitCode && chromeErrors.trim()) {
      fs.writeFileSync(
        path.join(artifactDir, "chrome-stderr.log"),
        chromeErrors,
      );
    }
  }
}

main().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
