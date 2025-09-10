## NOW
Update vitest configuration to stop Vitest from discovering Playwright E2E specs: modify vitest.config.ts to exclude the e2e directory (add an exclude pattern such as "tests/e2e/**") so Vitest only runs unit tests.

## NEXT
1. Add separate test scripts and keep test responsibilities explicit
   - package.json: add "test:unit": "vitest run --run", "test:e2e": "playwright test", and change "test" to run only unit tests (or keep existing "test" and document the new commands).
   - Ensure "test:ci" remains a unit-test coverage run (vitest) and add a new "e2e:ci" script that runs Playwright with JSON reporting (npx playwright test --reporter=json --output=test-results/).
2. Harden CI to run unit and E2E separately and upload artifacts
   - CI (.github/workflows/ci.yml): split the test step into two jobs/steps:
     - job A: install deps -> run npm run test:unit -> upload unit coverage artifact.
     - job B (conditional or always after A): install Playwright browsers (npx playwright install --with-deps), build, start preview server in background (use the workflow’s start_server facility or backgrounded preview with a health check loop), run npm run e2e:ci, upload test-results/** and playwright artifacts, and always upload the produced e2e-stability JSON+TXT.
   - Ensure the Playwright job uses the same node version and cache for Playwright browser binaries.
3. Stabilize Playwright runs & improve unit coverage
   - Playwright stability:
     - Confirm playwright.config.ts already has CI retries and trace-on-failure (retries: isCI ? 2 : 0; trace: 'on-first-retry'); if not, add those options (but do not change server start behavior here).
     - Audit flaky selectors used by tests/e2e/*.spec.ts and convert fragile selectors to stable attributes (prefer data-test or data-testid attributes). Mark any known-flaky tests with test.skip or test.fixme temporarily while stabilizing.
   - Coverage boost:
     - Add focused unit tests under tests/coverage-boost/ that target uncovered utility logic:
       - tests/coverage-boost/health-check-utils.boost.test.ts — exercise parseVersion(), compareSemver(), and checkLockfileAndNodeModules with mocks.
       - tests/coverage-boost/prepare-libraries.boost.test.ts — simulate prepare-libraries logic (symlink vs copy) using tmpfs mocks and assert outcomes.
       - tests/coverage-boost/postcss-config.test.ts — load postcss.config.ts and assert plugin list includes autoprefixer (quick coverage).
     - Re-run vitest coverage (npm run test:coverage). Iterate by adding minimal, focused tests until global coverage meets >= 90%.
     - After coverage meets threshold, update vitest.config.ts coverage thresholds to enforce branches/functions/lines/statements = 90.
4. Local/dev docs & runbook
   - Update README.md (and docs/DEVELOPER-SETUP.md) with:
     - how to run unit tests: npm run test:unit
     - how to run e2e locally: npm run build && npm run preview (background) then npm run test:e2e
     - where CI stores Playwright artifacts and nightly stability reports (.github artifact name & test-results/)
     - triage steps for flaky failures (how to retrieve traces and rerun failing tests)
   - Add a small checklist for stabilizing flaky tests and assigning owners for persistent flakiness.

## LATER
1. Gate merges on reliability
   - When nightly stability reports show a stable pass-rate (e.g., ≥95% over 7 days), add the E2E job status context to branch protection so merges require the unit job to pass and (optionally) pass the E2E stability gate.
2. Flake detection & automated remediation
   - Implement a simple flakiness tracker persisted as an artifact (or lightweight DB) that records per-test pass rates across nightly runs and triggers owner notifications when flakiness exceeds thresholds.
   - Optionally implement an automatic re-run policy for transient failures in CI (e.g., re-run failing job up to N times before alerting).
3. Visual/regression & selective cross-browser policy
   - Add visual snapshot tests for critical hero/vision screens and run them nightly or on release branches.
   - For PRs, run a lightweight E2E (Chromium only) and run the full cross‑browser matrix nightly.
4. Monitoring & reporting
   - Surface the nightly 7‑day pass rate in a dashboard (Slack, email, or GitHub comment) and add a short stability summary to the nightly job logs for maintainers.
   - Consider a periodic report that summarizes flaky tests, recent changes correlated with regressions, and owners assigned for remediation.

Rationale: the single NOW action immediately eliminates the test-runner collision (Vitest importing Playwright specs), which is blocking reliable unit test execution and coverage work. The NEXT steps sequence separates unit and e2e runners, stabilizes Playwright runs, raises unit test coverage to the required threshold, and updates CI so artifacts and nightly stability reports are consistently produced and available for triage. The LATER items cover gating, flake management, and long-term reliability and observability.