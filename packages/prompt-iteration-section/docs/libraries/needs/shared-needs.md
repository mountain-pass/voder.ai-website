# Prompt Iteration Section - Shared Package Dependencies

## Purpose

This file documents what the Prompt Iteration Section package needs from `@voder/shared` and how it intends to use those shared utilities.

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

### Code Demonstration Management
The Prompt Iteration Section uses shared interfaces to manage interactive code demonstrations:

```typescript
interface PromptIterationSectionConfig extends SectionConfiguration {
  demonstrations: CodeDemonstration[];
  iterationSpeed: number;
  highlightColor: string;
  animationDuration: number;
}
```

### Diff Visualization Setup
Uses shared utilities for managing diff highlighting and code comparison displays:

```typescript
// Configuration validation using shared utilities
validateComponentConfiguration(config);
validateAccessibilityConfiguration(config.accessibility);

// Error handling for demonstration loading
if (!config.demonstrations.length) {
  throw new ValidationError('At least one code demonstration required');
}
```

### Interactive Demo Navigation
Leverages shared DOM utilities for accessible navigation between code examples:

```typescript
// Set up keyboard navigation using shared utilities
const focusableElements = findFocusableElements(demoContainer);
setupKeyboardNavigation(focusableElements);

// Create accessibility announcements
const announcements = createAriaLiveRegion();
announcements.textContent = `Showing demonstration ${index + 1} of ${total}`;
```

### Progressive Code Reveal
Uses shared animation interfaces for scroll-tied code demonstrations:

```typescript
const timeline: IAnimationTimeline = animationService.createTimeline({
  paused: true,
  duration: config.animationDuration
});

// Scroll-tied reveal of code changes
ScrollTrigger.create({
  trigger: codeContainer,
  start: 'top 70%',
  end: 'top 30%',
  scrub: 1,
  animation: timeline
});
```

### Brand Integration for Code Display
Uses shared brand constants for consistent styling of code demonstrations:

```typescript
// Apply brand colors for diff highlighting
codeElement.style.setProperty('--addition-color', BRAND_COLORS.ACCENT_GREEN);
codeElement.style.setProperty('--deletion-color', BRAND_COLORS.PROBLEM_RED);
codeElement.style.setProperty('--modification-color', BRAND_COLORS.SOFT_TEAL_GLOW);
codeElement.style.setProperty('--code-font', BRAND_TYPOGRAPHY.CODE_FONT);
```
