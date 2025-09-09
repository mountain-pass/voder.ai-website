---
status: 'acc3. Implementation overhead for development tasks would be too high
4. Multi-location story storage complicates decision trackingted'
date: 2025-09-04
decision-makers: ['Tom Howard']
consulted: []
informed: []
---

# Use In-Scope/Backlog Story Management with INVEST Criteria and Value-First Format

## Context and Problem Statement

A systematic approach to user story management should address several critical challenges:

1. **Scope Overwhelm**: Having all user stories and requirements visible simultaneously overwhelms both developers and LLMs
2. **Poor Story Quality**: Stories that use "the system" as actor and don't follow INVEST criteria
3. **Implementation-First Format**: Stories that focus on "how" rather than user value
4. **Missing Context**: Stories that lack connection to release goals and contribution clarity

The story management approach should implement one story at a time while ensuring each story follows proper user story best practices and clearly connects to the release goal.

## Decision Drivers

- **Development Focus**: Need to implement one story at a time without distraction
- **LLM Behavior**: AI assistants implement everything visible, regardless of state annotations
- **INVEST Criteria**: Stories must be Independent, Negotiable, Valuable, Estimable, Small, Testable
- **Value-First Format**: Stories should emphasize value ("so that"), then actor ("as a"), then implementation ("I want")
- **User-Centric**: No system actors; focus on product owners and developers as primary users
- **Release Context**: Each story must explain how it contributes to the release goal
- **File-based Control**: .voderignore and .gitignore only work on files/directories
- **Locality Principle**: Story requirements should be co-located with the story itself
- **Minimal Files**: Reduce file proliferation for easier navigation

## Considered Options

- **Story-Scoped .voderignore**: Separate directories per story with scope files
- **Progressive Story States**: Mark stories as FUTURE/READY/ACTIVE/DONE in single file
- **In-Scope/Backlog Structure**: Move stories between in-scope and backlog directories
- **Traditional User Story Format**: "As a X, I want Y, so that Z"
- **Value-First Story Format**: "So that Z, as a X, I want Y"

## Decision Outcome

Chosen option: "In-Scope/Backlog Structure with Value-First INVEST Stories", because it addresses all identified problems:

**Story Management**: File-based separation works reliably with ignore systems and provides simple progressive activation workflow.

**Story Format**: Value-first format ("So that X, as a Y, I want Z") emphasizes user value over implementation details, with product owners/developers as primary actors.

**Story Quality**: All stories must follow INVEST criteria and include release context.

### Story File Format

Each story file includes:

```markdown
# [STORY-ID]: [Short Title]

## Release Goal

_"[Release goal statement]"_

[Brief release description]

## How This Story Contributes

[Explanation of how this specific story enables or supports the release goal]

## User Story

So that [value/outcome], as a [actor: product owner/developer], I want [capability/action]

## Acceptance Criteria

- [Testable criterion 1]
- [Testable criterion 2]
- [etc.]

## Requirements (from [FR references])

- **[FR-ID]**: [Requirement description]
- [Additional FRs as needed]
```

### Directory Structure

```text
prompts/1-walking-skeleton/
├── user-story-map.md          # Full map (voderignored)
├── in-scope/
│   └── CLI-1.md               # Active story + requirements + context
└── backlog/
    ├── ENV-1.md               # (.voderignored)
    └── ... (all other stories)
```

### Consequences

- Good, because developers see only the active story and its requirements
- Good, because each story emphasizes user value before implementation details
- Good, because stories follow INVEST criteria for better development flow
- Good, because product owners/developers are clear primary actors (not "the system")
- Good, because each story explains its contribution to the release goal
- Good, because .voderignore can hide entire backlog directory reliably
- Good, because each story file is self-contained with full context
- Good, because moving files between directories provides simple workflow
- Good, because complete planning artifacts are preserved but hidden
- Bad, because requires manual file movement to activate new stories
- Bad, because planning artifacts (user story map) must be voderignored to prevent LLM distraction
- Bad, because value-first format may feel unnatural initially

### Confirmation

Implementation will be validated by:

1. LLM can only see active story when backlog is .voderignored
2. Each story follows value-first format: "So that X, as a Y, I want Z"
3. No stories use "the system" as an actor
4. Each story file contains complete context (release goal, contribution, requirements)
5. All stories meet INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)
6. Simple `mv` command workflow to activate next story
7. Complete user story map preserved for planning but voderignored

## Pros and Cons of the Options

### In-Scope/Backlog Structure

Structure:

```text
prompts/1-walking-skeleton/
├── user-story-map.md          # Full map (voderignored)
├── in-scope/
│   └── CLI-1.md               # Active story + requirements + context
└── backlog/
    ├── ENV-1.md               # (.voderignored)
    ├── OBS-1.md
    └── ... (all other stories)
```

- Good, because file-based separation works reliably with ignore systems
- Good, because minimal files (one per story)
- Good, because locality (story + requirements in same file)
- Good, because simple workflow (move files between directories)
- Good, because complete self-contained story context
- Neutral, because requires discipline to move stories progressively
- Bad, because planning artifacts must be hidden from development

### Story-Scoped .voderignore

- Good, because fine-grained control per story
- Bad, because creates many directories and files
- Bad, because complex .voderignore management
- Bad, because violates minimal files principle

### Progressive Story States

- Good, because single file maintenance
- Bad, because LLMs ignore state annotations and implement everything
- Bad, because no reliable way to hide non-active content

### Release-Scoped User Story Map

- Good, because focused context per story
- Bad, because duplicates planning information across files
- Bad, because increases file count significantly
- Bad, because breaks single source of truth for story map

## More Information

This decision supports the walking skeleton development approach where we implement the minimal viable functionality incrementally. The first story (CLI-1) establishes the basic help command that enables users to discover the --single-cycle option needed for the core OODA cycle functionality.

The decision will be implemented by restructuring the prompts/1-walking-skeleton/ directory and updating .voderignore files accordingly.
