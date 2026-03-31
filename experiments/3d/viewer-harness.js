import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

const textureLoader = new THREE.TextureLoader();

function createLoaderForAsset(asset) {
  if (asset.sourceFormat === "OBJ") {
    return new OBJLoader();
  }

  if (asset.sourceFormat === "FBX") {
    return new FBXLoader();
  }

  throw new Error("Unsupported source format: " + asset.sourceFormat);
}

function loadModel(asset, onProgress) {
  return new Promise(function (resolve, reject) {
    createLoaderForAsset(asset).load(
      asset.modelUrl,
      resolve,
      function (event) {
        if (!onProgress) {
          return;
        }

        if (event && event.total) {
          onProgress(Math.max(0.08, Math.min(0.72, (event.loaded / event.total) * 0.72)));
          return;
        }

        onProgress(0.2);
      },
      reject
    );
  });
}

function loadTexture(textureUrl) {
  return new Promise(function (resolve, reject) {
    textureLoader.load(textureUrl, resolve, undefined, reject);
  });
}

function configureTexture(texture, slot, anisotropy) {
  texture.anisotropy = anisotropy;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  if (slot === "map") {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
}

async function loadTextureSet(textureUrls, anisotropy, onProgress) {
  const entries = Object.entries(textureUrls || {});
  const loadedTextures = {};
  const warnings = [];

  if (entries.length === 0) {
    if (onProgress) {
      onProgress(1);
    }

    return {
      textures: loadedTextures,
      warnings: warnings
    };
  }

  let completed = 0;

  await Promise.all(entries.map(async function (entry) {
    const slot = entry[0];
    const textureUrl = entry[1];

    try {
      const texture = await loadTexture(textureUrl);
      configureTexture(texture, slot, anisotropy);
      loadedTextures[slot] = texture;
    } catch (error) {
      warnings.push("Texture failed to load for " + slot + ".");
    } finally {
      completed += 1;

      if (onProgress) {
        const ratio = completed / entries.length;
        onProgress(0.72 + ratio * 0.28);
      }
    }
  }));

  return {
    textures: loadedTextures,
    warnings: warnings
  };
}

function createRuntimeMaterial(asset, loadedTextures) {
  const baseConfig = asset.material || {};
  const material = new THREE.MeshStandardMaterial({
    color: baseConfig.color || 0xd2c7ba,
    metalness: baseConfig.metalness != null ? baseConfig.metalness : 0.22,
    roughness: baseConfig.roughness != null ? baseConfig.roughness : 0.8,
    map: loadedTextures.map || null,
    aoMap: loadedTextures.aoMap || null,
    metalnessMap: loadedTextures.metalnessMap || null,
    normalMap: loadedTextures.normalMap || null,
    roughnessMap: loadedTextures.roughnessMap || null
  });
  const warnings = [];

  if (!loadedTextures.map) {
    warnings.push("Base color map missing, using a neutral fallback color.");
  }

  if (!loadedTextures.normalMap) {
    warnings.push("Normal detail missing, relying on scene lighting only.");
  }

  if (!loadedTextures.roughnessMap && baseConfig.roughness != null) {
    warnings.push("Roughness is using a scalar fallback instead of a texture map.");
  }

  if (!loadedTextures.metalnessMap && baseConfig.metalness != null) {
    warnings.push("Metalness is using a scalar fallback instead of a texture map.");
  }

  if (material.aoMap) {
    material.aoMapIntensity = baseConfig.aoMapIntensity != null ? baseConfig.aoMapIntensity : 1;
  }

  if (material.normalMap && Array.isArray(baseConfig.normalScale)) {
    material.normalScale = new THREE.Vector2(baseConfig.normalScale[0], baseConfig.normalScale[1]);
  }

  return {
    material: material,
    warnings: warnings
  };
}

function applyMaterialToObject(object, material) {
  let meshCount = 0;

  object.traverse(function (child) {
    if (!child.isMesh) {
      return;
    }

    meshCount += 1;
    child.castShadow = true;
    child.receiveShadow = true;
    child.material = material;

    if (!child.geometry.attributes.normal) {
      child.geometry.computeVertexNormals();
    }

    if (material.aoMap && child.geometry.attributes.uv && !child.geometry.attributes.uv2) {
      child.geometry.setAttribute("uv2", child.geometry.attributes.uv);
    }
  });

  return meshCount;
}

function normalizeObject(object, presentation) {
  const holder = new THREE.Group();
  const fitSize = presentation && presentation.fitSize ? presentation.fitSize : 3;
  const initialRotation = presentation && presentation.rotation ? presentation.rotation : [0, 0, 0];

  holder.add(object);
  object.rotation.set(initialRotation[0], initialRotation[1], initialRotation[2]);

  let bounds = new THREE.Box3().setFromObject(object);
  const size = bounds.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;
  const scaleFactor = fitSize / maxDimension;

  object.scale.setScalar(scaleFactor);

  bounds = new THREE.Box3().setFromObject(object);
  const center = bounds.getCenter(new THREE.Vector3());
  object.position.sub(center);

  bounds = new THREE.Box3().setFromObject(object);
  object.position.y -= bounds.min.y;

  bounds = new THREE.Box3().setFromObject(object);

  return {
    root: holder,
    size: bounds.getSize(new THREE.Vector3())
  };
}

function disposeMaterial(material) {
  const textures = [
    material.map,
    material.aoMap,
    material.metalnessMap,
    material.normalMap,
    material.roughnessMap
  ];

  textures.forEach(function (texture) {
    if (texture) {
      texture.dispose();
    }
  });

  material.dispose();
}

function disposeObject(object) {
  if (!object) {
    return;
  }

  const disposedMaterials = new Set();

  object.traverse(function (child) {
    if (child.isMesh) {
      child.geometry.dispose();

      if (child.material && !disposedMaterials.has(child.material)) {
        disposedMaterials.add(child.material);
        disposeMaterial(child.material);
      }
    }
  });
}

export class AssetViewerHarness {
  constructor(config) {
    this.canvas = config.canvas;
    this.overlay = config.overlay;
    this.messageEl = config.messageEl;
    this.detailEl = config.detailEl;
    this.progressEl = config.progressEl;
    this.onStateChange = typeof config.onStateChange === "function" ? config.onStateChange : function () {};
    this.activeRoot = null;
    this.activeAssetId = null;
    this.loadToken = 0;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xe8e0d3);

    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.camera.position.set(4.2, 2.8, 5.4);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      canvas: this.canvas
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.06;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 10;
    this.controls.maxPolarAngle = Math.PI * 0.48;
    this.controls.target.set(0, 0.85, 0);

    this.addStageLighting();
    this.addStageFloor();
    this.handleResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.animate();
  }

  addStageLighting() {
    const hemisphere = new THREE.HemisphereLight(0xf7f4ee, 0x8c8174, 1.45);
    this.scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(0xfff6eb, 2.6);
    keyLight.position.set(4.8, 7.2, 5.4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1536, 1536);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.camera.left = -7;
    keyLight.shadow.camera.right = 7;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.bias = -0.00015;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xcfe8ff, 0.68);
    fillLight.position.set(-4.2, 3.1, -3.8);
    this.scene.add(fillLight);
  }

  addStageFloor() {
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 72),
      new THREE.MeshStandardMaterial({
        color: 0xdbd3c7,
        roughness: 0.96,
        metalness: 0.02
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const grid = new THREE.GridHelper(8, 8, 0x8f8579, 0xb9b0a5);
    grid.position.y = 0.004;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    this.scene.add(grid);
  }

  setOverlayState(mode, message, detail, progress) {
    this.overlay.classList.add("is-visible");
    this.overlay.classList.toggle("is-error", mode === "error");
    this.messageEl.textContent = message;
    this.detailEl.textContent = detail || "";

    if (typeof progress === "number") {
      const safeProgress = Math.max(0.08, Math.min(progress, 1));
      this.progressEl.style.width = String(safeProgress * 100) + "%";
      this.progressEl.style.transform = "scaleX(1)";
      return;
    }

    this.progressEl.style.width = "32%";
    this.progressEl.style.transform = "scaleX(1)";
  }

  hideOverlay() {
    this.overlay.classList.remove("is-visible");
    this.overlay.classList.remove("is-error");
  }

  emitState(payload) {
    this.onStateChange(payload);
  }

  handleResize() {
    const stage = this.canvas.parentElement;
    const width = stage.clientWidth;
    const height = stage.clientHeight;

    this.camera.aspect = width / Math.max(height, 1);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  animate() {
    window.requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  clearActiveAsset() {
    if (!this.activeRoot) {
      return;
    }

    this.scene.remove(this.activeRoot);
    disposeObject(this.activeRoot);
    this.activeRoot = null;
    this.activeAssetId = null;
  }

  applyCameraPresentation(asset) {
    const presentation = asset.presentation || {};
    const cameraPosition = presentation.cameraPosition || [4.2, 2.8, 5.4];
    const cameraTarget = presentation.cameraTarget || [0, 0.85, 0];

    this.camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    this.controls.target.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
    this.camera.lookAt(this.controls.target);
    this.controls.update();
  }

  async loadAsset(asset) {
    const token = ++this.loadToken;

    this.clearActiveAsset();
    this.setOverlayState("loading", "Loading " + asset.label + "...", "Fetching source geometry and runtime material inputs.", 0.08);
    this.emitState({
      state: "loading",
      message: "Loading " + asset.label + "...",
      detail: asset.loaderLabel + " is fetching " + asset.sourceFormat + " source data.",
      warnings: asset.fallbacks.slice()
    });

    try {
      const model = await loadModel(asset, (progress) => {
        if (token !== this.loadToken) {
          return;
        }

        this.setOverlayState(
          "loading",
          "Loading " + asset.label + "...",
          "Source mesh is arriving from " + asset.sourceFormat + " data.",
          progress
        );
      });

      const textureLoad = await loadTextureSet(
        asset.textureUrls,
        this.renderer.capabilities.getMaxAnisotropy(),
        (progress) => {
          if (token !== this.loadToken) {
            return;
          }

          this.setOverlayState(
            "loading",
            "Preparing " + asset.label + "...",
            "Applying fallback-friendly textures and calibrating the runtime material.",
            progress
          );
        }
      );

      if (token !== this.loadToken) {
        disposeObject(model);
        return null;
      }

      const materialBuild = createRuntimeMaterial(asset, textureLoad.textures);
      const meshCount = applyMaterialToObject(model, materialBuild.material);
      const normalized = normalizeObject(model, asset.presentation);

      this.scene.add(normalized.root);
      this.activeRoot = normalized.root;
      this.activeAssetId = asset.id;
      this.applyCameraPresentation(asset);
      this.hideOverlay();

      const loadedTextureSlots = Object.keys(textureLoad.textures).sort();
      const warnings = asset.fallbacks.concat(textureLoad.warnings, materialBuild.warnings);
      const report = {
        state: "ready",
        message: asset.label + " rendered successfully.",
        detail: meshCount + " mesh" + (meshCount === 1 ? "" : "es") + " normalized into the shared viewer stage.",
        meshCount: meshCount,
        loadedTextureSlots: loadedTextureSlots,
        warnings: warnings,
        materialRoute: asset.material.materialRoute,
        normalizedSize: [
          normalized.size.x.toFixed(2),
          normalized.size.y.toFixed(2),
          normalized.size.z.toFixed(2)
        ].join(" x ")
      };

      this.emitState(report);
      return report;
    } catch (error) {
      if (token !== this.loadToken) {
        return null;
      }

      const safeMessage = error && error.message ? error.message : "Unknown loader failure.";
      this.setOverlayState(
        "error",
        "Could not load " + asset.label + ".",
        safeMessage,
        1
      );
      this.emitState({
        state: "error",
        message: asset.label + " failed to load.",
        detail: safeMessage,
        warnings: asset.fallbacks.slice()
      });
      throw error;
    }
  }
}
