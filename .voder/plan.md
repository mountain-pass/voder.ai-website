## NOW
Modify `vite.config.ts` to remove the unused import of the CSS inlining plugin:
- In `vite.config.ts`, delete the line  
  ```ts
  import inlineSource from 'vite-plugin-inline-source';
  ```  
  and ensure the `plugins: []` array remains empty.

## NEXT
- Rebuild and verify performance budgets:  
  ```bash
  npm run build && npm run assert:lhci
  ```
- Run the full end-to-end and accessibility suite across all browsers:  
  ```bash
  npm run test:ci
  ```
- Inspect `dist/index.html` (and related assets in `dist/`) to confirm that CSS is now loaded as external files rather than inlined.

## LATER
- Reintroduce a targeted critical-CSS inlining solution (Beasties or similar) for only above-the-fold styles.
- Add deployment configuration (e.g. `netlify.toml` or equivalent) and merge to `main` to trigger the preview/deploy pipeline.
- After deployment, run live smoke tests for narrative flow, accessibility, and performance, then update `README.md` with hosting details.