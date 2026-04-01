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
    label: "Translation Chamber",
    navLabel: "Chamber",
    sectionLabel: "Hero",
    assetLabel: "Abstract input -> Rust output",
    motionLabel: "Authored chamber cycle",
    performanceLabel: "Good",
    previewHint: "Core homepage scene with authored input/output motion and the slab translation surface.",
    notes: [
      "Uses curated abstract forms on the input side and Rust-native assets on the receiving side.",
      "Designed as the default public hero rather than a comparison-only ornament."
    ],
    previewParams: {
      threeexp: "hero",
      ambient3d: "force",
      focus: "top"
    }
  },
  {
    id: "hero-scroll",
    label: "Chamber Reframe",
    navLabel: "Chamber scroll",
    sectionLabel: "Hero",
    assetLabel: "Abstract input -> Rust output",
    motionLabel: "Scroll-biased chamber",
    performanceLabel: "Okay",
    previewHint: "Scroll inside the preview to feel the chamber camera bias. This remains the most motion-forward branch.",
    notes: [
      "Adds a restrained reframe to the chamber rather than replacing the authored loop.",
      "Useful for judging whether scroll response adds polish or unnecessary theatricality."
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
    sectionLabel: "Conversation stage",
    assetLabel: "Repair bench",
    motionLabel: "Low-motion atmosphere",
    performanceLabel: "Best 3D balance",
    previewHint: "Opens at the conversation stage so the environmental fragment is visible immediately.",
    notes: [
      "Uses the Rust object as world-building rather than a hero display piece.",
      "Most production-friendly direction for a premium landing page."
    ],
    previewParams: {
      threeexp: "environment",
      ambient3d: "force",
      focus: "conversation"
    }
  }
];

export var defaultSiteExperimentId = "hero";

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
