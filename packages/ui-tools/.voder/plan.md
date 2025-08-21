## NOW

Edit a single file: tests/testing/helpers.test.ts — change the import path
- Change import from:
  - '../../src/testing/helpers.ts'
- To:
  - '../../src/testing/helpers'

(One logical file edit only. Do not perform any other edits in this step.)

## NEXT

After the single-file edit above, perform the verify loop and the conditional single-file fixes in strict one-change-per-commit iterations:

1. Commit, push, and verify (run after the NOW edit)
   - Stage & commit:
     - git add tests/testing/helpers.test.ts
     - git commit -m "test: remove .ts extension from imports in helpers test"
     - git push origin main
   - Run non-interactive verification:
     - npm run type-check && npm run build && npm test
   - Capture console output to the project console (it will be recorded in .voder/history.md) and use it to decide the next single-file change.

2. If verification fails with TS5097 complaining about .ts imports in setup test, fix that single file
   - Edit tests/testing/setup.test.ts: change import '../../src/testing/setup.ts' → '../../src/testing/setup'
   - Commit message: test: remove .ts extension from imports in setup test
   - git add, git commit, git push, then run:
     - npm run type-check && npm run build && npm test

3. If verification now shows failing tests related to renderComponent lifecycle (container removal or mount/unmount behavior), apply the single-file fix:
   - Edit src/testing/helpers.ts to perform one logical change:
     - Track whether the helper created/attached the container (createdByHelper boolean).
     - Only append to document.body when createdByHelper is true.
     - Only remove the container on unmount when createdByHelper is true.
     - Replace silent catch blocks around mount/unmount with console.error(...) so errors are visible on stderr.
   - Commit message: fix: renderComponent only removes created container and log mount/unmount errors
   - git add, git commit, git push, then run:
     - npm run type-check && npm run build && npm test

4. Reactive single-file fixes loop
   - For any new failing test or TypeScript error surfaced by the verification run, fix exactly one file that addresses the failure (no multi-file commits).
   - Use a short descriptive commit message (e.g., fix: correct import path in X.ts).
   - After each commit: git push origin main and run:
     - npm run type-check && npm run build && npm test
   - Repeat until the verification sequence completes successfully (green).

Notes for NEXT
- Keep each iteration minimal: one file edit → commit → push → verify.
- If any edit requires adding/changing package.json (dependencies or exports) that affect consumers, create an ADR in docs/decisions/ documenting the dependency/export change and include the ADR in the same commit as the package.json change, then run verification.
- Preserve console-first policy: surface diagnostics with console.error/log so outputs are captured in .voder/history.md for future triage.
- Do not modify files under .voder/ or prompts/.

## LATER

Once the verification loop is consistently green, proceed incrementally (one file/one commit at a time) to implement remaining prioritized work:

1. Accessibility helpers & tests
   - Implement src/testing/accessibility.ts (expectAccessible, getAccessibilityViolations, expectAriaAttributes, expectFocusable, accessibilityTests using jest-axe).
   - Commit: feat: add accessibility testing utilities
   - Add unit tests tests/testing/accessibility.test.ts.
   - Commit: test: add accessibility unit tests
   - After each commit: push and run the verification sequence.

2. Ensure build/config factories are tracked as source
   - Confirm src/build/postcss.ts and src/build/vite-library.ts exist and are tracked. If missing, add them.
   - Commit: feat: add PostCSS and Vite library config factories
   - Push and verify.

3. Unit tests for build/config factories
   - Add tests/build/postcss.test.ts and tests/build/vite-library.test.ts (simple shape and inclusion assertions).
   - Commit: test: add build configuration tests
   - Push and verify.

4. Markdown lint generator or documentation
   - Implement small generator (scripts/generate-markdownlint-config.ts) or add explicit docs showing prepare usage.
   - If adding markdownlint-cli2 or changing scripts/package.json, include ADR documenting the change.
   - Commit message: feat: add markdownlint config generator OR chore: document prepare usage
   - Push and verify.

5. Add standardized scripts & package subpath exports (one change at a time)
   - Add scripts: lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify — add each script/update as its own commit.
   - Add package.json exports (e.g., "./testing", "./prettier", "./eslint") incrementally; any consumer-impacting export or dependency change MUST be accompanied by an ADR committed with the change.
   - After each commit: push and run verification.

6. Integration tests required by policy (longer-running)
   - Add tests/export-equivalence.test.ts and tests/package-installation.test.ts once core functionality and packaging are stable.
   - Commit messages:
     - test: add export-equivalence tests
     - test: add package-installation integration test
   - Push and run verification (these tests may take longer).

7. Iterate test & implementation fixes to reach coverage targets
   - Expand tests to cover public API, error scenarios, and edge cases until coverage thresholds are met.
   - Keep changes small, test-driven, and follow the one-file-per-commit rule.
   - Commit messages should be clear and focused (test: add X coverage; fix: handle X error case).

General LATER rules
- Always make single-file logical changes per commit.
- Create ADRs whenever adding/updating dependencies or changing exports that affect consumers.
- After every change: git push origin main and run:
  - npm run type-check && npm run build && npm test
- Preserve repository cleanliness: do not create output files in the repo (use OS temp dirs if temporary files are absolutely necessary).
- Maintain console-first diagnostics: prefer console.error/log rather than writing repo files for debugging.