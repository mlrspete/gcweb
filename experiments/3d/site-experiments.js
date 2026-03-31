function buildQueryString(params) {
  var searchParams = new URLSearchParams();

  Object.keys(params).forEach(function (key) {
    if (params[key] == null || params[key] === "") {
      return;
    }

    searchParams.set(key, params[key]);
  });

  return searchParams.toString();
}

export var siteExperimentCatalog = [
  {
    id: "baseline",
    label: "Baseline",
    navLabel: "No 3D",
    sectionLabel: "Full page",
    assetLabel: "None",
    motionLabel: "None",
    performanceLabel: "Best",
    previewHint: "Pure control case. Use this to judge whether 3D is helping at all.",
    notes: [
      "No 3D runtime or asset loading.",
      "Best baseline for readability and performance comparison."
    ],
    previewParams: {
      threeexp: "baseline",
      focus: "top"
    }
  },
  {
    id: "hero",
    label: "Ambient Object",
    navLabel: "Hero ambient",
    sectionLabel: "Hero",
    assetLabel: "Repair bench",
    motionLabel: "Subtle idle float",
    performanceLabel: "Good",
    previewHint: "Best for judging whether a sculptural hero object feels premium or distracting.",
    notes: [
      "Presents the Rust object as a display piece beside the main copy.",
      "Strongest if the product needs a more explicit game-native signal."
    ],
    previewParams: {
      threeexp: "hero",
      ambient3d: "force",
      focus: "top"
    }
  },
  {
    id: "hero-scroll",
    label: "Scroll Linked",
    navLabel: "Hero scroll",
    sectionLabel: "Hero",
    assetLabel: "Repair bench",
    motionLabel: "Scroll reframe",
    performanceLabel: "Okay",
    previewHint: "Scroll inside the preview to feel the reframe. This is the most motion-forward branch.",
    notes: [
      "Adds camera and pose changes as the hero scrolls.",
      "Useful for evaluating polish, but easiest to tip into unnecessary theatrics."
    ],
    previewParams: {
      threeexp: "hero-scroll",
      ambient3d: "force",
      focus: "top"
    }
  },
  {
    id: "environment",
    label: "Environmental",
    navLabel: "Environmental",
    sectionLabel: "Final CTA",
    assetLabel: "Repair bench",
    motionLabel: "Low-motion atmosphere",
    performanceLabel: "Best 3D balance",
    previewHint: "Opens at the waitlist section so the environmental fragment is visible immediately.",
    notes: [
      "Uses the Rust object as world-building rather than a hero display piece.",
      "Most production-friendly direction for a premium landing page."
    ],
    previewParams: {
      threeexp: "environment",
      ambient3d: "force",
      focus: "waitlist"
    }
  }
];

export var defaultSiteExperimentId = "environment";

export function getSiteExperimentById(experimentId) {
  return siteExperimentCatalog.find(function (experiment) {
    return experiment.id === experimentId;
  });
}

export function buildSiteExperimentUrl(experimentId) {
  var experiment = getSiteExperimentById(experimentId) || getSiteExperimentById(defaultSiteExperimentId);
  var queryString = buildQueryString(experiment.previewParams);

  return "../../index.html" + (queryString ? "?" + queryString : "");
}
