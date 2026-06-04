---
name: qiispace-project-context
description: Full context on the QIISPACE SPA website project — tech stack, page structure, animation system, known issues discovered during code review
metadata:
  type: project
---

QIISPACE (栖愈) is a high-end SPA brand official website — a Vue 3 + TypeScript + Vite single-page application.

**Tech stack**: Vue 3.4 (Composition API, `<script setup lang="ts">`), vue-router 4.3 (HTML5 History mode), GSAP 3.12 (with ScrollTrigger), Canvas 2D for particles, CSS custom properties for theming.

**Pages** (4 routes, all lazy-loaded):
1. `/` — Home (7 sections: Hero, Features, Services Preview, Stats, Brand Story, CTA)
2. `/services` — Services (category filter tabs + 8 service items + 4-step process)
3. `/about` — About (story, values, philosophy, stats)
4. `/stores` — Stores (9-store list with Beijing + Shanghai locations)

**Animation system** (6 composables + global effects):
- useScrollReveal (IntersectionObserver, threshold 0.1)
- useTiltEffect (3D perspective card tilt on mousemove)
- useSplitText (GSAP character-by-character entrance)
- useMouseGlow (requestAnimationFrame cursor tracking with easing)
- useGsapAnimations (ScrollTrigger card reveal, counter animation, curtain reveal, parallax)
- Global: ParticleBackground (Canvas), CursorGlow (radial gradient), page transitions (Vue transition)

**Known issues discovered 2026-06-02**:
1. Stores page subtitle says "全部位于北京" but data includes 上海静安店 — inconsistent
2. HeroCarousel deprecated but carousel-1~6.jpg files still in public/image/
3. Marquee section in Home.vue commented out — dead code
4. Stores.vue CTA section commented out — dead code
5. index.html missing SEO meta tags (description, og:title etc.)
6. Contact info (phone 400-000-0000, email hello@qiispace.com) are placeholders
7. Node.js v19.9.0, partial incompatibility with newer packages (e.g., sharp)
8. npm install requires `--cache /tmp/npm-cache` due to permission issues

**How to apply**: When writing or updating documentation for this project, reference these architectural details and known issues. New features should align with the existing composable pattern, CSS variable system, and warm-neutral color scheme.
