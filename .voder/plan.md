## NOW
Trigger the updated "Security Audit" workflow (.github/workflows/security-audit.yml) on the branch fix/ci-capture-logs-and-coverage using workflow_dispatch (select the security-audit.yml workflow and run it against fix/ci-capture-logs-and-coverage).

## NEXT
1. Download the artifacts from the triggered workflow run (the job that executed run-e2e.sh):
   - Retrieve e2e-stability.json, e2e-stability.txt, playwright-results.json, preview.out, preview.pid and test-results/**.
2. Validate artifacts:
   - Confirm e2e-stability.json exists and contains either stats.total > 0 OR a top-level "reason" explaining why tests did not run.
   - Confirm preview.out and playwright-results.json are present and non-empty.
   - Confirm test-results/** contains screenshots/videos when Playwright ran.
3. If artifacts are valid:
   - Record the workflow run ID and add a short note in the PR (or issue) summarizing the artifacts and e2e-stability.json (run id, stats.total or reason).
   - Mark the verification as passed for this branch and proceed with any merge process.
4. If artifacts are invalid (stats.total === 0 with no "reason", or required artifacts missing):
   - Download the failing job logs and preview.out; identify which workflow step started the preview and which step uploaded artifacts.
   - Confirm the same job executed run-e2e.sh and also ran the generator and verifier; if not, update the workflow so the e2e orchestration, generator (node .github/scripts/generate-e2e-stability-summary.js), verifier (node scripts/check-e2e-artifacts.js), and unconditional artifact upload (if: always()) run in the same job — then re-run the workflow_dispatch.
   - Ensure the job environment for the run-e2e.sh step exports PREVIEW_HOST / PREVIEW_PORT / PREVIEW_URL so the script’s health checks target the correct address; if preview failed for missing build, ensure the job sequence is npm ci → npm run build → start preview → run-e2e.sh in the same job.
   - Re-run the workflow after fixes and repeat artifact validation.
5. If verifier reports no tests ran but preview.out indicates preview started and served HTML:
   - Inspect Playwright output and playwright-results.json for skipped/timeout reasons; if tests are timing out at navigation or selector waits, add small, non-interactive health/wait extension in run-e2e.sh (e.g., small retry loop or increase Playwright timeouts) and re-run the workflow.
6. Iterate until a run produces either real stats (stats.total > 0) or the canonical fallback e2e-stability.json with a clear "reason" is uploaded along with preview.out and playwright-results.json.

## LATER
1. Add a workflow job summary/annotation step that reads e2e-stability.json and posts a concise summary (stats or fallback reason) to the workflow run summary and PR checks for faster triage.
2. Implement a nightly aggregator that downloads recent security-audit + e2e artifacts, persists them to durable storage, and generates a compact HTML summary for trend analysis.
3. Add a lightweight pre-merge verification job that runs node scripts/check-e2e-artifacts.js on the branch (non-destructive) to fail the PR early when no artifacts are produced.
4. Harden CI job assumptions:
   - Require `npm ci` and package-lock.json in all CI jobs; add a lockfile-consistency check step.
   - Standardize preview port or publish the chosen preview URL to a known artifact file so verifiers can always find the correct base URL.
5. Add a small dashboard (or GitHub Pages) to visualize e2e-stability.json history and security-audit trends; configure alerts for repeated failures or threshold breaches.