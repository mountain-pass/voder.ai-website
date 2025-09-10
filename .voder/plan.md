## NOW

Trigger the updated security-audit GitHub Actions workflow (use workflow_dispatch on the fix/ci-capture-logs-and-coverage branch) and download the workflow run artifacts to validate that e2e-stability.json, e2e-stability.txt, playwright-results.json, and preview.out are present and contain expected content.

## NEXT

1. If the artifacts are present and valid:
   - Record the run ID and archive the artifacts for reference (attach to the PR or add a note in the issue/PR thread).
   - Mark the verification step as passed and proceed to merge any outstanding workflow changes if they are on a feature branch.

2. If e2e-stability.json shows stats.total === 0 and contains no "reason", or required artifacts (playwright-results.json / preview.out / test-results/**) are missing:
   - Inspect the security-audit workflow run logs to confirm which job executed the e2e orchestration (scripts/run-e2e.sh) and which job performed the artifact upload.
   - If run-e2e.sh runs in a different job than the artifact upload, update the workflow so upload occurs in the same job that executes run-e2e.sh (or persist artifacts to the job workspace and upload from that job). Files to adjust: .github/workflows/security-audit.yml (and, if necessary, .github/workflows/ci.yml) — ensure the sequence is:
     - npm ci (reproducible install)
     - run-e2e orchestration (scripts/run-e2e.sh)
     - run .github/scripts/generate-e2e-stability-summary.js (best-effort)
     - run node scripts/check-e2e-artifacts.js (fail early if no tests/artifacts)
     - upload artifacts (playwright-results.json, e2e-stability.json, e2e-stability.txt, preview.out, test-results/**)
   - Add a non-fatal generator invocation but make the artifact upload unconditional so the canonical fallback e2e-stability.json (with a "reason") is always uploaded.
   - Ensure PREVIEW_URL / PREVIEW_PORT / PREVIEW_HOST are exported into the job environment that runs scripts/run-e2e.sh so the script’s health checks target the correct preview address.

3. Add a fast verifier step to the same job:
   - Insert a step that runs: node scripts/check-e2e-artifacts.js immediately after generate-e2e-stability-summary.js. Make sure this step runs with if: always() for artifact capture but exits non-zero when e2e artifacts are empty so the job fails fast and surfaces preview.out in the logs for debugging.

4. Re-run the workflow (workflow_dispatch) and confirm:
   - e2e-stability.json contains either real stats (stats.total > 0) or a top-level "reason" explaining why tests did not run.
   - preview.out and playwright-results.json are uploaded.
   - The check-e2e-artifacts.js step either passes or fails with clear diagnostics and preview.log tail captured in the job artifacts.

## LATER

1. Add an annotation/summary step that reads the e2e-stability.json and, when stats.total === 0, posts a short annotation (job summary) with the "reason" to the workflow run and (optionally) as a PR check annotation for faster triage.
2. Implement a scheduled nightly aggregator workflow that downloads the latest security-audit + e2e artifacts, persists them to a durable store (S3 or artifact archive), and generates a compact HTML summary for trend analysis.
3. Add a small dashboard or GitHub Pages page that visualizes e2e stability trends and security-audit trends and configure alerts for threshold breaches (e.g., repeated days with zero e2e runs or new critical vulnerabilities).
4. Harden CI: confirm all CI jobs use npm ci and the committed package-lock.json, add lockfile consistency checks in CI, and add a lightweight pre-merge verification job that runs the artifact verifier on the branch before merge.