# 3D Asset Audit

Audit date: 2026-03-31

Scope: repo-level Rust-native model uploads only. I excluded clearly non-3D assets such as `serveremoji/` and `rustEmojis.tar.gz`.

## Repo-level findings

- 12 top-level 3D asset folders were found.
- 57 physical files live inside those folders.
- Direct web-native formats found: 0 `.glb`, 0 `.gltf`.
- Material definition files found: 0 `.mtl`, 0 `.mat`.
- Direct source files found in the repo: 6 `.fbx`, 2 `.obj`, 4 `.zip`.
- Archived source files inside the `.zip` uploads: 2 `.obj`, 2 `.dae`, 10 `.jpg`.
- Loose texture images beside the assets: 45 total (`34 .png`, `4 .jpg`, `7 .jpeg`).

## Integration route for this repo

This site is a plain static `index.html` + `scripts/main.js` + `styles/main.css` setup with GSAP loaded from CDN and no React or package manager. The clean future route is vanilla Three.js, not react-three-fiber.

For later milestones, the safest production path is:

1. Inspect shortlisted assets with `FBXLoader`, `OBJLoader`, or `ColladaLoader` only if needed.
2. Normalize and repair materials in Blender.
3. Export a clean `.glb`.
4. Load the final `.glb` with `GLTFLoader`.

## Likely web-ready

None today.

Reason: no `.glb`/`.gltf` packages exist in the repo, and every current candidate is missing at least one of these:

- material definitions
- texture bindings
- referenced external texture files

## Convertible with moderate effort

| Asset folder | Folder path | Main geometry/model files | Texture/material presence | Seems complete? | Probable loader | Obvious missing deps / caveats | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `zombie-bear` | `zombie-bear/` | `zombie-bear/source/Model.obj` | `albedo.png`, `ao_1024.png`, `normal_1024.png`, `roughness.png` | Mostly yes | `OBJLoader` for inspection, then `.glb` | `Model.obj` references missing `render.mtl`; material must be rebuilt manually | Use as the first pilot conversion candidate; rebuild a `MeshStandardMaterial` and export `.glb` |
| `ak47-rust` | `ak47-rust/` | `ak47-rust/source/AK_LP correct.fbx` | `base_color.png`, `normal.png`, `roughness.png`, `metalic.png`, `Grayscale.png` | Likely yes | `FBXLoader` for inspection, then `.glb` | No external image refs were found inside the FBX, so texture hookup will need manual relinking; `Grayscale.png` has an unclear role | Test-import in Blender, identify the grayscale map's role, relink textures, export `.glb` |
| `repair-bench-from-rust` | `repair-bench-from-rust/` | `repair-bench-from-rust/source/RepairBench.fbx` | `DefaultMaterial_BaseColor.png`, `DefaultMaterial_Metallic.png` | Probably yes, but sparse | `FBXLoader` for inspection, then `.glb` | No external image refs were found inside the FBX; no normal or roughness map is present | Test the mesh in Blender and export a simple `.glb`; add fallback roughness values in code if needed |
| `graphite-rifle-steam-workshop` | `graphite-rifle-steam-workshop/` | `graphite-rifle-steam-workshop/source/zip.zip -> obj.obj` | `0_DefaultMaterial_AlbedoTransparency.png`, `0_DefaultMaterial_Normal.png`, `0_DefaultMaterial_SpecularSmoothness.png` | Probably yes | `OBJLoader` plus manual material, then `.glb` | Archived OBJ has UVs and normals but no `mtllib` and no `usemtl`; texture set is specular/smoothness workflow, not ready-made metal/roughness | Unzip locally, rebuild the material by hand, convert smoothness to roughness if needed, export `.glb` |
| `rad-rifle-steam-workshop` | `rad-rifle-steam-workshop/` | `rad-rifle-steam-workshop/source/0.zip -> 0.obj` | `0_DefaultMaterial_AlbedoTransparency.png`, `0_DefaultMaterial_Normal.png`, `0_DefaultMaterial_SpecularSmoothness.png` | Probably yes | `OBJLoader` plus manual material, then `.glb` | Archived OBJ has UVs and normals but no `mtllib` and no `usemtl`; same specular/smoothness caveat as above | Treat this as a sister asset to the graphite rifle: rebuild one material template, then export `.glb` |
| `plywood-armour` | `plywood-armour/` | `plywood-armour/source/model.zip -> model/model.dae` | Zip includes `AO`, `emissive`, `normal`, `opacity`; outer folder includes `Diffuse`, `Specular`, `Glossine`, `normal`, `aojpg` | Probably yes, but awkward | `ColladaLoader` for inspection only, then `.glb` | The DAE has zero texture bindings; material must be recreated manually; `new_roadsign_vest_DefaultMaterial_aojpg.jpg` is only 3.4 KB and may be a placeholder or bad export | Import the DAE in Blender, choose the best texture set, rebuild the material, export `.glb` |
| `rusty-one` | `rusty-one/` | `rusty-one/source/model.zip -> model/model.dae` | Outer folder has `albedo`, `AO`, `metallic`, `normal`, `opacity`, `roughness`; zip also contains a similar JPG set | Probably yes | `ColladaLoader` for inspection only, then `.glb` | The DAE has zero texture bindings; the visual scene is oddly named `sword.obj`, so export provenance is inconsistent | Import in Blender, relink the outer texture set, sanity-check the mesh, then export `.glb` |
| `ak-47-kitty-revenge-steam-workshop` | `ak-47-kitty-revenge-steam-workshop/` | `ak-47-kitty-revenge-steam-workshop/source/v_ak47u.fbx` | Multi-slot weapon textures: `_MainTex*`, `_SpecGlossMap*`, `_BumpMap2.png`, `barrelnorm.png`, `magnorm.png`, `stocknorm.png`, `_EmissionMap0.png` | Partially yes | `FBXLoader` for inspection only, then `.glb` | The FBX references missing `ViewmodelArms.tga` and `fpsarms_normals.tga`; texture naming suggests a multi-material Unity-style export that will need manual remapping | Isolate the gun mesh or source the missing Rust arm textures, then rebuild materials and export `.glb` |
| `steam-workshop-geometric-attack-ver-2-ak47` | `steam-workshop-geometric-attack-ver-2-ak47/` | `steam-workshop-geometric-attack-ver-2-ak47/source/v_ak47u.fbx` | `obj_DefaultMaterial_AlbedoTransparency.png`, `obj_DefaultMaterial_Normal.png`, `obj_DefaultMaterial_SpecularSmoothness.png` | Partially yes | `FBXLoader` for inspection only, then `.glb` | The FBX references missing `ViewmodelArms.tga` and `fpsarms_normals.tga`; specular/smoothness texture workflow still needs conversion | Same plan as the kitty AK: isolate the usable weapon mesh, rebuild materials, export `.glb` |

## Incomplete / missing dependencies / probably unusable as-is

| Asset folder | Folder path | Main geometry/model files | Texture/material presence | Seems complete? | Probable loader | Obvious missing deps / caveats | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `rust-workbench-lvl-1` | `rust-workbench-lvl-1/` | `rust-workbench-lvl-1/source/Workbench T1.fbx` | No textures shipped beside the FBX | No | `FBXLoader` for inspection only | The FBX references missing `Workbench T1_diffuse.png`, `Workbench T1_normalmap.png`, `Workbench T1_roughness.png`, and `Workbench T1_displacement.png` | Do not spend browser time on this until the original texture set is found |
| `rust-workbench-lvl-2` | `rust-workbench-lvl-2/` | `rust-workbench-lvl-2/source/Workbench Tear 2.fbx` | No textures shipped beside the FBX | No | `FBXLoader` for inspection only | The FBX references missing `Workbench Tear 2_diffuse.png`, `Workbench Tear 2_normalmap.png`, `Workbench Tear 2_roughness.png`, and `Workbench Tear 2_displacement.png`; metadata still points to an old `Windows.old\\Program Files\\3DCoat-2023\\...` path | Treat as incomplete until the source texture set is recovered |
| `steam-workshop-apocalypse-facemask` | `steam-workshop-apocalypse-facemask/` | `steam-workshop-apocalypse-facemask/source/-222.obj` | `-22_default_Normal.png`, `-22_default_SpecularSmoothness.png`, `zbrush2_normals11111111.png` | No | `OBJLoader` only if salvaging | The OBJ references missing `-222.mtl`; there is no albedo or base-color texture in the folder, only normal/specular-style maps | Skip for now unless the original material file and diffuse texture can be sourced |

## Shared conversion notes

- Any asset using `SpecularSmoothness` or `SpecGlossMap` textures will need either:
  - a spec/gloss material setup during inspection, or
  - conversion into roughness/metalness before final `.glb` export.
- Missing `.mtl` files are the main reason the OBJ assets are not directly browser-ready.
- The archived `.dae` files are geometry containers, not self-contained textured web assets. Both need manual material rebuilding.
- The FBX assets are acceptable for source recovery, but shipping raw FBX to production would add more browser overhead than needed.

## Practical shortlist for later visual experiments

Best first candidates:

1. `zombie-bear`
2. `ak47-rust`
3. `repair-bench-from-rust`

These three look like the quickest path to a clean `.glb` without needing missing base-game dependencies.

## 3D exploration notes

- Keep the original source folders in place for now. They are the forensic source of truth.
- Put future browser-safe exports in `experiments/3d/converted/`.
- Avoid adding FBX, DAE, or OBJ loaders to the live site unless they are only being used for one-off inspection.
- When a candidate is chosen, standardize one final export per asset as `.glb` with relinked textures and a documented scale/orientation.

