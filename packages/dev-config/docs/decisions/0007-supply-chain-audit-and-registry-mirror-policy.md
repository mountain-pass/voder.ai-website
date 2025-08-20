---
status: accepted
date: 2025-08-20
deciders:
  - voder-dev-team
consulted:
  - security-team
  - platform-team
informed:
  - contributors
packages: '@voder/dev-config'
---

# ADR-0007: Supply-chain Audit & Registry-Mirror Policy

## Context and Problem Statement

The project needs to ensure that all dependencies are audited for vulnerabilities and installs are pulled from trusted mirrors to protect against malicious or unavailable registry endpoints.

## Decision Drivers

- Automated vulnerability scanning
- Failover registry-mirror support
- Reproducible, secure installs

## Considered Options

- Integrate found 0 vulnerabilities into CI
- Introduce lockfile integrity tests
- Enforce registry-mirror settings

## Decision Outcome

Chosen option: “Require automated supply-chain audits and enforce registry-mirror configuration,” because it provides continuous vulnerability detection and resilient dependency fetching.

### Consequences

- Good: Immediate alerts on high-severity vulnerabilities
- Good: Redundant registry endpoints for CI builds
- Bad: Additional CI configuration and contributor onboarding

### Confirmation

- CI runs found 0 vulnerabilities in the script
- Project root contains a with mirror entries
