<scratchpad>
Goal: Focus on NEXT PRIORITY from assessment: "Restore a clean, synchronized repository state (VERSION_CONTROL first). This is gate for everything else."

We must produce a NOW that is exactly one action (one command). .gitignore is modified and tracked, so commit it via git commit -am "..." — single command acceptable. Use -m message provided in prior plan.

NEXT: after that, sequence of commands non-interactive: add docs/libraries/usage/postcss.md, commit; optionally commit docs/decisions/README.md (conditionally: include steps but note skip if not intended); push; run verification pipeline (type-check, build, test) with fail-fast and output to console; single-file-fix loop instructions with commands for staging/committing changed file and re-run verification. Must ensure not to change .voder/ or prompts.

LATER: series of implementation tasks—markdown-lint generator script, add scripts to package.json, engines and dependency reconciliation (jest-axe), add vitest dependency-version test, add quality scripts and verify script, implement createViteLibraryConfig and tests, add vitest-jsdom & setup, testing helpers and accessibility, linting configs, dual export updates, export-equivalence & installation tests, README/CHANGELOG, increase coverage. Provide commands for creating files and commits; but must not attempt to run interactive commands. Use explicit git add/git commit commands. For code files, include example paths but not file content. Encourage single-file-change → verify discipline.

Ensure we follow constraints: don't modify .voder or prompts, no interactive commands, POSIX allowed.

Now prepare final plan.
</scratchpad>

## NOW

Run a single non-interactive git command to commit the tracked .gitignore change:
- git commit -am "chore: deduplicate .gitignore entries (prompt-assets/)"

## NEXT

After the NOW commit succeeds, run the following ordered, non-interactive steps to restore repository hygiene and verify the package. Execute each command in sequence; if a command's target file is already committed or absent, skip that particular add/commit and continue.

1. Add and commit the untracked PostCSS usage doc:
   - git add docs/libraries/usage/postcss.md && git commit -m "docs: add PostCSS usage doc for @voder/ui-tools" || true

2. (Optional) If you intend to commit the decision README update, add and commit it (skip if you do not intend this change):
   - git add docs/decisions/README.md && git commit -m "docs(decisions): update decisions README" || true

3. Push all commits to origin/main:
   - git push origin main

4. Run the verification pipeline (fail-fast; stream output to console/stderr):
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

5. If verification fails, follow this single-file-fix → verify loop until the pipeline succeeds:
   - a) Inspect the console output from step 4 to identify the single highest-priority failing blocker.
   - b) Edit exactly one source or config file (do NOT change files under .voder/ or prompts/) to fix that blocker.
   - c) Stage and commit only that file (replace <that-file> with the exact path):
       - git add <that-file> && git commit -m "fix: <short description of the fix>"
   - d) Re-run step 4 (npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr) and repeat the loop if necessary.

Notes and behaviour:
- All commands above are POSIX-non-interactive. Use the exact file paths for git add/commit. The `|| true` after the optional commits ensures the sequence continues if the file is absent or already committed.
- Do NOT modify or stage any files under .voder/ or prompts/.
- Keep each fix small and atomic: change exactly one file, run verification, commit, and repeat until green.
- When verification is green, push any remaining commits (git push origin main).

## LATER

Once the repository is clean and the verify pipeline passes consistently, proceed incrementally (one small vertical slice at a time: implement → test → build → commit → push). Example prioritized LATER tasks (each step is a set of commands to be executed as small commits; run the verify pipeline after each commit):

1. Implement markdown-lint setup and CLI scripts
   - Create generator script at scripts/generate-markdownlint-config.ts that imports getConfig from @voder/dev-config/linters/markdown and writes .markdownlint.json (use OS-safe file writes).
   - git add scripts/generate-markdownlint-config.ts && git commit -m "chore: add markdownlint config generator"
   - Update package.json scripts:
     - add "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md"
     - add "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md"
   - git add package.json && git commit -m "chore(scripts): add markdownlint CLI scripts"
   - Run verify: npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

2. Harden package.json and dependency hygiene
   - Add engines field to package.json:
     - Edit package.json to include "engines": { "node": ">=22.6.0" }
     - git add package.json && git commit -m "chore: set engines.node >=22.6.0"
   - Reconcile jest-axe version mismatch:
     - Choose intended major (e.g., align to ^10.0.0) and update package.json peerDependencies/devDependencies accordingly.
     - If this is a governance decision, create an ADR: docs/decisions/0003-align-jest-axe-version.md
     - git add package.json docs/decisions/0003-align-jest-axe-version.md && git commit -m "chore(deps): align jest-axe version and document decision"
   - Add a small Vitest test to assert vitest & @vitest/coverage-v8 version alignment (tests/dependency-versions.test.ts).
     - git add tests/dependency-versions.test.ts && git commit -m "test: add vitest/coverage-v8 version alignment test"
   - Run verify.

3. Add standardized quality scripts and the composed verify script
   - Update package.json scripts:
     - "lint": "eslint . --ext .ts,.js"
     - "lint:fix": "eslint . --ext .ts,.js --fix"
     - "format": "prettier --write ."
     - "format:check": "prettier --check ."
     - "verify": "npm audit fix --force && npm run lint:fix && npm run lint:md:fix && npm run format && npm run build && npm run test:ci"
   - git add package.json && git commit -m "chore(scripts): add standard quality and verify scripts"
   - Run npm run verify iteratively, fix one-file issues at a time via the single-file-fix discipline.

4. Implement core public APIs in small vertical slices (one feature + tests + commit each)
   - Feature A: createViteLibraryConfig
     - Add src/build/vite-library.ts and tests/tests/build/vite-library.test.ts
     - git add files && git commit -m "feat(build): add createViteLibraryConfig + tests"
     - Run verify.
   - Feature B: createVitestJsdomConfig & setupJsdomTestEnvironment
     - Add src/testing/vitest-jsdom.ts and src/testing/setup.ts with tests
     - Commit and verify.
   - Feature C: renderComponent & accessibility helpers
     - Add src/testing/helpers.ts and src/testing/accessibility.ts with DOM tests (jsdom)
     - Commit and verify.
   - Feature D: linting config creators
     - Add src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts with tests
     - Commit and verify.

5. Expand exports and add integration tests
   - After building new modules, update package.json exports to include dedicated paths (e.g., "./testing", "./build", "./eslint").
   - Add tests:
     - tests/export-equivalence.test.ts — verify dedicated-path vs index exports are equivalent.
     - tests/package-installation.test.ts — run npm pack and install into mkdtemp consumer (use sanitized execSync), then run node test files to assert imports work.
   - git add/commit changes and run verify.

6. Add consumer-facing README and changelog
   - Create README.md (self-contained, do NOT reference internal prompts/ files).
   - Create CHANGELOG.md (Unreleased) from template.
   - git add README.md CHANGELOG.md && git commit -m "docs: add README and CHANGELOG"
   - Run verify.

7. Incrementally raise test coverage to policy thresholds
   - Focus tests to achieve:
     - 100% coverage of public API
     - 100% coverage of error scenarios
     - Overall >= 90% code coverage
   - Add targeted tests, refactor code to be testable, and iterate fix → verify until thresholds are met.
   - Commit small changes and run npm run test:ci to collect coverage data each iteration.

Guiding discipline for LATER:
- Always change one file at a time for bug fixes; for new features, commit implementation and tests together (two-file commit if necessary: src + tests) but keep each PR/commit small and self-contained.
- Create ADRs for any new direct dependency or policy-level decision and commit the ADR alongside the package.json change.
- Never modify files under .voder/ or prompts/ in any of these steps.
- Keep dist/ untracked (ensure .gitignore contains dist/) and rely on builds to produce artifacts for testing; if dist/ becomes tracked accidentally, remove it with git rm --cached <paths> only after ensuring no necessary audit artifacts are lost.

If you want, I can now run the single NOW command (git commit -am ...) for you and then produce the exact shell sequence for the NEXT steps to paste and run locally.