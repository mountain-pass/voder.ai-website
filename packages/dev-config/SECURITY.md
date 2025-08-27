# Security

## Supply-chain Audit & Registry-Mirror Policy

This package implements the policy defined in ADR-0007 to ensure secure and reliable dependency management:

### 1. Automated Supply-Chain Audit

- All contributors and CI workflows **must** run:
  
  ```bash
  npm run audit:ci
  ```

  This runs `npm audit --audit-level=high` and fails on any high-severity vulnerability.  
- Regular audits help us catch and fix security issues before they reach production.

### 2. Registry-Mirror Configuration

- To guard against malicious or unavailable registry endpoints, installs **must** use a trusted mirror.
- Ensure your user or CI `.npmrc` includes one or more fallback registry entries. For example:

  ```ini
  registry=https://registry.npmjs.org/
  ; Mirror endpoints (add as needed):
  ; registry=https://npm.company.com/
  ```

- CI pipelines should enforce this by shipping or mounting an `.npmrc` with approved mirrors.

---

*Last updated per [ADR-0007: Supply-chain Audit & Registry-Mirror Policy](docs/decisions/0007-supply-chain-audit-and-registry-mirror-policy.md).*
