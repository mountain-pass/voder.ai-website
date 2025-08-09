# @voder/vision-flow-section Dependencies on @voder/services

This document specifies what the `@voder/vision-flow-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService**
**Required for**: Workflow visualization with progressive flow reveal

**Package-Specific Requirements:**
- **Flow progression mapping**: Scroll position directly mapped to workflow completion percentage
- **SVG path drawing coordination**: Flow connection lines drawn in sequence with step reveals
- **Interactive step detail animations**: Hover-triggered detail panels with coordinated timing
- **Staggered workflow reveals**: 6-8 workflow steps appearing with specific 200ms stagger timing
- **Performance-optimized flow rendering**: GPU-accelerated SVG animations for complex workflow diagrams

### **AccessibilityService**
**Required for**: Complex workflow diagram accessibility

**Package-Specific Requirements:**
- **Workflow narrative translation**: Text alternatives for visual workflow representations
- **Interactive flow navigation**: Keyboard controls for exploring workflow steps and details
- **Flow progress announcements**: Screen reader updates during workflow progression
- **Step detail accessibility**: ARIA structure for expandable workflow step information
- **Reduced motion workflow**: Static workflow diagram alternative for accessibility preferences

### **ScrollService**
**Required for**: Flow progression tracking and performance optimization

**Package-Specific Requirements:**
- **Workflow progression calculation**: Precise scroll-to-workflow-completion percentage mapping
- **Multi-step visibility tracking**: Intersection observation for 6-8 workflow steps
- **Performance-optimized updates**: Throttled scroll events during complex SVG rendering
- **Step detail coordination**: Viewport awareness for efficient step detail rendering

## 🔧 **INTEGRATION REQUIREMENTS**

### **With @voder/interactive-button-effect**
- **Animation coordination**: AnimationService timing must sync with interactive button effects
- **Accessibility coordination**: Keyboard navigation must work seamlessly with button interactions

### **Section-Specific Context**
- **Workflow visualization focus**: Complex multi-step process requiring careful progression timing
- **6-8 interconnected steps**: Multiple elements requiring coordinated reveal and connection animations
- **Interactive exploration**: Users can explore workflow steps requiring responsive detail systems
- **Performance-critical SVG rendering**: Complex workflow diagrams requiring optimized animation performance
- **Step Detail Accessibility**: Proper ARIA structure for expandable step information

**Usage Examples:**
```typescript
// Provide comprehensive flow context
this.services.accessibility.announceToScreenReader(
  'Voder workflow visualization: Four-step process from business intent to working product. ' +
  'Steps include: Business Intent, Source Prompts, Voder Processing, and Working Product. ' +
  'Use arrow keys to navigate through steps or Enter to expand details.',
  'polite'
);

// Handle reduced motion preferences
if (this.services.accessibility.prefersReducedMotion()) {
  this.config.visualization.enableFlowAnimation = false;
  this.config.interaction.allowFlowScrubbing = false;
  this.showStaticFlowDiagram();
}

// Set up flow diagram semantics
this.services.accessibility.setAriaAttributes(this.container, {
  'role': 'region',
  'aria-labelledby': 'vision-flow-heading',
  'aria-describedby': 'flow-description'
});

this.services.accessibility.setAriaAttributes(this.flowDiagram, {
  'role': 'img',
  'aria-label': 'Voder workflow diagram showing transformation from business intent to working product'
});

// Interactive step accessibility
this.flowSteps.forEach((step, index) => {
  const stepElement = this.getStepElement(step.id);
  
  this.services.accessibility.setAriaAttributes(stepElement, {
    'role': 'button',
    'tabindex': '0',
    'aria-label': `Step ${index + 1}: ${step.title}. ${step.description}. Press Enter for details.`,
    'aria-expanded': 'false'
  });
  
  this.services.accessibility.setupKeyboardNavigation(stepElement, {
    onEnter: () => this.expandStepDetails(step),
    onEscape: () => this.closeStepDetails(),
    onArrowKeys: (direction) => this.navigateToStep(direction)
  });
});

// Flow progression announcements
private announceFlowProgress(progress: number): void {
  const currentStepIndex = Math.floor(progress * this.flowSteps.length);
  const currentStep = this.flowSteps[currentStepIndex];
  
  if (currentStep && currentStep !== this.lastAnnouncedStep) {
    this.services.accessibility.announceToScreenReader(
      `Flow progress: ${currentStep.title} - ${currentStep.description}`,
      'polite'
    );
    this.lastAnnouncedStep = currentStep;
  }
}

// Step details panel accessibility
private setupStepDetailsAccessibility(panel: HTMLElement, step: FlowStep): void {
  this.services.accessibility.setAriaAttributes(panel, {
    'role': 'dialog',
    'aria-labelledby': `step-title-${step.id}`,
    'aria-describedby': `step-content-${step.id}`
  });
  
  // Focus management for modal-like behavior
  this.services.accessibility.manageFocus(panel, {
    trapFocus: true,
    returnFocus: this.getStepElement(step.id)
  });
}
```

### **ScrollService Implementation**
The Vision Flow section needs ScrollService for flow progression and step revelation:

**Required Functionality:**
```typescript
// Scroll position monitoring for flow progression
scrollService.observeScrollPosition(callback);
scrollService.getCurrentScrollPosition();

// Element visibility detection for flow phases
scrollService.observeElementVisibility(element, callback);

// Performance-optimized scroll handling
scrollService.throttleScrollUpdates(callback, interval);
```

**Specific Capabilities Needed:**
- **Flow Progression Control**: Map scroll progress to workflow step revelation and connection drawing
- **Performance-Optimized Updates**: Throttled scroll updates for smooth animation performance
- **Step Visibility Tracking**: Monitor when individual flow steps enter/exit viewport
- **Section Context Management**: Announce workflow section entry/exit for accessibility

**Usage Examples:**
```typescript
// Monitor scroll for flow progression
this.services.scroll.observeScrollPosition((position) => {
  const progress = this.calculateSectionProgress(position);
  this.updateFlowProgress(progress);
  this.syncFlowWithScroll(progress);
  this.updateLatticePatterns(progress);
});

// Performance-optimized scroll updates
this.services.scroll.throttleScrollUpdates((position) => {
  const progress = this.calculateSectionProgress(position);
  this.optimizedFlowUpdate(progress);
}, 16); // ~60fps

// Track section visibility for accessibility
this.services.scroll.observeElementVisibility(this.container, {
  onEnter: () => {
    this.services.accessibility.announceToScreenReader(
      'Entering Vision Flow section - Voder workflow visualization. ' +
      'This section shows the four-step transformation from business intent to working product.',
      'polite'
    );
  },
  onExit: () => {
    this.services.accessibility.announceToScreenReader(
      'Leaving Vision Flow section',
      'polite'
    );
  }
});

// Individual step visibility tracking
this.flowSteps.forEach((step, index) => {
  const stepElement = this.getStepElement(step.id);
  
  this.services.scroll.observeElementVisibility(stepElement, {
    threshold: 0.5,
    onEnter: () => {
      this.highlightFlowStep(step.id);
      this.services.accessibility.announceToScreenReader(
        `${step.title}: ${step.description}`,
        'polite'
      );
    },
    onExit: () => {
      this.unhighlightFlowStep(step.id);
    }
  });
});

// Flow scrubbing coordination
private setupFlowScrubbing(): void {
  this.services.scroll.observeScrollPosition((position) => {
    const progress = this.calculateSectionProgress(position);
    this.updateFlowScrubPosition(progress);
    this.syncFlowWithScroll(progress);
  });
}

// Performance monitoring for smooth flow animation
private monitorFlowPerformance(): void {
  this.services.scroll.throttleScrollUpdates((position) => {
    if (this.isPerformanceCritical()) {
      this.enableReducedQualityMode();
    } else {
      this.enableFullQualityMode();
    }
  }, 1000); // Check every second
}
```

## 📦 **REQUIRED EXPORTS**

The `@voder/services` package must export these service classes for Vision Flow section dependency injection:

```typescript
// Required exports from @voder/services
export { AnimationService } from './AnimationService/index.js';
export { AccessibilityService } from './AccessibilityService/index.js';
export { ScrollService } from './ScrollService/index.js';
```

## 🔄 **SERVICE LIFECYCLE REQUIREMENTS**

### **Constructor Injection Pattern**
The Vision Flow section uses constructor injection for service dependencies:

```typescript
// VisionFlowSection constructor pattern
constructor(
  container: HTMLElement,
  config: VisionFlowSectionConfig,
  services: {
    animation: AnimationService;
    accessibility: AccessibilityService;
    scroll: ScrollService;
  }
) {
  this.services = services;
}
```

### **Initialization Sequence**
Services must support the Vision Flow section's workflow-focused initialization:

```typescript
// Services used in initialization order
async initialize(): Promise<void> {
  // 1. Accessibility setup (critical path)
  this.setupFlowAccessibility();
  
  // 2. Performance optimization
  this.optimizeFlowPerformance();
  
  // 3. Flow visualization setup
  this.setupProgressiveFlowReveal();
  
  // 4. Interactive exploration setup
  this.setupInteractiveFlowExploration();
}
```

### **Performance Requirements**
Services must support the Vision Flow section's performance-critical visualization:

```typescript
// Performance-optimized flow animation
private optimizeFlowPerformance(): void {
  // Use GPU acceleration through animation service
  this.services.animation.enableGPUAcceleration(this.flowElements);
  
  // Throttle scroll updates through scroll service
  this.services.scroll.enablePerformanceMode({
    throttleInterval: 16, // 60fps
    debounceUpdates: true,
    useIntersectionObserver: true
  });
  
  // Reduce quality for low-performance devices
  if (this.isLowPerformanceDevice()) {
    this.config.visualization.enableFlowAnimation = false;
    this.showStaticFlowDiagram();
  }
}
```

## 🎯 **USAGE CONTEXT**

The Vision Flow section uses these services for:

### **1. Progressive Flow Revelation (scroll-tied)**
```typescript
// Flow progression mapped to scroll position
private updateFlowProgress(progress: number): void {
  const totalSteps = this.flowSteps.length;
  const currentStep = Math.floor(progress * (totalSteps + 1));
  
  this.flowSteps.forEach((step, index) => {
    const stepElement = this.getStepElement(step.id);
    const isRevealed = index < currentStep;
    
    if (isRevealed) {
      const stepProgress = Math.max(0, Math.min(1, (progress * totalSteps) - index));
      
      this.services.animation.animate({
        id: `step-reveal-${step.id}`,
        targets: stepElement,
        properties: {
          opacity: stepProgress,
          scale: 0.8 + (stepProgress * 0.2)
        },
        duration: 0,
        ease: "none"
      });
    }
  });
  
  this.updateProgressIndicator(progress);
}
```

### **2. Interactive Flow Exploration with Accessibility**
```typescript
// Step detail expansion with accessibility support
private expandStepDetails(step: FlowStep): void {
  const detailsPanel = this.createDetailsPanel(step);
  
  // Animate panel appearance
  this.services.animation.animate({
    id: 'step-details-expand',
    targets: detailsPanel,
    properties: {
      opacity: [0, 1],
      y: [30, 0],
      scale: [0.9, 1]
    },
    duration: 0.6,
    ease: "back.out(1.7)"
  });
  
  // Set up accessibility
  this.services.accessibility.setAriaAttributes(this.getStepElement(step.id), {
    'aria-expanded': 'true'
  });
  
  this.services.accessibility.manageFocus(detailsPanel, {
    trapFocus: true
  });
  
  // Announce expansion
  this.services.accessibility.announceToScreenReader(
    `${step.title} details expanded. ${step.details.expandedDescription}`,
    'polite'
  );
}
```

### **3. Performance-Optimized Flow Animation**
```typescript
// Smooth flow visualization with performance monitoring
private setupPerformanceOptimization(): void {
  // Enable GPU acceleration for flow elements
  this.flowElements.forEach(element => {
    this.services.animation.enableGPUAcceleration(element);
  });
  
  // Use throttled scroll updates
  this.services.scroll.throttleScrollUpdates((position) => {
    const progress = this.calculateSectionProgress(position);
    this.optimizedFlowUpdate(progress);
  }, 16);
  
  // Monitor performance and adapt
  this.services.scroll.observeScrollPosition((position) => {
    const fps = this.measureFrameRate();
    if (fps < 30) {
      this.enableReducedQualityMode();
    }
  });
}

private optimizedFlowUpdate(progress: number): void {
  // Batch DOM updates for better performance
  this.services.animation.batchUpdates(() => {
    this.updateFlowProgress(progress);
    this.updateConnectionLines(progress);
    this.updateLatticePatterns(progress);
  });
}
```

## 🚨 **CRITICAL REQUIREMENTS**

1. **Scroll-Scrubbed Flow**: All flow progression animations MUST use `scrub` property for scroll-tied behavior
2. **Performance Optimization**: Services must support GPU acceleration and throttled updates for smooth visualization
3. **Workflow Accessibility**: Flow diagram must have comprehensive text alternatives and keyboard navigation
4. **Interactive Step Support**: Hover effects and detail expansion must be accessible and performant
5. **Flow Progress Announcements**: Screen reader users need clear workflow progression updates
6. **Reduced Motion Compliance**: Static flow diagram must be available for accessibility

## 📝 **NOTES**

- Vision Flow section focuses on minimalist line-based design rather than complex visual effects
- Flow progression is central to understanding Voder's value proposition and must be clearly communicated
- Interactive step exploration allows users to dive deeper into workflow details at their own pace
- Performance optimization is critical since flow animation runs continuously during scroll
- Accessibility is paramount since workflow understanding is crucial for product comprehension
- No external asset loading required - section uses CSS/SVG for minimalist visualization
- Reduced motion users should receive meaningful static flow diagram with full interaction capabilities
- Screen reader experience should be comprehensive since workflow comprehension is essential
