# 🎨 Voder Brand Guide

## 🧠 Brand Essence

| Element         | Description                                                   |
| --------------- | ------------------------------------------------------------- |
| **Name**        | Voder                                                         |
| **Tagline**     | The Compiler for Prompts                                      |
| **Core Belief** | Software should start with intent                             |
| **Persona**     | Calm confidence, not hype. A system that knows what you mean. |
| **Voice**       | Minimal. Clear. Slightly sly. Rarely loud.                    |

## 🌌 Brand Personality

- Intelligent, not academic
- Futuristic, not sci-fi
- Premium, not flashy
- Confident, not arrogant
- Precise, not sterile
- Minimalist, not boring

## 🎨 Visual Language

### 1. Typography

| Use            | Font                           | Style                                  |
| -------------- | ------------------------------ | -------------------------------------- |
| Headlines      | Inter / Satoshi / Neue Haas    | Semi-bold, geometric, generous spacing |
| Body text      | Inter / Helvetica Neue         | Light to regular, clear                |
| Code / prompts | JetBrains Mono / IBM Plex Mono | Clean, consistent                      |

### 2. Colour Palette

| Name           | HEX       | Use                                         |
| -------------- | --------- | ------------------------------------------- |
| Voder Black    | `#0A0A0A` | Background base                             |
| Deep Navy      | `#0F1A2E` | Hero backgrounds, depth                     |
| Soft Teal Glow | `#24D1D5` | Accent for interactive and branded elements |
| Accent Green   | `#9AEF00` | Optional prompt highlighting (sparingly)    |
| Cool Grey      | `#C6CBD4` | Secondary text                              |
| Paper White    | `#FFFFFF` | Primary text on dark                        |

> **Note:** Accent colours should glow _subtly_, not scream.

### 3. Accessibility & Color Contrast

| Text Combination                                  | Contrast Ratio | WCAG Level | Use Case                   |
| ------------------------------------------------- | -------------- | ---------- | -------------------------- |
| Paper White (#FFFFFF) on Voder Black (#0A0A0A)    | 19.6:1         | AAA        | Primary text, headlines    |
| Paper White (#FFFFFF) on Deep Navy (#0F1A2E)      | 15.8:1         | AAA        | Hero section text          |
| Cool Grey (#C6CBD4) on Voder Black (#0A0A0A)      | 11.7:1         | AAA        | Secondary text, captions   |
| Voder Black (#0A0A0A) on Soft Teal Glow (#24D1D5) | 13.2:1         | AAA        | Interactive elements, CTAs |
| Accent Green (#9AEF00) on Voder Black (#0A0A0A)   | 16.1:1         | AAA        | Code highlighting, accents |

**Requirements:**

- All text must meet WCAG 2.1 AA minimum (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must meet AAA standard (7:1 for normal text, 4.5:1 for large text)
- Focus indicators must have 3:1 contrast ratio against adjacent colors
- Glow effects must not reduce text readability below minimum standards

### 4. Iconography and Shapes

- Icons should be **line-based**, minimal
- Avoid skeuomorphism
- Repeating motif: cube, flow lines, glimmer, lattice, circuit

## 🔍 Accessibility Requirements

### 1. ARIA Standards

| Component Type       | Required ARIA Attributes                          | Implementation Notes                   |
| -------------------- | ------------------------------------------------- | -------------------------------------- |
| Navigation           | `role="navigation"`, `aria-label`                 | Clear navigation purpose and structure |
| Interactive Elements | `aria-label`, `aria-describedby` (if needed)      | Descriptive labels for all controls    |
| 3D Canvas            | `aria-label="decorative"` or `aria-hidden="true"` | Mark purely visual 3D elements         |
| Form Controls        | `aria-label`, `aria-required`, `aria-invalid`     | Complete form accessibility            |
| Dynamic Content      | `aria-live`, `aria-atomic` (for animations)       | Screen reader awareness of changes     |
| Focus Management     | `tabindex`, `:focus-visible`                      | Logical keyboard navigation            |

### 2. Keyboard Navigation

- All interactive elements must be keyboard accessible
- Focus order must follow logical reading flow
- Skip links provided for main content areas
- Escape key exits modal states or 3D interactions
- Enter/Space activates buttons and links

### 3. Screen Reader Support

- Semantic HTML structure (h1-h6 hierarchy)
- Alt text for meaningful images, empty alt for decorative
- ARIA labels for complex visual elements
- Content structure remains logical without CSS
- Loading states announced to screen readers

### 4. Motion & Animation Accessibility

- Respect `prefers-reduced-motion` media query
- Provide pause/play controls for automatic animations
- No flashing content above 3Hz
- Smooth scrolling can be disabled
- Focus indicators remain visible during animations

## ✨ Motion & Interaction Principles

| Motion Principle          | Description                                                  |
| ------------------------- | ------------------------------------------------------------ |
| **Reveal, not drop**      | Text should fade, slide, or assemble — never plonk into view |
| **Intentional stillness** | Let things rest. Give space to think.                        |
| **Scroll-led narrative**  | Sections progress via scroll, not clicks.                    |
| **Ambient feedback**      | Tiny glimmers, pulses, or hovers to reward attention         |

## 🧭 Voice & Tone

### 1. Examples

| Context             | Voice Example                                   |
| ------------------- | ----------------------------------------------- |
| Hero Line           | “What if your prompts were the source?”         |
| CTA substitute      | “Coming soon.” _(quietly confident)_            |
| Microcopy           | “Built with Voder. (Of course.)”                |
| Feature Explanation | “You set the direction. Voder plans the route.” |

### 2. Avoid

- Over-explaining
- Marketing fluff
- Overuse of "AI" as a buzzword
- Developer jargon (for external messaging)

## 🧱 Layout and Structure Guidelines

| Section          | Content Format                              | Notes                              |
| ---------------- | ------------------------------------------- | ---------------------------------- |
| Brand Entry      | Full-screen logo + visual object            | No scroll hint                     |
| The Why          | 1–2 statements + ambient motion             | Big type, lots of space            |
| Problem Space    | Layered visuals, bold headings              | Emotional tension                  |
| Metaphor         | Journey-line graphic, sub-heads             | Scroll-linked animation            |
| Vision Flow      | Schematic diagram                           | Simplified Input–Output logic      |
| Prompt Iteration | UI transformation demo                      | Strategic, not technical           |
| Outcome Focus    | 3–4 benefit lines                           | Pulse animation, fade pacing       |
| Closing Moment   | Logo, tagline, “Built with Voder” in corner | Fade to black, final brand imprint |

## 🪄 Summary: If Voder Were a Person…

- **Wears:** black tailored hoodie, clean sneakers, elevated street wear
- **Reads:** sci-fi philosophy and design systems docs
- **Speaks:** slowly, clearly, and only when needed
- **Listens:** very closely
