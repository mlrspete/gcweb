function assetUrl(path) {
  return new URL(path, import.meta.url).href;
}

var TEXT_BAND_FRAGMENTS = [
  "REALRUST //",
  "BELONG IN RUST //",
  "NATIVE FEEL //",
  "IN-WORLD //"
];

var ASSET_DEFINITIONS = {
  garageFrame: {
    id: "garageFrame",
    url: assetUrl("../../rust obj items/wall.frame.garagedoor.obj"),
    fitSize: 2.7,
    material: {
      color: 0x657484,
      emissive: 0x081019,
      metalness: 0.72,
      roughness: 0.42
    }
  },
  vending: {
    id: "vending",
    url: assetUrl("../../rust obj items/vending.machine_vendingmachine.obj"),
    fitSize: 2.35,
    material: {
      color: 0xb6c5d4,
      emissive: 0x0a1220,
      metalness: 0.88,
      roughness: 0.26
    }
  },
  boxLarge: {
    id: "boxLarge",
    url: assetUrl("../../rust obj items/box.wooden.large.obj"),
    fitSize: 1.8,
    material: {
      color: 0x655c54,
      emissive: 0x06080b,
      metalness: 0.08,
      roughness: 0.92
    }
  },
  rug: {
    id: "rug",
    url: assetUrl("../../rust obj items/rug.obj"),
    fitSize: 1.95,
    material: {
      color: 0x48515a,
      emissive: 0x05070a,
      metalness: 0.04,
      roughness: 0.98
    }
  },
  fridge: {
    id: "fridge",
    url: assetUrl("../../rust obj items/fridge.obj"),
    fitSize: 2.28,
    material: {
      color: 0xadb8c4,
      emissive: 0x081019,
      metalness: 0.74,
      roughness: 0.28
    }
  },
  furnace: {
    id: "furnace",
    url: assetUrl("../../rust obj items/furnace.obj"),
    fitSize: 2.08,
    material: {
      color: 0x6d7883,
      emissive: 0x081019,
      metalness: 0.64,
      roughness: 0.48
    }
  },
  bbq: {
    id: "bbq",
    url: assetUrl("../../rust obj items/bbq.obj"),
    fitSize: 2.06,
    material: {
      color: 0x9eabb8,
      emissive: 0x081019,
      metalness: 0.66,
      roughness: 0.34
    }
  },
  table: {
    id: "table",
    url: assetUrl("../../rust obj items/table.obj"),
    fitSize: 2.2,
    material: {
      color: 0x6d665d,
      emissive: 0x07090c,
      metalness: 0.12,
      roughness: 0.86
    }
  }
};

var FLOW_MAPPINGS = [
  {
    id: "smoked-monolith",
    outputIds: ["vending"],
    abstractScale: [0.58, 1.24, 0.42],
    materialType: "smoked"
  },
  {
    id: "chrome-sphere",
    outputIds: ["boxLarge", "rug"],
    abstractScale: [0.58, 0.58, 0.58],
    materialType: "chrome"
  },
  {
    id: "frosted-capsule",
    outputIds: ["bbq", "table"],
    abstractScale: [0.48, 0.94, 0.48],
    materialType: "frosted"
  },
  {
    id: "dark-cuboid",
    outputIds: ["fridge", "furnace"],
    abstractScale: [0.88, 0.64, 0.54],
    materialType: "ceramic"
  }
];

function clamp(value, minValue, maxValue) {
  return Math.min(Math.max(value, minValue), maxValue);
}

function lerp(startValue, endValue, progress) {
  return startValue + ((endValue - startValue) * progress);
}

function easeInQuad(value) {
  return value * value;
}

function easeOutCubic(value) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutCubic(value) {
  if (value < 0.5) {
    return 4 * value * value * value;
  }

  return 1 - (Math.pow(-2 * value + 2, 3) / 2);
}

function rangeProgress(value, start, end) {
  return clamp((value - start) / Math.max(end - start, 0.0001), 0, 1);
}

function getStageMotionState() {
  return window.REAL_RUST_STAGE_MOTION || null;
}

function createBandTexture() {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var width = 1024;
  var height = 128;
  var i;
  var x = 44;

  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "rgba(5, 7, 10, 0)";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(242, 245, 247, 0.08)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, 16.5);
  context.lineTo(width, 16.5);
  context.moveTo(0, height - 16.5);
  context.lineTo(width, height - 16.5);
  context.stroke();
  context.shadowBlur = 16;
  context.shadowColor = "rgba(124, 184, 255, 0.22)";
  context.fillStyle = "rgba(216, 224, 231, 0.42)";
  context.font = "500 34px 'IBM Plex Mono', monospace";
  context.textBaseline = "middle";

  for (i = 0; i < 18; i += 1) {
    context.fillText(TEXT_BAND_FRAGMENTS[i % TEXT_BAND_FRAGMENTS.length], x, height / 2);
    x += 196;
  }

  return canvas;
}

function createRadialTexture(stops) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var gradient;
  var i;

  canvas.width = 256;
  canvas.height = 256;
  gradient = context.createRadialGradient(128, 128, 12, 128, 128, 120);

  for (i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(stops[i][0], stops[i][1]);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  return canvas;
}

function createLinearTexture(stops) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var gradient;
  var i;

  canvas.width = 256;
  canvas.height = 64;
  gradient = context.createLinearGradient(0, 32, 256, 32);

  for (i = 0; i < stops.length; i += 1) {
    gradient.addColorStop(stops[i][0], stops[i][1]);
  }

  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 64);

  return canvas;
}

function createAssetMaterial(THREE, config) {
  return new THREE.MeshStandardMaterial({
    color: config.color,
    emissive: config.emissive,
    emissiveIntensity: 0.2,
    metalness: config.metalness,
    roughness: config.roughness,
    transparent: true,
    opacity: 1
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

function loadAssetTemplate(THREE, OBJLoader, definition) {
  return new Promise(function (resolve, reject) {
    var loader = new OBJLoader();

    loader.load(definition.url, function (object) {
      var material = createAssetMaterial(THREE, definition.material);

      if (definition.id === "rug") {
        material.side = THREE.DoubleSide;
      }

      object.traverse(function (child) {
        if (!child.isMesh) {
          return;
        }

        if (!child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }

        child.material = material;
      });

      fitAndGroundObject(THREE, object, definition.fitSize);

      resolve({
        id: definition.id,
        root: object,
        material: material
      });
    }, undefined, reject);
  });
}

function cloneTemplateInstance(template) {
  var clone = template.root.clone(true);
  var materials = [];

  clone.traverse(function (child) {
    if (!child.isMesh) {
      return;
    }

    child.material = child.material.clone();
    child.userData.baseOpacity = child.material.opacity;
    materials.push(child.material);
  });

  return {
    root: clone,
    dispose: function () {
      materials.forEach(function (material) {
        material.dispose();
      });
    }
  };
}

function disposeTemplate(template) {
  template.root.traverse(function (child) {
    if (!child.isMesh) {
      return;
    }

    child.geometry.dispose();
  });

  template.material.dispose();
}

function setGroupOpacity(group, opacity) {
  group.traverse(function (child) {
    var baseOpacity;

    if (!child.isMesh || !child.material) {
      return;
    }

    baseOpacity = child.userData.baseOpacity != null ? child.userData.baseOpacity : 1;
    child.material.transparent = opacity < 0.999 || baseOpacity < 0.999;
    child.material.opacity = baseOpacity * opacity;
  });
}

function getProfile(width) {
  if (width <= 767) {
    return {
      id: "mobile",
      orientation: "horizontal",
      maxCycles: 2,
      slabSize: [4.2, 1.04, 0.26],
      slabPosition: [0, 0.72, 0],
      cameraPosition: [0.12, 0.88, 7.15],
      cameraTarget: [0, -0.18, 0],
      fov: 35
    };
  }

  if (width <= 1100) {
    return {
      id: "tablet",
      orientation: "vertical",
      maxCycles: 2,
      slabSize: [1.08, 4.28, 0.26],
      slabPosition: [0.92, 0.12, 0],
      cameraPosition: [0.34, 0.6, 7.65],
      cameraTarget: [0.16, 0.08, 0],
      fov: 33
    };
  }

  return {
    id: "desktop",
    orientation: "vertical",
    maxCycles: 3,
    slabSize: [1.14, 4.9, 0.28],
    slabPosition: [1.06, 0.18, 0],
    cameraPosition: [0.48, 0.66, 8.1],
    cameraTarget: [0.18, 0.1, 0],
    fov: 31
  };
}

export function createTranslationChamberController(config) {
  var THREE = config.THREE;
  var OBJLoader = config.OBJLoader;
  var RoomEnvironment = config.RoomEnvironment;
  var RoundedBoxGeometry = config.RoundedBoxGeometry;
  var canvas = config.canvas;
  var section = config.section;
  var setPose = config.setPose || function () {};
  var scrollLinked = !!config.scrollLinked;
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power"
  });
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(31, 1, 0.1, 42);
  var clock = new THREE.Clock();
  var root = new THREE.Group();
  var slabGroup = new THREE.Group();
  var anchorGroup = new THREE.Group();
  var atmosphereGroup = new THREE.Group();
  var inputGroup = new THREE.Group();
  var outputGroup = new THREE.Group();
  var pointerTarget = new THREE.Vector2();
  var pointerCurrent = new THREE.Vector2();
  var rafId = 0;
  var disposed = false;
  var inView = true;
  var visibilityObserver = null;
  var roomEnvironment = null;
  var pmremGenerator = null;
  var environmentTarget = null;
  var bandTexture = null;
  var bandTextureTwo = null;
  var glowTexture = null;
  var fogTexture = null;
  var sheenTexture = null;
  var atmosphereTexture = null;
  var slabBody = null;
  var slabEdge = null;
  var slabCore = null;
  var slabSheen = null;
  var bandOne = null;
  var bandTwo = null;
  var slabLight = null;
  var receiveLight = null;
  var inputHalo = null;
  var receiveFog = null;
  var ridge = null;
  var garageAnchor = null;
  var vendingAnchor = null;
  var boxAnchor = null;
  var assetTemplates = {};
  var activeCycles = [];
  var nextSpawnAt = 0;
  var cycleCursor = 0;
  var profile = getProfile(window.innerWidth || canvas.clientWidth || 1280);

  canvas.setAttribute("data-engine", "three.js r165");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.id === "mobile" ? 1.2 : 1.35));

  scene.fog = new THREE.FogExp2(0x05070a, 0.085);
  scene.add(root);
  root.add(atmosphereGroup);
  root.add(anchorGroup);
  root.add(slabGroup);
  root.add(inputGroup);
  root.add(outputGroup);

  setupLighting();
  createStaticScene();

  return Promise.all(
    Object.keys(ASSET_DEFINITIONS).map(function (key) {
      return loadAssetTemplate(THREE, OBJLoader, ASSET_DEFINITIONS[key]);
    })
  ).then(function (records) {
    records.forEach(function (record) {
      assetTemplates[record.id] = record;
    });

    buildAnchors();
    applyProfile(true);
    updateSize();
    renderFrame();
    attachInteraction();
    attachVisibilityTracking();
    window.addEventListener("resize", updateSize);
    document.addEventListener("visibilitychange", syncAnimationState);
    syncAnimationState();

    return {
      resume: syncAnimationState,
      destroy: destroy
    };
  });

  function setupLighting() {
    var keyLight = new THREE.DirectionalLight(0xf8fbff, 2.4);
    var rimLight = new THREE.DirectionalLight(0x7cb8ff, 1.16);
    var fillLight = new THREE.DirectionalLight(0x447fd1, 0.72);
    var hemiLight = new THREE.HemisphereLight(0xf6faff, 0x081018, 0.98);

    roomEnvironment = new RoomEnvironment(renderer);
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.045);

    scene.environment = environmentTarget.texture;
    scene.add(hemiLight);

    keyLight.position.set(4.4, 5.4, 5.6);
    rimLight.position.set(-4.8, 2.2, 2.2);
    fillLight.position.set(3.8, 1.1, -4.4);

    scene.add(keyLight);
    scene.add(rimLight);
    scene.add(fillLight);

    slabLight = new THREE.PointLight(0xcfe6ff, 1.45, 11.5, 2);
    receiveLight = new THREE.PointLight(0x7cb8ff, 0.7, 14, 2);
    scene.add(slabLight);
    scene.add(receiveLight);
  }

  function createStaticScene() {
    var slabBodyMaterial;
    var slabEdgeMaterial;
    var slabCoreMaterial;
    var sheenMaterial;
    var bandMaterialOne;
    var bandMaterialTwo;
    var haloMaterial;
    var fogMaterial;
    var ridgeMaterial;

    bandTexture = new THREE.CanvasTexture(createBandTexture());
    bandTexture.colorSpace = THREE.SRGBColorSpace;
    bandTexture.wrapS = THREE.RepeatWrapping;
    bandTexture.wrapT = THREE.ClampToEdgeWrapping;
    bandTexture.repeat.set(1.28, 1);
    bandTextureTwo = bandTexture.clone();
    bandTextureTwo.colorSpace = THREE.SRGBColorSpace;
    bandTextureTwo.wrapS = THREE.RepeatWrapping;
    bandTextureTwo.wrapT = THREE.ClampToEdgeWrapping;
    bandTextureTwo.repeat.set(1.18, 1);

    glowTexture = new THREE.CanvasTexture(createRadialTexture([
      [0, "rgba(207, 230, 255, 0.9)"],
      [0.26, "rgba(124, 184, 255, 0.34)"],
      [0.68, "rgba(68, 127, 209, 0.06)"],
      [1, "rgba(5, 7, 10, 0)"]
    ]));
    glowTexture.colorSpace = THREE.SRGBColorSpace;

    fogTexture = new THREE.CanvasTexture(createRadialTexture([
      [0, "rgba(216, 224, 231, 0.44)"],
      [0.52, "rgba(124, 184, 255, 0.1)"],
      [1, "rgba(5, 7, 10, 0)"]
    ]));
    fogTexture.colorSpace = THREE.SRGBColorSpace;

    sheenTexture = new THREE.CanvasTexture(createLinearTexture([
      [0, "rgba(247, 251, 255, 0)"],
      [0.42, "rgba(247, 251, 255, 0.02)"],
      [0.5, "rgba(247, 251, 255, 0.24)"],
      [0.58, "rgba(207, 230, 255, 0.08)"],
      [1, "rgba(247, 251, 255, 0)"]
    ]));
    sheenTexture.colorSpace = THREE.SRGBColorSpace;

    slabBodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaebccc,
      metalness: 0.42,
      roughness: 0.18,
      transparent: true,
      opacity: 0.18,
      transmission: 0.44,
      thickness: 0.82,
      clearcoat: 1,
      clearcoatRoughness: 0.18,
      ior: 1.12,
      envMapIntensity: 1.26
    });
    slabEdgeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf7fbff,
      emissive: 0x0d1420,
      emissiveIntensity: 0.18,
      metalness: 0.82,
      roughness: 0.16,
      transparent: true,
      opacity: 0.78,
      envMapIntensity: 1.34
    });
    slabCoreMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: 0xcfe6ff,
      transparent: true,
      opacity: 0.44,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    sheenMaterial = new THREE.MeshBasicMaterial({
      map: sheenTexture,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    bandMaterialOne = new THREE.MeshBasicMaterial({
      map: bandTexture,
      transparent: true,
      opacity: 0.25,
      depthWrite: false
    });
    bandMaterialTwo = bandMaterialOne.clone();
    bandMaterialTwo.map = bandTextureTwo;
    bandMaterialTwo.opacity = 0.18;
    haloMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    fogMaterial = new THREE.MeshBasicMaterial({
      map: fogTexture,
      transparent: true,
      opacity: 0.22,
      depthWrite: false
    });
    ridgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x111822,
      emissive: 0x070b10,
      emissiveIntensity: 0.15,
      metalness: 0.18,
      roughness: 0.88
    });

    slabBody = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 8, 0.12), slabBodyMaterial);
    slabEdge = new THREE.Mesh(new RoundedBoxGeometry(1.04, 1.04, 1.02, 8, 0.12), slabEdgeMaterial);
    slabCore = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), slabCoreMaterial);
    slabSheen = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 1, 1, 1), sheenMaterial);
    bandOne = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.14, 1, 1), bandMaterialOne);
    bandTwo = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.14, 1, 1), bandMaterialTwo);
    inputHalo = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.2, 1, 1), haloMaterial);
    receiveFog = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.8, 1, 1), fogMaterial);
    ridge = new THREE.Mesh(new RoundedBoxGeometry(3.6, 0.24, 1.72, 6, 0.12), ridgeMaterial);

    slabEdge.scale.set(1.02, 1.02, 1.06);
    slabCore.position.z = 0.16;
    slabSheen.position.z = 0.17;
    bandOne.position.z = 0.17;
    bandTwo.position.z = 0.17;
    inputHalo.material.rotation = 0;
    inputHalo.position.z = -1.2;
    receiveFog.position.z = -1.55;
    ridge.position.z = -0.36;

    slabGroup.add(slabEdge);
    slabGroup.add(slabBody);
    slabGroup.add(slabCore);
    slabGroup.add(slabSheen);
    slabGroup.add(bandOne);
    slabGroup.add(bandTwo);
    anchorGroup.add(ridge);
    atmosphereGroup.add(inputHalo);
    atmosphereGroup.add(receiveFog);
    createAtmospherePlanes();
  }

  function createAtmospherePlanes() {
    var texture = new THREE.CanvasTexture(createRadialTexture([
      [0, "rgba(124, 184, 255, 0.44)"],
      [0.48, "rgba(68, 127, 209, 0.12)"],
      [1, "rgba(5, 7, 10, 0)"]
    ]));
    texture.colorSpace = THREE.SRGBColorSpace;

    var material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    var planeOne = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2, 1, 1), material);
    var planeTwo = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4, 1, 1), material.clone());
    var planeThree = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8, 1, 1), material.clone());

    planeOne.position.set(2.3, 1.4, -2.2);
    planeTwo.position.set(-2.3, -1.1, -2.4);
    planeThree.position.set(0.2, 0.3, -2.8);
    planeTwo.material.opacity = 0.12;
    planeThree.material.opacity = 0.09;

    atmosphereTexture = texture;

    atmosphereGroup.add(planeOne);
    atmosphereGroup.add(planeTwo);
    atmosphereGroup.add(planeThree);
  }

  function buildAnchors() {
    garageAnchor = cloneTemplateInstance(assetTemplates.garageFrame);
    vendingAnchor = cloneTemplateInstance(assetTemplates.vending);
    boxAnchor = cloneTemplateInstance(assetTemplates.boxLarge);

    restyleInstance(garageAnchor.root, {
      color: 0x62707c,
      emissive: 0x071018,
      metalness: 0.58,
      roughness: 0.48,
      opacity: 0.56
    });
    restyleInstance(vendingAnchor.root, {
      color: 0x2a3037,
      emissive: 0x070b10,
      metalness: 0.18,
      roughness: 0.9,
      opacity: 0.34
    });
    restyleInstance(boxAnchor.root, {
      color: 0x3f454d,
      emissive: 0x05070a,
      metalness: 0.08,
      roughness: 0.96,
      opacity: 0.44
    });

    anchorGroup.add(garageAnchor.root);
    anchorGroup.add(vendingAnchor.root);
    anchorGroup.add(boxAnchor.root);
  }

  function restyleInstance(rootObject, materialState) {
    rootObject.traverse(function (child) {
      if (!child.isMesh || !child.material) {
        return;
      }

      child.material.color.setHex(materialState.color);
      child.material.emissive.setHex(materialState.emissive);
      child.material.emissiveIntensity = 0.16;
      child.material.metalness = materialState.metalness;
      child.material.roughness = materialState.roughness;
      child.material.transparent = materialState.opacity < 0.999;
      child.material.opacity = materialState.opacity;
      child.userData.baseOpacity = materialState.opacity;
    });
  }

  function createAbstractMesh(mapping) {
    var geometry;
    var material;
    var dimensions = mapping.abstractScale;
    var holder = new THREE.Group();
    var mesh;

    if (mapping.id === "chrome-sphere") {
      geometry = new THREE.SphereGeometry(dimensions[0], 40, 40);
      material = new THREE.MeshPhysicalMaterial({
        color: 0xf7fbff,
        emissive: 0x0b1320,
        emissiveIntensity: 0.12,
        metalness: 1,
        roughness: 0.08,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.55
      });
    } else if (mapping.id === "frosted-capsule") {
      geometry = new THREE.CapsuleGeometry(dimensions[0], dimensions[1], 8, 18);
      material = new THREE.MeshPhysicalMaterial({
        color: 0xdfe8f1,
        emissive: 0x08111c,
        emissiveIntensity: 0.16,
        metalness: 0.18,
        roughness: 0.22,
        transparent: true,
        opacity: 0.7,
        transmission: 0.18,
        thickness: 0.64,
        envMapIntensity: 1.22
      });
    } else {
      geometry = new RoundedBoxGeometry(
        dimensions[0],
        dimensions[1],
        dimensions[2],
        6,
        mapping.id === "dark-cuboid" ? 0.08 : 0.1
      );
      material = mapping.id === "dark-cuboid" ? new THREE.MeshStandardMaterial({
        color: 0x222a34,
        emissive: 0x070c13,
        emissiveIntensity: 0.16,
        metalness: 0.16,
        roughness: 0.84
      }) : new THREE.MeshPhysicalMaterial({
        color: 0x95a9bc,
        emissive: 0x08121d,
        emissiveIntensity: 0.14,
        metalness: 0.24,
        roughness: 0.12,
        transparent: true,
        opacity: 0.28,
        transmission: 0.42,
        thickness: 0.8,
        clearcoat: 0.82,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.12
      });
    }

    mesh = new THREE.Mesh(geometry, material);
    mesh.userData.baseOpacity = material.opacity != null ? material.opacity : 1;
    holder.add(mesh);

    return {
      root: holder,
      mesh: mesh,
      dispose: function () {
        geometry.dispose();
        material.dispose();
      }
    };
  }

  function createOutputGroup(mapping) {
    var holder = new THREE.Group();
    var instances = [];

    mapping.outputIds.forEach(function (id, index) {
      var instance = cloneTemplateInstance(assetTemplates[id]);
      var shift = index === 0 ? -1 : 1;

      instances.push(instance);
      holder.add(instance.root);

      if (mapping.id === "smoked-monolith") {
        instance.root.rotation.y = -0.54;
        instance.root.position.set(0, 0, 0.02);
      } else if (mapping.id === "chrome-sphere") {
        if (id === "rug") {
          instance.root.scale.setScalar(1.18);
          instance.root.position.set(-0.04, -0.02, -0.08);
          instance.root.rotation.y = 0.4;
        } else {
          instance.root.position.set(0.12, 0.04, 0.08);
          instance.root.rotation.y = -0.5;
        }
      } else if (mapping.id === "frosted-capsule") {
        instance.root.position.set(shift * 0.34, 0, index === 0 ? 0.08 : -0.14);
        instance.root.rotation.y = shift > 0 ? -0.42 : 0.34;
        if (id === "table") {
          instance.root.scale.setScalar(0.88);
        }
      } else {
        instance.root.position.set(shift * 0.38, 0.02, index === 0 ? 0.04 : -0.16);
        instance.root.rotation.y = shift > 0 ? -0.32 : 0.28;
        if (id === "furnace") {
          instance.root.scale.setScalar(0.86);
        }
      }
    });

    setGroupOpacity(holder, 0);

    return {
      root: holder,
      dispose: function () {
        instances.forEach(function (instance) {
          instance.dispose();
        });
      }
    };
  }

  function removeCycle(cycle) {
    inputGroup.remove(cycle.input.root);
    cycle.input.dispose();

    if (cycle.output) {
      outputGroup.remove(cycle.output.root);
      cycle.output.dispose();
    }
  }

  function clearCycles() {
    activeCycles.forEach(removeCycle);
    activeCycles = [];
    nextSpawnAt = 0;
  }

  function getLanes() {
    if (profile.id === "desktop") {
      return [-1, 0, 1];
    }

    return [-1, 1];
  }

  function spawnCycle(elapsed) {
    var lanes = getLanes();
    var mapping = FLOW_MAPPINGS[cycleCursor % FLOW_MAPPINGS.length];
    var input = createAbstractMesh(mapping);
    var cycle = {
      mapping: mapping,
      input: input,
      output: null,
      lane: lanes[cycleCursor % lanes.length],
      exitLane: lanes[(cycleCursor + 1) % lanes.length],
      depth: lerp(-0.55, 0.55, Math.random()),
      spin: lerp(-1, 1, Math.random()),
      startTime: elapsed,
      duration: profile.id === "mobile" ? 6.4 : 7.1
    };

    cycleCursor += 1;
    inputGroup.add(input.root);
    activeCycles.push(cycle);
    nextSpawnAt = elapsed + (profile.id === "desktop" ? 2.2 : 2.5);
  }

  function getScrollProgress() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    var start = section.offsetTop;
    var span = Math.max(section.offsetHeight * 0.88, (window.innerHeight || 1) * 0.8);

    return clamp((scrollTop - start) / span, 0, 1);
  }

  function applyProfile(forceReset) {
    var size = profile.slabSize;
    var isVertical = profile.orientation === "vertical";

    slabGroup.position.set(profile.slabPosition[0], profile.slabPosition[1], profile.slabPosition[2]);
    slabBody.scale.set(size[0], size[1], size[2]);
    slabEdge.scale.set(size[0] * 1.04, size[1] * 1.04, size[2] * 1.18);
    slabCore.scale.set(isVertical ? size[0] * 0.8 : size[0] * 0.78, isVertical ? size[1] * 0.72 : size[1] * 0.8, 1);
    slabSheen.scale.set(isVertical ? size[0] * 0.38 : size[0] * 0.18, isVertical ? size[1] * 0.9 : size[1] * 0.84, 1);
    bandOne.scale.set(size[0] * 0.88, isVertical ? 0.26 : 0.18, 1);
    bandTwo.scale.set(size[0] * 0.88, isVertical ? 0.26 : 0.18, 1);
    bandOne.position.set(0, isVertical ? size[1] * 0.18 : 0.18, 0.17);
    bandTwo.position.set(0, isVertical ? -size[1] * 0.16 : -0.18, 0.17);
    inputHalo.position.set(isVertical ? 2.5 : 0, isVertical ? 0.8 : 2.1, -1.3);
    inputHalo.scale.set(isVertical ? 1 : 1.2, isVertical ? 1.18 : 0.88, 1);
    receiveFog.position.set(isVertical ? -2.2 : 0, isVertical ? -0.9 : -2.05, -1.55);
    receiveFog.scale.set(isVertical ? 1 : 1.18, isVertical ? 0.9 : 1.05, 1);
    ridge.position.set(isVertical ? -1.95 : 0, isVertical ? -1.72 : -2.45, -0.34);
    ridge.scale.set(isVertical ? 1 : 1.18, 1, isVertical ? 1 : 1.12);

    if (garageAnchor) {
      if (isVertical) {
        garageAnchor.root.position.set(-2.48, -1.26, -0.88);
        garageAnchor.root.rotation.set(0, 0.18, 0.02);
        garageAnchor.root.scale.setScalar(1.18);
        vendingAnchor.root.position.set(-3.08, -1.02, -1.36);
        vendingAnchor.root.rotation.set(0, 0.28, 0);
        vendingAnchor.root.scale.setScalar(0.72);
        boxAnchor.root.position.set(-1.55, -1.46, 0.34);
        boxAnchor.root.rotation.set(0, -0.36, 0);
        boxAnchor.root.scale.setScalar(0.94);
      } else {
        garageAnchor.root.position.set(-1.96, -2.48, -0.96);
        garageAnchor.root.rotation.set(0, 0.14, 0.02);
        garageAnchor.root.scale.setScalar(1.06);
        vendingAnchor.root.position.set(1.72, -2.52, -1.28);
        vendingAnchor.root.rotation.set(0, -0.18, 0);
        vendingAnchor.root.scale.setScalar(0.64);
        boxAnchor.root.position.set(0.9, -2.2, 0.12);
        boxAnchor.root.rotation.set(0, -0.24, 0);
        boxAnchor.root.scale.setScalar(0.86);
      }
    }

    camera.fov = profile.fov;
    camera.position.set(profile.cameraPosition[0], profile.cameraPosition[1], profile.cameraPosition[2]);
    camera.lookAt(profile.cameraTarget[0], profile.cameraTarget[1], profile.cameraTarget[2]);

    if (forceReset) {
      clearCycles();
    }
  }

  function updateCycle(cycle, elapsed) {
    var progress = clamp((elapsed - cycle.startTime) / cycle.duration, 0, 1);
    var inputProgress = rangeProgress(progress, 0, 0.64);
    var burstProgress = rangeProgress(progress, 0.66, 0.82);
    var settleProgress = rangeProgress(progress, 0.82, 1);
    var isVertical = profile.orientation === "vertical";
    var lane = cycle.lane;
    var exitLane = cycle.exitLane;
    var depth = cycle.depth;
    var sx = profile.slabPosition[0];
    var sy = profile.slabPosition[1];
    var inputOpacity = 1;
    var outputOpacity = 0;
    var pull = 0;
    var x;
    var y;
    var z;
    var scaleX = 1;
    var scaleY = 1;
    var scaleZ = 1;
    var outputX;
    var outputY;
    var outputZ;
    var coreActivity = 0;

    if (progress < 0.34) {
      pull = easeInOutCubic(rangeProgress(progress, 0, 0.34));
    } else if (progress < 0.5) {
      pull = 0.34 + (easeOutCubic(rangeProgress(progress, 0.34, 0.5)) * 0.28);
    } else {
      pull = 0.62 + (easeInOutCubic(rangeProgress(progress, 0.5, 0.64)) * 0.38);
    }

    if (isVertical) {
      x = lerp(sx + 3.8, sx + 0.06, pull);
      y = lerp(lane * 0.92, lane * 0.16, easeInOutCubic(inputProgress));
      z = lerp(depth * 0.48, depth * 0.1, inputProgress);
      outputX = progress < 0.82 ? lerp(sx - 0.28, sx - 1.4, easeOutCubic(burstProgress)) : lerp(sx - 1.4, -2.76, easeInOutCubic(settleProgress));
      outputY = progress < 0.82 ? lerp(lane * 0.12, exitLane * 0.42 - 0.08, easeOutCubic(burstProgress)) : lerp(exitLane * 0.42 - 0.08, exitLane * 0.26 - 0.54, easeInOutCubic(settleProgress));
      outputZ = progress < 0.82 ? lerp(depth * 0.08, -0.08, easeOutCubic(burstProgress)) : lerp(-0.08, -0.92, easeInOutCubic(settleProgress));
    } else {
      x = lerp(lane * 1.14, lane * 0.08, easeInOutCubic(inputProgress));
      y = lerp(sy + 3.0, sy + 0.08, pull);
      z = lerp(depth * 0.18, depth * 0.08, inputProgress);
      outputX = progress < 0.82 ? lerp(lane * 0.06, exitLane * 0.48, easeOutCubic(burstProgress)) : lerp(exitLane * 0.48, exitLane * 0.74, easeInOutCubic(settleProgress));
      outputY = progress < 0.82 ? lerp(sy - 0.24, sy - 1.26, easeOutCubic(burstProgress)) : lerp(sy - 1.26, -2.64, easeInOutCubic(settleProgress));
      outputZ = progress < 0.82 ? lerp(depth * 0.05, -0.06, easeOutCubic(burstProgress)) : lerp(-0.06, -0.88, easeInOutCubic(settleProgress));
    }

    if (progress >= 0.48 && progress < 0.64) {
      scaleX = isVertical ? lerp(1, 0.62, rangeProgress(progress, 0.48, 0.64)) : lerp(1, 1.16, rangeProgress(progress, 0.48, 0.64));
      scaleY = isVertical ? lerp(1, 1.18, rangeProgress(progress, 0.48, 0.64)) : lerp(1, 0.62, rangeProgress(progress, 0.48, 0.64));
      scaleZ = lerp(1, 0.58, rangeProgress(progress, 0.48, 0.64));
      inputOpacity = lerp(cycle.input.mesh.userData.baseOpacity || 1, 0, rangeProgress(progress, 0.5, 0.68));
      coreActivity = rangeProgress(progress, 0.5, 0.72);
    } else if (progress >= 0.64) {
      inputOpacity = 0;
      coreActivity = clamp(1 - rangeProgress(progress, 0.72, 1), 0, 1) * 0.42;
    }

    cycle.input.root.position.set(x, y, z);
    cycle.input.root.rotation.set(progress * 0.18, (elapsed * 0.3 * cycle.spin) + (progress * 1.1 * cycle.spin), progress * 0.06 * cycle.spin);
    cycle.input.root.scale.set(scaleX, scaleY, scaleZ);
    cycle.input.mesh.material.opacity = inputOpacity;
    cycle.input.mesh.visible = inputOpacity > 0.001;

    if (!cycle.output && progress >= 0.62) {
      cycle.output = createOutputGroup(cycle.mapping);
      outputGroup.add(cycle.output.root);
    }

    if (cycle.output) {
      outputOpacity = progress < 0.82 ? lerp(0, 1, rangeProgress(progress, 0.62, 0.74)) : lerp(1, 0, settleProgress);
      cycle.output.root.position.set(outputX, outputY, outputZ);
      cycle.output.root.rotation.set(0, (elapsed * 0.06 * cycle.spin) + (isVertical ? -0.22 : -0.08), 0);
      cycle.output.root.scale.setScalar(progress < 0.82 ? lerp(0.72, 1.04, easeOutCubic(burstProgress)) : lerp(1.04, 0.94, easeInOutCubic(settleProgress)));
      setGroupOpacity(cycle.output.root, outputOpacity);
    }

    return coreActivity;
  }

  function updateSceneState(elapsed, snap) {
    var stageMotion = getStageMotionState();
    var scrollProgress = scrollLinked ? getScrollProgress() : 0;
    var scrollBias = easeInOutCubic(scrollProgress);
    var wheelBias = stageMotion && typeof stageMotion.wheelBias === "number" ? stageMotion.wheelBias : 0;
    var ambientPulse = stageMotion && typeof stageMotion.ambientPulse === "number" ? stageMotion.ambientPulse : 0.32;
    var revealProgress = stageMotion && typeof stageMotion.revealProgress === "number" ? stageMotion.revealProgress : 1;
    var dockHover = stageMotion && typeof stageMotion.dockHover === "number" ? stageMotion.dockHover : 0;
    var pointerEase = snap ? 1 : 0.08;
    var chamberTilt;
    var chamberShift;
    var bandDrift = elapsed * lerp(0.05, 0.075, clamp((ambientPulse * 0.6) + (Math.abs(wheelBias) * 0.24), 0, 1));
    var bandDriftReverse = elapsed * lerp(-0.032, -0.05, clamp((ambientPulse * 0.5) + (dockHover * 0.32), 0, 1));
    var coreActivity = 0;

    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * pointerEase;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * pointerEase;

    if (activeCycles.length < profile.maxCycles && elapsed >= nextSpawnAt) {
      spawnCycle(elapsed);
    }

    activeCycles = activeCycles.filter(function (cycle) {
      if (((elapsed - cycle.startTime) / cycle.duration) >= 1) {
        removeCycle(cycle);
        return false;
      }

      coreActivity = Math.max(coreActivity, updateCycle(cycle, elapsed));
      return true;
    });

    chamberTilt = (pointerCurrent.x * 0.1) + (scrollBias * 0.04) + (wheelBias * 0.035);
    chamberShift = (pointerCurrent.y * -0.14) + (scrollBias * -0.2) + (wheelBias * -0.12);

    root.rotation.y = chamberTilt;
    root.rotation.x = (pointerCurrent.y * 0.04) + (wheelBias * 0.02);
    root.position.x = (pointerCurrent.x * 0.22) - (dockHover * 0.06);
    root.position.y = chamberShift;

    slabSheen.position.x = profile.orientation === "vertical"
      ? (Math.sin(elapsed * 0.34) * 0.1) + (pointerCurrent.x * 0.08) + (wheelBias * 0.12) - (dockHover * 0.06)
      : (Math.sin(elapsed * 0.3) * 0.18) + (pointerCurrent.x * 0.16) + (wheelBias * 0.24);
    slabSheen.position.y = profile.orientation === "vertical"
      ? (pointerCurrent.y * -0.16) - (wheelBias * 0.08)
      : (pointerCurrent.y * -0.06) - (wheelBias * 0.04);
    slabCore.material.opacity = clamp(lerp(0.34, 0.78, coreActivity) + (ambientPulse * 0.04), 0, 1);
    slabEdge.material.emissiveIntensity = lerp(0.16, 0.42, coreActivity) + (ambientPulse * 0.02) + (Math.abs(wheelBias) * 0.02);
    slabLight.intensity = lerp(1.2, 2.3, coreActivity) + (ambientPulse * 0.08) + (Math.abs(wheelBias) * 0.14);
    bandTexture.offset.x = bandDrift % 1;
    bandOne.material.opacity = lerp(0.2, 0.34, coreActivity);
    bandTwo.material.map.offset.x = bandDriftReverse % 1;
    receiveFog.material.opacity = 0.18 + (Math.sin(elapsed * 0.18) * 0.02) + (scrollBias * 0.06) + ((1 - revealProgress) * 0.02);
    inputHalo.material.opacity = 0.12 + (Math.cos(elapsed * 0.14) * 0.02) + (ambientPulse * 0.03);

    slabLight.position.set(profile.slabPosition[0], profile.slabPosition[1], 1.8);
    receiveLight.position.set(profile.orientation === "vertical" ? -2.2 : 0, profile.orientation === "vertical" ? -0.7 : -2.1, 1.4);
    camera.position.x = profile.cameraPosition[0] + (pointerCurrent.x * 0.24) - (scrollBias * 0.16) - (dockHover * 0.05);
    camera.position.y = profile.cameraPosition[1] + (pointerCurrent.y * -0.16) - (scrollBias * 0.08) - (wheelBias * 0.08);
    camera.position.z = profile.cameraPosition[2] - (scrollBias * 0.18) - (Math.abs(wheelBias) * 0.1) + ((1 - revealProgress) * 0.06);
    camera.lookAt(
      profile.cameraTarget[0] + (pointerCurrent.x * 0.08) - (dockHover * 0.02),
      profile.cameraTarget[1] + (pointerCurrent.y * -0.05) - (scrollBias * 0.08) - (wheelBias * 0.03),
      profile.cameraTarget[2]
    );
    renderer.toneMappingExposure = 1.02 + (ambientPulse * 0.06) + (Math.abs(wheelBias) * 0.03) - ((1 - revealProgress) * 0.02);

    if (scrollLinked) {
      setPose(scrollBias >= 0.72 ? "settled" : (scrollBias >= 0.18 ? "tracking" : "entry"));
    } else {
      setPose(coreActivity > 0.2 ? "active" : "ready");
    }
  }

  function attachInteraction() {
    section.addEventListener("pointermove", onPointerMove);
    section.addEventListener("pointerleave", onPointerLeave);
  }

  function detachInteraction() {
    section.removeEventListener("pointermove", onPointerMove);
    section.removeEventListener("pointerleave", onPointerLeave);
  }

  function onPointerMove(event) {
    var rect = section.getBoundingClientRect();
    var x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1;
    var y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 - 1;

    pointerTarget.set(clamp(x, -1, 1), clamp(y, -1, 1));
  }

  function onPointerLeave() {
    pointerTarget.set(0, 0);
  }

  function attachVisibilityTracking() {
    visibilityObserver = new IntersectionObserver(function (entries) {
      var entry = entries[0];

      inView = entry ? entry.isIntersecting : true;
      syncAnimationState();
    }, {
      threshold: 0.12
    });

    visibilityObserver.observe(section);
  }

  function updateSize() {
    var shell = canvas.parentElement;
    var width = shell.clientWidth || 1;
    var height = shell.clientHeight || 1;
    var nextProfile = getProfile(width);

    if (nextProfile.id !== profile.id) {
      profile = nextProfile;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.id === "mobile" ? 1.2 : 1.35));
      applyProfile(true);
    } else {
      profile = nextProfile;
      applyProfile(false);
    }

    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    updateSceneState(clock.getElapsedTime(), true);
    renderFrame();
  }

  function shouldAnimate() {
    return !disposed && inView && !document.hidden;
  }

  function syncAnimationState() {
    if (!shouldAnimate()) {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }

      updateSceneState(clock.getElapsedTime(), true);
      renderFrame();
      return;
    }

    if (!rafId) {
      rafId = window.requestAnimationFrame(tick);
    }
  }

  function tick() {
    rafId = 0;

    if (disposed) {
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
    var disposedGeometries = new Set();
    var disposedMaterials = new Set();

    if (disposed) {
      return;
    }

    disposed = true;

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }

    clearCycles();
    detachInteraction();
    window.removeEventListener("resize", updateSize);
    document.removeEventListener("visibilitychange", syncAnimationState);

    if (visibilityObserver) {
      visibilityObserver.disconnect();
      visibilityObserver = null;
    }

    if (garageAnchor) {
      garageAnchor.dispose();
      vendingAnchor.dispose();
      boxAnchor.dispose();
    }

    Object.keys(assetTemplates).forEach(function (key) {
      disposeTemplate(assetTemplates[key]);
    });

    scene.traverse(function (child) {
      if (!child.isMesh) {
        return;
      }

      if (child.geometry && !disposedGeometries.has(child.geometry)) {
        disposedGeometries.add(child.geometry);
        child.geometry.dispose();
      }

      if (child.material && !disposedMaterials.has(child.material)) {
        disposedMaterials.add(child.material);
        child.material.dispose();
      }
    });

    if (bandTexture) {
      bandTexture.dispose();
    }

    if (bandTextureTwo) {
      bandTextureTwo.dispose();
    }

    if (glowTexture) {
      glowTexture.dispose();
    }

    if (fogTexture) {
      fogTexture.dispose();
    }

    if (sheenTexture) {
      sheenTexture.dispose();
    }

    if (atmosphereTexture) {
      atmosphereTexture.dispose();
    }

    if (environmentTarget) {
      environmentTarget.dispose();
    }

    if (roomEnvironment && typeof roomEnvironment.dispose === "function") {
      roomEnvironment.dispose();
    }

    if (pmremGenerator) {
      pmremGenerator.dispose();
    }

    renderer.dispose();
    renderer.clear();
    canvas.width = 0;
    canvas.height = 0;
    setPose("hidden");
  }
}
