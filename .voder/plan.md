---
## NOW

Run a single commit to capture all staged and unstaged changes in tracked files:

Command:
```
git commit -a -m "chore: commit outstanding updates (outputs dir, .gitignore, README, .voder changes, removed old logs)"
```

## NEXT

- Update `README.md` Installation section to state that generated artifacts (screenshots, logs, traces, videos, test-results) will be placed under `outputs/`.  
- Modify `playwright.config.js` so that all Playwright artifacts (`outputDir` for screenshots, traces, videos, testResults) point to `outputs/` instead of `test-results/`.  
- Run `npm run build` then `npm run test:ci`, and verify that the production build succeeds, end-to-end tests pass, and new artifacts land under `outputs/`.

## LATER

- Add visual-regression snapshot tests for key slides at multiple viewports, storing baselines and diffs in `outputs/`.  
- Integrate automated accessibility audits (e.g., axe-core) into the CI pipeline, outputting results to `outputs/`.  
- Refactor the Reveal.js deck into its own `/deck` directory and introduce a standard landing page at `/`.  
- Clean up or remove any remaining draft files in `.voder/` and finalize project documentation.