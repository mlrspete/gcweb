function assetUrl(path) {
  return new URL(path, import.meta.url).href;
}

export const assetCatalog = [
  {
    id: "zombie-bear",
    label: "Zombie Bear",
    sourceFormat: "OBJ",
    loaderLabel: "OBJLoader",
    modelUrl: assetUrl("../../zombie-bear/source/Model.obj"),
    textureUrls: {
      map: assetUrl("../../zombie-bear/textures/albedo.png"),
      aoMap: assetUrl("../../zombie-bear/textures/ao_1024.png"),
      normalMap: assetUrl("../../zombie-bear/textures/normal_1024.png"),
      roughnessMap: assetUrl("../../zombie-bear/textures/roughness.png")
    },
    material: {
      materialRoute: "Runtime MeshStandardMaterial rebuild from loose OBJ textures",
      color: 0xe9e1d4,
      metalness: 0.08,
      roughness: 0.92,
      aoMapIntensity: 0.95,
      normalScale: [1, 1]
    },
    presentation: {
      fitSize: 3.15,
      rotation: [-Math.PI / 2, 0.45, 0],
      cameraPosition: [3.8, 2.4, 4.9],
      cameraTarget: [0, 0.95, 0]
    },
    notes: [
      "Strongest audited OBJ candidate with a usable loose texture set.",
      "Model is centered and grounded at runtime so it can be compared against other assets on a common stage.",
      "AO is applied by copying UVs into uv2 when needed."
    ],
    fallbacks: [
      "The source OBJ references a missing render.mtl, so all material work is rebuilt in-browser.",
      "Material tuning is intentionally neutral rather than game-accurate."
    ]
  },
  {
    id: "repair-bench",
    label: "Repair Bench",
    sourceFormat: "FBX",
    loaderLabel: "FBXLoader",
    modelUrl: assetUrl("../../repair-bench-from-rust/source/RepairBench.fbx"),
    textureUrls: {
      map: assetUrl("../../repair-bench-from-rust/textures/DefaultMaterial_BaseColor.png"),
      metalnessMap: assetUrl("../../repair-bench-from-rust/textures/DefaultMaterial_Metallic.png")
    },
    material: {
      materialRoute: "Runtime MeshStandardMaterial rebuild from sparse FBX texture set",
      color: 0xb19880,
      metalness: 0.36,
      roughness: 0.82
    },
    presentation: {
      fitSize: 2.9,
      rotation: [0, -0.35, 0],
      cameraPosition: [4.6, 2.9, 5.6],
      cameraTarget: [0, 0.85, 0]
    },
    notes: [
      "Chosen as the FBX-side smoke test because it is small enough to be fast on the current static stack.",
      "The scene uses the supplied base-color and metallic maps, then fills in roughness with scalar values.",
      "This confirms that a non-glTF Rust-native source file can still be inspected cleanly on the website."
    ],
    fallbacks: [
      "The FBX does not ship with roughness or normal textures in this repo, so those are replaced with calibrated fallback values.",
      "If the asset proves visually useful later, it should still be converted to glb for production."
    ]
  }
];

export const defaultAssetId = assetCatalog[0].id;

export function getAssetById(assetId) {
  return assetCatalog.find(function (asset) {
    return asset.id === assetId;
  });
}
