---
status: 'accepted'
date: 2025-07-08
decision-makers: voder.ai website team
consulted: development team, LLM-assisted development stakeholders
informed: project stakeholders
---

# ADR 0010: Migrate from SvelteKit to Vite + Vanilla TypeScript

## Context and Problem Statement

The project was initially implemented using SvelteKit, a modern web framework. However, we've encountered significant challenges with LLM-assisted development tooling and team productivity:

- Large Language Models (LLMs) have limited familiarity with Svelte syntax and ecosystem
- AI-assisted code generation and debugging is significantly less effective with Svelte

We need a technology stack that maximizes AI-assisted development effectiveness while maintaining our existing investments in animations (GSAP), 3D elements (Three.js), and accessibility features.

## Decision Drivers

- LLM familiarity and code generation effectiveness
- Preservation of existing technical investments (GSAP, Three.js, accessibility)
- Maintainability and long-term sustainability
- Performance requirements for marketing website
- Development velocity and iteration speed

## Considered Options

- SvelteKit (status quo)
- Next.js (React-based)
- Vite + Vanilla TypeScript
- Astro (multi-framework)
- Vue.js + Nuxt

## Decision Outcome

Chosen option: "Vite + Vanilla TypeScript", because it maximizes LLM effectiveness (universal JavaScript/TypeScript knowledge), eliminates framework learning curves, preserves all existing technical assets, and provides the largest hiring pool with zero onboarding friction.

### Consequences

- Good, because LLMs have extensive training on vanilla JavaScript/TypeScript patterns
- Good, because any JavaScript developer can contribute immediately without framework-specific training
- Good, because all existing GSAP animations and Three.js code can be preserved as-is
- Good, because Vite provides modern development experience (HMR, fast builds) without framework complexity
- Good, because accessibility implementations translate directly to vanilla DOM manipulation
- Bad, because we lose some developer experience features that frameworks provide (reactive updates, component lifecycle)
- Bad, because we need to implement some patterns manually that frameworks handle automatically
- Neutral, because performance characteristics are similar for a marketing website use case

### Confirmation

- Verify LLM code generation quality improves significantly with vanilla TypeScript
- Verify existing GSAP and Three.js code works without modification
- Verify development team satisfaction and retention improves
- Verify `npm run dev` provides fast development experience comparable to SvelteKit
- Verify production builds meet performance requirements

## Pros and Cons of the Options

### SvelteKit (Status Quo)

- Good, because it provides excellent developer experience for framework-familiar developers
- Good, because it has strong performance characteristics
- Bad, because LLMs have limited training data and struggle with Svelte-specific patterns
- Bad, because it creates team retention issues due to unfamiliarity
- Bad, because it limits hiring pool to Svelte-experienced developers

### Next.js

- Good, because LLMs are well-trained on React patterns
- Good, because large developer hiring pool
- Bad, because requires learning React for current team
- Bad, because adds framework complexity and bundle size

### Vite + Vanilla TypeScript

- Good, because LLMs excel at vanilla JavaScript/TypeScript
- Good, because zero learning curve for any JavaScript developer
- Good, because preserves all existing technical investments
- Good, because provides modern tooling without framework overhead
- Bad, because requires manual implementation of some patterns

### Astro

- Good, because allows gradual migration using multiple frameworks
- Good, because excellent for content-heavy sites
- Bad, because adds another framework to learn
- Bad, because LLM familiarity is limited due to newer ecosystem

### Vue.js + Nuxt

- Good, because gentler learning curve than React
- Good, because decent LLM familiarity
- Bad, because still requires framework learning for current team
- Bad, because smaller ecosystem compared to React

## Migration Strategy

1. **Phase 1**: Set up new Vite + TypeScript project structure
2. **Phase 2**: Migrate static assets, styles, and configuration
3. **Phase 3**: Convert Svelte components to TypeScript classes/functions one by one
4. **Phase 4**: Integrate GSAP animations and Three.js demos
5. **Phase 5**: Validate accessibility features and testing suite
6. **Phase 6**: Deploy and monitor performance characteristics

## Implementation Notes

- Use the provided setup script (`scripts/setup-vite-project.sh`) for consistent project initialization
- Follow the component architecture pattern shown in `examples/HeroSection.ts`
- Maintain all existing ESLint, Prettier, and testing configurations
- Preserve all accessibility implementations and ARIA patterns
- Keep all existing CI/CD pipeline configurations
