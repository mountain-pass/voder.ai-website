# Code Display Effect Dependencies on @voder/shared

This document outlines the specific dependencies that the `@voder/code-display-effect` package requires from `@voder/shared`, focusing on actual shared needs beyond what is documented in shared.md.

## 🎯 **Required Shared Interfaces**

### **Base Effect Interface**
- `IEffectComponent` with `initialize()`, `destroy()`, `resize()`, `setVisibility()` methods
- `EffectConfiguration` extending ComponentConfiguration for effect setup
- `EffectServices` for service injection (animation, accessibility, performance, optional assets)
- `EffectAccessibilityConfig` for accessibility compliance

### **Component Foundation**
- `IComponent` base interface with `id` and `getState()`
- `ComponentConfiguration` with `id`, `debug`, `containerId`, `accessibility`
- `ComponentState` type for lifecycle management

### **Error Handling**
- `ComponentError` class for code display effect errors
- `ValidationError` class for configuration validation

### **Validation Utilities**
- `validateRequired<T>()` for required field validation
- `validateComponentConfiguration()` for config validation
- `validateAccessibilityConfiguration()` for accessibility config
- `validateElement()` for container validation

### **Brand Constants**
- `BRAND_COLORS.DEEP_NAVY` for code background (#0F1A2E)
- `BRAND_COLORS.PAPER_WHITE` for code text (#FFFFFF)  
- `BRAND_COLORS.SOFT_TEAL_GLOW` for syntax highlighting (#24D1D5)
- `BRAND_COLORS.ACCENT_GREEN` for keywords (#9AEF00)
- `BRAND_TYPOGRAPHY.FONT_FAMILY_MONO` for code display (JetBrains Mono)

### **Accessibility Constants**
- `ACCESSIBILITY_CONSTANTS.SCREEN_READER_DELAY` for code announcements
- `ACCESSIBILITY_CONSTANTS.MIN_TOUCH_TARGET_SIZE` for interactive elements

### **Performance Constants**
- `PERFORMANCE_THRESHOLDS.ANIMATION_FRAME_BUDGET` for 60fps rendering
- `PERFORMANCE_THRESHOLDS.DEFAULT_TIMEOUT` for operations

## 📝 **Package-Specific Implementation**

The Code Display Effect package will define its own:
- `CodeDisplayComponent` class implementing `IEffectComponent`
- `CodeRenderConfig`, `RevealConfig`, `DiffConfig` interfaces
- `CodeTheme`, `SyntaxColors` interfaces for theming
- Code parsing, syntax highlighting, and diff computation utilities
- Virtual scrolling and caching systems for large code blocks

This ensures the package extends shared interfaces while implementing code-specific functionality internally.
```

### **Code Rendering Utilities**
```typescript
// DOM creation helpers for code blocks
function createCodeContainer(
  config: CodeRenderConfig, 
  accessibility: AccessibilityConfiguration
): HTMLElement;

function createCodeLineElement(
  content: string, 
  lineNumber: number, 
  language: string
): HTMLElement;

function createSyntaxToken(
  tokenType: string, 
  tokenValue: string, 
  position: number
): HTMLElement;

// Code formatting utilities
function formatCodeForDisplay(code: string, tabSize?: number): string;
function highlightCodeLines(element: HTMLElement, lines: number[]): void;
function addLineNumbers(element: HTMLElement, startLine?: number): void;
```

### **Diff Computation Utilities**
```typescript
// Line-level diff computation
function computeLineDiff(oldCode: string, newCode: string): DiffResult[];
function computeCharacterDiff(oldLine: string, newLine: string): CharDiff[];
function generateDiffHtml(diff: DiffResult[]): string;

interface DiffResult {
  type: 'delete' | 'insert' | 'modify' | 'unchanged';
  lineNumber: number;
  oldLineNumber?: number;
  newLineNumber?: number;
  content: string;
}

interface CharDiff {
  type: 'delete' | 'insert' | 'unchanged';
  text: string;
  position: number;
}
```

## 📊 **Performance Optimization Utilities**

### **Virtual Scrolling Support**
```typescript
// Large code block optimization
function createVirtualScrollContainer(element: HTMLElement, totalLines: number): HTMLElement;
function calculateVisibleLineRange(scrollTop: number, containerHeight: number, lineHeight: number): LineRange;
function optimizeCodeRenderBatch(lines: string[], range: LineRange): HTMLElement[];

interface LineRange {
  startIndex: number;
  endIndex: number;
  buffer: number;
}

// Performance monitoring for code rendering
function measureCodeRenderPerformance(operation: string): PerformanceMarker;
function logCodeRenderMetrics(metrics: CodeRenderMetrics): void;

interface CodeRenderMetrics {
  renderTime: number;
  linesRendered: number;
  syntaxHighlightTime: number;
  domUpdateTime: number;
}
```

### **Caching Utilities**
```typescript
// Code element caching system
class CodeRenderCache extends Map<string, HTMLElement> {
  generateCacheKey(config: CodeRenderConfig): string;
  cleanupExpiredEntries(): void;
  getMemoryUsage(): number;
}

// Cache key generation
function generateCodeCacheKey(
  code: string, 
  language: string, 
  theme: string, 
  options: RenderOptions
): string;
```

## ♿ **Accessibility Integration Requirements**

### **Code Accessibility Utilities**
```typescript
// Screen reader support for code
function setupCodeScreenReaderSupport(
  element: HTMLElement, 
  config: CodeAccessibilityConfig
): void;

function generateCodeDescription(
  language: string, 
  totalLines: number, 
  summary?: string
): string;

function addCodeKeyboardNavigation(element: HTMLElement): void;

interface CodeAccessibilityConfig extends AccessibilityConfiguration {
  language: string;
  totalLines: number;
  hasLineNumbers: boolean;
  isDiff: boolean;
  summary?: string;
}

// Code ARIA integration
function setCodeAriaAttributes(element: HTMLElement, config: CodeAccessibilityConfig): void;
function announceCodeChanges(element: HTMLElement, change: string): void;
function setupCodeFocusManagement(element: HTMLElement): void;
```

### **Reduced Motion Support**
```typescript
// Motion preferences for code animations
function adaptCodeAnimationForMotion(config: RevealConfig): RevealConfig;
function shouldUseInstantCodeReveal(): boolean;
function createReducedMotionCodeTimeline(config: RevealConfig): AnimationConfig;
```

## 🎨 **Brand Integration Requirements**

### **Voder Code Theme Constants**
```typescript
// Brand-aligned code themes
const VODER_CODE_THEMES = {
  DARK: {
    background: '#0F1A2E',     // Deep Navy
    foreground: '#FFFFFF',      // Paper White
    selection: '#24D1D540',     // Soft Teal Glow with transparency
    lineNumber: '#C6CBD4',      // Cool Grey
    syntax: {
      keyword: '#9AEF00',       // Accent Green
      string: '#24D1D5',        // Soft Teal Glow
      comment: '#C6CBD4',       // Cool Grey
      function: '#FFFFFF',      // Paper White
      variable: '#E0E0E0',      // Light grey
      number: '#9AEF00',        // Accent Green
      operator: '#C6CBD4',      // Cool Grey
      type: '#24D1D5'          // Soft Teal Glow
    }
  }
} as const;

// Code typography constants
const CODE_TYPOGRAPHY = {
  FONT_FAMILY: 'JetBrains Mono, Consolas, Monaco, "Courier New", monospace',
  FONT_SIZE: '14px',
  LINE_HEIGHT: '1.6',
  FONT_WEIGHT: '400'
} as const;
```

### **Code Styling Utilities**
```typescript
// Brand-consistent code styling
function applyVoderCodeTheme(element: HTMLElement, theme: CodeTheme): void;
function addCodeBrandStyling(element: HTMLElement): void;
function setupCodeFocusEffects(element: HTMLElement): void;

// Code container styling
function styleCodeContainer(
  element: HTMLElement, 
  config: CodeRenderConfig
): void;

function applySyntaxHighlightColors(
  element: HTMLElement, 
  colors: SyntaxColors
): void;
```

## 🚀 **Animation Integration Requirements**

### **GSAP ScrollTrigger Utilities**
```typescript
// Scroll-tied code animations
function createCodeScrollTrigger(
  element: HTMLElement, 
  timeline: gsap.core.Timeline, 
  config: ScrollTriggerConfig
): ScrollTrigger;

function updateCodeVisibilityByScroll(
  element: HTMLElement, 
  progress: number
): void;

// Code reveal animations
function createCodeTypingTimeline(
  lines: NodeListOf<Element>, 
  config: RevealConfig
): gsap.core.Timeline;

function createCodeLinesTimeline(
  lines: NodeListOf<Element>, 
  config: RevealConfig
): gsap.core.Timeline;

// Diff animation timelines
function createDiffTransitionTimeline(
  container: HTMLElement, 
  config: DiffConfig
): gsap.core.Timeline;
```

## 📝 **Error Handling Requirements**

### **Code Display Errors**
```typescript
// Code-specific error types
class CodeRenderError extends ComponentError {
  constructor(language: string, details: string);
}

class SyntaxHighlightError extends ComponentError {
  constructor(language: string, tokenPosition: number);
}

class CodeValidationError extends ValidationError {
  constructor(code: string, validationRule: string);
}

// Error recovery utilities
function handleCodeRenderFailure(error: CodeRenderError): HTMLElement;
function fallbackToPlainText(code: string): HTMLElement;
function logCodeRenderError(error: Error, context: CodeRenderContext): void;

interface CodeRenderContext {
  language: string;
  codeLength: number;
  renderMode: string;
  timestamp: Date;
}
```

This document specifies the exact interfaces, utilities, and constants that the Code Display Effect needs from @voder/shared to implement sophisticated code visualization, syntax highlighting, diff rendering, and accessibility compliance while maintaining Voder brand consistency and performance standards.
