## NOW

Commit the updated `.voder/history.md` and `.voder/plan.md` files with a clear commit message (e.g. “chore(internal): update history and plan”).

## NEXT

- Install and synchronize dependencies: run `npm ci` then `npm run sync`.  
- Execute the full end-to-end suite: `npm run test:e2e` and confirm all tests pass in Chromium, Firefox, and WebKit.  
- Examine the freshly generated screenshots in `outputs/` to ensure there are no visual regressions.

## LATER

- Address remaining accessibility issues (invalid `href="#"`, redundant roles, color-contrast auditing).  
- Fine-tune performance (roll up manualChunks, optimize starfield canvas).  
- Enhance narrative animations (refine GSAP timelines, consider audio cues).  
- Update documentation and ADRs to reflect any new decisions.  
- Prepare for production deployment (bundle‐size audits, asset compression, CI/CD configuration).