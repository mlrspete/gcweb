# 3D Experiment Staging

This repo is currently a plain static site, not a React app and not a bundler-based project.

Use this folder as a neutral staging area for future 3D work:

- `converted/` is where cleaned browser-safe `.glb` exports should go.
- `index.html` is the current live 3D lab route.
- `compare.html` is the internal homepage experiment comparison route.
- `?asset=zombie-bear` and `?asset=repair-bench` can be used to open a specific harness target directly.
- `../index.html` now supports comparison variants through `?threeexp=baseline`, `?threeexp=hero`, `?threeexp=hero-scroll`, and `?threeexp=environment`.
- Homepage atmosphere flags:
  - `?ambient3d=off` disables the active homepage 3D treatment.
  - `?ambient3d=force` forces the active homepage 3D treatment on immediately for local review.
  - `?focus=top` and `?focus=conversation` are used by the compare route to jump previews to the relevant section.
  - Legacy `?focus=waitlist` still maps to the new conversation stage for older preview URLs.
- Keep the original Rust-native uploads in their current folders until we decide what to keep long-term.
- Preferred later runtime path: vanilla Three.js plus `GLTFLoader`.
- Preferred later authoring path: inspect source assets, repair materials in Blender, then export `.glb`.

## Homepage Variant Notes

- `baseline`: comparison control with all homepage 3D disabled.
- `hero`: Translation Chamber, the default homepage hero scene.
- `hero-scroll`: Translation Chamber with a restrained scroll-linked reframe.
- `environment`: lazy-loaded final CTA atmosphere branch.
- Safety rails: reduced-motion setups, save-data mode, low-memory devices, and browsers without WebGL still auto-disable homepage 3D. The hero chamber now remains available on small screens with its own horizontal mobile orientation.
