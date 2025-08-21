## PLAN (now / next / later)

## NOW
Commit and push the modified .voder metadata files to the main branch with a single atomic commit:
- Action: Commit the currently modified files under .voder/ with message "chore: persist .voder metadata updates" and push to origin/main.

(Goal: restore a clean, committed repository state for reliable verification. Do not modify any other files in this step.)

## NEXT
After the .voder metadata commit is pushed, perform the following sequence (follow the conditional flow exactly; each remediation must be a single focused change/commit/push and then re-run the canonical verification):

1. Run the canonical verification once (capture console output):
   - Command: npm run type-check && npm run build && npm test

2. If the canonical verification PASSES:
   - a) Confirm working tree is clean:
       - Command: git status --porcelain
       - If any non-.voder changes appear, stage & commit them as single logical commits following the atomic rule.
   - b) Ensure build outputs are not tracked:
       - Check: git ls-files | grep '^dist/' || true
       - If any dist/ files are tracked, perform exactly one atomic remediation: git rm --cached -r dist/ && git commit -m "chore: remove tracked build artifacts (dist/)" && git push origin main, then re-run the canonical verification.

   - After verification and untracked dist/ are confirmed, proceed to LATER.

3. If the canonical verification FAILS:
   - a) Run diagnostics (non-interactive, capture console output):
       - git ls-files | grep '^dist/' || true
       - tsc -p tsconfig.json --listEmittedFiles || true
       - npm run build
   - b) Based on diagnostics, choose exactly one focused remediation (one logical change → one commit → push → re-run canonical verification). Only one remediation is allowed per failure cycle. Pick the remediation that matches the diagnostic result:
       - If package-structure tests fail because dist files are missing: run npm run build, then if that produces legitimate files that must be tracked (rare), commit only the necessary build-related repository changes and push; otherwise re-run verification.
       - If package-structure tests fail because dist files are tracked: run git rm --cached -r dist/ && git commit -m "chore: remove tracked build artifacts (dist/)" && git push origin main.
       - If TypeScript errors indicate outDir collisions or TS5055: update tsconfig.json.outDir to a non-overlapping path (single edit), commit that one change with a clear message, push, then re-run verification.
       - If tests fail due to ESM import file-extension errors: fix the single failing import to use the correct .js extension (single file change), commit, push, re-run verification.
       - If tests fail with "Cannot find module '<pkg>'": install only that single missing devDependency non-interactively (npm install --no-audit --no-fund --save-dev <pkg>), create an ADR describing the dependency (if this is a new direct dependency), commit package.json/package-lock.json and the ADR together, push, then re-run verification.

   - c) After the single remediation and re-run, repeat the diagnostics/remediation loop only if verification still fails. Always make one focused change per loop.

Operational rules for NEXT
- Do not modify files under .voder except to commit the tracked changes already made (.voder files may be committed only in the NOW step or if previously staged).
- Keep each remediation atomic: exactly one logical change, one commit, one push, then re-run the canonical verification.
- All console output from commands must be captured to the console (history persists to .voder/history.md).
- All commands must be non-interactive and run in the current working directory.

## LATER
Once the repository is clean and the canonical verification runs reliably, advance implementation incrementally (one logical change + tests + verification per commit):

1. Implement core missing modules (one module + tests per commit):
   - Commit A: src/build/vite-library.ts + tests/build/vite-library.test.ts — implement createViteLibraryConfig (ESM-only formats + postcss injection), run canonical verification.
   - Commit B: src/testing/vitest-jsdom.ts + tests/testing/vitest-jsdom.test.ts — implement createVitestJsdomConfig, run verification.
   - Commit C: src/testing/setup.ts + tests for setup utilities — implement setupJsdomTestEnvironment, run verification.
   - Commit D..: src/testing/helpers.ts and src/testing/accessibility.ts + unit tests — implement renderComponent, simulateClick, expectAccessible, getAccessibilityViolations, accessibilityTests; run verification after each.

2. Add mandated scripts and documentation (one logical addition per commit):
   - Add lint, lint:fix, format, format:check scripts to package.json (each script can be its own commit).
   - Add lint:md and lint:md:fix and required prepare/voder scripts if not yet present.
   - Add a self-contained README.md (draft) at package root (single commit).
   - Add CHANGELOG.md stub (single commit).
   - Generate or add .markdownlint.json via the prescribed getConfig() pattern (single commit).

3. Implement dual-export strategy and integration tests incrementally:
   - Add dedicated exports in package.json (one export path per commit, e.g., "./testing", "./postcss", "./linting"), update src/index.ts accordingly, add tests verifying export-equivalence and package-exports behavior after each export addition, run verification.

4. Expand test coverage iteratively:
   - Add package-installation integration test (tests/package-installation.test.ts) after dist exports and lockfile are stable.
   - Add error-condition and public-API tests to reach coverage goals (iterate until coverage threshold met).
   - Add automated tests to assert dependency/version alignment where ADRs require it (e.g., vitest vs @vitest/coverage-v8 alignment).

5. ADR & dependency governance:
   - For any new direct dependency introduced during LATER work, author and commit an ADR in docs/decisions/ that documents the dependency change and rationale, and commit it together with package.json/package-lock.json changes.

6. Housekeeping:
   - Remove any accidental tracked build outputs (if still present) in a single atomic commit (git rm --cached -r <paths>).
   - Tighten types / small refactors (e.g., remove broad any in vite.config.ts) as separate, small commits with verification.

General constraints that apply throughout LATER
- Each change must be small and atomic (one logical change per commit), include tests where applicable, and be validated by the canonical verification immediately after the commit.
- Do not modify or create files under .voder except to commit previously staged/tracked changes from NOW.
- Always produce console-first diagnostic output; do not create repository-visible temporary/log files.
- Follow ADR rules: bundle ADRs with dependency changes.

---

If you want, I can now produce the exact non-interactive commands for the NOW step (git add/commit/push) or proceed to run the canonical verification after you confirm the .voder commit has been made. Which would you like me to prepare next?