// src/testing/index.ts
// Public testing API barrel for @voder/ui-tools
// Re-exports jsdom/vitest config factory, DOM testing helpers, accessibility helpers,
// and the authoritative test environment setup function.

export { createVitestJsdomConfig, type VitestJsdomOptions } from './vitest-jsdom.js';

export {
  renderComponent,
  waitForAnimation,
  waitForNextFrame,
  simulateClick,
  simulateKeypress,
  type RenderComponentOptions,
  type ComponentTestResult
} from './helpers.js';

export {
  expectAccessible,
  getAccessibilityViolations,
  expectAriaAttributes,
  expectFocusable,
  accessibilityTests,
  type AccessibilityTestOptions
} from './accessibility.js';

// Test environment setup (single authoritative API)
export { setupJsdomTestEnvironment } from './setup.js';
