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
