## NOW
In tests/e2e/**, replace any implicit sleeps/timeouts (e.g., page.waitForTimeout, sleep, setTimeout-based waits) with explicit, deterministic waits and guard assertions — for example, add before assertions: await page.waitForSelector('#app', { state: 'visible', timeout: 10000 }); and replace sleeps with await expect(locator).toBeVisible()/page.waitForURL()/page.waitForResponse() as appropriate.

## NEXT
1. Run the Playwright e2e suite locally against a healthy preview and iterate on failures:
   - Start the preview (locally) and run npx playwright test --project=chromium (or the full matrix) to surface flakiness and failing tests.
   - For each failing test, update assertions to use stronger, explicit checks (expect(locator).toHaveText, toHaveCount, toHaveAttribute, page.waitForResponse, etc.) rather than increasing timeouts.

2. Add selective, documented retries and diagnostic retention:
   - Where flakiness remains after fixes, add per-test or per-folder retries in playwright.config.ts (only for known flaky cases) and ensure trace/screenshot/video is captured on first retry for diagnostics (trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure').

3. Create a short local verification checklist and runbook for debugging e2e failures:
   - Document the reproduce sequence in docs/E2E-REPRO.md (how to start preview, install playwright browsers, run tests, locate artifacts).
   - Include examples of replacing a sleep with explicit waits and how to interpret traces/screenshots.

4. Add a small assertion test (CI-local) that validates e2e-stability.json was produced and lists artifacts:
   - Create tests/e2e/ci-smoke.spec.ts (Playwright or Node script) that reads playwright-results.json and e2e-stability.json and fails early with a clear message if stats.total === 0 && artifacts.length === 0. This is an additional guard for local reproduction before pushing fixes.

## LATER
1. Implement automated flakiness tracking and quarantining:
   - Add tooling to track test failure history, auto-label tests that exceed transient-failure thresholds, and open triage issues attaching traces/screenshots.

2. Configure artifact retention & dashboards:
   - Extend CI artifact retention for failing runs, emit build annotations linking failed tests to artifact paths, and produce a nightly stability-summary dashboard aggregating e2e-stability.json history.

3. Optional deterministic CI server:
   - Provide a deterministic static preview server (scripts/static-preview.js) and a CI flag (USE_STATIC_PREVIEW=1) to run deterministic server for stability-critical runs while keeping Vite preview for local/dev workflows.