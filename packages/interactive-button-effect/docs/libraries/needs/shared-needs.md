# Interactive Button Effect's Needs from @voder/shared

## 🎯 **Purpose**

This document outlines the specific interfaces, types, and utilities that the Interactive Button Effect package requires from `@voder/shared`.

## 🧩 **Required Shared Interfaces**

### **Base Effect Interface**
- `IEffectComponent` with `initialize()`, `destroy()`, `resize()`, `setVisibility()` methods
- `EffectConfiguration` extending ComponentConfiguration for effect setup
- `EffectServices` for service injection (animation, accessibility, performance)
- `EffectAccessibilityConfig` for accessibility compliance

### **Component Foundation**
- `IComponent` base interface with `id` and `getState()`
- `IConfigurableComponent<TConfig>` for button configuration management
- `IEventEmittingComponent` for button interaction event dispatch
- `ComponentConfiguration` with `id`, `debug`, `containerId`, `accessibility`

### **Error Handling**
- `ComponentError` class for button effect errors
- `ValidationError` class for configuration validation

### **Validation Utilities**
- `validateRequired<T>()` for required field validation
- `validateString()` with pattern validation for button variants
- `validateNumber()` with min/max validation for animation parameters
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config

### **Brand Constants**
- `BRAND_COLORS.SOFT_TEAL_GLOW` for primary button color (#24D1D5)
- `BRAND_COLORS.ACCENT_GREEN` for success button color (#9AEF00)
- `BRAND_COLORS.PAPER_WHITE` for button text (#FFFFFF)
- `BRAND_COLORS.COOL_GREY` for secondary button color (#C6CBD4)
- `BRAND_TYPOGRAPHY.FONT_FAMILY_BODY` for button text (Inter)

### **Accessibility Constants**
- `ACCESSIBILITY_CONSTANTS.MIN_TOUCH_TARGET_SIZE` (44px minimum)
- `ACCESSIBILITY_CONSTANTS.FOCUS_TRANSITION_DURATION` for smooth focus
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for state announcements

### **Performance Constants**
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps animations
- `PERFORMANCE_THRESHOLDS.DEFAULT_TIMEOUT` for animation timeouts

## 📝 **Package-Specific Implementation**

The Interactive Button Effect package will define its own:
- `InteractiveButtonComponent` class implementing `IEffectComponent`
- `ButtonConfig`, `ButtonAnimationConfig`, `HoverConfig`, `ClickConfig` interfaces
- `ButtonVariant`, `ButtonSize`, `ButtonState` types for button states
- Button state management, hover/click animations, and accessibility utilities
- Ripple effects, haptic feedback integration, and performance optimization

This ensures the package extends shared interfaces while implementing button-specific functionality internally.
}

interface ColorTransitionConfig {
  readonly from: string;
  readonly to: string;
  readonly textColor?: string;
  readonly originalTextColor?: string;
}

interface TransformConfiguration {
  readonly translateX?: number;
  readonly translateY?: number;
  readonly rotate?: number;
  readonly skew?: number;
}

interface RippleConfiguration {
  readonly enabled: boolean;
  readonly color: string;
  readonly opacity: number;
  readonly duration: number;
  readonly maxSize?: number;
}

interface FeedbackConfiguration {
  readonly haptic?: boolean;
  readonly audio?: AudioFeedbackConfig;
  readonly visual?: VisualFeedbackConfig;
}

interface TouchConfiguration {
  readonly minimumSize: number;
  readonly touchDelay: number;
  readonly gestureSupport: boolean;
}
```

### **Interaction Event Types**
```typescript
// Extends base event types for button interactions
interface ButtonInteractionEvent extends ComponentEvent {
  readonly buttonId: string;
  readonly state: ButtonState;
  readonly variant: ButtonVariant;
  readonly interactionType: 'click' | 'hover' | 'focus' | 'touch';
  readonly coordinates?: { x: number; y: number };
}

interface ButtonPerformanceEvent extends PerformanceEvent {
  readonly operation: 'state-transition' | 'animation-render' | 'ripple-effect' | 'event-handling';
  readonly buttonCount?: number;
  readonly animationDuration?: number;
  readonly frameRate?: number;
}
```

## 🛠️ **Required Utilities**

### **State Management Utilities**
```typescript
// Button state management and transitions
function createButtonStateManager(): {
  setState(element: HTMLElement, state: ButtonState): void;
  getState(element: HTMLElement): ButtonState;
  canTransition(from: ButtonState, to: ButtonState): boolean;
  getValidTransitions(state: ButtonState): ButtonState[];
}

function validateButtonState(state: unknown): ButtonState {
  // Validates button state is valid enum value
  // Provides fallback for invalid states
  // Ensures state consistency
}

function createStateTransitionValidator(): {
  isValidTransition(from: ButtonState, to: ButtonState): boolean;
  getTransitionPath(from: ButtonState, to: ButtonState): ButtonState[];
}
```

### **DOM Element Validation**
```typescript
// Button-specific DOM validation utilities
function validateButtonElement(element: unknown): HTMLElement {
  // Validates element is suitable for button effects
  // Ensures element supports required event listeners
  // Checks element is in DOM and visible
}

function validateTouchTarget(element: HTMLElement): TouchTargetValidation {
  // Validates element meets minimum touch target requirements
  // Checks for WCAG AA compliance (44px minimum)
  // Returns size adjustments if needed
}

interface TouchTargetValidation {
  readonly isValid: boolean;
  readonly currentSize: { width: number; height: number };
  readonly requiredSize: { width: number; height: number };
  readonly adjustments?: { minWidth: string; minHeight: string };
}

function setupButtonAccessibility(element: HTMLElement, config: ButtonAccessibilityConfig): void {
  // Applies accessibility attributes and behaviors
  // Sets up ARIA labels and roles
  // Configures keyboard navigation
}
```

### **Animation Optimization Utilities**
```typescript
// Performance utilities for smooth button animations
function createAnimationOptimizer(): {
  optimizeForPerformance(element: HTMLElement): void;
  setWillChange(element: HTMLElement, properties: string[]): void;
  cleanupAnimation(element: HTMLElement): void;
  monitorFrameRate(): number;
}

function createGpuAcceleratedAnimator(): {
  animateTransform(element: HTMLElement, config: TransformConfiguration): Promise<void>;
  animateOpacity(element: HTMLElement, from: number, to: number): Promise<void>;
  createRippleEffect(element: HTMLElement, coordinates: { x: number; y: number }): Promise<void>;
}

function createEventThrottler(fps: number = 60): {
  throttle<T extends (...args: any[]) => any>(fn: T): T;
  debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T;
}
```

### **Color and Style Utilities**
```typescript
// Brand-compliant color utilities for button styling
function getBrandButtonColors(): ButtonColorPalette {
  // Returns brand-compliant color palette for buttons
  // Includes all button variants and states
  // Ensures sufficient contrast ratios
}

interface ButtonColorPalette {
  readonly primary: ButtonColorConfig;
  readonly secondary: ButtonColorConfig;
  readonly ghost: ButtonColorConfig;
  readonly danger: ButtonColorConfig;
  readonly success: ButtonColorConfig;
}

interface ButtonColorConfig {
  readonly background: string;
  readonly foreground: string;
  readonly border: string;
  readonly hover: ColorStateConfig;
  readonly active: ColorStateConfig;
  readonly focus: ColorStateConfig;
  readonly disabled: ColorStateConfig;
}

function calculateColorTransition(from: string, to: string, progress: number): string {
  // Calculates intermediate color for smooth transitions
  // Supports RGB, HSL, and hex color formats
  // Optimized for animation performance
}

function ensureColorContrast(foreground: string, background: string, minRatio: number = 4.5): string {
  // Ensures color combination meets WCAG contrast requirements
  // Adjusts colors automatically if needed
  // Returns accessible color combination
}
```

## 📊 **Required Constants**

### **Button Performance Thresholds**
```typescript
// Performance constants for button interactions
export const BUTTON_PERFORMANCE = {
  MIN_FPS: 60,
  MAX_SIMULTANEOUS_ANIMATIONS: 10,
  ANIMATION_DURATION_LIMITS: {
    MIN: 100, // milliseconds
    MAX: 1000, // milliseconds
    DEFAULT: 300
  },
  RIPPLE_MAX_SIZE: 300, // pixels
  TOUCH_DELAY: 100, // milliseconds for touch disambiguation
} as const;
```

### **Accessibility Constants**
```typescript
// WCAG-compliant constants for button accessibility
export const BUTTON_ACCESSIBILITY = {
  MIN_TOUCH_TARGET: 44, // pixels (WCAG AA)
  MIN_CONTRAST_RATIO: 4.5, // WCAG AA
  FOCUS_OUTLINE_WIDTH: 2, // pixels
  FOCUS_OUTLINE_OFFSET: 2, // pixels
  KEYBOARD_REPEAT_DELAY: 500, // milliseconds
  STATE_ANNOUNCEMENT_DEBOUNCE: 200, // milliseconds
} as const;
```

### **Brand-Specific Button Constants**
```typescript
// Brand-compliant button styling constants
export const BUTTON_BRAND = {
  VARIANTS: {
    PRIMARY: {
      BACKGROUND: '#24D1D5', // Soft Teal Glow
      FOREGROUND: '#0A0A0A', // Voder Black
      GLOW_COLOR: '#24D1D5',
    },
    SECONDARY: {
      BACKGROUND: 'transparent',
      FOREGROUND: '#24D1D5',
      BORDER: '#24D1D5',
    },
    GHOST: {
      BACKGROUND: 'transparent',
      FOREGROUND: '#C6CBD4', // Cool Grey
      HOVER_BACKGROUND: '#0F1A2E', // Deep Navy
    },
  },
  TYPOGRAPHY: {
    SMALL: { fontSize: '14px', fontWeight: '500', fontFamily: 'Inter, sans-serif' },
    MEDIUM: { fontSize: '16px', fontWeight: '500', fontFamily: 'Inter, sans-serif' },
    LARGE: { fontSize: '18px', fontWeight: '600', fontFamily: 'Satoshi, Inter, sans-serif' },
    XLARGE: { fontSize: '20px', fontWeight: '600', fontFamily: 'Satoshi, Inter, sans-serif' },
  },
  ANIMATIONS: {
    CALM_DURATION: 300, // milliseconds - reflects calm confidence
    QUICK_FEEDBACK: 150, // milliseconds - for immediate responses
    GLOW_INTENSITY: 0.3, // opacity for brand glow effects
  },
} as const;
```

### **Event and State Constants**
```typescript
// Button interaction and state constants
export const BUTTON_EVENTS = {
  STATE_CHANGE: 'button:state-change',
  CLICK: 'button:click',
  HOVER_START: 'button:hover-start',
  HOVER_END: 'button:hover-end',
  FOCUS_GAINED: 'button:focus-gained',
  FOCUS_LOST: 'button:focus-lost',
  ANIMATION_START: 'button:animation-start',
  ANIMATION_END: 'button:animation-end',
} as const;

export const BUTTON_STATES = {
  NORMAL: 'normal',
  HOVER: 'hover',
  ACTIVE: 'active',
  FOCUS: 'focus',
  DISABLED: 'disabled',
  LOADING: 'loading',
} as const;
```

## 🚨 **Error Handling**

### **Button Effect Errors**
```typescript
// Specialized error classes for button interactions
class ButtonEffectError extends ComponentError {
  constructor(
    message: string,
    public readonly context: ButtonErrorContext
  ) {
    super(message, 'InteractiveButtonEffect');
  }
}

interface ButtonErrorContext {
  readonly buttonId?: string;
  readonly currentState?: ButtonState;
  readonly targetState?: ButtonState;
  readonly animationPhase?: string;
  readonly performanceMetrics?: ButtonPerformanceMetrics;
}

interface ButtonPerformanceMetrics {
  readonly animationCount: number;
  readonly frameRate: number;
  readonly memoryUsage: number;
  readonly eventQueueSize: number;
}
```

## 🧪 **Testing Support**

### **Test Utilities**
```typescript
// Testing utilities for button interactions
function createMockButtonConfig(overrides?: Partial<ButtonEffectConfig>): ButtonEffectConfig;

function createButtonTestHarness(): {
  simulateClick(element: HTMLElement): Promise<void>;
  simulateHover(element: HTMLElement, isHovering: boolean): void;
  simulateKeypress(element: HTMLElement, key: string): void;
  simulateTouch(element: HTMLElement, coordinates?: { x: number; y: number }): void;
  verifyAccessibility(element: HTMLElement): AccessibilityReport;
}

interface AccessibilityReport {
  readonly hasRole: boolean;
  readonly hasAriaLabel: boolean;
  readonly meetsTouchTarget: boolean;
  readonly hasKeyboardSupport: boolean;
  readonly meetsContrastRatio: boolean;
}
```

### **Performance Test Utilities**
```typescript
// Performance testing for button interactions
function measureButtonPerformance(buttons: HTMLElement[]): Promise<{
  averageFPS: number;
  interactionLatency: number;
  memoryUsage: number;
  animationEfficiency: number;
}>;

function createButtonLoadTest(): {
  addButtons(count: number): HTMLElement[];
  simulateInteractions(intensity: 'low' | 'medium' | 'high'): Promise<void>;
  measurePerformance(): ButtonPerformanceReport;
}
```

## 💡 **Usage Context**

The Interactive Button Effect requires these shared utilities to:

1. **State Management**: Handle complex button state transitions with validation and consistency checks
2. **Performance Optimization**: Maintain smooth 60fps interactions with GPU-accelerated animations and efficient event handling
3. **Accessibility Integration**: Provide full keyboard navigation, ARIA support, and WCAG-compliant touch targets
4. **Brand Compliance**: Apply consistent Voder colors, typography, and animation timing across all button variants
5. **Event Management**: Coordinate complex interaction events with proper throttling and delegation
6. **Error Recovery**: Handle animation failures and state inconsistencies gracefully with context-aware error reporting
7. **Testing Support**: Enable comprehensive testing of interactions, accessibility, and performance characteristics

These dependencies ensure the interactive button effect integrates seamlessly with the overall Voder component architecture while delivering engaging, accessible, and performant user interactions that enhance the website's interactive experience.
