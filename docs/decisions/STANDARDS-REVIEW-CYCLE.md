# Standards Review Cycle

## Overview

This document defines the regular review process for standards deprecation and endorsement within the standards cultivation system. The review cycle ensures standards remain relevant, effective, and aligned with production realities.

## Review Philosophy

### Evidence-Based Evolution

Standards reviews focus on:

- **Production Track Record**: Actual usage and success patterns
- **Team Experience**: Qualitative feedback from implementation
- **Measurable Outcomes**: Objective metrics of standard effectiveness
- **Exemption Patterns**: Learning from experiment results

### Health-Focused Approach

Reviews prioritize the health of the standards system over individual standard preservation. Standards that don't serve the organization well should be deprecated or improved.

## Review Triggers

### Contextual Reviews

Standards are reviewed when:

- **Related Decision Creation**: New decisions that impact existing standards
- **Dependency Updates**: Technology or tool changes affecting standards
- **Conflict Detection**: Standards that contradict or overlap
- **Cross-Reference Updates**: Changes to related stories or decisions

### Scheduled Reviews

- **Quarterly Assessment**: Regular review of all active standards
- **Annual Deep Dive**: Comprehensive evaluation of standards system health
- **Project Milestone Reviews**: At major project phases or releases

### Threshold-Based Reviews

Automatic review triggers:

- **Exemption Threshold**: 3+ exemptions for any standard
- **Usage Decline**: Significant drop in standard adoption
- **Negative Feedback**: Consistent implementation challenges reported
- **Technology Obsolescence**: Underlying technology becomes deprecated

### Event-Driven Reviews

- **Incident Analysis**: When standards-related issues cause problems
- **New Technology**: When new tools or approaches become available
- **Team Changes**: When team composition or expertise changes significantly
- **Process Improvement**: When development process changes affect standards applicability

## Review Process

### Pre-Review Preparation

1. **Data Collection**:
   - Usage statistics across projects
   - Exemption count and patterns
   - Implementation feedback from teams
   - Performance metrics where applicable

2. **Context Analysis**:
   - Current technology landscape
   - Team capabilities and preferences
   - Project requirements and constraints
   - Industry best practices evolution

3. **Stakeholder Input**:
   - Developer feedback on implementation experience
   - Project owner requirements and priorities
   - Technical lead recommendations
   - Community input from related standards

### Review Execution

#### Usage Assessment

For each standard, evaluate:

- **Adoption Rate**: Percentage of applicable projects using standard
- **Compliance Quality**: How well teams implement the standard
- **Implementation Ease**: Difficulty reported by developers
- **Value Delivery**: Measurable benefits achieved

#### Track Record Analysis

Examine production outcomes:

- **Success Metrics**: Quantitative measures of standard effectiveness
- **Failure Patterns**: Where and why standards failed to deliver value
- **Comparative Performance**: Results vs. alternative approaches
- **Long-term Sustainability**: Whether standard remains viable

#### Exemption Review

Analyze exemption patterns:

- **Common Reasons**: Frequent justifications for exemptions
- **Experiment Results**: Outcomes from alternative approaches
- **Success Rate**: Percentage of exemptions that found better solutions
- **Standard Gaps**: Areas where standard fails to address real needs

#### Team Feedback

Gather qualitative input:

- **Implementation Experience**: Developer satisfaction and challenges
- **Training Needs**: Skills gaps or documentation issues
- **Tool Support**: Availability of supporting tools and resources
- **Future Viability**: Team assessment of standard's continued relevance

### Review Outcomes

#### Standard Promotion

**Proposed → Accepted**

- Criteria: Positive production track record, low exemption rate, team satisfaction
- Process: Update status, document success metrics, communicate endorsement
- Timeline: Minimum 6 months in proposed status with active usage

#### Standard Modification

**Accepted → Updated Version**

- Triggers: Exemption patterns reveal improvement opportunities
- Process: Create new version, deprecate old version, provide migration guidance
- Validation: New version must address identified shortcomings

#### Standard Deprecation

**Accepted → Deprecated**

- Criteria: Consistent exemptions, negative outcomes, better alternatives available
- Process: Mark deprecated, set transition timeline, document replacement approach
- Support: Provide migration path and support for affected projects

#### Standard Supersession

**Accepted → Superseded**

- Triggers: New standard covers same area more effectively
- Process: Explicit reference to superseding standard, clear migration timeline
- Documentation: Update both old and new standards with cross-references

## Review Criteria

### Endorsement Criteria

Standards earn endorsement through:

- **Production Success**: Demonstrated positive outcomes in real projects
- **Team Adoption**: Willing adoption by multiple teams
- **Measurable Value**: Quantifiable improvements in relevant metrics
- **Low Friction**: Easy implementation without significant overhead
- **Sustainable Practice**: Approach that teams can maintain long-term

### Deprecation Criteria

Standards are deprecated when:

- **Consistent Exemptions**: High exemption rate indicates fundamental issues
- **Negative Outcomes**: Production usage shows poor results
- **Technology Obsolescence**: Underlying technology no longer viable
- **Better Alternatives**: Proven superior approaches become available
- **Maintenance Burden**: Standard requires more effort than value delivered

### Modification Criteria

Standards are updated when:

- **Edge Case Discovery**: Exemptions reveal valid use cases not covered
- **Implementation Clarity**: Teams struggle with interpretation or application
- **Tool Evolution**: Supporting tools change in ways that affect standard
- **Scope Refinement**: Standard too broad or too narrow for practical use

## Review Documentation

### Review Reports

Each review produces:

- **Standards Assessed**: List of standards reviewed
- **Data Summary**: Usage statistics, exemption patterns, feedback themes
- **Decisions Made**: Specific actions taken for each standard
- **Rationale**: Reasoning behind each decision
- **Next Steps**: Follow-up actions and timeline

### Decision Updates

Update affected ADR files with:

- **Review Date**: When review was conducted
- **Review Outcome**: Decision made about standard
- **Supporting Evidence**: Data and feedback that informed decision
- **Future Review**: Next scheduled review date

### Communication Plan

Communicate review results through:

- **Team Notifications**: Direct communication to affected teams
- **Documentation Updates**: Refresh relevant documentation
- **Training Updates**: Modify training materials if needed
- **Tool Updates**: Update automated checking tools if applicable

## Integration with Standards System

### Continuous Feedback

Review process feeds back into:

- **New Standard Proposals**: Insights inform future standards
- **Process Improvements**: Review experience improves review process itself
- **Quality Standards**: Review outcomes raise bar for new standards
- **Training Programs**: Review findings inform team education

### Cross-Standard Analysis

Look for patterns across standards:

- **Category Trends**: How standards in different areas perform
- **Technology Patterns**: Which technology choices work well
- **Team Capabilities**: Where teams excel or struggle
- **Process Effectiveness**: Which standards cultivation practices work best

## Quality Assurance

### Review Completeness

Ensure reviews:

- Cover all applicable standards systematically
- Include all relevant data sources
- Gather input from all affected stakeholders
- Document decisions with clear rationale

### Review Objectivity

Maintain objectivity through:

- **Data-Driven Decisions**: Base outcomes on evidence, not opinion
- **Multiple Perspectives**: Include diverse viewpoints in review process
- **Bias Recognition**: Acknowledge and account for potential biases
- **External Validation**: Seek industry perspective where appropriate

## Continuous Improvement

### Review Process Evolution

The review process itself is regularly reviewed:

- **Effectiveness Assessment**: Whether reviews improve standards quality
- **Efficiency Analysis**: How to conduct reviews with less overhead
- **Stakeholder Satisfaction**: Whether review process serves teams well
- **Outcome Quality**: Whether review decisions prove correct over time

### Success Metrics

Track review process success through:

- **Standards Health**: Overall quality improvement of standards
- **Team Satisfaction**: Developer experience with standards system
- **Decision Quality**: Accuracy of review decisions over time
- **System Evolution**: Continuous improvement in standards cultivation
