# 🎬 Transition: Metaphor → Vision Flow

## Settled Metaphor

The metaphor line:

“You’ve been in the passenger seat.”
has fully rendered on screen.

A minimal illustration shows a journey path or flowing route — labelled "Idea", "Design", "Code", "Ship".

## Scroll Initiates Transition

As the user scrolls:

The path begins to morph into a schematic, softly abstracting into nodes and flows

Headline fades out as the diagram begins to expand and occupy more screen space

## Scene Opens Up

Background lightens or subtly pulses

A flow diagram animates in:

```text
Source Prompts
      ↓
    Voder
      ↓
 Application Code
      ↓
 Working Product
```

Elements draw in live, like a system booting or idea taking form

## Text Layers In

Labels animate onto each node:

"Intent lives in markdown prompts."

"Voder interprets and compiles your vision."

"Code is written, structured, and versioned — for real."

## Atmospheric Effects

Thin pulses or connection lines animate between nodes

Mouse hover may reveal micro-explanations (optional)

A subtle looping animation keeps it alive without distracting

## ✨ Mood and Functional Shift

| From                      | To                           |
| ------------------------- | ---------------------------- |
| Philosophical metaphor    | Concrete architecture        |
| Journey/experience visual | Input–Process–Output diagram |
| Emotional                 | Practical                    |
| “Why this matters”        | “How it works”               |

## ✅ Implementation Requirements

### Trigger & Timing

- **Trigger**: Scroll to 70% of metaphor section viewport
- **Total Duration**: 3.5 seconds
- **Phases**:
  - Path morphing to schematic (1s)
  - Background lighting (0.5s)
  - Flow diagram drawing (1.5s)
  - Label animations (0.5s)

### Measurable Animation States

- **Start**: Metaphor path visible, headline at `opacity: 1`
- **1s**: Path morphing via `stroke-dasharray` animation, headline fading
- **1.5s**: Background lightened, diagram container visible
- **3s**: All flow nodes drawn and connected with animated lines
- **3.5s**: All labels positioned and visible, hover effects enabled

### Required Elements & Animations

- SVG path morphing from journey line to schematic nodes
- Flow diagram with sequential drawing animation (stroke-dasharray)
- Connection lines with pulse animation using GSAP
- Text labels with staggered fade-in animations
- Background lighting transition
- Hover interactions for micro-explanations

### Content Requirements

- **Source Prompts**: "Intent lives in markdown prompts."
- **Voder**: "Voder interprets and compiles your vision."
- **Application Code**: "Code is written, structured, and versioned — for real."
- **Working Product**: Final output node

### Implementation Accessibility

- Flow diagram marked with `role="img"` and `aria-describedby`
- Alternative text: "Voder workflow from source prompts to working product"
- Sequential announcements for each flow stage
- Static diagram available for reduced motion users

### Testing Assertions Required

```typescript
// Initial state
await expect(page.locator('[data-testid="metaphor-path"]')).toBeVisible();

// Trigger transition
await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.7));
await waitForAnimationsComplete(page);

// Final state
await expect(page.locator('[data-testid="flow-diagram"]')).toBeVisible();
await expect(page.locator('[data-testid="source-prompts-node"]')).toContainText('Source Prompts');
await expect(page.locator('[data-testid="voder-node"]')).toContainText('Voder');
await expect(page.locator('[data-testid="application-code-node"]')).toContainText('Application Code');
await expect(page.locator('[data-testid="working-product-node"]')).toContainText('Working Product');
```
