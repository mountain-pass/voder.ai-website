## NOW

Stage and commit all pending modifications—including updates to `.gitignore`, `README.md`, `playwright.config.js`, the various `src/lib/components/*.svelte` files, `tsconfig.json`, `vite.config.js`, and any other changed files—so that the repository is in a clean, up-to-date state with zero uncommitted changes.

## NEXT

1. Install dependencies and sync SvelteKit:  
   Run `npm ci && npm run sync`.  
2. Execute the full end-to-end test suite locally:  
   Run `npm run test:e2e` and confirm all Playwright tests pass across Chromium, Firefox, and WebKit.  
3. Address any failures or warnings uncovered by the tests (fix code or update tests as needed).

## LATER

- Tackle remaining accessibility warnings (e.g., invalid href patterns, redundant roles) and improve color-contrast where necessary.  
- Enhance performance (lazy-load heavy modules, optimize StarfieldBackground draw logic, implement code-splitting/manualChunks in Vite).  
- Refine cinematic scroll animations with GSAP timelines and Three.js camera moves.  
- Expand documentation: update README with usage examples, add contribution guidelines, and finalize ADRs for any new architectural decisions.