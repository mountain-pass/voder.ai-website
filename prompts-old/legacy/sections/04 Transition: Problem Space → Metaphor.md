# 🎬 Transition: Problem Space → Metaphor

## 🎨 Brand & Accessibility Integration for Problem→Metaphor

### Visual Design Specifications

- **Chaos Elements**: Cool Grey (#C6CBD4) for secondary fragments, 11.7:1 contrast
- **Key Message**: Paper White (#FFFFFF) "The gap between ideas and implementation"
- **Transition Colors**: Gradual fade from chaos to Voder Black (#0A0A0A)
- **Collapse Point**: Soft Teal Glow (#24D1D5) for the singular node
- **Brand Tone**: Strategic tension without academic complexity

### Accessibility Requirements

```html
<section aria-labelledby="transition-heading">
  <div aria-hidden="true" class="visual-chaos">
    <!-- Complex animations marked as decorative -->
  </div>
  <h2 id="transition-heading" class="sr-only">
    Transition from problem identification to solution metaphor
  </h2>
  <p class="accessible-summary">
    Traditional development creates complexity. Voder provides clear direction
    through the chaos.
  </p>
  <div aria-live="polite" aria-atomic="true">
    <!-- Announces transition phases for screen readers -->
  </div>
</section>
```

### Motion & Animation Guidelines

```css
/* Respect motion preferences */
@media (prefers-reduced-motion: reduce) {
  .visual-chaos,
  .implode-animation {
    animation: none !important;
    opacity: 0.3; /* Show static state */
  }
  .glitch-effect {
    display: none; /* Remove potentially triggering effects */
  }
}

/* Ensure no flashing above 3Hz */
.vibration-effect {
  animation-duration: 400ms; /* Minimum to stay under 3Hz */
}
```

### Screen Reader Experience

- Visual chaos described as "complexity visualization"
- Essential message maintained: "Traditional tools create gaps between ideas and implementation"
- Transition announced: "Moving to solution explanation"
- No essential information lost when animations are disabled

## At Peak Chaos

The screen is filled with tangled UI/code fragments, architectural diagrams, and buzzwords.

Text is still visible:

“The gap between your ideas and your implementation.”

## Scroll Triggered

As the user scrolls:

The fragments begin to slow, then shudder, like a system under load

A soft vibration or glitch effect signals stress and impending change (optional)

The whole cluster begins to implode inward toward a central point

## Collapse and Fade

All visual noise compresses into a singular glowing dot or node

Brief moment of black frame or near-black void — to create a visual exhale

Ambient sound cuts to silence or shifts to a steady hum or heartbeat

## Metaphor Emerges

From the void, a new visual slowly blooms:

A smooth road or flowing map-line forms across the screen (hinting at GPS)

Labels like “Idea”, “Design”, “Code”, “Ship” animate along the path

Headline fades in:

“You’ve been in the passenger seat.”

## Support Copy Appears

Below or beside the path:

“Tools like Copilot and Cursor help you steer… but you’re still stuck giving directions.”
“What if your system already knew the destination?”

## ✨ Conceptual Shift

| From              | To                            |
| ----------------- | ----------------------------- |
| Code chaos        | Smooth journey line or path   |
| Fragmented layers | Singular metaphorical element |
| Noise and clutter | Calm, minimalist clarity      |
| System fatigue    | Focused intelligence          |

## ✅ Implementation Requirements

### Trigger & Scroll-Tied Implementation

- **Trigger**: ScrollTrigger with `scrub: 1` - animation tied to scroll position
- **Start**: "top 60%" of problem section viewport
- **End**: "bottom 40%" of Metaphor section
- **Scroll-Tied Phases**:
  - Chaos peak (0-25% of scroll progress)
  - Collapse animation (25-62.5% of scroll progress)
  - Void moment (62.5-75% of scroll progress)
  - Metaphor emergence (75-100% of scroll progress)

### Measurable Animation States (Scroll Progress)

- **0% scroll**: Chaos elements at `opacity: 1`, random positions
- **25% scroll**: All fragments visible, maximum motion intensity
- **Collapse**: Elements converge to center point `transform: scale(0.1)`
- **Void**: All elements at `opacity: 0`, screen near-black
- **Metaphor**: Road/path visible at `opacity: 1`, labels positioned

### Required Animation Properties

- Chaos fragments: `transform: translate3d(x, y, 0) rotate(deg)` with easing
- Collapse effect: `transform: scale()` from 1 to 0.1, then opacity fade
- Glitch/vibration: `filter: blur()` and position jitter (max 2px)
- Road emergence: `stroke-dasharray` animation for drawing effect
- Color transitions: Background from chaos greys to teal accent

### Accessibility Implementation

- Chaos section marked `aria-hidden="true"`
- Key message "The gap between ideas and implementation" always visible
- Screen reader announcement: "Transitioning from problem to solution"
- Reduced motion: Show static before/after states only

### Testing Assertions Required

```typescript
// Before transition
await expect(page.locator('[data-testid="chaos-container"]')).toBeVisible();
await expect(page.locator('[data-testid="key-message"]')).toContainText(
  'gap between ideas',
);

// After transition
await expect(page.locator('[data-testid="road-metaphor"]')).toBeVisible();
await expect(page.locator('[data-testid="passenger-headline"]')).toContainText(
  'passenger seat',
);
await page.waitForSelector('[data-testid="metaphor-labels"]', {
  state: 'visible',
});
```
