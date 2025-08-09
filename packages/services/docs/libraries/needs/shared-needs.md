# Services Package - Shared Package Dependencies

## Purpose

This file documents what the Services package needs from `@voder/shared`. The Services package implements AnimationService, ScrollService, AccessibilityService, and AssetService.

## Required Interfaces from @voder/shared

### Base Service Interface
- `IService` with name, version, initialize(), shutdown(), getHealth()
- `ServiceHealth` interface with status, lastCheck, details
- `IConfigurableService<T>` for services with updateable configuration

### Base Configuration Types
- `ServiceConfiguration` with id, debug, priority, timeout
- Configuration validation functions

### Error Types
- `ServiceError` class for service-specific errors
- `ConfigurationError` class for invalid configurations  
- `ValidationError` class for validation failures

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateString()` with options for string validation
- `validateNumber()` with min/max/integer options
- `validateServiceConfiguration()` for service config validation

### Essential Constants
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` (16ms for 60fps)
- `PERFORMANCE_THRESHOLDS.DEFAULT_TIMEOUT` (5000ms)
- Performance monitoring types and utilities

## Implementation Notes

The Services package will:
- Implement AnimationService, ScrollService, AccessibilityService, AssetService extending IService
- Define its own GSAP-specific interfaces (ScrollTriggerConfig, AnimationCommand, etc.)
- Handle service-specific configuration and error handling
- Use shared validation utilities to prevent code duplication
- Implement callback-based coordination without complex event systems
