---
status: 'accepted'
date: 2024-08-04
decision-makers: voder.ai website team
---

# ADR 0005: Adopt Three.js & Threlte for 3D Scenes

## Context and Problem Statement

We need a performant, declarative way to render and control 3D content—such as the rotating hexagon—within our SvelteKit application. Using raw Three.js requires manual scene, camera, and render-loop management, leading to imperative boilerplate that is error prone and harder to maintain.

## Decision Drivers

- Declarative API that integrates with Svelte’s reactive model
- Minimal setup and teardown boilerplate for 3D scenes
- Active community support and maintenance
- Acceptable bundle size impact
- Ease of future extension for other 3D UI components

## Considered Options

### 1. Raw Three.js

Pros: Full control over every aspect of the scene, no extra abstraction layer  
Cons: Imperative API, manual lifecycle management, repetitive boilerplate

### 2. Threlte (Three.js + Svelte wrapper)

Pros: Declarative Svelte components (`<Canvas>`, `<mesh>`, etc.), reactive props, automatic cleanup, minimal boilerplate  
Cons: Adds one additional dependency, slight abstraction overhead

### 3. Other Svelte 3D Wrappers

Pros/Cons vary; smaller communities and less maturity compared to Threlte

## Decision Outcome

Chosen option: Threlte with Three.js. This combination gives us the power and ecosystem of Three.js along with a declarative, reactive component model that fits naturally into SvelteKit.

## Consequences

- Add `three` and `@threlte/core` to project dependencies
- Build 3D scenes using `<Canvas>`, `<ambientLight>`, `<mesh>`, and other Threlte primitives
- Slight increase in bundle size (~30–40 KB gzipped)
- Simplifies creation and maintenance of future 3D UI components

## Confirmation

- Create `src/lib/components/BrandEntry.svelte` with a rotating hexagon demo
- Run `npm run dev` and confirm the 3D scene renders without errors
- Verify integration with GSAP scroll triggers and that the component cleans up correctly on unmount
