import { getAssetById } from "./asset-catalog.js";
import { defaultSiteExperimentId, getSiteExperimentById } from "./site-experiments.js";

var STORAGE_KEY = "grubclub:ambient3d";
var QUERY_KEY = "ambient3d";
var EXPERIMENT_QUERY_KEY = "threeexp";
var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
var desktopWidthQuery = window.matchMedia("(min-width: 961px)");
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

var heroSection = document.querySelector(".hero");
var heroCanvas = document.getElementById("hero-ambient-canvas");
var environmentSection = document.querySelector(".final-cta");
var environmentCanvas = document.getElementById("final-cta-environment-canvas");
var toggleButton = document.querySelector("[data-ambient-3d-toggle]");
var ambientAsset = getAssetById("repair-bench");
var selectedExperiment = getSelectedExperiment();
var activeScene = null;
var pendingStartPromise = null;
var startToken = 0;
var environmentLoadObserver = null;
var environmentEligible = false;

if (toggleButton && ambientAsset && heroSection && environmentSection) {
  initAmbientTreatment();
}

function initAmbientTreatment() {
  document.documentElement.setAttribute("data-threeexp", selectedExperiment.id);
  setHeroState("off");
  setEnvironmentState("off");
  setHeroPose("hidden");
  setEnvironmentPose("hidden");
  updateToggleLabel(resolveAmbientState());

  toggleButton.addEventListener("click", function () {
    var state = resolveAmbientState();

    if (state.reason === "baseline") {
      return;
    }

    if (state.preference === "off") {
      setStoredPreference("on");
    } else {
      setStoredPreference("off");
    }

    reevaluateAmbientTreatment();
  });

  if (typeof reducedMotionQuery.addEventListener === "function") {
    reducedMotionQuery.addEventListener("change", reevaluateAmbientTreatment);
  }

  if (typeof desktopWidthQuery.addEventListener === "function") {
    desktopWidthQuery.addEventListener("change", reevaluateAmbientTreatment);
  }

  if (connection && typeof connection.addEventListener === "function") {
    connection.addEventListener("change", reevaluateAmbientTreatment);
  }

  window.addEventListener("pageshow", reevaluateAmbientTreatment);
  reevaluateAmbientTreatment();
}

function getSelectedExperiment() {
  var params = new URLSearchParams(window.location.search);
  var experimentId = params.get(EXPERIMENT_QUERY_KEY);

  return getSiteExperimentById(experimentId) || getSiteExperimentById(defaultSiteExperimentId);
}

function getQueryPreference() {
  var params = new URLSearchParams(window.location.search);
  var value = params.get(QUERY_KEY);

  if (!value) {
    return null;
  }

  value = value.toLowerCase();

  if (value === "0" || value === "off" || value === "false") {
    return "off";
  }

  if (value === "1" || value === "on" || value === "true" || value === "force") {
    return "force";
  }

  return null;
}

function getStoredPreference() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function setStoredPreference(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch (error) {
    return null;
  }

  return value;
}

function detectAutoBlockReason() {
  if (reducedMotionQuery.matches) {
    return "reduced-motion";
  }

  if (!desktopWidthQuery.matches) {
    return "small-screen";
  }

  if (connection && connection.saveData) {
    return "save-data";
  }

  if (navigator.deviceMemory && navigator.deviceMemory <= 2) {
    return "low-memory";
  }

  return null;
}

function resolveAmbientState() {
  var queryPreference = getQueryPreference();
  var storedPreference = getStoredPreference();
  var preference = queryPreference === "off" ? "off" : (storedPreference || "on");
  var forced = queryPreference === "force";
  var webglReady = supportsWebgl();
  var autoBlockReason = detectAutoBlockReason();

  if (selectedExperiment.id === "baseline") {
    return {
      enabled: false,
      forced: false,
      preference: "off",
      reason: "baseline"
    };
  }

  if (!webglReady) {
    return {
      enabled: false,
      forced: forced,
      preference: preference,
      reason: "no-webgl"
    };
  }

  if (preference === "off") {
    return {
      enabled: false,
      forced: forced,
      preference: preference,
      reason: "user-off"
    };
  }

  if (forced) {
    return {
      enabled: true,
      forced: true,
      preference: "on",
      reason: "forced"
    };
  }

  if (autoBlockReason) {
    return {
      enabled: false,
      forced: false,
      preference: preference,
      reason: autoBlockReason
    };
  }

  return {
    enabled: true,
    forced: false,
    preference: preference,
    reason: "enabled"
  };
}

function getToggleBaseLabel() {
  if (selectedExperiment.id === "hero") {
    return "hero object";
  }

  if (selectedExperiment.id === "hero-scroll") {
    return "hero scroll";
  }

  if (selectedExperiment.id === "environment") {
    return "3D atmosphere";
  }

  return "3D baseline";
}

function updateToggleLabel(state) {
  var label = getToggleBaseLabel() + " off";
  var disabled = false;
  var title = "Toggle the active 3D experiment.";

  if (state.enabled) {
    label = state.forced ? (getToggleBaseLabel() + " forced") : (getToggleBaseLabel() + " on");
  } else if (state.reason === "baseline") {
    label = "3D baseline";
    disabled = true;
    title = "Baseline comparison mode disables all 3D.";
  } else if (state.reason === "small-screen") {
    label = getToggleBaseLabel() + " auto-off";
    disabled = true;
    title = "The active 3D experiment is disabled on smaller screens.";
  } else if (state.reason === "reduced-motion") {
    label = getToggleBaseLabel() + " auto-off";
    disabled = true;
    title = "The active 3D experiment is disabled while reduced motion is enabled.";
  } else if (state.reason === "save-data") {
    label = getToggleBaseLabel() + " auto-off";
    disabled = true;
    title = "The active 3D experiment is disabled while data saver is enabled.";
  } else if (state.reason === "low-memory") {
    label = getToggleBaseLabel() + " auto-off";
    disabled = true;
    title = "The active 3D experiment is disabled on low-memory devices.";
  } else if (state.reason === "no-webgl") {
    label = getToggleBaseLabel() + " unavailable";
    disabled = true;
    title = "WebGL is unavailable in this browser.";
  }

  toggleButton.textContent = label;
  toggleButton.disabled = disabled;
  toggleButton.title = title;
  toggleButton.setAttribute("aria-pressed", state.enabled ? "true" : "false");
}

function setHeroState(stateValue) {
  heroSection.setAttribute("data-ambient-state", stateValue);
}

function setEnvironmentState(stateValue) {
  environmentSection.setAttribute("data-ambient-state", stateValue);
}

function setHeroPose(poseValue) {
  if (!heroCanvas) {
    return;
  }

  heroCanvas.setAttribute("data-scroll-pose", poseValue);
}

function setEnvironmentPose(poseValue) {
  if (!environmentCanvas) {
    return;
  }

  environmentCanvas.setAttribute("data-environment-pose", poseValue);
}

function clearInactiveSections() {
  setHeroState(selectedExperiment.id === "hero" || selectedExperiment.id === "hero-scroll" ? "idle" : "off");
  setEnvironmentState(selectedExperiment.id === "environment" ? "idle" : "off");

  if (selectedExperiment.id !== "hero" && selectedExperiment.id !== "hero-scroll") {
    setHeroPose("hidden");
  }

  if (selectedExperiment.id !== "environment") {
    setEnvironmentPose("hidden");
  }
}

function applyDisabledState(reason) {
  stopEnvironmentLoadObserver();

  if (reason === "baseline") {
    setHeroState("off");
    setEnvironmentState("off");
  } else if (selectedExperiment.id === "environment") {
    setHeroState("off");
    setEnvironmentState(reason === "user-off" ? "off" : "auto-off");
  } else {
    setHeroState(reason === "user-off" ? "off" : "auto-off");
    setEnvironmentState("off");
  }

  setHeroPose("hidden");
  setEnvironmentPose("hidden");
}

function stopEnvironmentLoadObserver() {
  if (!environmentLoadObserver) {
    return;
  }

  environmentLoadObserver.disconnect();
  environmentLoadObserver = null;
}

function isEnvironmentEligibleForLoad() {
  var rect = environmentSection.getBoundingClientRect();
  var viewportHeight = window.innerHeight || 1;

  return rect.top < (viewportHeight * 1.2) && rect.bottom > (viewportHeight * -0.15);
}

function ensureEnvironmentLoadObserver() {
  if (environmentLoadObserver || selectedExperiment.id !== "environment") {
    return;
  }

  environmentLoadObserver = new IntersectionObserver(function (entries) {
    var entry = entries[0];

    if (!entry || !entry.isIntersecting) {
      return;
    }

    environmentEligible = true;
    stopEnvironmentLoadObserver();
    bootActiveScene();
  }, {
    threshold: 0.16,
    rootMargin: "220px 0px"
  });

  environmentLoadObserver.observe(environmentSection);
}

async function reevaluateAmbientTreatment() {
  var state = resolveAmbientState();

  updateToggleLabel(state);

  if (!state.enabled) {
    startToken += 1;
    environmentEligible = false;

    if (activeScene) {
      activeScene.destroy();
      activeScene = null;
    }

    pendingStartPromise = null;
    applyDisabledState(state.reason);
    return;
  }

  clearInactiveSections();

  if (activeScene) {
    activeScene.resume();

    if (selectedExperiment.id === "environment") {
      setEnvironmentState("ready");
    } else {
      setHeroState("ready");
    }

    return;
  }

  if (pendingStartPromise) {
    return;
  }

  if (selectedExperiment.id === "environment") {
    environmentEligible = state.forced || isEnvironmentEligibleForLoad();

    if (!environmentEligible) {
      setEnvironmentState("idle");
      setEnvironmentPose("hidden");
      ensureEnvironmentLoadObserver();
      return;
    }
  } else {
    stopEnvironmentLoadObserver();
  }

  bootActiveScene();
}

function bootActiveScene() {
  var state = resolveAmbientState();

  if (activeScene || pendingStartPromise || !state.enabled) {
    return;
  }

  if (selectedExperiment.id === "environment" && !environmentEligible && !state.forced) {
    return;
  }

  startToken += 1;
  var currentToken = startToken;
  var startPromise;

  if (selectedExperiment.id === "environment") {
    setEnvironmentState("loading");
    setEnvironmentPose("loading");
  } else {
    setHeroState("loading");
    setHeroPose(selectedExperiment.id === "hero-scroll" ? "entry" : "static");
  }

  startPromise = startActiveScene().then(function (sceneInstance) {
    if (currentToken !== startToken || !resolveAmbientState().enabled) {
      sceneInstance.destroy();
      return;
    }

    activeScene = sceneInstance;

    if (selectedExperiment.id === "environment") {
      setEnvironmentState("ready");
    } else {
      setHeroState("ready");
    }
  }).catch(function () {
    if (currentToken === startToken) {
      if (selectedExperiment.id === "environment") {
        setEnvironmentState("error");
        setEnvironmentPose("hidden");
      } else {
        setHeroState("error");
        setHeroPose("hidden");
      }
    }
  }).finally(function () {
    if (pendingStartPromise === startPromise) {
      pendingStartPromise = null;
    }

    if (currentToken === startToken) {
      updateToggleLabel(resolveAmbientState());
    }
  });

  pendingStartPromise = startPromise;
}

function supportsWebgl() {
  try {
    var probe = document.createElement("canvas");

    return !!(window.WebGLRenderingContext && (probe.getContext("webgl") || probe.getContext("experimental-webgl")));
  } catch (error) {
    return false;
  }
}

async function startActiveScene() {
  var modules = await Promise.all([
    import("three"),
    import("three/addons/loaders/FBXLoader.js")
  ]);
  var THREE = modules[0];
  var FBXLoader = modules[1].FBXLoader;

  if (selectedExperiment.id === "environment") {
    return createEnvironmentSceneController(THREE, FBXLoader);
  }

  return createHeroSceneController(THREE, FBXLoader, {
    scrollLinked: selectedExperiment.id === "hero-scroll"
  });
}

function loadBenchModel(THREE, FBXLoader, options) {
  return new Promise(function (resolve, reject) {
    var loader = new FBXLoader();

    loader.load(
      ambientAsset.modelUrl,
      function (object) {
        var runtimeMaterial = new THREE.MeshStandardMaterial({
          color: options.material.color,
          roughness: options.material.roughness,
          metalness: options.material.metalness
        });

        object.traverse(function (child) {
          if (!child.isMesh) {
            return;
          }

          child.castShadow = true;
          child.receiveShadow = false;
          child.material = runtimeMaterial;

          if (!child.geometry.attributes.normal) {
            child.geometry.computeVertexNormals();
          }
        });

        fitAndGroundObject(THREE, object, options.fitSize);

        resolve({
          object: object,
          runtimeMaterial: runtimeMaterial
        });
      },
      undefined,
      reject
    );
  });
}

function fitAndGroundObject(THREE, object, fitSize) {
  var bounds = new THREE.Box3().setFromObject(object);
  var size = bounds.getSize(new THREE.Vector3());
  var center = bounds.getCenter(new THREE.Vector3());
  var maxDimension = Math.max(size.x, size.y, size.z) || 1;
  var scaleFactor = fitSize / maxDimension;

  object.scale.setScalar(scaleFactor);

  bounds = new THREE.Box3().setFromObject(object);
  center = bounds.getCenter(new THREE.Vector3());
  object.position.sub(center);

  bounds = new THREE.Box3().setFromObject(object);
  object.position.y -= bounds.min.y;
}

function createHeroSceneController(THREE, FBXLoader, options) {
  var scrollLinked = !!options.scrollLinked;
  var renderer = new THREE.WebGLRenderer({
    canvas: heroCanvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  var clock = new THREE.Clock();
  var stageRoot = new THREE.Group();
  var rafId = 0;
  var visibilityObserver = null;
  var inView = true;
  var disposed = false;
  var modelRoot = null;
  var runtimeMaterial = null;
  var shadowPlane = null;
  var scrollProgress = 0;
  var currentPoseLabel = "";
  var cameraTarget = new THREE.Vector3();
  var baseCameraPosition = new THREE.Vector3(4.5, 1.65, 6.3);
  var scrolledCameraPosition = new THREE.Vector3(4.02, 1.36, 5.68);
  var baseLookTarget = new THREE.Vector3(0.8, 1, 0);
  var scrolledLookTarget = new THREE.Vector3(0.48, 0.94, 0.14);
  var baseModelPosition = new THREE.Vector3(0.95, 0.06, 0.12);
  var scrolledModelPosition = new THREE.Vector3(0.8, 0.14, 0.01);
  var baseRotation = new THREE.Euler(-0.1, -0.96, 0.04);
  var scrolledRotation = new THREE.Euler(-0.06, -0.7, 0.01);
  var baseShadowPosition = new THREE.Vector3(0.75, 0.01, 0.18);
  var scrolledShadowPosition = new THREE.Vector3(0.66, 0.01, 0.1);

  heroCanvas.setAttribute("data-engine", "three.js r165");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.copy(baseCameraPosition);
  camera.lookAt(baseLookTarget);

  scene.add(new THREE.HemisphereLight(0xf6f2eb, 0x534639, 1.0));

  var keyLight = new THREE.DirectionalLight(0xfff1df, 1.8);
  keyLight.position.set(3.8, 6.6, 5.6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 18;
  keyLight.shadow.camera.left = -4.5;
  keyLight.shadow.camera.right = 4.5;
  keyLight.shadow.camera.top = 4.5;
  keyLight.shadow.camera.bottom = -4.5;
  keyLight.shadow.bias = -0.00018;
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(0xd7ff00, 0.34);
  rimLight.position.set(-3.1, 2.8, -2.4);
  scene.add(rimLight);

  var fillLight = new THREE.DirectionalLight(0xbcc8d9, 0.42);
  fillLight.position.set(-2.6, 2.2, 3.8);
  scene.add(fillLight);

  shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(2.8, 48),
    new THREE.ShadowMaterial({
      color: 0x171111,
      opacity: 0.12
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.copy(baseShadowPosition);
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  scene.add(stageRoot);
  updateSize();

  return loadBenchModel(THREE, FBXLoader, {
    fitSize: 4.15,
    material: {
      color: 0x847566,
      roughness: 0.84,
      metalness: 0.18
    }
  }).then(function (result) {
    modelRoot = result.object;
    runtimeMaterial = result.runtimeMaterial;
    modelRoot.position.copy(baseModelPosition);
    modelRoot.rotation.copy(baseRotation);
    stageRoot.add(modelRoot);
    updateSceneState(0, true);
    renderFrame();
    attachVisibilityTracking();
    window.addEventListener("resize", updateSize);
    document.addEventListener("visibilitychange", syncAnimationState);
    syncAnimationState();

    return {
      resume: syncAnimationState,
      destroy: destroy
    };
  });

  function clamp(value, minValue, maxValue) {
    return Math.min(Math.max(value, minValue), maxValue);
  }

  function mix(startValue, endValue, progress) {
    return startValue + ((endValue - startValue) * progress);
  }

  function easeInOutCubic(value) {
    if (value < 0.5) {
      return 4 * value * value * value;
    }

    return 1 - (Math.pow(-2 * value + 2, 3) / 2);
  }

  function getHeroScrollProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var start = heroSection.offsetTop;
    var span = Math.max(heroSection.offsetHeight * 0.92, (window.innerHeight || 1) * 0.88);

    return clamp((scrollTop - start) / span, 0, 1);
  }

  function getPoseLabel(progress) {
    if (!scrollLinked) {
      return "static";
    }

    if (progress >= 0.74) {
      return "settled";
    }

    if (progress >= 0.18) {
      return "glide";
    }

    return "entry";
  }

  function updatePoseLabel(progress) {
    var nextLabel = getPoseLabel(progress);

    if (currentPoseLabel === nextLabel) {
      return;
    }

    currentPoseLabel = nextLabel;
    setHeroPose(nextLabel);
  }

  function updateSceneState(elapsed, snapProgress) {
    var targetProgress = scrollLinked ? getHeroScrollProgress() : 0;
    var poseProgress;
    var bobAmount;

    if (snapProgress) {
      scrollProgress = targetProgress;
    } else {
      scrollProgress += (targetProgress - scrollProgress) * 0.085;

      if (Math.abs(targetProgress - scrollProgress) < 0.0008) {
        scrollProgress = targetProgress;
      }
    }

    poseProgress = scrollLinked ? easeInOutCubic(clamp(scrollProgress, 0, 1)) : 0;
    bobAmount = Math.sin(elapsed * 0.28) * mix(0.055, 0.026, poseProgress);

    stageRoot.position.y = mix(0.02, -0.02, poseProgress) + bobAmount;

    if (modelRoot) {
      modelRoot.position.set(
        mix(baseModelPosition.x, scrolledModelPosition.x, poseProgress),
        mix(baseModelPosition.y, scrolledModelPosition.y, poseProgress),
        mix(baseModelPosition.z, scrolledModelPosition.z, poseProgress)
      );
      modelRoot.rotation.x = mix(baseRotation.x, scrolledRotation.x, poseProgress) + (Math.sin(elapsed * 0.36) * mix(0.012, 0.006, poseProgress));
      modelRoot.rotation.y = mix(baseRotation.y, scrolledRotation.y, poseProgress) + (Math.sin(elapsed * 0.22) * mix(0.06, 0.022, poseProgress));
      modelRoot.rotation.z = mix(baseRotation.z, scrolledRotation.z, poseProgress);
    }

    shadowPlane.position.set(
      mix(baseShadowPosition.x, scrolledShadowPosition.x, poseProgress),
      baseShadowPosition.y,
      mix(baseShadowPosition.z, scrolledShadowPosition.z, poseProgress)
    );

    camera.position.set(
      mix(baseCameraPosition.x, scrolledCameraPosition.x, poseProgress),
      mix(baseCameraPosition.y, scrolledCameraPosition.y, poseProgress),
      mix(baseCameraPosition.z, scrolledCameraPosition.z, poseProgress)
    );
    cameraTarget.set(
      mix(baseLookTarget.x, scrolledLookTarget.x, poseProgress),
      mix(baseLookTarget.y, scrolledLookTarget.y, poseProgress),
      mix(baseLookTarget.z, scrolledLookTarget.z, poseProgress)
    );
    camera.lookAt(cameraTarget);
    updatePoseLabel(poseProgress);
  }

  function attachVisibilityTracking() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];

      inView = entry ? entry.isIntersecting : true;
      syncAnimationState();
    }, {
      threshold: 0.12
    });

    visibilityObserver.observe(heroSection);
  }

  function updateSize() {
    var shell = heroCanvas.parentElement;
    var width = shell.clientWidth;
    var height = shell.clientHeight;

    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    if (modelRoot) {
      updateSceneState(clock.getElapsedTime(), true);
      renderFrame();
    }
  }

  function shouldAnimate() {
    return !disposed && !!modelRoot && inView && !document.hidden;
  }

  function syncAnimationState() {
    if (!shouldAnimate()) {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      if (modelRoot) {
        updateSceneState(clock.getElapsedTime(), true);
      }

      renderFrame();
      return;
    }

    if (!rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function tick() {
    rafId = 0;

    if (!modelRoot || disposed) {
      return;
    }

    updateSceneState(clock.getElapsedTime(), false);
    renderFrame();

    if (shouldAnimate()) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function renderFrame() {
    renderer.render(scene, camera);
  }

  function destroy() {
    if (disposed) {
      return;
    }

    disposed = true;

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    window.removeEventListener("resize", updateSize);
    document.removeEventListener("visibilitychange", syncAnimationState);

    if (visibilityObserver) {
      visibilityObserver.disconnect();
      visibilityObserver = null;
    }

    if (modelRoot) {
      modelRoot.traverse(function (child) {
        if (child.isMesh) {
          child.geometry.dispose();
        }
      });
    }

    if (runtimeMaterial) {
      runtimeMaterial.dispose();
    }

    if (shadowPlane) {
      shadowPlane.geometry.dispose();
      shadowPlane.material.dispose();
    }

    renderer.dispose();
    renderer.clear();
    heroCanvas.width = 0;
    heroCanvas.height = 0;
    setHeroPose("hidden");
  }
}

function createEnvironmentSceneController(THREE, FBXLoader) {
  var renderer = new THREE.WebGLRenderer({
    canvas: environmentCanvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  var clock = new THREE.Clock();
  var stageRoot = new THREE.Group();
  var rafId = 0;
  var visibilityObserver = null;
  var inView = isEnvironmentVisible();
  var disposed = false;
  var modelRoot = null;
  var runtimeMaterial = null;
  var shadowPlane = null;
  var cameraTarget = new THREE.Vector3();
  var baseCameraPosition = new THREE.Vector3(4.18, 1.86, 5.86);
  var baseLookTarget = new THREE.Vector3(-0.2, 1.02, 0.08);
  var baseModelPosition = new THREE.Vector3(-0.16, 0.02, 0.08);
  var baseRotation = new THREE.Euler(-0.16, 0.72, 0.02);
  var shadowPosition = new THREE.Vector3(-0.28, 0.01, 0.12);

  environmentCanvas.setAttribute("data-engine", "three.js r165");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.copy(baseCameraPosition);
  camera.lookAt(baseLookTarget);

  scene.add(new THREE.HemisphereLight(0xf1ece3, 0x1b1815, 0.86));

  var keyLight = new THREE.DirectionalLight(0xf5e6d6, 1.38);
  keyLight.position.set(4.3, 5.8, 3.6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 18;
  keyLight.shadow.camera.left = -5;
  keyLight.shadow.camera.right = 5;
  keyLight.shadow.camera.top = 4.5;
  keyLight.shadow.camera.bottom = -4.5;
  keyLight.shadow.bias = -0.00018;
  scene.add(keyLight);

  var rimLight = new THREE.DirectionalLight(0x91b08f, 0.26);
  rimLight.position.set(-4.6, 2.3, -3.2);
  scene.add(rimLight);

  var fillLight = new THREE.DirectionalLight(0x8090a2, 0.18);
  fillLight.position.set(1.4, 1.8, -4.2);
  scene.add(fillLight);

  shadowPlane = new THREE.Mesh(
    new THREE.CircleGeometry(3.4, 48),
    new THREE.ShadowMaterial({
      color: 0x050505,
      opacity: 0.18
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.copy(shadowPosition);
  shadowPlane.scale.set(1.55, 0.9, 1);
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  scene.add(stageRoot);
  updateSize();

  return loadBenchModel(THREE, FBXLoader, {
    fitSize: 5.1,
    material: {
      color: 0x565049,
      roughness: 0.94,
      metalness: 0.08
    }
  }).then(function (result) {
    modelRoot = result.object;
    runtimeMaterial = result.runtimeMaterial;
    modelRoot.position.copy(baseModelPosition);
    modelRoot.rotation.copy(baseRotation);
    stageRoot.add(modelRoot);
    setEnvironmentPose("anchored");
    updateSceneState(0);
    renderFrame();
    attachVisibilityTracking();
    window.addEventListener("resize", updateSize);
    document.addEventListener("visibilitychange", syncAnimationState);
    syncAnimationState();

    return {
      resume: syncAnimationState,
      destroy: destroy
    };
  });

  function isEnvironmentVisible() {
    var rect = environmentSection.getBoundingClientRect();
    var viewportHeight = window.innerHeight || 1;

    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  function attachVisibilityTracking() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];

      inView = entry ? entry.isIntersecting : isEnvironmentVisible();
      syncAnimationState();
    }, {
      threshold: 0.16
    });

    visibilityObserver.observe(environmentSection);
  }

  function updateSceneState(elapsed) {
    var sway = Math.sin(elapsed * 0.16);

    stageRoot.position.x = -0.02 + (sway * 0.03);
    stageRoot.position.y = 0.012 + (Math.sin(elapsed * 0.22) * 0.028);

    if (modelRoot) {
      modelRoot.rotation.x = baseRotation.x + (Math.sin(elapsed * 0.24) * 0.008);
      modelRoot.rotation.y = baseRotation.y + (Math.sin(elapsed * 0.18) * 0.026);
      modelRoot.rotation.z = baseRotation.z;
    }

    camera.position.x = baseCameraPosition.x + (sway * 0.06);
    camera.position.y = baseCameraPosition.y + (Math.cos(elapsed * 0.12) * 0.028);
    camera.position.z = baseCameraPosition.z + (Math.cos(elapsed * 0.1) * 0.05);
    cameraTarget.set(
      baseLookTarget.x + (sway * 0.03),
      baseLookTarget.y,
      baseLookTarget.z
    );
    camera.lookAt(cameraTarget);
  }

  function updateSize() {
    var shell = environmentCanvas.parentElement;
    var width = shell.clientWidth;
    var height = shell.clientHeight;

    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

    if (modelRoot) {
      updateSceneState(clock.getElapsedTime());
      renderFrame();
    }
  }

  function shouldAnimate() {
    return !disposed && !!modelRoot && inView && !document.hidden;
  }

  function syncAnimationState() {
    if (!shouldAnimate()) {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      if (modelRoot) {
        updateSceneState(clock.getElapsedTime());
      }

      renderFrame();
      return;
    }

    if (!rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function tick() {
    rafId = 0;

    if (!modelRoot || disposed) {
      return;
    }

    updateSceneState(clock.getElapsedTime());
    renderFrame();

    if (shouldAnimate()) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function renderFrame() {
    renderer.render(scene, camera);
  }

  function destroy() {
    if (disposed) {
      return;
    }

    disposed = true;

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    window.removeEventListener("resize", updateSize);
    document.removeEventListener("visibilitychange", syncAnimationState);

    if (visibilityObserver) {
      visibilityObserver.disconnect();
      visibilityObserver = null;
    }

    if (modelRoot) {
      modelRoot.traverse(function (child) {
        if (child.isMesh) {
          child.geometry.dispose();
        }
      });
    }

    if (runtimeMaterial) {
      runtimeMaterial.dispose();
    }

    if (shadowPlane) {
      shadowPlane.geometry.dispose();
      shadowPlane.material.dispose();
    }

    renderer.dispose();
    renderer.clear();
    environmentCanvas.width = 0;
    environmentCanvas.height = 0;
    setEnvironmentPose("hidden");
  }
}
