# ITIL Problem Management Process

This document outlines the ITIL problem management framework for the voder.ai website project, enabling systematic problem tracking, workaround implementation, root cause analysis, and resolution workflows to maintain service quality and prevent recurring incidents.

## Overview

The problem management process follows ITIL best practices with analytics-driven impact assessment to ensure problems are prioritized based on actual user impact rather than assumptions. The system emphasizes quick workaround implementation to minimize business impact while systematically addressing root causes.

## Problem Lifecycle

### 1. Problem Identification

- Problems are documented in `docs/problems/<name>.open.md`
- Use the template from `prompt-assets/problem-template.md`
- Follow naming convention: descriptive kebab-case names

### 2. Initial Assessment

- Assess business impact using analytics data from MS Clarity
- Determine likelihood of recurrence
- Calculate priority using Impact × Likelihood matrix
- Assign severity level based on user experience impact

### 3. Root Cause Analysis

- Use structured analysis techniques (5 Whys, fishbone diagrams, timeline analysis)
- Document evidence supporting conclusions
- Identify contributing factors and prevention strategies
- **Create failing test** that reproduces the problem (unit test or E2E Playwright test)
- Maintain focus on systematic investigation
- **Must complete BEFORE implementing workarounds** to ensure targeted solutions

### 4. Workaround Implementation

- Design workarounds based on root cause understanding for maximum effectiveness
- Prioritize speed of implementation over elegance, but ensure workaround addresses the actual cause
- Feature disabling is acceptable and often the best approach when root cause suggests architectural issues
- Service stability takes priority over feature availability
- **Skip/disable tests** when features are disabled as workaround
- **Exclude disabled code** from coverage reports when appropriate
- Document implementation steps, limitations, and rollback procedures

### 5. Status Transition to Known Error

Problems move to `<name>.known-error.md` when:

- Root cause is identified and documented
- Failing test that reproduces the problem is created
- Targeted workaround is implemented based on root cause understanding
- Permanent fix story is created (adhering to INVEST criteria)

### 6. Story Creation

- Create INVEST-compliant stories for permanent fixes
- Stories must be Independent, Negotiable, Valuable, Estimable, Small, and Testable
- Include clear acceptance criteria for problem resolution verification
- Establish traceability between problems and fixing stories
- Use #file:../prompt-assests/story-template.md as a template for the story

### 7. Fix Implementation

- Stories implemented through normal development process
- Follow existing story management framework
- **Re-enable previously failing tests** to verify fix effectiveness
- Tests should now pass, confirming problem resolution
- Maintain proper dependency documentation

### 8. Resolution Confirmation

- Verify fix in production environment
- Confirm problem no longer occurs
- Complete monitoring period to ensure stability

### 9. Closure

- Problems move to `<name>.closed.md`
- Document resolution confirmation and lessons learned
- Update any related documentation or processes

## Priority Assessment Framework

### Analytics-Based Impact Assessment

**Data Source**: MS Clarity Data Export API (use script: `scripts/fetch-clarity-analytics.js`)

**Impact Calculation Examples**:

- **Mobile-only problem**: Use mobile traffic percentage from analytics
- **Mobile + Tablet problem**: Combine mobile and tablet percentages
- **Desktop-only problem**: Use desktop traffic percentage
- **Cross-device problem**: 100% regardless of device breakdown

**Impact Thresholds**:

- **High (3)**: >70% of page views affected OR critical business impact
- **Medium (2)**: 30-70% of page views affected OR functionality limitations
- **Low (1)**: <30% of page views affected OR edge case problems

### Likelihood Assessment

- **High (3)**: Consistent occurrence or majority of users/scenarios affected
- **Medium (2)**: Intermittent occurrence or significant subset of users affected
- **Low (1)**: Rare occurrence or specific conditions required

### Priority Matrix (Impact × Likelihood)

| Impact\\Likelihood | High (3)     | Medium (2) | Low (1)     |
| ------------------ | ------------ | ---------- | ----------- |
| **High (3)**       | 9 - Critical | 6 - High   | 3 - Low     |
| **Medium (2)**     | 6 - High     | 4 - Medium | 2 - Low     |
| **Low (1)**        | 3 - Low      | 2 - Low    | 1 - Minimal |

## Workaround Management

### Strategy Guidelines

1. **Feature Disabling as Preferred Approach**:
   - Service stability takes priority over feature availability
   - Acceptable and often the best workaround while determining root causes
   - Reduces risk and immediately improves user experience

2. **Speed Over Elegance**:
   - Quick implementation to minimize business impact
   - Temporary solutions don't need to be perfect
   - Focus on restoring service quality

3. **Documentation Requirements**:
   - Implementation steps and procedures
   - Limitations and side effects
   - Business impact of disabled features (if applicable)
   - User communication strategy (if features are disabled)
   - Monitoring requirements and success criteria
   - Rollback procedures if workaround fails

### Implementation Process

1. Conduct thorough root cause analysis using appropriate methodology
2. Create failing test that reproduces the problem based on root cause understanding
3. Identify most effective workaround approach based on root cause findings
4. Assess business impact of proposed workaround
5. Implement targeted workaround with minimal risk
6. Document all aspects of the workaround including root cause basis
7. Monitor effectiveness and side effects
8. Communicate with stakeholders if user-facing changes
9. Plan for eventual rollback when permanent fix is deployed

## Test-Driven Problem Resolution

### Failing Test Creation (Critical Requirement)

**When root cause is identified (99% of cases), create a failing test that reproduces the problem:**

1. **Test Type Selection**:
   - **Unit Tests**: For logic errors, calculation issues, component behavior
   - **E2E Playwright Tests**: For user interaction issues, visual problems, browser-specific bugs
   - **Integration Tests**: For API issues, database problems, service communication

2. **Test Implementation Requirements**:
   - Test must fail consistently when problem exists
   - Test must be specific enough to isolate the exact issue
   - Test should cover the problematic scenario completely
   - Include clear test description explaining what problem it reproduces

3. **Workaround Test Management**:
   - **Skip/disable tests** when implementing feature-disabling workarounds
   - Use test framework skip mechanisms (`test.skip()`, `@Skip`, etc.)
   - **Exclude disabled code** from coverage reports to maintain accurate metrics
   - Document which tests are disabled and why in problem documentation

4. **Fix Validation Process**:
   - **Re-enable tests** when implementing permanent fix
   - Tests should pass, confirming problem is resolved
   - Failing tests after fix implementation indicate incomplete resolution
   - Update coverage reports to include previously excluded code

### Test Documentation Requirements

- **Test location**: File path and test name
- **Test type**: Unit, integration, or E2E test
- **Reproduction steps**: How test reproduces the problem
- **Expected vs actual behavior**: What should happen vs what actually happens
- **Skip status**: Whether test is currently skipped due to workaround

## Root Cause Analysis Framework

### Available Methodologies

1. **5 Whys Analysis**: For simple, linear cause chains
2. **Fishbone Diagram**: For complex problems with multiple contributing factors
3. **Timeline Analysis**: For sequence-dependent issues or cascading failures

### Documentation Requirements

- **Analysis methodology used**: Which technique was applied and why
- **Evidence and data**: Supporting information for conclusions
- **Contributing factors**: All factors that contributed to the problem
- **Prevention strategies**: How to avoid similar problems in the future
- **Failing test details**: Test that reproduces the problem

### Quality Standards

- Focus on facts and evidence, not assumptions
- Dig deep enough to find actionable root causes
- Consider both technical and process factors
- Document lessons learned for future reference

## File Management and Naming

### Filename Conventions

Problems follow the same pattern as architectural decisions:

- `<problem-name>.<status>.md`
- **Status values**: `open`, `known-error`, `closed`
- **Examples**:
  - `mobile-3d-cube-size-jump-scroll.open.md`
  - `text-flash-before-3d-render.known-error.md`
  - `login-validation-error.closed.md`

### Directory Structure

```
docs/problems/
├── problem-1.open.md
├── problem-2.known-error.md
├── problem-3.closed.md
└── [additional problems...]
```

### Version Control

- Use `git mv` when renaming files to preserve history
- Commit status changes with descriptive messages
- Tag significant milestones (workaround implemented, resolved, etc.)

## Integration with Existing Systems

### Story Management Integration

- Problem fix stories must follow template from `prompt-assets/story-template.md`
- Stories include clear acceptance criteria for problem resolution verification
- Dependencies properly documented with story numbers > dependency numbers
- Stories testable through problem non-recurrence verification

### Decision Management Integration

- Problems may reference relevant architectural decisions
- Cross-reference existing ADRs when problems relate to architectural choices
- Problems may inform future architectural decisions
- Maintain links between problems and related ADRs

### Analytics Integration

- **Dependency**: Requires 015.0-PO-ANALYTICS-PAGEVIEWS implementation
- **Data Access**: Use MS Clarity Data Export API via `scripts/fetch-clarity-analytics.js`
- **Update Frequency**: Analytics data refreshed for each new problem assessment
- **Accuracy**: Real data preferred over estimates for impact calculations

## Quality Assurance

### Problem Template Compliance

- All problems must use template from `prompt-assets/problem-template.md`
- Required fields must be completed before status progression
- Analytics data must be current and properly sourced
- Investigation tasks must be prioritized and tracked

### Process Validation

- Regular review of problem resolution effectiveness
- Monitoring of workaround success rates
- Analysis of root cause analysis quality
- Feedback collection from development team and stakeholders

### Continuous Improvement

- Review problem patterns to identify systemic issues
- Update processes based on lessons learned
- Refine priority matrix based on resolution outcomes
- Enhance root cause analysis techniques as needed

## Tools and Resources

### Required Tools

- **MS Clarity Data Export API**: For analytics-based impact assessment
- **Problem Template**: `prompt-assets/problem-template.md`
- **Analytics Script**: `scripts/fetch-clarity-analytics.js`
- **Story Management System**: Existing framework from 001.0-PO-STORY-MANAGEMENT

### Support Resources

- **Analytics Dashboard**: https://clarity.microsoft.com/projects/view/t5zu4kays7
- **Story Template**: `prompt-assets/story-template.md`
- **ADR Template**: `prompt-assets/adr-template.md`
- **Process Documentation**: This document

## Success Metrics

### Process Effectiveness

- **Problem Resolution Time**: Average time from identification to closure
- **Workaround Success Rate**: Percentage of workarounds that successfully mitigate impact
- **Root Cause Accuracy**: Quality of root cause identification and prevention
- **Recurrence Rate**: Percentage of problems that recur after resolution

### Business Impact

- **User Experience Improvement**: Reduction in user-reported issues
- **Service Stability**: Decrease in incident frequency and severity
- **Development Efficiency**: Faster problem resolution and prevention
- **Customer Satisfaction**: Improved user satisfaction metrics

## Training and Adoption

### Team Training Requirements

1. **ITIL Problem Management Principles**: Understanding of systematic approach
2. **Analytics-Driven Impact Assessment**: How to use Clarity data for prioritization
3. **Workaround Strategy**: When and how to implement effective workarounds
4. **Root Cause Analysis Techniques**: Proper application of analysis methodologies
5. **Integration Points**: How problem management connects with story and decision management

### Documentation Standards

- All team members must understand problem template usage
- Process workflow must be clearly communicated
- Integration points with existing systems must be documented
- Success criteria and quality standards must be established

---

## Quick Reference

### Status Progression Checklist

**Open → Known Error**:

- [ ] Root cause identified and documented
- [ ] **Failing test created** that reproduces the problem
- [ ] Targeted workaround implemented based on root cause understanding
- [ ] Tests skipped/disabled if feature is disabled as workaround
- [ ] Permanent fix story created (INVEST compliant)

**Known Error → Closed**:

- [ ] Permanent fix implemented
- [ ] **Previously failing tests re-enabled** and now passing
- [ ] Fix verified in production
- [ ] Problem no longer occurs
- [ ] Monitoring period completed

### File Naming Examples

- `mobile-3d-cube-size-jump-scroll.open.md`
- `text-flash-before-3d-render.known-error.md`
- `api-timeout-handling.closed.md`
