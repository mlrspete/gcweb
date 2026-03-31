import { getAssetById } from "./asset-catalog.js";

var STORAGE_KEY = "grubclub:ambient3d";
var QUERY_KEY = "ambient3d";
var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
var desktopWidthQuery = window.matchMedia("(min-width: 961px)");
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

var section = document.querySelector(".final-cta");
var canvas = document.getElementById("final-cta-environment-canvas");
var toggleButton = document.querySelector("[data-ambient-3d-toggle]");
var ambientAsset = getAssetById("repair-bench");
var activeScene = null;
var pendingStartPromise = null;
var startToken = 0;
var loadObserver = null;
var sectionEligible = false;

if (section && canvas && toggleButton && ambientAsset) {
  initAmbientTreatment();
}

function initAmbientTreatment() {
  setSectionState("off");
  canvas.setAttribute("data-environment-pose", "hidden");
  updateToggleLabel(resolveAmbientState());

  toggleButton.addEventListener("click", function () {
    var state = resolveAmbientState();

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

function updateToggleLabel(state) {
  var label = "3D atmosphere off";
  var disabled = false;
  var title = "Toggle the environmental 3D section treatment.";

  if (state.enabled) {
    label = state.forced ? "3D atmosphere forced" : "3D atmosphere on";
  } else if (state.reason === "small-screen") {
    label = "3D atmosphere auto-off";
    disabled = true;
    title = "Environmental 3D is disabled on smaller screens.";
  } else if (state.reason === "reduced-motion") {
    label = "3D atmosphere auto-off";
    disabled = true;
    title = "Environmental 3D is disabled while reduced motion is enabled.";
  } else if (state.reason === "save-data") {
    label = "3D atmosphere auto-off";
    disabled = true;
    title = "Environmental 3D is disabled while data saver is enabled.";
  } else if (state.reason === "low-memory") {
    label = "3D atmosphere auto-off";
    disabled = true;
    title = "Environmental 3D is disabled on low-memory devices.";
  } else if (state.reason === "no-webgl") {
    label = "3D atmosphere unavailable";
    disabled = true;
    title = "WebGL is unavailable in this browser.";
  }

  toggleButton.textContent = label;
  toggleButton.disabled = disabled;
  toggleButton.title = title;
  toggleButton.setAttribute("aria-pressed", state.enabled ? "true" : "false");
}

function setSectionState(stateValue) {
  section.setAttribute("data-ambient-state", stateValue);
}

function stopLoadObserver() {
  if (!loadObserver) {
    return;
  }

  loadObserver.disconnect();
  loadObserver = null;
}

function isSectionEligibleForLoad() {
  var rect = section.getBoundingClientRect();
  var viewportHeight = window.innerHeight || 1;

  return rect.top < (viewportHeight * 1.2) && rect.bottom > (viewportHeight * -0.15);
}

function ensureLoadObserver() {
  if (loadObserver) {
    return;
  }

  loadObserver = new IntersectionObserver(function (entries) {
    var entry = entries[0];

    if (!entry || !entry.isIntersecting) {
      return;
    }

    sectionEligible = true;
    stopLoadObserver();
    bootAmbientScene();
  }, {
    threshold: 0.16,
    rootMargin: "220px 0px"
  });

  loadObserver.observe(section);
}

async function reevaluateAmbientTreatment() {
  var state = resolveAmbientState();

  updateToggleLabel(state);

  if (!state.enabled) {
    startToken += 1;
    sectionEligible = false;
    stopLoadObserver();

    if (activeScene) {
      activeScene.destroy();
      activeScene = null;
    }

    pendingStartPromise = null;
    setSectionState(state.reason === "user-off" ? "off" : "auto-off");
    canvas.setAttribute("data-environment-pose", "hidden");
    return;
  }

  if (activeScene) {
    activeScene.resume();
    setSectionState("ready");
    return;
  }

  if (pendingStartPromise) {
    return;
  }

  sectionEligible = state.forced || isSectionEligibleForLoad();

  if (!sectionEligible) {
    setSectionState("idle");
    ensureLoadObserver();
    return;
  }

  bootAmbientScene();
}

function bootAmbientScene() {
  if (activeScene || pendingStartPromise || !sectionEligible || !resolveAmbientState().enabled) {
    return;
  }

  startToken += 1;
  var currentToken = startToken;
  var startPromise;

  setSectionState("loading");
  canvas.setAttribute("data-environment-pose", "loading");

  startPromise = startAmbientScene().then(function (sceneInstance) {
    if (currentToken !== startToken || !resolveAmbientState().enabled) {
      sceneInstance.destroy();
      return;
    }

    activeScene = sceneInstance;
    setSectionState("ready");
  }).catch(function () {
    if (currentToken === startToken) {
      setSectionState("error");
      canvas.setAttribute("data-environment-pose", "hidden");
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

async function startAmbientScene() {
  var modules = await Promise.all([
    import("three"),
    import("three/addons/loaders/FBXLoader.js")
  ]);
  var THREE = modules[0];
  var FBXLoader = modules[1].FBXLoader;

  return createEnvironmentSceneController(THREE, FBXLoader);
}

function createEnvironmentSceneController(THREE, FBXLoader) {
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
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
  var inView = isSectionVisible();
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

  return loadBench().then(function () {
    canvas.setAttribute("data-environment-pose", "anchored");
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

  function isSectionVisible() {
    var rect = section.getBoundingClientRect();
    var viewportHeight = window.innerHeight || 1;

    return rect.bottom > 0 && rect.top < viewportHeight;
  }

  function loadBench() {
    return new Promise(function (resolve, reject) {
      var loader = new FBXLoader();

      loader.load(
        ambientAsset.modelUrl,
        function (object) {
          var bounds;
          var size;
          var center;
          var maxDimension;
          var scaleFactor;

          runtimeMaterial = new THREE.MeshStandardMaterial({
            color: 0x565049,
            roughness: 0.94,
            metalness: 0.08
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

          bounds = new THREE.Box3().setFromObject(object);
          size = bounds.getSize(new THREE.Vector3());
          center = bounds.getCenter(new THREE.Vector3());
          maxDimension = Math.max(size.x, size.y, size.z) || 1;
          scaleFactor = 5.1 / maxDimension;

          object.scale.setScalar(scaleFactor);

          bounds = new THREE.Box3().setFromObject(object);
          center = bounds.getCenter(new THREE.Vector3());
          object.position.sub(center);

          bounds = new THREE.Box3().setFromObject(object);
          object.position.y -= bounds.min.y;
          object.position.copy(baseModelPosition);
          object.rotation.copy(baseRotation);

          modelRoot = object;
          stageRoot.add(object);
          resolve();
        },
        undefined,
        reject
      );
    });
  }

  function attachVisibilityTracking() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];

      inView = entry ? entry.isIntersecting : isSectionVisible();
      syncAnimationState();
    }, {
      threshold: 0.16
    });

    visibilityObserver.observe(section);
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
    var shell = canvas.parentElement;
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
    canvas.width = 0;
    canvas.height = 0;
    canvas.setAttribute("data-environment-pose", "hidden");
  }
}
