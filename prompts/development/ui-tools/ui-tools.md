# @voder/ui-tools Package Implementation Guide

This document provides comprehensive implementation guidelines for the `@voder/ui-tools` package, which serves as the specialized development tooling for UI component libraries in the Voder monorepo. This package provides build configurations, testing utilities, linting tools, and quality assurance specifically for browser-based UI development.

## 🎯 **PACKAGE SCOPE & RESPONSIBILITIES**

### **Primary Responsibilities**
- **Library Build Configuration**: Vite configs optimized for UI component library builds (ESM-only)
- **CSS Processing**: PostCSS + Autoprefixer configurations for cross-browser compatibility
- **UI Testing**: jsdom-based testing configurations and DOM-focused test utilities
- **Accessibility Testing**: jest-axe integration and accessibility validation helpers
- **HTML/CSS/Accessibility Linting**: Quality tools for markup, styling, and accessibility-focused static analysis
- **Component Test Utilities**: Helpers for testing UI components and interactions

### **What This Package Should NOT Include**
- ❌ Application build configurations (use Vite directly)
- ❌ Server-side testing utilities (belongs in individual packages)
- ❌ Runtime component libraries (belongs in runtime packages)
- ❌ Node.js-specific tooling (belongs in @voder/dev-config)
- ❌ Backend or API testing tools

## 🏗️ **PACKAGE STRUCTURE**

```
packages/ui-tools/
├── src/
│   ├── index.ts                    # Main export barrel
│   ├── build/                      # Build configurations
│   │   ├── index.ts               # Build exports
│   │   ├── vite-library.ts        # Vite library config factory
│   │   └── postcss.ts             # PostCSS configuration
│   ├── testing/                    # Testing utilities
│   │   ├── index.ts               # Testing exports
│   │   ├── vitest-jsdom.ts        # Vitest jsdom config factory
│   │   ├── helpers.ts             # DOM testing helpers
│   │   ├── accessibility.ts       # Accessibility testing utilities
│   │   └── setup.ts               # Test environment setup
│   ├── linting/                    # Linting configurations
│   │   ├── index.ts               # Linting exports
│   │   ├── html.ts                # HTML linting config
│   │   ├── css.ts                 # CSS/Stylelint config
│   │   └── accessibility.ts       # Accessibility linting rules
│   └── utils/                      # Shared utilities
│       ├── index.ts               # Utility exports
│       ├── file-utils.ts          # File system helpers
│       └── config-utils.ts        # Configuration merging utilities
├── templates/                      # Configuration templates
│   ├── vitest.config.ts           # Example Vitest config
│   ├── vite.config.ts             # Example Vite config
│   └── test-setup.jsdom.ts        # Example test setup
├── tests/                          # Vitest unit tests
├── dist/                           # Built output (git-ignored)
├── package.json                    # Package metadata
├── tsconfig.json                   # TypeScript config
└── vite.config.ts                  # Build configuration
```

## 🔧 **LIBRARY BUILD CONFIGURATIONS**

### **Vite Library Configuration Factory**
```typescript
// src/build/vite-library.ts
import { defineConfig, type UserConfig } from 'vite';
import { resolve } from 'path';
import { createPostCSSConfig } from './postcss.js';

export interface ViteLibraryOptions {
  /** Library name (metadata only; ESM-only build) */
  name: string;
  /** Entry point file path */
  entry: string;
  /** External dependencies to exclude from bundle */
  external?: string[];
  /** Additional Vite configuration overrides */
  viteConfig?: UserConfig;
  /** Enable CSS extraction (default: true) */
  extractCSS?: boolean;
  /** PostCSS configuration overrides */
  postcssConfig?: object;
}

export function createViteLibraryConfig(options: ViteLibraryOptions) {
  const {
    name,
    entry,
    external = ['react', 'react-dom', '@voder/shared'],
    viteConfig = {},
    extractCSS = true,
    postcssConfig = {}
  } = options;

  return defineConfig({
    // Pure ESM output (no UMD/IIFE formats; no globals generation)
    build: {
      lib: {
        entry: resolve(entry),
        name,
        formats: ['es'], // ESM-only
        fileName: (format) => `index.${format}.js`
      },
      rollupOptions: {
        external
      },
      sourcemap: true,
      minify: false, // Let consumers handle minification
      cssCodeSplit: extractCSS
    },
    css: {
      postcss: {
        ...createPostCSSConfig(),
        ...postcssConfig
      }
    },
    ...viteConfig
  });
}
```

### **PostCSS Configuration**
```typescript
// src/build/postcss.ts
import autoprefixer from 'autoprefixer';

export interface PostCSSConfigOptions {
  /** Autoprefixer browser targets */
  browsers?: string[];
  /** Additional PostCSS plugins */
  plugins?: any[];
}

export function createPostCSSConfig(options: PostCSSConfigOptions = {}) {
  const {
    browsers = ['last 2 versions', '> 1%', 'not dead'],
    plugins = []
  } = options;

  return {
    plugins: [
      autoprefixer({ overrideBrowserslist: browsers }),
      ...plugins
    ]
  };
}
```

## 🧪 **UI TESTING CONFIGURATIONS**

### **Vitest jsdom Configuration Factory**
```typescript
// src/testing/vitest-jsdom.ts
import { defineConfig, type UserConfig } from 'vitest/config';

export interface VitestJsdomOptions {
  /** Additional setup files */
  setupFiles?: string[];
  /** Coverage configuration overrides */
  coverage?: object;
  /** Additional Vitest configuration */
  vitestConfig?: UserConfig;
}

export function createVitestJsdomConfig(options: VitestJsdomOptions = {}) {
  const {
    setupFiles = ['./src/test-setup.jsdom.ts'],
    coverage = {},
    vitestConfig = {}
  } = options;

  return defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        thresholds: { 
          branches: 90, 
          functions: 90, 
          lines: 90, 
          statements: 90 
        },
        ...coverage
      }
    },
    ...vitestConfig
  });
}
```

### **DOM Testing Helpers**
```typescript
// src/testing/helpers.ts
import { cleanup } from '@testing-library/dom';
import type { IComponent } from '@voder/shared';

export interface RenderComponentOptions {
  /** Container element to mount into */
  container?: Element;
  /** Additional render options */
  [key: string]: any;
}

export interface ComponentTestResult {
  /** The DOM container element */
  container: Element;
  /** The component instance */
  component: IComponent;
  /** Unmount the component */
  unmount: () => Promise<void>;
  /** Update component props */
  update: (props: any) => Promise<void>;
}

/**
 * Custom render function for component testing (jsdom/browser-only)
 */
export function renderComponent(
  component: IComponent,
  options: RenderComponentOptions = {}
): ComponentTestResult {
  const container = options.container || document.createElement('div');
  document.body.appendChild(container);
  
  component.mount(container);
  
  return {
    container,
    component,
    unmount: async () => {
      await component.unmount();
      container.parentNode?.removeChild(container);
    },
    update: async (props: any) => {
      if ('updateConfig' in component) {
        await (component as any).updateConfig(props);
      }
    }
  };
}

/**
 * Animation testing helper (jsdom/browser-only)
 * Waits for a given duration to allow CSS animations/transitions to complete.
 */
export async function waitForAnimation(duration = 300): Promise<void> {
  await new Promise((r) => setTimeout(r, duration));
}

/**
 * Wait for the next animation frame
 */
export async function waitForNextFrame(): Promise<void> {
  await new Promise((r) => requestAnimationFrame(r));
}

/**
 * Simulate user interaction events
 */
export function simulateClick(element: Element): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

export function simulateKeypress(element: Element, key: string): void {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}

/**
 * NOTE: Environment setup (cleanup, mocks) is centralized in setupJsdomTestEnvironment.
 * The previous helper-level setupJsdomEnvironment has been removed to avoid duplication.
 */
```

### **Accessibility Testing Utilities**
```typescript
// src/testing/accessibility.ts
import { axe, toHaveNoViolations, type AxeResults } from 'jest-axe';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

export interface AccessibilityTestOptions {
  /** Axe configuration options */
  axeConfig?: object;
  /** Rules to exclude from testing */
  excludeRules?: string[];
}

/**
 * Accessibility testing helper (jsdom/browser-only)
 * 
 * IMPORTANT: Color contrast testing is NOT supported in JSDOM environments.
 * See: https://github.com/dequelabs/axe-core/issues/595
 * 
 * For color contrast testing, use:
 * - Real browser environments (Playwright, Puppeteer, Cypress)
 * - Exclude 'color-contrast' from JSDOM tests via excludeRules
 */
export async function expectAccessible(
  element: Element,
  options: AccessibilityTestOptions = {}
): Promise<void> {
  const { axeConfig = {}, excludeRules = [] } = options;
  
  const config = {
    ...axeConfig,
    rules: excludeRules.reduce((acc, rule) => {
      acc[rule] = { enabled: false };
      return acc;
    }, {} as Record<string, { enabled: boolean }>)
  };
  
  const results = await axe(element, config);
  expect(results).toHaveNoViolations();
}

/**
 * Check for specific accessibility violations
 * Now applies excludeRules (aligned with expectAccessible)
 * 
 * IMPORTANT: Color contrast violations cannot be detected in JSDOM.
 * Results for 'color-contrast' rule will appear in the 'incomplete' array,
 * not the 'violations' array, because axe-core cannot determine color
 * contrast without browser rendering capabilities.
 */
export async function getAccessibilityViolations(
  element: Element,
  options: AccessibilityTestOptions = {}
): Promise<AxeResults> {
  const { axeConfig = {}, excludeRules = [] } = options;
  const config = {
    ...axeConfig,
    rules: excludeRules.reduce((acc, rule) => {
      acc[rule] = { enabled: false };
      return acc;
    }, {} as Record<string, { enabled: boolean }>)
  };
  return await axe(element, config);
}

/**
 * Test that an element has proper ARIA attributes
 */
export function expectAriaAttributes(
  element: Element,
  expectedAttrs: Record<string, string>
): void {
  Object.entries(expectedAttrs).forEach(([attr, value]) => {
    const actualValue = element.getAttribute(attr);
    expect(actualValue).toBe(value);
  });
}

/**
 * Test that an element is properly focusable
 */
export function expectFocusable(element: Element): void {
  expect(element).toHaveAttribute('tabindex');
  expect(element.getAttribute('tabindex')).not.toBe('-1');
}

/**
 * Common accessibility test scenarios
 * 
 * NOTE: colorContrast test will NOT work in JSDOM environments.
 * Use browser-based testing for color contrast validation.
 */
export const accessibilityTests = {
  /**
   * Test for color contrast violations
   * 
   * ⚠️ WARNING: This test will NOT work in JSDOM environments.
   * Color contrast testing requires actual browser rendering.
   * 
   * For JSDOM tests, exclude 'color-contrast' rule:
   * await expectAccessible(element, { excludeRules: ['color-contrast'] });
   * 
   * For color contrast testing, use:
   * - Playwright: Real browser automation
   * - Cypress: Browser-based testing
   * - Puppeteer: Headless Chrome testing
   */
  async colorContrast(element: Element): Promise<void> {
    const results = await axe(element, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    expect(results.violations.filter(v => v.id === 'color-contrast')).toHaveLength(0);
  },

  /**
   * Test for missing form labels (works in JSDOM)
   */
  async formLabels(element: Element): Promise<void> {
    const results = await axe(element, {
      rules: {
        'label': { enabled: true }
      }
    });
    expect(results.violations.filter(v => v.id === 'label')).toHaveLength(0);
  },

  /**
   * Test for proper heading structure (works in JSDOM)
   */
  async headingStructure(element: Element): Promise<void> {
    const results = await axe(element, {
      rules: {
        'heading-order': { enabled: true }
      }
    });
    expect(results.violations.filter(v => v.id === 'heading-order')).toHaveLength(0);
  }
};
```

### **Test Environment Setup**
```typescript
// src/testing/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/dom';
import { afterEach, vi } from 'vitest';

/**
 * Standard jsdom test environment setup
 */
export function setupJsdomTestEnvironment(): void {
  // Cleanup DOM after each test
  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
  });

  // Mock common browser APIs not available in jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Provide Canvas 2D mock to prevent axe-core crashes in JSDOM
  // See: Canvas API Mocking section below for details
  if (typeof HTMLCanvasElement !== 'undefined') {
    HTMLCanvasElement.prototype.getContext = function (contextType: string) {
      if (contextType === '2d') {
        return {
          createImageData: (width: number, height: number) => ({
            data: new Uint8ClampedArray(width * height * 4),
            width,
            height,
          }),
          getImageData: (_x: number, _y: number, width: number, height: number) => ({
            data: new Uint8ClampedArray(width * height * 4),
            width,
            height,
          }),
          putImageData: () => { /* no-op */ },
          drawImage: () => { /* no-op */ },
          fillRect: () => { /* no-op */ },
          clearRect: () => { /* no-op */ },
        };
      }
      return null;
    };
  }
}
```

## 🔍 **LINTING CONFIGURATIONS**

### **HTML Linting Configuration**
```typescript
// src/linting/html.ts
export interface HTMLLintOptions {
  /** Rules to exclude */
  excludeRules?: string[];
  /** Additional rule overrides */
  rules?: Record<string, any>;
}

export function createHTMLLintConfig(options: HTMLLintOptions = {}) {
  const { excludeRules = [], rules = {} } = options;

  return {
    extends: ['htmlhint:recommended'],
    rules: {
      'title-require': true,
      'alt-require': true,
      'attr-lowercase': true,
      'attr-value-double-quotes': true,
      'doctype-first': true,
      'tag-pair': true,
      'spec-char-escape': true,
      'id-unique': true,
      'src-not-empty': true,
      'attr-no-duplication': true,
      'space-tab-mixed-disabled': 'tab',
      ...excludeRules.reduce((acc, rule) => {
        acc[rule] = false;
        return acc;
      }, {} as Record<string, boolean>),
      ...rules
    }
  };
}
```

### **CSS Linting Configuration**
```typescript
// src/linting/css.ts
export interface CSSLintOptions {
  /** Rules to exclude */
  excludeRules?: string[];
  /** Additional rule overrides */
  rules?: Record<string, any>;
}

export function createCSSLintConfig(options: CSSLintOptions = {}) {
  const { excludeRules = [], rules = {} } = options;

  return {
    extends: [
      'stylelint-config-standard',
      'stylelint-config-css-modules'
    ],
    plugins: [
      'stylelint-order'
    ],
    rules: {
      // Property ordering
      'order/properties-alphabetical-order': true,

      // CSS best practices
      'color-hex-length': 'short',
      'color-no-invalid-hex': true,
      'declaration-block-no-duplicate-properties': true,
      'declaration-block-trailing-semicolon': 'always',
      'indentation': 2,
      'max-empty-lines': 2,
      'no-duplicate-selectors': true,
      'no-extra-semicolons': true,

      ...excludeRules.reduce((acc, rule) => {
        acc[rule] = null;
        return acc;
      }, {} as Record<string, null>),
      ...rules
    }
  };
}
```

### **Accessibility Linting Configuration**
```typescript
// src/linting/accessibility.ts
export interface AccessibilityLintOptions {
  /** Rules to exclude */
  excludeRules?: string[];
  /** Additional rule overrides */
  rules?: Record<string, any>;
}

export function createAccessibilityLintConfig(options: AccessibilityLintOptions = {}) {
  const { excludeRules = [], rules = {} } = options;

  return {
    // Focused accessibility rule set kept separate so teams can opt-in or tune independently
    plugins: ['stylelint-a11y'],
    rules: {
      'a11y/content-property-no-static-value': true,
      'a11y/font-size-is-readable': true,
      'a11y/line-height-is-vertical-rhythmed': true,
      'a11y/no-outline-none': true,
      'a11y/selector-pseudo-class-focus': true,
      ...excludeRules.reduce((acc, rule) => {
        acc[rule] = null; // disable excluded a11y rule
        return acc;
      }, {} as Record<string, null>),
      ...rules
    }
  };
}
```

## 📦 **EXPORT STRUCTURE**

### **Main Export Barrel**
```typescript
// src/index.ts
// Build configuration exports
export {
  createViteLibraryConfig,
  type ViteLibraryOptions
} from './build/vite-library.js';

export {
  createPostCSSConfig,
  type PostCSSConfigOptions
} from './build/postcss.js';

// Testing configuration exports
export {
  createVitestJsdomConfig,
  type VitestJsdomOptions
} from './testing/vitest-jsdom.js';

// Testing utility exports
export {
  renderComponent,
  waitForAnimation,
  waitForNextFrame,
  simulateClick,
  simulateKeypress,
  type RenderComponentOptions,
  type ComponentTestResult
} from './testing/helpers.js';

// Accessibility testing exports
export {
  expectAccessible,
  getAccessibilityViolations,
  expectAriaAttributes,
  expectFocusable,
  accessibilityTests,
  type AccessibilityTestOptions
} from './testing/accessibility.js';

// Test environment setup export (single authoritative API)
export { setupJsdomTestEnvironment } from './testing/setup.js';

// Linting configuration exports
export {
  createHTMLLintConfig,
  type HTMLLintOptions
} from './linting/html.js';

export {
  createCSSLintConfig,
  type CSSLintOptions
} from './linting/css.js';

export {
  createAccessibilityLintConfig,
  type AccessibilityLintOptions
} from './linting/accessibility.js';
```

## 🧪 **TESTING REQUIREMENTS**

### **Unit Test Coverage**
- **Build configurations**: Test Vite and PostCSS config generation
- **Testing utilities**: Test DOM helpers and accessibility functions
- **Linting configurations**: Test HTML, CSS, and accessibility config generation
- **Template files**: Validate generated configuration templates
- **Integration tests**: Test full build and test workflows

### **Test Structure**
```typescript
// tests/build/vite-library.test.ts
describe('Vite Library Configuration', () => {
  it('should generate valid ESM-only configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.ts'
    });
    
    expect(config.build?.lib?.formats).toEqual(['es']);
    expect(config.build?.lib?.name).toBe('TestLib');
  });
  
  it('should include PostCSS configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.ts'
    });
    
    expect(config.css?.postcss).toBeDefined();
  });
});

// tests/testing/accessibility.test.ts
describe('Accessibility Testing', () => {
  it('should detect missing form labels (JSDOM-compatible)', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    // Unlabeled form input - this WILL be detected in JSDOM
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'unlabeled-input';
    form.appendChild(input);
    wrapper.appendChild(form);

    const violations = await getAccessibilityViolations(wrapper);
    expect(violations.violations.some(v => v.id === 'label')).toBe(true);
    
    document.body.removeChild(wrapper);
  });
  
  it('should exclude color-contrast from JSDOM tests', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    // Even with bad contrast, this should pass when color-contrast is excluded
    const badButton = document.createElement('button');
    badButton.style.color = '#ccc';
    badButton.style.backgroundColor = '#ddd';
    badButton.textContent = 'Bad Button';
    wrapper.appendChild(badButton);

    // This should pass because we exclude color-contrast rule
    await expectAccessible(wrapper, { 
      excludeRules: ['color-contrast'] 
    });
    
    document.body.removeChild(wrapper);
  });

  // NOTE: Color contrast tests should be in browser-based test suites
  // Example for Playwright/Cypress integration tests:
  /*
  describe('Color Contrast (Browser Required)', () => {
    it('should detect color contrast violations', async () => {
      // This test would run in Playwright/Cypress, not JSDOM
      const page = await browser.newPage();
      await page.setContent(`
        <button style="color: #ccc; background-color: #ddd;">
          Bad Contrast Button
        </button>
      `);
      
      const results = await injectAxe(page);
      const violations = await checkA11y(page);
      expect(violations.violations.some(v => v.id === 'color-contrast')).toBe(true);
    });
  });
  */
});
```

## 📊 **PERFORMANCE CONSIDERATIONS**

### **Build Performance**
- Optimize Vite configurations for fast library builds
- Enable proper tree-shaking and dead code elimination
- Minimize bundle size through external dependency management
- Use sourcemaps for debugging without bloating production builds

### **Test Performance**
- Use jsdom only when DOM APIs are required
- Implement efficient test cleanup and teardown
- Cache compiled configurations across test runs
- Parallel test execution for independent test suites

### **Development Experience**
- Fast configuration generation with minimal overhead
- Clear error messages for configuration issues
- Hot reload support for configuration changes
- Comprehensive TypeScript types for all APIs

## 🔒 **SECURITY PATTERNS**

### **Configuration Security**
- Validate all configuration inputs
- Sanitize file paths and external dependencies
- Use safe defaults for all configuration options
- Prevent code injection through configuration

### **Test Security**
- Isolate test environments properly
- Clean up test artifacts and temporary files
- Validate test input data
- Prevent test pollution between runs

## 📚 **USAGE EXAMPLES**

### **Library Build Setup**
```typescript
// vite.config.ts
import { createViteLibraryConfig } from '@voder/ui-tools';

export default createViteLibraryConfig({
  name: 'MyUILibrary',
  entry: './src/index.ts',
  external: ['react', 'react-dom', '@voder/shared']
});
```

### **Component Testing Setup**
```typescript
// vitest.config.ts
import { createVitestJsdomConfig } from '@voder/ui-tools';

export default createVitestJsdomConfig({
  setupFiles: ['./src/test-setup.jsdom.ts']
});

// src/test-setup.jsdom.ts
import { setupJsdomTestEnvironment } from '@voder/ui-tools';
setupJsdomTestEnvironment();
```

### **Component Test Example**
```typescript
// tests/Button.test.ts
import { 
  renderComponent, 
  expectAccessible, 
  simulateClick 
} from '@voder/ui-tools';
import { Button } from '../src/Button';

describe('Button Component', () => {
  it('should render and be accessible (excluding color-contrast)', async () => {
    const button = new Button({ text: 'Click me' });
    const { container, unmount } = renderComponent(button);
    
    expect(container.querySelector('button')).toBeInTheDocument();
    
    // Exclude color-contrast rule for JSDOM testing
    await expectAccessible(container, { 
      excludeRules: ['color-contrast'] 
    });
    
    await unmount();
  });
  
  it('should handle click events', async () => {
    const onClick = vi.fn();
    const button = new Button({ text: 'Click me', onClick });
    const { container, unmount } = renderComponent(button);
    
    const buttonElement = container.querySelector('button')!;
    simulateClick(buttonElement);
    
    expect(onClick).toHaveBeenCalledOnce();
    
    await unmount();
  });
});
```

## 🚨 **JSDOM ACCESSIBILITY TESTING LIMITATIONS**

### **Color Contrast Testing Issue**

**Known Issue**: Color contrast testing does not work in JSDOM environments due to fundamental limitations in the DOM simulation.

**Root Cause**: 
- **GitHub Issue**: https://github.com/dequelabs/axe-core/issues/595
- **Missing APIs**: JSDOM lacks `range.getClientRects()` and proper CSS rendering
- **No Visual Rendering**: Color contrast requires actual pixel-level analysis
- **Axe-core Behavior**: Color contrast results appear in `incomplete` array, not `violations`

### **Canvas API Mocking Issue**

**Known Issue**: Axe-core probes for Canvas API support during accessibility testing, which causes crashes in JSDOM environments.

**Root Cause**:
- **Error**: `Not implemented: HTMLCanvasElement.prototype.getContext`
- **Trigger**: Axe-core calls `canvas.getContext('2d')` to check browser capabilities
- **JSDOM Limitation**: Canvas APIs are not implemented in JSDOM environment
- **Impact**: Tests crash during accessibility rule execution, even for non-visual rules

**Workaround Solution**:
```typescript
// Mock Canvas 2D context to prevent axe-core crashes
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function (contextType: string) {
    if (contextType === '2d') {
      return {
        createImageData: (width: number, height: number) => ({
          data: new Uint8ClampedArray(width * height * 4),
          width,
          height,
        }),
        getImageData: (_x: number, _y: number, width: number, height: number) => ({
          data: new Uint8ClampedArray(width * height * 4),
          width,
          height,
        }),
        putImageData: () => { /* no-op */ },
        drawImage: () => { /* no-op */ },
        fillRect: () => { /* no-op */ },
        clearRect: () => { /* no-op */ },
      };
    }
    return null;
  };
}
```

**Important Notes**:
- This mock prevents crashes but does NOT enable color-contrast testing
- Color contrast testing still requires real browser environments
- The mock provides minimal Canvas 2D API surface for axe-core compatibility

### **Canvas Mock Requirements**

When setting up accessibility testing in JSDOM environments, Canvas mocking is **required**:

- **Purpose**: Prevents "Not implemented: HTMLCanvasElement.prototype.getContext" errors
- **Scope**: Required for any accessibility testing in JSDOM environments
- **Implementation**: Must provide minimal 2D context API surface for axe-core compatibility
- **Limitation**: Does not enable actual Canvas functionality or color-contrast testing
- **Integration**: Automatically included in `setupJsdomTestEnvironment()` function

### **Affected Functionality**
- ❌ `accessibilityTests.colorContrast()` - Will not detect violations in JSDOM
- ❌ Color contrast expectations in `getAccessibilityViolations()` - Will always return empty
- ❌ Any test expecting color-contrast violations from axe-core in JSDOM
- ✅ Other accessibility rules work correctly with Canvas mock in place

### **Recommended Solutions**

#### **1. Exclude Color Contrast in JSDOM Tests (Recommended)**
```typescript
// Recommended approach for JSDOM component tests
await expectAccessible(container, { 
  excludeRules: ['color-contrast'] 
});

// Test other accessibility rules that work in JSDOM
await accessibilityTests.formLabels(container);
await accessibilityTests.headingStructure(container);
```

#### **2. Browser-Based Testing for Color Contrast**
```typescript
// Playwright example (for integration/e2e tests)
test('color contrast validation', async ({ page }) => {
  await page.setContent(`
    <button style="color: #ccc; background-color: #ddd;">
      Low Contrast Button
    </button>
  `);
  
  await injectAxe(page);
  const violations = await checkA11y(page);
  expect(violations.some(v => v.id === 'color-contrast')).toBe(true);
});

// Cypress example
cy.checkA11y(null, {
  rules: {
    'color-contrast': { enabled: true }
  }
});
```

#### **3. Manual Color Contrast Validation**
```typescript
// Custom color contrast checker (for design system validation)
function validateContrastRatio(foreground: string, background: string): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  return ratio >= 4.5; // WCAG AA standard
}

// Use in design system tests
expect(validateContrastRatio('#000', '#fff')).toBe(true);
expect(validateContrastRatio('#ccc', '#ddd')).toBe(false);
```

### **Documentation Requirements**

**README.md sections must include:**

1. **Accessibility Testing Limitations**:
   ```markdown
   ## ⚠️ Accessibility Testing Limitations
   
   ### Color Contrast Testing
   Color contrast testing is **not supported** in JSDOM environments. This is a known limitation of axe-core when running in simulated DOM environments.
   
   **For JSDOM tests**: Always exclude the `color-contrast` rule:
   \`\`\`typescript
   await expectAccessible(element, { excludeRules: ['color-contrast'] });
   \`\`\`
   
   **For color contrast testing**: Use browser-based testing tools:
   - Playwright for automated browser testing
   - Cypress for integration testing  
   - Manual design system validation
   ```

2. **Testing Strategy Guidance**:
   ```markdown
   ## Testing Strategy
   
   ### Unit Tests (JSDOM)
   - ✅ Form labels and ARIA attributes
   - ✅ Keyboard navigation and focus management
   - ✅ Heading structure and landmarks
   - ✅ Canvas mock prevents axe-core crashes during accessibility testing
   - ❌ Color contrast (use browser tests)
   
   ### Integration Tests (Browser)
   - ✅ Full accessibility validation including color contrast
   - ✅ Visual regression testing
   - ✅ Real user interaction simulation
   - ✅ Actual Canvas API functionality
   ```

This implementation guide provides a comprehensive foundation for the `@voder/ui-tools` package that serves as the specialized development tooling for UI component libraries. The package includes optimized build configurations, comprehensive testing utilities, and quality assurance tools specifically designed for browser-based UI development while maintaining simplicity and LLM-friendliness.
