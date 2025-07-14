# 🎬 Transition: The Why → Problem Space

## End of "The Why"

The belief statement is now visible:

“We believe software should start with intent.”

Background is calm, minimal — a soft glow or morphing abstract shape

Subtle particle field floats behind text

## Scroll Begins

As the user scrolls, the background begins to darken — slowly at first

The belief text blurs and drifts upward, like it's dissolving into memory

Ambient tone shifts — a soft dissonance or distortion cue begins (optional audio layer)

## Problem Visual Emerges

A dense web of code fragments, diagrams, arrows, and overlays begins to fade in
(Think: scattered .tsx, webpack.config.js, storybook snapshots, design tokens…)

They float chaotically, colliding or swirling around one another

Possibly rendered as 3D fragments or layered SVG clusters with parallax movement

## Copy Appears

Large bold heading fades in:

“The problem isn’t your tools.”

Followed by:

“It’s the gap between your ideas and your implementation.”

Subtext gently slides in or fades up:

“Developers stitch together frameworks, boilerplate, and brittle glue code — all to approximate what you actually meant.”

## Motion & Atmosphere

Visual noise increases slightly (but not annoyingly)

Parallax responds to mouse movement or scroll

Light desaturation or grain overlay can suggest messiness or friction

## ✨ Mood Shift Summary

| From                | To                     |
| ------------------- | ---------------------- |
| Calm, clean belief  | Dense, fractured noise |
| Bright-on-dark fade | Desaturated darks      |
| Stillness           | Subtle unease          |
| Hopeful             | Honest tension         |

## ✅ Implementation Requirements

### Trigger & Timing

- **Trigger**: Scroll to 80% of "The Why" section visibility
- **Total Duration**: 4 seconds
- **Phases**:
  - Background darkening (1s)
  - Text dissolution (1s)
  - Chaos emergence (1.5s)
  - Problem copy reveal (0.5s)

### Measurable Animation States

- **Start**: "Why" text at `opacity: 1`, background at Deep Navy (#0F1A2E)
- **1s**: Background darkening to `rgb(10, 10, 10)`, ambient tone shift
- **2s**: "Why" text at `opacity: 0`, `transform: translateY(-100px) blur(4px)`
- **3.5s**: Code fragments visible, chaos web at full complexity
- **4s**: Problem headline and copy fully revealed

### Required Elements & Animations

- Background color transition with darkening effect
- Text blur and translateY animation for "Why" section
- Code fragment particles (SVG or 3D using Three.js)
- Parallax movement responding to scroll/mouse
- Typography animations for problem headline and copy
- Optional: grain overlay for atmosphere

### Implementation Accessibility

- Chaos animations marked `aria-hidden="true"`
- Essential message: "Transitioning to problem identification" announced
- Problem text available immediately for screen readers
- Parallax disabled for `prefers-reduced-motion`

### Testing Assertions Required

```typescript
// Initial state
await expect(page.locator('[data-testid="why-statement"]')).toBeVisible();

// Trigger transition
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.8));
await waitForAnimationsComplete(page);

// Final state
await expect(page.locator('[data-testid="problem-headline"]')).toContainText('The problem isn\'t your tools');
await expect(page.locator('[data-testid="code-fragments"]')).toBeVisible();
await expect(page.locator('[data-testid="gap-message"]')).toContainText('gap between your ideas');
```
