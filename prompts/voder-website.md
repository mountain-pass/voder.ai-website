# Voder Pre-Launch Website Specification

The **voder.ai** website is a **high-concept, cinematic pre-launch site** designed to generate intrigue and signal a category-defining shift in how software is created.

## 🎯 Purpose

The website is a digital experience—not just a landing page. Its role is to:

- Create curiosity
- Introduce a new paradigm (source prompts → source code)
- Highlight Voder’s unique ability to intelligently modify code when prompts change
- Deliver an emotionally compelling, visually immersive story
- Impress founders, product leaders, and visionaries with brand confidence

## 👥 Audience

- Founders and Product Leaders
- CTOs and Engineering Managers
- Innovation sponsors and investors
- Strategic thinkers and system architects

The experience is designed for people who fund or influence the creation of software—not necessarily the engineers themselves.

## ✨ Tone and Feel

- Visionary
- Strategic
- Minimalist
- Cinematic
- High trust / premium
- Inspired by [mont-fort.com](https://mont-fort.com/)

The experience should feel like a product teaser, film intro, and design manifesto in one.

## 🧭 Format: Custom-Built Interactive Homepage

The homepage is a **custom scroll or interaction-based website** using:

- **Framework**: Vite + Vanilla TypeScript for maximum LLM compatibility and developer familiarity
- **Animation**: GSAP for scroll-tied transitions and rhythm
- **3D / Motion**: Three.js for immersive conceptual scenes
- **Visual Assets**: SVG, .glb/.gltf models, or layered compositing

## 🎨 Visual Design

| Element              | Specification                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Colours**          | Dark mode default. Voder Black (#0A0A0A) and Deep Navy (#0F1A2E) backgrounds with Soft Teal Glow (#24D1D5) accents. See brand-guide.md for full palette.                |
| **Typography**       | Strategic, modern sans-serif (Inter/Satoshi/Neue Haas for headlines, Inter/Helvetica Neue for body). Use semi-bold weight for emphasis. See brand-guide.md for details. |
| **Imagery**          | Abstract 3D objects, evolving flows, conceptual metaphors (e.g. prompt transforms, route planning).                                                                     |
| **Animation**        | Cinematic pacing. GSAP-powered transitions, camera moves, morphs. Use inertia and easing for elegance.                                                                  |
| **Audio (optional)** | Subtle ambient tones or synthetic chimes to mark moments (like final reveal).                                                                                           |
| **Spacing**          | Large whitespace, balanced layout, slide-like flow without obvious “slides.”                                                                                            |

## 🏗️ Narrative Structure with Integrated Brand & Accessibility Requirements

| Section                        | Content                                                    | Visual Design                                                                          | Accessibility Requirements                                                               | Brand Integration                                      |
| ------------------------------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **1. Brand Entry**             | Voder logo intro with glowing motion or orbiting 3D object | Voder Black (#0A0A0A) background, Soft Teal Glow (#24D1D5) accents                     | `aria-label="Voder brand introduction"`, Canvas `aria-hidden="true"`, Skip link provided | Inter/Satoshi typography, calm confidence persona      |
| **2. The Why**                 | "We believe software should start with intent..."          | Paper White (#FFFFFF) on Deep Navy (#0F1A2E), 15.8:1 contrast ratio                    | Semantic `h1` tag, logical heading hierarchy, `prefers-reduced-motion` support           | Minimal voice, generous spacing, intentional stillness |
| **3. Problem Space**           | Show chaos, bottlenecks, fragmentation                     | Visual chaos with Cool Grey (#C6CBD4) secondary text, 11.7:1 contrast                  | Complex animations marked `aria-hidden="true"`, essential content in accessible text     | Strategic messaging, not academic, precise tone        |
| **4. Metaphor**                | GPS vs Directions narrative                                | Soft Teal Glow accents for interactive elements, Accent Green (#9AEF00) for highlights | `role="img"` for diagrams, `aria-describedby` for detailed descriptions                  | Journey metaphor, clear not sterile presentation       |
| **5. Vision Flow**             | Source Prompts → Voder → Code → Working Product            | Flow animations respect motion preferences, high contrast text                         | Screen reader alternative: "Business Intent leads to Source Prompts..."                  | Minimalist icons, line-based design, lattice motifs    |
| **6. Prompt-Driven Iteration** | Visual diff showing intelligent code adaptation            | Code snippets use JetBrains Mono, 16.1:1 contrast on dark backgrounds                  | `aria-live="polite"` for dynamic content updates                                         | Calm confidence in capability demonstration            |
| **7. Outcome Focus**           | Clarity, speed, alignment benefits                         | Cards with 44px minimum touch targets, 8px spacing between elements                    | Each benefit clearly labeled, keyboard navigation supported                              | Premium feel, confident messaging, not flashy          |
| **8. Closing Moment**          | "The Compiler for Prompts." + "Coming Soon."               | Fade to Voder Black, Soft Teal signature glow                                          | `role="contentinfo"`, final brand imprint accessible                                     | Quietly confident close, minimal final statement       |

## 🚫 Explicit Exclusions

- No email form
- No social links
- No pricing or signup
- No navigation menu
- No help buttons
- No technical docs or screenshots

This is a **narrative-first experience**.

## 🛠️ Technical Implementation Notes

- Use **Vite + Vanilla TypeScript + GSAP + Three.js** as confirmed technology stack (see ADR 0006)
- Component architecture using TypeScript classes and functions
- All transitions and animations tied to scroll or scene load
- Use appropriately sized assets (performance optimization is not a current priority - will be addressed in future phase)
- Hosting via Vercel or Netlify
- SEO-ready with Open Graph tags, meta description, favicon
- Static file serving from `public/` directory
- Ensure accessibility with sufficient color contrast
- Must display correctly on mobile, tablet and desktop

## 🎯 Implementation Guidelines for Transitions

### Before Implementing Any Transition

1. **Review Section Requirements**: Read the specific transition file in `prompts/sections/`
2. **Check Implementation Checklist**: Verify you can answer all 6 verification questions
3. **Understand Testing Requirements**: Know what Playwright assertions you'll need to write
4. **Plan Data Attributes**: Add `data-testid` attributes for all interactive elements

### Required Implementation Pattern

Each transition must include:

```typescript
class TransitionController {
  trigger: ScrollTrigger | TimeBasedTrigger | InteractionTrigger;
  duration: number; // in milliseconds
  phases: AnimationPhase[];
  accessibilityHandler: A11yHandler;
  testSelectors: TestSelector[];
}
```

### Measurable Success Criteria

- **Visual**: All elements reach specified opacity/transform values
- **Timing**: Transitions complete within specified duration ±100ms
- **Accessibility**: Screen readers receive appropriate announcements
- **Testing**: All required test assertions pass
- **Interaction**: User can skip/pause animations as needed

### Common Anti-Patterns to Avoid

- Transitions without defined end states
- Animations without `prefers-reduced-motion` fallbacks  
- Complex motion without skip options
- Missing `data-testid` attributes for testing
- Transitions that block essential content access

## ♿ Accessibility & ARIA Requirements

### Component-Specific ARIA Implementation

| Section              | Required ARIA Attributes                     | Implementation Details                                   |
| -------------------- | -------------------------------------------- | -------------------------------------------------------- |
| **Brand Entry**      | `aria-label="Voder brand introduction"`      | 3D canvas marked as decorative with `aria-hidden="true"` |
| **Hero Section**     | `role="banner"`, `aria-label="Main heading"` | Primary navigation with `role="navigation"`              |
| **Problem Space**    | `role="main"`, section landmarks             | Clear heading hierarchy for screen readers               |
| **Metaphor**         | `aria-label="GPS vs Directions comparison"`  | Visual metaphors described in accessible text            |
| **Vision Flow**      | `aria-label="Voder workflow diagram"`        | Flow diagram with accessible text alternatives           |
| **Prompt Iteration** | `aria-live="polite"` for dynamic content     | Code changes announced to screen readers                 |
| **Outcome Focus**    | `role="complementary"` for benefit cards     | Each benefit clearly labeled and structured              |
| **Closing Moment**   | `role="contentinfo"` for footer content      | Final branding marked appropriately                      |

### Interactive Elements

- All buttons must have descriptive `aria-label` attributes
- Form inputs require `aria-label` and `aria-required` where applicable
- Links must have accessible names (not just "click here")
- Focus indicators must be clearly visible and 3:1 contrast minimum
- Keyboard navigation must follow logical tab order
- Complex animations respect `prefers-reduced-motion`

### 3D Content Accessibility

- Three.js Canvas components marked with `aria-hidden="true"` for decorative content
- Essential information from 3D scenes provided in accessible text form
- Alternative text descriptions for key visual metaphors
- No essential content delivered only through 3D interactions

## 📋 Development Requirements

- Mockups available in `assets/mockups/` for visual reference (aim for 10% match)
- Commit frequently - plan to commit if >5 modified files or no commits in last 5 actions
- Record ADRs in `docs/decisions` using MADR format (template: `assets/adr-template.md`)
- Record outputs in `outputs/` but don't commit them
- All changes must be committed and pushed with CI pipeline passing
