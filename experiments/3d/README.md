# 3D Experiment Staging

This repo is currently a plain static site, not a React app and not a bundler-based project.

Use this folder as a neutral staging area for future 3D work:

- `converted/` is where cleaned browser-safe `.glb` exports should go.
- `index.html` is the current live 3D lab route.
- `?asset=zombie-bear` and `?asset=repair-bench` can be used to open a specific harness target directly.
- `../index.html` now includes a restrained ambient hero treatment using the `repair-bench` asset as a desktop-only homepage test.
- Homepage ambient flags:
  - `?ambient3d=off` disables it.
  - `?ambient3d=force` forces it on for local review.
- Keep the original Rust-native uploads in their current folders until we decide what to keep long-term.
- Preferred later runtime path: vanilla Three.js plus `GLTFLoader`.
- Preferred later authoring path: inspect source assets, repair materials in Blender, then export `.glb`.

## Ambient Hero Notes

- Section chosen: homepage hero.
- Asset chosen: `repair-bench-from-rust/source/RepairBench.fbx`.
- Composition: a low-motion, off-axis sculptural object on the right side of the hero so the copy stays dominant.
- Why this asset: it feels Rust-native without reading as noisy or aggressive, and it tolerates a premium fallback material better than the weapon assets.
- Safety rails: the treatment auto-disables on smaller screens, reduced-motion setups, save-data mode, low-memory devices, and browsers without WebGL.
