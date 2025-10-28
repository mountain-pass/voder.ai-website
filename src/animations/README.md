# Animation System Documentation

**Part of ADR-0037: Comprehensive Animation System**

## Overview

The Animation System provides a robust framework for managing scroll-based and time-based animations with dependency tracking, state management, and lifecycle control.

### Key Features

- **Three Animation Types**: Scroll-scrubbed, scroll-triggered, and time-based
- **State Lifecycle**: Idle → Triggered → Active → Completed → Reset
- **Dependency Resolution**: Animations wait for dependencies before executing
- **Bidirectional Support**: Animations can run in reverse during backward scroll
- **Centralized Coordination**: Single coordinator manages all animations

## Quick Start

### 1. Create an Animation

```typescript
import { BaseAnimation, AnimationType, AnimationProgress } from './animations';

class MyAnimation extends BaseAnimation {
  constructor() {
    super({
      id: 'my-animation',
      type: AnimationType.ScrollScrubbed,
      scrollRange: { start: 0, end: 0.5 },
      bidirectional: true,
    });
  }

  update(progress: AnimationProgress): void {
    const scrollProgress = this.calculateScrollProgress(progress.value);

    // Apply your animation based on scrollProgress (0-1)
    const element = document.querySelector('.my-element');
    if (element) {
      element.style.opacity = scrollProgress.toString();
    }

    // Update state
    if (scrollProgress >= 1 && this.state !== AnimationState.Completed) {
      this.transitionTo(AnimationState.Completed);
    }
  }
}
```

### 2. Register with Coordinator

```typescript
import { AnimationCoordinator } from './animations';

const coordinator = new AnimationCoordinator();
const myAnimation = new MyAnimation();

coordinator.register(myAnimation);
coordinator.start();
```

### 3. Update on Scroll

```typescript
window.addEventListener('scroll', () => {
  const scrollProgress =
    window.scrollY / (document.body.scrollHeight - window.innerHeight);
  coordinator.updateScroll(scrollProgress);
});
```

## Animation Types

### Scroll-Scrubbed

Continuously updates based on scroll position. Best for animations that should stay in sync with scroll position.

```typescript
{
  type: AnimationType.ScrollScrubbed,
  scrollRange: { start: 0.2, end: 0.8 }, // Active between 20% and 80% scroll
}
```

### Scroll-Triggered

Triggers once when scroll reaches a threshold, then animates independently.

```typescript
{
  type: AnimationType.ScrollTriggered,
  scrollRange: { start: 0.5, end: 0.5 }, // Triggers at 50% scroll
  duration: 800, // 800ms animation
}
```

### Time-Based

Animates based on elapsed time, independent of scroll.

```typescript
{
  type: AnimationType.TimeBased,
  duration: 1000, // 1 second animation
}
```

## Dependencies

Animations can depend on other animations completing first:

```typescript
class SecondAnimation extends BaseAnimation {
  constructor() {
    super({
      id: 'second-animation',
      type: AnimationType.ScrollTriggered,
      dependencies: ['first-animation'], // Wait for first-animation to complete
      scrollRange: { start: 0.5, end: 0.5 },
    });
  }

  update(progress: AnimationProgress): void {
    // This only runs after first-animation completes
  }
}
```

## State Lifecycle

```
Idle ──trigger()──> Triggered ──update()──> Active ──complete──> Completed
  ↑                    ↓                        ↓                    ↓
  └────────────────reset()─────────────────────┘────────────────────┘
```

### Valid State Transitions

- **Idle** → Triggered, Active, Reset
- **Triggered** → Active, Idle, Reset
- **Active** → Completed, Idle, Reset
- **Completed** → Idle, Reset, Active (reverse)
- **Reset** → Idle

## API Reference

### BaseAnimation

#### Constructor Options

```typescript
interface AnimationConfig {
  id: string; // Unique identifier
  type: AnimationType; // Animation type
  dependencies?: string[]; // IDs of required animations
  scrollRange?: {
    // For scroll-based animations
    start: number; // 0-1
    end: number; // 0-1
  };
  duration?: number; // For time-based animations (ms)
  bidirectional?: boolean; // Allow reverse (default: true)
}
```

#### Methods

- `update(progress: AnimationProgress): void` - **Required override**
- `init(): void` - Override for custom initialization
- `trigger(): void` - Manually trigger animation
- `reset(): void` - Reset to idle state
- `destroy(): void` - Clean up resources
- `isCompleted(): boolean` - Check completion status

#### Protected Methods

- `transitionTo(newState: AnimationState): void` - Transition states safely
- `calculateScrollProgress(scrollProgress: number): number` - Map to scroll range
- `onTrigger(): void` - Override for trigger handling
- `onReset(): void` - Override for reset handling
- `onStateChange(prev, curr): void` - Override for state change events

### AnimationCoordinator

#### Methods

- `register(animation: IAnimation): void` - Register animation
- `unregister(animationId: string): void` - Remove animation
- `getAnimation(animationId: string): IAnimation | undefined` - Get by ID
- `getState(animationId: string): AnimationState | undefined` - Get state
- `updateScroll(scrollProgress: number): void` - Update scroll-based animations
- `start(): void` - Start time-based animation loop
- `stop(): void` - Stop animation loop
- `reset(): void` - Reset all animations
- `destroy(): void` - Clean up everything
- `getAnimationIds(): string[]` - List all IDs
- `getAnimationsByType(type): IAnimation[]` - Filter by type
- `areDependenciesSatisfied(id): boolean` - Check dependencies

## Migration Guide

### From Ad-Hoc Animation to Animation System

**Before:**

```typescript
class MyAnimator {
  private scrollProgress = 0;

  update() {
    // Manual state tracking
    if (this.scrollProgress > 0.5 && !this.triggered) {
      this.triggered = true;
      this.startAnimation();
    }
  }
}
```

**After:**

```typescript
class MyAnimation extends BaseAnimation {
  constructor() {
    super({
      id: 'my-animation',
      type: AnimationType.ScrollTriggered,
      scrollRange: { start: 0.5, end: 0.5 },
    });
  }

  update(progress: AnimationProgress): void {
    // System handles state and triggering
    if (this.state === AnimationState.Triggered) {
      this.transitionTo(AnimationState.Active);
      this.startAnimation();
    }
  }
}
```

### Benefits

1. **No manual state tracking** - System manages lifecycle
2. **Automatic dependency resolution** - Declare dependencies, system handles it
3. **Consistent API** - All animations work the same way
4. **Easy testing** - Mock animations, test coordinator independently
5. **Bidirectional support** - Built-in reverse scroll handling

## Examples

### Example 1: Fade In on Scroll

```typescript
class FadeInAnimation extends BaseAnimation {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    super({
      id: `fade-in-${element.id}`,
      type: AnimationType.ScrollScrubbed,
      scrollRange: { start: 0.2, end: 0.4 },
    });
    this.element = element;
  }

  update(progress: AnimationProgress): void {
    const opacity = this.calculateScrollProgress(progress.value);
    this.element.style.opacity = opacity.toString();

    if (opacity >= 1) {
      this.transitionTo(AnimationState.Completed);
    }
  }
}
```

### Example 2: Sequential Animations

```typescript
const coordinator = new AnimationCoordinator();

// First animation
const fadeIn = new FadeInAnimation(element1);
coordinator.register(fadeIn);

// Second animation depends on first
class SlideInAnimation extends BaseAnimation {
  constructor() {
    super({
      id: 'slide-in',
      type: AnimationType.ScrollTriggered,
      dependencies: ['fade-in-element1'], // Wait for fade-in
      scrollRange: { start: 0.5, end: 0.5 },
      duration: 800,
    });
  }

  update(progress: AnimationProgress): void {
    // Only runs after fade-in completes
    const elapsed = progress.elapsedTime || 0;
    const animProgress = Math.min(elapsed / 800, 1);

    element2.style.transform = `translateX(${-400 * (1 - animProgress)}px)`;

    if (animProgress >= 1) {
      this.transitionTo(AnimationState.Completed);
    }
  }
}

coordinator.register(new SlideInAnimation());
```

### Example 3: Reverse Animation on Scroll Up

```typescript
class BidirectionalAnimation extends BaseAnimation {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    super({
      id: 'bidirectional',
      type: AnimationType.ScrollScrubbed,
      scrollRange: { start: 0.3, end: 0.7 },
      bidirectional: true, // Enable reverse
    });
    this.element = element;
  }

  update(progress: AnimationProgress): void {
    const scrollProgress = this.calculateScrollProgress(progress.value);

    // Animation works in both directions
    if (progress.direction === 'forward') {
      this.element.style.transform = `scale(${1 + scrollProgress * 0.5})`;
    } else {
      // Reverse animation on scroll up
      this.element.style.transform = `scale(${1 + scrollProgress * 0.5})`;
    }
  }
}
```

## Best Practices

1. **One animation per element** - Keep animations focused
2. **Use scroll ranges wisely** - Avoid overlapping active ranges
3. **Clean up in destroy()** - Remove event listeners, clear refs
4. **Test with mocks** - Mock animations for coordinator tests
5. **Declare dependencies explicitly** - Makes coordination clear
6. **Use state transitions** - Don't manipulate state directly
7. **Handle both directions** - Even if bidirectional: false, consider reverse scroll

## Troubleshooting

### Animation not updating

- Check if registered with coordinator
- Verify scroll updates are being sent
- Check dependencies are satisfied
- Confirm scroll range includes current position

### Dependencies not working

- Verify dependency IDs match animation IDs
- Check dependent animation completes (state = Completed)
- Use `areDependenciesSatisfied()` to debug

### State transition warnings

- Check state transition is valid (see Valid State Transitions)
- Don't skip states (Idle → Active OK, Idle → Completed not OK)
- Use `transitionTo()` instead of setting `_state` directly

## Performance Tips

1. **Throttle scroll updates** - Use requestAnimationFrame
2. **Minimize DOM queries** - Cache element references
3. **Use CSS transforms** - Hardware accelerated
4. **Batch updates** - Update multiple properties at once
5. **Clean up completed animations** - Unregister when done

## Testing

```typescript
import { AnimationCoordinator } from './animations';

describe('My Animation', () => {
  it('should complete at 100% progress', () => {
    const coordinator = new AnimationCoordinator();
    const animation = new MyAnimation();

    coordinator.register(animation);
    coordinator.updateScroll(1.0);

    expect(animation.isCompleted()).toBe(true);
  });
});
```
