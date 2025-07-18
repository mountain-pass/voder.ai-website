# 🏗️ Narrative Structure (Scroll or Scene-Based)

## ✅ Implementation Verification Checklist

Before implementing any transition, verify you can answer:

1. **What triggers this transition?** (scroll position, time, user interaction)
2. **What are the measurable start/end states?** (opacity values, positions, content visibility)
3. **How long should this transition take?** (specific duration in ms)
4. **What elements animate and how?** (transform properties, easing functions)
5. **How is this accessible?** (screen reader announcements, reduced motion alternatives)
6. **How do we test this transition?** (specific Playwright assertions to write)
7. **How does this work in reverse?** (scroll up behavior, reverse animation timing)

## 🔄 Critical Scroll-Tied Animation Requirements

**ALL TRANSITIONS MUST BE SCROLL-TIED WITH SCRUB:**

- **Forward (scroll down)**: Animation progresses with scroll position
- **Reverse (scroll up)**: Animation reverses with scroll position
- **GSAP ScrollTrigger**: Use `scrub: 1` for scroll-tied animations (NOT toggleActions)
- **State Management**: Animation progress matches scroll progress automatically
- **Testing**: Test both scroll directions for every transition

**CRITICAL**: Animations must be **scrubbed by scroll position**, not triggered by scroll events.

## 📋 Section Overview & Testing Requirements

| Section                        | Description                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- |
| **1. Brand Entry**             | Voder logo intro with glowing motion or orbiting 3D object (e.g. prompt cube). No CTA, just intrigue. |
| **2. The Why**                 | Purpose-driven statement: “We believe software should start with intent…”                             |
| **3. Problem Space**           | Framing of the bottlenecks in traditional dev workflows — complexity, fragmentation, low abstraction  |
| **4. Metaphor**                | GPS vs Passenger metaphor: traditional tools give directions; Voder drives you where you want to go   |
| **5. Vision Flow**             | Conceptual diagram or animation: `Source Prompts → Voder → Application Code → Working Product`        |
| **6. Prompt-Driven Iteration** | Showcase how Voder updates code intelligently when prompts change — highlight diff-like adaptation    |
| **7. Outcome Focus**           | What Voder enables: faster delivery, brand-consistent UX, fewer manual bottlenecks                    |
| **8. Closing Moment**          | Signature phrase: “The Compiler for Prompts.” + “Coming Soon.” — fades to black or abstract finish    |

## 🎨 Integrated Brand & Accessibility Specifications

| Section                        | Brand Elements                                                                             | Accessibility Requirements                                                      | Implementation                            |
| ------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ----------------------------------------- |
| **1. Brand Entry**             | Inter/Satoshi typography, Voder Black (#0A0A0A), Soft Teal Glow (#24D1D5), calm confidence | `aria-label="Voder brand introduction"`, Canvas `aria-hidden="true"`, Skip link | `BrandEntry` class with Three.js Canvas   |
| **2. The Why**                 | Paper White (#FFFFFF) on Deep Navy (#0F1A2E), 15.8:1 contrast, minimal voice               | Semantic `h1`, logical hierarchy, `prefers-reduced-motion` support              | `HeroSection` class with typing animation |
| **3. Problem Space**           | Cool Grey (#C6CBD4) secondary text, 11.7:1 contrast, strategic tone                        | Complex animations `aria-hidden="true"`, accessible text content                | `ProblemSection` class with GSAP chaos    |
| **4. Metaphor**                | Soft Teal Glow for interactive elements, journey metaphor                                  | `role="img"` for diagrams, `aria-describedby` descriptions                      | `GpsVsDirectionsSection` class            |
| **5. Vision Flow**             | Minimalist icons, line-based design, motion-respectful animations                          | Screen reader alt: "Business Intent leads to Source Prompts..."                 | `HowItWorksSection` class                 |
| **6. Prompt-Driven Iteration** | JetBrains Mono, Accent Green (#9AEF00), 16.1:1 contrast                                    | `aria-live="polite"` for dynamic updates                                        | `PromptIterationSection` class            |
| **7. Outcome Focus**           | 44px touch targets, 8px spacing, premium feel                                              | Keyboard navigation, clear benefit labels                                       | `OutcomeSection` class                    |
| **8. Closing Moment**          | Fade to Voder Black, Soft Teal glow, quiet confidence                                      | `role="contentinfo"`, accessible brand imprint                                  | `ClosingMomentSection` class              |
