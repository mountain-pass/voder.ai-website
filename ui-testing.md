# UI Testing with @voder/dev-config

## **Overview**

This guide covers UI and accessibility testing patterns using the `@voder/dev-config` testing configurations. This is specifically for packages that need browser/DOM testing environments.

## **jsdom Environment Configuration**

For packages that need to test UI components, DOM interactions, or accessibility features, use the jsdom environment:

```ts
// vitest.config.ts
import { createVitestJsdomConfig } from '@voder/dev-config/testing';
export default createVitestJsdomConfig();
```

### **Vitest jsdom Config (reference shape)**
```javascript
import { defineConfig } from 'vitest/config';

export function createVitestJsdomConfig() {
  return defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test-setup.jsdom.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 }
      }
    }
  });
}
```

## **UI Test Utilities**

The testing package exports DOM-focused utilities for component testing:

```typescript
import { render, type RenderOptions } from '@testing-library/dom';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { IComponent } from '@voder/shared';

// Extend expect with accessibility matchers
expect.extend(toHaveNoViolations);

/**
 * Custom render function for component testing (jsdom/browser-only)
 */
export function renderComponent(
  component: IComponent,
  options?: RenderOptions
) {
  const container = document.createElement('div');
  component.mount(container);
  
  return {
    container,
    component,
    unmount: () => component.unmount(),
    rerender: (newProps: any) => component.update(newProps)
  };
}

/**
 * Accessibility testing helper (jsdom/browser-only)
 */
export async function expectAccessible(element: Element): Promise<void> {
  const results = await axe(element);
  expect(results).toHaveNoViolations();
}

/**
 * Animation testing helper (jsdom/browser-only)
 * Waits for a given duration to allow CSS animations/transitions to complete.
 */
export async function waitForAnimation(duration = 300): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, duration));
}
```

## **🚨 CRITICAL: jest-axe Testing Approach**

**DO NOT MOCK jest-axe** - Complex mocking of `axe` and `toHaveNoViolations` is unreliable and doesn't test real accessibility.

### **✅ CORRECT APPROACH: Real Accessibility Violations**

Create actual DOM elements with accessibility issues to test that jest-axe correctly detects them:

```typescript
// ✅ CORRECT: Test that accessibility violations are detected
it('should detect accessibility violations', async () => {
  // Create element with actual accessibility issue
  const badButton = document.createElement('button');
  badButton.style.color = '#ccc';
  badButton.style.backgroundColor = '#ddd'; // Poor contrast
  badButton.textContent = 'Bad Button';
  document.body.appendChild(badButton);

  // Test that axe correctly identifies the violation
  const results = await axe(document.body);
  expect(results.violations).toHaveLength(1);
  expect(results.violations[0].id).toBe('color-contrast');
  
  document.body.removeChild(badButton);
});

it('should pass for accessible elements', async () => {
  // Create properly accessible element
  const goodButton = document.createElement('button');
  goodButton.textContent = 'Accessible Button';
  goodButton.setAttribute('aria-label', 'Click me');
  document.body.appendChild(goodButton);

  // Test that no violations are found
  await expect(goodButton).toHaveNoViolations();
  
  document.body.removeChild(goodButton);
});
```

### **Common Accessibility Issues to Test**

- **Color contrast**: Low contrast text/background combinations
- **Missing labels**: Form inputs without associated labels
- **Missing alt text**: Images without descriptive alt attributes
- **Empty links**: Anchor tags with no content or aria-label
- **Improper headings**: Skipped heading levels (h1 → h3)

### **Why This Approach Works**

- Tests real accessibility rules, not mocked behavior
- Validates that jest-axe integration is working correctly
- Provides confidence that accessibility checks will catch real issues
- Simple to implement and maintain

## **Test Setup for jsdom Environment**

```typescript
// src/test-setup.jsdom.ts (jsdom/browser environment)
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/dom';
import { afterEach } from 'vitest';

// Cleanup after each test (DOM)
afterEach(() => {
  cleanup();
});
```

## **ESLint Accessibility Configuration**

UI packages should include the accessibility layer in their ESLint configuration:

```javascript
// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, accessibility, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx,
  ...accessibility,  // Include for UI packages
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] }
];
```

## **Mandatory Consumer Requirements**

UI packages that adopt `@voder/dev-config` MUST document in their public README:

- **Test environment**: Usage of jsdom configuration for browser/UI testing
- **Accessibility testing**: How accessibility testing is integrated using jest-axe
- **Test utilities**: Available DOM-focused test helpers and assertions
- **Coverage requirements**: 90% coverage across branches, functions, lines, statements
- **ESLint layers**: Include accessibility layer for web component compliance

## **When to Use jsdom vs Node**

### **Use jsdom when:**
- Testing UI components or web interfaces
- Need DOM APIs (document, window, etc.)
- Testing accessibility features
- Working with browser-specific APIs
- Testing CSS animations or interactions

### **Use Node when:**
- Testing server-side logic, APIs, or CLI tools
- Working with file systems, databases, or Node.js-specific APIs
- Testing configuration packages (like this one)
- No DOM dependencies required

> Note: `@voder/dev-config` itself is non-UI and uses the Node configuration for its own tests.
