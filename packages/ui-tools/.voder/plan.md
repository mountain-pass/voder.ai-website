## PLAN — unblock build/test pipeline (NEXT PRIORITY)

## NOW
Commit the modified .voder metadata so the working tree is clean:
- Action: Stage and commit all currently modified files under .voder/ with a single non-interactive commit message (for example: "chore: commit .voder metadata updates").
  - Purpose: This addresses the highest-priority version-control issue identified in the assessment (a non-clean working tree). Make the repo state clean before performing test/build remediations.

## NEXT
After the .voder metadata commit completes, perform the focused test fix and verification run to unblock the pipeline:

1. Update the smoke test so type-check no longer depends on built artifacts:
   - Edit tests/smoke.test.ts to import the source module instead of the compiled dist path, e.g. change:
     import('../dist/src/index.js')
     → import('../src/index')
   - Save the file.

2. Commit and push the test fix non-interactively:
   - git add tests/smoke.test.ts
   - git commit -m "test: import from src in smoke test so type-check can resolve module"
   - git push origin main

3. Run the combined verification pipeline and capture console output to .voder/history.md (non-interactive):
   - npm run type-check && npm run build && npm test 2>&1 | tee .voder/history.md /dev/stderr

4. Inspect .voder/history.md for results:
   - If the verification completes successfully (type-check, build, tests pass), proceed to LATER plan items.
   - If verification still fails, pick exactly one additional remediation from the original remediation set (A, B, or C) and apply it in a single focused iteration (do not batch multiple remediations). Record the run output to .voder/history.md after each attempt.

Notes:
- All commands must be non-interactive, POSIX-compatible, and scoped to the current working directory.
- Do NOT modify files in .voder/ or prompts/ during these steps (except that .voder files are being committed in NOW as a single allowed action).
- Always capture the verification console output into .voder/history.md.

## LATER
Once the verification pipeline is consistently passing, continue incremental, test-backed implementation work (each change = small implementation + tests + commit + verify):

1. Add unit test for PostCSS factory
   - Create tests/build/postcss.test.ts validating createPostCSSConfig includes autoprefixer and the default browsers list.
   - Commit and run verify.

2. Implement missing modules incrementally (one module + tests per commit)
   - src/build/vite-library.ts + tests/build/vite-library.test.ts
   - src/testing/vitest-jsdom.ts + tests/testing/vitest-jsdom.test.ts
   - src/testing/helpers.ts + tests/testing/helpers.test.ts
   - src/testing/accessibility.ts + tests/testing/accessibility.test.ts
   - src/testing/setup.ts + tests/testing/setup.test.ts
   - src/linting/html.ts, css.ts, accessibility.ts + corresponding tests

3. Add required package scripts and docs (small, focused commits)
   - Add lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify scripts
   - Add a consumer-facing README.md following the README template, and a CHANGELOG.md
   - Commit and run verify after each change

4. Implement dual-export strategy and integration tests
   - Expand package.json exports in small steps (e.g., add "./testing" then verify)
   - Add export-equivalence tests and package-installation integration tests
   - Commit and verify after each addition

5. Enforce dependency & supply-chain policies
   - Add automated tests for vitest ↔ @vitest/coverage-v8 alignment
   - Integrate npm audit checks into verification incrementally
   - Document any dependency decisions with ADRs as required

General constraints for LATER work:
- Keep each change minimal, test-backed, and verifiable with the combined verification pipeline.
- Capture all verification outputs to .voder/history.md.
- Do not modify files in .voder/ or prompts/ except for committing pre-existing changes already discussed.