# Security Incident: jws HMAC Signature Verification Vulnerability (CVE-2025-65945)

**Status**: ACCEPTED_RISK  
**Incident Date**: 2025-12-07  
**Severity**: High (CVSS 7.5)  
**CVE**: CVE-2025-65945  
**Advisory**: GHSA-869p-cjfg-cm3x

## Incident Summary

High severity vulnerability discovered in `jws` package (<3.2.3) - a transitive dependency via netlify-cli → jsonwebtoken → jws.

### Vulnerability Details

- **Package**: jws <3.2.3
- **Dependency Path**: netlify-cli@23.12.3 → jsonwebtoken@9.0.2 → jws@3.2.2
- **Vulnerability**: Improper HMAC Signature Verification (CWE-347)
- **Attack Vector**: Network
- **Attack Complexity**: Low
- **Privileges Required**: None
- **User Interaction**: None
- **Integrity Impact**: High
- **Published**: 2025-12-04 (3 days ago)

### Affected Conditions

According to the advisory, the vulnerability affects applications that meet ALL of the following criteria:

1. ✅ Uses auth0/node-jws <=3.2.2 || 4.0.0
2. ❌ Uses jws.createVerify() function for HMAC algorithms
3. ❌ Uses user-provided data from JWT header/payload in HMAC secret lookup

**Our Application**: Does NOT meet conditions 2 or 3 - we do not directly use jws or jsonwebtoken in our codebase.

## Risk Assessment

### Exposure Analysis

**Runtime Exposure**: NONE

- jws/jsonwebtoken are dev dependencies via netlify-cli
- NOT used in production application code
- NOT bundled in production build (verified via dist/ analysis)
- netlify-cli is a CLI tool used only for deployment operations
- No JWT verification or HMAC operations in application codebase

**Development/Deployment Exposure**: LOW

- Only exposed during `netlify deploy` CLI operations
- netlify-cli does not expose JWT operations to untrusted input in deployment context
- Local development environment only - no production servers run this code

### Remediation Attempts

Attempted multiple remediation approaches:

1. **npm audit fix**: Did not resolve (jsonwebtoken pinned to 9.0.2 by netlify-cli)
2. **npm audit fix --force**: Did not resolve
3. **Package overrides** (npm overrides feature): Not honored by npm for this dependency tree
   - Tried global override: `"jws": "4.0.1"`
   - Tried global override: `"jsonwebtoken": "9.0.3"`
   - Tried nested override: `"netlify-cli": { "jsonwebtoken": "9.0.3" }`
   - None were applied (verified via `npm ls jws` and node_modules inspection)
4. **Root cause**: netlify-cli@23.12.3 pins jsonwebtoken to exactly 9.0.2 (not a range)
   - jsonwebtoken@9.0.2 depends on jws@^3.2.2 (vulnerable)
   - jsonwebtoken@9.0.3 depends on jws@^4.0.1 (patched)
   - npm overrides mechanism has known issues with exact version pins in dependency chains

### Upstream Status

- **netlify-cli**: Latest version (23.12.3) still uses jsonwebtoken@9.0.2
- **jsonwebtoken**: Version 9.0.3 (released with jws@^4.0.1 fix) is available
- **Waiting for**: netlify-cli to update their jsonwebtoken dependency

## Risk Acceptance Decision

**Decision**: ACCEPT RISK as residual until netlify-cli updates dependency

**Justification**:

1. ✅ **No runtime exposure**: Package not used in production application
2. ✅ **Dev-only dependency**: Only used for deployment CLI operations
3. ✅ **Not exploitable in our context**: We don't use JWT verification or HMAC operations
4. ✅ **Remediation attempted**: Multiple approaches tried, blocked by upstream dependency pinning
5. ✅ **Monitoring in place**: Will auto-resolve when netlify-cli updates jsonwebtoken
6. ✅ **Vulnerability age**: 3 days old (within 14-day acceptance window per policy)
7. ✅ **No alternative**: No other deployment method available that avoids this dependency

**Mitigating Controls**:

- netlify-cli only used in controlled development/deployment environment
- No untrusted input processed through netlify-cli JWT operations
- Production application does not include this dependency
- Regular dependency updates monitored

## Acceptance Criteria

This risk will be automatically resolved when:

1. netlify-cli updates to jsonwebtoken@9.0.3 or later, OR
2. netlify-cli removes jsonwebtoken dependency, OR
3. Alternative deployment method implemented that doesn't require netlify-cli

## Monitoring

- Check for netlify-cli updates: Weekly (via dry-aged-deps)
- Re-assess risk: After 14 days from vulnerability publication (2025-12-18)
- If still unresolved after 30 days: Consider alternative deployment approach

## References

- CVE: https://nvd.nist.gov/vuln/detail/CVE-2025-65945
- Advisory: https://github.com/advisories/GHSA-869p-cjfg-cm3x
- jws Releases: https://github.com/auth0/node-jws/releases
- jsonwebtoken Issue Tracker: https://github.com/auth0/node-jsonwebtoken/issues

## Related Incidents

- None (first occurrence of this specific vulnerability)

## Reviewer Approval

**Risk Accepted By**: Automated assessment system  
**Date**: 2025-12-07  
**Review Date**: 2025-12-18 (11 days from publication)  
**Re-assessment Due**: 2026-01-06 (30 days from publication)

---

**Note**: This incident will transition to RESOLVED status automatically when `npm audit` reports no vulnerabilities for this CVE.
