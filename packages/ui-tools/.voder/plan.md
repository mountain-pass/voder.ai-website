## NOW

Commit and push the modified .voder tracking files so the repository is in a clean, synchronized state.

Rationale: the assessment’s NEXT PRIORITY requires a clean VCS state before implementing the vertical slice. Do this as a single atomic action now (stage the modified .voder files, commit with a clear message, and push the branch to origin).

Suggested command to run locally (POSIX, non-interactive):
git add .voder && git commit -m "chore(ui-tools): update voder tracking files" && git push

(If you prefer not to run commands right now, perform the equivalent in your environment — the single action is: commit and push the .voder/* modifications to origin/main.)

---

## NEXT

After the NOW action completes successfully, implement the minimal safe vertical slice (PostCSS factory + test + TS config + scripts + dev toolchain) and validate it end-to-end. Execute the following steps in order, each as a small iteration (make one change → validate → commit → push):

1) Create source + test directories and files
- mkdir -p src/build tests/build

2) Add PostCSS factory source
- src/build/postcss.ts as described in the vertical-slice plan (createPostCSSConfig using autoprefixer).

3) Add a minimal public export barrel
- src/index.ts exporting createPostCSSConfig and type.

4) Add a small Vitest unit test
- tests/build/postcss.test.ts that imports the factory and asserts that cfg.plugins is an array and contains autoprefixer (the test shown in the previous plan is appropriate).

5) Add a minimal tsconfig.json
- Include src and tests and enable declaration generation and strict mode (use the tsconfig content from the previous plan).

6) Update package.json scripts (type-check, test, test:watch, build)
- Add "type-check": "tsc --noEmit", "test": "vitest run", "test:watch": "vitest", "build": "tsc -p tsconfig.json".

7) Install minimal devDependencies (non-interactive)
- npm install --no-audit --no-fund --save-dev typescript vitest @types/node postcss autoprefixer @testing-library/dom jest-axe

8) Run local validation (console-first)
- npm run type-check
- npm test
- If either fails, fix the smallest failing issue in-source, re-run the two commands, and repeat until both succeed.

9) Commit and push the vertical slice
- Stage committed files: src/, tests/, tsconfig.json, package.json, package-lock.json
- Commit message: "feat(ui-tools): add minimal PostCSS factory + tests; add tsconfig and test scripts"
- Push to origin/main

Notes and constraints for NEXT:
- Do each change in small commits so each validation step is atomic and reversible.
- Do not modify files under .voder/ or prompts/.
- All commands must be non-interactive and POSIX-compatible.
- Keep console output visible: record and review type-check and test outputs before committing.
- If a new direct dependency is introduced beyond the minimal set, note it for an ADR (per governance) and add the ADR when committing package.json changes.

---

## LATER

Once the vertical slice is green and pushed, continue incrementally (each change: implement → validate → commit → push). Prioritized sequence:

1) Implement createViteLibraryConfig
- Add src/build/vite-library.ts per the guide.
- Add tests tests/build/vite-library.test.ts that assert formats ['es'] and css.postcss exists.
- Validate type-check and tests, commit, push.

2) Implement core testing utilities (jsdom)
- Add src/testing/vitest-jsdom.ts, src/testing/helpers.ts, src/testing/accessibility.ts, src/testing/setup.ts (start small; e.g., implement setup + basic helpers and tests).
- Add corresponding unit tests and validate.

3) Implement linting configuration factories and tests
- Add src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts and unit tests validating returned shapes.

4) Add standard package scripts & quality tooling (incrementally)
- Add clean, lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify, dev, test:ci to package.json.
- Incrementally install eslint, prettier, markdownlint-cli2, and other tooling as devDependencies. For each new direct dependency, create an ADR and include it with the package.json change.

5) Add README.md (consumer-facing) and CHANGELOG.md (use template)
- Ensure README is self-contained (no internal paths) and includes the security posture. Run markdown linting (lint:md) and fix issues.

6) Add package-structure and export-equivalence tests
- Implement tests to verify package.json exports point to dist/ artifacts. If required to validate these tests, add a minimal build step that produces dist/ files in a gitignored way.

7) Supply-chain & engines
- Add "engines": { "node": ">=22.6.0" } to package.json (per ADR) when TS config exports are added.
- Run `npm audit` and remediate high/critical issues. Integrate SCA into the verify pipeline.

8) Revisit prepare script safely
- After performing an audit of ../../setup-package-docs.js (or implementing a local safe alternative), re-enable prepare behavior or keep it intentionally skipped with documentation.

9) Expand test coverage and CI-style checks
- Add package-installation integration tests (temp package install) and export integration tests as described.
- Work toward the coverage thresholds and other success criteria defined in the Universal Guide.

10) Ongoing governance
- For every new direct dependency added beyond the minimal dev set, author an ADR documenting rationale and include it in the same commit as the package.json change.

---

If you want, I can now produce the exact file contents and POSIX commands for the NEXT steps (create files, package.json edits, and npm install commands) so you can run them non-interactively. Which step should I prepare the concrete file+command artifacts for next — NOW (commit .voder files) or the first NEXT step (create src/build/postcss.ts and test)?