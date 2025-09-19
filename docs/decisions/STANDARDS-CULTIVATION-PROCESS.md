# Standards Cultivation Process

## Overview

This document outlines the standards cultivation process for the voder.ai project, focusing on health of standards system and quality of standards produced rather than traditional architectural review.

## Philosophy

### Standards Cultivator Mindset

We prioritize the **health of the standards system** and **quality of standards produced** over traditional architectural review. Our goal is to balance innovation and standardization while encouraging experiments that improve our standards.

### Core Principles

1. **Open Innovation**: Anyone can propose standards without subjective review barriers
2. **Production Validation**: Only endorse standards with positive production track record
3. **Experimentation Culture**: Actively encourage exemptions as experiments to improve standards
4. **Non-Retrospective**: Standards not applied retrospectively to existing systems

## Standards Proposal System

### Who Can Propose

Anyone in the organization can propose standards. There are no gatekeepers or subjective review barriers.

### Standard Quality Criteria

All proposed standards must be:

- **Non-subjective and measurable**: Clear, objective criteria that can be verified
- **Easy to follow and implement**: Practical and actionable guidance
- **Succinctly summarized in title**: Clear intent (e.g., "Use JSON in REST API responses")
- **Well-documented**: Include options considered and rationale for choice
- **Context-aware**: List existing standards it will supersede
- **Future-focused**: Include reassessment criteria for future review

### Submission Process

1. **Create ADR**: Use MADR 4.0 format with "proposed" status
2. **Quality Check**: Ensure meets quality criteria above
3. **Improvement Support**: If criteria not met, help resubmit (never decline)
4. **Sequential Numbering**: Assign next available decision number

## Standards Lifecycle

### Status Progression

1. **Proposed**: New standard submitted, under consideration
2. **Accepted**: Standard endorsed based on production track record
3. **Deprecated**: Standard superseded by newer approach
4. **Superseded**: Replaced by specific newer standard

### Endorsement Criteria

Standards can only be endorsed when they have:

- Positive production implementation track record
- Demonstrated value in real usage
- Team consensus on effectiveness

### Deprecation Process

When endorsing new standards:

- Explicitly supersede the standards they replace
- Document migration path if applicable
- Set timeline for transition period

## Compliance Framework

### Application Rules

- **Endorsed Standards**: Projects MUST follow unless exempted
- **Proposed Standards**: Projects MUST follow unless:
  - Competing proposed standard exists they can follow
  - Board grants exemption
  - They submit competing proposed standard
- **Deprecated Standards**: Teams must NOT use for new implementations unless exempted

### No Retrospective Application

Standards are never applied retrospectively. Existing systems continue operating under their current approach until they choose to upgrade.

## Exemption and Experimentation System

### Exemption Philosophy

Exemptions are encouraged as experiments that can improve our standards. They represent opportunities to discover better approaches.

### Granting Exemptions

Exemptions are granted when developers have:

- **Non-trivial reason**: Legitimate technical or business justification
- **Experiment commitment**: Agreement to document experiment results
- **Contribution promise**: Willingness to propose new standard if experiment succeeds

### Exemption Tracking

All exemptions are tracked as experiments within the corresponding decision's "exemptions" section, including:

- Reason for exemption
- Expected experiment duration
- Success criteria
- Results documentation

### Experiment Feedback Loop

Developers must document experiment outcomes in the decision's exemptions section:

- What was learned
- Whether approach was successful
- Recommendations for standard updates
- Proposed new standards if applicable

## Standards Maintenance and Review

### Review Triggers

Standards are reviewed in these contexts:

- **Contextual Review**: When creating related decisions, updating dependencies, or encountering conflicts
- **Usage Assessment**: Periodically assess production usage patterns
- **Exemption-Driven Review**: Automatically review when exemption count exceeds threshold (3+ exemptions)
- **Track Record Assessment**: Regular evaluation of production success

### Review Process

1. **Assess Usage**: Promote standards with positive production usage
2. **Flag Unused**: Identify standards for deprecation if not actively used
3. **Evaluate Exemptions**: Review experiment results and patterns
4. **Update Standards**: Modify, deprecate, or endorse based on evidence

### Success Metrics

Standards thrive based on:

- Positive production track record
- Low exemption rates
- Team satisfaction and adoption
- Measurable improvement in outcomes

## Integration with ADR System

### Decision Format

All standards follow MADR 4.0 format with:

- Clear problem statement and context
- Multiple options considered with pros/cons
- Explicit rationale for choice
- Documented consequences (positive and negative)
- Confirmation criteria for compliance verification

### Cross-References

- Standards reference implementing stories when applicable
- Stories link to relevant architectural decisions
- Easy navigation between related decisions

### Version Control

- Use git mv for file renames to preserve history
- Maintain decision history through version control
- Document decision evolution in commit messages

## Quality Assurance

### Preventing Duplicates

- **Number Validation**: Ensure no duplicate decision numbers
- **Topic Validation**: Check for decisions covering same architectural area
- **Review Process**: New decisions reviewed against existing decisions
- **Cleanup Process**: Clear process for removing outdated decisions

### Template Consistency

- All decisions follow MADR 4.0 template structure
- Consistent metadata format
- Standard section organization
- Uniform status tracking

### Content Standards

- **Timeless Content**: Decisions use principle-based language that remains valid over time
- **Architectural Focus**: Address "how to do work" (principles, technology choices, standards) not "what work to do" (tasks, implementation plans)
- **Context Documentation**: Include problem statement and context
- **Option Analysis**: Consider multiple approaches with trade-offs
- **Clear Rationale**: Explicit explanation of decision reasoning

## Continuous Improvement

This standards cultivation process itself follows the same principles:

- Open to proposals for improvement
- Validated through production usage
- Subject to exemptions and experiments
- Regularly reviewed and updated based on track record

The process document will be updated based on actual usage patterns and team feedback to ensure it continues serving the organization's needs effectively.
