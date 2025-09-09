# Effect Component Guidelines

## 🎯 **Purpose**

Effect components provide visual and interactive enhancements that support the narrative sections of the Voder website. They are reusable, performance-optimized components that handle specific visual effects like 3D rendering, particle systems, animations, and interactive elements.

## 💡 **Implementation Hints**

### **3D Graphics & Animation Libraries**

1. **Three.js**: Used directly for 3D content (no Threlte wrapper)
   - Current version: three and @types/three is 0.178.0
   - Use proper disposal patterns for Three.js resources to prevent memory leaks
2. **GSAP**: Provides animation capabilities with scroll triggers
   - Integrate with ScrollTrigger for scroll-tied effects
   - Use performance-optimized properties (transform, opacity)
3. **Effect Encapsulation**: Components should encapsulate their library-specific implementations
   - Hide Three.js complexity behind clean interfaces
   - Provide consistent APIs regardless of underlying library
4. **Resource Management**: Critical for preventing memory leaks
   - Dispose of Three.js geometries, materials, and textures
   - Clean up GSAP timelines and ScrollTriggers on unmount
   - Remove event listeners and cancel animation frames

## 🏗️ **Architectural Principles**

### **Single Responsibility**

Each effect component handles exactly one type of visual effect:

- Canvas3DEffect: 3D scene rendering and WebGL management
- TypingAnimationEffect: Text typing animations
- ParticleSystemEffect: Particle physics and rendering
- InteractiveButtonEffect: Button interaction effects
- CodeDisplayEffect: Code syntax highlighting and display

### **Service Integration**

Effects integrate with the service layer through dependency injection:

```typescript
interface EffectComponent {
  constructor(
    container: HTMLElement,
    config: EffectConfig,
    services: {
      animation: AnimationService;
      accessibility: AccessibilityService;
      assets: AssetService;
      scroll: ScrollService;
    },
  );
}
```

### **Lifecycle Management**

All effects follow a consistent lifecycle pattern:

```typescript
interface EffectLifecycle {
  mount(): Promise<void>; // Initialize effect and load assets
  start(): void; // Begin effect execution
  pause(): void; // Pause effect (accessibility)
  resume(): void; // Resume from pause
  stop(): void; // Stop effect execution
  unmount(): Promise<void>; // Cleanup and destroy
}
```

## 🎬 **Animation Integration Requirements**

### **GSAP ScrollTrigger Coordination**

Effects must coordinate with section scroll-tied animations:

```typescript
class EffectComponent {
  private scrollTrigger: ScrollTrigger;

  setupScrollIntegration() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.container,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1, // Effect intensity tied to scroll position
      onUpdate: (self) => {
        this.updateEffectIntensity(self.progress);
      },
    });
  }
}
```

### **Animation Service Integration**

Effects use AnimationService for consistent timing and coordination:

- **Performance Timing**: 60fps target for all effects
- **Reduced Motion**: Respect `prefers-reduced-motion` settings
- **Memory Management**: 50MB maximum memory usage per effect
- **GPU Acceleration**: Use transform/opacity for smooth animations

## ♿ **Accessibility Standards**

### **ARIA Implementation**

```typescript
// Decorative effects
<canvas aria-hidden="true" />

// Interactive effects
<button
  aria-label="Activate particle effect"
  aria-describedby="effect-description"
>

// Dynamic content effects
<div aria-live="polite" id="typing-output" />
```

### **Keyboard Navigation**

- All interactive effects must support keyboard navigation
- Tab order must be logical and consistent
- Focus indicators must meet 3:1 contrast ratio
- Escape key should pause/stop complex effects

### **Reduced Motion Support**

```typescript
class EffectComponent {
  private respectsReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private applyMotionPreferences() {
    if (this.respectsReducedMotion()) {
      this.disableComplexAnimations();
      this.enableStaticAlternatives();
    }
  }
}
```

## 🎨 **Brand Compliance**

### **Color Palette Integration**

Effects must use the Voder brand palette:

- **Primary**: Voder Black (#0A0A0A), Deep Navy (#0F1A2E)
- **Accents**: Soft Teal Glow (#24D1D5), Accent Green (#9AEF00)
- **Neutrals**: Paper White (#FFFFFF), Cool Grey (#C6CBD4)
- **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text

### **Typography Integration**

Code and text effects must use brand typography:

- **Monospace**: JetBrains Mono for code display
- **Headlines**: Inter/Satoshi for effect labels
- **Body**: Inter for effect descriptions

## 🚀 **Performance Requirements**

### **Resource Management**

```typescript
interface EffectPerformance {
  memoryLimit: 50; // MB maximum per effect
  fpsTarget: 60; // Frames per second
  initTime: 100; // Milliseconds maximum initialization
  assetSize: 10; // MB maximum asset loading per effect
}
```

### **Asset Loading Strategy**

- **Lazy Loading**: Load assets only when effect becomes visible
- **Asset Optimization**: Compress textures, models, and media files
- **Fallback Assets**: Provide low-resolution alternatives for slow connections
- **Memory Cleanup**: Dispose of GPU resources when effect unmounts

### **GPU Optimization**

```typescript
// Preferred: GPU-accelerated properties
gsap.to(element, {
  x: 100, // transform: translateX()
  y: 50, // transform: translateY()
  rotation: 45, // transform: rotate()
  opacity: 0.5, // opacity
  scale: 1.2, // transform: scale()
});

// Avoid: CPU-intensive properties
// width, height, top, left, margin, padding
```

## 🧪 **Testing Requirements**

### **Playwright E2E Tests**

Every effect must include comprehensive E2E tests:

```typescript
// Effect visibility and functionality
test('effect renders correctly', async ({ page }) => {
  await page.goto('/');

  const effect = page.locator('[data-testid="canvas-3d-effect"]');
  await expect(effect).toBeVisible();
  await expect(effect).toHaveAttribute('aria-hidden', 'true');
});

// Performance validation
test('effect maintains 60fps performance', async ({ page }) => {
  await page.goto('/');

  const effectContainer = page.locator('[data-testid="effect-container"]');
  await effectContainer.scrollIntoViewIfNeeded();

  // Measure frame rate during effect execution
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const frames = [];
      const startTime = performance.now();

      function measureFrame() {
        frames.push(performance.now());
        if (frames.length < 60) {
          requestAnimationFrame(measureFrame);
        } else {
          const duration = frames[frames.length - 1] - startTime;
          const fps = (frames.length / duration) * 1000;
          resolve(fps);
        }
      }

      requestAnimationFrame(measureFrame);
    });
  });

  expect(metrics).toBeGreaterThan(55); // Allow 5fps tolerance
});

// Accessibility compliance
test('effect respects reduced motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const effect = page.locator('[data-testid="particle-effect"]');
  await expect(effect).toHaveAttribute('data-motion-reduced', 'true');
});

// Memory usage validation
test('effect cleans up resources on unmount', async ({ page }) => {
  await page.goto('/');

  const initialMemory = await page.evaluate(
    () => performance.memory?.usedJSHeapSize || 0,
  );

  // Navigate away and back to trigger unmount/mount
  await page.goto('about:blank');
  await page.goto('/');

  // Wait for garbage collection
  await page.waitForTimeout(1000);

  const finalMemory = await page.evaluate(
    () => performance.memory?.usedJSHeapSize || 0,
  );

  // Memory should not increase significantly (allow 10MB variance)
  expect(finalMemory - initialMemory).toBeLessThan(10 * 1024 * 1024);
});
```

### **Unit Tests (Vitest)**

Effects should include unit tests for:

- Configuration validation
- Service integration
- Lifecycle methods
- Error handling
- Performance monitoring

## 📂 **Package Structure**

Each effect package follows this standardized structure:

```
packages/[effect-name]/
├── package.json           # Package configuration with peer dependencies
├── src/
│   ├── index.ts          # Main effect export
│   ├── [Effect]Component.ts # Main effect class
│   ├── config/
│   │   └── EffectConfig.ts   # Configuration interfaces
│   ├── assets/           # Effect-specific assets (shaders, models, etc.)
│   └── utils/            # Effect-specific utilities
├── tests/
│   ├── unit/             # Vitest unit tests
│   └── e2e/              # Playwright E2E tests
├── docs/
│   ├── libraries/
│   │   └── needs/        # Dependencies from other packages
│   └── README.md         # Effect documentation
└── prompts/             # Symlinked documentation (created by setup script)
```

## 🔧 **TypeScript Configuration**

Effects use strict TypeScript configuration:

```typescript
// tsconfig.json
{
  "extends": "@voder/tsconfig/base.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "allowImportingTsExtensions": false,
    "strict": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["tests/**/*", "dist/**/*"]
}
```

## 🔗 **Service Dependencies**

Effects typically depend on these services:

### **AnimationService**

- Timeline management and coordination
- Performance monitoring and optimization
- Reduced motion preference handling

### **AccessibilityService**

- ARIA attribute management
- Keyboard navigation support
- Screen reader announcements

### **AssetService**

- 3D model and texture loading
- Image and media asset management
- Asset optimization and compression

### **ScrollService**

- Scroll position tracking for effects
- Viewport intersection detection
- Scroll-tied effect intensity

## 📋 **Implementation Checklist**

Before submitting an effect component, verify:

### **✅ Architecture Compliance**

- [ ] Single responsibility principle followed
- [ ] Service integration via dependency injection
- [ ] Standard lifecycle methods implemented
- [ ] TypeScript interfaces properly defined

### **✅ Animation Integration**

- [ ] GSAP ScrollTrigger coordination implemented
- [ ] 60fps performance target achieved
- [ ] GPU-accelerated animations used
- [ ] Reduced motion preferences respected

### **✅ Accessibility Standards**

- [ ] ARIA attributes correctly applied
- [ ] Keyboard navigation supported
- [ ] Focus indicators meet contrast requirements
- [ ] Screen reader compatibility verified

### **✅ Brand Compliance**

- [ ] Voder color palette used exclusively
- [ ] Brand typography integrated correctly
- [ ] Visual style matches brand guidelines
- [ ] Calm confidence persona maintained

### **✅ Performance Optimization**

- [ ] Memory usage under 50MB limit
- [ ] Asset loading optimized (lazy loading)
- [ ] GPU resources properly cleaned up
- [ ] Resource disposal on unmount

### **✅ Testing Coverage**

- [ ] Playwright E2E tests written and passing
- [ ] Vitest unit tests cover core functionality
- [ ] Performance benchmarks included
- [ ] Accessibility tests implemented

## 🎯 **Effect-Specific Guidelines**

### **Canvas3DEffect**

- Use Three.js for 3D rendering
- Implement WebGL fallbacks for older browsers
- Optimize geometry and texture loading
- Handle WebGL context loss gracefully

### **TypingAnimationEffect**

- Support variable typing speeds
- Handle backspace and correction animations
- Provide cursor customization options
- Ensure text remains selectable after animation

### **ParticleSystemEffect**

- Use GPU-based particle systems when possible
- Implement efficient collision detection
- Support particle recycling for performance
- Provide physics parameter customization

### **InteractiveButtonEffect**

- Support hover, focus, and active states
- Implement haptic feedback for supported devices
- Provide visual feedback for all interactions
- Ensure button remains functional during effects

### **CodeDisplayEffect**

- Use syntax highlighting with proper theming
- Support line numbering and highlighting
- Implement smooth scrolling for code blocks
- Ensure code remains copyable during display

## 🔍 **Troubleshooting Guide**

### **Performance Issues**

- Check GPU memory usage with browser dev tools
- Profile animation performance with Timeline
- Reduce particle count or geometry complexity
- Implement level-of-detail (LOD) systems

### **Accessibility Violations**

- Validate ARIA attributes with axe-core
- Test keyboard navigation manually
- Verify screen reader announcements
- Check color contrast ratios

### **Integration Problems**

- Verify service injection is working correctly
- Check that ScrollTrigger scrub values are properly set
- Ensure effect lifecycle methods are called
- Validate TypeScript imports use `.js` extensions

## 🎯 **Effect Implementation Checklist**

Before marking any effect as complete, verify:

### **✅ Core Implementation**

- [ ] Effect class implements `IEffectComponent` interface completely
- [ ] Constructor uses dependency injection for all services
- [ ] Mount/unmount lifecycle methods implemented correctly
- [ ] Destroy method cleans up all resources and event listeners

### **✅ Animation Requirements**

- [ ] All animations use GSAP ScrollTrigger with `scrub` property
- [ ] Bidirectional scroll behavior implemented (forward/reverse)
- [ ] `prefers-reduced-motion` fallback implemented
- [ ] Performance monitoring shows <60fps maintained during animations

### **✅ Accessibility Implementation**

- [ ] Decorative animations marked with `aria-hidden="true"`
- [ ] Essential content accessible without animations
- [ ] Screen reader announcements for state changes
- [ ] Skip functionality available (ESC key or skip button)
- [ ] All interactive elements keyboard accessible

### **✅ Testing Coverage**

- [ ] Unit tests for effect lifecycle methods
- [ ] Integration tests with AnimationService
- [ ] Accessibility compliance tests (ARIA, keyboard, screen reader)
- [ ] Performance tests (60fps, memory usage)
- [ ] Scroll-tied behavior validation tests

### **✅ Required Test Selectors**

- [ ] `data-testid="effect-container"` - Main effect wrapper
- [ ] `data-testid="effect-animation"` - Animated elements container
- [ ] `data-testid="essential-content"` - Non-decorative content
- [ ] `data-testid="skip-effect"` - Skip button for accessibility
- [ ] `data-testid="effect-complete"` - Element visible when effect completes

### **✅ Performance Validation**

- [ ] Effect initialization under 10ms
- [ ] Mount operation under 100ms
- [ ] No memory leaks during repeated mount/unmount cycles
- [ ] Frame rate monitoring shows minimal dropped frames
- [ ] Animation timing matches specification within ±100ms tolerance

Use this checklist before marking any effect component as complete.

---

This document provides the foundation for implementing consistent, performant, and accessible effect components that enhance the Voder website narrative while maintaining strict architectural standards.
