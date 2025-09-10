## NOW

From the GitHub Actions UI for branch fix/ci-capture-logs-and-coverage, download the latest security-audit workflow run artifacts (audit.json and audit-summary.md) and save them into the repository root as ci-audit.json and ci-audit-summary.md.

## NEXT

1. Compare CI artifacts to the repository state:
   - Compare ci-audit.json to package-root audit.json (if present) and ci-audit-summary.md to any committed audit-summary.md. If they are identical and parse shows no high/critical advisories, stop — CI audit is stable.
2. If CI artifacts are missing or differ, reproduce the audit locally once (non-interactive) and capture outputs for triage:
   - npm ci --no-audit --no-fund 2>&1 | tee npm-ci.log
   - npm audit --json > audit.json 2>&1
   - node .github/scripts/parse-audit.js audit.json 2>&1 | tee audit-parse.log
   - Save npm-ci.log, audit.json, audit-parse.log and compare audit-parse.log with ci-audit-summary.md to identify any parity issues.
3. If audit-parse.log or CI parse indicates high/critical advisories, attempt minimal remediation:
   - npm audit fix --package-lock-only 2>&1 | tee audit-fix.log
   - Inspect changes; if limited to package-lock.json, commit only package-lock.json:
     - git add package-lock.json
     - git commit -m "chore(security): apply npm audit fix --package-lock-only" -- package-lock.json
     - git push origin HEAD
   - Re-run step 2 locally and verify the parser shows no high/critical advisories; if resolved, allow CI to re-run and confirm artifacts are updated.
4. If advisories persist after lockfile-only fixes, create focused dependency upgrade PR(s):
   - For each required upgrade:
     - Bump exactly the minimal package version in package.json.
     - Run npm install --no-audit --no-fund to update package-lock.json.
     - Run the non-interactive verify capture (npm run verify 2>&1 | tee verify.log) or the CI-style capture to produce tsc.log, eslint.log, format.log, build.log, test-ci.log and exits.env.
     - Commit only package.json and package-lock.json (and minimal code fixes necessary to satisfy type/lint), push to a short-lived branch, and open a PR attaching verify.log and audit outputs for reviewer inspection.
   - Iterate until CI verification passes and no high/critical advisories remain.
5. Ensure reproducibility and reviewer traceability:
   - If docs/CI-AUDIT.md is absent or stale, update it to include the exact non-interactive commands used for reproduction and reference where to find CI artifacts; commit this documentation to the branch or include it in the dependency PR.
   - Attach local logs (npm-ci.log, audit.json, audit-parse.log, audit-fix.log, verify.log) to the PR for reviewer inspection.

## LATER

1. Automate and harden the audit/dependency workflow:
   - Add Dependabot or Renovate configuration (.github/dependabot.yml or renovate.json) to open dependency PRs with sensible grouping and scheduling; ensure each PR runs the full verify pipeline.
   - Add a scheduled audit job (cron) to .github/workflows/security-audit.yml to run periodic audits and upload audit.json, audit-summary.md and an SBOM artifact.
2. Gate and triage policy:
   - Require the security-audit and verify checks as protected-branch status checks so dependency PRs must pass the same verification pipeline before merge.
   - Add a dependency-upgrade PR template that mandates attached verify logs and audit outputs and documents acceptance criteria (no high/critical advisories; verify pipeline passes).
3. Improve supply-chain and scanning:
   - Add SBOM generation to CI and upload sbom.json as an artifact.
   - Add secrets-scanning (Gitleaks or GitHub secret scanning) and a SAST workflow (CodeQL or Semgrep) on a schedule.
4. Maintain docs & cadence:
   - Keep docs/CI-AUDIT.md and docs/DEPENDENCY-POLICY.md updated with the accepted remediation flow and run the non-interactive reproduction as part of a monthly maintenance routine.