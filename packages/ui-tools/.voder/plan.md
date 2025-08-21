## PLAN (focused on the NEXT PRIORITY: clean working tree → unblock verification)

## NOW
Run a single commit command to persist the modified .gitignore:
- git commit -am "chore: persist intended .gitignore change"

(One non-interactive command — commits tracked modifications including the changed .gitignore. This makes the working tree clean so verification can run deterministically.)

## NEXT
After the NOW commit completes, follow this strict one-change-per-commit verify loop:

1. Push and run the verify sequence
   - git push origin main
   - npm run type-check && npm run build && npm test
   - Capture all console output (it will be recorded in .voder/history.md). Use the test/type-check output to decide the next single-file fix.

2. If verification fails with TS5097 for a .ts import in tests/testing/helpers.test.ts:
   - Edit the single file tests/testing/helpers.test.ts and change the import:
     - from: '../../src/testing/helpers.ts'
     - to:   '../../src/testing/helpers'
   - Commit & push:
     - git add tests/testing/helpers.test.ts
     - git commit -m "test: remove .ts extension from imports in helpers test"
     - git push origin main
   - Run verify:
     - npm run type-check && npm run build && npm test

3. If verification then fails with TS5097 for a .ts import in tests/testing/setup.test.ts:
   - Edit the single file tests/testing/setup.test.ts and change the import:
     - from: '../../src/testing/setup.ts'
     - to:   '../../src/testing/setup'
   - Commit & push:
     - git add tests/testing/setup.test.ts
     - git commit -m "test: remove .ts extension from imports in setup test"
     - git push origin main
   - Run verify:
     - npm run type-check && npm run build && npm test

4. If verification surfaces failing tests related to renderComponent lifecycle (container ownership / mount/unmount behavior):
   - Edit the single file src/testing/helpers.ts:
     - Track whether the helper created/attached the container (createdByHelper boolean).
     - Only append to document.body when createdByHelper is true.
     - Only remove the container on unmount when createdByHelper is true.
     - Replace silent catch blocks around mount/unmount with console.error(...) so errors are visible to stderr.
   - Commit & push:
     - git add src/testing/helpers.ts
     - git commit -m "fix: renderComponent only removes created container and log mount/unmount errors"
     - git push origin main
   - Run verify:
     - npm run type-check && npm run build && npm test

5. Reactive single-file fixes loop
   - For any new failing test or TypeScript error surfaced by verification, fix exactly one file that addresses that failure.
   - Use a short focused commit message (e.g., fix: correct import path in X.ts).
   - After each commit: git push origin main and run:
     - npm run type-check && npm run build && npm test
   - Repeat until the verification sequence completes successfully (green).

Important rules for NEXT:
- Only one logical file change per commit.
- Always capture/inspect console output from the verify run before deciding the next file to edit.
- If any change requires package.json or dependency edits that affect consumers, include an ADR in docs/decisions/ in the same commit as the package.json change, then run verify.
- Preserve console-first diagnostics: surface errors via console.error/log, not repository files.
- Do not modify files under .voder/ or prompts/.

## LATER
After the verify loop is consistently green, proceed incrementally (one-file-per-commit) to implement the remaining guided work:

1. Accessibility helpers & tests
   - Implement src/testing/accessibility.ts (expectAccessible, getAccessibilityViolations, expectAriaAttributes, expectFocusable, accessibilityTests using jest-axe).
   - Add tests/testing/accessibility.test.ts.
   - Commit each file as a separate commit and run the verify sequence after each.

2. Linting factories & docs
   - Implement src/linting/html.ts, src/linting/css.ts, src/linting/accessibility.ts (if not already present), plus tests.
   - Implement small .markdownlint.json generation helper or document prepare usage; if adding scripts or dependencies, include ADR(s).

3. Scripts and package exports
   - Add standardized scripts incrementally (lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify). Add each script in its own commit.
   - Add dedicated package exports (e.g., "./testing", "./linting") incrementally; any consumer-facing export change must be accompanied by an ADR committed with the package.json change.

4. Integration & policy tests
   - Add export-equivalence.test.ts and package-installation.test.ts once packaging is stable. These may be longer-running; commit them separately and run verify.

5. Coverage expansion
   - Expand tests to meet coverage targets (90% thresholds / public API coverage). Add tests incrementally and run verify after each change.

6. Dependency housekeeping & security checks
   - Re-run npm audit, align any peer/dev version mismatches (document via ADRs), and confirm supply-chain policies are applied in CI.

Guiding constraints for LATER:
- One-file logical changes per commit.
- Create ADRs for dependency or consumer-impacting changes and commit ADRs together with the package.json edits.
- Keep all outputs console-first and avoid creating temporary files in the repository.

If you want, I can now perform the exact textual edit that should be made in the NOW step (i.e., provide the precise git command to run or the exact file change diff for .gitignore if you prefer to revert instead of persisting). Which single NOW action do you want to execute: (A) commit the current .gitignore change (as planned above), or (B) revert the .gitignore change instead?