# 🔧 Transition Implementation Patterns

This file provides actionable templates and patterns for implementing the transitions specified in the section files. Use these as starting points to ensure consistent, testable, and accessible implementations.

## 🎯 Core Implementation Template

### TypeScript Class Structure

```typescript
interface TransitionConfig {
  trigger: 'scroll' | 'time' | 'interaction';
  triggerValue: number | string; // scroll %, ms delay, or selector
  duration: number; // total duration in ms
  phases: AnimationPhase[];
  accessibility: A11yConfig;
  testSelectors: string[];
}

interface AnimationPhase {
  name: string;
  startTime: number; // ms from transition start
  duration: number;
  elements: string[]; // CSS selectors
  properties: AnimationProperty[];
}

interface AnimationProperty {
  property: string; // 'opacity', 'transform', etc.
  from: string | number;
  to: string | number;
  easing: string;
}

class TransitionController {
  constructor(private config: TransitionConfig) {}
  
  init(): void {
    this.setupTrigger();
    this.setupAccessibility();
    this.addTestSelectors();
  }
  
  private setupTrigger(): void {
    // Implementation based on config.trigger
  }
  
  private setupAccessibility(): void {
    // Add aria-live regions, reduced motion fallbacks
  }
  
  private addTestSelectors(): void {
    // Add data-testid attributes to elements
  }
  
  play(): Promise<void> {
    // Execute the transition phases
  }
  
  skip(): void {
    // Jump to final state for accessibility
  }
}
```

## 📋 Testing Template

### Playwright Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { waitForAnimationsComplete } from './helpers/animation-utils';

test.describe('Transition: [Name]', () => {
  test('should complete transition with all elements visible', async ({ page }) => {
    await page.goto('/');
    
    // Initial state verification
    await expect(page.locator('[data-testid="initial-element"]')).toBeVisible();
    
    // Trigger the transition
    // (scroll, click, or wait based on transition type)
    
    // Wait for animations to complete
    await waitForAnimationsComplete(page);
    
    // Final state verification
    await expect(page.locator('[data-testid="final-element"]')).toBeVisible();
    await expect(page.locator('[data-testid="key-content"]')).toContainText('Expected Text');
  });
  
  test('should respect prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    
    // Verify static fallback is shown
    await expect(page.locator('[data-testid="static-fallback"]')).toBeVisible();
  });
  
  test('should be skippable for accessibility', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Escape');
    
    // Verify transition skipped to final state
    await expect(page.locator('[data-testid="final-state"]')).toBeVisible();
  });
});
```

## 🎨 GSAP Animation Patterns

### Scroll-Triggered Transition

```typescript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

class ScrollTriggeredTransition {
  constructor(private config: TransitionConfig) {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  init(): void {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.config.triggerValue,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        onStart: () => this.announceToScreenReader("Transition starting"),
        onComplete: () => this.announceToScreenReader("Transition complete")
      }
    });
    
    this.config.phases.forEach(phase => {
      tl.to(phase.elements, {
        duration: phase.duration / 1000,
        ...this.convertProperties(phase.properties),
        ease: phase.properties[0]?.easing || "power2.out"
      }, phase.startTime / 1000);
    });
    
    // Add reduced motion fallback
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tl.kill();
      this.showStaticFallback();
    }
  }
  
  private announceToScreenReader(message: string): void {
    const announcer = document.querySelector('[aria-live="polite"]');
    if (announcer) {
      announcer.textContent = message;
    }
  }
  
  private showStaticFallback(): void {
    // Show final state immediately without animation
    this.config.phases.forEach(phase => {
      phase.elements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          this.applyFinalState(element, phase.properties);
        }
      });
    });
  }
}
```

## ♿ Accessibility Pattern

### Required ARIA Structure

```html
<!-- Container for transition -->
<section aria-labelledby="transition-heading" data-testid="transition-container">
  <!-- Hidden heading for screen readers -->
  <h2 id="transition-heading" class="sr-only">
    [Descriptive transition name]
  </h2>
  
  <!-- Live region for announcements -->
  <div aria-live="polite" aria-atomic="true" class="sr-only" data-testid="transition-announcer">
    <!-- Dynamic announcements inserted here -->
  </div>
  
  <!-- Skip link -->
  <button 
    data-testid="skip-transition" 
    class="skip-link"
    aria-label="Skip animation and go to final content"
  >
    Skip Animation
  </button>
  
  <!-- Animated content (decorative) -->
  <div aria-hidden="true" data-testid="transition-animation">
    <!-- Complex animations here -->
  </div>
  
  <!-- Essential content (always accessible) -->
  <div data-testid="essential-content">
    <!-- Key information available without animation -->
  </div>
</section>
```

## 🔍 Required Test Data Attributes

Every transition must include these `data-testid` attributes:

- `transition-container`: Main container element
- `transition-announcer`: ARIA live region
- `skip-transition`: Skip button
- `transition-animation`: Animated elements container
- `essential-content`: Non-decorative content
- `[section-name]-trigger`: Element that triggers the transition
- `[section-name]-complete`: Element visible when transition is complete

## 📊 Performance Monitoring

```typescript
class TransitionPerformanceMonitor {
  private startTime: number = 0;
  
  startMonitoring(): void {
    this.startTime = performance.now();
  }
  
  checkFrameRate(): void {
    // Monitor for dropped frames during animation
    requestAnimationFrame(() => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.startTime;
      
      if (deltaTime > 16.67) { // More than 60fps threshold
        console.warn(`Animation frame took ${deltaTime}ms (dropped frames detected)`);
      }
    });
  }
  
  measureTransitionComplete(): void {
    const totalTime = performance.now() - this.startTime;
    console.log(`Transition completed in ${totalTime}ms`);
    
    // Verify timing matches specification ±100ms tolerance
    const expectedDuration = this.config.duration;
    if (Math.abs(totalTime - expectedDuration) > 100) {
      console.warn(`Transition timing off by ${Math.abs(totalTime - expectedDuration)}ms`);
    }
  }
}
```

## 🎯 Implementation Checklist

For each transition, verify:

- [ ] `TransitionConfig` object defined with all required properties
- [ ] Trigger mechanism implemented and tested
- [ ] All animation phases have defined start times and durations
- [ ] Accessibility announcements added for screen readers
- [ ] `prefers-reduced-motion` fallback implemented
- [ ] Skip functionality available (ESC key or button)
- [ ] All required `data-testid` attributes added
- [ ] Playwright tests written and passing
- [ ] Performance monitoring shows <60fps maintained
- [ ] Essential content accessible without animation
- [ ] Timing matches specification within ±100ms tolerance

Use this checklist before marking any transition as complete.
