---
## NOW

Commit the modified `.voder/history.md` and `.voder/plan.md` files so that the working directory is clean.

## NEXT

1. Install and sync project dependencies:  
   - Run `npm ci`  
   - Run `npm run sync`  

2. Execute the full end-to-end test suite locally:  
   - Run `npm run test:e2e` and verify that all tests pass in Chromium, Firefox, and WebKit.  

3. Review console output and test screenshots in `outputs/` for any unexpected errors or regressions.

## LATER

- Address remaining accessibility issues (invalid `href="#"`, redundant roles, color-contrast checks).  
- Optimize performance by code-splitting heavy chunks (`vite.config.js` manualChunks) and refining the starfield rendering.  
- Enhance narrative animations (GSAP timelines, scroll-tied camera moves) and add optional ambient audio cues.  
- Expand documentation and ADRs (update README usage examples, record any new architectural decisions).  
- Prepare for production deployment: bundle size audits, asset compression, and CI/CD deployment configuration.