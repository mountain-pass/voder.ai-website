---
status: 'deprecated'
date: 2024-06-07
decision-makers: voder.ai website team
---

# ADR 0004: Use Reveal.js for the Pre-launch Deck

## Context and Problem Statement

Our homepage needs to behave as a controlled, linear pitch deck rather than a free-scrolling page. We require reliable slide navigation, fast load times, mobile responsiveness, and easy slide authoring and maintenance.

## Decision Drivers

- Narrative control: enforce a clear slide-by-slide progression.
- Mobile responsiveness: adapt slides to different screen sizes without custom hacks.
- Minimal dependencies and maintenance overhead.
- Ease of authoring and updating slide content.

## Considered Options

- Custom scroll page
- Existing slider/carousel libraries
- Reveal.js

## Decision Outcome

Chosen option: "Reveal.js", because it provides battle-tested slide navigation, responsive layouts, hash-based deep-linking, and an extensible plugin ecosystem with minimal configuration.

### Consequences

- Good, because built-in keyboard, touch, and hash navigation support.
- Good, because slide content can be authored in HTML or Markdown.
- Bad, because it introduces an additional dependency.
- Bad, because future upgrades may introduce breaking changes (mitigated by lockfile pinning).

### Confirmation

- Verify navigation tests pass (keyboard arrows, deep-linking).
- Confirm responsiveness on mobile and tablet viewports.
- Ensure slides load and present correctly without custom code.

## Pros and Cons of the Options

### Custom scroll page

- Good, because no external library dependency.
- Bad, because significant development and maintenance effort.
- Bad, because complex scroll animations and responsiveness hacks required.

### Existing slider/carousel libraries

- Good, because lightweight and easy to integrate for simple use cases.
- Bad, because focused on image galleries, not full-page content.
- Bad, because they lack deep narrative features (slide numbering, URL hashes).

### Reveal.js

- Good, because a proven HTML slide framework with navigation, hash support, and responsive design.
- Good, because plugin ecosystem for themes, Markdown, and future extensions.
- Neutral, because it adds one external dependency.
- Bad, because binding to a specific API requires version management.

## More Information

- Reveal.js documentation: https://revealjs.com/
- Initialization code in `src/deck-init.js`.
