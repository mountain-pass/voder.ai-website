# @voder/metaphor-section Dependencies on @voder/services

This document specifies what the `@voder/metaphor-section` package requires from `@voder/services` to implement the GPS vs Directions metaphor section with 3D visualization, interactive comparisons, and journey progression animations.

## 🎯 **PURPOSE**

The `@voder/metaphor-section` package needs specific services from `@voder/services` to:

1. **Metaphor Visualization Management**: 3D GPS scene rendering and route animation coordination
2. **Journey Progression Control**: Scroll-tied metaphor revelation and comparison emphasis
3. **Interactive Comparison Support**: Hover effects, keyboard navigation, and metaphor exploration
4. **Asset Loading**: 3D models, visual assets, and metaphor illustrations
5. **Accessibility Support**: Screen reader metaphor descriptions, keyboard navigation, reduced motion fallbacks

## 🔧 **REQUIRED SERVICE IMPLEMENTATIONS**

### **AnimationService Implementation**
The Metaphor section needs AnimationService for journey progression and metaphor visualization:

**Required Functionality:**
```typescript
// Used in MetaphorSection constructor injection
constructor(
  container: HTMLElement,
  config: MetaphorSectionConfig,
  services: {
    animation: AnimationService;
    // ... other services
  }
) {}

// Required methods for metaphor animation management
animationService.createTimeline(config);
animationService.createScrollTimeline(config); // For journey progression
animationService.animate(command);
animationService.morphSVG(from, to, config); // For route adaptation visualization
```

**Specific Capabilities Needed:**
- **Journey Progression Animation**: Scroll-tied route path drawing and marker activation (MUST use scrub)
- **Metaphor Revelation Control**: Sequential reveal of directions vs GPS comparisons
- **Interactive Visual Effects**: Hover states, glow effects, and emphasis animations
- **SVG Morphing Support**: Route adaptation visualization for GPS metaphor
- **3D Scene Coordination**: Integration with Canvas3DEffect for GPS visualization
- **Reduced Motion Alternatives**: Static metaphor presentations for accessibility

**Usage Examples:**
```typescript
// Scroll-tied journey progression
const journeyTimeline = this.services.animation.createScrollTimeline({
  id: 'metaphor-journey-progression',
  scrollTrigger: {
    trigger: this.container,
    start: "top center",
    end: "bottom center",
    scrub: 1, // CRITICAL: Must be scroll-scrubbed
    onUpdate: (self) => {
      this.updateJourneyProgress(self.progress);
      this.updateMetaphorVisibility(self.progress);
    }
  }
});

// Metaphor visualization phases
const directionsTimeline = this.services.animation.createScrollTimeline({
  id: 'directions-metaphor-reveal',
  scrollTrigger: {
    trigger: this.directionsContainer,
    start: "top 60%",
    end: "bottom 40%",
    scrub: 1
  }
});

directionsTimeline
  .to(this.directionsRoute, {
    strokeDashoffset: 0,
    duration: 2,
    ease: "none"
  })
  .to(this.obstacleMarkers, {
    opacity: 1,
    scale: 1,
    duration: 1,
    stagger: 0.2,
    ease: "back.out(1.7)"
  }, 0.5);

// GPS glow effect for Voder elements
this.services.animation.animate({
  id: 'voder-gps-glow',
  targets: this.gpsElements,
  properties: {
    filter: `drop-shadow(0 0 20px ${this.config.branding.interactiveColor})`
  },
  duration: 0.8,
  ease: "power2.inOut",
  yoyo: true,
  repeat: 1
});

// Route adaptation demonstration
this.services.animation.morphSVG(this.gpsRoute, this.alternativeRoute, {
  duration: 2,
  ease: "power2.inOut",
  onComplete: () => {
    this.services.accessibility.announceToScreenReader(
      'Route adaptation: Voder intelligently adjusts when requirements change',
      'polite'
    );
  }
});
```

### **AccessibilityService Implementation**
The Metaphor section needs AccessibilityService for complex metaphor accessibility:

**Required Functionality:**
```typescript
// Screen reader support for visual metaphors
accessibilityService.announceToScreenReader(message, priority);

// Reduced motion detection for 3D metaphors
accessibilityService.prefersReducedMotion();

// Focus management for interactive comparisons
accessibilityService.manageFocus(element, options);

// ARIA structure for comparison tables
accessibilityService.setAriaAttributes(element, attributes);

// Keyboard navigation coordination
accessibilityService.setupKeyboardNavigation(element, config);
```

**Specific Capabilities Needed:**
- **Metaphor Text Alternatives**: Comprehensive descriptions of GPS vs Directions visual metaphors
- **Reduced Motion Detection**: Detect and provide static comparison tables instead of animations
- **Interactive Comparison Accessibility**: Keyboard navigation for metaphor exploration
- **Journey Progress Announcements**: Screen reader updates for journey progression
- **Comparison Table Semantics**: Proper ARIA roles and structure for side-by-side comparisons

**Usage Examples:**
```typescript
// Provide comprehensive metaphor context
# @voder/metaphor-section Dependencies on @voder/services

This document specifies what the `@voder/metaphor-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService**
**Required for**: GPS metaphor visualization and route adaptation animations

**Package-Specific Requirements:**
- **SVG route morphing**: Path animations showing GPS route adaptation vs static directions
- **3D scene coordination**: Animation timing synchronized with Canvas3DEffect for GPS visualization
- **Dual metaphor reveals**: Coordinated timing for "Directions" vs "GPS" comparison sections
- **Interactive glow effects**: Hover states for GPS elements with branded glow (#24D1D5)
- **Journey progression mapping**: Scroll position directly tied to route completion percentage

### **AccessibilityService** 
**Required for**: Complex visual metaphor accessibility and comparison navigation

**Package-Specific Requirements:**
- **Metaphor translation**: Text alternatives for GPS vs Directions visual comparisons
- **Interactive comparison navigation**: Keyboard controls for exploring metaphor differences
- **Journey progress announcements**: Screen reader updates during route progression
- **Comparison table semantics**: ARIA structure for side-by-side GPS/Directions features
- **3D scene descriptions**: Alternative text for users who cannot see 3D GPS visualization

### **ScrollService**
**Required for**: Journey progression tracking and metaphor staging

**Package-Specific Requirements:** 
- **Journey progression calculation**: Precise scroll-to-route-completion mapping
- **Dual metaphor staging**: Different scroll thresholds for Directions vs GPS reveal timing
- **3D scene scroll coordination**: Viewport tracking for Canvas3DEffect performance optimization
- **Interactive element visibility**: Efficient rendering of comparison tables and route visualizations

### **AssetService**
**Required for**: GPS metaphor visual assets and route illustrations

**Package-Specific Requirements:**
- **Route SVG assets**: GPS route paths, obstacle markers, destination icons
- **Metaphor illustrations**: Visual comparison assets for Directions vs GPS concepts
- **Interactive element assets**: Hover state images, glow effect textures
- **3D GPS visualization assets**: Coordinate with Canvas3DEffect for GPS scene models

## 🔧 **INTEGRATION REQUIREMENTS**

### **With @voder/canvas-3d-effect**
- **Animation synchronization**: AnimationService timing must coordinate with 3D GPS scene updates
- **Asset coordination**: AssetService must handle both 2D metaphor assets and 3D scene assets
- **Performance handoff**: ScrollService must optimize 3D rendering based on section visibility

### **Section-Specific Context**
- **Dual metaphor presentation**: Split-screen Directions vs GPS comparison requiring coordinated reveals
- **Interactive exploration**: Hover and keyboard navigation through metaphor differences
- **Route adaptation demonstration**: Live visualization of GPS route changes vs static directions
- **Journey metaphor mapping**: User's scroll progress represents journey completion percentage;

// Handle reduced motion preferences
if (this.services.accessibility.prefersReducedMotion()) {
  this.config.visualization.enable3DMetaphor = false;
  this.config.visualization.showRouteAnimation = false;
  this.showStaticMetaphorComparison();
}

// Set up comparison table semantics
this.services.accessibility.setAriaAttributes(this.comparisonContainer, {
  'role': 'table',
  'aria-label': 'GPS versus Directions metaphor comparison'
});

this.comparisonRows.forEach((row, index) => {
  this.services.accessibility.setAriaAttributes(row, {
    'role': 'row',
    'aria-label': `Comparison of ${this.comparisonAspects[index]}: Traditional tools versus Voder`
  });
});

// Interactive comparison announcements
this.services.accessibility.setupKeyboardNavigation(this.comparisonContainer, {
  onFocus: (element) => {
    const approach = element.dataset.approach;
    const aspect = element.closest('.metaphor-comparison-row').querySelector('.comparison-aspect h3').textContent;
    this.services.accessibility.announceToScreenReader(
      `${approach === 'directions' ? 'Traditional tools' : 'Voder'} approach to ${aspect}`,
      'polite'
    );
  }
});

// Journey progression announcements
private announceJourneyProgress(progress: number): void {
  const phase = this.determineJourneyPhase(progress);
  if (phase !== this.currentPhase) {
    const phaseMessages = {
      intention: 'Journey begins: Setting destination with clear business intent',
      directions: 'Traditional approach: Multiple tools and complex navigation required',
      gps: 'Voder approach: Intelligent guidance handling complexity automatically',
      arrival: 'Journey complete: Working software matching original intent'
    };
    
    this.services.accessibility.announceToScreenReader(
      phaseMessages[phase],
      'polite'
    );
  }
}
```

### **ScrollService Implementation**
The Metaphor section needs ScrollService for journey progression and metaphor revelation:

**Required Functionality:**
```typescript
// Scroll position monitoring for journey progression
scrollService.observeScrollPosition(callback);
scrollService.getCurrentScrollPosition();

// Element visibility detection for metaphor phases
scrollService.observeElementVisibility(element, callback);

// Smooth scrolling for metaphor navigation
scrollService.scrollToElement(element, options);
```

**Specific Capabilities Needed:**
- **Journey Path Progression**: Map scroll progress to route drawing and marker activation
- **Metaphor Phase Control**: Control visibility and emphasis of directions vs GPS sections
- **Interactive Comparison Coordination**: Scroll-based comparison emphasis
- **Section Visibility Tracking**: Announce metaphor context when section enters/exits viewport

**Usage Examples:**
```typescript
// Monitor scroll for journey progression
this.services.scroll.observeScrollPosition((position) => {
  const progress = this.calculateSectionProgress(position);
  this.updateJourneyProgress(progress);
  this.updateMetaphorVisibility(progress);
  this.updateComparisonEmphasis(progress);
});

// Track section visibility for accessibility
this.services.scroll.observeElementVisibility(this.container, {
  onEnter: () => {
    this.services.accessibility.announceToScreenReader(
      'Entering Metaphor section - GPS versus Directions comparison. ' +
      'This section explains how Voder differs from traditional development tools.',
      'polite'
    );
  },
  onExit: () => {
    this.services.accessibility.announceToScreenReader(
      'Leaving Metaphor section',
      'polite'
    );
  }
});

// Individual metaphor phase visibility
this.services.scroll.observeElementVisibility(this.directionsContainer, {
  onEnter: () => {
    this.highlightDirectionsMetaphor();
    this.services.accessibility.announceToScreenReader(
      'Traditional tools metaphor: Giving you directions to follow',
      'polite'
    );
  }
});

this.services.scroll.observeElementVisibility(this.gpsContainer, {
  onEnter: () => {
    this.highlightGPSMetaphor();
    this.services.accessibility.announceToScreenReader(
      'Voder metaphor: Acting as your GPS to drive you to your destination',
      'polite'
    );
  }
});
```

### **AssetService Implementation**
The Metaphor section needs AssetService for 3D metaphor visualization and route assets:

**Required Functionality:**
```typescript
// 3D model loading for GPS metaphor
assetService.loadModel(url, options);

// SVG route path loading and caching
assetService.loadImage(url, options);

// Font loading for metaphor typography
assetService.loadFont(fontFamily, options);

// Asset preloading for smooth metaphor transitions
assetService.preloadAssets(assetList);
```

**Specific Capabilities Needed:**
- **3D Model Loading**: GPS device models, route visualization objects, and metaphor illustrations
- **SVG Path Management**: Complex route paths for directions vs GPS visualization
- **Icon and Illustration Loading**: Metaphor-specific visual elements and comparison icons
- **Performance Optimization**: Asset preloading for smooth metaphor transitions

**Usage Examples:**
```typescript
// Load 3D GPS metaphor assets
const gpsModels = await Promise.all([
  this.services.asset.loadModel('/assets/metaphor/gps-device.glb', {
    priority: 'high',
    cache: true
  }),
  this.services.asset.loadModel('/assets/metaphor/route-path-3d.glb', {
    priority: 'medium',
    cache: true
  }),
  this.services.asset.loadModel('/assets/metaphor/destination-marker.glb', {
    priority: 'medium',
    cache: true
  })
]);

// Load route visualization SVGs
const routeAssets = await Promise.all([
  this.services.asset.loadImage('/assets/metaphor/complex-directions-route.svg', {
    priority: 'high',
    cache: true
  }),
  this.services.asset.loadImage('/assets/metaphor/smart-gps-route.svg', {
    priority: 'high',
    cache: true
  }),
  this.services.asset.loadImage('/assets/metaphor/adaptive-route-alternative.svg', {
    priority: 'medium',
    cache: true
  })
]);

// Load metaphor comparison icons
const comparisonIcons = await this.services.asset.loadImage('/assets/metaphor/comparison-icons.svg', {
  priority: 'medium',
  cache: true
});

// Preload all metaphor assets for smooth experience
await this.services.asset.preloadAssets([
  ...gpsModels.map(model => model.url),
  ...routeAssets.map(asset => asset.url),
  comparisonIcons.url
]);

// Handle loading states for accessibility
this.services.accessibility.announceToScreenReader(
  'Loading metaphor visualization assets...',
  'polite'
);

// Announce when ready
this.services.accessibility.announceToScreenReader(
  'Metaphor visualization ready. GPS versus Directions comparison available.',
  'polite'
);
```

## 📦 **REQUIRED EXPORTS**

The `@voder/services` package must export these service classes for Metaphor section dependency injection:

```typescript
// Required exports from @voder/services
export { AnimationService } from './AnimationService/index.js';
export { AccessibilityService } from './AccessibilityService/index.js';
export { ScrollService } from './ScrollService/index.js';
export { AssetService } from './AssetService/index.js';
```

## 🔄 **SERVICE LIFECYCLE REQUIREMENTS**

### **Constructor Injection Pattern**
The Metaphor section uses constructor injection for service dependencies:

```typescript
// MetaphorSection constructor pattern
constructor(
  container: HTMLElement,
  config: MetaphorSectionConfig,
  services: {
    animation: AnimationService;
    accessibility: AccessibilityService;
    scroll: ScrollService;
    asset: AssetService;
  }
) {
  this.services = services;
}
```

### **Initialization Sequence**
Services must support the Metaphor section's visualization-focused initialization:

```typescript
// Services used in initialization order
async initialize(): Promise<void> {
  // 1. Asset loading (critical path)
  await this.loadMetaphorAssets();
  
  // 2. Accessibility setup
  this.setupMetaphorAccessibility();
  
  // 3. Journey progression setup
  this.setupJourneyProgression();
  
  // 4. Interactive comparison setup
  this.setupInteractiveComparison();
}
```

### **Performance Requirements**
Services must support the Metaphor section's 3D visualization needs:

```typescript
// 3D performance monitoring
private monitorVisualizationPerformance(): void {
  if (this.services.asset.isLowPerformanceDevice()) {
    this.config.visualization.enable3DMetaphor = false;
    this.showStaticMetaphorComparison();
    
    this.services.accessibility.announceToScreenReader(
      'Using simplified metaphor visualization for optimal performance',
      'polite'
    );
  }
}
```

## 🎯 **USAGE CONTEXT**

The Metaphor section uses these services for:

### **1. Journey Progression Visualization (scroll-tied)**
```typescript
// Journey path drawing tied to scroll progress
private updateJourneyProgress(progress: number): void {
  const pathLength = this.journeyPath.getTotalLength();
  const currentOffset = pathLength - (pathLength * progress);
  
  // Update path drawing through animation service
  this.services.animation.animate({
    id: 'journey-path-progress',
    targets: this.journeyPath,
    properties: {
      strokeDashoffset: currentOffset
    },
    duration: 0 // Immediate for scroll-tied behavior
  });
  
  // Update journey markers
  this.updateJourneyMarkers(progress);
  
  // Announce progress for accessibility
  this.announceJourneyProgress(progress);
}
```

### **2. 3D Metaphor Visualization with Asset Loading**
```typescript
// GPS metaphor 3D scene setup
private async setup3DMetaphor(): Promise<void> {
  // Load required 3D assets
  const gpsDevice = await this.services.asset.loadModel('/assets/metaphor/gps-device.glb');
  const routePath = await this.services.asset.loadModel('/assets/metaphor/route-path-3d.glb');
  
  // Initialize 3D scene with Canvas3DEffect
  this.gpsVisualization = new Canvas3DEffect(this.gpsContainer, {
    models: [gpsDevice, routePath],
    cameraPosition: [0, 5, 10],
    enableControls: false // Narrative-driven, not user-controlled
  }, {
    animation: this.services.animation,
    asset: this.services.asset
  });
  
  // Coordinate 3D animation with journey progression
  this.services.scroll.observeScrollPosition((position) => {
    const progress = this.calculateSectionProgress(position);
    this.gpsVisualization.updateProgress(progress);
  });
}
```

### **3. Interactive Comparison with Accessibility**
```typescript
// Metaphor comparison interactivity
private setupInteractiveComparison(): void {
  this.comparisonRows.forEach((row, index) => {
    const directionsSection = row.querySelector('.directions-approach');
    const gpsSection = row.querySelector('.gps-approach');
    
    // Hover effects with animation service
    directionsSection.addEventListener('mouseenter', () => {
      this.services.animation.animate({
        id: `directions-highlight-${index}`,
        targets: directionsSection,
        properties: {
          backgroundColor: this.config.branding.directionsColor + '20',
          scale: 1.02
        },
        duration: 0.3
      });
      
      this.services.accessibility.announceToScreenReader(
        `Traditional tools approach to ${this.getComparisonAspect(index)} highlighted`,
        'polite'
      );
    });
    
    gpsSection.addEventListener('mouseenter', () => {
      this.services.animation.animate({
        id: `gps-highlight-${index}`,
        targets: gpsSection,
        properties: {
          backgroundColor: this.config.branding.interactiveColor + '20',
          scale: 1.02
        },
        duration: 0.3
      });
      
      this.services.accessibility.announceToScreenReader(
        `Voder GPS approach to ${this.getComparisonAspect(index)} highlighted`,
        'polite'
      );
    });
  });
}
```

## 🚨 **CRITICAL REQUIREMENTS**

1. **Scroll-Scrubbed Journey**: All journey progression animations MUST use `scrub` property for scroll-tied behavior
2. **3D Asset Management**: Services must support efficient loading and caching of 3D metaphor visualization assets
3. **Metaphor Accessibility**: Visual metaphors must have comprehensive text alternatives and reduced motion fallbacks
4. **Interactive Comparison Support**: Hover effects and keyboard navigation must be accessible and performant
5. **Journey Progress Announcements**: Screen reader users need clear progression updates through the metaphor journey
6. **Performance Adaptation**: 3D visualization must gracefully degrade for low-performance devices

## 📝 **NOTES**

- Metaphor section uses most complex 3D visualization outside of Brand Entry section
- GPS vs Directions metaphor is central to Voder's value proposition and must be clearly communicated
- Journey progression visualization creates emotional connection with scroll-tied route drawing
- Interactive comparison allows users to explore metaphor differences at their own pace
- Accessibility is critical since visual metaphors convey core business concepts
- Asset loading must be optimized since 3D metaphor visualization requires multiple models and textures
- Reduced motion users should receive meaningful static metaphor comparison, not just text
- Screen reader experience should be comprehensive since metaphor understanding is crucial for product comprehension
