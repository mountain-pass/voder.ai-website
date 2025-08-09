# Outcome Focus Section - Shared Package Dependencies

## Purpose

This file documents what the Outcome Focus Section package needs from `@voder/shared` and how it intends to use those shared utilities.

## Required Interfaces from @voder/shared

### Base Component Interface
- `IComponent` with id, getState() method
- `ComponentState` type for lifecycle management
- `IConfigurableComponent<T>` for configuration management

### Section Component Interface
- `ISectionComponent` extending IComponent with render(), updateScrollProgress(), cleanup()
- `SectionServices` interface for service injection (animation, accessibility, assets, scroll)
- `SectionConfiguration` extending ComponentConfiguration with section-specific settings
- `ScrollTriggerConfiguration` for GSAP ScrollTrigger setup
- `EffectConfiguration` for managing visual effects

### Animation Timeline Interface
- `IAnimationTimeline` for GSAP timeline management (play, pause, reverse, seek, kill)
- `TimelineConfiguration` for timeline setup options

### Configuration Types
- `ComponentConfiguration` with id, debug, containerId, accessibility
- `AccessibilityConfiguration` for ARIA and motion preferences
- Configuration validation functions

### Brand Constants
- `BRAND_COLORS` for consistent Voder color palette (VODER_BLACK, SOFT_TEAL_GLOW, ACCENT_GREEN)
- `BRAND_TYPOGRAPHY` for consistent font stacks (Inter, Satoshi, JetBrains Mono)

### Error Handling
- `ComponentError` class for component-specific errors
- `ValidationError` class for configuration validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config validation

### DOM Utilities
- `findFocusableElements()` for keyboard navigation setup
- `createAriaLiveRegion()` for screen reader announcements

### Constants
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for timing announcements
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` for smooth focus transitions
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps performance

## Usage Patterns

### Benefit Card Management
The Outcome Focus Section uses shared interfaces to manage interactive benefit presentations:

```typescript
interface OutcomeFocusSectionConfig extends SectionConfiguration {
  benefits: Benefit[];
  animationDuration: number;
  staggerDelay: number;
  cardLayout: CardLayoutConfig;
}
```

### Card Layout Configuration
Uses shared utilities for responsive benefit card layout:

```typescript
// Configuration validation using shared utilities
validateComponentConfiguration(config);
validateAccessibilityConfiguration(config.accessibility);

// Error handling for benefit data
if (!config.benefits.length) {
  throw new ValidationError('At least one benefit required for outcome presentation');
}
```

### Interactive Card Navigation
Leverages shared DOM utilities for accessible navigation between benefit cards:

```typescript
// Set up keyboard navigation using shared utilities
const focusableCards = findFocusableElements(benefitsGrid);
setupKeyboardNavigation(focusableCards);

// Create accessibility announcements for benefit metrics
const announcements = createAriaLiveRegion();
announcements.textContent = `${benefitTitle} shows ${metricsText}`;
```

### Progressive Benefit Reveals
Uses shared animation interfaces for scroll-tied benefit presentations:

```typescript
const timeline: IAnimationTimeline = animationService.createTimeline({
  paused: true,
  duration: config.animationDuration
});

// Scroll-tied reveal of benefit cards
ScrollTrigger.create({
  trigger: benefitsGrid,
  start: 'top 70%',
  end: 'top 30%',
  scrub: 1,
  animation: timeline
});
```

### Brand Integration for Benefits
Uses shared brand constants for consistent styling of benefit presentations:

```typescript
// Apply brand colors for benefit card styling
cardElement.style.setProperty('--card-background', BRAND_COLORS.VODER_BLACK);
cardElement.style.setProperty('--accent-color', BRAND_COLORS.SOFT_TEAL_GLOW);
cardElement.style.setProperty('--highlight-color', BRAND_COLORS.ACCENT_GREEN);
cardElement.style.setProperty('--card-font', BRAND_TYPOGRAPHY.BODY_FONT);
```

### Metric Animation Support
Uses shared utilities for animated metric value presentations:

```typescript
// Validate metric data structure
const validMetrics = config.benefits.map(benefit => {
  if (benefit.metrics) {
    benefit.metrics.forEach(metric => {
      validateRequired(metric.value, 'metric value');
      validateRequired(metric.label, 'metric label');
    });
  }
  return benefit;
});
```
