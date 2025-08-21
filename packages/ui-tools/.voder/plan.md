## NOW
Run the single commit to persist the staged .voder metadata:
git commit -m "chore: persist .voder metadata updates" -- .voder

## NEXT
1. Push the commit to the main remote to produce a clean working tree:
   - git push origin main

2. Run the canonical verification pipeline and capture console output (this will be recorded automatically in .voder/history.md):
   - npm run type-check && npm run build && npm test

3. Inspect the verification console output and act with a single focused remediation (do NOT apply multiple fixes at once). Use the diagnostics below only as needed to choose the one remediation to perform:
   - Diagnostics (run only to inform the single remediation):
     - git ls-files | grep '^dist/' || true
     - tsc -p tsconfig.json --listEmittedFiles || true
     - npm run build
   - Based on the verification + diagnostics, choose exactly one remediation (examples):
     - If package-structure tests fail due to missing compiled files: run npm run build (then re-run verification).
     - If package-structure tests fail because dist/ files are tracked: git rm --cached -r dist/ && git commit -m "chore: remove tracked build artifacts (dist/)" -- then push and re-run verification.
     - If TypeScript emits TS5055 or outDir overwrite errors: edit tsconfig.json to change compilerOptions.outDir to a non-overlapping path, commit that single change, push, and re-run verification.
     - If tests fail due to ESM import-extension errors: fix the single failing import (add correct .js extension) in one file, commit, push, and re-run verification.
     - If tests fail with "Cannot find module '<pkg>'": install the single missing devDependency non-interactively (npm install --no-audit --no-fund --save-dev <pkg>), commit package.json/package-lock.json, create an ADR if this is a new direct dependency, push, and re-run verification.

4. After applying the single remediation, re-run the canonical verification (step 2). Repeat the diagnose → single remediation → verify loop until verification passes.

Notes for NEXT
- Do not modify other files under .voder (the only allowed .voder change now is the commit in NOW).
- Keep each remediation atomic: one change, one commit, one push, then re-run verification.
- Record results via console output only — the history capture will make them available for future steps.

## LATER
Once the working tree is clean and the canonical verification passes reliably:

1. Stabilize build/test ordering and developer docs
   - Ensure the verify pipeline runs build before tests that assert dist/ artifacts.
   - Add DEVELOPMENT.md documenting the canonical local verification order: type-check → build → test.

2. Incrementally implement missing modules (one module + tests per commit)
   - Implement src/build/vite-library.ts and tests/build/vite-library.test.ts.
   - Implement src/testing/vitest-jsdom.ts and tests/testing/vitest-jsdom.test.ts.
   - Implement src/testing/helpers.ts, src/testing/accessibility.ts, src/testing/setup.ts and their tests.
   - For each implementation: add minimal code to satisfy tests, commit, push, and run the canonical verification.

3. Add mandated scripts & docs in focused commits
   - Add lint, lint:fix, format, format:check, lint:md, lint:md:fix, and verify scripts to package.json (one script per commit is acceptable but keep changes small).
   - Create a self-contained README.md and a CHANGELOG.md stub (separate commits).

4. Implement dual-export strategy & integration tests incrementally
   - Add dedicated exports to package.json (e.g., "./testing", "./postcss", "./linting") — one export per commit.
   - Add export-equivalence tests and package-installation integration tests (one test file at a time).

5. Expand tests & coverage progressively until coverage goals are met
   - Add public-API error-condition tests and remaining mandatory test categories to drive coverage toward project thresholds.

6. Governance for dependencies
   - For any new direct dependency added during LATER work, create an ADR that documents the change and bundle it with the corresponding package.json/package-lock changes.

Constraints & reminders
- Do not change or create non-ignored output files in the repository.
- All actions must be non-interactive and scoped to the current working directory.
- After every change that affects code/tests/build, run the canonical verification.
- Keep each change minimal and atomic; always perform exactly one remediation when verification fails.