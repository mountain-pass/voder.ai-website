## NOW

Run the single non-interactive command to persist the tracked .voder metadata files to the repo and push them to origin/main:

git add .voder/history.md .voder/implementation-progress.md .voder/last-action.md .voder/plan.md .voder/progress-chart.png .voder/progress-log-areas.csv .voder/progress-log.csv && git commit -m "chore(ui-tools): persist .voder metadata updates" && git push origin main

## NEXT

1. Untrack any committed build outputs and push that change:
   - git rm -r --cached dist/ || true && git commit -m "chore(ui-tools): untrack build outputs (dist/)" || true && git push origin main

2. Add the missing test environment devDependency required by src/testing/setup.ts and commit the lockfile:
   - npm install --no-audit --no-fund --save-dev @testing-library/jest-dom
   - git add package.json package-lock.json && git commit -m "chore(ui-tools): add @testing-library/jest-dom devDependency for test setup" && git push origin main

3. Run the full verification pipeline (capture and paste full stdout+stderr):
   - npm run type-check && npm run build && npm test

4. If the verification run fails, paste the complete console output here. We will then plan exactly one focused remediation commit to fix the single blocking error and re-run the same verification command.

## LATER

1. After verification succeeds (or is unblocked by one focused remediation), iterate vertical slices (single-purpose commits, run verify after each):

   - Build-factory slice
     - Implement src/build/vite-library.ts exporting createViteLibraryConfig
     - Add tests: tests/build/vite-library.test.ts
     - Export the new API from src/index.ts
     - Commit, push, run verification

   - Testing & accessibility slice
     - Implement src/testing/{vitest-jsdom.ts, helpers.ts, accessibility.ts, setup.ts}
     - Add unit tests for testing helpers and accessibility utilities
     - Add vitest version-alignment test (vitest vs @vitest/coverage-v8)
     - Commit, push, run verification

   - Packaging & export-tests slice
     - Add "main", "types", and "exports" to package.json pointing at dist/
     - Ensure build produces expected files in dist/
     - Add tests: package-structure.test.ts, package-exports.test.ts, export-equivalence.test.ts, package-installation.test.ts
     - Commit, push, run verification

   - Linting & markdown slice
     - Implement src/linting/{html.ts, css.ts, accessibility.ts} and export barrel
     - Implement prepare behavior to generate .markdownlint.json from @voder/dev-config and add lint:md / lint:md:fix scripts
     - Add tests validating markdown config generation
     - Commit, push, run verification

   - Scripts & docs slice
     - Add standardized scripts (verify, lint, lint:fix, format, format:check) to package.json
     - Add self-contained README.md (UNLICENSED, security posture) and CHANGELOG.md
     - Commit, push, run verification

   - ADRs & supply-chain hardening
     - For any new direct dependency or exact-version pinning, add ADR(s) under docs/decisions/ bundled with package.json/package-lock changes
     - Add automated tests/checks verifying dependency alignment and include npm audit in the verify workflow
     - Commit, push, run verification

2. For any failing verification step during these slices, perform exactly one small remediation commit at a time, re-run the same verification command, and paste full output for review before proceeding further.