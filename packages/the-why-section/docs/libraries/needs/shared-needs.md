# The Why Section - Shared Package Dependencies

## Purpose

This file documents what The Why Section package needs from `@voder/shared` and how it intends to use those shared utilities.

## Required Interfaces from @voder/shared

### Base Component Interface
- `IComponent` with id, getState() method
- `ComponentState` type for lifecycle management
- `IConfigurableComponent<T>` for configuration management

### Section Component Interface
- `ISectionComponent` extending IComponent with render(), updateScrollProgress(), cleanup()
- `SectionServices` interface for service injection (animation, accessibility, scroll)
- `SectionConfiguration` extending ComponentConfiguration with section-specific settings
- `ScrollTriggerConfiguration` for GSAP ScrollTrigger setup
- `EffectConfiguration` for managing typing animation effects

### Animation Timeline Interface
- `IAnimationTimeline` for GSAP timeline management (play, pause, reverse, seek, kill)
- `TimelineConfiguration` for timeline setup options

### Configuration Types
- `ComponentConfiguration` with id, debug, containerId, accessibility
- `AccessibilityConfiguration` for ARIA and motion preferences (essential for reduced motion support)
- Configuration validation functions

### Brand Constants
- `BRAND_COLORS` for consistent Voder color palette (DEEP_NAVY, PAPER_WHITE, SOFT_TEAL_GLOW)
- `BRAND_TYPOGRAPHY` for consistent font stacks (Inter for messaging content)

### Error Handling
- `ComponentError` class for component-specific errors
- `ValidationError` class for configuration validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config validation

### DOM Utilities
- `findFocusableElements()` for keyboard navigation setup
- `createAriaLiveRegion()` for screen reader announcements during typing effects

### Constants
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for timing typing announcements
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` for smooth focus transitions
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps typing performance

## Usage Patterns Specific to The Why Section

### Typography-Focused Content Presentation
Uses `BRAND_TYPOGRAPHY.primary` (Inter) for philosophical messaging with emphasis on readability and hierarchy.

### Typing Animation Integration
Integrates with TypingAnimationEffect requiring precise timing constants and performance monitoring from shared utilities.

### Enhanced Accessibility for Text Content
Relies heavily on screen reader support during typing sequences and reduced motion fallbacks for static text presentation.

### Philosophical Content Structure
Uses semantic component interfaces to present conceptual framework with proper heading hierarchy and content organization.
