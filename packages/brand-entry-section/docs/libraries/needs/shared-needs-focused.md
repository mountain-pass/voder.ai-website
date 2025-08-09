# Brand Entry Section - Shared Package Dependencies

## Purpose

This file documents what the Brand Entry Section package needs from `@voder/shared`. The Brand Entry Section creates the immersive brand introduction experience.

## Required Interfaces from @voder/shared

### Component Lifecycle
```typescript
interface Component {
  mount(container: HTMLElement): Promise<void>;
  unmount(): Promise<void>;
  update(props: any): Promise<void>;
  destroy(): void;
}

interface ComponentConfig {
  id: string;
  className?: string;
  accessibilityLabel?: string;
}
```

### Animation Configuration
```typescript
interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  stagger?: number;
}

interface Timeline {
  add(animation: AnimationConfig, position?: string | number): void;
  play(): void;
  pause(): void;
  reverse(): void;
}
```

### Accessibility Types
```typescript
interface AccessibilityConfig {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  focusable: boolean;
  announceChanges?: boolean;
}

interface MotionPreference {
  respectReducedMotion: boolean;
  fallbackAnimation?: AnimationConfig;
}
```

### Basic Utilities
```typescript
interface DOMUtils {
  createElement(tag: string, attributes?: Record<string, string>): HTMLElement;
  addClass(element: HTMLElement, className: string): void;
  removeClass(element: HTMLElement, className: string): void;
}

interface EventUtils {
  addEventListener(element: HTMLElement, event: string, handler: Function): void;
  removeEventListener(element: HTMLElement, event: string, handler: Function): void;
}
```

### Constants
```typescript
interface BrandConstants {
  ANIMATION_DURATIONS: {
    LOGO_REVEAL: number;
    OBJECT_ROTATION: number;
    ATMOSPHERE_FILL: number;
  };
  TIMING: {
    PRELOAD_DURATION: number;
    IGNITION_START: number;
    LOGO_REVEAL_START: number;
  };
}
```

### Error Types
```typescript
interface ComponentError extends Error {
  component: string;
  action: string;
  details?: any;
}

interface AnimationError extends Error {
  animationType: string;
  target?: HTMLElement;
}
```

## Implementation Notes

The Brand Entry Section will use these shared interfaces to create:
- Component lifecycle management during brand introduction
- 3D object animations with accessibility fallbacks
- Logo reveal timeline coordination
- Motion preference handling
- Standard error handling for brand entry failures
