## NOW
Modify scripts/run-e2e.sh so the preview health-check is deterministic and fully logged: make the script resolve the preview port from an explicit env var (PREVIEW_PORT, falling back to VITE_PORT, then to 5173), wait for that port to accept connections, verify the served HTML contains the #app marker (curl | grep '<div id="app' ), tee preview stdout to preview.out continuously (so logs exist immediately), and on any startup/health failure write the canonical empty e2e-stability.json/e2e-stability.txt (with reason in JSON) and exit non-zero.

Why now: this single change directly addresses the NEXT PRIORITY — make preview start/health deterministic and ensure failures produce immediately useful logs and the required e2e-stability artifacts for CI verification.

## NEXT
1. Align Playwright to the deterministic preview URL
   - Update playwright.config.ts to read baseURL from process.env.PREVIEW_URL (compose from PREVIEW_HOST/ PREVIEW_PORT) so test runner and preview orchestration use the exact same host/port.
   - Ensure package.json CI scripts export PREVIEW_PORT/PREVIEW_URL when calling scripts/run-e2e.sh and npx playwright.

2. Harden CI orchestration
   - Change .github/workflows/ci.yml run-e2e step to:
     - set PREVIEW_PORT (and PREVIEW_URL) explicitly from job matrix/env,
     - start preview via scripts/run-e2e.sh (which will now handle reuse vs start and deterministic waits),
     - ensure preview.out is uploaded as artifact (already configured; verify path).
   - Ensure the Playwright browser install step completes before run-e2e.sh (npx playwright install --with-deps) and is non-interactive.

3. Add a lightweight CI-local verification script and Playwright smoke guard
   - Add scripts/check-e2e-artifacts.js that fails with a clear message if e2e-stability.json shows stats.total === 0 && artifacts.length === 0 (exit code 3). Wire it into CI immediately after run-e2e.sh as a fast fail-fast guard (this is the short-run "CI-local" check described in the earlier plan).
   - Also add tests/e2e/ci-smoke.spec.ts (Playwright or Node script) that can run locally to validate playwright-results.json and e2e-stability.json (this complements the shell verifier).

4. Improve test reliability in tests/e2e/**
   - Audit e2e specs and replace any implicit sleeps with explicit waits (page.waitForSelector, page.waitForURL, page.waitForResponse or expect(locator).toBeVisible(), toHaveText, toHaveCount).
   - Add a single targeted change in tests/e2e/app.spec.ts (or any failing spec) to assert app presence with await page.waitForSelector('#app', { state: 'visible', timeout: 10000 }) — this ensures the canonical smoke test demonstrates the server is serving expected content.

5. Verify locally (non-interactive checklist to run in CI/local runner)
   - Ensure no preview is started by scripts if PREVIEW_PID file exists and points to a running process (scripts/run-e2e.sh must reuse existing preview when healthy).
   - Run the CI sequence non-interactively (on a developer machine or CI): npm ci; npm run build; export PREVIEW_PORT=4173; ./scripts/run-e2e.sh; node scripts/check-e2e-artifacts.js — confirm artifacts exist and e2e-stability.json has stats.total > 0 or artifacts > 0.
   - Collect and inspect preview.out, playwright-results.json, and e2e-stability.json artifacts for failures.

6. Improve diagnostics when failures occur
   - Ensure generate-e2e-stability-summary.js accepts alternative Playwright report paths and logs parse errors with filenames and stack traces to preview.out and audit logs.
   - Update .github/scripts/verify-e2e-stability.sh to print the cause string from e2e-stability.json when it writes an "empty" artifact so CI logs include the reason (timeout, no report found, parse error).

## LATER
1. Add selective retries and richer diagnostics on flaky tests
   - Use per-test retries for known flaky tests in playwright.config.ts and keep trace/screenshot/video capture policy: trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure'.
   - Create a small tool to aggregate traces/screenshots for triage (attach to the issue template).

2. Nightly stability aggregation/dashboard
   - Persist e2e-stability.json history in a small artifact store (S3/GHA artifacts or a commit-protected branch) and generate a nightly stability-summary dashboard (aggregate PASS/FAIL, flaky rates, failing tests).
   - Add a GitHub Action that, on the nightly workflow, uploads the aggregated stability JSON and generates a lightweight HTML report.

3. Deterministic CI preview option
   - Implement a deterministic static preview server (scripts/static-preview.js) that serves dist/ on a fixed port with deterministic headers and reduced runtime variability, gated by USE_STATIC_PREVIEW=1 environment flag in CI jobs that require maximum stability (e.g., nightly or release-validation runs).
   - Keep Vite preview as the default for developer workflows.

4. Continuous flakiness tracking & quarantine
   - Integrate a flakiness tracker that records historical failures across runs and automatically flags tests exceeding transient-failure thresholds for triage; optionally quarantine the test to a "quarantine" label and require an owner to resolve.

5. Documentation & runbook updates
   - Finalize docs/E2E-REPRO.md with updated reproduce steps, examples of replacing sleeps, how to interpret traces/screenshots, and where CI stores artifacts. Include examples of the new check scripts (scripts/check-e2e-artifacts.js) and how to run the CI-local verification checklist.

Notes / Constraints respected
- The NOW action is a single, deterministic code change (scripts/run-e2e.sh) that improves health checking, port resolution, and logging — it does not start a server if one is already running and does not alter protected directories (.voder/, prompts/).
- Subsequent steps avoid launching interactive commands and assume CI/local runners will execute the non-interactive commands described.
- All proposed file edits are limited to build/test orchestration and CI scripts; nothing in prompts/ or .voder/ is touched.