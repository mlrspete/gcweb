import {
  buildSiteExperimentUrl,
  defaultSiteExperimentId,
  getSiteExperimentById,
  siteExperimentCatalog
} from "./site-experiments.js";

var QUERY_KEY = "exp";
var switcherEl = document.getElementById("compare-switcher");
var titleEl = document.getElementById("compare-title");
var descriptionEl = document.getElementById("compare-description");
var detailGridEl = document.getElementById("compare-detail-grid");
var hintEl = document.getElementById("compare-hint");
var openLinkEl = document.getElementById("compare-open-link");
var previewHeadingEl = document.getElementById("compare-preview-heading");
var previewFrameEl = document.getElementById("compare-iframe");

var activeExperimentId = getRequestedExperimentId();

renderExperimentButtons();
renderActiveExperiment();

function getRequestedExperimentId() {
  var params = new URLSearchParams(window.location.search);
  var experimentId = params.get(QUERY_KEY);

  return getSiteExperimentById(experimentId) ? experimentId : defaultSiteExperimentId;
}

function createDetailRow(label, value) {
  var row = document.createElement("div");
  var term = document.createElement("dt");
  var description = document.createElement("dd");

  row.className = "compare-detail-row";
  term.textContent = label;
  description.textContent = value;
  row.appendChild(term);
  row.appendChild(description);

  return row;
}

function renderExperimentButtons() {
  switcherEl.textContent = "";

  siteExperimentCatalog.forEach(function (experiment) {
    var button = document.createElement("button");
    var label = document.createElement("span");
    var meta = document.createElement("span");

    button.type = "button";
    button.className = "compare-switcher__button" + (experiment.id === activeExperimentId ? " is-active" : "");
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", experiment.id === activeExperimentId ? "true" : "false");
    button.dataset.experimentId = experiment.id;

    label.className = "compare-switcher__label";
    label.textContent = experiment.label;

    meta.className = "compare-switcher__meta";
    meta.textContent = experiment.navLabel + " / " + experiment.performanceLabel;

    button.appendChild(label);
    button.appendChild(meta);
    button.addEventListener("click", function () {
      selectExperiment(experiment.id);
    });
    switcherEl.appendChild(button);
  });
}

function renderActiveExperiment() {
  var experiment = getSiteExperimentById(activeExperimentId);

  if (!experiment) {
    return;
  }

  titleEl.textContent = experiment.label;
  descriptionEl.textContent = experiment.notes[0];
  detailGridEl.textContent = "";
  detailGridEl.appendChild(createDetailRow("Section", experiment.sectionLabel));
  detailGridEl.appendChild(createDetailRow("Asset", experiment.assetLabel));
  detailGridEl.appendChild(createDetailRow("Motion", experiment.motionLabel));
  detailGridEl.appendChild(createDetailRow("Performance", experiment.performanceLabel));
  hintEl.textContent = experiment.previewHint;
  previewHeadingEl.textContent = experiment.label + " preview";

  var previewUrl = buildSiteExperimentUrl(experiment.id);

  openLinkEl.href = previewUrl;
  previewFrameEl.src = previewUrl;
}

function selectExperiment(experimentId) {
  if (experimentId === activeExperimentId) {
    return;
  }

  activeExperimentId = experimentId;
  renderExperimentButtons();
  renderActiveExperiment();
  updateHistory();
}

function updateHistory() {
  var params = new URLSearchParams(window.location.search);

  params.set(QUERY_KEY, activeExperimentId);
  window.history.replaceState({}, "", window.location.pathname + "?" + params.toString());
}
