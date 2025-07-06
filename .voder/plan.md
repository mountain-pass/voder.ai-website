## NOW

Capture and commit all current code changes (including updated dependencies, configuration files, new `src/lib/`, new `src/routes/+page.css`, and removal of Reveal.js artifacts) so that the project state is fully saved before rerunning CI.

## NEXT

- Install all dependencies with `npm ci`.  
- Run a clean build (`npm run build`) and ensure there are no SSR or preprocessing errors (the missing-`typescript` issue should now be resolved).  
- Execute the full CI test suite via `npm run test:ci` and verify that Playwright tests pass in Chromium, Firefox, and WebKit.  
- If tests fail, adjust configuration or code (for example, tweak `svelte.config.js` or the preprocess settings) and repeat the build/test cycle until green.  
- Finally, start the dev server (`npm run dev`), inspect `dev-server.log` for errors, and manually scroll through each section to confirm GSAP-powered animations run without console errors.

## LATER

- Add a Playwright suite that programmatically scrolls to each section and asserts that animations trigger (`tests/scroll.spec.js`).  
- Replace placeholder SVG and diff visuals with production-ready Three.js/Threlte scenes.  
- Conduct formal accessibility (contrast, ARIA) and performance (bundle size, CLS) audits and resolve any issues.