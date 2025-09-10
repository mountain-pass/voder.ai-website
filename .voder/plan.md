## NOW
Edit the existing workflow file .github/workflows/security-audit.yml to invoke .github/scripts/generate-e2e-stability-summary.js (after the SBOM and parse-audit steps) and include the e2e artifacts in the job's artifacts upload: ensure the job uploads e2e-stability.json, e2e-stability.txt, playwright-results.json, and preview.out along with audit.json, audit-summary.md, and sbom.json.

## NEXT
1. Trigger the updated security-audit workflow (push or workflow_dispatch) and confirm artifacts:
   - Download the uploaded artifact bundle and verify that e2e-stability.json and e2e-stability.txt exist and contain either real stats or a clear "reason" explaining why tests did not run.
   - Verify preview.out and playwright-results.json were uploaded (or that the job produced a canonical empty e2e-stability with reason when Playwright results were absent).
2. If e2e artifacts are missing or show stats.total === 0 and no artifacts:
   - Inspect the CI job that runs run-e2e.sh (ci.yml): ensure that run-e2e.sh runs in the same job that uploads artifacts (so preview.out and playwright-results.json are present), and that PREVIEW_PORT/PREVIEW_URL are exported consistently into that job.
   - Add a fast post-run CI step in .github/workflows/ci.yml (or the same run-e2e job) that runs node scripts/check-e2e-artifacts.js and fails the job early if e2e-stability.json indicates no tests ran and no artifacts produced.
3. Triage security and secrets findings:
   - If audit-summary.md reports high/critical vulnerabilities, open focused remediation PRs (upgrade/replace/patch) and re-run the workflow.
   - If repo-secrets-scan.json (from the separate secret scan workflow) reports secrets, rotate credentials immediately and follow the repository incident/remediation process; do not change prompts/ prompt-assets/ or .voder/ files.
4. Roll the change into a small PR with:
   - The modified .github/workflows/security-audit.yml (with a brief PR description referencing artifact guarantees),
   - A short test: workflow_dispatch run confirming the artifacts are produced and attached.

## LATER
1. Add a nightly aggregator that collects the latest security-audit and e2e artifacts and persists them (artifact store or S3) and generates a compact HTML summary for trend analysis.
2. Add an annotated CI check that surfaces the "reason" field from e2e-stability.json in the workflow run summary if tests did not run, to speed triage.
3. Consider consolidating secrets-scan and security-audit artifacts into a single periodic "consolidated" workflow (only after verifying no duplication of effort), and implement automated PR creation for low-risk dependency bumps for critical runtime packages.
4. Implement historical dashboards for e2e stability and security trends and automatic alerting for threshold breaches (e.g., new critical vulnerability or consecutive days of zero e2e runs).