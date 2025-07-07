# 🎬 Transition: On Load → Brand Entry

## Preload (0–0.5s)

Black screen

No UI — just silence

WebGL canvas quietly initializes in background

## Ignition (0.5–1.5s)

A single, soft pulse of light appears centre-screen — like a radar ping or nebula flash

The Voder 3D object (e.g. a faceted cube, a glowing knot of prompt-text fragments, or a lattice of ideas) slowly fades in

Object is subtly rotating, pulsing, or breathing — like it’s alive

## Logo Reveal (1.5–3s)

“Voder” types on slowly or fades in with a beam of light illuminating it

Optional: letters assemble from particles or morph from abstract curves

A short subtitle fades in beneath:

The Compiler for Prompts.

## Atmosphere Fills In (3–4s)

Background shifts subtly:
→ texture grain appears
→ colour field deepens with hints of teal, green, or soft purple
→ faint particles drift outward from the central object

Audio cue (optional): low-frequency thrum or ambient swell

## Stillness (4–6s)

Everything comes to rest

Logo glows gently

Object rotates lazily

Cursor is hidden or very subtle

No scroll hint, no nav — just presence

## ✨ Mood & Aesthetic Goals

Premium

Mysterious

Intentional

Slightly alien

Like opening sequence of a sci-fi title or an OS boot from the future

## ♿ Accessibility Implementation

### ARIA Requirements

- Canvas element: `aria-hidden="true"` (decorative 3D content)
- Section wrapper: `aria-label="Voder brand introduction"`
- Loading state: `aria-live="polite"` with "Loading Voder experience"
- Brand text: Semantic `h1` tag for "Voder" and `p` tag for tagline

### Screen Reader Experience

- Alternative text: "Voder - The Compiler for Prompts. Loading interactive brand experience."
- Skip link provided: "Skip to main content" for users who want to bypass animation
- Essential brand information available without 3D rendering

### Motion Sensitivity

- Respect `prefers-reduced-motion`: Show static logo and fade-in text only
- Provide pause control for animation (ESC key or focus trap)
- No flashing or strobing effects above 3Hz threshold

### Keyboard Navigation

- Focus trap during intro sequence
- ESC key allows immediate skip to main content
- TAB key navigation available once intro completes
