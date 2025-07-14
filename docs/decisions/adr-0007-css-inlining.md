---
status: 'accepted'
date: 2025-07-09
decision-makers: voder.ai website team
---

# ADR 0007: Use Beasties for Critical CSS Inlining

## Context and Problem Statement
The Voder.ai pre-launch site currently loads its global stylesheet (`style.css`) synchronously, blocking rendering and delaying the First Contentful Paint (FCP). Lighthouse CI reports FCP above our 1500 ms budget, and render-blocking CSS has been identified as a primary culprit.

## Decision Drivers
- Meet performance budgets for First Contentful Paint (≤ 1500 ms)
- Minimize CI build time and complexity
- Automate critical CSS extraction without manual maintenance overhead
- Leverage a well-maintained, community-supported plugin for inlining

## Considered Options

- Critters (deprecated): upstream Critters plugin for critical CSS inlining
- Beasties: an actively maintained fork of Critters that inlines critical CSS without a headless browser
- Manual inlining: hand-craft critical CSS rules in `<style>` tags (brittle and high maintenance)

## Decision Outcome
Chosen option: **Beasties**, because it automates critical CSS inlining quickly and reliably, integrates seamlessly with our Vite build via `vite-plugin-beasties`, and significantly reduces render-blocking CSS without introducing a headless browser dependency.

### Consequences
- **Positive**: Improved FCP (below 1500 ms) and overall performance; CI builds faster and remains simple.
- **Negative**: Adds a `beasties` dev dependency and plugin configuration; CSS changes may require cache invalidation and occasional tuning of critical CSS settings.

## Confirmation
- Verify FCP drops below 1500 ms in Lighthouse CI (`npm run assert:lhci`).
- Confirm critical CSS is inlined in production HTML and non-critical CSS is deferred.
- Measure CI build times to ensure reduction in CSS processing time.

## Pros and Cons of the Options

### Critters (deprecated)
- Good: Originally designed for critical CSS inlining.
- Bad: No longer actively maintained; limited compatibility with modern build tools.

### Beasties
- Good: Fast, headless-browser–free critical CSS inlining; integrates with Vite via `vite-plugin-beasties`.
- Good: Automatically prunes unused CSS and supports font inlining/preloading.
- Neutral: May include more CSS than strictly above-the-fold without a browser-based analysis.
- Bad: New dependency to manage; may require occasional configuration tweaks.

### Manual inlining
- Good: Full control over which CSS rules are critical.
- Bad: High maintenance overhead; fragile as CSS grows and changes.

## More Information
- Beasties documentation: https://github.com/danielroe/beasties
- Vite plugin: https://www.npmjs.com/package/vite-plugin-beasties
