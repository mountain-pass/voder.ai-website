---
status: 'accepted'
date: 2025-07-08
decision-makers: voder.ai website team
consulted: development team, LLM-assisted development stakeholders
informed: project stakeholders
---

# ADR 0006: Use Vite + Vanilla TypeScript

## Context and Problem Statement

Technology stack selection should maximize AI-assisted development effectiveness while maintaining compatibility with technical investments in animations (GSAP), 3D elements (Three.js), and accessibility features.

Key considerations include:

- Large Language Models (LLMs) have varying levels of familiarity with different frameworks and syntax
- AI-assisted code generation and debugging effectiveness varies significantly across technology choices
- Team productivity and development velocity are critical for project success

## Decision Drivers

- LLM familiarity and code generation effectiveness
- Preservation of technical investments (GSAP, Three.js, accessibility)
- Maintainability and long-term sustainability
- Performance requirements for marketing website
- Development velocity and iteration speed

## Considered Options

- SvelteKit
- Next.js (React-based)
- Vite + Vanilla TypeScript
- Astro (multi-framework)
- Vue.js + Nuxt

## Decision Outcome

Chosen option: "Vite + Vanilla TypeScript", because it maximizes LLM effectiveness (universal JavaScript/TypeScript knowledge), eliminates framework learning curves, preserves technical investments, and provides the largest hiring pool with zero onboarding friction.

### Consequences

- Good, because LLMs have extensive training on vanilla JavaScript/TypeScript patterns
- Good, because any JavaScript developer can contribute immediately without framework-specific training
- Good, because animation libraries (GSAP) and 3D libraries (Three.js) integrate naturally
- Good, because Vite provides modern development experience (HMR, fast builds) without framework complexity
- Good, because accessibility implementations translate directly to vanilla DOM manipulation
- Bad, because the solution loses some developer experience features that frameworks provide (reactive updates, component lifecycle)
- Bad, because some patterns need to be implemented manually that frameworks handle automatically
- Neutral, because performance characteristics are similar for a marketing website use case

### Confirmation

- Verify LLM code generation quality with vanilla TypeScript meets development velocity requirements
- Verify animation libraries (GSAP) and 3D libraries (Three.js) integrate without compatibility issues
- Verify development team productivity and satisfaction
- Verify development environment provides fast feedback loops comparable to modern frameworks
- Verify production builds meet performance requirements for marketing website use case

## Pros and Cons of the Options

### SvelteKit

- Good, because it provides excellent developer experience for framework-familiar developers
- Good, because it has strong performance characteristics
- Bad, because LLMs have limited training data and struggle with Svelte-specific patterns
- Bad, because it creates team onboarding challenges for developers unfamiliar with Svelte
- Bad, because it limits hiring pool to Svelte-experienced developers

### Next.js

- Good, because LLMs are well-trained on React patterns
- Good, because large developer hiring pool
- Bad, because requires learning React for teams not familiar with the framework
- Bad, because adds framework complexity and bundle size

### Vite + Vanilla TypeScript

- Good, because LLMs excel at vanilla JavaScript/TypeScript
- Good, because zero learning curve for any JavaScript developer
- Good, because preserves flexibility for animation and 3D library integration
- Good, because provides modern tooling without framework overhead
- Bad, because requires manual implementation of some patterns that frameworks provide

### Astro

- Good, because allows gradual migration using multiple frameworks
- Good, because excellent for content-heavy sites
- Bad, because adds another framework to learn
- Bad, because LLM familiarity is limited due to newer ecosystem

### Vue.js + Nuxt

- Good, because gentler learning curve than React
- Good, because decent LLM familiarity
- Bad, because still requires framework learning for teams not familiar with Vue
- Bad, because smaller ecosystem compared to React

## Implementation Notes

- Use modern TypeScript patterns for component architecture
- Follow established patterns for DOM manipulation and event handling
- Maintain strict ESLint, Prettier, and testing configurations
- Preserve accessibility implementations and ARIA patterns
- Ensure CI/CD pipeline compatibility with chosen tooling
