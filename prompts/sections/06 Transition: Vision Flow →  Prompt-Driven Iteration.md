# 🎬 Transition: Vision Flow → Prompt-Driven Iteration

## Vision Flow Settles

The schematic is now fully visible:

```text
Source Prompts
      ↓
    Voder
      ↓
 Application Code
      ↓
 Working Product
```

Each node may glow softly or animate in subtle loops

Final line ("Working Product") pulses once or gently fades into background

## Scroll Initiates Transition

The entire diagram subtly zooms out and blurs, becoming a background motif.

The central text block:

“Source Prompts”
softly separates and elevates, becoming the focal point.

## Prompt Appears

A stylised prompt panel fades in, with soft UI-like chrome.
Content reads:

```text
Tone: Casual, confident, modern.
```

The visual to the right shows a product UI (hero section, button, copy) with:

“Let’s get you started!”

Rounded button, bright accent colour

## Prompt Changes

The panel updates live:

```text
Tone: Premium, minimalist.
```

The product UI automatically morphs:

Headline becomes “Begin your journey.”

Button is slimmer, more reserved

Colour palette shifts to muted neutrals

## Headline Appears

“Change the prompt. Not the team.”

Subtext:

“With Voder, your intent drives product delivery. No briefs. No handoffs. No misalignment.”

## Atmospheric Design

Warm, focused lighting on UI

Background darkens subtly again to isolate the moment

Optional hover reveals for other prompt examples: - "Dark mode" → auto theme shift - "Use our new logo" → logo swaps instantly

## ✨ Emotional Arc

| From                   | To                      |
| ---------------------- | ----------------------- |
| Abstract understanding | Tangible, visual proof  |
| System flow            | Real product adaptation |
| Conceptual power       | Strategic usefulness    |
| Curiosity              | Conviction              |

## ✅ Implementation Requirements

### Trigger & Timing

- **Trigger**: Scroll to 80% of vision flow section
- **Total Duration**: 5 seconds
- **Phases**:
  - Diagram zoom out (1s)
  - Prompt panel fade in (1.5s)
  - Live update demo (2s)
  - Headline reveal (0.5s)

### Measurable Animation States

- **Start**: Vision flow diagram at `scale(1)`, full opacity
- **1s**: Diagram at `scale(0.8)`, `opacity: 0.3`, blurred
- **2.5s**: Prompt panel visible at `opacity: 1`, positioned left
- **4.5s**: UI morphing complete, new headline visible
- **5s**: All animations settled, interactive state enabled

### Required Interactive Elements

- Prompt panel with syntax highlighting (Monaco Editor or CodeMirror)
- Live UI preview showing before/after states
- Smooth morphing between UI variations (color, typography, spacing)
- Hover reveals for additional prompt examples

### Content Requirements

- Initial prompt: "Tone: Casual, confident, modern."
- Updated prompt: "Tone: Premium, minimalist."
- UI changes: Headline text, button style, color palette
- Additional examples: "Dark mode", "Use our new logo"

### Testing Assertions Required

```typescript
// Initial state
await expect(page.locator('[data-testid="vision-diagram"]')).toBeVisible();

// Transition triggered
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));

// Final state
await expect(page.locator('[data-testid="prompt-panel"]')).toBeVisible();
await expect(page.locator('[data-testid="ui-preview"]')).toBeVisible();
await expect(page.locator('[data-testid="iteration-headline"]')).toContainText('Change the prompt');
```
