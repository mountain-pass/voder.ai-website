# @voder/navigation Dependencies on @voder/services

This document specifies what the `@voder/navigation` package requires from `@voder/services` beyond what's documented in services.md.

## 🎯 **SERVICE DEPENDENCIES**

### **AccessibilityService**
**Required for**: Skip-to-content accessibility and ARIA navigation management

**Package-Specific Requirements:**
- **Skip-to-content focus**: Immediate focus management for users bypassing animations or sections
- **Navigation state announcements**: Screen reader notifications for section changes and navigation updates
- **Keyboard navigation patterns**: Arrow key navigation with roving tabindex for skip links
- **Accessibility instruction management**: ARIA descriptions for navigation functionality

### **ScrollService**
**Required for**: Smooth scrolling to sections and navigation position tracking

**Package-Specific Requirements:**
- **Skip-to-section scrolling**: Smooth scroll implementation for skip-to-content functionality
- **Section offset calculation**: Navigation-aware scroll positioning with header/offset considerations
- **Active section detection**: Scroll position monitoring to update navigation state

### **AnimationService**
**Required for**: Subtle navigation transitions and progress indicators

**Package-Specific Requirements:**
- **Navigation visibility transitions**: Subtle fade/slide animations for navigation appearance
- **Progress indicator updates**: Visual feedback for section progression during scroll
- **Skip button emphasis**: Hover and focus state animations for skip-to-content links

## 🚫 **SERVICES NOT REQUIRED**

### **AssetService**
Navigation component uses text-only skip links and basic CSS styling. No external assets needed.

## 🔧 **INTEGRATION REQUIREMENTS**

### **Section-Specific Context**
- **Skip-to-content focus**: Primary function is accessibility bypass for cinematic sections
- **Minimal visual presence**: Subtle navigation that doesn't interfere with section storytelling
- **Keyboard-first design**: Optimized for keyboard navigation and screen reader users
- **Section coordination**: Must work seamlessly with all section components for skip functionality
- **IntersectionObserver Integration**: Detect when sections enter/exit viewport
- **Throttled Scroll Events**: Efficient scroll event handling at 60fps

**Usage Examples:**
```typescript
// Smooth scroll to section with offset
this.scrollService.scrollToElement(sectionElement, {
  behavior: 'smooth',
  offset: -80, // Account for fixed navigation height
  duration: 800,
  easing: 'power2.out'
});

// Track active section based on scroll position
this.scrollService.observeScrollPosition((position) => {
  const activeSection = this.determineActiveSection(position);
  this.updateNavigationState(activeSection);
});
```

### **AnimationService Implementation**
The navigation component needs AnimationService for subtle transitions and scroll-tied animations:

**Required Functionality:**
```typescript
// Navigation visibility animations
animationService.createScrollTimeline(config);
animationService.animate(command);

// Transition animations for focus states
animationService.createTimeline(config);
```

**Specific Capabilities Needed:**
- **Scroll-Tied Animations**: Navigation visibility based on scroll position (MUST use scrub)
- **Focus Transitions**: Smooth hover and focus state transitions
- **Reduced Motion Support**: Respect `prefers-reduced-motion` settings
- **GPU-Accelerated Animations**: Use transform/opacity for performance

**Usage Examples:**
```typescript
// Navigation visibility tied to scroll position
const timeline = this.animationService.createScrollTimeline({
  id: 'navigation-visibility',
  scrollTrigger: {
    trigger: document.body,
    start: 'top -100',
    end: 'bottom bottom',
    scrub: true // CRITICAL: Must be scroll-scrubbed
  }
});

timeline.to('.navigation', {
  opacity: 1,
  y: 0,
  duration: 1
});

// Focus state transitions
this.animationService.animate({
  id: 'nav-link-focus',
  targets: navLink,
  properties: {
    color: '#24D1D5', // Soft Teal Glow
    scale: 1.05
  },
  duration: 0.3,
  ease: 'power2.out'
});
```

## 📦 **REQUIRED EXPORTS**

The `@voder/services` package must export these service classes for navigation dependency injection:

```typescript
// Required exports from @voder/services
export { AccessibilityService } from './AccessibilityService/index.js';
export { ScrollService } from './ScrollService/index.js';
export { AnimationService } from './AnimationService/index.js';
```

## 🔄 **SERVICE LIFECYCLE REQUIREMENTS**

### **Constructor Injection Pattern**
Navigation component uses constructor injection for all service dependencies:

```typescript
// NavigationComponent constructor pattern
constructor(
  config: NavigationConfig,
  accessibilityService: AccessibilityService,
  scrollService: ScrollService,
  animationService: AnimationService
) {
  this.accessibilityService = accessibilityService;
  this.scrollService = scrollService;
  this.animationService = animationService;
}
```

### **Service Initialization**
Services must be initialized before navigation component mount:

```typescript
// Services must be ready for immediate use
async mount(container: HTMLElement): Promise<void> {
  // Services are expected to be initialized already
  this.setupAccessibility();
  this.setupScrollTracking();
  this.setupAnimations();
}
```

### **Clean-up Requirements**
Services must support proper resource cleanup:

```typescript
// Navigation component cleanup pattern
unmount(): void {
  // Services must provide cleanup methods
  this.scrollService.removeAllObservers();
  this.animationService.killAllAnimations();
  this.accessibilityService.removeEventListeners();
}
```

## 🎯 **USAGE CONTEXT**

The navigation component uses these services for:

### **1. Skip-to-Content Functionality**
```typescript
// Primary accessibility feature - skip links
this.accessibilityService.announceToScreenReader(
  'Skip to content link available',
  'polite'
);

// Smooth scroll to main content
this.scrollService.scrollToElement(mainContent, {
  offset: 0,
  behavior: 'smooth'
});
```

### **2. Section Navigation**
```typescript
// Navigate to specific sections
navigateToSection(sectionId: string): void {
  const section = document.getElementById(sectionId);
  
  this.scrollService.scrollToElement(section, {
    offset: -this.navigationHeight,
    behavior: 'smooth'
  });
  
  this.accessibilityService.announceToScreenReader(
    `Navigating to ${this.getSectionLabel(sectionId)} section`,
    'assertive'
  );
}
```

### **3. Active Section Tracking**
```typescript
// Update navigation state based on scroll position
this.scrollService.observeScrollPosition((position) => {
  const activeSection = this.determineActiveSection(position);
  this.updateAriaCurrentState(activeSection);
  this.accessibilityService.announceToScreenReader(
    `Now viewing ${this.getSectionLabel(activeSection)} section`,
    'polite'
  );
});
```

## 🚨 **CRITICAL REQUIREMENTS**

1. **Scroll-Scrubbed Animations**: All navigation animations MUST use `scrub` property for scroll-tied behavior
2. **Accessibility Compliance**: Services must support WCAG 2.1 AA standards
3. **Reduced Motion Support**: All services must respect `prefers-reduced-motion`
4. **Performance Optimization**: Scroll tracking must be throttled to 60fps
5. **Keyboard Navigation**: Full keyboard accessibility with arrow keys and roving tabindex
6. **Screen Reader Support**: Clear, contextual announcements for navigation changes

## 📝 **NOTES**

- Navigation component implements skip-to-content pattern (no visible menu per website specification)
- Services must support the minimal, accessibility-first approach
- All animations must be subtle and respectful of user preferences
- Focus management is critical for keyboard users
- Section detection must work reliably across all viewport sizes
