---
## NOW

Commit all current changes as a stabilization checkpoint to preserve the cleaned and updated project state, including removal of legacy files and the addition of the new `svelte.config.js` configuration file.

## NEXT

- Begin replacing the placeholder content in `src/routes/+layout.svelte` and `src/routes/+page.svelte` with the actual minimalist site structure.  
- Add footer text "Voder. 2025." and set up all necessary SEO meta tags including description and Open Graph in the layout or page files as appropriate.  
- Start building the narrative pitch deck experience leveraging Reveal.js in `src/routes/+page.svelte`, implementing content sections and visual styles as per the project specification and ADRs.  
- Update or verify Playwright end-to-end tests reflect any new content or structural changes.  
- Run and validate the full E2E test suite locally using `npm run test:ci` ensuring all tests pass and screenshots conform to requirements.

## LATER

- Integrate advanced scroll-tied animations using GSAP and immersive 3D scenes with Threlte as described in the project vision.  
- Add subtle audio cue effects at key moments to enhance cinematic pacing.  
- Optimize all assets and bundle for mobile, tablet, and desktop performance.  
- Configure and finalize CI/CD deployment workflows on Vercel or Netlify.  
- Prepare the cinematic homepage for migration to `/pitch` or `/about` after launch and develop a conversion-focused landing page at root (`/`) with full marketing content.