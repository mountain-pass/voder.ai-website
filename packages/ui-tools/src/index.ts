// Public export barrel for @voder/ui-tools
// Re-exports core build factories plus testing & accessibility helpers so
// consumers can import a single package entry for UI testing utilities.

export { createPostCSSConfig, type PostCSSConfigOptions } from './build/postcss.ts';
export { createViteLibraryConfig, type ViteLibraryOptions } from './build/vite-library.ts';
export { createVitestJsdomConfig, type VitestJsdomOptions } from './testing/vitest-jsdom.ts';

// Testing helpers (DOM helpers)
export {
  type ComponentTestResult,
  renderComponent,
  type RenderComponentOptions,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame} from './testing/helpers.ts';

// Accessibility testing helpers
export {
  type AccessibilityTestOptions,
  accessibilityTests,
  expectAccessible,
  expectAriaAttributes,
  expectFocusable,
  getAccessibilityViolations} from './testing/accessibility.ts';

// Test environment setup (authoritative API)
export { setupJsdomTestEnvironment } from './testing/setup.ts';

// Linting configuration exports
export {
  type AccessibilityLintOptions,
  createAccessibilityLintConfig} from './linting/accessibility.ts';
export {
  createCSSLintConfig,
  type CSSLintOptions
} from './linting/css.ts';
export {
  createHTMLLintConfig,
  type HTMLLintOptions
} from './linting/html.ts';
