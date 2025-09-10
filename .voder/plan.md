The previous plan repeated work already completed in CI. I corrected it.

## NOW
Add a non-interactive CI verification step in .github/workflows/ci.yml immediately after the run-e2e.sh step that validates e2e-stability.json exists and that it either (a) contains stats.total > 0 OR (b) has a non-empty artifacts array; on failure the step must (1) print a concise failure summary, (2) dump the last 200 lines of preview.out (if present), and (3) exit non-zero so CI marks the run as a server/startup failure separate from test failures.

## NEXT
1. Ensure Playwright artifacts are always uploaded
   - Confirm the existing upload-artifact steps are unconditional (if: always()) and include:
     - test-results/** (all traces, videos, screenshots, html)
     - playwright-results.json
     - e2e-stability.json
     - e2e-stability.txt
     - preview.out
   - If any path is missing in .github/workflows/ci.yml, update it to include the paths above.

2. Improve e2e summary content and generator
   - Extend .github/scripts/generate-e2e-stability-summary.js (if not already) to append any Playwright trace/video/screenshot paths found under test-results/ into e2e-stability.json.artifacts and to return non-zero when it cannot produce a valid JSON artifact (so CI can detect generator failure).
   - Ensure the generator writes deterministic e2e-stability.txt alongside the JSON.

3. Harden run-e2e.sh health checks and exit codes
   - Confirm run-e2e.sh performs a quick curl --fail --max-time 5 after reusing/starting preview and exits with a distinct non-zero code on preview-health failure (so CI can distinguish startup vs test failures).
   - Ensure run-e2e.sh writes preview.out to artifacts even when the preview was reused (so logs are always available).

4. Stabilize Playwright test robustness
   - Audit tests/e2e/** and replace sleeps with explicit waits (page.waitForSelector, expect(locator).toBeVisible, page.waitForURL). Increase per-test timeouts only where necessary; add retries selectively and capture traces/screenshots on retry.

5. Document run & debug workflow
   - Update docs/E2E-REPRO.md and docs/DEVELOPER-SETUP.md with:
     - The CI reproduction sequence: npm ci --no-audit --no-fund; npx playwright install --with-deps; ./scripts/run-e2e.sh
     - Where to find artifacts (test-results/, playwright-results.json, e2e-stability.json/txt, preview.out, traces/videos).
     - How the new CI verification step signals preview-start failures vs test failures.

## LATER
1. Add automated triage/retention and dashboards
   - Configure longer retention for failing-run traces/videos and publish a JSON build annotation linking failed tests to trace paths. Add a nightly job to collect e2e-stability.json history and alert if flakiness rises above thresholds.

2. Flakiness management automation
   - Implement quarantining/reporting: auto-label flaky tests after N transient failures, open triage issues with attached traces, and provide a small dashboard artifact summarizing quarantined tests.

3. Deterministic CI server option (optional)
   - Provide a lightweight deterministic static server (scripts/static-preview.js or small Express wrapper) and a CI flag (USE_STATIC_PREVIEW=1) to run the deterministic server for stability-critical runs; keep Vite preview for local/dev runs.

Notes / Constraints honored
- This plan does not repeat already-completed CI Playwright install or run-e2e.sh rewrites.
- NOW is a single concrete change (CI verification step) addressing the NEXT PRIORITY of stabilizing CI e2e runs by making startup failures immediately visible and distinct from test failures.
- The plan does not modify prompts/, prompt-assets/, or .voder/ and uses only non-interactive CI-safe steps.