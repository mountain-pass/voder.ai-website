# Vision Flow Section - Shared Package Dependencies

## Purpose

This file documents what the Vision Flow Section package needs from `@voder/shared` and how it intends to use those shared utilities.

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
- `EffectConfiguration` for managing interactive button effects

### Animation Timeline Interface
- `IAnimationTimeline` for GSAP timeline management (play, pause, reverse, seek, kill)
- `TimelineConfiguration` for timeline setup options

### Configuration Types
- `ComponentConfiguration` with id, debug, containerId, accessibility
- `AccessibilityConfiguration` for ARIA and motion preferences (critical for flow diagram accessibility)
- Configuration validation functions

### Brand Constants
- `BRAND_COLORS` for consistent Voder color palette (SOFT_TEAL_GLOW for flow lines, ACCENT_GREEN for active steps)
- `BRAND_TYPOGRAPHY` for consistent font stacks (Inter for workflow content)

### Error Handling
- `ComponentError` class for component-specific errors
- `ValidationError` class for configuration validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config validation

### DOM Utilities
- `findFocusableElements()` for keyboard navigation setup in interactive flow steps
- `createAriaLiveRegion()` for screen reader announcements during flow transitions

### Constants
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for timing flow announcements
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` for smooth focus transitions
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for flow animation optimization

## Usage Patterns Specific to Vision Flow Section

### Workflow Diagram Visualization
Uses `BRAND_COLORS.SOFT_TEAL_GLOW` for flow connection lines and `BRAND_COLORS.ACCENT_GREEN` for active workflow steps with consistent brand presentation.

### Interactive Flow Navigation
Leverages keyboard navigation utilities and focus management for step-by-step workflow exploration, ensuring full accessibility compliance.

### Minimalist Icon Integration
Integrates with InteractiveButtonEffect requiring lattice-motif design patterns and line-based iconography consistent with brand standards.

### Progressive Flow Revelation
Uses semantic component interfaces to present workflow progression from business intent to working product with proper content hierarchy and scroll-tied animation.


