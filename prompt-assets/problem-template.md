# {PROBLEM-NAME}: {Brief Problem Description}

**Date**: {YYYY-MM-DD}  
**Updated**: {YYYY-MM-DD}  
**Status**: 🔴 OPEN  
**Severity**: {High/Medium/Low}  
**Impact**: {Impact Level} ({Score}) - {Description with analytics data showing affected user percentage}  
**Likelihood**: {Likelihood Level} ({Score}) - {Description of recurrence probability}  
**Priority**: {Priority Score} ({Impact}×{Likelihood}) - {Priority Level}, {response timeframe}  
**Component**: {Affected system components}

## Problem Description

{Clear description of the problem symptoms and user-facing impact. Include what users experience and under what conditions the problem occurs.}

**Symptoms**:

- {Specific symptom 1}
- {Specific symptom 2}
- {Additional symptoms as needed}

**Conditions**:

- {When/where the problem occurs}
- {Specific user scenarios affected}
- {Environmental factors if relevant}

## User Experience Impact

- **{User Group}**: {Description of impact on this user group}
- **{Device/Platform}**: {Specific impact on different devices or platforms}
- **{Business Impact}**: {Impact on business goals or user conversion}

## Analytics-Based Impact Assessment

**Affected User Percentage**: {X}% of page views  
**Data Source**: MS Clarity Data Export API (last 3 days)  
**Device Breakdown**:

- Mobile: {X}% ({if applicable})
- Desktop: {X}% ({if applicable})
- Tablet: {X}% ({if applicable})

**Impact Calculation**: {Explanation of how the percentage was calculated}

## Technical Analysis

### Investigation Tasks

#### High Priority

- [ ] **{Investigation task 1}**: {Description}
- [ ] **{Investigation task 2}**: {Description}

#### Medium Priority

- [ ] **{Investigation task 3}**: {Description}
- [ ] **{Investigation task 4}**: {Description}

#### Low Priority

- [ ] **{Investigation task 5}**: {Description}

### Files Likely Affected

1. **{File path}**: {Description of involvement}
2. **{File path}**: {Description of involvement}
3. **{File path}**: {Description of involvement}

### Root Cause Hypothesis

{Initial hypothesis about what might be causing the problem. This will be updated as investigation progresses.}

## Workaround Implementation

### Status

- [ ] **Workaround Identified**: {Brief description}
- [ ] **Test Management Planned**: {Which tests to skip/disable, coverage exclusions}
- [ ] **Workaround Implemented**: {Implementation date}
- [ ] **Tests Skipped/Disabled**: {If features disabled, corresponding tests skipped}
- [ ] **Coverage Exclusions Applied**: {Disabled code excluded from coverage reports}
- [ ] **Workaround Verified**: {Verification date}

### Workaround Details

**Type**: {Feature disabling / Configuration change / Code patch / etc.}  
**Implementation**: {Step-by-step implementation instructions}

**Limitations**:

- {Limitation 1}
- {Limitation 2}

**Side Effects**:

- {Side effect 1}
- {Side effect 2}

**Business Impact of Workaround**:

- {Impact on user experience}
- {Impact on business functionality}

**Test Management**:

- **Tests Skipped**: {List of tests that are skipped due to workaround}
- **Coverage Exclusions**: {Code paths excluded from coverage due to disabled features}
- **Skip Reason**: {Explanation of why tests are skipped (e.g., feature disabled)}
- {Communication strategy for users if features are disabled}

**Monitoring Requirements**:

- {What to monitor to ensure workaround effectiveness}
- {Warning signs that workaround is failing}

**Rollback Procedure**:

- {Steps to rollback workaround if needed}

## Root Cause Analysis

### Methodology Used

- [ ] **5 Whys Analysis**
- [ ] **Fishbone Diagram**
- [ ] **Timeline Analysis**
- [ ] **Other**: {Specify methodology}

### Analysis Results

{Document the root cause analysis process and findings here. Include evidence and data that supports the conclusions.}

**Evidence Supporting Root Cause**:

- {Evidence item 1}
- {Evidence item 2}
- {Evidence item 3}

**Contributing Factors**:

- {Factor 1}
- {Factor 2}

**Prevention Strategy**:
{How to prevent this problem from recurring in the future}

## Failing Test (Critical for Problem Validation)

### Test Details

**Test Type**: {Unit Test / E2E Playwright Test / Integration Test}  
**Test Location**: `{file-path}`  
**Test Name**: `{test-name}`  
**Test Status**: {Created / Skipped / Re-enabled / Passing}

### Test Implementation

```{language}
{Insert the failing test code that reproduces the problem}
```

### Test Description

**What it reproduces**: {Clear description of how the test reproduces the problem}  
**Expected behavior**: {What should happen when the problem is fixed}  
**Actual behavior**: {What currently happens that demonstrates the problem}

### Test Management During Workaround

- [ ] **Test skipped/disabled**: {Date} - {Reason (e.g., feature disabled as workaround)}
- [ ] **Code excluded from coverage**: {Coverage exclusion details if applicable}
- [ ] **Skip reason documented**: {Clear explanation of why test is skipped}

### Test Re-enablement for Fix Validation

- [ ] **Test re-enabled**: {Date} - {When permanent fix is implemented}
- [ ] **Test passes**: {Confirmation that test now passes with fix}
- [ ] **Coverage updated**: {Previously excluded code now included in coverage}

## Permanent Fix Story

**Story Reference**: {Link to INVEST-compliant story for permanent fix}  
**Story Status**: {Not Created / In Progress / Completed}

### Story Requirements

- [ ] **Independent**: Can be developed independently
- [ ] **Negotiable**: Implementation details can be refined
- [ ] **Valuable**: Delivers clear business value by preventing problem recurrence
- [ ] **Estimable**: Scope is clear enough for development estimation
- [ ] **Small**: Can be completed within reasonable timeframe
- [ ] **Testable**: Success can be verified through problem non-recurrence

## Resolution and Closure

### Resolution Steps

- [ ] **Permanent fix implemented**: {Implementation date}
- [ ] **Tests re-enabled**: {Previously skipped tests re-enabled for validation}
- [ ] **Tests passing**: {Failing tests now pass, confirming fix effectiveness}
- [ ] **Coverage updated**: {Previously excluded code now included in coverage}
- [ ] **Fix verified in production**: {Verification date}
- [ ] **Problem no longer occurs**: {Confirmation date}
- [ ] **Monitoring period completed**: {End date}

### Confirmation Criteria

- {Criteria 1 for confirming the problem is resolved}
- {Criteria 2 for confirming the problem is resolved}

### Post-Resolution Notes

{Any additional notes about the resolution, lessons learned, or preventive measures implemented}

## Related Issues and References

### Related Problems

- {Link to related problem files}

### Related Stories

- {Link to related user stories}

### Related Decisions

- {Link to relevant architectural decision records}

### External References

- {Links to documentation, bug reports, or other external resources}

## Timeline

| Date         | Event                     | Notes        |
| ------------ | ------------------------- | ------------ |
| {YYYY-MM-DD} | Problem identified        | {Brief note} |
| {YYYY-MM-DD} | Investigation started     | {Brief note} |
| {YYYY-MM-DD} | Workaround implemented    | {Brief note} |
| {YYYY-MM-DD} | Root cause identified     | {Brief note} |
| {YYYY-MM-DD} | Fix story created         | {Brief note} |
| {YYYY-MM-DD} | Permanent fix implemented | {Brief note} |
| {YYYY-MM-DD} | Problem closed            | {Brief note} |

---

## Template Usage Guide

### Problem Naming Convention

- **{PROBLEM-NAME}**: Brief, descriptive name using kebab-case format
- **Examples**: `mobile-3d-cube-size-jump-scroll`, `text-flash-before-3d-render`, `login-form-validation-error`

### Status Progression

1. **{name}.open.md**: Initial problem documentation and investigation
2. **{name}.known-error.md**: Workaround implemented, root cause documented, fix story created
3. **{name}.closed.md**: Permanent fix implemented and verified

### Impact Assessment Guidelines

**Analytics-Based Impact Calculation**:

- Use MS Clarity Data Export API to get current device breakdown
- Calculate affected user percentage based on problem scope
- Mobile-only: Use mobile percentage
- Mobile + Tablet: Combine mobile and tablet percentages
- All devices: 100% regardless of breakdown

**Impact Levels**:

- **High (3)**: >70% of page views affected OR critical business impact
- **Medium (2)**: 30-70% of page views affected OR functionality limitations
- **Low (1)**: <30% of page views affected OR edge case problems

**Likelihood Levels**:

- **High (3)**: Consistent occurrence or affects majority of users/scenarios
- **Medium (2)**: Intermittent occurrence or affects significant subset of users
- **Low (1)**: Rare occurrence or specific conditions required

**Priority Matrix (Impact × Likelihood)**:

- **Priority 9**: Critical - immediate workaround required
- **Priority 6**: High - workaround within 24 hours
- **Priority 4**: Medium - workaround within week
- **Priority 3**: Low - address in next sprint
- **Priority 1**: Minimal - address when convenient

### Workaround Strategy

**Feature Disabling as Preferred Workaround**:

- Service stability takes priority over feature availability
- Disabling problematic features is acceptable and often the best approach
- Document user communication strategy when features are disabled
- Ensure business impact is clearly assessed and communicated

### Integration Requirements

**Story Management Integration**:

- All permanent fix stories must follow existing story template structure
- Stories must include clear acceptance criteria for problem resolution verification
- Dependencies must be properly documented with story numbers
- Stories must be testable through problem non-recurrence verification

**Decision Management Integration**:

- Reference relevant architectural decisions when applicable
- Problems may inform future architectural decisions
- Cross-reference with existing ADRs for context
