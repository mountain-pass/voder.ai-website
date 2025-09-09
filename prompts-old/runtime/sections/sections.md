# 🎨 Section Component Guidelines

## 🎯 **Purpose**

This sublayer contains section components that implement the narrative structure of the Voder pre-launch website. Section components are responsible for presenting specific parts of the story while maintaining consistency in architecture, accessibility, and performance.

**Section Component Packages:**

- `@voder/brand-entry-section` - Brand introduction with 3D visuals
- `@voder/the-why-section` - Purpose statement with typing animations
- `@voder/problem-space-section` - Problem visualization with particle effects
- `@voder/metaphor-section` - GPS metaphor with 3D navigation scene
- `@voder/vision-flow-section` - Workflow demonstration with interactive elements
- `@voder/prompt-iteration-section` - Code demonstration with syntax highlighting
- `@voder/outcome-focus-section` - Benefits presentation with emphasis effects
- `@voder/closing-moment-section` - Conclusion with call-to-action

## 🏗️ **Section Component Architecture**

### **Universal Section Characteristics**

All section components MUST follow these architectural patterns:

#### **1. Scroll-Tied Animation Integration**

```typescript
interface SectionComponent {
  // REQUIRED: ScrollTrigger with scrub property for scroll-tied animations
  scrollTrigger: ScrollTrigger;
  scrubValue: number | boolean; // e.g., scrub: 1 for smooth scroll-tied behavior

  // Animation phases coordinated with scroll position
  initializeScrollAnimations(): void;
  updateScrollProgress(progress: number): void;

  // Accessibility support for reduced motion
  handleReducedMotion(): void;
}
```

#### **2. Service Dependency Injection**

```typescript
class SectionBase {
  constructor(
    protected animationService: AnimationService,
    protected accessibilityService: AccessibilityService,
    protected assetService?: AssetService,
    protected scrollService?: ScrollService,
  ) {}

  // Standard lifecycle methods
  abstract mount(container: HTMLElement): Promise<void>;
  abstract unmount(): Promise<void>;
  abstract handleResize(dimensions: ViewportDimensions): void;
}
```

#### **3. Effect Component Composition**

```typescript
interface SectionWithEffects {
  effects: EffectComponent[];

  registerEffect(effect: EffectComponent): void;
  triggerEffect(effectId: string, config: EffectConfig): Promise<void>;
  coordianteEffects(scrollProgress: number): void;
}
```

### **Content Structure Requirements**

#### **1. Semantic HTML Foundation**

```typescript
interface SectionContent {
  role: string; // ARIA role for section purpose
  heading: HeadingConfig; // Semantic heading with proper hierarchy
  content: ContentBlock[]; // Structured content blocks
  landmarks: ARIALandmark[]; // ARIA landmarks for navigation
}

interface HeadingConfig {
  level: 1 | 2 | 3 | 4 | 5 | 6; // Proper heading hierarchy
  text: string;
  visualLevel?: 'display' | 'headline' | 'title'; // Visual styling level
  ariaLabel?: string; // Additional context for screen readers
}
```

#### **2. Responsive Content Layout**

```typescript
interface ResponsiveLayout {
  breakpoints: {
    mobile: MediaQuery; // 320px - 768px
    tablet: MediaQuery; // 768px - 1024px
    desktop: MediaQuery; // 1024px+
  };

  layouts: {
    mobile: LayoutConfig;
    tablet: LayoutConfig;
    desktop: LayoutConfig;
  };

  handleBreakpointChange(breakpoint: string): void;
}
```

### **Animation Architecture Requirements**

#### **1. GSAP ScrollTrigger Integration (MANDATORY)**

```typescript
class SectionAnimationController {
  private scrollTrigger: ScrollTrigger;
  private timeline: gsap.core.Timeline;

  initializeScrollAnimations(triggerElement: HTMLElement): void {
    // ✅ REQUIRED: All animations must be scroll-tied with scrub property
    this.scrollTrigger = ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top bottom', // When section enters viewport
      end: 'bottom top', // When section leaves viewport
      scrub: 1, // Smooth scroll-tied animation (MANDATORY)
      animation: this.timeline,
      onUpdate: (self) => {
        this.handleScrollProgress(self.progress);
      },
    });
  }

  private handleScrollProgress(progress: number): void {
    // Coordinate effects based on scroll progress
    this.coordianteEffects(progress);

    // Update accessibility announcements
    this.accessibilityService.updateScrollProgress(progress);
  }
}
```

#### **2. Reduced Motion Support (MANDATORY)**

```typescript
interface MotionPreferences {
  respectReducedMotion(): boolean;
  getAlternativeAnimation(): AnimationConfig;
  implementStaticFallback(): void;
}

class MotionHandler implements MotionPreferences {
  respectReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  getAlternativeAnimation(): AnimationConfig {
    if (this.respectReducedMotion()) {
      return {
        duration: 0,
        ease: 'none',
        opacity: [0, 1], // Simple fade only
        transform: 'none', // No motion transforms
      };
    }
    return this.getFullAnimation();
  }
}
```

### **Accessibility Architecture Requirements**

#### **1. ARIA Implementation Standards**

```typescript
interface AccessibilityIntegration {
  // Required ARIA attributes for each section
  setupARIA(element: HTMLElement): void;

  // Screen reader content alternatives
  provideTextAlternatives(): void;

  // Keyboard navigation support
  setupKeyboardNavigation(): void;

  // Live regions for dynamic content
  setupLiveRegions(): void;
}

class SectionAccessibility implements AccessibilityIntegration {
  setupARIA(element: HTMLElement): void {
    // Section-specific ARIA role
    element.setAttribute('role', this.getSectionRole());

    // Descriptive labels
    element.setAttribute('aria-label', this.getSectionLabel());

    // Skip navigation support
    if (this.hasComplexAnimations()) {
      this.addSkipAnimationLink(element);
    }
  }

  private addSkipAnimationLink(element: HTMLElement): void {
    const skipLink = document.createElement('a');
    skipLink.textContent = 'Skip animations in this section';
    skipLink.className = 'skip-animation-link';
    skipLink.setAttribute('href', `#${element.id}-content`);
    element.prepend(skipLink);
  }
}
```

#### **2. Keyboard Navigation Requirements**

```typescript
interface KeyboardNavigation {
  focusableElements: HTMLElement[];
  currentFocus: number;

  setupTabOrder(): void;
  handleKeyDown(event: KeyboardEvent): void;
  manageFocusTrapping(): void;
}

// Standard keyboard handlers for all sections
const SECTION_KEYBOARD_HANDLERS = {
  Escape: (section: SectionComponent) => section.exitInteractiveMode(),
  Space: (section: SectionComponent) => section.togglePlayPause(),
  ArrowRight: (section: SectionComponent) => section.nextInteractiveElement(),
  ArrowLeft: (section: SectionComponent) =>
    section.previousInteractiveElement(),
};
```

### **Performance Requirements**

#### **1. Resource Management**

```typescript
interface ResourceManagement {
  preloadAssets(): Promise<void>;
  lazyLoadContent(): Promise<void>;
  cleanupResources(): void;
  monitorPerformance(): PerformanceMetrics;
}

class SectionPerformanceManager implements ResourceManagement {
  async preloadAssets(): Promise<void> {
    // Critical assets loaded immediately
    const criticalAssets = this.getCriticalAssets();
    await Promise.all(criticalAssets.map((asset) => this.loadAsset(asset)));
  }

  async lazyLoadContent(): Promise<void> {
    // Non-critical content loaded when section approaches viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0.1) {
          this.loadSecondaryContent();
        }
      });
    });

    observer.observe(this.sectionElement);
  }
}
```

#### **2. Animation Performance Standards**

```typescript
interface AnimationPerformance {
  targetFPS: 60;
  maxFrameTime: 16.67; // milliseconds

  monitorFrameRate(): void;
  optimizeForDevice(): void;
  handlePerformanceDegradation(): void;
}

// Required performance thresholds for all sections
const PERFORMANCE_STANDARDS = {
  INITIAL_RENDER: 100, // milliseconds
  SCROLL_RESPONSE: 16, // milliseconds (60fps)
  ASSET_LOAD_TIME: 2000, // milliseconds
  MEMORY_USAGE_MAX: 50, // MB per section
  CPU_USAGE_BUDGET: 20, // percentage during animations
};
```

## 📋 **Section Component Lifecycle**

### **Standard Lifecycle Methods**

```typescript
abstract class SectionComponent {
  // 1. Initialization Phase
  abstract async initialize(config: SectionConfig): Promise<void>;

  // 2. Asset Loading Phase
  abstract async preloadAssets(): Promise<void>;

  // 3. DOM Mount Phase
  abstract async mount(container: HTMLElement): Promise<void>;

  // 4. Animation Setup Phase
  abstract setupScrollAnimations(): void;

  // 5. Interaction Setup Phase
  abstract setupInteractions(): void;

  // 6. Ready State
  abstract onReady(): void;

  // 7. Cleanup Phase
  abstract async unmount(): Promise<void>;

  // Runtime Methods
  abstract handleResize(dimensions: ViewportDimensions): void;
  abstract handleVisibilityChange(visible: boolean): void;
  abstract handleReducedMotionChange(reducedMotion: boolean): void;
}
```

### **Lifecycle Implementation Example**

```typescript
class ExampleSection extends SectionComponent {
  async initialize(config: SectionConfig): Promise<void> {
    this.config = config;
    this.validateConfig();
    this.setupServices();
  }

  async mount(container: HTMLElement): Promise<void> {
    // 1. Create semantic structure
    this.createElement();

    // 2. Setup accessibility
    this.setupARIA();

    // 3. Mount to DOM
    container.appendChild(this.element);

    // 4. Initialize effects
    await this.initializeEffects();

    // 5. Setup animations
    this.setupScrollAnimations();

    // 6. Setup interactions
    this.setupInteractions();

    // 7. Mark as ready
    this.onReady();
  }

  setupScrollAnimations(): void {
    const timeline = gsap.timeline();

    // Example scroll-tied animation
    timeline
      .from(this.contentElement, {
        opacity: 0,
        y: 50,
        duration: 1,
      })
      .from(
        this.effectsContainer,
        {
          scale: 0.8,
          duration: 0.8,
        },
        '-=0.5',
      );

    // REQUIRED: ScrollTrigger with scrub property
    ScrollTrigger.create({
      trigger: this.element,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1, // MANDATORY for scroll-tied behavior
      animation: timeline,
    });
  }
}
```

## 🎨 **Content Guidelines**

### **Narrative Structure Requirements**

Based on the Voder website specification, each section must:

#### **1. Follow Cinematic Pacing**

```typescript
interface CinematicPacing {
  entrance: AnimationPhase; // How section appears
  presence: AnimationPhase; // How section exists while visible
  transition: AnimationPhase; // How section transitions to next

  respectScrollVelocity(): void;
  maintainNarrativeFlow(): void;
}
```

#### **2. Maintain Brand Consistency**

```typescript
interface BrandIntegration {
  colorPalette: VoderColorPalette;
  typography: VoderTypography;
  spacing: VoderSpacing;
  motionLanguage: VoderMotionPrinciples;

  applyBrandGuidelines(): void;
  validateBrandCompliance(): boolean;
}

// Required brand colors from voder-website.md
const VODER_COLORS = {
  VODER_BLACK: '#0A0A0A',
  DEEP_NAVY: '#0F1A2E',
  SOFT_TEAL_GLOW: '#24D1D5',
  PAPER_WHITE: '#FFFFFF',
  COOL_GREY: '#C6CBD4',
  ACCENT_GREEN: '#9AEF00',
} as const;
```

#### **3. Support Multiple Device Types**

```typescript
interface ResponsiveAdaptation {
  mobile: DeviceConfig; // 320px - 768px
  tablet: DeviceConfig; // 768px - 1024px
  desktop: DeviceConfig; // 1024px+

  adaptLayoutForDevice(device: DeviceType): void;
  optimizePerformanceForDevice(device: DeviceType): void;
  adjustInteractionsForDevice(device: DeviceType): void;
}
```

## 🧪 **Testing Requirements**

### **Required Test Coverage**

```typescript
interface SectionTestSuite {
  // Rendering Tests
  testInitialRender(): void;
  testResponsiveLayout(): void;
  testBrandCompliance(): void;

  // Animation Tests
  testScrollTiedAnimations(): void;
  testReducedMotionFallbacks(): void;
  testAnimationPerformance(): void;

  // Accessibility Tests
  testARIAImplementation(): void;
  testKeyboardNavigation(): void;
  testScreenReaderSupport(): void;

  // Integration Tests
  testServiceIntegration(): void;
  testEffectCoordination(): void;
  testCrossDeviceCompatibility(): void;

  // Performance Tests
  testLoadTimes(): void;
  testMemoryUsage(): void;
  testFrameRate(): void;
}
```

### **Playwright E2E Test Patterns**

```typescript
// Standard test patterns for all sections
export const SECTION_TEST_PATTERNS = {
  SCROLL_TIED_ANIMATION: async (page: Page, sectionId: string) => {
    await page.goto('/');

    // Test animation tied to scroll position
    const section = page.locator(`[data-testid="${sectionId}"]`);
    await expect(section).toBeVisible();

    // Scroll and verify animation progress
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(section).toHaveClass(/animated/);

    // Verify animation reverses on scroll up
    await page.evaluate(() => window.scrollBy(0, -50));
    // Animation should partially reverse
  },

  REDUCED_MOTION_SUPPORT: async (page: Page, sectionId: string) => {
    // Set reduced motion preference
    await page.emulateMedia({
      reducedMotion: 'reduce',
    });

    const section = page.locator(`[data-testid="${sectionId}"]`);
    await expect(section).toBeVisible();

    // Verify no complex animations
    await expect(section).not.toHaveClass(/complex-animation/);
  },

  ACCESSIBILITY_COMPLIANCE: async (page: Page, sectionId: string) => {
    const section = page.locator(`[data-testid="${sectionId}"]`);

    // Test ARIA attributes
    await expect(section).toHaveAttribute('role');
    await expect(section).toHaveAttribute('aria-label');

    // Test keyboard navigation
    await section.focus();
    await page.keyboard.press('Tab');
    // Verify focus management
  },
};
```

## 📁 **Section Package Structure**

```
packages/section-name/
├── src/
│   ├── index.ts                    # Main section export
│   ├── SectionComponent.ts         # Core section implementation
│   ├── SectionAnimation.ts         # Animation controller
│   ├── SectionAccessibility.ts     # Accessibility handler
│   ├── content/
│   │   ├── SectionContent.ts       # Content structure
│   │   └── ContentValidator.ts     # Content validation
│   ├── styles/
│   │   ├── section.css             # Section-specific styles
│   │   └── responsive.css          # Responsive layout styles
│   └── types/
│       ├── SectionConfig.ts        # Configuration interfaces
│       └── SectionEvents.ts        # Event type definitions
├── tests/
│   ├── SectionComponent.test.ts    # Unit tests
│   ├── accessibility.test.ts       # Accessibility tests
│   ├── performance.test.ts         # Performance tests
│   └── e2e/
│       └── section.spec.ts         # Playwright E2E tests
├── docs/
│   └── libraries/
│       └── needs/                  # Dependency needs files
├── package.json                    # Package configuration
└── README.md                      # Implementation documentation
```

## 📋 **Implementation Checklist**

Before considering any section component complete, verify:

### **✅ Core Architecture**

- [ ] Extends `SectionComponent` base class with proper lifecycle methods
- [ ] Implements scroll-tied animations using GSAP ScrollTrigger with `scrub` property
- [ ] Integrates with required services through dependency injection
- [ ] Follows responsive design principles for mobile, tablet, and desktop
- [ ] Implements proper resource management and cleanup

### **✅ Accessibility Implementation**

- [ ] Semantic HTML structure with proper heading hierarchy
- [ ] ARIA attributes and landmarks for screen reader navigation
- [ ] Keyboard navigation support with logical tab order
- [ ] Reduced motion fallbacks that respect user preferences
- [ ] Skip links for complex animations or interactions

### **✅ Performance Standards**

- [ ] Initial render under 100ms
- [ ] Scroll-tied animations maintain 60fps
- [ ] Memory usage under 50MB per section
- [ ] Asset loading optimized with preloading and lazy loading
- [ ] Performance monitoring and degradation handling

### **✅ Brand & Content Compliance**

- [ ] Uses approved Voder color palette and typography
- [ ] Follows cinematic pacing and narrative flow
- [ ] Maintains visual consistency with brand guidelines
- [ ] Content structure matches website specification requirements

### **✅ Testing Coverage**

- [ ] Unit tests cover all public methods and edge cases
- [ ] Accessibility tests validate ARIA and keyboard navigation
- [ ] Performance tests verify frame rate and resource usage
- [ ] E2E tests cover cross-device compatibility and user interactions
- [ ] Integration tests validate service dependencies and effect coordination

## 🎯 **Section Implementation Checklist**

Before marking any section as complete, verify:

### **✅ Transition Implementation**

- [ ] All scroll animations use ScrollTrigger with `scrub` property
- [ ] Bidirectional scroll behavior implemented (forward and reverse)
- [ ] Animation phases properly defined with start/end points
- [ ] Timing matches specification within ±100ms tolerance
- [ ] Performance monitoring shows <2% frame drops

### **✅ Required Test Data Attributes**

- [ ] `data-testid="section-container"` - Main section wrapper
- [ ] `data-testid="section-trigger"` - Element that triggers transitions
- [ ] `data-testid="section-animation"` - Animated elements container
- [ ] `data-testid="section-content"` - Essential accessible content
- [ ] `data-testid="section-complete"` - Element visible when section completes
- [ ] `data-testid="skip-section"` - Skip button for accessibility

### **✅ Accessibility Validation**

- [ ] Section landmark with proper `aria-label` or heading
- [ ] ARIA live region for transition announcements
- [ ] Complex animations marked `aria-hidden="true"`
- [ ] Essential content accessible without animations
- [ ] Skip functionality (ESC key) implemented and tested

### **✅ Playwright Testing Requirements**

- [ ] Initial state verification test
- [ ] Transition trigger and completion test
- [ ] Bidirectional scroll behavior test
- [ ] `prefers-reduced-motion` fallback test
- [ ] Accessibility skip functionality test
- [ ] Screen reader announcement test
- [ ] 60fps performance validation test

Use this checklist to ensure comprehensive section implementation that meets all architectural, accessibility, and performance requirements.

This guidelines document ensures all section components maintain architectural consistency, accessibility compliance, and performance standards while delivering the cinematic narrative experience specified for the Voder website.
