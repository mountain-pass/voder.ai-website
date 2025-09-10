## NOW
Run this command to verify the lockfile is present and tracked: git ls-files -- package-lock.json

## NEXT
1. If the lockfile is missing or untracked, generate and commit it (non-interactive):
   - npm ci --no-audit --no-fund 2>&1 | tee npm-ci.log
   - git add package-lock.json
   - git commit -m "chore(deps): add package-lock.json for reproducible installs"
   - git push origin HEAD
2. Reproduce the CI audit non-interactively and capture artifacts for parity checking:
   - npm ci --no-audit --no-fund 2>&1 | tee npm-ci.log
   - npm audit --json > audit.json 2>&1
   - node .github/scripts/parse-audit.js audit.json 2>&1 | tee audit-parse.log
   - Compare audit-parse.log with committed and CI artifacts (audit-summary.md, ci-audit-summary.md, ci-audit.json). If identical and showing no high/critical advisories, stop.
3. If the parser shows high/critical advisories, attempt lockfile-only remediation:
   - npm audit fix --package-lock-only 2>&1 | tee audit-fix.log
   - Re-run the parser (node .github/scripts/parse-audit.js audit.json | tee audit-parse.log); if advisories are resolved and changes are limited to package-lock.json, commit and push only package-lock.json:
     - git add package-lock.json
     - git commit -m "chore(security): apply npm audit fix --package-lock-only"
     - git push origin HEAD
   - Wait for CI to re-run and confirm CI artifacts are updated and clear.
4. If advisories persist after lockfile-only fixes, prepare minimal focused dependency upgrade PRs:
   - For each required upgrade identified by audit-parse:
     - Bump the single package version in package.json to the minimal secure version.
     - Run npm install --no-audit --no-fund to update package-lock.json.
     - Produce verify logs (npm run verify 2>&1 | tee verify.log) or collect tsc.log, eslint.log, format.log, build.log, test-ci.log and exits.env.
     - Commit only package.json and package-lock.json (and minimal code fixes required), push to a short-lived branch, and open a PR with verify.log, audit.json, and audit-parse.log attached.
   - Iterate until CI verify and the security audit report no high/critical advisories.

## LATER
1. Add Dependabot or Renovate (.github/dependabot.yml or renovate.json) configured for weekly/npm security updates and sensible grouping.
2. Add a scheduled audit job (cron) to .github/workflows/security-audit.yml to run periodic audits and upload artifacts (audit.json, audit-summary.md, SBOM).
3. Require security-audit and verify as protected-branch status checks and add a dependency-upgrade PR template that mandates attached verify logs and audit outputs.
4. Integrate SBOM generation, scheduled secret scanning (gitleaks), and SAST (CodeQL or Semgrep) into CI; document triage responsibilities in SECURITY.md.
5. Keep docs/CI-AUDIT.md and docs/DEPENDENCY-POLICY.md updated with exact non-interactive reproduction commands and the accepted remediation flow; schedule monthly maintenance to review Dependabot PRs and audit results.