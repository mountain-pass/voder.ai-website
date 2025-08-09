# Services Package - Shared Package Dependencies

## Purpose

This file documents what the Services package needs from `@voder/shared`. The Services package provides AnimationService, AccessibilityService, ScrollService, and AssetService.

## Required Interfaces from @voder/shared

### Base Service Interface
```typescript
interface Service {
  initialize(config?: ServiceConfig): Promise<void>;
  destroy(): Promise<void>;
  isInitialized(): boolean;
}

interface ServiceConfig {
  enableDebugMode?: boolean;
  performanceMode?: 'high' | 'balanced' | 'low';
}
```

### Animation Configuration
```typescript
interface ScrollTriggerConfig {
  trigger: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

interface TimelineConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
}
```

### Event System
```typescript
interface EventBus {
  emit(event: string, data?: any): void;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
}
```

## Required Utilities from @voder/shared

### Performance Monitoring
```typescript
function measurePerformance(label: string, fn: () => void): number;
function throttle(fn: Function, delay: number): Function;
function debounce(fn: Function, delay: number): Function;
```

### Accessibility Helpers
```typescript
function announceToScreenReader(message: string): void;
function manageTabOrder(elements: HTMLElement[]): void;
function respectsReducedMotion(): boolean;
```

## Required Constants from @voder/shared

```typescript
const PERFORMANCE_BUDGETS = {
  ANIMATION_FRAME_MS: 16.67,
  SCROLL_THROTTLE_MS: 16,
  RESIZE_DEBOUNCE_MS: 250,
} as const;

const ACCESSIBILITY_SETTINGS = {
  FOCUS_OUTLINE_COLOR: '#24D1D5',
  FOCUS_OUTLINE_WIDTH: '2px',
  SKIP_LINK_POSITION: { top: '-40px', left: '8px' },
} as const;
```

## Required Error Types from @voder/shared

```typescript
class ServiceError extends Error {
  constructor(serviceName: string, message: string) {
    super(`Service '${serviceName}': ${message}`);
    this.name = 'ServiceError';
  }
}
```
