# Brand Entry Section - Shared Package Dependencies

## Purpose

This file documents what the Brand Entry Section package needs from `@voder/shared` and how it intends to use those shared utilities.

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
- `BRAND_COLORS` for consistent Voder color palette (VODER_BLACK, SOFT_TEAL_GLOW, etc.)
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

## How Brand Entry Section Uses @voder/shared

### Section Component Implementation
The Brand Entry Section implements the `ISectionComponent` interface for its cinematic intro sequence:
- Uses `SectionServices` for dependency injection of animation, accessibility, assets, and scroll services
- Uses `SectionConfiguration` with custom `ScrollTriggerConfiguration` for scroll-tied behavior
- Uses `EffectConfiguration` to manage 3D effects and particle systems
- Implements `render()`, `updateScrollProgress()`, and `cleanup()` methods

### Animation Timeline Management
Leverages shared animation interfaces for complex intro sequence:
- Uses `IAnimationTimeline` to coordinate multiple GSAP timelines (ignition, logo reveal, atmosphere)
- Uses `TimelineConfiguration` for intro timing, pause/play controls, and sequence coordination
- Ensures 60fps performance with shared performance constants

### Brand Consistency
Uses shared brand constants for visual consistency:
- Uses `BRAND_COLORS.VODER_BLACK` for background, `BRAND_COLORS.SOFT_TEAL_GLOW` for accents
- Uses `BRAND_TYPOGRAPHY.FONT_FAMILY_DISPLAY` for logo text, ensuring consistent typography
- Maintains brand standards across all visual elements

### Accessibility Integration
Leverages shared accessibility utilities for inclusive experience:
- Uses `createAriaLiveRegion()` to announce intro progress to screen readers
- Uses `findFocusableElements()` to implement skip-intro functionality
- Uses `ACCESSIBILITY_CONSTANTS` for timing screen reader announcements properly

### Component Lifecycle Management
Uses shared component patterns for reliable operation:
- Extends `IComponent` with proper state management through `ComponentState`
- Uses `ComponentConfiguration` for customizable intro timing and visual settings
- Uses shared error classes (`ComponentError`, `ValidationError`) for consistent error reporting

## Package-Specific Implementation

The Brand Entry Section will define its own specific interfaces that extend the shared foundations:
- `BrandEntrySectionConfig` extending `SectionConfiguration` for intro timing, colors, and effect settings
- `IntroSequencePhase` enum for tracking intro progress (preload, ignition, logo reveal, atmosphere, stillness)
- `WebGLCapabilities` interface for 3D rendering feature detection

This approach keeps @voder/shared focused on truly shared foundations while allowing section-specific customization that builds upon the shared interfaces.
