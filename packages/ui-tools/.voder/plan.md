## NOW
Run the single non-interactive git commit to record the tracked .gitignore change:

git commit -am "chore: deduplicate .gitignore entries (prompt-assets/)"

## NEXT
After the NOW command completes, run the following ordered, non-interactive steps. Execute each command in sequence; if a command's target file is already committed or absent, the command uses `|| true` so the sequence continues.

1) Add & commit the PostCSS usage doc (if not already committed):
- git add docs/libraries/usage/postcss.md && git commit -m "docs: add PostCSS usage doc for @voder/ui-tools" || true

2) Optionally commit the decisions README update (only if you intend to commit it):
- git add docs/decisions/README.md && git commit -m "docs(decisions): update decisions README" || true

3) Push commits to origin/main:
- git push origin main

4) Run the verification pipeline (fail-fast; stream output to console/stderr):
- npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

5) Single-file-fix → verify loop (repeat until verification succeeds):
a. Inspect console/stderr output from step 4 to identify the single highest-priority failing blocker.
b. Edit exactly one source or config file to fix that blocker (do NOT change anything under `.voder/` or `prompts/`).
c. Stage & commit only that file (replace `<that-file>` and `<short-desc>`):
- git add <that-file> && git commit -m "fix: <short-desc>" 
d. Re-run the verification command from step 4:
- npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr
e. Repeat the loop (change one file, commit, verify) until the pipeline is green.

Notes for NEXT:
- All commands are POSIX, non-interactive. The `|| true` on optional commits ensures continuation if the file is absent or already committed.
- Do NOT modify or stage any files under `.voder/` or `prompts/` at any point.
- Keep each fix small and atomic: change exactly one file, run verification, commit, repeat.
- When verification is green, push any remaining commits:
- git push origin main

## LATER
Once the repository is clean and the verify pipeline passes reliably, proceed incrementally (one small vertical slice at a time). For each step: implement → test → build → commit → run verification. Example prioritized tasks and representative non-interactive commands (create files using your editor or a script; the plan lists paths and commit commands — do not run interactive editors here):

1) Markdown-lint generator & scripts
- Create: scripts/generate-markdownlint-config.ts (imports getConfig from @voder/dev-config/linters/markdown and writes `.markdownlint.json`).
- Commit:
  - git add scripts/generate-markdownlint-config.ts && git commit -m "chore: add markdownlint config generator"
- Update package.json scripts (add `lint:md` and `lint:md:fix`):
  - git add package.json && git commit -m "chore(scripts): add markdownlint CLI scripts"
- Verify (run the pipeline from NEXT step 4).

2) Engines and dependency hygiene
- Edit package.json to include engines:
  - add `"engines": { "node": ">=22.6.0" }`
  - git add package.json && git commit -m "chore: set engines.node >=22.6.0"
- Reconcile jest-axe peer/dev mismatch (decide target major, update `package.json` accordingly). If this introduces a dependency change, create an ADR:
  - create `docs/decisions/0003-align-jest-axe-version.md` (commit alongside package.json change)
  - git add package.json docs/decisions/0003-align-jest-axe-version.md && git commit -m "chore(deps): align jest-axe version and document decision"
- Add a test asserting vitest & @vitest/coverage-v8 version alignment:
  - create `tests/dependency-versions.test.ts`
  - git add tests/dependency-versions.test.ts && git commit -m "test: add vitest/coverage-v8 version alignment test"
- Verify.

3) Standard quality & verify scripts
- Update package.json scripts to add lint/lint:fix/format/format:check/verify as required by the guide.
  - git add package.json && git commit -m "chore(scripts): add standard quality and verify scripts"
- Run `npm run verify` iteratively and fix issues one file at a time.

4) Implement core public APIs in small vertical slices (one feature + tests per commit)
- Feature A — Vite library config:
  - Add `src/build/vite-library.ts` and `tests/build/vite-library.test.ts`
  - git add src/build/vite-library.ts tests/build/vite-library.test.ts && git commit -m "feat(build): add createViteLibraryConfig + tests"
  - Verify.
- Feature B — Vitest jsdom config & setup:
  - Add `src/testing/vitest-jsdom.ts`, `src/testing/setup.ts`, and tests.
  - Commit and verify.
- Feature C — DOM testing helpers & accessibility:
  - Add `src/testing/helpers.ts`, `src/testing/accessibility.ts` and tests.
  - Commit and verify.
- Feature D — Linting config creators:
  - Add `src/linting/html.ts`, `src/linting/css.ts`, `src/linting/accessibility.ts` and tests.
  - Commit and verify.

5) Exports & integration tests
- Update `package.json` exports to dual-export pattern (e.g., add `./testing`, `./build`, `./eslint`, `./prettier` paths pointing to `./dist/...`).
  - git add package.json && git commit -m "chore(exports): add dedicated export paths (testing, build, eslint, prettier)"
- Add integration tests:
  - `tests/export-equivalence.test.ts` (dedicated-path vs index)
  - `tests/package-installation.test.ts` (npm pack → install into temp dir; in tests, use `npm install --ignore-scripts` to avoid lifecycle scripts)
  - git add tests/export-equivalence.test.ts tests/package-installation.test.ts && git commit -m "test: add export-equivalence and package-installation integration tests"
- Verify.

6) README / CHANGELOG / consumer docs
- Create `README.md` (self-contained; no internal repo links) and `CHANGELOG.md` (Unreleased).
  - git add README.md CHANGELOG.md && git commit -m "docs: add README and CHANGELOG"
- Verify.

7) Coverage & public API tests
- Incrementally add tests to reach:
  - 100% coverage for public API exports
  - 100% error-scenario coverage for exported functions/classes
  - overall >= 90% coverage
- Add targeted tests; run `npm run test:ci` to collect coverage and iterate one-file-fix at a time.

Guiding discipline for LATER:
- Make small, self-contained commits. For fixes: one file per commit. For new features: include implementation + tests together (minimal files in a single commit).
- Create ADRs for any new direct dependency or policy-level decision and commit the ADR simultaneously with dependency changes.
- Never modify files under `.voder/` or `prompts/`.
- Keep `dist/` gitignored and avoid committing build artifacts; if `dist/` becomes tracked accidentally, remove with `git rm --cached` and commit that removal.

If you want, I can now run the single NOW command for you (the git commit -am line) or provide the exact shell script that sequences the NEXT commands for you to paste and run locally.