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
- **Animation**: GSAP ScrollTrigger with `scrub` property for scroll-tied transitions. All animations must be scrubbed by scroll position (not triggered by scroll events)
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

| Section                        | Content                                                                                                            | Visual Design                                                                          | Accessibility Requirements                                                               | Brand Integration                                      |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **1. Brand Entry**             | Voder logo intro with glowing motion or orbiting 3D object                                                         | Voder Black (#0A0A0A) background, Soft Teal Glow (#24D1D5) accents                     | `aria-label="Voder brand introduction"`, Canvas `aria-hidden="true"`, Skip link provided | Inter/Satoshi typography, calm confidence persona      |
| **2. The Why**                 | "We believe software should start with intent..."                                                                  | Paper White (#FFFFFF) on Deep Navy (#0F1A2E), 15.8:1 contrast ratio                    | Semantic `h1` tag, logical heading hierarchy, `prefers-reduced-motion` support           | Minimal voice, generous spacing, intentional stillness |
| **3. Problem Space**           | Show chaos, bottlenecks, fragmentation                                                                             | Visual chaos with Cool Grey (#C6CBD4) secondary text, 11.7:1 contrast                  | Complex animations marked `aria-hidden="true"`, essential content in accessible text     | Strategic messaging, not academic, precise tone        |
| **4. Metaphor**                | GPS vs Directions narrative                                                                                        | Soft Teal Glow accents for interactive elements, Accent Green (#9AEF00) for highlights | `role="img"` for diagrams, `aria-describedby` for detailed descriptions                  | Journey metaphor, clear not sterile presentation       |
| **5. Vision Flow**             | Source Prompts → Voder → Code → Working Product                                                                    | Flow animations respect motion preferences, high contrast text                         | Screen reader alternative: "Business Intent leads to Source Prompts..."                  | Minimalist icons, line-based design, lattice motifs    |
| **6. Prompt-Driven Iteration** | **Curated demonstration** showing intelligent code adaptation through pre-defined prompt examples (not user input) | Code snippets use JetBrains Mono, 16.1:1 contrast on dark backgrounds                  | `aria-live="polite"` for dynamic content updates                                         | Calm confidence in capability demonstration            |
| **7. Outcome Focus**           | Clarity, speed, alignment benefits                                                                                 | Cards with 44px minimum touch targets, 8px spacing between elements                    | Each benefit clearly labeled, keyboard navigation supported                              | Premium feel, confident messaging, not flashy          |
| **8. Closing Moment**          | "The Compiler for Prompts." + "Coming Soon."                                                                       | Fade to Voder Black, Soft Teal signature glow                                          | `role="contentinfo"`, final brand imprint accessible                                     | Quietly confident close, minimal final statement       |

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
- **All animations must use GSAP ScrollTrigger with `scrub` property** - animations progress with scroll position, not triggered by scroll events
- **Scroll-tied behavior required**: Animations pause when scrolling pauses, reverse when scrolling reverses, progress smoothly with scroll velocity
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
  trigger: ScrollTrigger; // Must use ScrollTrigger with scrub property
  scrubValue: number | boolean; // e.g., scrub: 1 for smooth scroll-tied animation
  scrollStart: string; // e.g., "top 80%"
  scrollEnd: string; // e.g., "bottom 20%"
  phases: AnimationPhase[];
  accessibilityHandler: A11yHandler;
  testSelectors: TestSelector[];
}
```

### Scroll-Tied Animation Requirements

**CRITICAL**: All animations must be **scrubbed by scroll position**, not triggered by scroll events.

- ✅ **Correct**: `ScrollTrigger.create({ scrub: 1, ... })` - Animation progress tied to scroll progress
- ❌ **Incorrect**: `ScrollTrigger.create({ onEnter: () => animation.play() })` - Animation triggered by scroll events

**Expected Behavior**:

- Animation progresses smoothly as user scrolls
- Animation pauses immediately when scrolling stops
- Animation reverses when user scrolls backwards
- Animation speed matches scroll velocity when using `scrub: true`
- Animation speed is smoothed when using `scrub: 1` (or other numeric values)

**Implementation Example**:

```typescript
// ✅ CORRECT - Scroll-tied animation
const scrollTrigger = ScrollTrigger.create({
  trigger: element,
  start: 'top bottom',
  end: 'bottom top',
  scrub: 1, // Animation scrubbed by scroll position
  animation: gsap
    .timeline()
    .to(element, { opacity: 1, duration: 1 })
    .to(element, { y: -100, duration: 1 }),
});

// ❌ INCORRECT - Trigger-based animation
const scrollTrigger = ScrollTrigger.create({
  trigger: element,
  start: 'top 80%',
  onEnter: () => {
    gsap.to(element, { opacity: 1, y: -100, duration: 2 });
  },
});
```

### Measurable Success Criteria

- **Visual**: All elements reach specified opacity/transform values
- **Scroll-Tied Behavior**: Animations pause when scrolling stops, reverse when scrolling reverses
- **Timing**: Animation progress matches scroll progress (not time-based duration)
- **Accessibility**: Screen readers receive appropriate announcements
- **Testing**: All required test assertions pass including scroll-tied behavior
- **Interaction**: User can skip/pause animations as needed

### Common Anti-Patterns to Avoid

- **Trigger-based animations** using `onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack` callbacks
- Animations that play independently of scroll position after being triggered
- Transitions without defined end states
- Animations without `prefers-reduced-motion` fallbacks
- Complex motion without skip options
- Missing `data-testid` attributes for testing
- Transitions that block essential content access

## ♿ Accessibility & ARIA Requirements

### Component-Specific ARIA Implementation with HTML Examples

#### 1. Brand Entry Section

```html
<section aria-label="Voder brand introduction" role="banner">
  <canvas aria-hidden="true"></canvas>
  <div aria-live="polite" aria-atomic="true">
    <!-- Loading states announced here -->
  </div>
  <h1>Voder</h1>
  <p>The Compiler for Prompts</p>
  <a href="#main-content" class="skip-link">Skip to main content</a>
</section>
```

#### 2. Hero Section

```html
<section role="main" aria-labelledby="hero-heading">
  <h1 id="hero-heading" class="typing-animation">
    Tell Us What You Want. Let Voder Build It.
  </h1>
  <nav role="navigation" aria-label="Main navigation">
    <a href="#about">About</a>
    <!-- Other nav items -->
  </nav>
</section>
```

#### 3. Problem Space Section

```html
<section aria-labelledby="problem-heading">
  <h2 id="problem-heading">The Problem</h2>
  <!-- Visual chaos animations marked as decorative -->
  <div aria-hidden="true" class="visual-chaos">
    <!-- Complex animations here -->
  </div>
  <!-- Essential content in accessible text -->
  <p>Today's code generation tools still leave you stuck...</p>
</section>
```

#### 4. Interactive Flow Diagram

```html
<section aria-labelledby="flow-heading">
  <h2 id="flow-heading">How It Works</h2>
  <div role="img" aria-labelledby="flow-description">
    <svg><!-- Flow diagram --></svg>
  </div>
  <div id="flow-description">
    Business Intent leads to Source Prompts, which are processed by Voder to
    create Working Software.
  </div>
</section>
```

### Keyboard Navigation Requirements

#### Navigation Order

1. **Skip links** (hidden until focused)
2. **Main navigation** (logical left-to-right, top-to-bottom)
3. **Interactive elements** (buttons, links, form controls)
4. **Section landmarks** (can be navigated via screen reader shortcuts)

#### Key Bindings

| Key               | Action                                          | Context              |
| ----------------- | ----------------------------------------------- | -------------------- |
| `Tab`             | Move to next focusable element                  | Global               |
| `Shift + Tab`     | Move to previous focusable element              | Global               |
| `Enter` / `Space` | Activate buttons and links                      | Interactive elements |
| `Escape`          | Close modals, exit fullscreen, pause animations | Global               |
| `Arrow Keys`      | Navigate within grouped elements                | Navigation menus     |

#### Focus Management

- **Visible focus indicators** on all interactive elements
- **Focus trap** during intro animation (with skip option)
- **Logical tab order** following visual layout
- **No keyboard traps** (always escapable)

### Responsive Accessibility

#### Touch Targets

- **Minimum size**: 44px × 44px for touch targets
- **Adequate spacing**: 8px minimum between adjacent targets
- **No precision required**: Generous click/tap areas

#### Viewport Considerations

- **Zoom support**: 200% zoom without horizontal scrolling
- **Orientation**: Content usable in both portrait and landscape
- **Small screens**: Essential content prioritized on mobile

### Motion & Animation Accessibility

#### prefers-reduced-motion Support

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable non-essential animations */
  .brand-entry-animation,
  .scroll-triggered-animation {
    animation: none !important;
    transform: none !important;
  }

  /* Keep essential feedback */
  .fade-in {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

#### Animation Guidelines

- **No flashing** above 3 times per second
- **Pause controls** for auto-playing content longer than 5 seconds
- **Essential content** not dependent on animation
- **Smooth degradation** when animations are disabled

### Screen Reader Optimization

#### Content Structure

- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **Landmark roles**: `main`, `navigation`, `banner`, `contentinfo`
- **Lists**: Use `ul`/`ol` for grouped content
- **Tables**: Headers and captions for data relationships

#### Dynamic Content

```html
<!-- For content that updates -->
<div aria-live="polite" aria-atomic="true">
  <!-- Updated content announced to screen readers -->
</div>

<!-- For urgent updates -->
<div aria-live="assertive">
  <!-- Immediately announced -->
</div>
```

#### Image Accessibility

- **Meaningful images**: Descriptive alt text
- **Decorative images**: `alt=""` or `aria-hidden="true"`
- **Complex graphics**: `aria-describedby` linking to detailed description
- **3D content**: Alternative text describing essential information

### Testing Requirements & GSAP ScrollTrigger Integration

#### Automated Testing

**CRITICAL**: Accessibility tests MUST scroll to target sections and wait for animations to complete before scanning.

```typescript
// REQUIRED: Scroll to target section to trigger scroll-based animations
await targetSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(500); // Give time for scroll to complete

// Wait for GSAP and scroll-triggered animations to complete
await page.waitForFunction(
  () => {
    // Check if GSAP is loaded and has active animations
    if (typeof window.gsap !== 'undefined') {
      const activeTweens = window.gsap
        .getTweensOf('*')
        .filter((tween) => tween.isActive());
      if (activeTweens.length > 0) {
        return false;
      }
    }

    // Check for elements with animation classes
    const animatingElements = document.querySelectorAll(
      '.animating, [data-animating="true"]',
    );
    return animatingElements.length === 0;
  },
  { timeout: 5000 },
);

// Then run accessibility scan
const results = await new AxeBuilder({ page })
  .include('section[data-test-id="target-section"]')
  .analyze();
```

**Why Scrolling is Required**:

- GSAP ScrollTrigger animations only activate when elements enter viewport
- Scroll-based animations remain in initial state until triggered
- Static accessibility scans miss the final animated state
- Color transitions and positioning depend on scroll events

**Best Practices**:

1. **Scroll to target first**: `await targetSection.scrollIntoViewIfNeeded()`
2. **Wait for network idle**: `await page.waitForLoadState('networkidle')`
3. **Wait for specific animations**: Use custom data attributes to track animation state
4. **Wait for GSAP completion**: Use GSAP's `onComplete` callbacks in tests
5. **Verify final state**: Check computed styles match expected values before scanning

#### Testing Checklist

- [ ] **Tests scroll to target sections before scanning** (required for scroll-triggered animations)
- [ ] All text meets minimum contrast ratios **after animations complete**
- [ ] All interactive elements keyboard accessible **in final state**
- [ ] Skip links functional and properly hidden
- [ ] Screen reader announces content logically
- [ ] Focus indicators visible and persistent **post-animation**
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Essential content available without JavaScript
- [ ] Touch targets meet minimum size requirements **after layout animations**
- [ ] 200% zoom doesn't break layout
- [ ] No keyboard traps or focus issues
- [ ] **Accessibility tests wait for GSAP and scroll animations to complete**

#### Manual Testing

- **Screen reader testing** (NVDA, JAWS, VoiceOver)
- **Keyboard-only navigation** verification
- **High contrast mode** compatibility
- **Mobile screen reader** testing (TalkBack, VoiceOver)

### Implementation Priority

#### Phase 1: Foundation

1. Semantic HTML structure
2. Color contrast compliance
3. Keyboard navigation
4. Basic ARIA labels

#### Phase 2: Enhancement

1. Advanced ARIA patterns
2. Screen reader optimization
3. Motion sensitivity support
4. Touch accessibility

#### Phase 3: Validation

1. Comprehensive testing
2. User feedback integration
3. Performance optimization (DEFERRED - will be addressed in a future development phase)
4. Documentation updates

### Success Metrics

- **Zero critical accessibility violations** in automated testing
- **100% keyboard navigation** coverage
- **WCAG 2.1 AA compliance** verified by external audit
- **Positive user feedback** from assistive technology users

## 📋 Development Requirements

- Mockups available in `assets/mockups/` for visual reference (aim for 10% match)
- Commit frequently - plan to commit if >5 modified files or no commits in last 5 actions
- Record ADRs in `docs/decisions` using MADR format (template: `assets/adr-template.md`)
- Record outputs in `outputs/` but don't commit them
- All changes must be committed and pushed with CI pipeline passing
