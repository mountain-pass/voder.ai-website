# Navigation Package - Shared Package Dependencies

## Purpose

This file documents what the Navigation package needs from `@voder/shared`. The Navigation package implements a skip-to-content accessibility component without visible navigation menu.

## Required Interfaces from @voder/shared

### Base Component Interface
- `IComponent` with id, getState() method
- `ComponentState` type with created/initializing/ready/error/shutdown states
- `IConfigurableComponent<T>` for components with updateable configuration

### Base Configuration Types
- `ComponentConfiguration` with id, debug, containerId, accessibility
- `AccessibilityConfiguration` with ariaLabel, announceChanges
- Configuration validation functions

### Error Types
- `ComponentError` class with componentId, operation, and originalError
- `ValidationError` class for validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateString()` with pattern/length validation
- `validateComponentConfiguration()` for component config validation
- `validateAccessibilityConfiguration()` for accessibility config validation

### Accessibility Constants
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` (150ms)
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` (150ms)
- `ACCESSIBILITY_CONSTANTS.MIN_TOUCH_TARGET_SIZE` (44px)
- `ARIA_LIVE` constants (polite, assertive)

### DOM Utilities
- `findFocusableElements()` for finding focusable elements in container
- `isElementVisible()` for checking element visibility
- `createAriaLiveRegion()` for creating screen reader announcement regions
- Basic DOM manipulation utilities

## Implementation Notes

The Navigation package will:
- Define its own ISkipToContentComponent interface and implementation
- Create skip-link specific configuration types (SkipLinkConfiguration, KeyboardNavigationConfiguration)
- Handle screen reader announcements and keyboard navigation
- Use shared base interfaces and validation utilities for consistency
- Focus on accessibility without visible navigation menu
- Implement accessibility features without disrupting the cinematic narrative flow
