## NOW

Commit the local edits in `.voder/history.md`, `.voder/plan.md`, `prompts/development-guidelines.md`, and `prompts/voder-website.md` so that the working directory is clean.

## NEXT

- Install all Node.js dependencies by running `npm ci`.  
- Ensure Playwright’s browsers are installed with `npx playwright install --with-deps`.  
- Run the full end-to-end suite locally via `npm run test:ci` to verify that all tests pass and the `outputs/screenshots/` artifacts are up to date.

## LATER

- Audit and improve accessibility (verify text/background contrast ≥ 4.5:1 and refine any failing elements).  
- Refactor styling: consider moving `src/main.css` into a `src/styles/` directory and breaking it into focused modules.  
- Update `vite.config.js` to explicitly set `publicDir: 'public'` for clarity.  
- Polish the Reveal.js slides to match the spec exactly and lay groundwork for Mont-Fort–style 3D/GSAP animations.  
- Plan for a post-launch landing page by componentizing slides and preparing a conventional homepage at `/`.