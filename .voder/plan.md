## NOW
Commit and push a workflow update on the existing branch (fix/ci-capture-logs-and-coverage) that ensures the security-audit job reliably produces and uploads the audit artifacts: modify .github/workflows/security-audit.yml to (a) run a non-interactive install (npm ci --no-audit --no-fund), (b) run npm audit --json > audit.json, (c) upload audit.json (and audit-summary.md if produced) with actions/upload-artifact@v4 using if: always(), and (d) run node .github/scripts/parse-audit.js audit.json; push the commit to trigger the workflow.

## NEXT
After pushing the workflow change above, perform the following non-interactive verification and remediation steps (ordered):

1. Let GitHub Actions run the updated security-audit workflow and download its artifacts:
   - From the PR/workflow run UI, download the uploaded audit.json (and audit-summary.md if present).

2. Reproduce the audit locally (non-interactive) and validate lockfile/install hygiene:
   - In the repo root locally run:
     - npm ci --no-audit --no-fund
     - npm audit --json > audit.json
     - node .github/scripts/parse-audit.js audit.json
   - Inspect parse output (it exits non-zero on high/critical advisories). Save CLI output to audit-local.log (e.g. npm audit --json > audit.json && node .github/scripts/parse-audit.js audit.json 2>&1 | tee audit-parse.log).

3. If parse reports high/critical advisories, apply targeted, minimal fixes and re-verify:
   - Run non-interactive automated fixer first where safe:
     - npm audit fix --package-lock-only
     - Commit only the updated package-lock.json (git add package-lock.json && git commit -m "chore: apply npm audit fix --package-lock-only").
   - Re-run steps in (2) to validate the advisories are resolved; capture and compare audit.json/artifacts to the CI run.

4. If fixes require dependency updates that must be reviewed, create focused dependency PR(s):
   - For each dependency upgrade needed, open a small PR that:
     - Updates package.json dev/prod dependency to the minimal compatible version,
     - Runs npm install / npm ci locally to update package-lock.json,
     - Runs npm run verify (non-interactive) to capture logs (tee to tsc.log, eslint.log, format.log, test-ci.log),
     - Commits only package.json + package-lock.json + any minimal code adjustments required to satisfy type-check or lint changes.
   - Push the PR so CI produces the verification artifacts again (type-check/lint/format/test).

5. Add short, repo-level automation and documentation to make future audits reproducible:
   - Create docs/CI-AUDIT.md containing the exact non-interactive commands to reproduce the audit and parse locally:
     - npm ci --no-audit --no-fund
     - npm audit --json > audit.json
     - node .github/scripts/parse-audit.js audit.json
   - Commit docs/CI-AUDIT.md in the same branch (or the dependency fix PR) so reviewers can validate the steps.

6. Confirm outcome:
   - Ensure the security-audit workflow (from the NOW commit) uploaded audit.json and the parse step finished with exit code 0 (no high/critical advisories).
   - If CI still reports high/critical advisories after automated package-lock-only fixes, escalate via a focused dependency upgrade PR (see step 4) and repeat verification.

## LATER
Once dependency assessment is restored and passing reliably, harden and automate the process:

1. Enable automated dependency updates:
   - Add .github/dependabot.yml (or enable Renovate) configured to open PRs for dependency updates (separate rules for prod/dev, group minor/patch, auto-merge safe fixes).
   - Make sure dependency update PRs run the full verify pipeline in CI.

2. Add scheduled security auditing and retention:
   - Add a scheduled workflow entry to .github/workflows/security-audit.yml (e.g., cron: '0 3 * * 1') so audits run periodically and upload artifacts to the run for retention.
   - Optionally add a summary artifact (audit-summary.md) generation step and upload it as well.

3. Add traceability & SBOM:
   - Add lightweight SBOM generation to CI (e.g., npm pkg audit + simple SBOM via `license-checker` or `cyclone` tools) and upload SBOM as artifacts so dependency provenance is available for security reviewers.

4. Integrate dependency PR policy:
   - Require the security-audit check (and verify pipeline) as a status check on protected branches so dependency PRs must pass the same verification gates before merge.
   - Document the dependency upgrade policy and acceptance criteria in docs/CI-AUDIT.md (or a new docs/DEPENDENCY-POLICY.md), including when package-lock-only fixes are acceptable vs. when an explicit dependency upgrade PR is required.

5. Optional: Add SAST and periodic scanning:
   - Add a CodeQL or Semgrep workflow to detect code-level security issues (configure it to run nightly) and upload its results as artifacts for triage.

Notes / constraints respected
- No prompts/, prompt-assets/, or .voder/ files are touched or proposed for changes.
- All commands above are non-interactive and safe for CI (npm ci, npm audit, npm audit fix --package-lock-only).
- Git operations are limited to commits on the current repository/branch (fix/ci-capture-logs-and-coverage or a new branch created from it).
- Do not start servers or open browsers in any step. Artifacts are captured and inspected offline.
- Keep changes small and focused; first stabilise the security-audit workflow and the audit artifacts before making broader automation changes (Dependabot/CodeQL).