# @voder/services Package Implementation Guide

This document provides comprehensive implementation guidelines for the `@voder/services` package, which contains the core business logic services that power all runtime components in the Voder monorepo. This package implements the service layer that bridges between the shared interfaces and the actual component implementations.

## 🎯 **PACKAGE SCOPE & RESPONSIBILITIES**

### **Primary Responsibilities**
- **Animation Management**: GSAP-based animation execution and timeline coordination
- **Scroll Observation**: Intersection Observer API wrapper for scroll-triggered events
- **Accessibility Support**: ARIA management, screen reader announcements, and keyboard navigation
- **Asset Loading**: Resource loading, caching, and management for fonts, images, and 3D models

### **Service Architecture Principles**
- Each service implements interfaces from `@voder/shared`
- Services are stateless and thread-safe where possible
- All services support dependency injection and lifecycle management
- Services provide observable streams for reactive programming
- Error handling includes graceful degradation and recovery strategies

## 🏗️ **PACKAGE STRUCTURE**

```
packages/services/
├── src/
│   ├── index.ts                    # Main export barrel
│   ├── AnimationService/           # Animation service implementation
│   │   ├── index.ts               # Service exports
│   │   ├── AnimationService.ts    # Main service class
│   │   ├── Timeline.ts            # Timeline management
│   │   ├── AnimationQueue.ts      # Animation queuing system
│   │   ├── PerformanceMonitor.ts  # Animation performance tracking
│   │   └── types.ts               # Animation-specific types
│   ├── ScrollService/             # Scroll observation service
│   │   ├── index.ts               # Service exports
│   │   ├── ScrollService.ts       # Main service class
│   │   ├── IntersectionManager.ts # Intersection Observer wrapper
│   │   ├── ScrollEventManager.ts  # Scroll event coordination
│   │   └── types.ts               # Scroll-specific types
│   ├── AccessibilityService/      # Accessibility service
│   │   ├── index.ts               # Service exports
│   │   ├── AccessibilityService.ts # Main service class
│   │   ├── AriaManager.ts         # ARIA attribute management
│   │   ├── ScreenReaderManager.ts # Screen reader announcements
│   │   ├── KeyboardManager.ts     # Keyboard navigation support
│   │   ├── FocusManager.ts        # Focus management utilities
│   │   └── types.ts               # Accessibility-specific types
│   ├── AssetService/              # Asset loading service
│   │   ├── index.ts               # Service exports
│   │   ├── AssetService.ts        # Main service class
│   │   ├── AssetCache.ts          # Caching implementation
│   │   ├── LoaderRegistry.ts      # Asset loader registration
│   │   ├── loaders/               # Specific asset loaders
│   │   │   ├── FontLoader.ts      # Font loading
│   │   │   ├── ImageLoader.ts     # Image loading
│   │   │   ├── ModelLoader.ts     # 3D model loading
│   │   │   └── index.ts           # Loader exports
│   │   └── types.ts               # Asset-specific types
│   └── utils/                     # Service utilities
│       ├── index.ts               # Utility exports
│       ├── observable.ts          # Observable implementation
│       ├── event-emitter.ts       # Event emitter utilities
│       └── performance.ts         # Performance monitoring utilities
├── tests/                         # Vitest unit tests
├── dist/                          # Built output (git-ignored)
├── package.json                   # Package metadata
├── tsconfig.json                  # TypeScript config
└── rollup.config.js               # Build configuration
```

## 🎬 **ANIMATION SERVICE IMPLEMENTATION**

### **🚨 CRITICAL: Scroll-Scrubbed Animation Requirements**

**For the Voder website, ALL animations MUST be scroll-scrubbed, not scroll-triggered:**

- ✅ **REQUIRED**: `ScrollTrigger.create({ scrub: 1, ... })` - Animation progress tied to scroll progress
- ❌ **FORBIDDEN**: `ScrollTrigger.create({ onEnter: () => animation.play() })` - Animation triggered by scroll events

**Expected Behavior:**
- Animation progresses smoothly as user scrolls
- Animation pauses immediately when scrolling stops  
- Animation reverses when user scrolls backwards
- Animation speed matches scroll velocity when using `scrub: true`
- Animation speed is smoothed when using `scrub: 1` (or other numeric values)

**Implementation Requirements:**
- Use `createScrollTimeline()` method for all website animations
- Validate that `scrub` property is always provided
- Throw errors for missing scrub configuration
- Support both `scrub: true` (immediate) and `scrub: number` (smoothed) modes

### **🔄 CRITICAL: Bidirectional Scroll Transitions**

**ALL scroll-triggered transitions MUST play both forward (scroll down) AND in reverse (scroll up).** This is essential for the narrative experience.

#### **❌ WRONG: Forward-only implementation**
```typescript
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  onEnter: () => animation.play() // Only plays on scroll down!
});
```

#### **✅ CORRECT: Bidirectional implementation**
```typescript
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  end: "bottom 20%",
  animation: timeline,
  scrub: 1, // Animation progress tied to scroll position
  // Automatically handles forward/reverse through scrub
});

// Alternative for trigger-based (less preferred):
ScrollTrigger.create({
  trigger: element,
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play reverse play reverse", // Plays AND reverses
});
```

#### **Bidirectional Implementation Requirements:**
- Use `scrub` property for scroll-linked bidirectional behavior (preferred)
- If using triggers, set `toggleActions: "play reverse play reverse"`
- Set both `start` and `end` points to define the scroll range
- Test both scroll directions: down (forward) and up (reverse)
- Ensure accessibility announcements work for both directions

### **Core AnimationService Class**
```typescript
// src/AnimationService/AnimationService.ts
import { BaseService, IService, ServiceConfiguration, ComponentError } from '@voder/shared';
import { gsap, ScrollTrigger } from 'gsap';
import { Timeline } from './Timeline.js';
import { AnimationQueue } from './AnimationQueue.js';
import { PerformanceMonitor } from './PerformanceMonitor.js';

export interface AnimationServiceConfig extends ServiceConfiguration {
  readonly enableScrollTrigger?: boolean;
  readonly enablePerformanceMonitoring?: boolean;
  readonly defaultDuration?: number;
  readonly defaultEasing?: string;
  readonly maxConcurrentAnimations?: number;
}

export interface AnimationCommand {
  readonly id: string;
  readonly targets: Element | Element[] | string;
  readonly properties: Record<string, any>;
  readonly duration?: number;
  readonly ease?: string;
  readonly delay?: number;
  readonly onComplete?: () => void;
  readonly onUpdate?: (progress: number) => void;
}

export interface ScrollTriggerConfig {
  readonly trigger: Element | string;
  readonly start?: string;
  readonly end?: string;
  readonly scrub: number | boolean; // REQUIRED: All animations must be scroll-scrubbed
  readonly pin?: boolean;
  readonly pinSpacing?: boolean;
  readonly markers?: boolean;
  readonly onUpdate?: (self: any) => void;
}

export interface TimelineConfig {
  readonly id: string;
  readonly paused?: boolean;
  readonly repeat?: number;
  readonly yoyo?: boolean;
  readonly scrollTrigger?: ScrollTriggerConfig; // CRITICAL: Most timelines should use scroll-scrubbing
  readonly onComplete?: () => void;
}

export class AnimationService extends BaseService implements IService {
  private gsapInstance: typeof gsap;
  private timelines = new Map<string, Timeline>();
  private animationQueue: AnimationQueue;
  private performanceMonitor: PerformanceMonitor;
  private config: AnimationServiceConfig;

  constructor(config: AnimationServiceConfig) {
    super('AnimationService', '1.0.0');
    this.config = {
      enableScrollTrigger: true,
      enablePerformanceMonitoring: true,
      defaultDuration: 0.3,
      defaultEasing: 'power2.out',
      maxConcurrentAnimations: 10,
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      // Initialize GSAP
      this.gsapInstance = gsap;
      
      // Register ScrollTrigger plugin if enabled
      if (this.config.enableScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      // Initialize subsystems
      this.animationQueue = new AnimationQueue(this.config.maxConcurrentAnimations!);
      
      if (this.config.enablePerformanceMonitoring) {
        this.performanceMonitor = new PerformanceMonitor();
      }

      // Check for reduced motion preference
      this.setupReducedMotionSupport();
      
      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'initialize');
    }
  }

  async shutdown(): Promise<void> {
    try {
      // Kill all active animations
      this.gsapInstance.killTweensOf('*');
      
      // Clear all timelines
      this.timelines.forEach(timeline => timeline.destroy());
      this.timelines.clear();
      
      // Shutdown subsystems
      this.animationQueue?.destroy();
      this.performanceMonitor?.destroy();
      
      // Clean up ScrollTrigger
      if (this.config.enableScrollTrigger) {
        ScrollTrigger.killAll();
      }
      
      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'shutdown');
    }
  }

  /**
   * Animate elements with GSAP
   */
  async animate(command: AnimationCommand): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const config = {
          duration: command.duration ?? this.config.defaultDuration,
          ease: command.ease ?? this.config.defaultEasing,
          delay: command.delay ?? 0,
          onComplete: () => {
            command.onComplete?.();
            resolve();
          },
          onUpdate: () => {
            const progress = this.gsapInstance.getProperty(command.targets, 'progress') as number;
            command.onUpdate?.(progress);
          },
          ...command.properties
        };

        this.performanceMonitor?.startTracking(command.id);
        
        const tween = this.gsapInstance.to(command.targets, config);
        
        this.animationQueue.add({
          id: command.id,
          tween,
          onComplete: () => {
            this.performanceMonitor?.endTracking(command.id);
          }
        });
        
      } catch (error) {
        this.performanceMonitor?.endTracking(command.id);
        reject(new ComponentError(
          `Animation failed: ${error.message}`,
          command.id,
          'animate',
          error as Error
        ));
      }
    });
  }

  /**
   * Create and manage animation timeline
   * CRITICAL: For Voder website, most timelines MUST use scroll-scrubbing
   */
  createTimeline(config: TimelineConfig): Timeline {
    if (this.timelines.has(config.id)) {
      throw new Error(`Timeline ${config.id} already exists`);
    }

    const timeline = new Timeline(config, this.gsapInstance);
    this.timelines.set(config.id, timeline);
    
    return timeline;
  }

  /**
   * Create scroll-scrubbed timeline (REQUIRED for Voder website animations)
   * All animations must progress with scroll position, not time-based duration
   */
  createScrollTimeline(config: TimelineConfig & { scrollTrigger: ScrollTriggerConfig }): Timeline {
    // Validate that scrub is provided (required for Voder website)
    if (config.scrollTrigger.scrub === undefined) {
      throw new ComponentError(
        'Scrub value is required for scroll-tied animations',
        config.id,
        'createScrollTimeline',
        new Error('Missing scrub configuration')
      );
    }

    const timeline = this.createTimeline(config);
    
    // Apply ScrollTrigger with scrub (scroll-tied animation)
    ScrollTrigger.create({
      trigger: config.scrollTrigger.trigger,
      start: config.scrollTrigger.start ?? 'top bottom',
      end: config.scrollTrigger.end ?? 'bottom top',
      scrub: config.scrollTrigger.scrub, // CRITICAL: Animation tied to scroll position
      pin: config.scrollTrigger.pin,
      pinSpacing: config.scrollTrigger.pinSpacing,
      markers: config.scrollTrigger.markers,
      animation: timeline.getGSAPTimeline(),
      onUpdate: config.scrollTrigger.onUpdate
    });

    return timeline;
  }

  /**
   * Get existing timeline
   */
  getTimeline(id: string): Timeline | undefined {
    return this.timelines.get(id);
  }

  /**
   * Remove and destroy timeline
   */
  destroyTimeline(id: string): void {
    const timeline = this.timelines.get(id);
    if (timeline) {
      timeline.destroy();
      this.timelines.delete(id);
    }
  }

  /**
   * Kill specific animation
   */
  killAnimation(targets: Element | Element[] | string): void {
    this.gsapInstance.killTweensOf(targets);
  }

  /**
   * Pause all animations
   */
  pauseAll(): void {
    this.gsapInstance.globalTimeline.pause();
  }

  /**
   * Resume all animations
   */
  resumeAll(): void {
    this.gsapInstance.globalTimeline.resume();
  }

  /**
   * Get animation performance metrics
   */
  getPerformanceMetrics(): any {
    return this.performanceMonitor?.getMetrics() ?? {};
  }

  /**
   * Monitor transition performance for frame rate and timing validation
   */
  createTransitionPerformanceMonitor(transitionId: string): TransitionPerformanceMonitor {
    return new TransitionPerformanceMonitor(transitionId, this.performanceMonitor);
  }

  private setupReducedMotionSupport(): void {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleReducedMotion = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        // Disable animations for reduced motion
        this.gsapInstance.globalTimeline.timeScale(0.01);
        this.gsapInstance.defaults({ duration: 0.01 });
      } else {
        // Restore normal animation settings
        this.gsapInstance.globalTimeline.timeScale(1);
        this.gsapInstance.defaults({ 
          duration: this.config.defaultDuration,
          ease: this.config.defaultEasing 
        });
      }
    };

    handleReducedMotion(mediaQuery);
    mediaQuery.addListener(handleReducedMotion);
  }
}
```

### **🎯 SCROLL-SCRUBBED ANIMATION USAGE EXAMPLES**

**Example 1: Basic Scroll-Tied Section Animation**
```typescript
// ✅ CORRECT - Scroll-scrubbed animation for section transitions
const animationService = serviceContainer.get<AnimationService>('AnimationService');

const timeline = animationService.createScrollTimeline({
  id: 'brand-entry-animation',
  scrollTrigger: {
    trigger: '.brand-entry-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1, // CRITICAL: Animation tied to scroll position
    markers: false
  }
});

timeline
  .to('.brand-entry-title', { opacity: 1, y: 0, duration: 1 })
  .to('.brand-entry-subtitle', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
  .to('.brand-entry-canvas', { scale: 1, duration: 2 }, '-=0.8');
```

**Example 2: Complex Multi-Element Scroll Animation**
```typescript
// ✅ CORRECT - Multiple elements animated in sync with scroll
const timeline = animationService.createScrollTimeline({
  id: 'problem-space-reveal',
  scrollTrigger: {
    trigger: '.problem-space-section',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: true, // Immediate response to scroll velocity
    pin: true, // Pin section during animation
    pinSpacing: false
  }
});

timeline
  .fromTo('.problem-text', 
    { opacity: 0, x: -100 },
    { opacity: 1, x: 0, duration: 2 }
  )
  .fromTo('.problem-visual', 
    { opacity: 0, scale: 0.5 },
    { opacity: 1, scale: 1, duration: 2 }
  , '-=1')
  .to('.background-particles', 
    { opacity: 0.3, duration: 1 }
  );
```

**Example 3: Scroll-Triggered Timeline with Error Handling**
```typescript
// ✅ CORRECT - Proper error handling for scroll animations
try {
  const timeline = animationService.createScrollTimeline({
    id: 'vision-flow-sequence',
    scrollTrigger: {
      trigger: '.vision-flow-section',
      start: 'top center',
      end: 'bottom center',
      scrub: 2, // Smoothed scroll response
      onUpdate: (self) => {
        // Optional: Update progress indicators
        console.log(`Animation progress: ${self.progress * 100}%`);
      }
    }
  });

  timeline
    .to('.step-1', { opacity: 1, scale: 1, duration: 1 })
    .to('.step-2', { opacity: 1, scale: 1, duration: 1 })
    .to('.step-3', { opacity: 1, scale: 1, duration: 1 })
    .to('.flow-connector', { scaleX: 1, duration: 2 }, '-=2');

} catch (error) {
  console.error('Failed to create scroll timeline:', error);
  // Fallback: create simple fade-in animation
  animationService.animate({
    id: 'vision-flow-fallback',
    targets: '.vision-flow-section',
    properties: { opacity: 1 },
    duration: 0.3
  });
}
```

**❌ ANTI-PATTERN: Scroll-Triggered Animation (FORBIDDEN)**
```typescript
// ❌ NEVER DO THIS - Trigger-based animation violates Voder requirements
ScrollTrigger.create({
  trigger: '.section',
  start: 'top 80%',
  onEnter: () => {
    // This creates time-based animation independent of scroll position
    gsap.to('.element', { opacity: 1, duration: 2 });
  }
});
```

### **Timeline Management**
```typescript
// src/AnimationService/Timeline.ts
import { TimelineConfig } from './AnimationService.js';
import { gsap } from 'gsap';

export class Timeline {
  private timeline: gsap.core.Timeline;
  private config: TimelineConfig;

  constructor(config: TimelineConfig, gsapInstance: typeof gsap) {
    this.config = config;
    this.timeline = gsapInstance.timeline({
      paused: config.paused ?? false,
      repeat: config.repeat ?? 0,
      yoyo: config.yoyo ?? false,
      onComplete: config.onComplete
    });
  }

  /**
   * Add animation to timeline
   */
  to(targets: any, vars: any, position?: string | number): this {
    this.timeline.to(targets, vars, position);
    return this;
  }

  /**
   * Add from animation to timeline
   */
  from(targets: any, vars: any, position?: string | number): this {
    this.timeline.from(targets, vars, position);
    return this;
  }

  /**
   * Add fromTo animation to timeline
   */
  fromTo(targets: any, fromVars: any, toVars: any, position?: string | number): this {
    this.timeline.fromTo(targets, fromVars, toVars, position);
    return this;
  }

  /**
   * Add label to timeline
   */
  addLabel(label: string, position?: string | number): this {
    this.timeline.addLabel(label, position);
    return this;
  }

  /**
   * Play timeline
   */
  play(): this {
    this.timeline.play();
    return this;
  }

  /**
   * Pause timeline
   */
  pause(): this {
    this.timeline.pause();
    return this;
  }

  /**
   * Reverse timeline
   */
  reverse(): this {
    this.timeline.reverse();
    return this;
  }

  /**
   * Restart timeline
   */
  restart(): this {
    this.timeline.restart();
    return this;
  }

  /**
   * Seek to specific time or label
   */
  seek(position: string | number): this {
    this.timeline.seek(position);
    return this;
  }

  /**
   * Get timeline duration
   */
  duration(): number {
    return this.timeline.duration();
  }

  /**
   * Get timeline progress (0-1)
   */
  progress(): number {
    return this.timeline.progress();
  }

  /**
   * Set timeline progress (0-1)
   */
  setProgress(progress: number): this {
    this.timeline.progress(progress);
    return this;
  }

  /**
   * Check if timeline is active
   */
  isActive(): boolean {
    return this.timeline.isActive();
  }

  /**
   * Destroy timeline
   */
  destroy(): void {
    this.timeline.kill();
  }
}
```

## 👀 **SCROLL SERVICE IMPLEMENTATION**

### **Core ScrollService Class**
```typescript
// src/ScrollService/ScrollService.ts
import { BaseService, IService, ServiceConfiguration } from '@voder/shared';
import { IntersectionManager } from './IntersectionManager.js';
import { ScrollEventManager } from './ScrollEventManager.js';
import { Observable } from '../utils/observable.js';

export interface ScrollServiceConfig extends ServiceConfiguration {
  readonly throttleMs?: number;
  readonly rootMargin?: string;
  readonly threshold?: number | number[];
}

export interface ScrollObservationRequest {
  readonly id: string;
  readonly element: Element;
  readonly threshold?: number | number[];
  readonly rootMargin?: string;
  readonly once?: boolean;
}

export interface ScrollEvent {
  readonly type: 'enter' | 'exit' | 'scroll';
  readonly target: Element;
  readonly intersectionRatio: number;
  readonly boundingClientRect: DOMRectReadOnly;
  readonly rootBounds: DOMRectReadOnly | null;
  readonly timestamp: number;
}

export class ScrollService extends BaseService implements IService {
  private intersectionManager: IntersectionManager;
  private scrollEventManager: ScrollEventManager;
  private scrollObservable: Observable<ScrollEvent>;
  private config: ScrollServiceConfig;

  constructor(config: ScrollServiceConfig) {
    super('ScrollService', '1.0.0');
    this.config = {
      throttleMs: 16, // 60fps
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      // Initialize observable for scroll events
      this.scrollObservable = new Observable<ScrollEvent>();

      // Initialize intersection management
      this.intersectionManager = new IntersectionManager({
        rootMargin: this.config.rootMargin!,
        threshold: this.config.threshold!,
        onIntersection: (event) => this.scrollObservable.next(event)
      });

      // Initialize scroll event management
      this.scrollEventManager = new ScrollEventManager({
        throttleMs: this.config.throttleMs!,
        onScroll: (event) => this.scrollObservable.next(event)
      });

      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'initialize');
    }
  }

  async shutdown(): Promise<void> {
    try {
      this.intersectionManager?.destroy();
      this.scrollEventManager?.destroy();
      this.scrollObservable?.complete();
      
      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'shutdown');
    }
  }

  /**
   * Observe element for intersection changes
   */
  observe(request: ScrollObservationRequest): () => void {
    return this.intersectionManager.observe(request);
  }

  /**
   * Unobserve element
   */
  unobserve(element: Element): void {
    this.intersectionManager.unobserve(element);
  }

  /**
   * Subscribe to scroll events
   */
  subscribe(handler: (event: ScrollEvent) => void): () => void {
    return this.scrollObservable.subscribe(handler);
  }

  /**
   * Get current scroll position
   */
  getScrollPosition(): { x: number; y: number } {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }

  /**
   * Get document dimensions
   */
  getDocumentDimensions(): { width: number; height: number } {
    return {
      width: Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
      ),
      height: Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
    };
  }

  /**
   * Get viewport dimensions
   */
  getViewportDimensions(): { width: number; height: number } {
    return {
      width: window.innerWidth || document.documentElement.clientWidth,
      height: window.innerHeight || document.documentElement.clientHeight
    };
  }

  /**
   * Smooth scroll to element
   */
  scrollToElement(element: Element, options: ScrollIntoViewOptions = {}): void {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options
    });
  }

  /**
   * Smooth scroll to position
   */
  scrollToPosition(x: number, y: number): void {
    window.scrollTo({
      left: x,
      top: y,
      behavior: 'smooth'
    });
  }
}
```

## ♿ **ACCESSIBILITY SERVICE IMPLEMENTATION**

### **Core AccessibilityService Class**
```typescript
// src/AccessibilityService/AccessibilityService.ts
import { BaseService, IService, ServiceConfiguration, ARIA_ROLES, ARIA_LIVE, KEYBOARD_KEYS } from '@voder/shared';
import { AriaManager } from './AriaManager.js';
import { ScreenReaderManager } from './ScreenReaderManager.js';
import { KeyboardManager } from './KeyboardManager.js';
import { FocusManager } from './FocusManager.js';

export interface AccessibilityServiceConfig extends ServiceConfiguration {
  readonly enableScreenReader?: boolean;
  readonly enableKeyboardNavigation?: boolean;
  readonly enableFocusManagement?: boolean;
  readonly announcePolitely?: boolean;
}

export interface AriaCommand {
  readonly element: Element;
  readonly attributes: Record<string, string>;
}

export interface ScreenReaderAnnouncement {
  readonly message: string;
  readonly priority?: 'polite' | 'assertive';
  readonly delay?: number;
}

export interface KeyboardNavigationConfig {
  readonly element: Element;
  readonly keys: string[];
  readonly handler: (event: KeyboardEvent) => void;
}

export class AccessibilityService extends BaseService implements IService {
  private ariaManager: AriaManager;
  private screenReaderManager: ScreenReaderManager;
  private keyboardManager: KeyboardManager;
  private focusManager: FocusManager;
  private config: AccessibilityServiceConfig;

  constructor(config: AccessibilityServiceConfig) {
    super('AccessibilityService', '1.0.0');
    this.config = {
      enableScreenReader: true,
      enableKeyboardNavigation: true,
      enableFocusManagement: true,
      announcePolitely: true,
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      // Initialize subsystems
      this.ariaManager = new AriaManager();
      
      if (this.config.enableScreenReader) {
        this.screenReaderManager = new ScreenReaderManager({
          defaultPriority: this.config.announcePolitely ? 'polite' : 'assertive'
        });
      }

      if (this.config.enableKeyboardNavigation) {
        this.keyboardManager = new KeyboardManager();
      }

      if (this.config.enableFocusManagement) {
        this.focusManager = new FocusManager();
      }

      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'initialize');
    }
  }

  async shutdown(): Promise<void> {
    try {
      this.ariaManager?.destroy();
      this.screenReaderManager?.destroy();
      this.keyboardManager?.destroy();
      this.focusManager?.destroy();
      
      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'shutdown');
    }
  }

  /**
   * Set ARIA attributes on element
   */
  setAria(command: AriaCommand): void {
    this.ariaManager.setAttributes(command.element, command.attributes);
  }

  /**
   * Remove ARIA attributes from element
   */
  removeAria(element: Element, attributes: string[]): void {
    this.ariaManager.removeAttributes(element, attributes);
  }

  /**
   * Announce message to screen readers
   */
  announce(announcement: ScreenReaderAnnouncement): void {
    if (!this.screenReaderManager) return;
    
    this.screenReaderManager.announce(
      announcement.message,
      announcement.priority ?? 'polite',
      announcement.delay
    );
  }

  /**
   * Set up keyboard navigation for element
   */
  setupKeyboardNavigation(config: KeyboardNavigationConfig): () => void {
    if (!this.keyboardManager) {
      return () => {}; // No-op cleanup function
    }
    
    return this.keyboardManager.addHandler(
      config.element,
      config.keys,
      config.handler
    );
  }

  /**
   * Manage focus for element
   */
  manageFocus(element: Element): void {
    if (!this.focusManager) return;
    
    this.focusManager.focus(element);
  }

  /**
   * Set focus trap within container
   */
  setFocusTrap(container: Element): () => void {
    if (!this.focusManager) {
      return () => {}; // No-op cleanup function
    }
    
    return this.focusManager.trapFocus(container);
  }

  /**
   * Get all focusable elements within container
   */
  getFocusableElements(container: Element): Element[] {
    if (!this.focusManager) return [];
    
    return this.focusManager.getFocusableElements(container);
  }

  /**
   * Check if element is visible to screen readers
   */
  isVisibleToScreenReaders(element: Element): boolean {
    return this.ariaManager.isVisibleToScreenReaders(element);
  }

  /**
   * Set element as landmark
   */
  setLandmark(element: Element, role: string, label?: string): void {
    const attributes: Record<string, string> = { role };
    
    if (label) {
      attributes['aria-label'] = label;
    }
    
    this.setAria({ element, attributes });
  }

  /**
   * Update live region content
   */
  updateLiveRegion(element: Element, content: string, priority: 'polite' | 'assertive' = 'polite'): void {
    this.setAria({
      element,
      attributes: {
        'aria-live': priority,
        'aria-atomic': 'true'
      }
    });
    
    element.textContent = content;
  }
}
```

## 📦 **ASSET SERVICE IMPLEMENTATION**

### **Core AssetService Class**
```typescript
// src/AssetService/AssetService.ts
import { BaseService, IService, ServiceConfiguration, retry } from '@voder/shared';
import { AssetCache } from './AssetCache.js';
import { LoaderRegistry } from './LoaderRegistry.js';
import { FontLoader, ImageLoader, ModelLoader } from './loaders/index.js';

export interface AssetServiceConfig extends ServiceConfiguration {
  readonly cacheSize?: number;
  readonly enablePreloading?: boolean;
  readonly retryAttempts?: number;
  readonly timeout?: number;
}

export interface AssetRequest {
  readonly url: string;
  readonly type: 'font' | 'image' | 'model' | 'json';
  readonly options?: Record<string, any>;
  readonly preload?: boolean;
}

export interface Asset {
  readonly url: string;
  readonly type: string;
  readonly data: any;
  readonly size: number;
  readonly loadedAt: Date;
}

export class AssetService extends BaseService implements IService {
  private cache: AssetCache;
  private loaderRegistry: LoaderRegistry;
  private config: AssetServiceConfig;

  constructor(config: AssetServiceConfig) {
    super('AssetService', '1.0.0');
    this.config = {
      cacheSize: 100,
      enablePreloading: true,
      retryAttempts: 3,
      timeout: 30000,
      ...config
    };
  }

  async initialize(): Promise<void> {
    try {
      // Initialize cache
      this.cache = new AssetCache(this.config.cacheSize!);

      // Initialize loader registry
      this.loaderRegistry = new LoaderRegistry();

      // Register built-in loaders
      this.loaderRegistry.register('font', new FontLoader());
      this.loaderRegistry.register('image', new ImageLoader());
      this.loaderRegistry.register('model', new ModelLoader());

      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'initialize');
    }
  }

  async shutdown(): Promise<void> {
    try {
      this.cache?.clear();
      this.loaderRegistry?.destroy();
      
      this.updateHealth('healthy');
    } catch (error) {
      this.handleError(error as Error, 'shutdown');
    }
  }

  /**
   * Load asset with caching
   */
  async load(request: AssetRequest): Promise<Asset> {
    // Check cache first
    const cachedAsset = this.cache.get(request.url);
    if (cachedAsset) {
      return cachedAsset;
    }

    // Load asset with retry logic
    const asset = await retry(
      () => this.loadAsset(request),
      {
        maxAttempts: this.config.retryAttempts!,
        backoffMs: 1000,
        exponential: true
      }
    );

    // Cache the loaded asset
    this.cache.set(request.url, asset);

    return asset;
  }

  /**
   * Preload multiple assets
   */
  async preload(requests: AssetRequest[]): Promise<Asset[]> {
    if (!this.config.enablePreloading) {
      return [];
    }

    const loadPromises = requests.map(request => this.load(request));
    return Promise.all(loadPromises);
  }

  /**
   * Get asset from cache
   */
  getCached(url: string): Asset | null {
    return this.cache.get(url);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): any {
    return this.cache.getStats();
  }

  private async loadAsset(request: AssetRequest): Promise<Asset> {
    const loader = this.loaderRegistry.getLoader(request.type);
    if (!loader) {
      throw new Error(`No loader found for asset type: ${request.type}`);
    }

    const startTime = performance.now();
    
    try {
      const data = await loader.load(request.url, request.options);
      const loadTime = performance.now() - startTime;

      return {
        url: request.url,
        type: request.type,
        data,
        size: this.estimateAssetSize(data),
        loadedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to load asset ${request.url}: ${error.message}`);
    }
  }

  private estimateAssetSize(data: any): number {
    if (typeof data === 'string') {
      return data.length;
    }
    if (data instanceof ArrayBuffer) {
      return data.byteLength;
    }
    if (data instanceof Blob) {
      return data.size;
    }
    // Rough estimate for objects
    return JSON.stringify(data).length;
  }
}
```

## 🔧 **UTILITY IMPLEMENTATIONS**

### **Observable Implementation**
```typescript
// src/utils/observable.ts
export type Observer<T> = (value: T) => void;
export type Subscription = () => void;

export class Observable<T> {
  private observers: Set<Observer<T>> = new Set();
  private completed = false;

  /**
   * Subscribe to observable
   */
  subscribe(observer: Observer<T>): Subscription {
    if (this.completed) {
      return () => {}; // No-op for completed observables
    }

    this.observers.add(observer);
    
    return () => {
      this.observers.delete(observer);
    };
  }

  /**
   * Emit next value
   */
  next(value: T): void {
    if (this.completed) return;
    
    this.observers.forEach(observer => {
      try {
        observer(value);
      } catch (error) {
        console.error('Observer error:', error);
      }
    });
  }

  /**
   * Complete observable
   */
  complete(): void {
    this.completed = true;
    this.observers.clear();
  }

  /**
   * Create observable from event target
   */
  static fromEvent<T extends Event>(
    target: EventTarget,
    eventType: string
  ): Observable<T> {
    const observable = new Observable<T>();
    
    const handler = (event: Event) => {
      observable.next(event as T);
    };
    
    target.addEventListener(eventType, handler);
    
    // Return observable with cleanup
    return Object.assign(observable, {
      destroy: () => {
        target.removeEventListener(eventType, handler);
        observable.complete();
      }
    });
  }
}
```

## 📦 **EXPORT STRUCTURE**

### **Main Export Barrel**
```typescript
// src/index.ts
// Service exports
export { AnimationService } from './AnimationService/index.js';
export { ScrollService } from './ScrollService/index.js';
export { AccessibilityService } from './AccessibilityService/index.js';
export { AssetService } from './AssetService/index.js';

// Type exports
export type * from './AnimationService/types.js';
export type * from './ScrollService/types.js';
export type * from './AccessibilityService/types.js';
export type * from './AssetService/types.js';

// Utility exports
export * from './utils/index.js';
```

### **Service-Specific Exports**
```typescript
// src/AnimationService/index.ts
export { AnimationService } from './AnimationService.js';
export { Timeline } from './Timeline.js';
export type * from './types.js';

// src/ScrollService/index.ts
export { ScrollService } from './ScrollService.js';
export type * from './types.js';

// src/AccessibilityService/index.ts
export { AccessibilityService } from './AccessibilityService.js';
export type * from './types.js';

// src/AssetService/index.ts
export { AssetService } from './AssetService.js';
export type * from './types.js';
```

## 🧪 **TESTING REQUIREMENTS**

### **Service Testing Standards**
- **Unit tests**: Test each service in isolation with mocked dependencies
- **Integration tests**: Test service interactions and lifecycle management
- **Performance tests**: Verify services meet performance thresholds
- **Accessibility tests**: Ensure accessibility service provides proper ARIA support

### **Test Structure Example**
```typescript
// tests/AnimationService.test.ts
describe('AnimationService', () => {
  let service: AnimationService;
  
  beforeEach(async () => {
    service = new AnimationService({
      id: 'test',
      enablePerformanceMonitoring: false
    });
    await service.initialize();
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('animate', () => {
    it('should animate element properties', async () => {
      const element = document.createElement('div');
      document.body.appendChild(element);
      
      await service.animate({
        id: 'test-animation',
        targets: element,
        properties: { opacity: 0.5 },
        duration: 0.1
      });
      
      expect(element.style.opacity).toBe('0.5');
    });
  });
});
```

## 📊 **PERFORMANCE CONSIDERATIONS**

### **Animation Performance**
- Use GPU-accelerated properties (transform, opacity)
- Implement animation queuing to prevent overload
- Monitor frame rates and adjust accordingly
- Provide reduced motion fallbacks

### **Asset Loading Performance**
- Implement intelligent caching strategies
- Use progressive loading for large assets
- Provide loading states and error handling
- Support asset preloading and lazy loading

### **Memory Management**
- Clean up observers and event listeners
- Implement cache size limits and eviction policies
- Monitor memory usage in development
- Provide cleanup methods for all services

## 🔒 **SECURITY & ACCESSIBILITY**

### **Security Patterns**
- Validate all asset URLs before loading
- Sanitize content in accessibility announcements
- Implement CSP-compliant loading strategies
- Handle errors gracefully without exposing internals

### **Accessibility Standards**
- Support WCAG 2.1 AA compliance
- Provide proper ARIA attribute management
- Implement keyboard navigation support
- Support screen reader announcements
- Respect user motion preferences

## 📚 **USAGE EXAMPLES**

### **Animation Service Usage**
```typescript
import { AnimationService } from '@voder/services';

const animationService = new AnimationService({
  id: 'main-animation-service',
  enableScrollTrigger: true
});

await animationService.initialize();

// Animate element
await animationService.animate({
  id: 'fade-in',
  targets: '.hero-section',
  properties: { opacity: 1, y: 0 },
  duration: 0.6,
  ease: 'power2.out'
});

// Create timeline
const timeline = animationService.createTimeline({
  id: 'intro-sequence'
});

timeline
  .from('.logo', { scale: 0, duration: 0.5 })
  .to('.tagline', { opacity: 1, duration: 0.3 }, '-=0.2')
  .play();
```

### **Accessibility Service Usage**
```typescript
import { AccessibilityService } from '@voder/services';

const a11yService = new AccessibilityService({
  id: 'accessibility-service'
});

await a11yService.initialize();

// Set ARIA attributes
a11yService.setAria({
  element: navigationElement,
  attributes: {
    'role': 'navigation',
    'aria-label': 'Main navigation'
  }
});

// Announce to screen readers
a11yService.announce({
  message: 'Content updated',
  priority: 'polite'
});

// Setup keyboard navigation
const cleanup = a11yService.setupKeyboardNavigation({
  element: modal,
  escapeHandler: () => modal.close(),
  focusLock: true
});

// Cleanup when component unmounts
cleanup();
```

## 🎯 **Transition Performance Monitoring**

### **TransitionPerformanceMonitor Class**

```typescript
// src/AnimationService/TransitionPerformanceMonitor.ts
export class TransitionPerformanceMonitor {
  private startTime: number = 0;
  private frameCount: number = 0;
  private droppedFrames: number = 0;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;
  
  constructor(
    private transitionId: string,
    private performanceMonitor?: PerformanceMonitor
  ) {}

  /**
   * Start monitoring transition performance
   */
  startMonitoring(): void {
    this.startTime = performance.now();
    this.frameCount = 0;
    this.droppedFrames = 0;
    this.lastFrameTime = this.startTime;
    this.startFrameRateMonitoring();
  }

  /**
   * Stop monitoring and return performance metrics
   */
  stopMonitoring(): TransitionPerformanceMetrics {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const totalTime = performance.now() - this.startTime;
    const averageFps = this.frameCount > 0 ? (this.frameCount / (totalTime / 1000)) : 0;
    const frameDropPercentage = this.frameCount > 0 ? (this.droppedFrames / this.frameCount) * 100 : 0;

    const metrics: TransitionPerformanceMetrics = {
      transitionId: this.transitionId,
      totalDuration: totalTime,
      frameCount: this.frameCount,
      droppedFrames: this.droppedFrames,
      averageFps,
      frameDropPercentage,
      performanceGrade: this.calculatePerformanceGrade(averageFps, frameDropPercentage)
    };

    this.performanceMonitor?.recordTransitionMetrics(metrics);
    return metrics;
  }

  /**
   * Check if transition timing matches specification
   */
  validateTiming(expectedDuration: number, tolerance: number = 100): boolean {
    const actualDuration = performance.now() - this.startTime;
    return Math.abs(actualDuration - expectedDuration) <= tolerance;
  }

  /**
   * Measure frame rate during transition
   */
  private startFrameRateMonitoring(): void {
    const measureFrame = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - this.lastFrameTime;
      
      this.frameCount++;
      
      // Check for dropped frames (>16.67ms = below 60fps)
      if (deltaTime > 16.67) {
        this.droppedFrames++;
        console.warn(`Transition ${this.transitionId}: Frame took ${deltaTime.toFixed(2)}ms (dropped frame detected)`);
      }
      
      this.lastFrameTime = currentTime;
      this.animationFrameId = requestAnimationFrame(measureFrame);
    };
    
    this.animationFrameId = requestAnimationFrame(measureFrame);
  }

  private calculatePerformanceGrade(fps: number, dropPercentage: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (fps >= 58 && dropPercentage < 2) return 'excellent';
    if (fps >= 50 && dropPercentage < 5) return 'good';
    if (fps >= 40 && dropPercentage < 10) return 'fair';
    return 'poor';
  }
}

export interface TransitionPerformanceMetrics {
  readonly transitionId: string;
  readonly totalDuration: number;
  readonly frameCount: number;
  readonly droppedFrames: number;
  readonly averageFps: number;
  readonly frameDropPercentage: number;
  readonly performanceGrade: 'excellent' | 'good' | 'fair' | 'poor';
}
```

### **Performance Monitoring Usage Example**

```typescript
// Example: Monitor transition performance during scroll-tied animation
class TransitionController {
  private performanceMonitor?: TransitionPerformanceMonitor;
  
  constructor(private config: TransitionConfig) {}
  
  async executeTransition(): Promise<void> {
    // Start performance monitoring
    this.performanceMonitor = animationService.createTransitionPerformanceMonitor(this.config.id);
    this.performanceMonitor.startMonitoring();
    
    try {
      // Execute scroll-tied animation
      const timeline = animationService.createScrollTimeline({
        id: this.config.id,
        scrollTrigger: {
          trigger: this.config.triggerElement,
          start: this.config.scrollStart,
          end: this.config.scrollEnd,
          scrub: 1,
          onUpdate: (self) => {
            // Validate timing during animation
            if (self.progress === 1) {
              const isTimingValid = this.performanceMonitor?.validateTiming(
                this.config.expectedDuration,
                100 // ±100ms tolerance
              );
              
              if (!isTimingValid) {
                console.warn(`Transition ${this.config.id}: Timing validation failed`);
              }
            }
          }
        }
      });
      
      // Build animation timeline
      this.config.phases.forEach(phase => {
        timeline.to(phase.elements, {
          ...phase.properties,
          duration: phase.duration,
          ease: phase.easing
        }, phase.startTime);
      });
      
    } finally {
      // Stop monitoring and log results
      if (this.performanceMonitor) {
        const metrics = this.performanceMonitor.stopMonitoring();
        
        if (metrics.performanceGrade === 'poor') {
          console.error(`Transition ${this.config.id} performance is poor:`, metrics);
        } else {
          console.log(`Transition ${this.config.id} performance:`, metrics);
        }
      }
    }
  }
}
```
  keys: ['Escape'],
  handler: (event) => closeModal()
});
```

This comprehensive implementation guide provides the foundation for creating robust, performant, and accessible services that power the entire Voder website component system.
