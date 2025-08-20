# Runtime Layer Comprehensive Guide

This document provides comprehensive guidelines for implementing runtime packages in the Voder monorepo. Runtime packages are the components, services, and systems that execute during website operation, including all UI components, effects, sections, navigation, and applications.

---

## 🎯 **RUNTIME LAYER SCOPE & PURPOSE**

### **What Are Runtime Packages?**
Runtime packages contain code that executes in the browser during website operation:
- **Foundation packages**: `@voder/shared`, `@voder/services`, `@voder/core`
- **Component packages**: Navigation, sections, effects
- **Application packages**: Main website application

### **Key Responsibilities**
- Provide browser-ready functionality
- Implement user-facing features
- Handle runtime performance optimization
- Manage browser compatibility
- Ensure accessibility compliance
- Maintain brand consistency
- Implement security best practices

---

## 🏗️ **ARCHITECTURE PATTERNS**

### **Package Structure Standard**
Every runtime package follows this structure:
```
packages/package-name/
├── src/
│   ├── index.ts              # Main export barrel
│   ├── types.ts              # Package-specific types
│   ├── constants.ts          # Package constants
│   └── [implementation]/     # Core implementation
├── tests/                    # Vitest unit tests
├── dist/                     # Built output (git-ignored)
├── package.json              # Package metadata
├── tsconfig.json             # TypeScript config (extends @voder/tsconfig)
├── rollup.config.js          # Build config (uses @voder/build-tools)
└── docs/                     # Package documentation
    └── libraries/
        └── needs/            # Dependencies requirements
```

### **Export Patterns**
All runtime packages use barrel exports in `src/index.ts`:
```typescript
// Primary exports (what most consumers need)
export { ComponentName } from './ComponentName.js';
export { ServiceName } from './ServiceName.js';

// Type exports (for TypeScript consumers)
export type { ComponentConfig, ComponentEvent } from './types.js';

// Optional secondary exports (for advanced usage)
export { UtilityFunction } from './utils.js';
```

### **Universal Component Pattern**
Every component follows this exact structure for consistency and LLM comprehension:

```typescript
export interface IComponentConfig {
  container: HTMLElement;
  services: IServiceContainer;
  options?: ComponentOptions;
}

export interface IComponent {
  readonly id: string;
  readonly isReady: boolean;
  
  mount(): Promise<void>;
  unmount(): Promise<void>;
  update(data: unknown): Promise<void>;
  destroy(): void;
}

export class ComponentName implements IComponent {
  public readonly id: string;
  public readonly isReady: boolean = false;
  
  constructor(private config: IComponentConfig) {
    this.id = `component-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  async mount(): Promise<void> {
    // Implementation
    this.markReady();
  }
  
  async unmount(): Promise<void> {
    // Cleanup implementation
  }
  
  async update(data: unknown): Promise<void> {
    // Update implementation
  }
  
  destroy(): void {
    this.unmount();
    // Final cleanup
  }
  
  private markReady(): void {
    (this as any).isReady = true;
    this.config.services.eventBus.emit('component:ready', { id: this.id });
  }
}
```

---

## 🔧 **DEPENDENCY MANAGEMENT**

### **Dependency Hierarchy**
Runtime packages follow a strict dependency hierarchy:
```
@voder/shared (types/interfaces)
    ↓
@voder/services (business logic)
    ↓
@voder/core (orchestration)
    ↓
Components (navigation, sections, effects)
    ↓
Applications (main website)
```

### **Dependency Injection Pattern**
All runtime packages use constructor injection for dependencies:
```typescript
interface ComponentDependencies {
  animationService: AnimationService;
  accessibilityService: AccessibilityService;
}

export class ComponentName {
  constructor(private dependencies: ComponentDependencies) {}
  
  async initialize(): Promise<void> {
    // Use this.dependencies.animationService
  }
}
```

---

## 🎨 **VODER BRAND IMPLEMENTATION**

### **Brand Essence & Personality**
- **Name**: Voder
- **Tagline**: The Compiler for Prompts
- **Core Belief**: Software should start with intent
- **Persona**: Calm confidence, not hype. A system that knows what you mean.
- **Voice**: Minimal. Clear. Slightly sly. Rarely loud.

**Brand Personality:**
- Intelligent, not academic
- Futuristic, not sci-fi
- Premium, not flashy
- Confident, not arrogant
- Precise, not sterile
- Minimalist, not boring

### **Visual Language Standards**

#### **Typography Implementation**
```typescript
export const TYPOGRAPHY = {
  headlines: {
    fontFamily: 'Inter, Satoshi, "Neue Haas", sans-serif',
    fontWeight: '600', // Semi-bold
    letterSpacing: '0.02em', // Generous spacing
  },
  body: {
    fontFamily: 'Inter, "Helvetica Neue", sans-serif',
    fontWeight: '300', // Light to regular
    lineHeight: 1.6,
  },
  code: {
    fontFamily: '"JetBrains Mono", "IBM Plex Mono", monospace',
    fontWeight: '400',
  }
};
```

#### **Color Palette Implementation**
```typescript
export const COLORS = {
  voderBlack: '#0A0A0A',     // Background base
  deepNavy: '#0F1A2E',       // Hero backgrounds, depth
  softTealGlow: '#24D1D5',   // Accent for interactive elements
  accentGreen: '#9AEF00',    // Optional prompt highlighting (sparingly)
  coolGrey: '#C6CBD4',       // Secondary text
  paperWhite: '#FFFFFF',     // Primary text on dark
};

// Accessibility-validated combinations
export const TEXT_COMBINATIONS = {
  primary: { color: COLORS.paperWhite, background: COLORS.voderBlack, ratio: 19.6 }, // AAA
  hero: { color: COLORS.paperWhite, background: COLORS.deepNavy, ratio: 15.8 },     // AAA
  secondary: { color: COLORS.coolGrey, background: COLORS.voderBlack, ratio: 11.7 }, // AAA
  interactive: { color: COLORS.voderBlack, background: COLORS.softTealGlow, ratio: 13.2 }, // AAA
  accent: { color: COLORS.accentGreen, background: COLORS.voderBlack, ratio: 16.1 }, // AAA
};
```

### **Motion & Interaction Principles**
Components must implement brand-consistent motion:

```typescript
export interface MotionPrinciples {
  revealNotDrop: boolean;        // Text should fade, slide, or assemble — never plonk
  intentionalStillness: boolean; // Let things rest. Give space to think
  scrollLedNarrative: boolean;   // Sections progress via scroll, not clicks
  ambientFeedback: boolean;      // Tiny glimmers, pulses, or hovers
}

export const ANIMATION_CONFIG = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    reveal: 800,
  },
  easing: {
    default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Smooth reveal
    reveal: 'cubic-bezier(0.16, 1, 0.3, 1)',          // Reveal easing
    interaction: 'cubic-bezier(0.4, 0, 0.2, 1)',      // Material design
  },
  respectsReducedMotion: true,
};
```

### **Voice & Tone Guidelines**
Components should implement voice-consistent messaging:

```typescript
export const VOICE_EXAMPLES = {
  heroLine: "What if your prompts were the source?",
  ctaSubstitute: "Coming soon.", // (quietly confident)
  microcopy: "Built with Voder. (Of course.)",
  featureExplanation: "You set the direction. Voder plans the route.",
};

// Avoid: Over-explaining, marketing fluff, overuse of "AI", developer jargon
```

### **Iconography & Visual Motifs**
Components should implement consistent iconography patterns:

```typescript
export const ICONOGRAPHY_STANDARDS = {
  style: 'line-based', // Icons should be line-based, minimal
  approach: 'minimal', // Avoid skeuomorphism
  repeatingMotifs: [
    'cube',        // Geometric foundation element
    'flow lines',  // Connection and process visualization
    'glimmer',     // Subtle accent and attention
    'lattice',     // Structure and grid systems
    'circuit',     // Technical/system connectivity
  ],
  implementation: {
    strokeWidth: '1.5px',        // Consistent line weight
    cornerRadius: '2px',         // Subtle rounding
    colorUsage: 'single-color',  // Monochromatic preferred
    sizing: 'scalable-svg',      // Vector-based for all sizes
  }
};
```

### **Layout Structure Guidelines**
Components must follow website section structure requirements:

```typescript
export const SECTION_LAYOUT_STANDARDS = {
  brandEntry: {
    format: 'Full-screen logo + visual object',
    notes: 'No scroll hint'
  },
  theWhy: {
    format: '1–2 statements + ambient motion',
    notes: 'Big type, lots of space'
  },
  problemSpace: {
    format: 'Layered visuals, bold headings',
    notes: 'Emotional tension'
  },
  metaphor: {
    format: 'Journey-line graphic, sub-heads',
    notes: 'Scroll-linked animation'
  },
  visionFlow: {
    format: 'Schematic diagram',
    notes: 'Simplified Input–Output logic'
  },
  promptIteration: {
    format: 'UI transformation demo',
    notes: 'Strategic, not technical'
  },
  outcomeFocus: {
    format: '3–4 benefit lines',
    notes: 'Pulse animation, fade pacing'
  },
  closingMoment: {
    format: 'Logo, tagline, "Built with Voder" in corner',
    notes: 'Fade to black, final brand imprint'
  }
};
```

### **Brand Persona Reference**
For creative and strategic alignment:

```typescript
export const BRAND_PERSONA = {
  // "If Voder Were a Person..."
  appearance: {
    wears: 'black tailored hoodie, clean sneakers, elevated street wear'
  },
  interests: {
    reads: 'sci-fi philosophy and design systems docs'
  },
  communication: {
    speaks: 'slowly, clearly, and only when needed',
    listens: 'very closely'
  }
};
```

---

## ♿ **ACCESSIBILITY IMPLEMENTATION**

### **Accessibility Goals**
- **WCAG 2.1 AA Compliance**: Minimum standard for all content
- **WCAG 2.1 AAA**: Target for critical interactive elements
- **Universal Design**: Accessible by default, not as an afterthought
- **Progressive Enhancement**: Core functionality available without JavaScript/CSS

### **ARIA Implementation Standards**
Every component MUST implement proper ARIA support:

```typescript
export class AccessibleComponent implements IComponent {
  private setupAccessibility(): void {
    this.element.setAttribute('role', 'region');
    this.element.setAttribute('aria-label', this.config.accessibleName);
    this.element.setAttribute('aria-live', 'polite');
    
    if (this.config.describedBy) {
      this.element.setAttribute('aria-describedby', this.config.describedBy);
    }
  }
  
  private announceChange(message: string): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  }
}
```

### **Keyboard Navigation Requirements**
Components support full keyboard navigation:

```typescript
export class KeyboardAccessibleComponent {
  private setupKeyboardNavigation(): void {
    this.element.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.activate();
          break;
        case 'Escape':
          event.preventDefault();
          this.deactivate();
          break;
        case 'Tab':
          this.handleTabNavigation(event);
          break;
      }
    });
  }
}
```

### **Color Contrast Standards**
All components must meet contrast requirements:

| Text Combination              | Contrast Ratio | WCAG Level | Status       |
| ----------------------------- | -------------- | ---------- | ------------ |
| Paper White on Voder Black    | 19.6:1         | AAA        | ✅ Excellent |
| Paper White on Deep Navy      | 15.8:1         | AAA        | ✅ Excellent |
| Cool Grey on Voder Black      | 11.7:1         | AAA        | ✅ Excellent |
| Voder Black on Soft Teal Glow | 13.2:1         | AAA        | ✅ Excellent |
| Accent Green on Voder Black   | 16.1:1         | AAA        | ✅ Excellent |

### **Motion & Animation Accessibility**
All animations must respect user preferences:

```typescript
export class MotionAccessibleComponent {
  private respectReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  private animate(config: AnimationConfig): void {
    if (this.respectReducedMotion()) {
      if (config.fallback) {
        config.fallback();
        return;
      }
      // Provide instant state change
      this.applyFinalState();
      return;
    }
    
    // Continue with animation
    this.performAnimation(config);
  }
}
```

---

## 🔒 **SECURITY & PRIVACY IMPLEMENTATION**

### **Security Philosophy**
Balance **user insights** with **privacy respect**:
1. **📊 Informed Analytics**: Collect user behavior data with clear disclosure
2. **🔒 Secure by Design**: All external integrations follow security best practices
3. **📝 Transparent Collection**: Users know what data is collected and why
4. **⚡ Performance First**: External services enhance, never degrade user experience
5. **🌍 Compliance Ready**: GDPR, CCPA, and accessibility standards built-in
6. **🛡️ Content Security**: Strict CSP policies with trusted external sources

### **Approved External Services**
```typescript
export const APPROVED_SERVICES = {
  analytics: {
    googleAnalytics: {
      domain: 'google-analytics.com',
      purpose: 'User behavior tracking and conversion analysis',
      dataTypes: ['page_views', 'user_interactions', 'conversion_events'],
      retention: '26_months',
      optOut: 'gtag("config", "GA_MEASUREMENT_ID", { "anonymize_ip": true })'
    },
    microsoftClarity: {
      domain: 'clarity.ms',
      purpose: 'Session recording and heatmap analysis',
      dataTypes: ['click_tracking', 'scroll_behavior', 'form_interactions'],
      retention: '12_months',
      optOut: 'clarity("consent", false)'
    }
  },
  cdns: {
    cloudflare: {
      domains: ['cdnjs.cloudflare.com', 'ajax.cloudflare.com'],
      purpose: 'Fast delivery of libraries and assets',
      security: 'SRI hashes required for all scripts'
    }
  },
  fonts: {
    googleFonts: {
      domains: ['fonts.googleapis.com', 'fonts.gstatic.com'],
      purpose: 'Web font delivery for brand typography',
      privacy: 'font-display: swap, preconnect hints'
    }
  }
};
```

### **Content Security Policy Implementation**
```typescript
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Only for inline event handlers
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://www.clarity.ms",
    "https://cdnjs.cloudflare.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for dynamic styles
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https://www.google-analytics.com",
    "https://www.clarity.ms"
  ]
};
```

### **Input Sanitization Patterns**
```typescript
export class SecureComponent {
  private sanitizeText(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }
  
  private setTextContent(element: HTMLElement, content: string): void {
    // Always use textContent for user input
    element.textContent = content;
  }
  
  // ❌ NEVER DO THIS
  private dangerousSetHTML(element: HTMLElement, userInput: string): void {
    element.innerHTML = userInput; // XSS vulnerability
  }
}
```

### **Privacy Compliance Implementation**
```typescript
export interface ConsentPreferences {
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: Date;
}

export class PrivacyService implements IService {
  private readonly CONSENT_KEY = 'voder_consent_preferences';
  
  getUserConsent(): ConsentPreferences {
    const stored = localStorage.getItem(this.CONSENT_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Invalid stored data, treat as no consent
      }
    }
    
    return {
      analytics: false,
      functional: true, // Required for basic site function
      marketing: false,
      timestamp: null as any
    };
  }
  
  updateConsent(preferences: ConsentPreferences): void {
    preferences.timestamp = new Date();
    localStorage.setItem(this.CONSENT_KEY, JSON.stringify(preferences));
    this.applyConsentPreferences(preferences);
  }
}
```

---

## 🧪 **RUNTIME TESTING STANDARDS**

### **Runtime Testing Philosophy**
Runtime packages require specialized testing approaches:
1. **🔒 Component Contract Enforcement**: UI packages must implement the IComponent interface
2. **♿ Accessibility Compliance**: WCAG 2.1 AA requirements for all interactive elements
3. **🎭 Visual Validation**: Cross-browser rendering and animation consistency
4. **⚡ Performance Standards**: Initialization timing and memory leak prevention
5. **📱 Cross-Browser Support**: Chromium, Firefox, WebKit compatibility

### **IComponent Interface Compliance Tests**
```typescript
describe('IComponent Interface Compliance', () => {
  test('exports all required interface methods', () => {
    const packageExports = Object.keys(require('./index'));
    const requiredExports = ['ComponentName', 'IComponentConfig'];
    
    expect(packageExports).toEqual(expect.arrayContaining(requiredExports));
  });
  
  test('implements IComponent interface completely', () => {
    const component = new ComponentName(mockConfig);
    
    // Required properties
    expect(component).toHaveProperty('id');
    expect(component).toHaveProperty('isReady');
    
    // Required methods
    expect(typeof component.mount).toBe('function');
    expect(typeof component.unmount).toBe('function');
    expect(typeof component.update).toBe('function');
    expect(typeof component.destroy).toBe('function');
  });
});
```

### **Accessibility Testing Requirements**
**CRITICAL**: Accessibility tests MUST scroll to target sections and wait for animations to complete before scanning.

```typescript
describe('Accessibility Compliance', () => {
  test('passes accessibility scan after animations complete', async () => {
    // REQUIRED: Scroll to target section to trigger scroll-based animations
    await targetSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Give time for scroll to complete

    // Wait for GSAP and scroll-triggered animations to complete
    await page.waitForFunction(
      () => {
        // Check if GSAP is loaded and has active animations
        if (typeof window.gsap !== 'undefined') {
          const activeTweens = window.gsap
            .getTweensOf('*')
            .filter((tween) => tween.isActive());
          if (activeTweens.length > 0) {
            return false;
          }
        }

        // Check for elements with animation classes
        const animatingElements = document.querySelectorAll(
          '.animating, [data-animating="true"]'
        );
        return animatingElements.length === 0;
      },
      { timeout: 5000 }
    );

    // Then run accessibility scan
    const results = await new AxeBuilder({ page })
      .include('section[data-test-id="target-section"]')
      .analyze();
      
    expect(results.violations).toHaveLength(0);
  });
});
```

### **Performance Testing Standards**
```typescript
describe('Performance Requirements', () => {
  test('initializes within performance budget', () => {
    const startTime = performance.now();
    
    const component = new ComponentName({
      container: document.createElement('div'),
      services: createMockServices()
    });
    
    const initTime = performance.now() - startTime;
    expect(initTime).toBeLessThan(10); // 10ms budget for initialization
  });
  
  test('mounts within performance budget', async () => {
    const component = new ComponentName({
      container: document.createElement('div'),
      services: createMockServices()
    });
    
    const startTime = performance.now();
    await component.mount();
    const mountTime = performance.now() - startTime;
    
    expect(mountTime).toBeLessThan(100); // 100ms budget for mounting
  });
});
```

---

## 📚 **RUNTIME GLOSSARY & TERMINOLOGY**

### **Architecture Terms**
- **Component**: Self-contained unit with single responsibility, encapsulated implementation, composable through dependency injection
- **Service**: Stateless utility providing specific functionality (AnimationService, ScrollService, AccessibilityService, AssetService)
- **Effect**: Visual or interactive enhancement (Canvas3DEffect, TypingAnimationEffect, ParticleSystemEffect, InteractiveButtonEffect, CodeDisplayEffect)
- **Section**: Major content area telling part of the story (BrandEntrySection, TheWhySection, ProblemSpaceSection, MetaphorSection, VisionFlowSection, PromptIterationSection, OutcomeFocusSection, ClosingMomentSection)

### **Animation & Interaction Terms**
- **GSAP**: High-performance GPU-accelerated animation library with timeline control and ScrollTrigger
- **ScrollTrigger**: GSAP plugin for scroll-based animations with Intersection Observer integration
- **Three.js**: 3D graphics library for WebGL scenes with progressive enhancement
- **Reduced Motion**: Accessibility feature respecting `prefers-reduced-motion: reduce`
- **GPU Acceleration**: Use `transform` and `opacity` properties, avoid layout-triggering properties

### **Security & Privacy Terms**
- **CSP**: Content Security Policy preventing XSS attacks through script injection
- **Input Sanitization**: Process of cleaning user input to prevent XSS
- **Privacy Compliance**: GDPR, CCPA adherence with informed consent
- **Approved External Services**: Google Analytics, Microsoft Clarity, CDNs, Google Fonts

### **Accessibility Terms**
- **ARIA**: Accessible Rich Internet Applications standards for dynamic content
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines Level AA (target compliance)
- **Screen Reader**: Assistive technology (NVDA, JAWS, VoiceOver, TalkBack)
- **Keyboard Navigation**: Tab order, focus management, escape patterns, skip links
- **Color Contrast**: 4.5:1 ratio minimum for normal text, 3:1 for large text

### **Performance Terms**
- **Core Web Vitals**: LCP (< 2.5s), FID (< 100ms), CLS (< 0.1)
- **Critical CSS**: Above-the-fold styles inlined in HTML
- **Lazy Loading**: Load images, components, 3D models, effects when needed
- **Bundle Optimization**: Tree shaking, code splitting, dynamic imports, compression

---

## 🚀 **IMPLEMENTATION GUIDANCE**

### **Component Implementation Hints**
1. Components are implemented as TypeScript classes and functions, not framework components
2. Component architecture follows TypeScript class patterns (see examples in `examples/` directory)
3. Runtime components should use dependency injection for services
4. Maintain clear separation between components, sections, and effects
5. Follow the single responsibility principle for all runtime components

### **Getting Started**
1. **Read foundation docs**: Understand `@voder/shared`, `@voder/services`, `@voder/core`
2. **Review needs files**: Check what dependent packages require
3. **Follow architecture patterns**: Use dependency injection and event-driven communication
4. **Implement incrementally**: Start with basic functionality, add features progressively
5. **Test thoroughly**: Write tests for all public APIs and error cases

### **Common Patterns**
- **Service integration**: Always use dependency injection for services
- **Event communication**: Emit events for state changes, listen for external events
- **Configuration-driven**: Make behavior configurable rather than hardcoded
- **Graceful degradation**: Always provide fallbacks for missing features
- **Resource cleanup**: Implement proper disposal to prevent memory leaks

### **Quality Standards**
All runtime packages must meet:
- **TypeScript strict mode**: No `any` types in public APIs
- **ESLint compliance**: Zero warnings with @voder/eslint-config
- **Test coverage**: 90%+ coverage on all public APIs
- **Bundle size**: Maximum 50KB compressed
- **Performance**: Components initialize within 100ms

---

## 🎯 **SUCCESS CRITERIA**

Runtime packages pass implementation when:

1. **✅ IComponent Interface**: Full compliance with mount/unmount/destroy lifecycle
2. **✅ Brand Consistency**: Proper implementation of Voder visual language and voice
3. **✅ Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
4. **✅ Security**: CSP compliance, input sanitization, privacy-respectful analytics
5. **✅ Performance**: Initialization under 10ms, mounting under 100ms, no memory leaks
6. **✅ Visual Consistency**: Cross-browser rendering matches design specifications
7. **✅ Animation Compliance**: Respects reduced motion, meets timing requirements
8. **✅ Error Handling**: Graceful degradation and proper error reporting
9. **✅ Service Integration**: Proper dependency injection and service lifecycle management
10. **✅ Testing Coverage**: Comprehensive unit, accessibility, and performance tests

This comprehensive guide provides everything needed to implement runtime packages that deliver exceptional user experiences while maintaining security, accessibility, and brand consistency.
