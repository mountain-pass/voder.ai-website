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
