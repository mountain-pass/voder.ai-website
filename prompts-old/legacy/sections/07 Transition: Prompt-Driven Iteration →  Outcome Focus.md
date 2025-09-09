# 🎬 Transition: Prompt-Driven Iteration → Outcome Focus

## Prompt Interaction Settles

The last visual shows the prompt edit:

```text
Tone: Premium, minimalist.
```

…and the resulting UI update has just completed.

Text on screen:

“Change the prompt. Not the team.”

Everything pauses for a brief moment — a breath.

## Scroll Initiates Transition

The prompt panel fades into the background, becoming translucent

The UI mockup gently zooms out and dims, as if moving from a specific to a general view

A series of short, benefit-driven headlines begin to fade in, one by one:

## Outcome Highlights Appear

Each line animates in with confidence, one after another:

🚀 Deliver faster without losing control
🎯 Align product, brand, and tech from day one
💡 Iterate on ideas, not implementations
🔄 Make fewer handoffs. Create fewer misunderstandings.

## Visual Context

These headlines float over a collage of concept visuals:

- A design system tile auto-updating
- A team dashboard showing “updated from prompt change”
- A timeline with shorter dev cycles

Or, alternatively, they float against a dark background with soft light rays, keeping it focused and premium

## Headline Anchors the Section

After the benefits cycle in, a final header fades in:

“Outcomes, not overhead.”

Subtext:

“Voder bridges the gap between strategy and shipping — without adding layers, delays, or drift.”

## ✨ Mood Shift

| From                     | To                         |
| ------------------------ | -------------------------- |
| Functional demonstration | Strategic impact           |
| "Look what it did"       | "Look what you get"        |
| Feature-level            | Business-level             |
| Tactile interactivity    | Framed, persuasive clarity |

## ✅ Implementation Requirements

### Trigger & Scroll-Tied Implementation

- **Trigger**: ScrollTrigger with `scrub: 1` - animation tied to scroll position
- **Start**: "top 75%" of prompt iteration section viewport
- **End**: "bottom 25%" of Outcome Focus section
- **Scroll-Tied Phases**:
  - Prompt panel fade/zoom out (0-25% of scroll progress)
  - Benefits sequential reveal (25-87.5% of scroll progress)
  - Final headline appearance (87.5-100% of scroll progress)

### Measurable Animation States (Scroll Progress)

- **0% scroll**: Prompt panel at `opacity: 1`, UI mockup at `scale(1)`
- **25% scroll**: Prompt panel at `opacity: 0.3`, UI mockup at `scale(0.8)`
- **37.5% scroll**: First benefit line visible
- **50% scroll**: Second benefit line visible
- **62.5% scroll**: Third benefit line visible
- **75% scroll**: Fourth benefit line visible
- **100% scroll**: Final headline "Outcomes, not overhead" visible

### Required Elements & Animations

- Prompt panel fade animation with opacity transition
- UI mockup zoom-out with scale transform
- Sequential text animations for benefit lines (stagger delay: 500ms)
- Background visual collage with subtle parallax
- Final headline with emphasis animation
- Icon animations for each benefit (🚀 🎯 💡 🔄)

### Content Requirements

- **Benefits**:
  - "🚀 Deliver faster without losing control"
  - "🎯 Align product, brand, and tech from day one"
  - "💡 Iterate on ideas, not implementations"
  - "🔄 Make fewer handoffs. Create fewer misunderstandings."
- **Final headline**: "Outcomes, not overhead."
- **Subtext**: "Voder bridges the gap between strategy and shipping..."

### Implementation Accessibility

- Benefits list marked with proper semantic structure (`ul`/`li`)
- Each benefit announced with `aria-live="polite"` as it appears
- Icons marked `aria-hidden="true"` with text alternatives
- Static version shows all benefits simultaneously for reduced motion

### Testing Assertions Required

```typescript
// Initial state
await expect(page.locator('[data-testid="prompt-panel"]')).toBeVisible();

// Trigger transition
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.75));
await waitForAnimationsComplete(page);

// Final state
await expect(page.locator('[data-testid="benefit-1"]')).toContainText(
  'Deliver faster',
);
await expect(page.locator('[data-testid="benefit-2"]')).toContainText(
  'Align product, brand',
);
await expect(page.locator('[data-testid="benefit-3"]')).toContainText(
  'Iterate on ideas',
);
await expect(page.locator('[data-testid="benefit-4"]')).toContainText(
  'fewer handoffs',
);
await expect(page.locator('[data-testid="outcomes-headline"]')).toContainText(
  'Outcomes, not overhead',
);
```
