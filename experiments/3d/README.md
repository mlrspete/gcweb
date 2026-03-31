# 3D Experiment Staging

This repo is currently a plain static site, not a React app and not a bundler-based project.

Use this folder as a neutral staging area for future 3D work:

- `converted/` is where cleaned browser-safe `.glb` exports should go.
- `index.html` is the current live 3D lab route.
- `?asset=zombie-bear` and `?asset=repair-bench` can be used to open a specific harness target directly.
- Keep the original Rust-native uploads in their current folders until we decide what to keep long-term.
- Preferred later runtime path: vanilla Three.js plus `GLTFLoader`.
- Preferred later authoring path: inspect source assets, repair materials in Blender, then export `.glb`.
