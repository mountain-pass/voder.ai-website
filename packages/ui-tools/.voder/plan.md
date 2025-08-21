## NOW

Run a single non-interactive commit to record the modified .voder metadata and clean the working tree:
- git commit -am "chore: record .voder metadata updates"

(One command only — commits all currently tracked changes, including the modified .voder files shown in git status. This directly addresses the NEXT PRIORITY: get the repo into a clean state so verification can run.)

## NEXT

1. Run the full verification pipeline and preserve console/stderr output for history:
   - npm run type-check && npm run build && npm test 2>&1 | tee /dev/stderr

2. If verification succeeds:
   - Push the branch: git push origin main
   - Proceed to the LATER steps.

3. If verification fails, follow the single-file-fix loop (repeat until verification succeeds):
   a. Inspect the verification stderr and locate the single highest‑priority error block (one root cause).
   b. Choose and apply a single-file fix that directly addresses that root cause (do NOT edit files under .voder/ or prompts/). Examples:
      - If TypeScript TS5055 (overwrite input) shows up: edit tsconfig.json to ensure "exclude": ["dist"] and correct outDir/declarationDir as needed (single-file edit).
      - If an exports path points to source .ts files: edit package.json exports to point to ./dist/... (single-file edit).
      - If tests expect a compiled file that’s missing and the correct fix is a config change: edit the single config file (tsconfig.json or package.json) that causes the build to emit to the expected path.
      - (If the only viable fix requires removing tracked build outputs, run a single git command to untrack them, e.g., git rm --cached -r dist/ — treat this as the single action for that iteration and commit it as described below.)
   c. Commit only that one file/change non‑interactively:
      - git add <that-file-or-change> && git commit -m "fix: <brief reason addressing root cause>"
   d. Re-run the verification command from step 1 and repeat the loop if there are further failures.

Notes for the loop:
- Keep each iteration minimal: exactly one source/config change per commit.
- Always stream output to console/stderr so results are captured in .voder/history.md.
- Do not modify files under .voder/ or prompts/.
- If you perform a git rm removal to untrack dist/, treat that removal as the single change and commit it in the same iteration.

## LATER

After the repository is clean and verification consistently passes, implement the NEXT‑PRIORITY work incrementally (one small vertical slice per commit), with tests and verification after each item:

1. Markdown linting generator & scripts
   - Add scripts/generate-markdownlint-config.ts that imports getConfig from @voder/dev-config/linters/markdown and writes .markdownlint.json.
   - Add package.json scripts:
     - "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md"
     - "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md"
   - Commit and run the verification pipeline.

2. Engines & dependency hygiene
   - Add "engines": { "node": ">=22.6.0" } to package.json.
   - Add tests/tests/dependency-versions.test.ts to check vitest & @vitest/coverage-v8 alignment.
   - If dependency changes are required, bundle ADR + package.json changes together per governance and run verify.

3. Standard quality & verify scripts
   - Add scripts: "lint", "lint:fix", "format", "format:check", and a "verify" script to package.json per the project conventions.
   - Add minimal ESLint/Prettier glue files (eslint.config.js, prettier.config.js) that import from @voder/dev-config.
   - Commit and run the verification pipeline; fix issues via the single-file-fix loop.

4. Implement core public APIs incrementally (one slice at a time with tests)
   - Slice A: src/build/vite-library.ts + tests/build/vite-library.test.ts
   - Slice B: src/testing/vitest-jsdom.ts and src/testing/setup.ts + tests
   - Slice C: src/testing/helpers.ts and src/testing/accessibility.ts + tests
   - Slice D: src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts + tests
   - After each slice: build, run tests, commit, push.

5. Exports & integration tests
   - Update package.json exports to adopt the dual-export pattern (e.g., ".", "./testing", "./prettier", "./eslint" mapped to ./dist/*).
   - Add tests:
     - tests/export-equivalence.test.ts
     - tests/package-installation.test.ts (pack → install into tmp dir)
   - Commit and run verify.

6. README / CHANGELOG / consumer docs
   - Add a self-contained README.md (no internal repo links) and CHANGELOG.md (Unreleased) with concise API docs for public exports.
   - Commit and run verify.

7. Coverage & public API tests
   - Expand tests to reach 100% public API coverage and ≥90% overall coverage.
   - Use npm run test:ci to collect coverage and iterate via the single-file-fix loop until thresholds are met.

Constraints & reminders
- Never edit files under .voder/ or prompts/.
- Use only non‑interactive commands; each verification-fix iteration must be a single-file change and single commit.
- Preserve console/stderr output for traceability (history captured in .voder/history.md).
- Keep changes small and incremental; verify after every commit.

If you want, I can now execute the NOW command (the non‑interactive commit) or prepare the exact single-file edits you should make in the first single-file-fix iteration if verification fails (for example, the tsconfig.json patch to ensure "exclude": ["dist"]). Which should I do next?