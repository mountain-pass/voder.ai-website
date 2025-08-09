# Core Package - Shared Package Dependencies

## Purpose

This file documents what the Core package needs from `@voder/shared`. The Core package implements PageRenderer for component coordination and ServiceContainer for dependency injection.

## Required Interfaces from @voder/shared

### Base Component Interface
- `IComponent` with id, getState() method
- `ComponentState` type with created/initializing/ready/error/shutdown states
- `IConfigurableComponent<T>` for components with updateable configuration

### Base Configuration Types
- `ComponentConfiguration` with id, debug, containerId
- `ServiceConfiguration` with id, debug, priority, timeout
- Configuration validation functions

### Error Types
- `ComponentError` class with componentId, operation, and originalError
- `ServiceError` class for service-related errors
- `ConfigurationError` and `ValidationError` classes

### Validation Utilities
- `validateRequired<T>()` for required field validation
- `validateString()` and `validateNumber()` with options
- `validateComponentConfiguration()` for component config validation
- `validateServiceConfiguration()` for service config validation

### Performance Monitoring
- `PerformanceMetrics` interface with operation, duration, timestamp
- `measurePerformance<T>()` function for timing operations
- Performance threshold constants

### Essential Constants
- `PERFORMANCE_THRESHOLDS.DEFAULT_TIMEOUT` (5000ms)
- `PERFORMANCE_THRESHOLDS.MAX_INITIALIZATION_TIME` (10000ms)
- Component and service lifecycle constants

## Implementation Notes

The Core package will:
- Implement PageRenderer for pure component coordination (no DOM manipulation)
- Implement ServiceContainer with constructor injection pattern
- Define component-specific interfaces (INavigationComponent, IContentComponent, IEffectManager)
- Handle component lifecycle and service management
- Use shared error classes and validation utilities for consistency
- Define its own INavigationComponent, IContentComponent, IEffectManager interfaces (these are contracts FOR other packages)
- Implement ServiceContainer and PageRenderer classes
- Define its own render result types and coordination patterns  
- Use shared base interfaces and validation utilities to ensure consistency
- Handle component lifecycle and error boundaries using shared error types
