# Navigation Component Implementation Guide

## 🎯 Component Overview

The Navigation component provides minimal, accessible navigation for the Voder pre-launch website. It focuses on accessibility-first design with keyboard navigation support while maintaining the site's premium, minimalist aesthetic.

## 🏗️ Architecture Pattern

### Interface Definition

```typescript
interface NavigationComponent {
  mount(container: HTMLElement): void;
  unmount(): void;
  updateActiveSection(sectionId: string): void;
  getCurrentSection(): string | null;
}

interface NavigationConfig {
  sections: NavigationSection[];
  accessibility: AccessibilityConfig;
  appearance: NavigationAppearance;
}

interface NavigationSection {
  id: string;
  label: string;
  ariaLabel?: string;
  scrollTarget: string;
}

interface AccessibilityConfig {
  skipToContentLabel: string;
  navigationLabel: string;
  currentPageIndicator: string;
  keyboardInstructions: string;
}

interface NavigationAppearance {
  position: 'fixed' | 'sticky';
  background: 'transparent' | 'overlay';
  minimizeOnScroll: boolean;
  hideOnMobile: boolean;
}
```

### Service Dependencies

**Required Services:**

- `AccessibilityService` - Screen reader announcements and ARIA management
- `ScrollService` - Smooth scrolling to sections and scroll position tracking
- `AnimationService` - Subtle transitions and scroll-based visibility

**Injection Pattern:**

```typescript
class NavigationComponent {
  constructor(
    private accessibilityService: AccessibilityService,
    private scrollService: ScrollService,
    private animationService: AnimationService,
  ) {}
}
```

## 🎨 Visual Design Specification

### Brand Compliance

**Typography:**

- Font Family: Inter, fallback to system sans-serif
- Font Weight: 500 (medium) for navigation links
- Font Size: 14px base, 16px minimum touch target
- Line Height: 1.4 for optimal readability

**Color Palette:**

- Default State: Cool Grey (#C6CBD4) - 11.7:1 contrast on Deep Navy
- Hover State: Soft Teal Glow (#24D1D5) - 15.1:1 contrast
- Active State: Accent Green (#9AEF00) - 16.8:1 contrast
- Background: Deep Navy (#0F1A2E) with 90% opacity overlay

**Spacing & Layout:**

- Navigation Height: 60px on desktop, 50px on mobile
- Link Padding: 12px horizontal, 16px vertical
- Touch Target: Minimum 44px × 44px
- Section Spacing: 24px between navigation items
- Container Margins: 24px from viewport edges

### Responsive Behavior

**Desktop (≥1024px):**

- Fixed position navigation with full section labels
- Horizontal layout with smooth hover transitions
- Keyboard focus indicators with 2px Accent Green outline

**Tablet (768px - 1023px):**

- Sticky position with condensed labels
- Horizontal layout maintained
- Touch-friendly 48px minimum targets

**Mobile (≤767px):**

- Hidden by default, accessible via skip links
- Focus on skip-to-content functionality
- Section navigation via scroll position only

## ♿ Accessibility Implementation

### ARIA Structure

```html
<nav aria-label="Main navigation" role="navigation">
  <ol role="list">
    <li>
      <a
        href="#brand-entry"
        aria-current="page"
        aria-describedby="nav-instructions"
      >
        Brand Entry
      </a>
    </li>
  </ol>
  <div id="nav-instructions" class="sr-only">
    Use arrow keys to navigate, Enter to activate
  </div>
</nav>
```

### Keyboard Navigation

- **Tab/Shift+Tab**: Move between navigation links
- **Arrow Keys**: Navigate within section list (roving tabindex)
- **Enter/Space**: Activate selected navigation link
- **Escape**: Return focus to skip-to-content link
- **Home/End**: Jump to first/last navigation item

### Screen Reader Support

- Announce current section when scrolling
- Provide navigation context: "Section 3 of 8"
- Clear link purpose: "Navigate to Problem Space section"
- Progress indication: "Currently viewing The Why section"

### Reduced Motion Support

```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

if (prefersReducedMotion) {
  // Instant scrolling, no transitions
  scrollBehavior = 'auto';
  transitionDuration = '0ms';
} else {
  // Smooth scrolling with easing
  scrollBehavior = 'smooth';
  transitionDuration = '300ms';
}
```

## 🎮 Interaction Patterns

### Scroll Position Tracking

```typescript
class ScrollTracker {
  private currentSection: string | null = null;

  updateActiveSection(): void {
    const sections = document.querySelectorAll('[data-section]');
    const viewportCenter = window.innerHeight / 2;

    let activeSection: string | null = null;
    let closestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distance = Math.abs(sectionCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        activeSection = section.getAttribute('data-section');
      }
    });

    if (activeSection !== this.currentSection) {
      this.updateNavigationState(activeSection);
      this.announceToScreenReader(activeSection);
    }
  }
}
```

### GSAP ScrollTrigger Integration

```typescript
class NavigationAnimations {
  setupScrollTriggers(): void {
    // Navigation visibility based on scroll position
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top -100',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const opacity = self.progress > 0.1 ? 1 : 0;
        gsap.to('.navigation', {
          opacity,
          duration: 0.3,
          ease: 'power2.out',
        });
      },
    });

    // Section progress indicators
    document.querySelectorAll('[data-section]').forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
        onUpdate: (self) => {
          this.updateSectionProgress(section.id, self.progress);
        },
      });
    });
  }
}
```

## 🧪 Testing Requirements

### Accessibility Testing

```typescript
// Playwright accessibility tests
test('navigation keyboard accessibility', async ({ page }) => {
  await page.goto('/');

  // Test skip-to-content link
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="skip-to-content"]')).toBeFocused();

  // Test navigation focus order
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-testid="nav-brand-entry"]')).toBeFocused();

  // Test arrow key navigation
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('[data-testid="nav-the-why"]')).toBeFocused();
});

test('navigation screen reader announcements', async ({ page }) => {
  await page.goto('/');

  // Verify ARIA labels
  await expect(page.locator('nav')).toHaveAttribute(
    'aria-label',
    'Main navigation',
  );

  // Test section change announcements
  await page.locator('[data-testid="nav-problem-space"]').click();
  await expect(page.locator('[aria-live="polite"]')).toContainText(
    'Navigated to Problem Space section',
  );
});
```

### Responsive Testing

```typescript
test('navigation responsive behavior', async ({ page }) => {
  // Desktop navigation
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.locator('[data-testid="navigation"]')).toBeVisible();

  // Mobile navigation
  await page.setViewportSize({ width: 375, height: 667 });
  await expect(page.locator('[data-testid="navigation"]')).toBeHidden();
  await expect(page.locator('[data-testid="skip-to-content"]')).toBeVisible();
});
```

### Scroll Integration Testing

```typescript
test('navigation reflects scroll position', async ({ page }) => {
  await page.goto('/');

  // Scroll to Problem Space section
  await page.locator('[data-section="problem-space"]').scrollIntoView();

  // Verify active state
  await expect(
    page.locator('[data-testid="nav-problem-space"]'),
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('[data-testid="nav-problem-space"]')).toHaveClass(
    /active/,
  );
});
```

## 🚀 Performance Considerations

### Scroll Optimization

- Throttle scroll event listeners to 16ms (60fps)
- Use `IntersectionObserver` for section visibility detection
- Cache DOM queries for navigation elements
- Debounce screen reader announcements (500ms)

### Animation Performance

- Use `transform` and `opacity` for GPU acceleration
- Avoid layout-triggering properties (width, height, margin)
- Implement `will-change` hints for animated elements
- Remove animation listeners when component unmounts

### Memory Management

```typescript
class NavigationComponent {
  private observers: IntersectionObserver[] = [];
  private scrollTriggers: ScrollTrigger[] = [];

  unmount(): void {
    // Clean up observers
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];

    // Clean up ScrollTriggers
    this.scrollTriggers.forEach((trigger) => trigger.kill());
    this.scrollTriggers = [];

    // Remove event listeners
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }
}
```

## 📋 Implementation Checklist

### Core Functionality

- [ ] Create NavigationComponent class with TypeScript interfaces
- [ ] Implement service injection (AccessibilityService, ScrollService, AnimationService)
- [ ] Add scroll position tracking with section detection
- [ ] Create smooth scrolling to sections with offset calculation

### Accessibility Features

- [ ] Implement skip-to-content link with proper focus management
- [ ] Add ARIA navigation structure with role="navigation"
- [ ] Create keyboard navigation with arrow keys and roving tabindex
- [ ] Add screen reader announcements for section changes
- [ ] Implement reduced motion support for transitions

### Visual Design

- [ ] Apply Voder brand colors with proper contrast ratios
- [ ] Create responsive layout (desktop/tablet/mobile)
- [ ] Add hover and focus states with smooth transitions
- [ ] Implement active section highlighting

### GSAP Integration

- [ ] Set up ScrollTrigger for navigation visibility with scrub property
- [ ] Create section progress tracking tied to scroll position
- [ ] Add smooth reveal animations for navigation elements

### Testing

- [ ] Write accessibility tests for keyboard navigation
- [ ] Create responsive behavior tests for all viewport sizes
- [ ] Add scroll integration tests for active section tracking
- [ ] Implement screen reader announcement testing

### Performance

- [ ] Optimize scroll event handling with throttling
- [ ] Implement IntersectionObserver for section detection
- [ ] Add proper cleanup in unmount method
- [ ] Cache DOM queries and use efficient selectors
