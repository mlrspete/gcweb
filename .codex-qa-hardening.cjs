const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const chromePath =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.QA_URL || "http://localhost:3034";
const debugPort = Number(process.env.CHROME_DEBUG_PORT || 9355);

const viewports = [
  { label: "mobile-360", width: 360, height: 740, mobile: true },
  { label: "mobile-390", width: 390, height: 844, mobile: true },
  { label: "tablet-768", width: 768, height: 1024, mobile: true },
  { label: "laptop-1024", width: 1024, height: 900, mobile: false },
  { label: "desktop-1440", width: 1440, height: 1000, mobile: false },
  { label: "large-1920", width: 1920, height: 1080, mobile: false },
];

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestJson(url, method = "GET") {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        if ((res.statusCode || 500) >= 400) {
          reject(new Error(body));
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
  for (let i = 0; i < 80; i += 1) {
    try {
      return await requestJson(`http://127.0.0.1:${debugPort}/json/version`);
    } catch {
      await wait(250);
    }
  }

  throw new Error("Chrome debugging endpoint did not become available.");
}

function connect(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let nextId = 1;
  const pending = new Map();
  const events = [];

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method) {
      events.push(message);
    }

    if (!message.id) return;
    const entry = pending.get(message.id);
    if (!entry) return;
    pending.delete(message.id);
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
    async send(method, params = {}) {
      await opened;
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { resolve, reject });
      });
    },
    close() {
      socket.close();
    },
  };
}

async function collectViewportMetrics(page, viewport) {
  await page.send("Emulation.setEmulatedMedia", { features: [] });
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.mobile ? 3 : 1,
    mobile: viewport.mobile,
  });
  await page.send("Emulation.setTouchEmulationEnabled", {
    enabled: viewport.mobile,
    configuration: viewport.mobile ? "mobile" : "desktop",
  });
  await page.send("Page.navigate", { url: baseUrl });
  await wait(2800);

  const result = await page.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => {
      const visible = (el) => {
        if (!el) return false;
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const columns = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return 0;
        const value = getComputedStyle(el).gridTemplateColumns;
        return value === "none" ? 0 : value.split(" ").filter(Boolean).length;
      };
      const packageLinks = Array.from(document.querySelectorAll("#pricing [data-package]")).map((link) => link.getBoundingClientRect());
      const packageStacked = packageLinks.length === 2 ? Math.abs(packageLinks[0].top - packageLinks[1].top) > 80 : false;
      const menuButton = document.querySelector('button[aria-controls="mobile-menu"]');
      const mobileMenuBefore = Boolean(document.querySelector("#mobile-menu"));
      if (visible(menuButton)) menuButton.click();
      const mobileMenuAfter = Boolean(document.querySelector("#mobile-menu"));
      const faqButtons = document.querySelectorAll("#faq button").length;
      const formControls = document.querySelectorAll("#join-form input, #join-form textarea, #join-form button").length;
      const formLabels = document.querySelectorAll("#join-form label").length;
      const headings = Array.from(document.querySelectorAll("h1,h2,h3")).map((heading) => ({
        tag: heading.tagName,
        text: heading.textContent.trim().slice(0, 80),
      }));
      return {
        label: "${viewport.label}",
        width: window.innerWidth,
        height: window.innerHeight,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        h1Count: document.querySelectorAll("h1").length,
        h2Count: document.querySelectorAll("h2").length,
        canvasCount: document.querySelectorAll("canvas").length,
        fallbackCount: document.querySelectorAll("[data-hero-fallback]").length,
        navButtonVisible: visible(menuButton),
        mobileMenuBefore,
        mobileMenuAfter,
        faqButtons,
        faqColumns: columns("#faq .mt-10.grid"),
        pricingCtas: packageLinks.length,
        packageStacked,
        formControls,
        formLabels,
        pinSpacers: document.querySelectorAll(".pin-spacer").length,
        h1Text: document.querySelector("h1")?.textContent.trim() || "",
        headings,
      };
    })()`,
  });

  const screenshot = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const screenshotPath = path.join(process.cwd(), `.codex-qa-${viewport.label}.png`);
  fs.writeFileSync(screenshotPath, Buffer.from(screenshot.data, "base64"));

  return { ...result.result.value, screenshotPath };
}

async function collectReducedMotionMetrics(page) {
  await page.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page.send("Page.navigate", { url: baseUrl });
  await wait(1800);

  const result = await page.send("Runtime.evaluate", {
    returnByValue: true,
    expression: `(() => ({
      motionAttribute: document.documentElement.dataset.motion || "",
      canvasCount: document.querySelectorAll("canvas").length,
      hiddenRevealCount: Array.from(document.querySelectorAll(".gsap-reveal")).filter((el) => {
        const style = getComputedStyle(el);
        return style.opacity === "0" || style.visibility === "hidden";
      }).length,
      pinSpacers: document.querySelectorAll(".pin-spacer").length,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }))()`,
  });

  return result.result.value;
}

function summarizeConsoleEvents(events) {
  return events
    .filter((event) => {
      if (event.method === "Runtime.consoleAPICalled") {
        return ["error", "warning", "assert"].includes(event.params.type);
      }

      return event.method === "Runtime.exceptionThrown" || event.method === "Log.entryAdded";
    })
    .map((event) => {
      if (event.method === "Runtime.consoleAPICalled") {
        return {
          type: event.params.type,
          text: event.params.args
            .map((arg) => arg.value || arg.description || "")
            .join(" "),
        };
      }

      if (event.method === "Log.entryAdded") {
        return {
          type: event.params.entry.level,
          text: event.params.entry.text,
        };
      }

      return {
        type: "exception",
        text:
          event.params.exceptionDetails.exception?.description ||
          event.params.exceptionDetails.text,
      };
    })
    .filter((entry) => !entry.text.includes("Context Lost"));
}

async function main() {
  const userDataDir = path.join(os.tmpdir(), `codex-chrome-${process.pid}`);
  fs.rmSync(userDataDir, { recursive: true, force: true });

  const chrome = spawn(chromePath, [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${userDataDir}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "about:blank",
  ]);

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

    const metrics = [];
    for (const viewport of viewports) {
      metrics.push(await collectViewportMetrics(page, viewport));
    }
    const reducedMotion = await collectReducedMotionMetrics(page);
    const consoleEvents = summarizeConsoleEvents(page.events);

    page.close();

    const failures = [];
    for (const metric of metrics) {
      if (metric.overflow > 1) failures.push(`${metric.label}: horizontal overflow ${metric.overflow}px`);
      if (metric.h1Count !== 1) failures.push(`${metric.label}: expected one h1, found ${metric.h1Count}`);
      if (metric.h2Count < 10) failures.push(`${metric.label}: expected major section h2s`);
      if (metric.pricingCtas !== 2) failures.push(`${metric.label}: expected two package CTAs`);
      if (metric.faqButtons !== 6) failures.push(`${metric.label}: expected six FAQ buttons`);
      if (metric.formControls < 12 || metric.formLabels < 10) failures.push(`${metric.label}: form controls/labels missing`);
      if (metric.width < 1024 && !metric.navButtonVisible) failures.push(`${metric.label}: mobile nav button not visible`);
      if (metric.width < 1024 && !metric.mobileMenuAfter) failures.push(`${metric.label}: mobile menu did not open`);
      if (metric.width < 768 && metric.canvasCount !== 0) failures.push(`${metric.label}: WebGL canvas should not render on mobile`);
      if (metric.width < 768 && metric.fallbackCount < 1) failures.push(`${metric.label}: mobile fallback hero missing`);
      if (metric.width < 1024 && metric.faqColumns !== 1) failures.push(`${metric.label}: FAQ should be single column`);
      if (metric.width < 1024 && !metric.packageStacked) failures.push(`${metric.label}: pricing cards should stack`);
      if (metric.width < 900 && metric.pinSpacers > 0) failures.push(`${metric.label}: pinned section active below 900px`);
    }
    if (reducedMotion.motionAttribute !== "reduced") failures.push("reduced-motion: html data attribute not set");
    if (reducedMotion.hiddenRevealCount > 0) failures.push("reduced-motion: reveal content hidden");
    if (reducedMotion.canvasCount > 0) failures.push("reduced-motion: WebGL canvas should not render");
    if (reducedMotion.overflow > 1) failures.push("reduced-motion: horizontal overflow");
    if (consoleEvents.length) failures.push(`console: ${consoleEvents.length} warnings/errors captured`);

    console.log(JSON.stringify({ metrics, reducedMotion, consoleEvents, failures }, null, 2));

    if (failures.length) process.exitCode = 1;
  } finally {
    chrome.kill();
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 3000);
      chrome.once("exit", () => {
        clearTimeout(timer);
        resolve();
      });
    });
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
