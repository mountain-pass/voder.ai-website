# Closing Moment Section - Shared Package Dependencies

## Purpose

This file documents what the Closing Moment Section package needs from `@voder/shared` and how it intends to use those shared utilities.

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

### Final Brand Statement Management
The Closing Moment Section uses shared interfaces to manage the conclusive brand presentation:

```typescript
interface ClosingMomentSectionConfig extends SectionConfiguration {
  brandStatement: string;
  comingSoonText: string;
  fadeTransition: FadeTransitionConfig;
  glowEffect: GlowEffectConfig;
}
```

### Conclusion Configuration
Uses shared utilities for managing final section configuration and validation:

```typescript
// Configuration validation using shared utilities
validateComponentConfiguration(config);
validateAccessibilityConfiguration(config.accessibility);

// Error handling for final content requirements
if (!config.brandStatement?.trim()) {
  throw new ValidationError('Brand statement required for closing moment');
}
```

### Accessibility Announcements
Leverages shared DOM utilities for final presentation announcements:

```typescript
// Set up completion announcements using shared utilities
const announcements = createAriaLiveRegion();
announcements.textContent = 'Voder presentation complete. Thank you for your interest.';

// Keyboard interaction setup
const focusableElements = findFocusableElements(closingContainer);
setupKeyboardNavigation(focusableElements);
```

### Final Animation Sequences
Uses shared animation interfaces for scroll-tied conclusion presentation:

```typescript
const timeline: IAnimationTimeline = animationService.createTimeline({
  paused: true,
  duration: config.fadeTransition.duration
});

// Scroll-tied final reveal sequence
ScrollTrigger.create({
  trigger: brandStatement,
  start: 'top 70%',
  end: 'top 40%',
  scrub: 1,
  animation: timeline
});
```

### Brand Integration for Conclusion
Uses shared brand constants for consistent styling of final brand presentation:

```typescript
// Apply brand colors for conclusion styling
closingElement.style.setProperty('--background-color', BRAND_COLORS.VODER_BLACK);
closingElement.style.setProperty('--text-color', BRAND_COLORS.PAPER_WHITE);
closingElement.style.setProperty('--glow-color', BRAND_COLORS.SOFT_TEAL_GLOW);
closingElement.style.setProperty('--accent-color', BRAND_COLORS.ACCENT_GREEN);
closingElement.style.setProperty('--brand-font', BRAND_TYPOGRAPHY.HEADING_FONT);
```

### Signature Glow Effect Support
Uses shared utilities for final signature glow presentation:

```typescript
// Validate glow effect configuration
if (config.glowEffect) {
  validateRequired(config.glowEffect.color, 'glow effect color');
  validateRequired(config.glowEffect.intensity, 'glow effect intensity');
  
  // Apply performance thresholds for particle effects
  const particleCount = Math.min(
    config.glowEffect.particleCount || 12,
    PERFORMANCE_THRESHOLDS.MAX_PARTICLES
  );
}
```
