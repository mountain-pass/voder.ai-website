// src/testing/index.ts
// Public testing API barrel for @voder/ui-tools
// Re-exports jsdom/vitest config factory, DOM testing helpers, accessibility helpers,
// and the authoritative test environment setup function.

export {
  type AccessibilityTestOptions,
  accessibilityTests,
  expectAccessible,
  expectAriaAttributes,
  expectFocusable,
  getAccessibilityViolations} from './accessibility.js';
export {
  type ComponentTestResult,
  renderComponent,
  type RenderComponentOptions,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame} from './helpers.js';
export { createVitestJsdomConfig, type VitestJsdomOptions } from './vitest-jsdom.js';

// Test environment setup (single authoritative API)
export { setupJsdomTestEnvironment } from './setup.js';
