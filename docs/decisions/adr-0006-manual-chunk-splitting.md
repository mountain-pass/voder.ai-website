---
status: "proposed"
date: 2024-08-06
decision-makers: voder.ai website team
author: Your Name <you@example.com>
---

# ADR 0006: Manual Chunk Splitting

## Context
Our production build is generating very large JavaScript chunks (Three.js/Threlte ~700 kB, GSAP ~200 kB, plus a monolithic “components” bundle). This hurts first-load performance, increases time to interactive, and forces users to re-download code even when only a small piece of our UI has changed. We need finer-grained code-splitting to deliver critical code first and defer or cache less-frequently-used modules.

## Decision
We will leverage Rollup’s `output.manualChunks` option in our Vite configuration to split packages and our own code into separate bundles. Specifically:
- Create a `vendor` chunk for all remaining `node_modules` libraries.
- Create a `three-threlte` chunk for Three.js and Threlte (`node_modules/three` and `node_modules/@threlte`).
- Create a `gsap` chunk for GSAP modules (`node_modules/gsap`).
- Create a `components` chunk for all Svelte components in `src/lib/components`.
- Allow Vite to automatically split any other code paths (dynamic imports, etc.) as needed.

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('node_modules/@threlte')) {
            return 'three-threlte';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
          if (id.includes('src/lib/components')) {
            return 'components';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});
```

## Consequences
- **Positive**  
  - Initial bundle size is reduced, improving first paint and time-to-interactive.  
  - Subsequent navigations benefit from long-term caching of large, rarely-changed chunks (e.g. Three.js, GSAP).  
  - Easier to identify and optimize specific chunks if they grow too large.

- **Negative**  
  - More HTTP/2 requests on first load (mitigated by HTTP/2 multiplexing).  
  - Slightly increased complexity in build configuration.  
  - Potential cache-staleness if chunk names or boundaries change frequently.

## References
- Rollup manualChunks documentation: https://rollupjs.org/configuration-options/#output-manualchunks  
- Issue #123: “Bundle size warnings on production build”  
- Vite guide on code splitting: https://vitejs.dev/guide/build.html#chunking-strategy