// Public export barrel for @voder/ui-tools
// Re-exports core build factories plus testing & accessibility helpers so
// consumers can import a single package entry for UI testing utilities.

export { createPostCSSConfig, type PostCSSConfigOptions } from './build/postcss.js';
export { createViteLibraryConfig, type ViteLibraryOptions } from './build/vite-library.js';
export { createVitestJsdomConfig, type VitestJsdomOptions } from './testing/vitest-jsdom.js';

// Testing helpers (DOM helpers)
export {
  type ComponentTestResult,
  renderComponent,
  type RenderComponentOptions,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame} from './testing/helpers.js';

// Accessibility testing helpers
export {
  type AccessibilityTestOptions,
  accessibilityTests,
  expectAccessible,
  expectAriaAttributes,
  expectFocusable,
  getAccessibilityViolations} from './testing/accessibility.js';

// Test environment setup (authoritative API)
export { setupJsdomTestEnvironment } from './testing/setup.js';
