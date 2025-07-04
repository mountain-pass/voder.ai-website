## NOW

Commit the updated `.voder/history.md` file so that there are no unstaged changes in the working directory.

## NEXT

- Install all Node.js dependencies by running `npm ci`.  
- Ensure Playwright’s browsers are installed with `npx playwright install --with-deps`.  
- Execute the full end-to-end suite with `npm run test:ci` to verify all tests pass and that the `outputs/screenshots/` artifacts are up to date.

## LATER

- Conduct an accessibility audit (verify text/background contrast, ARIA attributes, keyboard focus states).  
- Refactor CSS by moving `src/main.css` into a `src/styles/` directory and splitting it into cohesive modules.  
- Update `vite.config.js` to explicitly set `publicDir: 'public'` for clarity.  
- Enhance the Reveal.js deck with Mont-Fort–inspired 3D and GSAP animations.  
- Plan and scaffold a componentized, conventional landing page to introduce post-launch content.