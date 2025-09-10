## NOW

Create a focused branch for adding minimal unit tests to raise coverage:

- git switch -c fix/add-unit-tests-coverage

## NEXT

1. Add minimal, co‑located unit tests targeting the entry modules to raise baseline coverage:
   - Create tests/ or co-locate tests next to modules: tests/app.test.ts (covers src/app.ts) and tests/main.test.ts (covers src/main.ts behavior, DOMContentLoaded handling).
   - Implement tests using Vitest and jsdom (use existing tests/setup.ts).
   - Run coverage locally and capture output: npm run test:coverage 2>&1 | tee test-coverage.log
2. If coverage threshold or other verify gates fail, iterate with focused fixes:
   - Inspect test-coverage.log and/or verify.log to find the earliest failing gate (type-check, lint, format, build, or test:ci).
   - Reproduce the failing gate in isolation and capture logs:
     - npm run type-check 2>&1 | tee tsc.log
     - npm run lint:check 2>&1 | tee eslint-check.log
     - npm run format:check 2>&1 | tee format-check.log
     - npm run build 2>&1 | tee build.log
     - npm run test:ci 2>&1 | tee test-ci.log
   - Make the minimal code/config change required to pass that gate (small test, small code fix, or narrow config tweak that does not touch prompts/ .voder/).
   - Re-run only the failing gate until it passes locally.
   - Commit changes to the branch: git add <files>; git commit -m "test: add minimal unit tests for app/main + fix <gate> — <reason>"
   - Push and open a PR: git push -u origin fix/add-unit-tests-coverage
3. When tests and local gates pass, run the full verify locally and capture output for CI traceability:
   - npm run verify 2>&1 | tee verify.log
   - Attach logs to the PR and ensure CI runs the same verify sequence.

## LATER

1. Merge the branch once CI verification is green and artifacts (coverage HTML/JSON, verify.log, lint/tsc logs) are uploaded by CI.
2. Stabilize coverage progressively:
   - Create a small coverage roadmap (modules ordered by impact) and add co‑located tests in small increments to reach thresholds.
   - If a threshold temporarily blocks progress, document an ADR or a short-term threshold adjustment with a clear restoration timeline.
3. Improve developer ergonomics:
   - Add lint-staged to auto-format staged files while keeping pre-commit hooks check-only.
   - Update docs/DEVELOPER-SETUP.md with explicit reproduction steps and CI artifact locations (paths and how to download).
4. Automate dependency and verify hygiene:
   - Enable Dependabot/Renovate and require the full verify pipeline for dependency PRs.
   - Ensure CI fails when package-lock.json changes are not included with dependency updates.
5. Add CI artifact policies:
   - Configure CI to always upload tsc.log, eslint-check.log, format-check.log, test-ci.log, and coverage HTML when verify runs (success or failure).
