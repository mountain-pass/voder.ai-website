# Typing Animation Effect's Needs from @voder/shared

## 🎯 **Purpose**

This document outlines the specific interfaces, types, and utilities that the Typing Animation Effect package requires from `@voder/shared`.

## 🧩 **Required Shared Interfaces**

### **Base Effect Interface**
- `IEffectComponent` with `initialize()`, `destroy()`, `resize()`, `setVisibility()` methods
- `EffectConfiguration` extending ComponentConfiguration for effect setup
- `EffectServices` for service injection (animation, accessibility, performance)
- `EffectAccessibilityConfig` for accessibility compliance

### **Component Foundation**
- `IComponent` base interface with `id` and `getState()`
- `IConfigurableComponent<TConfig>` for typing configuration management
- `IEventEmittingComponent` for animation event dispatch
- `ComponentConfiguration` with `id`, `debug`, `containerId`, `accessibility`

### **Error Handling**
- `ComponentError` class for typing animation errors
- `ValidationError` class for configuration validation

### **Validation Utilities**
- `validateRequired<T>()` for required field validation
- `validateString()` with pattern/length validation for text content
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config

### **Brand Constants**
- `BRAND_COLORS.PAPER_WHITE` for text color (#FFFFFF)
- `BRAND_COLORS.SOFT_TEAL_GLOW` for cursor color (#24D1D5)
- `BRAND_TYPOGRAPHY.FONT_FAMILY_DISPLAY` for heading text (Inter/Satoshi)
- `BRAND_TYPOGRAPHY.FONT_FAMILY_BODY` for body text (Inter)

### **Performance Constants**
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps typing
- `PERFORMANCE_THRESHOLDS.DEFAULT_TIMEOUT` for animation timeouts

### **Accessibility Constants**
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for text announcements
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` for smooth transitions

## 📝 **Package-Specific Implementation**

The Typing Animation Effect package will define its own:
- `TypingAnimationComponent` class implementing `IEffectComponent`
- `TypingAnimationConfig`, `CursorConfiguration`, `TypingAccessibilityConfig` interfaces
- `TypingSpeed`, `TypingMode` types for animation control
- Text processing, character-by-character rendering, and cursor animation utilities
- Performance optimization for smooth typing animations

This ensures the package extends shared interfaces while implementing typing-specific functionality internally.

function validateCursorConfig(config: unknown): CursorConfiguration {
  // Validates cursor configuration object
  // Ensures blink speed is positive number
  // Validates cursor style enum
}
```

### **Animation State Management**
```typescript
// State management utilities for animation control
function createAnimationStateManager<T>(): {
  setState(state: T): void;
  getState(): T;
  onStateChange(callback: (state: T) => void): () => void;
}

// Animation lifecycle state tracking
type AnimationState = 'ready' | 'typing' | 'paused' | 'complete' | 'error';
```

### **Performance Optimization Utilities**
```typescript
// Utilities for maintaining animation performance
function createFrameRateThrottle(targetFPS: number): {
  throttle<T extends (...args: any[]) => any>(fn: T): T;
  getCurrentFPS(): number;
}

function createDOMUpdateBatcher(): {
  batchUpdate(fn: () => void): void;
  flush(): void;
}
```

## 📊 **Required Constants**

### **Animation Performance Thresholds**
```typescript
// Performance constants for typing animations
export const TYPING_PERFORMANCE = {
  MIN_FPS: 30,
  MAX_CHARACTERS_PER_FRAME: 3,
  CURSOR_BLINK_INTERVAL: 500,
  SCROLL_SYNC_THROTTLE: 16, // 60fps
} as const;
```

### **Accessibility Constants**
```typescript
// ARIA constants for typing animations
export const TYPING_ARIA = {
  ANIMATION_REGION: 'Text animation',
  PROGRESS_LIVE: 'polite',
  COMPLETE_ANNOUNCEMENT: 'Text animation complete',
  KEYBOARD_INSTRUCTIONS: 'Press space to pause, escape to stop',
} as const;
```

### **Brand Typography Constants**
```typescript
// Typography constants for brand compliance
export const TYPING_TYPOGRAPHY = {
  HEADING_FONT: 'Satoshi, Inter, sans-serif',
  BODY_FONT: 'Inter, sans-serif', 
  CODE_FONT: 'JetBrains Mono, monospace',
  BRAND_SPEEDS: {
    INTRO: 80,    // ms per character
    BODY: 40,     // ms per character  
    EMPHASIS: 20, // ms per character
  },
} as const;
```

## 🚨 **Error Handling**

### **Typing Animation Errors**
```typescript
// Specialized error classes for typing animations
class TypingAnimationError extends ComponentError {
  constructor(
    message: string, 
    public readonly context: TypingErrorContext
  ) {
    super(message, 'TypingAnimationEffect');
  }
}

interface TypingErrorContext {
  readonly characterIndex?: number;
  readonly content?: string;
  readonly animationState?: AnimationState;
}
```

## 🧪 **Testing Support**

### **Test Utilities**
```typescript
// Testing utilities for typing animations
function createMockTypingConfig(overrides?: Partial<TypingAnimationConfig>): TypingAnimationConfig;

function createTypingAnimationTestHarness(): {
  simulateTyping(content: string, speed: TypingSpeed): Promise<void>;
  simulateScrollProgress(progress: number): void;
  verifyCharacterVisibility(index: number): boolean;
}
```

### **Performance Test Utilities**
```typescript
// Performance testing for animation efficiency
function measureTypingPerformance(config: TypingAnimationConfig): Promise<{
  averageFPS: number;
  characterRenderTime: number;
  memoryUsage: number;
}>;
```

## 💡 **Usage Context**

The Typing Animation Effect requires these shared utilities to:

1. **Animation Control**: Manage complex typing states and lifecycle
2. **Performance Optimization**: Maintain smooth animation performance with frame rate monitoring
3. **Accessibility Integration**: Provide screen reader support and keyboard controls
4. **Brand Compliance**: Apply consistent typography and timing that reflects Voder's calm confidence
5. **Error Recovery**: Handle animation failures gracefully with context-aware error reporting
6. **Testing Support**: Enable comprehensive testing of animation behavior and performance

These dependencies ensure the typing animation integrates seamlessly with the overall Voder component architecture while maintaining high performance and accessibility standards.
