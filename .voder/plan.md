## NOW

Save the current work by recording all outstanding modifications to establish a clean baseline (ensuring tests/sections.spec.js and the updated `.voder/` files are included).

## NEXT

- In `src/lib/components/HeroSection.svelte`, replace each `href="#"` with either a real fragment target (e.g. `href="#about"`) or convert the link into a `<button>` if it’s not true navigation, and remove the redundant `role="region"`.  
- Run your color-contrast checks and, if needed, tweak placeholder and link colors in `src/app.css` or component-scoped styles to meet WCAG AA.  
- Execute your end-to-end suite (`npm run test:e2e`) and confirm there are zero console errors and that all accessibility/access lint warnings are resolved.

## LATER

- Introduce manual chunking in `vite.config.js` (via `build.rollupOptions.output.manualChunks`) to trim large bundle warnings.  
- Lazy-load non-critical modules (e.g. GSAP, Threlte scenes) to improve initial load performance.  
- Update documentation and ADRs to reflect any new accessibility or performance decisions.