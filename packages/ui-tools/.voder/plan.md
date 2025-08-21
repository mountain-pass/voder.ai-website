## NOW

git add .voder/history.md .voder/last-action.md .voder/plan.md && git commit -m "chore(meta): update .voder metadata" || true

## NEXT

1) Remove any accidentally tracked build artifacts from the index (no-op if not tracked) and commit:
- git rm --cached -r dist/ || true && git commit -m "chore: remove tracked build artifacts (dist/)" || true

2) Push local commits to remote main:
- git push origin main

3) Run the verification pipeline (fail-fast; stream output to console/stderr):
- npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

4) Single-file-fix → verify loop (repeat until verification succeeds):
a. Inspect the console/stderr output from step 3 and identify the single highest-priority failing blocker.  
b. Edit exactly one source or configuration file to fix that blocker (DO NOT modify files under `.voder/` or `prompts/`).  
c. Stage & commit only that file:
- git add <that-file> && git commit -m "fix: <short-desc>"  
d. Re-run verification:
- npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr  
e. Repeat steps a–d until the pipeline is green.

5) When the verification pipeline is green, push any remaining commits:
- git push origin main

## LATER

Once the repository is clean and `npm run type-check && npm run build && npm test` passes reliably, proceed incrementally (one small vertical slice at a time). For each item: implement → test → build → commit → run verification.

High-priority next slices (one commit per slice: implementation + tests):

1) Markdown-lint generator & scripts
- Create scripts/generate-markdownlint-config.ts (imports getConfig from @voder/dev-config/linters/markdown and writes `.markdownlint.json`).
- Add package.json scripts: `lint:md` and `lint:md:fix`.
- Commit and run verification.

2) Engines and dependency hygiene
- Add `"engines": { "node": ">=22.6.0" }` to package.json and commit.
- Reconcile jest-axe version mismatch (update package.json and create ADR docs/decisions/0003-align-jest-axe-version.md if changing dependencies); commit both files together.
- Add tests/tests/dependency-versions.test.ts asserting vitest & @vitest/coverage-v8 alignment; commit and verify.

3) Standard quality & verify scripts
- Add lint, lint:fix, format, format:check and the mandatory `verify` script to package.json; commit and run `npm run verify`, fixing issues one file at a time.

4) Implement core public APIs in small vertical slices (one feature + tests per commit)
- Feature A — Vite library config:
  - Add src/build/vite-library.ts and tests/build/vite-library.test.ts; commit and verify.
- Feature B — Vitest jsdom config & setup:
  - Add src/testing/vitest-jsdom.ts, src/testing/setup.ts, and corresponding tests; commit and verify.
- Feature C — DOM testing helpers & accessibility:
  - Add src/testing/helpers.ts, src/testing/accessibility.ts and tests; commit and verify.
- Feature D — Linting config creators:
  - Add src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts and tests; commit and verify.

5) Exports & integration tests
- Update package.json exports to the dual-export pattern (add `./testing`, `./build`, `./eslint`, `./prettier` pointing to `./dist/...`) and commit.
- Add integration tests:
  - tests/export-equivalence.test.ts (dedicated-path vs index)
  - tests/package-installation.test.ts (npm pack → install into temp dir; use safe install flags)
- Commit and verify.

6) README / CHANGELOG / consumer docs
- Create a self-contained README.md and CHANGELOG.md (Unreleased); commit and verify.

7) Coverage & public API tests
- Incrementally add tests to reach required thresholds:
  - 100% coverage of public API exports and error scenarios
  - Overall >= 90% coverage
- Run `npm run test:ci` to collect coverage and iterate fixes one-file-per-commit.

Guiding discipline for LATER:
- Make each change small and atomic; implementation + tests in the same commit.
- Create ADRs for any new direct dependency and commit the ADR alongside package.json changes.
- Never modify files under `.voder/` or `prompts/`.
- Keep `dist/` gitignored; if `dist/` becomes tracked accidentally, remove it with `git rm --cached` and commit that removal.