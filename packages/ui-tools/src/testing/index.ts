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
  getAccessibilityViolations} from './accessibility.ts';
export {
  type ComponentTestResult,
  renderComponent,
  type RenderComponentOptions,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame} from './helpers.ts';
export { createVitestJsdomConfig, type VitestJsdomOptions } from './vitest-jsdom.ts';

// Test environment setup (single authoritative API)
export { setupJsdomTestEnvironment } from './setup.ts';
