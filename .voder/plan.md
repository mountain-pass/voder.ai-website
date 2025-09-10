## NOW
Update the GitHub security-audit workflow to run on a schedule: add a daily cron trigger to .github/workflows/security-audit.yml so the existing audit job runs non-interactively every day (e.g., 02:00 UTC) and uploads audit artifacts.

## NEXT
After scheduling the audit job, implement the rest of the automated security pipeline and enforcement in CI (non-interactive steps):

1. Add a secret-scanning job (Gitleaks) as a new workflow:
   - File: .github/workflows/secret-scan.yml
   - Behavior (non-interactive):
     - Runs on push to main and on a nightly schedule (e.g., 03:00 UTC) and on pull_request.
     - Installs gitleaks or uses the official action (zricethezav/gitleaks-action).
     - Runs gitleaks detect --source=. --redact --format=json --report-path=repo-secrets-scan.json.
     - Uploads repo-secrets-scan.json and repo-secrets-scan.redacted.txt as workflow artifacts.
     - Fails the job only if secrets are detected and a remediation policy file (SECURITY.md) is not present — otherwise leaves a blocking artifact and a warning (start with non-blocking, then tighten to blocking after triage rules are in place).

   Example non-interactive snippet (to be placed in workflow file):
   - uses: zricethezav/gitleaks-action@v1
     with:
       args: detect --source=. --report-format=json --report-path=repo-secrets-scan.json --redact

2. Add CodeQL (or Semgrep) scanning to CI:
   - File: .github/workflows/code-scanning.yml (CodeQL) or .github/workflows/semgrep-scan.yml (Semgrep).
   - Behavior:
     - Run on push to main, pull_request, and nightly schedule (e.g., 04:00 UTC).
     - Use GitHub's codeql-action for CodeQL analysis (or return Semgrep action if preferred).
     - Uploads CodeQL/semgrep results as SARIF and fails PRs when high-confidence findings are introduced.
   - Non-interactive example steps:
     - uses: github/codeql-action/init@v2
       with: languages: javascript, typescript
     - uses: github/codeql-action/analyze@v2

3. Generate and publish an SBOM during scheduled security-audit workflow:
   - Add an SBOM generation step to .github/workflows/security-audit.yml (after npm ci and audit):
     - Use a Node-friendly SBOM tool non-interactively, e.g. npx @cyclonedx/bom -o sbom.json or npx @ossf/scorecard? Prefer cyclonedx:
       - npm ci --no-audit --no-fund
       - npx @cyclonedx/bom@latest -o sbom.json
     - Upload sbom.json as an artifact.
   - Commit (if desired) only to an artifacts branch; do not commit SBOM to main.

4. Add Dependabot configuration to automate dependency updates:
   - File: .github/dependabot.yml
   - Non-interactive content: enable weekly updates for npm and schedule security-only updates for immediate alerts; group minor/patch updates sensibly and open PRs.
   - Example rules:
     - package-ecosystem: "npm"
       directory: "/"
       schedule: "weekly"
       open-pull-requests-limit: 10
       allow:
         - dependency-type: "direct"
       security-updates-only: false
     - Add an additional config for security-only updates if desired.

5. Wire the new security checks into branch protection and PR requirements (manual step or scripted via GH CLI):
   - Require the following status checks before merge to main: verify (existing), security-audit (the scheduled/PR-run audit job), code-scanning (CodeQL/Semgrep), and secret-scan (optional once stable).
   - If you prefer scripted, use non-interactive gh CLI commands to set branch protection after workflows are merged:
     - gh api repos/:owner/:repo/branches/main/protection -f required_status_checks='{"strict":true,"contexts":["verify","security-audit","code-scanning"]}' (use exact contexts returned by actions)
   - If not allowed, add a short PR checklist documenting the required passing checks and have maintainers enable protections via the GitHub UI.

6. Update SECURITY.md with the new automated flows:
   - Document how scheduled audit, secret-scan, SBOM generation, and code scanning run, where artifacts are stored, and the remediations policy (who triages and the time-to-fix targets for critical/high vulnerabilities).
   - Add the non-interactive reproduction commands to docs/CI-AUDIT.md (already exists) and cross-reference the schedule and artifact locations.

7. Make minimal commits and open PR(s):
   - Add the new workflow files and dependabot config to a branch (e.g., ci/security-automation).
   - Non-interactive commands to create and push a branch and open a PR:
     - git checkout -b ci/security-automation
     - git add .github/workflows/security-audit.yml .github/workflows/secret-scan.yml .github/workflows/code-scanning.yml .github/dependabot.yml
     - git commit -m "ci(security): add scheduled audit, secret scanning, and code scanning workflows; add dependabot config"
     - git push --set-upstream origin ci/security-automation
     - gh pr create --title "chore(ci): add scheduled audits, secret scanning, CodeQL" --body "Adds scheduled audit and code-scanning workflows, secret scanning (gitleaks), SBOM generation and Dependabot config. Artifacts: audit.json, audit-summary.md, repo-secrets-scan.json, sbom.json."

   (If gh CLI is not available, open the PR via GitHub UI after pushing the branch.)

8. Validate non-interactively:
   - Once PR merges, confirm scheduled runs produce artifacts in Actions UI and that audit parser still reports zero high/critical vulnerabilities. Use the existing parser step in security-audit.yml to create audit-summary.md and upload artifacts.

## LATER
After scheduled scans and automated triage are in place and stable, harden enforcement, process and monitoring:

1. Tighten enforcement:
   - Make secret-scan a blocking check for PRs (once false positives are tuned and owners are trained).
   - Fail PRs on new high/critical CodeQL/Semgrep findings and on any new high/critical npm audit results.
   - Require SBOM artifact upload and attach it to release PRs.

2. Integrate continuous monitoring tools and alerts:
   - Add Snyk or GitHub Advanced Security subscription for vulnerability monitoring and alerting across dependency graph; wire alerts to a Slack/MS Teams channel and to an on-call rotation.
   - Add automatic triage playbook and incident runbook in SECURITY.md (who to notify, rotate keys, timelines).

3. Add remediation automation and PR templates:
   - Configure Dependabot/ Renovate grouping rules, add an automated upgrade PR template that includes verify logs and audit outputs.
   - Add a dependency-upgrade template that requires exits.env and verify logs uploaded to the PR.

4. Periodic policy & audit reviews:
   - Schedule monthly audits and a quarterly security review of the dependency policy, SBOM, and code-scan trends; assign an owner and periodic review cadence.
   - Add a maintenance task to the repo (docs/DEPENDENCY-POLICY.md) describing the risk-acceptance policy, remediation SLAs (e.g., critical within 24h, high within 7 days).

5. Expand SBOM and provenance:
   - Improve SBOM generation (include devDeps and transitive dependencies), publish SBOM to a secure artifact store, and integrate with incident response tooling.
   - Start generating license reports and automated license policy checks.

6. Continuous improvement:
   - Iterate on scanning rules and reduce false positives (tune gitleaks patterns, CodeQL query packs, and Semgrep rules).
   - Train maintainers on triage, assign security champions, and run tabletop exercises for dependency incidents.

— End of plan —