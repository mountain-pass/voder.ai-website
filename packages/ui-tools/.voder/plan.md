## NOW

Run a non-interactive commit of the unstaged .voder metadata so the working tree is clean:
- git add .voder/* && git commit -m "chore: record .voder metadata updates" || true

## NEXT

After committing the .voder changes, restore verifiable package state and iterate until green:

1. Push the commit to remote:
   - git push origin main

2. Run the full verification pipeline (fail-fast; stream output to console/stderr):
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

3. If verification fails, enter the single-file-fix → verify loop (repeat until the pipeline is green):
   a. Inspect the console/stderr output from step 2 and identify the single highest-priority failing blocker (one file only).  
   b. Edit exactly one source or configuration file (do NOT modify anything under .voder/ or prompts/).  
   c. Stage & commit only that one file:
      - git add <that-file> && git commit -m "fix: <short-desc>"
   d. Re-run verification:
      - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr
   e. Repeat a–d until the pipeline completes successfully.

4. When the verification pipeline is green, push any remaining commits:
   - git push origin main

(Notes: keep every change small and test-driven; use only non-interactive commands; do not modify files under `.voder/` or `prompts/`.)

## LATER

Once the repository is clean and verification consistently passes, proceed incrementally (one vertical slice per commit) to implement the remaining NEXT PRIORITY work and the broader feature set:

1. Markdown linting generator & scripts
   - Create scripts/generate-markdownlint-config.ts that imports getConfig from @voder/dev-config/linters/markdown and writes .markdownlint.json to repo root (non-.voder).
   - Add package.json scripts: "lint:md" and "lint:md:fix".
   - Commit and run verification.

2. Engines & dependency hygiene
   - Add "engines": { "node": ">=22.6.0" } to package.json.
   - Reconcile jest-axe peer/dev mismatch (align ranges or document ADR); commit package.json and ADR together if changing deps.
   - Add tests/tests/dependency-versions.test.ts asserting vitest & @vitest/coverage-v8 alignment.
   - Commit and run verification.

3. Standard quality & verify scripts
   - Add scripts: lint, lint:fix, format, format:check, and the mandatory "verify" script to package.json.
   - Add minimal ESLint/Prettier glue files per dev-config requirements (eslint.config.js, prettier.config.js) if required by lint step.
   - Run npm run verify and fix issues one file at a time via the single-file-fix loop.

4. Implement core public APIs in small vertical slices (each commit = implementation + tests)
   - Feature A: src/build/vite-library.ts + tests/build/vite-library.test.ts
   - Feature B: src/testing/vitest-jsdom.ts and src/testing/setup.ts + tests
   - Feature C: src/testing/helpers.ts and src/testing/accessibility.ts + tests
   - Feature D: src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts + tests
   - After each slice: build, run tests, commit, and push.

5. Exports & integration tests
   - Update package.json exports to adopt the dual-export pattern (map ./testing, ./build, ./eslint, ./prettier to ./dist/).
   - Add integration tests:
     - tests/export-equivalence.test.ts
     - tests/package-installation.test.ts (npm pack → install into a temp dir; use non-interactive flags)
   - Commit and run verification.

6. README / CHANGELOG / consumer docs
   - Add a self-contained README.md and CHANGELOG.md (Unreleased) following README isolation policy (no internal repo links).
   - Commit and run verification.

7. Coverage & public API tests
   - Incrementally extend tests to achieve:
     - 100% coverage of public API exports and error scenarios
     - Overall ≥ 90% coverage
   - Run npm run test:ci to collect coverage and iterate fixes via single-file-fix loop until thresholds are met.

Guiding discipline for LATER
- Make every change small and atomic: implementation + tests in the same commit.
- Create ADRs for any new direct dependency and commit ADR alongside package.json changes.
- Never modify files under `.voder/` or `prompts/`.
- Keep `dist/` gitignored; if tracked again, remove it from the index and commit the removal.