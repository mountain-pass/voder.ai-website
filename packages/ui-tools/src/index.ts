// Public export barrel for @voder/ui-tools
// Re-exports core build factories plus testing & accessibility helpers so
// consumers can import a single package entry for UI testing utilities.
export { createPostCSSConfig } from './build/postcss.js';
export { createViteLibraryConfig } from './build/vite-library.js';
export { createVitestJsdomConfig } from './testing/vitest-jsdom.js';
// Testing helpers (DOM helpers)
export {
  renderComponent,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame,
} from './testing/helpers.js';
// Accessibility testing helpers
export {
  accessibilityTests,
  expectAccessible,
  expectAriaAttributes,
  expectFocusable,
  getAccessibilityViolations,
} from './testing/accessibility.js';
// Test environment setup (authoritative API)
export { setupJsdomTestEnvironment } from './testing/setup.js';
// Linting configuration exports
export { createAccessibilityLintConfig } from './linting/accessibility.js';
export { createCSSLintConfig } from './linting/css.js';
export { createHTMLLintConfig } from './linting/html.js';
