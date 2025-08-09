# Particle System Effect's Needs from @voder/shared

## 🎯 **Purpose**

This document outlines the specific interfaces, types, and utilities that the Particle System Effect package requires from `@voder/shared`.

## 🧩 **Required Shared Interfaces**

### **Base Effect Interface**
- `IEffectComponent` with `initialize()`, `destroy()`, `resize()`, `setVisibility()` methods
- `EffectConfiguration` extending ComponentConfiguration for effect setup
- `EffectServices` for service injection (animation, accessibility, performance)
- `EffectAccessibilityConfig` for accessibility compliance
- `EffectPerformanceConfig` for performance settings (targetFPS, GPU acceleration)

### **Component Foundation**
- `IComponent` base interface with `id` and `getState()`
- `IConfigurableComponent<TConfig>` for particle system configuration management
- `IEventEmittingComponent` for particle event dispatch
- `ComponentConfiguration` with `id`, `debug`, `containerId`, `accessibility`

### **Error Handling**
- `ComponentError` class for particle system errors
- `ValidationError` class for configuration validation

### **Validation Utilities**
- `validateRequired<T>()` for required field validation
- `validateNumber()` with min/max validation for particle parameters
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config

### **Brand Constants**
- `BRAND_COLORS.SOFT_TEAL_GLOW` for primary particle color (#24D1D5)
- `BRAND_COLORS.ACCENT_GREEN` for interaction highlights (#9AEF00)
- `BRAND_COLORS.COOL_GREY` for secondary particles (#C6CBD4)
- `BRAND_COLORS.VODER_BLACK` for background (#0A0A0A)

### **Performance Constants**
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps particle rendering
- `PERFORMANCE_THRESHOLDS.MAX_RENDER_DISTANCE` for particle culling

### **Accessibility Constants**
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for effect announcements
- Reduced motion particle count limits for motion-sensitive users

## 📝 **Package-Specific Implementation**

The Particle System Effect package will define its own:
- `ParticleSystemComponent` class implementing `IEffectComponent`
- `ParticleSystemConfig`, `ParticleBehaviorConfig`, `ParticleAppearanceConfig` interfaces
- `Vector2`, `PhysicsConfig`, `EmitterConfig` types for particle physics
- Particle lifecycle management, physics simulation, and rendering utilities
- Performance optimization for efficient particle system rendering

This ensures the package extends shared interfaces while implementing particle-specific functionality internally.

interface SizeConfiguration {
  readonly min: number;
  readonly max: number;
  readonly variance?: number;
}

interface ColorConfiguration {
  readonly type: 'single' | 'gradient' | 'random';
  readonly colors: string[];
  readonly transitions?: ColorTransition[];
}

interface OpacityConfiguration {
  readonly min: number;
  readonly max: number;
  readonly fadeType?: 'linear' | 'ease-in' | 'ease-out';
}
```

### **Performance Event Types**
```typescript
// Extends base PerformanceEvent for particle-specific metrics
interface ParticlePerformanceEvent extends PerformanceEvent {
  readonly operation: 'particle-update' | 'particle-render' | 'emission' | 'physics-calculation';
  readonly particleCount?: number;
  readonly frameRate?: number;
  readonly memoryUsage?: number;
}
```

## 🛠️ **Required Utilities**

### **Mathematical Utilities**
```typescript
// Mathematical utilities for particle physics
function createVector2(x: number, y: number): Vector2 {
  // Creates immutable vector instance
  // Provides vector math operations
}

function clamp(value: number, min: number, max: number): number {
  // Clamps value between min and max bounds
  // Used for particle properties and physics constraints
}

function lerp(start: number, end: number, factor: number): number {
  // Linear interpolation between two values
  // Used for particle property transitions
}

function randomInRange(min: number, max: number): number {
  // Generates random number within specified range
  // Used for particle property variation
}

function degreesToRadians(degrees: number): number {
  // Converts degrees to radians for particle angles
}
```

### **Canvas Validation and Setup**
```typescript
// Canvas-specific validation utilities
function validateCanvas(canvas: unknown): HTMLCanvasElement {
  // Validates canvas element is proper HTMLCanvasElement
  // Ensures 2D context is available
  // Validates canvas dimensions are positive
}

function validateCanvasContext(context: unknown): CanvasRenderingContext2D {
  // Validates 2D rendering context
  // Checks for required canvas API support
}

function setupCanvasForParticles(canvas: HTMLCanvasElement): CanvasConfiguration {
  // Optimizes canvas for particle rendering
  // Sets appropriate alpha and image smoothing settings
  // Returns configuration object
}
```

### **Performance Optimization Utilities**
```typescript
// Utilities for particle system performance
function createObjectPool<T>(
  factory: () => T,
  reset: (item: T) => void,
  initialSize: number
): ObjectPool<T> {
  // Creates reusable object pool for particles
  // Manages allocation and deallocation
  // Reduces garbage collection pressure
}

function createFrameRateMonitor(): {
  update(): void;
  getCurrentFPS(): number;
  getAverageFPS(): number;
} {
  // Monitors frame rate for performance adaptation
  // Provides rolling average calculations
}

function createBoundingBoxCuller(bounds: BoundingBox): {
  isVisible(position: Vector2, size: number): boolean;
} {
  // Frustum culling for off-screen particles
  // Optimizes rendering performance
}
```

### **Animation State Management**
```typescript
// State management for complex particle animations
function createParticleStateManager(): {
  setState(state: ParticleSystemState): void;
  getState(): ParticleSystemState;
  transition(fromState: ParticleSystemState, toState: ParticleSystemState): Promise<void>;
}

type ParticleSystemState = 'inactive' | 'initializing' | 'active' | 'paused' | 'stopping' | 'error';
```

## 📊 **Required Constants**

### **Particle Performance Thresholds**
```typescript
// Performance constants for particle systems
export const PARTICLE_PERFORMANCE = {
  MIN_FPS: 30,
  MAX_PARTICLES_HIGH_QUALITY: 500,
  MAX_PARTICLES_MEDIUM_QUALITY: 200,
  MAX_PARTICLES_LOW_QUALITY: 50,
  EMISSION_RATE_THROTTLE_THRESHOLD: 25, // FPS threshold for emission reduction
  PHYSICS_UPDATE_INTERVAL: 16.67, // 60fps in milliseconds
} as const;
```

### **Brand-Specific Particle Constants**
```typescript
// Brand-compliant particle styling constants
export const PARTICLE_BRAND = {
  COLORS: {
    CHAOS: ['#C6CBD4', '#0F1A2E'], // Cool Grey, Deep Navy for problem representation
    AMBIENT: ['#24D1D5', '#FFFFFF'], // Soft Teal Glow, Paper White for atmosphere
    FLOW: ['#24D1D5', '#9AEF00'], // Soft Teal Glow, Accent Green for data flow
    EMPHASIS: ['#9AEF00'], // Accent Green for highlights
  },
  GLOW_EFFECTS: {
    SOFT_TEAL: '#24D1D5',
    BLUR_RADIUS: 10,
    ALPHA: 0.6,
  },
  TIMING: {
    CALM_EMISSION: 2, // particles per second for calm confidence
    ACTIVE_EMISSION: 15, // particles per second for dynamic states
    CHAOS_EMISSION: 25, // particles per second for problem visualization
  },
} as const;
```

### **Accessibility Constants**
```typescript
// ARIA constants for particle system accessibility
export const PARTICLE_ARIA = {
  CHAOS_DESCRIPTION: 'Visual representation of complexity and fragmentation in traditional development workflows',
  AMBIENT_DESCRIPTION: 'Subtle ambient particles creating atmospheric depth',
  FLOW_DESCRIPTION: 'Particles flowing to represent data and process movement',
  INTERACTIVE_DESCRIPTION: 'Interactive particles responding to user input',
  KEYBOARD_INSTRUCTIONS: 'Press space to pause, escape to stop, R to reset particle system',
} as const;
```

### **Physics Constants**
```typescript
// Physics simulation constants for realistic particle behavior
export const PARTICLE_PHYSICS = {
  GRAVITY: 0.1,
  FRICTION: 0.98,
  BOUNCE: 0.8,
  MAX_VELOCITY: 5.0,
  MIN_PARTICLE_SIZE: 1,
  MAX_PARTICLE_SIZE: 20,
  DEFAULT_MASS: 1.0,
} as const;
```

## 🚨 **Error Handling**

### **Particle System Errors**
```typescript
// Specialized error classes for particle systems
class ParticleSystemError extends ComponentError {
  constructor(
    message: string,
    public readonly context: ParticleErrorContext
  ) {
    super(message, 'ParticleSystemEffect');
  }
}

interface ParticleErrorContext {
  readonly particleCount?: number;
  readonly behaviorType?: string;
  readonly canvasState?: string;
  readonly performanceMetrics?: ParticlePerformanceMetrics;
}

interface ParticlePerformanceMetrics {
  readonly fps: number;
  readonly particleCount: number;
  readonly memoryUsage: number;
}
```

## 🧪 **Testing Support**

### **Test Utilities**
```typescript
// Testing utilities for particle systems
function createMockParticleConfig(overrides?: Partial<ParticleSystemConfig>): ParticleSystemConfig;

function createParticleSystemTestHarness(): {
  simulateEmission(count: number): void;
  simulateUpdate(deltaTime: number): void;
  getParticleCount(): number;
  verifyPerformance(): ParticlePerformanceMetrics;
}
```

### **Performance Test Utilities**
```typescript
// Performance testing for particle efficiency
function measureParticlePerformance(config: ParticleSystemConfig): Promise<{
  averageFPS: number;
  particleRenderTime: number;
  memoryUsage: number;
  stabilityMetrics: StabilityMetrics;
}>;

interface StabilityMetrics {
  fpsVariance: number;
  frameDrops: number;
  memoryLeaks: boolean;
}
```

## 💡 **Usage Context**

The Particle System Effect requires these shared utilities to:

1. **Physics Simulation**: Manage complex particle physics with vectors, forces, and collision detection
2. **Performance Optimization**: Maintain smooth 60fps performance with hundreds of particles through pooling and culling
3. **Brand Integration**: Apply consistent Voder colors and visual effects while supporting multiple particle behaviors
4. **Accessibility Support**: Provide reduced motion alternatives and screen reader descriptions for particle visualizations
5. **Canvas Management**: Optimize canvas rendering for particle systems with proper context validation
6. **Error Recovery**: Handle performance degradation and canvas issues gracefully with context-aware error reporting
7. **Testing Support**: Enable comprehensive testing of particle physics, performance, and visual output

These dependencies ensure the particle system integrates seamlessly with the overall Voder component architecture while delivering compelling visual effects that enhance the website's narrative experience.
