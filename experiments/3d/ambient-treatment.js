import { getAssetById } from "./asset-catalog.js";

var STORAGE_KEY = "grubclub:ambient3d";
var QUERY_KEY = "ambient3d";
var reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
var desktopWidthQuery = window.matchMedia("(min-width: 961px)");
var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || null;

var hero = document.querySelector(".hero");
var canvas = document.getElementById("hero-ambient-canvas");
var toggleButton = document.querySelector("[data-ambient-3d-toggle]");
var ambientAsset = getAssetById("repair-bench");
var activeScene = null;
var pendingStartPromise = null;
var startToken = 0;

if (hero && canvas && toggleButton && ambientAsset) {
  initAmbientTreatment();
}

function initAmbientTreatment() {
  hero.setAttribute("data-ambient-state", "off");
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
  var label = "ambient 3D off";
  var disabled = false;
  var title = "Toggle the ambient hero object.";

  if (state.enabled) {
    label = state.forced ? "ambient 3D forced" : "ambient 3D on";
  } else if (state.reason === "small-screen") {
    label = "ambient 3D auto-off";
    disabled = true;
    title = "Ambient 3D is disabled on smaller screens.";
  } else if (state.reason === "reduced-motion") {
    label = "ambient 3D auto-off";
    disabled = true;
    title = "Ambient 3D is disabled while reduced motion is enabled.";
  } else if (state.reason === "save-data") {
    label = "ambient 3D auto-off";
    disabled = true;
    title = "Ambient 3D is disabled while data saver is enabled.";
  } else if (state.reason === "low-memory") {
    label = "ambient 3D auto-off";
    disabled = true;
    title = "Ambient 3D is disabled on low-memory devices.";
  } else if (state.reason === "no-webgl") {
    label = "ambient 3D unavailable";
    disabled = true;
    title = "WebGL is unavailable in this browser.";
  }

  toggleButton.textContent = label;
  toggleButton.disabled = disabled;
  toggleButton.title = title;
  toggleButton.setAttribute("aria-pressed", state.enabled ? "true" : "false");
}

function setHeroState(stateValue) {
  hero.setAttribute("data-ambient-state", stateValue);
}

async function reevaluateAmbientTreatment() {
  var state = resolveAmbientState();

  updateToggleLabel(state);

  if (!state.enabled) {
    startToken += 1;

    if (activeScene) {
      activeScene.destroy();
      activeScene = null;
    }

    pendingStartPromise = null;
    setHeroState(state.reason === "user-off" ? "off" : "auto-off");
    return;
  }

  if (activeScene) {
    activeScene.resume();
    setHeroState("ready");
    return;
  }

  if (pendingStartPromise) {
    return;
  }

  startToken += 1;
  var currentToken = startToken;
  var startPromise;

  setHeroState("loading");
  startPromise = startAmbientScene().then(function (sceneInstance) {
    if (currentToken !== startToken || !resolveAmbientState().enabled) {
      sceneInstance.destroy();
      return;
    }

    activeScene = sceneInstance;
    setHeroState("ready");
  }).catch(function () {
    if (currentToken === startToken) {
      setHeroState("error");
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

  return createAmbientSceneController(THREE, FBXLoader);
}

function createAmbientSceneController(THREE, FBXLoader) {
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
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
  var shadowPlane = null;

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  camera.position.set(4.5, 1.65, 6.3);
  camera.lookAt(0.8, 1, 0);

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
  shadowPlane.position.set(0.75, 0.01, 0.18);
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  scene.add(stageRoot);
  updateSize();

  return loadBench().then(function () {
    attachVisibilityTracking();
    window.addEventListener("resize", updateSize);
    document.addEventListener("visibilitychange", syncAnimationState);
    syncAnimationState();

    return {
      resume: syncAnimationState,
      destroy: destroy
    };
  });

  function loadBench() {
    return new Promise(function (resolve, reject) {
      var loader = new FBXLoader();

      loader.load(
        ambientAsset.modelUrl,
        function (object) {
          var material = new THREE.MeshStandardMaterial({
            color: 0x847566,
            roughness: 0.84,
            metalness: 0.18
          });
          var bounds;
          var size;
          var center;
          var maxDimension;
          var scaleFactor;

          object.traverse(function (child) {
            if (!child.isMesh) {
              return;
            }

            child.castShadow = true;
            child.receiveShadow = false;
            child.material = material;

            if (!child.geometry.attributes.normal) {
              child.geometry.computeVertexNormals();
            }
          });

          bounds = new THREE.Box3().setFromObject(object);
          size = bounds.getSize(new THREE.Vector3());
          center = bounds.getCenter(new THREE.Vector3());
          maxDimension = Math.max(size.x, size.y, size.z) || 1;
          scaleFactor = 4.15 / maxDimension;

          object.scale.setScalar(scaleFactor);

          bounds = new THREE.Box3().setFromObject(object);
          center = bounds.getCenter(new THREE.Vector3());
          object.position.sub(center);

          bounds = new THREE.Box3().setFromObject(object);
          object.position.y -= bounds.min.y;
          object.position.set(0.95, 0.06, 0.12);
          object.rotation.set(-0.1, -0.96, 0.04);

          modelRoot = object;
          stageRoot.add(object);
          renderFrame();
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

      inView = entry ? entry.isIntersecting : true;
      syncAnimationState();
    }, {
      threshold: 0.12
    });

    visibilityObserver.observe(hero);
  }

  function updateSize() {
    var shell = canvas.parentElement;
    var width = shell.clientWidth;
    var height = shell.clientHeight;

    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function shouldAnimate() {
    return !disposed && !!modelRoot && inView && !document.hidden && resolveAmbientState().enabled;
  }

  function syncAnimationState() {
    if (!shouldAnimate()) {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      renderFrame();
      return;
    }

    if (!rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function tick() {
    var elapsed = clock.getElapsedTime();

    rafId = 0;

    if (!modelRoot || disposed) {
      return;
    }

    stageRoot.position.y = 0.02 + Math.sin(elapsed * 0.28) * 0.055;
    modelRoot.rotation.y = -0.96 + Math.sin(elapsed * 0.22) * 0.06;
    modelRoot.rotation.x = -0.1 + Math.sin(elapsed * 0.36) * 0.012;
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

          if (child.material) {
            child.material.dispose();
          }
        }
      });
    }

    if (shadowPlane) {
      shadowPlane.geometry.dispose();
      shadowPlane.material.dispose();
    }

    renderer.dispose();
    renderer.clear();
    canvas.width = 0;
    canvas.height = 0;
  }
}
