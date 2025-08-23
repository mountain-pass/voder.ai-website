# @voder/ui-tools API Reference

This document lists all public exports of the `@voder/ui-tools` package, their function signatures, and a brief description.

---

## Build Factories

### createPostCSSConfig(options: PostCSSConfigOptions): { plugins: any[] }
Create a PostCSS config for Vite’s `css.postcss`, with Autoprefixer and user-supplied plugins.

### createViteLibraryConfig(options: ViteLibraryOptions): UserConfig
Generate an ESM-only Vite library build configuration, merging sensible defaults and PostCSS settings.

---

## Testing Configuration

### createVitestJsdomConfig(options?: VitestJsdomOptions): UserConfig
Produce a Vitest configuration object pre-tuned for jsdom-based UI testing and coverage thresholds.

---

## DOM Testing Helpers

### renderComponent(component: any, options?: RenderComponentOptions): ComponentTestResult  
Mount a component into a jsdom container and return helpers to unmount/update it.

### waitForAnimation(duration?: number): Promise<void>  
Pause for a given duration to allow CSS animations/transitions to complete.

### waitForNextFrame(): Promise<void>  
Wait for the next animation frame (or fallback to `setTimeout(0)`).

### simulateClick(element: Element): void  
Dispatch a click event on the given DOM element.

### simulateKeypress(element: Element, key: string): void  
Dispatch `keydown` + `keyup` events for the specified key.

---

## Accessibility Testing

### expectAccessible(element: Element, options?: AccessibilityTestOptions): Promise<void>  
Run `axe` on the element (excluding specified rules) and assert no violations.

### getAccessibilityViolations(element: Element, options?: AccessibilityTestOptions): Promise<AxeResults>  
Return raw `axe` results for further inspection.

### expectAriaAttributes(element: Element, expected: Record<string,string>): void  
Assert that an element has the given ARIA attributes.

### expectFocusable(element: Element): void  
Assert that an element has a non-`-1` `tabindex`.

### accessibilityTests  
Convenience helpers:
- **colorContrast**(element: Element): Promise<void>  
- **formLabels**(element: Element): Promise<void>  
- **headingStructure**(element: Element): Promise<void>  

---

## Test Environment

### setupJsdomTestEnvironment(): void  
Install jsdom clean-up, patch `TextEncoder`, and mock browser APIs under Vitest.

---

## Linting Configuration

### createHTMLLintConfig(options?: HTMLLintOptions): { extends: string[]; rules: Record<string, any> }  
Generate an HTMLHint configuration object, with rule exclusions and overrides.

### createCSSLintConfig(options?: CSSLintOptions): { extends: string[]; plugins: string[]; rules: Record<string, any> }  
Produce a Stylelint config for CSS, supporting exclusions and overrides.

### createAccessibilityLintConfig(options?: AccessibilityLintOptions): { plugins: string[]; rules: Record<string, any> }  
Create a Stylelint-A11y configuration object, with rule exclusions and overrides.