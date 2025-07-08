## NOW
Run a production build to confirm that the recent change compiles without errors:
```bash
npm run build
```

## NEXT
1. Verify the two critical end-to-end tests that were previously failing:
   ```bash
   npx playwright test tests/fonts.spec.js tests/why.spec.js
   ```
2. If **tests/fonts.spec.js** still fails with 404, ensure the font files are served from `/fonts` by copying them from `static/fonts/` into the SvelteKit static directory:
   - Copy `static/fonts/Inter-Regular.woff2` → `static/fonts/Inter-Regular.woff2`
   - Copy `static/fonts/Satoshi-SemiBold.woff2` → `static/fonts/Satoshi-SemiBold.woff2`
3. If **tests/why.spec.js** fails, inspect `src/lib/components/WhySection.svelte` to ensure:
   - The heading has `id="why-heading"`.
   - The immediately following `<p>` has no extra siblings between it and the `<h1>`.

## LATER
- Run the full Playwright suite and fix any remaining failures (console errors, skip-link focus, responsive layout, narrative sections, animations, accessibility, monitoring).
- Add or adjust tests for motion-reduction (`prefers-reduced-motion`) and any other uncovered requirements.
- Review bundle sizes in `build/`, refine `vite.config.js` manual chunks to optimize first-load performance.
- Once all tests pass and performance budgets are met, commit all changes, update ADRs if needed, and push to trigger CI.