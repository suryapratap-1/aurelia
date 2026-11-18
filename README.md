# Aurelia Residences — Residence 23W

**A fictional concept.** A cinematic real-estate site for a three-bedroom home on level 23 of a 42-level riverside tower. The tower, the city, the residence, the roof and the podium are one live 3D model you walk through as you scroll. No property, price, address or certification here is real.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint       # Biome
npm run typecheck  # TypeScript 7 (tsc)
```

Review helpers: `/?shot=<id>` pins the camera to one shot (ids in `features/world/shots.ts`), `&clean` hides the page, `&tier=high|mid|low` forces a quality tier, `?no-webgl` shows the still-image fallback.

## Stack

Next.js 16.4 (App Router, Turbopack, static prerender) · React 19.3 · TypeScript 7 · Tailwind CSS 4.3 · GSAP 3.15 ScrollTrigger · Lenis · three.js r187 with React Three Fiber 9, drei and postprocessing · Zod 4 (server-side form validation) · Biome (lint/format).

`npm audit`: 0 vulnerabilities. ESLint is not used: `eslint-config-next` currently pulls in `picomatch`, which has an advisory with no patched release, so Biome replaces it.

## Structure

```
app/                 layout (fonts, metadata), page (section order), actions.ts (enquiry server action)
components/site      header, loader, footer, wordmark, smooth scroll
components/sections  hero, introduction, journey, floor plan, amenities, location, gallery, specifications, enquiry
components/plan      the SVG plan, drawn from data (used by the plan section, the journey mini-map and the footer)
components/ui        reveal and parallax primitives
features/world       the 3D world: tower, city, residence, furniture, amenities, camera rig, shots, materials
data/residence.ts    the single source of truth: rooms, walls, doors, glazing (plan + 3D + specs read it)
data/site.ts         copy, stops, amenities, places, specification, render list
lib/                 GSAP/Lenis helpers; vendor/three.mjs (see below)
public/              models (GLB, meshopt), textures (WebP), HDRI, gallery renders, fallback stills
```

### How the walk-through works

- One fixed WebGL canvas sits behind the page. Sections that show 3D are transparent; the others are opaque and the canvas stops rendering when none is on screen (`frameloop="demand"`).
- Each 3D section maps its scroll progress to a fractional index into `shots` (`useWorldSection`). The camera eases towards it and follows a Catmull-Rom spline through the shots of a continuous run, resting at each stop.
- Moving between disconnected places (street → lift lobby, bath → bedroom wing, roof → podium) is an honest cut, covered by a timed door-swing wipe. It never depends on where the scroll stops, so it cannot get stuck half-closed.
- The front door opens with scroll. The mini plan shows where the camera is.
- The floor plan is the interactive navigation, kept separate from the scroll sequence: select a room to read its size and finishes, then jump to it in the walk-through.

### Quality tiers and fallbacks

`high` (DPR 2, MSAA ×4, N8AO, 2K shadows) · `mid` (DPR 1.5, half-res AO, SMAA) · `low` (DPR 1, no shadows, tone mapping + SMAA). The 3D bundle (~475 KB gzip) is loaded with a dynamic import after first paint. Reduced motion: native scroll, no camera easing, no swing wipe, all text visible. No WebGL2: each stop shows a still rendered from the same model.

### `lib/vendor/three.mjs`

React Three Fiber 9.8 (latest stable) still creates `THREE.Clock`, which three r183+ deprecates with a console warning on every load. `turbopack.resolveAlias` points `three` at a small module that re-exports three.js unchanged and supplies an identical, warning-free `Clock`. There is still exactly one copy of three.js. Remove the alias once fiber 10 ships.

## Assets and licences

- Furniture models, material textures and the sky HDRI (`qwantani_sunset_puresky`): [Poly Haven](https://polyhaven.com), CC0.
- Architecture, kitchen, beds, sofa, chairs, bath, gym and city: built procedurally in code.
- Gallery images and fallback stills: rendered from this project's own 3D model.
- Fonts: Gloock and Schibsted Grotesk (SIL Open Font License), self-hosted by `next/font`.

## Known limits

- The 3D is real-time and procedural, not path-traced: it reads as a high-quality architectural model rather than a photograph.
- The enquiry form validates on the server but sends nothing (concept site).
- Lighthouse and frame-rate budgets were measured on one desktop GPU only.
