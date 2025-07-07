# ♿ Accessibility Requirements for Voder Website

## 🎯 Accessibility Goals

- **WCAG 2.1 AA Compliance**: Minimum standard for all content
- **WCAG 2.1 AAA**: Target for critical interactive elements
- **Universal Design**: Accessible by default, not as an afterthought
- **Progressive Enhancement**: Core functionality available without JavaScript/CSS

## 🎨 Color Contrast Standards

### Text Combinations (from Brand Guide)

| Text Combination              | Contrast Ratio | WCAG Level | Status       |
| ----------------------------- | -------------- | ---------- | ------------ |
| Paper White on Voder Black    | 19.6:1         | AAA        | ✅ Excellent |
| Paper White on Deep Navy      | 15.8:1         | AAA        | ✅ Excellent |
| Cool Grey on Voder Black      | 11.7:1         | AAA        | ✅ Excellent |
| Voder Black on Soft Teal Glow | 13.2:1         | AAA        | ✅ Excellent |
| Accent Green on Voder Black   | 16.1:1         | AAA        | ✅ Excellent |

### Focus Indicators

- **Minimum contrast**: 3:1 against adjacent colors
- **Visible thickness**: 2px minimum outline or border
- **No reliance on color alone**: Use shape, position, or pattern changes
- **Persistent**: Remain visible during animations and transitions

## 🔍 ARIA Implementation by Component

### 1. Brand Entry Section

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

### 2. Hero Section

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

### 3. Problem Space Section

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

### 4. Interactive Flow Diagram

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

## ⌨️ Keyboard Navigation Requirements

### Navigation Order

1. **Skip links** (hidden until focused)
2. **Main navigation** (logical left-to-right, top-to-bottom)
3. **Interactive elements** (buttons, links, form controls)
4. **Section landmarks** (can be navigated via screen reader shortcuts)

### Key Bindings

| Key               | Action                                          | Context              |
| ----------------- | ----------------------------------------------- | -------------------- |
| `Tab`             | Move to next focusable element                  | Global               |
| `Shift + Tab`     | Move to previous focusable element              | Global               |
| `Enter` / `Space` | Activate buttons and links                      | Interactive elements |
| `Escape`          | Close modals, exit fullscreen, pause animations | Global               |
| `Arrow Keys`      | Navigate within grouped elements                | Navigation menus     |

### Focus Management

- **Visible focus indicators** on all interactive elements
- **Focus trap** during intro animation (with skip option)
- **Logical tab order** following visual layout
- **No keyboard traps** (always escapable)

## 📱 Responsive Accessibility

### Touch Targets

- **Minimum size**: 44px × 44px for touch targets
- **Adequate spacing**: 8px minimum between adjacent targets
- **No precision required**: Generous click/tap areas

### Viewport Considerations

- **Zoom support**: 200% zoom without horizontal scrolling
- **Orientation**: Content usable in both portrait and landscape
- **Small screens**: Essential content prioritized on mobile

## 🎬 Motion & Animation Accessibility

### prefers-reduced-motion Support

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

### Animation Guidelines

- **No flashing** above 3 times per second
- **Pause controls** for auto-playing content longer than 5 seconds
- **Essential content** not dependent on animation
- **Smooth degradation** when animations are disabled

## 🎧 Screen Reader Optimization

### Content Structure

- **Semantic HTML**: Proper heading hierarchy (h1 → h2 → h3)
- **Landmark roles**: `main`, `navigation`, `banner`, `contentinfo`
- **Lists**: Use `ul`/`ol` for grouped content
- **Tables**: Headers and captions for data relationships

### Dynamic Content

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

### Image Accessibility

- **Meaningful images**: Descriptive alt text
- **Decorative images**: `alt=""` or `aria-hidden="true"`
- **Complex graphics**: `aria-describedby` linking to detailed description
- **3D content**: Alternative text describing essential information

## 🧪 Testing Requirements

### Automated Testing

- **axe-core** integration in Playwright tests
- **Color contrast** validation in CI pipeline
- **HTML validation** for semantic correctness
- **Keyboard navigation** automated tests

### Manual Testing

- **Screen reader testing** (NVDA, JAWS, VoiceOver)
- **Keyboard-only navigation** verification
- **High contrast mode** compatibility
- **Mobile screen reader** testing (TalkBack, VoiceOver)

### Testing Checklist

- [ ] All text meets minimum contrast ratios
- [ ] All interactive elements keyboard accessible
- [ ] Skip links functional and properly hidden
- [ ] Screen reader announces content logically
- [ ] Focus indicators visible and persistent
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Essential content available without JavaScript
- [ ] Touch targets meet minimum size requirements
- [ ] 200% zoom doesn't break layout
- [ ] No keyboard traps or focus issues

## 📋 Implementation Priority

### Phase 1: Foundation

1. Semantic HTML structure
2. Color contrast compliance
3. Keyboard navigation
4. Basic ARIA labels

### Phase 2: Enhancement

1. Advanced ARIA patterns
2. Screen reader optimization
3. Motion sensitivity support
4. Touch accessibility

### Phase 3: Validation

1. Comprehensive testing
2. User feedback integration
3. Performance optimization
4. Documentation updates

## 🎯 Success Metrics

- **Zero critical accessibility violations** in automated testing
- **100% keyboard navigation** coverage
- **WCAG 2.1 AA compliance** verified by external audit
- **Positive user feedback** from assistive technology users
