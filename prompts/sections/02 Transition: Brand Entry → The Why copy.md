# 🎬 Transition: Brand Entry → The Why

## Initial State: Brand Entry

Black/dark background

Floating 3D object or animated logo (e.g. orbiting prompt cube)

Maybe a soft glow or particle drift

No scroll indicator — user curiosity drives action

## Scroll Begins

Camera pulls forward slowly, as if the viewer is “falling into” the logo or object

The 3D object begins to dissolve, transform, or shift to the side

The logo shrinks and moves to top-left (anchoring brand presence subtly)

Background subtly transitions to a lighter gradient or cosmic dust/mist

Ambient audio cue (low pulse or swell) signals the narrative shift

## 🎨 Brand & Accessibility Integration

### Visual Design Requirements

- **Background Transition**: Voder Black (#0A0A0A) to Deep Navy (#0F1A2E)
- **Typography**: Inter/Satoshi semi-bold for headline, generous spacing
- **Color Contrast**: Paper White (#FFFFFF) on Deep Navy = 15.8:1 ratio (AAA compliant)
- **Brand Voice**: Minimal, strategic, calm confidence - "slowly, clearly, and only when needed"

### Accessibility Implementation

```html
<section aria-labelledby="why-heading" role="main">
  <div aria-hidden="true" class="three-d-transition">
    <!-- 3D dissolve animation marked as decorative -->
  </div>
  <h1 id="why-heading" class="typing-animation">
    We believe software should start with intent.
  </h1>
  <div aria-live="polite" aria-atomic="true">
    <!-- Announces transition completion to screen readers -->
  </div>
</section>
```

### Motion Sensitivity

```css
@media (prefers-reduced-motion: reduce) {
  .three-d-transition {
    animation: none !important;
    transform: none !important;
  }
  .typing-animation {
    animation: fade-in 0.3s ease-out;
  }
}
```

### Keyboard Navigation

- ESC key skips transition to final state
- Focus moves logically from 3D canvas to main heading
- No keyboard traps during animation sequence
- Tab navigation available once transition completes

## The Why appears

Large, centred serif or semi-serif text fades in:

“We believe software should start with intent.”

Supporting line fades in below:

“Not code. Not files. Not frameworks. But the spark behind them all.”

## Motion & Rhythm

The entire section moves with a cinematic slow scroll

Parallax elements (particles, curves, gradient fields) drift with subtle delays

Optional: soft morphing shapes animate behind text to signal conceptual depth

## ✨ Key Feelings

Weightlessness

Precision

Confidence

“We’re not in a dev tool anymore”

## ✅ Implementation Requirements

### Trigger & Timing

- **Trigger**: First scroll event after brand entry completion (scroll Y > 50px)
- **Total Duration**: 3 seconds
- **Phases**:
  - Camera pull/3D dissolve (1s)
  - Logo repositioning (1s)
  - Headline typing animation (1s)

### Measurable Animation States

- **Start**: Brand elements at center screen, 3D object at `opacity: 1`
- **1s**: 3D object dissolving (`opacity: 0.3`, particles dispersing)
- **2s**: Logo repositioned to top-left at `transform: translate(-40%, -60%) scale(0.7)`
- **3s**: Headline fully revealed, background at Deep Navy (#0F1A2E)

### Required Elements & Animations

- 3D object with particle dissolve effect using Three.js
- Logo with smooth translate/scale transformation
- Background color transition using GSAP ColorProps
- Typing animation for headline text (letter-by-letter reveal)
- Camera movement simulation with transform3d

### Implementation Accessibility

- Skip button available: "Skip to main content"
- ARIA live region announces: "Moving to main message"
- Typing animation respects `prefers-reduced-motion` (show text immediately)
- Essential message available as fallback text

### Testing Assertions Required

```typescript
// Initial state
await expect(page.locator('[data-testid="brand-object"]')).toBeVisible();

// Trigger transition
await page.mouse.wheel(0, 100);
await waitForAnimationsComplete(page);

// Final state
await expect(page.locator('[data-testid="logo-repositioned"]')).toBeVisible();
await expect(page.locator('[data-testid="why-headline"]')).toContainText('We believe software should start with intent');
await expect(page.locator('[data-testid="background-navy"]')).toHaveCSS('background-color', 'rgb(15, 26, 46)');
```

### 🔄 Bidirectional Scroll Behavior (CRITICAL)

**This transition must work in BOTH directions:**

#### Forward (Scroll Down: Brand Entry → Why)
- 3D object dissolves and disperses
- Logo moves to top-left and scales down
- Background transitions to Deep Navy
- Headline types in character by character

#### Reverse (Scroll Up: Why → Brand Entry)  
- Headline text fades out (reverse typing or immediate fade)
- Background transitions back to Voder Black
- Logo scales up and returns to center position
- 3D object reassembles and becomes fully opaque

#### GSAP ScrollTrigger Implementation
```typescript
ScrollTrigger.create({
  trigger: "#main-content",
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play reverse play reverse", // CRITICAL: bidirectional
  onStart: () => announceToScreenReader("Moving to main message"),
  onComplete: () => announceToScreenReader("Main message visible"),
  onReverseComplete: () => announceToScreenReader("Returning to brand introduction")
});
```

#### Testing Both Directions
```typescript
// Test forward transition
await page.mouse.wheel(0, 100);
await waitForAnimationsComplete(page);
await expect(page.locator('[data-testid="why-headline"]')).toBeVisible();

// Test reverse transition  
await page.mouse.wheel(0, -100);
await waitForAnimationsComplete(page);
await expect(page.locator('[data-testid="brand-object"]')).toBeVisible();
await expect(page.locator('[data-testid="why-headline"]')).not.toBeVisible();
```
