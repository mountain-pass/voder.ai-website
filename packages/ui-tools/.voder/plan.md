## NOW
Run a single commit to record the pending test edit:
- git commit -am "test: remove .ts extension from imports in helpers test"

## NEXT
1. Push the committed change and run the full verification pipeline to observe the first failing error:
   - git push origin main
   - npm run type-check && npm run build && npm test
   - Carefully inspect console/stderr output (it will be captured in .voder/history.md) and identify the first failing error reported.

2. Enter the single-file reactive loop for that first failure:
   - If the first error is TS5097 for tests/testing/setup.test.ts (import path ends with .ts):
     - Edit exactly one file: tests/testing/setup.test.ts — change the import from '../../src/testing/setup.ts' to '../../src/testing/setup'
     - git add tests/testing/setup.test.ts
     - git commit -m "test: remove .ts extension from imports in setup test"
     - git push origin main
     - npm run type-check && npm run build && npm test
     - Re-inspect console/stderr and repeat the loop for the next first failure.
   - Else if the first failing item is a test assertion about renderComponent lifecycle (container ownership / mount/unmount):
     - Edit exactly one file: src/testing/helpers.ts to:
       - Track whether the helper created/attached the container (createdByHelper boolean).
       - Only append to document.body when the helper created the container.
       - Only remove the container on unmount when createdByHelper is true.
       - Replace silent catches around mount/unmount with console.error(...) so errors appear in stderr.
     - git add src/testing/helpers.ts
     - git commit -m "fix: renderComponent only removes created container and log mount/unmount errors"
     - git push origin main
     - npm run type-check && npm run build && npm test
     - Re-inspect console/stderr and repeat the loop for the next first failure.
   - Else for any other first failure (TypeScript compile error or failing test):
     - Make one focused change to the single file that directly addresses the reported first failure.
     - git add <file>
     - git commit -m "<short, focused message>"
     - git push origin main
     - npm run type-check && npm run build && npm test
     - Re-inspect console/stderr and repeat until the verification sequence completes without errors.

Notes for NEXT:
- Always inspect verification console output before choosing the next file to edit.
- Make exactly one logical file change per commit.
- Preserve console-first diagnostics (use console.error/console.log rather than creating repository files).
- If a dependency change is required, include the ADR in docs/decisions/ bundled with the package.json change (prefer to avoid dependency edits unless essential).

## LATER
Once the single-file reactive loop yields a consistently green verification run, proceed iteratively (one logical file change per commit), running the verification sequence after each change:

1. Implement src/testing/vitest-jsdom.ts (createVitestJsdomConfig) and add tests validating jsdom environment and coverage thresholds.
2. Implement src/testing/accessibility.ts (jest-axe helpers: expectAccessible, getAccessibilityViolations, accessibilityTests) and add tests exercising accessibility checks.
3. Add linting factory modules and tests:
   - src/linting/html.ts
   - src/linting/css.ts
   - src/linting/accessibility.ts
4. Add example template files (one per commit):
   - templates/vitest.config.ts
   - templates/vite.config.ts
   - templates/test-setup.jsdom.ts
5. Incrementally add standardized package scripts (lint, lint:fix, format, format:check, lint:md, lint:md:fix, verify). If adding new devDependencies, include an ADR in docs/decisions/ bundled with the package.json change.
6. Implement dual/dedicated exports in package.json (e.g., "./testing", "./prettier", "./eslint") and add export-equivalence and package-installation integration tests to validate consumer import paths.
7. Increase test coverage toward the 90% target by adding tests for newly implemented modules and public API surfaces.
8. Small quality/security improvements (each as separate commits):
   - Add engines.node to package.json (Node >= 22.6.0) if desired (include ADR if considered a policy change).
   - Validate/normalize consumer-provided postcssConfig inputs in createViteLibraryConfig.
   - Replace remaining silent catches with console-first diagnostics.
   - Add automated test that verifies vitest / @vitest/coverage-v8 version alignment per ADR.

General constraints to observe throughout:
- One logical file change per commit.
- Run verification after every commit: npm run type-check && npm run build && npm test.
- Do not modify .voder/ or prompts/.
- Use only non-interactive POSIX-compatible commands.
- Bundle ADR with package.json changes when adding dependencies.