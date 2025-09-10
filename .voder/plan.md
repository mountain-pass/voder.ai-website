The previous plan repeated adding E2E CI and tests that—per the provided history—have already been implemented. That would be incorrect.

Corrected plan follows.

## NOW

Create a GitHub Actions workflow file at .github/workflows/e2e-stability.yml that runs the existing Playwright E2E suite nightly, collects pass/fail counts across browsers, and uploads a concise stability report artifact (JSON + plain-text summary) and Playwright artifacts (traces/screenshots) for triage.

## NEXT

1. Stabilize Playwright runs
   - Add Playwright retries and traces-on-failure in playwright.config.ts (retries: 2 for CI, trace: 'on-first-retry').
   - Update E2E tests to use robust selectors (data-test attributes) where needed; mark flaky selectors and add retries/waits where non-deterministic behaviour occurs.
2. Raise unit test coverage to ≥90%
   - Add focused Vitest unit tests under tests/coverage-boost/ targeting uncovered utilities (health-check-utils, prepare-libraries logic, config factories).
   - Re-run coverage and iterate until global thresholds are met; prefer unit tests for coverage rather than forcing E2E coverage merges.
3. CI integration and artifact retention
   - Ensure the main CI workflow uploads Playwright artifacts on failure (traces/screenshots/videos) and that the nightly e2e-stability job always uploads the stability report.
   - Add a short summary step that prints the last 7-day pass rate (consuming artifacts or job history) to the nightly job logs for maintainers.
4. Document run & triage process
   - Update README.md and docs/DEVELOPER-SETUP.md with:
     - how to run E2E locally (build + preview + playwright test),
     - location of CI E2E artifacts,
     - how to interpret nightly stability reports and whom to notify for flaky investigations.

## LATER

1. Gate merges after stability threshold
   - When nightly stability shows low flakiness (e.g., ≥95% pass rate over 7 days) add the E2E job status context to main branch protection (via GitHub UI or scripted gh api call) to require E2E for merges.
2. Flake detection & auto-retry policy
   - Implement a lightweight flakiness tracker (persisted as workflow artifact or small internal DB) and add automated re-run policy for transient failures, alerting owners when flakiness exceeds thresholds.
3. Visual regression and selective cross-browser runs
   - Add visual snapshot tests for critical hero/vision screens and run them on nightly or release branches. Use selective cross-browser E2E for PRs (e.g., only Chromium on PR; full matrix nightly).
4. Continuous monitoring & reporting
   - Add Slack/email notifications for nightly stability regressions, and include E2E stability metrics in regular release and QA dashboards.

Rationale:
- The history indicates Playwright E2E and CI integration were already implemented; repeating that would be duplicative.
- The immediate next priority is to stabilize E2E runs and raise unit coverage to satisfy the assessment's requirement (global coverage ≥90%) and to enable safe CI gating.
- The NOW action implements a non-blocking nightly stability job that collects data for informed gating decisions without immediately changing branch protection.