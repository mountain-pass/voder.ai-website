---
## NOW

Commit and push the updated CI workflow file (.github/workflows/ci.yml) to the remote main branch.

## NEXT

- Run `npm ci` and then `npm run test:ci` locally to confirm that the new “build → preview → test:e2e” workflow passes all 15 Playwright tests (including the brandentry canvas test) on Chromium, Firefox, and WebKit.  
- Review the GitHub Actions page for the main branch to ensure the new CI job succeeds across all browsers.

## LATER

- Implement the animated diff scene in `src/lib/components/PromptIterationSection.svelte` using GSAP.  
- Enhance `src/lib/components/BrandEntry.svelte` with WebGL feature detection and provide an `<img>` fallback if the Threlte canvas cannot initialize.  
- Perform a full accessibility audit: add necessary ARIA roles/labels, verify color-contrast ratios, and ensure keyboard navigation across all components.