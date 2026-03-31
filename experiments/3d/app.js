import { assetCatalog, defaultAssetId, getAssetById } from "./asset-catalog.js";
import { AssetViewerHarness } from "./viewer-harness.js";

const switcherEl = document.getElementById("asset-switcher");
const statusHeadingEl = document.getElementById("lab-status-heading");
const statusCopyEl = document.getElementById("lab-status-copy");
const statusMetaEl = document.getElementById("lab-status-meta");
const assetDetailTitleEl = document.getElementById("asset-detail-title");
const assetDetailGridEl = document.getElementById("asset-detail-grid");
const assetRuntimeNotesEl = document.getElementById("asset-runtime-notes");
const assetFallbacksEl = document.getElementById("asset-fallbacks");

function getRequestedAssetId() {
  const params = new URLSearchParams(window.location.search);
  const queryAssetId = params.get("asset");
  const hashAssetId = window.location.hash ? window.location.hash.slice(1) : "";

  if (getAssetById(queryAssetId)) {
    return queryAssetId;
  }

  if (getAssetById(hashAssetId)) {
    return hashAssetId;
  }

  return defaultAssetId;
}

const harness = new AssetViewerHarness({
  canvas: document.getElementById("lab-canvas"),
  overlay: document.getElementById("lab-stage-overlay"),
  messageEl: document.getElementById("lab-stage-message"),
  detailEl: document.getElementById("lab-stage-detail"),
  progressEl: document.getElementById("lab-stage-progress"),
  onStateChange: handleHarnessState
});

let activeAssetId = getRequestedAssetId();
let latestReport = {
  state: "idle",
  warnings: []
};

function createMetaRow(label, value) {
  const row = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");

  row.className = "lab-detail-row";
  term.textContent = label;
  description.textContent = value;
  row.appendChild(term);
  row.appendChild(description);

  return row;
}

function renderList(listEl, values, emptyMessage) {
  listEl.textContent = "";

  if (!values || values.length === 0) {
    const item = document.createElement("li");
    item.textContent = emptyMessage;
    listEl.appendChild(item);
    return;
  }

  values.forEach(function (value) {
    const item = document.createElement("li");
    item.textContent = value;
    listEl.appendChild(item);
  });
}

function renderAssetButtons() {
  switcherEl.textContent = "";

  assetCatalog.forEach(function (asset) {
    const button = document.createElement("button");
    const label = document.createElement("span");
    const meta = document.createElement("span");

    button.type = "button";
    button.className = "lab-asset-button" + (asset.id === activeAssetId ? " is-active" : "");
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", asset.id === activeAssetId ? "true" : "false");
    button.dataset.assetId = asset.id;

    label.className = "lab-asset-button__label";
    label.textContent = asset.label;

    meta.className = "lab-asset-button__meta";
    meta.textContent = asset.sourceFormat + " - " + asset.loaderLabel;

    button.appendChild(label);
    button.appendChild(meta);
    button.addEventListener("click", function () {
      selectAsset(asset.id);
    });
    button.addEventListener("dblclick", function () {
      selectAsset(asset.id, true);
    });
    switcherEl.appendChild(button);
  });
}

function renderStatus(asset, report) {
  const stateLabel = report.state === "ready"
    ? "Render active"
    : report.state === "error"
      ? "Load failed"
      : report.state === "loading"
        ? "Loading asset"
        : "Viewer ready";
  const pillClass = report.state === "ready"
    ? "is-ready"
    : report.state === "error"
      ? "is-error"
      : "is-loading";

  statusHeadingEl.textContent = stateLabel;
  statusCopyEl.textContent = report.message || "The viewer is idle.";
  statusMetaEl.innerHTML =
    "<span class=\"lab-status__pill " + pillClass + "\">" + stateLabel + "</span>" +
    (report.detail ? "<p>" + report.detail + "</p>" : "");

  assetDetailTitleEl.textContent = asset.label;
  assetDetailGridEl.textContent = "";
  assetDetailGridEl.appendChild(createMetaRow("Source format", asset.sourceFormat));
  assetDetailGridEl.appendChild(createMetaRow("Runtime loader", asset.loaderLabel));
  assetDetailGridEl.appendChild(createMetaRow("Material route", report.materialRoute || asset.material.materialRoute));
  assetDetailGridEl.appendChild(createMetaRow("Normalized size", report.normalizedSize || "Waiting for first successful load."));
  assetDetailGridEl.appendChild(createMetaRow("Loaded textures", report.loadedTextureSlots && report.loadedTextureSlots.length ? report.loadedTextureSlots.join(", ") : "No texture slots confirmed yet."));

  renderList(
    assetRuntimeNotesEl,
    asset.notes.concat(report.state === "ready" ? [report.detail] : []),
    "No extra runtime notes yet."
  );

  renderList(
    assetFallbacksEl,
    report.warnings,
    "No fallbacks have been applied."
  );
}

function handleHarnessState(report) {
  latestReport = report;
  renderStatus(getAssetById(activeAssetId), latestReport);
}

async function selectAsset(assetId, forceReload) {
  const asset = getAssetById(assetId);

  if (!asset) {
    return;
  }

  if (!forceReload && assetId === activeAssetId && latestReport.state === "loading") {
    return;
  }

  activeAssetId = assetId;
  window.history.replaceState(null, "", "?asset=" + encodeURIComponent(assetId));
  latestReport = {
    state: "loading",
    message: "Starting " + asset.label + "...",
    detail: "Preparing the viewer state for a fresh load.",
    warnings: asset.fallbacks.slice()
  };

  renderAssetButtons();
  renderStatus(asset, latestReport);

  try {
    const result = await harness.loadAsset(asset);

    if (result) {
      latestReport = result;
      renderStatus(asset, latestReport);
    }
  } catch (error) {
    latestReport = {
      state: "error",
      message: asset.label + " failed to load.",
      detail: error && error.message ? error.message : "Unknown loader failure.",
      warnings: asset.fallbacks.slice()
    };
    renderStatus(asset, latestReport);
  }
}

renderAssetButtons();
renderStatus(getAssetById(activeAssetId), {
  state: "loading",
  message: "Preparing the first asset...",
  detail: "Viewer bootstrapping is underway.",
  warnings: getAssetById(activeAssetId).fallbacks.slice()
});
selectAsset(activeAssetId, true);
