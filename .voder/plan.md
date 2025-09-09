## NOW
Push local commits (including the committed package-lock.json) to trigger CI security-audit and reproducible-install validation:
- Command: git push origin main

## NEXT
After the push completes and GitHub Actions starts:

1. Confirm the security-audit workflow ran and used a reproducible install:
   - In GitHub Actions, open the security-audit job run and verify the "Install dependencies" step used `npm ci`.
   - Confirm audit.json was uploaded as an artifact.

2. Fetch and inspect the audit artifact (CI-produced audit.json) or re-run locally if needed:
   - If you have access to the artifact, download audit.json from the workflow run and run locally:
     - node .github/scripts/parse-audit.js path/to/audit.json
   - Or locally re-run the verification sequence:
     - npm ci
     - npm run security:local

3. If parse-audit reports any HIGH/CRITICAL advisories, attempt automated lockfile remediation and re-verify (non-interactive):
   - npm audit fix --package-lock-only
   - npm ci
   - npm run security:local
   - If HIGH/CRITICAL advisories remain, stop automated remediation and proceed to triage.

4. Triage remaining HIGH/CRITICAL advisories (documented workflow):
   - For each advisory create an issue containing: package name, advisory id/source, current version, recommended upgrade/mitigation, verification steps, estimated work, and an owner.
   - For trivial, non-breaking fixes prepare a dependency-update branch/PR with the lockfile change.
   - For non-trivial or breaking upgrades, prepare separate remediation branches/PRs linked to the issue.

5. Use the project verify pipeline on remediation branches/PRs before merging:
   - npm ci
   - npm run type-check
   - npm run lint:check
   - npm run format:check
   - npm run test:ci
   - Only merge PRs that pass the full verify pipeline; commit any package-lock.json changes on the remediation branch and include a clear commit message.

6. If any CI workflow needs a fix (e.g., ensure `npm ci` is used), create a branch/PR with the minimal workflow change, push it, and verify the updated workflow run in GitHub Actions.

## LATER
1. Add automated dependency updates:
   - Add Dependabot or Renovate config (.github/dependabot.yml or renovate.json) to open scheduled PRs for security and dependency updates; require the verify pipeline on those PRs.

2. Scheduled auditing & reporting:
   - Add a weekly scheduled GitHub Action that runs the security-audit workflow and posts a summary or opens issues for new HIGH/CRITICAL findings.

3. Pre-merge secret-scan:
   - Add a non-destructive secret-scan job to PR workflows that produces a redacted artifact and blocks merges pending triage; document false-positive handling in SECURITY.md.

4. Automated trivial remediation PRs:
   - Add a CI job that attempts safe non-breaking upgrades (e.g., npm audit fix --package-lock-only), runs the verify pipeline, and opens an automated PR when all checks pass (label clearly).

5. Expand SECURITY.md and on-call notifications:
   - Document the audit workflow, triage process, Dependabot policy, how to run `npm run security:local`, and owners for security issues.
   - Configure notifications (Slack/email) for failing security-audit runs and assign rotation/owners.