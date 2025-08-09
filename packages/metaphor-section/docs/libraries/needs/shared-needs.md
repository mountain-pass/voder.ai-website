# Metaphor Section - Shared Package Dependencies

## Purpose

This file documents what the Metaphor Section package needs from `@voder/shared` and how it intends to use those shared utilities.

## Required Interfaces from @voder/shared

### Base Component Interface
- `IComponent` with id, getState() method
- `ComponentState` type for lifecycle management
- `IConfigurableComponent<T>` for configuration management

### Section Component Interface
- `ISectionComponent` extending IComponent with render(), updateScrollProgress(), cleanup()
- `SectionServices` interface for service injection (animation, accessibility, scroll, asset)
- `SectionConfiguration` extending ComponentConfiguration with section-specific settings
- `ScrollTriggerConfiguration` for GSAP ScrollTrigger setup
- `EffectConfiguration` for managing 3D visualization effects

### Animation Timeline Interface
- `IAnimationTimeline` for GSAP timeline management (play, pause, reverse, seek, kill)
- `TimelineConfiguration` for timeline setup options

### Configuration Types
- `ComponentConfiguration` with id, debug, containerId, accessibility
- `AccessibilityConfiguration` for ARIA and motion preferences (critical for 3D metaphor visualization)
- Configuration validation functions

### Brand Constants
- `BRAND_COLORS` for consistent Voder color palette (DEEP_NAVY, PAPER_WHITE, SOFT_TEAL_GLOW, ACCENT_GREEN)
- `BRAND_TYPOGRAPHY` for consistent font stacks (Inter for journey metaphor content)

### Error Handling
- `ComponentError` class for component-specific errors
- `ValidationError` class for configuration validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config validation

### DOM Utilities
- `findFocusableElements()` for keyboard navigation setup in comparison interactions
- `createAriaLiveRegion()` for screen reader announcements during metaphor transitions

### Constants
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for timing metaphor announcements
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` for smooth focus transitions
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 3D route visualization optimization

## Usage Patterns Specific to Metaphor Section

### Journey Metaphor Visualization
Uses `BRAND_COLORS.SOFT_TEAL_GLOW` for GPS metaphor highlighting and `BRAND_COLORS.ACCENT_GREEN` for journey path visualization with clear brand consistency.

### Interactive Comparison Framework
Leverages keyboard navigation utilities and focus management for side-by-side metaphor comparison interactions, ensuring accessibility compliance.

### 3D Route Visualization Integration
Integrates with Canvas3DEffect requiring performance monitoring and accessibility alternatives for complex GPS/directions visualization metaphors.

### Journey Narrative Presentation
Uses semantic component interfaces to present conceptual journey from traditional tools (directions) to Voder's approach (GPS guidance) with proper content hierarchy.
