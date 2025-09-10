# SECURITY - Auto-generated Triage (redacted)

Generated: 2025-09-09T15:47:55Z

## Artifacts

- Raw npm audit output: audit.json (kept off VCS unless safe)
- Audit summary: audit-summary.md
- Post-fix audit: audit-postfix.json (kept off VCS unless safe)
- Redacted secrets scan: repo-secrets-scan.redacted.txt
- Lockfile fix log: audit-fix.log

## Immediate guidance

- Do NOT commit plaintext secrets. If redacted scan shows real credentials, rotate them immediately.
- Review audit-summary.md and create issues for critical/high advisories.
- If package-lock.json changed after audit fix, review diff before committing.

## Reproduction (maintainer)

- npm ci
- npm audit --json > audit.json
- node <audit-summary one-liner> to generate audit-summary.md
- perl redaction command to produce repo-secrets-scan.redacted.txt

## Scheduled automated scans (added)

The repository runs several automated scans on a daily schedule. Artifacts are uploaded to the corresponding GitHub Actions run as job artifacts.

- Security Audit (daily @ 02:00 UTC)
  - Workflow: .github/workflows/security-audit.yml
  - Artifacts: audit.json, audit-summary.md, sbom.json (CycloneDX SBOM)

- Secret Scan (gitleaks) (daily @ 03:00 UTC)
  - Workflow: .github/workflows/secret-scan.yml
  - Artifacts: repo-secrets-scan.json, repo-secrets-scan.redacted.txt

- Code Scanning (CodeQL) (daily @ 04:00 UTC)
  - Workflow: .github/workflows/code-scanning.yml
  - Artifacts: codeql-results.sarif

Review the Actions run artifacts for triage details. If high/critical findings are reported, follow the immediate guidance above and open issues/PRs to remediate.
