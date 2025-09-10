## NOW

Run the audit parser on the existing audit artifact to validate parsing and exit code behavior:
node .github/scripts/parse-audit.js audit.json

## NEXT

1. Inspect the parser output and exit code:
   - If it prints a concise summary and exits 0, continue to step 2.
   - If it reports high/critical advisories and exits non-zero, continue to remediation steps in step 3.

2. Verify CI parity:
   - Confirm .github/workflows/security-audit.yml already runs npm audit and then the parser, and uploads audit.json and audit-summary.md as artifacts. If the parser run in NOW produced audit-summary.md, attach it to the CI run artifacts path and ensure the workflow uploads that file.
   - If the CI workflow currently captures audit.json but not audit-summary.md, update the workflow's artifact upload paths to include audit-summary.md and commit the change.

3. Remediation if high/critical advisories are reported by the parser:
   - Attempt non-interactive remediation:
     - npm audit fix --package-lock-only
     - npm ci --no-audit --no-fund
     - node .github/scripts/parse-audit.js audit.json (re-generate audit.json earlier if needed via npm audit --json > audit.json)
   - If remediation clears high/critical advisories, commit updated package-lock.json and audit artifacts:
     - git add package-lock.json audit.json audit-summary.md
     - git commit -m "chore(security): audit fix and commit lockfile"
     - git push
   - If high/critical issues remain, open targeted PR(s) to upgrade/replace vulnerable dependencies; include audit.json and audit-summary.md in the PR for reviewer triage and run the verify pipeline in the PR.

4. Document the reproducible check:
   - Add a short section to docs/DEVELOPER-SETUP.md describing:
     - How to reproduce the parser run locally: node .github/scripts/parse-audit.js audit.json
     - How to generate audit.json if absent: npm audit --json > audit.json
     - The remediation flow and commit guidance.

## LATER

1. Make SBOM generation reliable and ensure sbom.json is uploaded by CI (fix npx @cyclonedx/cyclonedx-bom usage if it is flaky).
2. Add an automated Dependabot/renovate remediation cadence and ensure the security-audit job runs on those PRs for quick triage.
3. After stable, consider adding the security-audit job as a required status check or creating a documented exception/triage process for unavoidable advisories.