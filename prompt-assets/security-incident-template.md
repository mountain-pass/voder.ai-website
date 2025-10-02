# Security Incident Report: {INCIDENT-TITLE}

**Date**: {YYYY-MM-DD}  
**Updated**: {YYYY-MM-DD}  
**Incident ID**: SECURITY-INCIDENT-{YYYY-MM-DD}-{brief-description}  
**Status**: 🔴 {DETECTED | INVESTIGATING | CONTAINED | RESOLVED | CLOSED}  
**Severity**: {CRITICAL | HIGH | MEDIUM | LOW}  
**Response SLA**: {Response time requirement based on severity}  
**Assigned Investigator**: {Name/Role}  
**Business Impact**: {Description of business impact}  
**Technical Impact**: {Description of technical systems affected}

## Executive Summary

{Brief 2-3 sentence summary of the incident, its impact, and resolution status. This section should be understandable by non-technical stakeholders.}

## Incident Classification

**Severity Justification**: {Why this severity level was assigned}

**Severity Criteria**:

- **CRITICAL**: Active data breach, exposed production credentials, system compromise
- **HIGH**: Exposed development credentials, potential data exposure, security vulnerability in production
- **MEDIUM**: Security misconfiguration, exposed logs with sensitive data, deprecated security practices
- **LOW**: Security best practice violations, minor configuration issues

## Incident Details

### Initial Detection

- **Detection Method**: {How the incident was discovered}
- **Detection Time**: {When the incident was first detected}
- **Detection Source**: {Who/what detected the incident}
- **Initial Symptoms**: {What symptoms were observed}

### Scope Assessment

**Affected Systems**:

- {List of affected systems, services, or components}

**Compromised Data Types**:

- {Types of data potentially compromised}

**Exposure Timeline**:

- **First Exposure**: {When the vulnerability was first introduced}
- **Detection**: {When the vulnerability was detected}
- **Exposure Duration**: {How long the vulnerability existed}

**Affected Credentials**:

- {List of credentials that were exposed or compromised}

### Attack Vectors

**Potential Attack Vectors**:

- {How the vulnerability could be exploited}
- {Access methods available to potential attackers}
- {Systems or data that could be accessed}

## Investigation Timeline

| Time    | Status        | Action Taken                     | Investigator |
| ------- | ------------- | -------------------------------- | ------------ |
| {HH:MM} | DETECTED      | {Initial detection and alert}    | {Name}       |
| {HH:MM} | INVESTIGATING | {Investigation actions}          | {Name}       |
| {HH:MM} | CONTAINED     | {Containment measures}           | {Name}       |
| {HH:MM} | RESOLVED      | {Resolution actions}             | {Name}       |
| {HH:MM} | CLOSED        | {Post-incident review completed} | {Name}       |

## Immediate Response Actions

### Containment Measures

**Actions Taken**:

- [ ] {Immediate containment action 1}
- [ ] {Immediate containment action 2}
- [ ] {Additional containment measures}

**Threat Status**: {Current threat containment status}

### Credential Response

**Compromised Credentials**:

- [ ] {Credential 1}: {Rotation status}
- [ ] {Credential 2}: {Rotation status}
- [ ] {Additional credentials}

**Rotation Verification**:

- [ ] {Verification that old credentials no longer work}
- [ ] {Verification that new credentials are properly configured}

## Root Cause Analysis

### 5 Whys Analysis

**Why #1: Why did this security incident occur?**

- {Root cause level 1}

**Why #2: Why did {root cause level 1} happen?**

- {Root cause level 2}

**Why #3: Why did {root cause level 2} happen?**

- {Root cause level 3}

**Why #4: Why did {root cause level 3} happen?**

- {Root cause level 4}

**Why #5: Why did {root cause level 4} happen?**

- {Ultimate root cause}

### Contributing Factors

**Technical Factors**:

- {Technical factors that contributed to the incident}

**Process Factors**:

- {Process gaps or failures that contributed}

**Human Factors**:

- {Human error or knowledge gaps that contributed}

**Environmental Factors**:

- {External or environmental factors}

## Resolution Actions

### Security Hardening

**Implemented Measures**:

- [ ] {Security hardening measure 1}
- [ ] {Security hardening measure 2}
- [ ] {Additional security measures}

### System Changes

**Configuration Updates**:

- [ ] {Configuration change 1}
- [ ] {Configuration change 2}

**Code Changes**:

- [ ] {Code change 1}
- [ ] {Code change 2}

### Monitoring Enhancements

**New Monitoring**:

- [ ] {Monitoring enhancement 1}
- [ ] {Monitoring enhancement 2}

**Alert Improvements**:

- [ ] {Alert improvement 1}
- [ ] {Alert improvement 2}

## Impact Assessment

### Business Impact

**Service Availability**: {Impact on service availability}
**Data Confidentiality**: {Impact on data confidentiality}
**Regulatory Compliance**: {Compliance implications}
**Customer Trust**: {Impact on customer trust and reputation}

### Technical Impact

**System Security**: {Impact on overall system security posture}
**Data Integrity**: {Impact on data integrity}
**Infrastructure**: {Infrastructure security implications}
**Integration Points**: {Impact on system integrations}

## Evidence and Logs

### Evidence Preserved

**Log Files**:

- {Location and timeframe of preserved logs}

**Configuration Snapshots**:

- {Configuration states captured for analysis}

**Network Traffic**:

- {Network analysis data if applicable}

**File System**:

- {File system evidence if applicable}

### Analysis Results

**Log Analysis Summary**:

- {Key findings from log analysis}

**Timeline Reconstruction**:

- {Reconstructed timeline of events}

**Attack Pattern Analysis**:

- {Analysis of attack patterns if applicable}

## Prevention Measures

### Immediate Preventions

**Implemented Controls**:

- [ ] {Immediate prevention control 1}
- [ ] {Immediate prevention control 2}

### Long-term Preventions

**Process Improvements**:

- [ ] {Process improvement 1}
- [ ] {Process improvement 2}

**Technology Enhancements**:

- [ ] {Technology enhancement 1}
- [ ] {Technology enhancement 2}

**Training and Awareness**:

- [ ] {Training requirement 1}
- [ ] {Training requirement 2}

## Post-Incident Review

### Lessons Learned

**What Worked Well**:

- {Positive aspects of incident response}

**What Could Be Improved**:

- {Areas for improvement in incident response}

**Process Gaps Identified**:

- {Gaps in processes or procedures}

### Recommendations

**Immediate Actions** (within 1 week):

- [ ] {Immediate recommendation 1}
- [ ] {Immediate recommendation 2}

**Short-term Actions** (within 1 month):

- [ ] {Short-term recommendation 1}
- [ ] {Short-term recommendation 2}

**Long-term Actions** (within 3 months):

- [ ] {Long-term recommendation 1}
- [ ] {Long-term recommendation 2}

### Follow-up Items

**New Stories Required**:

- [ ] Link to story: {Story implementing prevention measure}
- [ ] Link to story: {Story implementing monitoring enhancement}

**Decision Updates Required**:

- [ ] Link to decision: {Decision requiring update based on incident}

**Process Updates Required**:

- [ ] {Process documentation requiring updates}

## Cross-References

### Related Items

**Problems**:

- Link to problem: {Related technical problem if applicable}

**Decisions**:

- Link to decision: {Related architectural decision}

**Stories**:

- Link to story: {Story implementing resolution or prevention}

### Compliance and Reporting

**Regulatory Requirements**:

- {Any regulatory reporting requirements met}

**Stakeholder Communications**:

- {Communications sent to stakeholders}

**External Notifications**:

- {Any external parties notified}

## Metrics and Tracking

### Response Metrics

**Detection Time**: {Time from incident occurrence to detection}
**Response Time**: {Time from detection to initial response}
**Containment Time**: {Time from detection to containment}
**Resolution Time**: {Time from detection to resolution}
**Total Incident Duration**: {Total time from occurrence to closure}

### Cost Assessment

**Direct Costs**: {Direct costs incurred due to incident}
**Indirect Costs**: {Estimated indirect costs (downtime, reputation, etc.)}
**Prevention Investment**: {Cost of prevention measures implemented}

## Approval and Sign-off

**Incident Closure Approved By**: {Name and Role}
**Date Closed**: {YYYY-MM-DD}
**Post-Incident Review Completed**: {YYYY-MM-DD}
**Prevention Measures Verified**: {YYYY-MM-DD}

---

**Template Version**: 1.0
**Template Source**: prompt-assets/security-incident-template.md
**Related Process**: prompts/release-0.5/in-scope/025.0-PO-SECURITY-INCIDENT-MANAGEMENT.md
