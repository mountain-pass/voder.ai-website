# @voder/the-why-section Dependencies on @voder/services

This document specifies what the `@voder/the-why-section` package requires from `@voder/services` to implement the philosophical foundation section with typing animations, progressive content reveal, and accessibility features.

## 🎯 **PURPOSE**

The `@voder/the-why-section` package needs specific services from `@voder/services` to:

1. **Typography Animation Management**: Typing effects and content reveal sequences
2. **Scroll-Tied Progressive Reveal**: Content visibility based on scroll progress
3. **Accessibility Support**: Screen reader announcements, reduced motion, skip options

## 🔧 **REQUIRED SERVICE IMPLEMENTATIONS**

### **AnimationService Implementation**
The Why section needs AnimationService for content reveal and typing animation coordination:

**Required Functionality:**
```typescript
// Used in TheWhySection constructor injection
constructor(
  container: HTMLElement,
  config: TheWhySectionConfig,
  services: {
    animation: AnimationService;
    // ... other services
  }
) {}

// Required methods for content reveal animations
animationService.createTimeline(config);
animationService.createScrollTimeline(config); // For progressive reveal
animationService.animate(command);
```

**Specific Capabilities Needed:**
- **Progressive Content Reveal**: Scroll-tied animations for content phases (MUST use scrub)
- **Typography Animation Support**: Coordinate with typing animation effect
- **Sequential Content Animation**: Staggered reveal of supporting statements
- **Reduced Motion Fallbacks**: Immediate content display for accessibility

**Usage Examples:**
```typescript
// Progressive reveal tied to scroll position
const revealTimeline = this.services.animation.createScrollTimeline({
  id: 'why-progressive-reveal',
  scrollTrigger: {
    trigger: this.container,
    start: "top center",
    end: "bottom center",
    scrub: 1 // CRITICAL: Must be scroll-scrubbed
  }
});

revealTimeline
  .to(this.primaryMessageElement, {
    opacity: 1,
    y: 0,
    duration: 1
  })
  .to(this.supportingStatements, {
    opacity: 1,
    x: 0,
    duration: 1,
    stagger: 0.2
  }, 0.4);

// Key phrase emphasis animation
this.services.animation.animate({
  id: 'intent-emphasis',
  targets: this.keyPhraseElement,
  properties: {
    textShadow: "0 0 20px #24D1D5, 0 0 40px #24D1D5",
    scale: 1.05
  },
  duration: 1,
  ease: "power2.inOut"
});
```

### **AccessibilityService Implementation**
The Why section needs AccessibilityService for comprehensive content accessibility:

**Required Functionality:**
```typescript
// Screen reader support for progressive content
accessibilityService.announceToScreenReader(message, priority);

// Reduced motion detection
accessibilityService.prefersReducedMotion();

// Focus management for skip options
accessibilityService.manageFocus(element, options);

// ARIA structure management
accessibilityService.setAriaAttributes(element, attributes);
```

**Specific Capabilities Needed:**
- **Content Progress Announcements**: Announce typing progress and content reveals
- **Reduced Motion Detection**: Detect and provide static content fallbacks
- **Skip Animation Support**: Focus management for skip-to-content buttons
- **Semantic Structure**: ARIA roles and labels for philosophical content

**Usage Examples:**
```typescript
// Announce section entry and content
this.services.accessibility.announceToScreenReader(
  'The Why section: We believe software should start with intent. ' +
  'This section presents Voder\'s core philosophy.',
  'polite'
);

// Handle reduced motion preferences
if (this.services.accessibility.prefersReducedMotion()) {
  this.config.animation.enableTypingEffect = false;
  this.config.animation.fadeInDuration = 0.3;
  this.showStaticContentFallback();
}

// Set semantic structure
this.services.accessibility.setAriaAttributes(this.container, {
  'role': 'main',
  'aria-labelledby': 'why-section-heading'
});

this.services.accessibility.setAriaAttributes(this.keyPhraseElement, {
  'role': 'mark',
  'aria-label': 'Intent - core philosophical concept'
});

// Manage skip button focus
this.services.accessibility.manageFocus(skipButton, {
  reason: 'animation-skip-available'
});
```

### **ScrollService Implementation**
The Why section needs ScrollService for progressive content reveal and position tracking:

**Required Functionality:**
```typescript
// Scroll position monitoring for content reveal
scrollService.observeScrollPosition(callback);
scrollService.getCurrentScrollPosition();

// Element visibility detection
scrollService.observeElementVisibility(element, callback);
```

**Specific Capabilities Needed:**
- **Progressive Reveal Coordination**: Track scroll progress for content phasing
- **Content Visibility Management**: Show/hide content based on scroll position
- **Smooth Scroll Support**: Skip-to-content functionality (if needed)

**Usage Examples:**
```typescript
// Monitor scroll for progressive content reveal
this.services.scroll.observeScrollPosition((position) => {
  const progress = this.calculateSectionProgress(position);
  this.updateContentVisibility(progress);
  this.updateBackgroundIntensity(progress);
});

// Track section visibility for accessibility announcements
this.services.scroll.observeElementVisibility(this.container, {
  onEnter: () => {
    this.services.accessibility.announceToScreenReader(
      'Entering The Why section - Voder\'s philosophical foundation',
      'polite'
    );
  },
  onExit: () => {
    this.services.accessibility.announceToScreenReader(
      'Leaving The Why section',
      'polite'
    );
  }
});
```

## 📦 **REQUIRED EXPORTS**

The `@voder/services` package must export these service classes for The Why section dependency injection:

```typescript
// Required exports from @voder/services
export { AnimationService } from './AnimationService/index.js';
export { AccessibilityService } from './AccessibilityService/index.js';
export { ScrollService } from './ScrollService/index.js';
```

## 🔄 **SERVICE LIFECYCLE REQUIREMENTS**

### **Constructor Injection Pattern**
The Why section uses constructor injection for service dependencies:

```typescript
# @voder/the-why-section Dependencies on @voder/services

This document specifies what the `@voder/the-why-section` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AnimationService**
**Required for**: Philosophical content reveal with typing animation coordination

**Package-Specific Requirements:**
- **Typography animation synchronization**: Animation timing coordinated with TypingAnimationEffect for "Intent" key phrase emphasis
- **Progressive philosophy reveal**: Scroll-tied content staging for philosophical concepts presentation
- **Key phrase emphasis effects**: "Intent" and core philosophy highlighting with branded glow effects
- **Supporting statement staggering**: 3-4 supporting statements appearing with 200ms stagger timing

### **AccessibilityService**
**Required for**: Philosophical content accessibility and typing animation alternatives

**Package-Specific Requirements:**
- **Philosophy context announcements**: Screen reader descriptions of core Voder philosophy and "Intent" concept
- **Typing animation alternatives**: Static text presentation when reduced motion preferred
- **Philosophical content structure**: ARIA markup for key concepts and supporting statements
- **Concept emphasis accessibility**: Screen reader emphasis for "Intent" and philosophical key phrases

### **ScrollService**
**Required for**: Progressive philosophy revelation timing

**Package-Specific Requirements:**
- **Philosophy progression tracking**: Scroll-based staging through philosophical concept introduction
- **Content visibility optimization**: Efficient rendering of progressive text reveals
- **Typing animation triggers**: Scroll-based activation of typing effects at optimal reading positions

## 🔧 **INTEGRATION REQUIREMENTS**

### **With @voder/typing-animation-effect**
- **Animation coordination**: AnimationService timing must sync with typing animation rendering
- **Accessibility coordination**: Screen reader announcements must coordinate with typing progress

### **Section-Specific Context**
- **Philosophy presentation focus**: Core Voder beliefs requiring careful, respectful revelation timing
- **"Intent" concept emphasis**: Central philosophical concept requiring special visual and accessibility treatment
- **Typography-heavy content**: Text-focused section requiring optimized animation performance for reading flow
```

### **Initialization Sequence**
Services must support the Why section's content-focused initialization:

```typescript
// Services used in initialization order
async initialize(): Promise<void> {
  // 1. Accessibility setup (critical path)
  this.setupAccessibility();
  
  // 2. Content preparation
  this.prepareContentElements();
  
  // 3. Animation setup
  this.setupProgressiveReveal();
  
  // 4. Scroll observation
  this.setupScrollTracking();
}
```

### **Performance Requirements**
Services must support the Why section's text-focused performance needs:

```typescript
// Reduced motion fallback
if (this.services.accessibility.prefersReducedMotion()) {
  // Immediate content display
  this.showStaticContentFallback();
  
  // Skip all progressive animations
  this.services.animation.disableTimelines(['why-progressive-reveal']);
}
```

## 🎯 **USAGE CONTEXT**

The Why section uses these services for:

### **1. Progressive Content Revelation (scroll-tied)**
```typescript
// Content phased by scroll progress
private updateContentVisibility(progress: number): void {
  // Primary message: 0-40% scroll progress
  if (progress <= 0.4) {
    const messageProgress = progress / 0.4;
    this.services.animation.animate({
      id: 'primary-message-reveal',
      targets: this.primaryMessageElement,
      properties: { opacity: messageProgress },
      duration: 0
    });
  }
  
  // Supporting statements: 40-80% scroll progress
  if (progress > 0.4 && progress <= 0.8) {
    const supportingProgress = (progress - 0.4) / 0.4;
    this.revealSupportingStatements(supportingProgress);
  }
}
```

### **2. Typography Animation Coordination**
```typescript
// Coordinate with typing effect
private revealWithTyping(): void {
  this.services.animation.animate({
    id: 'typing-setup',
    targets: this.primaryMessageElement,
    properties: { opacity: 1 },
    duration: 0.3,
    onComplete: () => {
      // Start typing animation
      this.typingAnimation.typeText(this.config.content.primaryMessage);
    }
  });
}
```

### **3. Accessibility-First Experience**
```typescript
// Comprehensive accessibility support
private setupScreenReaderExperience(): void {
  // Provide complete context immediately
  const fullContext = `
    The Why section: We believe software should start with intent. 
    This section presents Voder's core philosophy that software creation 
    should begin with clear intent rather than technical implementation details.
  `;
  
  this.services.accessibility.announceToScreenReader(fullContext, 'polite');
  
  // Progressive content announcements
  this.services.scroll.observeScrollPosition((position) => {
    const newPhase = this.determineContentPhase(position);
    if (newPhase !== this.currentPhase) {
      this.announcePhaseChange(newPhase);
    }
  });
}
```

## 🚨 **CRITICAL REQUIREMENTS**

1. **Scroll-Scrubbed Animations**: All progressive reveal animations MUST use `scrub` property
2. **Reduced Motion Compliance**: Services must provide reliable reduced motion detection and fallbacks
3. **Content Accessibility**: Screen reader announcements must provide complete context
4. **Progressive Enhancement**: Content must be accessible even if animations fail
5. **Typography Support**: Animation service must coordinate with typing effects
6. **Semantic Structure**: Accessibility service must support complex ARIA relationships

## 📝 **NOTES**

- The Why section is content-heavy with minimal visual effects compared to Brand Entry
- Typography and text reveal are the primary animation concerns
- Accessibility is paramount since this section establishes core philosophical concepts
- Progressive reveal must work smoothly across all device types and scroll speeds
- Reduced motion users should receive immediate, complete content access
- Screen reader users need comprehensive context and progress updates
