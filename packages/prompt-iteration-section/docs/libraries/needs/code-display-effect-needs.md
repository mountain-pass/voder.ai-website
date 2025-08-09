# @voder/code-display-effect Needs for Prompt Iteration Section

This document outlines the specific requirements that the `@voder/prompt-iteration-section` package has for the `@voder/code-display-effect` component, focusing on package-specific needs beyond what is documented in code-display-effect.md.

## 🎯 **Package-Specific Requirements**

### **Diff Visualization for Code Adaptation Demonstrations**

The prompt-iteration-section needs specialized diff visualization capabilities to demonstrate how Voder intelligently adapts code when prompts change:

```typescript
interface DiffVisualizationNeeds {
  // Side-by-side before/after code comparison
  renderCodeComparison(config: {
    beforeCode: string;
    afterCode: string;
    language: string;
    highlightChanges: boolean;
    animateTransition: boolean;
  }): Promise<HTMLElement>;
  
  // Highlight specific lines that changed with reasons
  highlightChangedLines(element: HTMLElement, changes: {
    lineNumber: number;
    changeType: 'addition' | 'deletion' | 'modification';
    reason: string;
  }[]): void;
  
  // Progressive diff reveal tied to scroll position
  animateDiffReveal(element: HTMLElement, scrollProgress: number): void;
}
```

### **Curated Code Demonstration Support**

The section uses pre-defined code examples that need specific rendering approaches:

```typescript
interface DemonstrationRenderingNeeds {
  // Render multiple code demonstrations with navigation
  setupDemonstrationCarousel(demonstrations: {
    title: string;
    beforeCode: string;
    afterCode: string;
    language: string;
    explanation: string;
  }[]): HTMLElement;
  
  // Switch between demonstrations with smooth transitions  
  switchToDemonstration(index: number, animated: boolean): Promise<void>;
  
  // Highlight the specific changes in each demonstration
  emphasizeKeyChanges(element: HTMLElement, keyPoints: string[]): void;
}
```

### **Scroll-Tied Animation Integration**

Integration with the section's scroll-tied animation system:

```typescript
interface ScrollAnimationNeeds {
  // Code reveal that progresses with scroll position (not time)
  setupScrollTiedCodeReveal(element: HTMLElement, config: {
    startTrigger: string;  // e.g., "top 60%"
    endTrigger: string;    // e.g., "top 40%"
    revealMode: 'lines' | 'typing' | 'blocks';
  }): ScrollTrigger;
  
  // Diff animation that scrubs with scroll progress
  setupScrollTiedDiffAnimation(element: HTMLElement, scrollConfig: {
    trigger: string;
    scrubValue: number;
    phaseMarkers: number[];  // [0.3, 0.6, 0.9] for staged reveals
  }): ScrollTrigger;
}
```

## 🎨 **Brand-Specific Styling Requirements**

### **Voder Theme Configuration**

The section needs the code display to match the demonstration UI design:

```typescript
interface ThemeConfigurationNeeds {
  // Use section-specific Voder dark theme
  applyVoderDemonstrationTheme(element: HTMLElement): void;
  
  // Color coding for different change types
  setDiffColorScheme(colors: {
    addition: '#9AEF00';      // Accent Green
    deletion: '#FF6B6B';      // Problem Red  
    modification: '#24D1D5';  // Soft Teal Glow
    unchanged: '#FFFFFF';     // Paper White
  }): void;
  
  // Ensure proper contrast ratios for accessibility
  validateContrastRatios(): Promise<boolean>;
}
```

### **Layout Integration**

Integration with the section's responsive layout system:

```typescript
interface LayoutIntegrationNeeds {
  // Responsive code block sizing within section constraints
  setResponsiveCodeBlocks(element: HTMLElement, breakpoints: {
    mobile: { fontSize: string; lineHeight: string; };
    tablet: { fontSize: string; lineHeight: string; };
    desktop: { fontSize: string; lineHeight: string; };
  }): void;
  
  // Coordinate with prompt comparison layout
  alignWithPromptComparison(codeElement: HTMLElement, promptElement: HTMLElement): void;
}
```

## ♿ **Accessibility Requirements for Demonstrations**

### **Screen Reader Support for Code Changes**

```typescript
interface AccessibilityNeeds {
  // Announce code changes as they're revealed
  setupCodeChangeAnnouncements(element: HTMLElement, config: {
    announceOnReveal: boolean;
    detailLevel: 'basic' | 'detailed';
    useAriaLive: 'polite' | 'assertive';
  }): void;
  
  // Provide alternative text for diff visualizations
  addDiffDescriptions(element: HTMLElement, descriptions: {
    overallChange: string;
    lineByLineChanges: string[];
    reasoningExplanation: string;
  }): void;
  
  // Support keyboard navigation through code sections
  enableKeyboardCodeNavigation(element: HTMLElement): void;
}
```

## 🧪 **Testing Integration Requirements**

### **Playwright Test Support**

The section's tests need to verify code display functionality:

```typescript
interface TestingSupportNeeds {
  // Add test attributes for code demonstration elements
  addTestAttributes(element: HTMLElement, testIds: {
    beforeCode: string;
    afterCode: string;
    diffHighlights: string;
    changeExplanations: string;
  }): void;
  
  // Expose methods for test verification
  getRenderedCodeContent(element: HTMLElement): {
    beforeText: string;
    afterText: string;
    highlightedLines: number[];
    currentDemonstration: number;
  };
  
  // Support for testing scroll-tied animations
  simulateScrollProgress(element: HTMLElement, progress: number): void;
}
```

## 🔄 **State Management for Demonstrations**

### **Demonstration Carousel State**

```typescript
interface CarouselStateNeeds {
  // Track current demonstration state
  getCurrentDemonstration(): {
    index: number;
    title: string;
    isAnimating: boolean;
    revealProgress: number;
  };
  
  // Handle demonstration navigation
  navigateToDemonstration(index: number, options: {
    animate: boolean;
    announceChange: boolean;
    updateUrlHash: boolean;
  }): Promise<void>;
  
  // Manage demonstration visibility states
  setDemonstrationVisibility(index: number, visible: boolean): void;
}
```

## 📱 **Performance Requirements**

### **Efficient Code Rendering**

The demonstrations need optimized rendering for smooth scroll animations:

```typescript
interface PerformanceNeeds {
  // Pre-render all demonstrations for smooth switching
  preRenderDemonstrations(demonstrations: CodeDemonstration[]): Promise<void>;
  
  // Lazy load syntax highlighting for non-visible demos
  setupLazySyntaxHighlighting(element: HTMLElement): void;
  
  // Optimize for 60fps scroll-tied animations
  enablePerformanceMode(element: HTMLElement, options: {
    reduceAnimationComplexity: boolean;
    cacheRenderedContent: boolean;
    throttleScrollEvents: boolean;
  }): void;
}
```

These requirements focus specifically on what the prompt-iteration-section needs from the code-display-effect to create compelling, accessible demonstrations of Voder's intelligent code adaptation capabilities.
