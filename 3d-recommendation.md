# 3D Recommendation

## Recommendation

Ship the **environmental** direction if the site keeps any homepage 3D at all.

It gives the page the clearest Rust-native atmosphere without turning the landing page into a showcase for a single prop. It also fits the current layout best because the typography stays primary and the 3D behaves more like world texture than content.

## What Worked Best Visually

- **Environmental / final CTA**: strongest overall. The bench reads as a workshop-world fragment and adds spatial depth without demanding attention.
- **Ambient hero object**: viable runner-up. It proves the asset can live in the hero, but it makes the page feel more like a product reveal than a premium membership landing page.
- **Baseline / no 3D**: still useful as the control case. It confirms the underlying typography and layout already work without help.

## What Felt Too Gimmicky

- **Scroll-linked hero**: the cleanest version was still the easiest to over-feel. It adds polish, but it also makes the homepage feel more performative and less restrained.
- **Large hero-object emphasis in general**: even when tasteful, it shifts the site closer to "look at this prop" rather than "trust this premium product."

## Performance Read

- **Baseline** performs best because it has no 3D runtime cost.
- **Environmental** is the best 3D balance because it lazy-loads near the CTA and pauses outside view.
- **Ambient hero object** is acceptable, but it pays the cost above the fold every visit.
- **Scroll-linked hero** is the most expensive branch conceptually and operationally because it keeps the hero 3D active in the most visible part of the page and adds extra motion logic.

## Realistic Production Path

- Keep only one homepage 3D treatment, not multiple live branches.
- Use the **environmental** direction as the production candidate.
- Convert the chosen Rust asset to a cleaned `.glb` before shipping.
- Keep the existing no-3D fallback and current device guardrails.
- Treat hero-object usage as a campaign or special landing-page option, not the default homepage direction.

## What To Abandon

- Abandon the idea of shipping the **scroll-linked hero** as the default homepage path.
- Avoid stacking multiple visible 3D moments on one page.
- Avoid investing further in raw-source FBX usage for production; use the current runtime only as experimentation scaffolding.
