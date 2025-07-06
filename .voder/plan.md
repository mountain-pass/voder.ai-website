---
## NOW

Ensure the repository is in a clean state by committing all pending file changes (including updates to README.md, prompts files, src/app.css, svelte.config.js, tests/responsive.spec.js, tests/smoke.spec.js, package.json, package-lock.json, and the prompt deletions/additions).

## NEXT

- Push the newly committed changes to the `main` branch and confirm that the GitHub Actions CI workflow (build-and-test) passes without errors.  
- Integrate a placeholder Threlte-based 3D scene for the “Brand Entry” section:  
  1. Create `src/routes/BrandEntry.svelte` that uses `@threlte/core` to render a simple rotating 3D object (e.g., a cube or sphere).  
  2. Import and include `<BrandEntry />` at the top of `src/routes/+page.svelte` before the first `<section>`.  
  3. Update `vite.config.js` under `ssr.noExternal` if needed to allow server‐side bundling of `@threlte/core` and `three`.  
- Remove any stray references to Reveal.js (in dependencies, configs, or imports) to keep the build optimized.

## LATER

- Replace the placeholder 3D object with a polished GLTF model and fine-tune lighting, materials, and camera animation.  
- Add subtle ambient audio cues synchronized to key scroll-trigger events.  
- Conduct a full accessibility audit (contrast ratios, ARIA roles, keyboard navigation) and implement any necessary improvements.  
- Optimize asset loading by lazy-loading heavy models, refining code splitting, and reducing bundle size.  
- Expand end-to-end tests to cover the new 3D component, accessibility features, and audio playback.