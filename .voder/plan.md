## NOW

Update scripts/run-e2e.sh to detect an existing healthy preview server and skip starting a new one: if preview.pid exists and the PID is alive and http://127.0.0.1:5173/ returns HTTP 200, proceed directly to Playwright; otherwise continue with the existing non-interactive start/wait/teardown flow. On failure to reach the preview within the timeout, print the last 200 lines of preview.out, write a clear failure message, write e2e-stability.json/text with zero tests, and exit non-zero.

## NEXT

1. Harden CI job (.github/workflows/ci.yml):
   - Replace the current inline preview/start step with a single step that runs scripts/run-e2e.sh (it will now be safe if a preview is already running).
   - Ensure Playwright browsers are installed before running the script (npx playwright install --with-deps).
   - Ensure artifacts uploaded include: test-results/**, playwright-results.json, e2e-stability.json, e2e-stability.txt, and Playwright traces/videos/html (configure artifacts path test-results/**).

2. Improve Playwright diagnostics & artifact capture:
   - Verify playwright.config.ts already enables trace-on-retry/screenshot/video and that those artifacts are written under test-results/; if needed, set environment variables in CI to force traces (PLAYWRIGHT_JUNIT_OUTPUT_NAME or PLAYWRIGHT_TRACE_DIR) and ensure test-results/ is uploaded.
   - Update .github/scripts/generate-e2e-stability-summary.js to also include presence/paths of trace/video files in the JSON output (when present) for quick triage.

3. Add a small, explicit CI quick health-check step (immediately after run-e2e.sh readiness check or as the first command in run-e2e.sh if starting preview): perform curl --fail --max-time 5 http://127.0.0.1:5173/ and on non-200 log a concise failure summary (exit code, last 200 preview.out lines), so CI separates server-start problems from test failures.

4. Audit and harden e2e tests:
   - Scan tests/e2e/**/*.ts and replace any sleeps or brittle checks with explicit Playwright waits (page.waitForSelector, expect(locator).toBeVisible(), waitForURL).
   - Increase per-test timeouts where network/animation waits are expected; add retries only for flaky tests and ensure traces are captured on retry.
   - Confirm baseURL in playwright.config.ts is http://127.0.0.1:5173 and document the required port in docs/DEVELOPER-SETUP.md.

5. Document reproduce and debug steps (docs/DEVELOPER-SETUP.md):
   - Add concise non-interactive reproduction steps for CI-like e2e runs (npm ci, npx playwright install --with-deps, ensure preview running or let run-e2e.sh start it, ./scripts/run-e2e.sh).
   - Document where artifacts appear (test-results/, playwright-results.json, e2e-stability.json/txt, traces/videos) and how to inspect traces/videos locally.

## LATER

1. CI artifact retention & triage UX:
   - Upload Playwright traces/videos/html reports to a longer-retention artifact storage for failed runs and publish a small JSON summary to build annotations (linking failed test → trace/video path).
   - Add a nightly e2e-stability workflow (or tune .github/workflows/e2e-stability.yml) to collect historical pass/fail/flaky metrics from e2e-stability.json and alert (or create an issue) when flakiness increases beyond thresholds.

2. Flakiness management & automation:
   - Implement a quarantining report/process: auto-label persistently flaky tests, generate a triage issue template, and add a dashboard summary artifact for humans to review.
   - Add an automated rerun-with-tracing step: on failure rerun the failing tests once with trace forced and attach that trace to artifacts for immediate triage.

3. Optional deterministic CI server mode:
   - Add an alternative deterministic static server (node script or small Express/serve wrapper that serves dist/ on a fixed port without Vite preview variability) and a CI flag (USE_STATIC_PREVIEW=1) so CI can choose the deterministic server for stability-critical runs.

4. Expand integration & coverage:
   - Broaden e2e coverage for critical user flows (3D/animation entry points, Vision Flow, Live Prompt Interaction) and add accessibility checks (axe) inside Playwright tests where feasible.
   - Add a small set of visual-regression baseline checks that run in CI and save screenshots for trend analysis (store baselines separately and fail only on large regressions after human review).

Notes / Constraints honored:
- The NOW action modifies only scripts/run-e2e.sh behavior (no server start attempted if already running).
- The plan does not remove or modify prompts/, prompt-assets/, or .voder/ directories and avoids interacting with .voder/.processes.json.
- All CI changes are non-interactive and use deterministic curl/playwright commands suitable for automated runs.
- The plan assumes run-e2e.sh is executable and CI will call it; it documents artifact expectations and focuses troubleshooting on preview readiness and artifact capture.