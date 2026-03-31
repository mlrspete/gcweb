# 3D Experiment Staging

This repo is currently a plain static site, not a React app and not a bundler-based project.

Use this folder as a neutral staging area for future 3D work:

- `converted/` is where cleaned browser-safe `.glb` exports should go.
- `index.html` is the current live 3D lab route.
- `?asset=zombie-bear` and `?asset=repair-bench` can be used to open a specific harness target directly.
- `../index.html` now uses the `repair-bench` asset as a lazy-loaded environmental prop in the final CTA background instead of a hero display piece.
- Homepage atmosphere flags:
  - `?ambient3d=off` disables the environmental render.
  - `?ambient3d=force` forces the environmental render on immediately for local review.
- Keep the original Rust-native uploads in their current folders until we decide what to keep long-term.
- Preferred later runtime path: vanilla Three.js plus `GLTFLoader`.
- Preferred later authoring path: inspect source assets, repair materials in Blender, then export `.glb`.

## Environmental Notes

- Section chosen: final CTA / waitlist section.
- Asset chosen: `repair-bench-from-rust/source/RepairBench.fbx`.
- Composition: a dim left-edge workshop fragment behind the final CTA, cropped and masked so it behaves like world atmosphere rather than a product card.
- Why this asset: the repair bench reads as Rust-native environmental dressing more naturally than the weapon assets, especially when desaturated and partially obscured.
- Runtime approach: the scene is lazy-loaded only when the final CTA nears the viewport, then paused whenever the section leaves view.
- Safety rails: the treatment auto-disables on smaller screens, reduced-motion setups, save-data mode, low-memory devices, and browsers without WebGL.
