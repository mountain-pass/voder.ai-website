# @voder/dev-config — Development Configuration Package

## **🎯 Package Context**

This package provides development tooling configurations for other projects in a single, cohesive package. This is a **configuration package** that exports TypeScript configs, lint & formatting rules, build setups, and testing utilities - it does not contain runtime application logic.

> CI / Pipeline Note: The CI/CD for this package is managed externally. Do not add pipeline configuration. 

> Disclaimer: Examples use placeholder identifiers (e.g., `PackageName`, `IService`). They illustrate patterns, not enforced naming.

## **Package Overview**

**Export Structure:**
```javascript
import { typescript, eslint, build, testing, etc... } from '@voder/dev-config';
```

**Consolidated Responsibilities:**
- ✅ **TypeScript configurations** - ESM-first presets for apps, libraries, and tools
- ✅ **ESLint configurations** - Code quality, ESM validation, accessibility rules
- ✅ **Formatting configuration** - Prettier integration for consistent, automated code style
- ✅ **Build configurations** - Rollup/Vite setups with performance optimization
- ✅ **Testing configurations** - Vitest setups with coverage and accessibility testing

### **Export Surface (Quick Reference)**
| Namespace | Export(s) | Kind | Purpose | Stability |
|-----------|-----------|------|---------|-----------|
| `typescript` | `base.json`, `vite.json`, `node.json`, `library.json`, `test.json` | JSON presets | Standardized TS compiler options | Stable |
| `eslint` | `base`, `dx`, `accessibility`, `performance` | Array segments | Layered lint rule groups (must include `dx`) | Base/dx/accessibility stable; performance under audit |
| `build` | `createPackageConfig`, `createAppConfig` | Functions | Rollup/Vite config factories | Stable |
| `testing` | `createVitestNodeConfig`, `createVitestJsdomConfig`, `test-utils`, `test-setup` | Functions / helpers | Explicit env configs + shared test utilities | Stable |
| `prettier` | `default` | Object | Central formatting rules | Stable |

> Import pattern: `import { typescript, eslint, build, testing } from '@voder/dev-config';`

## **1. TypeScript Configuration (`typescript`)**

### **Core Purpose**
Shared TypeScript presets with:
- ESM-first compatibility (enforce ".js" import specifiers in source)
- Fast DX for apps (Vite) and libraries
- Live cross-package development without building (source-to-source imports)

### **Preset Matrix**
- `base.json` (shared defaults)
- `vite.json` (apps, Vite + DOM)
- `node.json` (tools/CLIs)
- `library.json` (libs: declarations + project refs)
- `test.json` (Vitest)

## **2. ESLint Configuration (`eslint`)**

### **Core Purpose**
Comprehensive ESLint rules ensuring:
- ESM import validation with strict `.js` extension enforcement
- TypeScript-aware linting with proper type checking
- Code quality standards consistent across all packages
- Accessibility compliance for web components
- Performance optimization rules
- Additional autofix rules specifically focused on improving developer experience with consistent, modern patterns

**Rationale for DX Rules:**
- **Import hygiene**: Eliminates duplicate imports, enforces consistent ordering
- **TypeScript consistency**: `interface` over `type`, array-simple syntax, optional chaining
- **Modern patterns**: Object shorthand, arrow functions, logical assignments
- **Unicorn rules**: Encourages modern APIs (`includes` vs `indexOf`, string methods, etc.)
- **Testing standards**: Consistent testing-library patterns, better assertions
- **Readability**: Strategic blank lines around declarations and returns

**ESLint Policy:**
- We DO NOT use ESLint flat config or FlatCompat in this project.
- Use classic configuration files (`.eslintrc.cjs`/`.eslintrc.json`) with `extends`.
- Shareable configs are provided by this package and should be extended in order: `base`, `dx` (mandatory), `accessibility`, `performance`.

**Usage Pattern (classic extends):**
```js
// .eslintrc.cjs in a consuming package
module.exports = {
  root: true,
  extends: [
    '@voder/dev-config/eslint/base',
    '@voder/dev-config/eslint/dx',
    '@voder/dev-config/eslint/accessibility',
    '@voder/dev-config/eslint/performance'
  ],
};
```

## **3. Build Configuration (`build`)**

### **Core Purpose**
Optimized build configurations implementing:
- Rollup configurations for ES module library packages
- Vite configurations for applications with performance optimization
- CSS inlining implementation per ADR-0007 for critical performance
- Bundle splitting strategies for optimal loading performance
- Asset optimization for 3D models, images, and (optional) animation / 3D libraries

Violation Examples (❌):
```typescript
import { something } from '@voder/dev-config/src/internal/util'; // deep import of internals
```
Correct (✅):
```typescript
import { build } from '@voder/dev-config'; // public entry only, when used by consumers
```

## **4. Testing Configuration (`testing`)**

### **Core Purpose**
Comprehensive testing setup providing:
- Vitest configuration helpers with explicit environments (choose `node` or `jsdom`)
- Test utilities, mock factories, and custom assertions (some are DOM-focused for UI consumer packages)
- Coverage requirements (**90% branches, functions, lines, statements globally**)
- Accessibility testing integration hooks (exported for UI packages)

> Note: `@voder/dev-config` itself is non-UI and should use the Node configuration for its own tests.

### **Environment-specific configurations (no auto-detect)**
Consumers must choose the appropriate environment explicitly.

- Node environment (non-UI, tooling, server-side):
```ts
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

- jsdom environment (browser/UI testing):
```ts
import { createVitestJsdomConfig } from '@voder/dev-config/testing';
export default createVitestJsdomConfig();
```

### **Vitest Base Config (reference shape)**
```javascript
import { defineConfig } from 'vitest/config';

export function createVitestNodeConfig() {
  return defineConfig({
    test: {
      environment: 'node',
      globals: true,
      setupFiles: ['./src/test-setup.node.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 }
      }
    }
  });
}

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

### **Test Utilities (`test-utils.ts`)**
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

### **Test Setup (`test-setup.node.ts` and `test-setup.jsdom.ts`)**
```typescript
// src/test-setup.node.ts (Node environment)
import { afterEach } from 'vitest';

// Add any Node-specific global setup here
afterEach(() => {
  // Node cleanup if needed
});
```

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

## **Prettier Integration (`prettier.config.js`)**

**Purpose**: Enforce a **single central formatting standard** exported from `@voder/dev-config`. Individual packages MUST NOT create their own Prettier configs unless an ADR grants an exception.

**Design Principles:**
- Formatting is non-negotiable + fully automated (no subjective style debates)
- ESLint only enforces logic / safety / import hygiene (avoid overlapping style rules)
- Prettier runs in write & check modes (CI uses check)
- Consistent authoring experience across editors (EditorConfig + Prettier)

**Prettier Config (ESM example)**
```javascript
// prettier.config.js
export default {
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  overrides: [
    { files: '*.md', options: { printWidth: 80 } }
  ]
};
```

**Recommended Package Scripts (example)**
```jsonc
{
  "scripts": {
    "format": "prettier \"**/*.{ts,tsx,js,jsx,json,md,css}\" --write",
    "format:check": "prettier \"**/*.{ts,tsx,js,jsx,json,md,css}\" --check",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## **Execution Checklist (LLM Coding Agent — Limited Access Mode)**

**Editor Setup**
- Enable: Format on Save (VS Code) → uses workspace Prettier
- Ensure no conflicting formatters enabled simultaneously
- Add a root `.editorconfig` to enforce indentation + newline style at editor layer

## **Configuration Usage Patterns Examples**
```typescript
// In a package's vitest.config.ts — choose one explicitly
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```
```typescript
// or, for UI/browser packages
import { createVitestJsdomConfig } from '@voder/dev-config/testing';
export default createVitestJsdomConfig();
```

```typescript
// In a package's vite.config.ts
import { build } from '@voder/dev-config';

export default build.createPackageConfig({
  packageName: '@voder/my-package'
});
```

```javascript
// In a package's eslint config (classic extends)
// .eslintrc.cjs
module.exports = {
  root: true,
  extends: [
    '@voder/dev-config/eslint/base',
    '@voder/dev-config/eslint/dx',
    '@voder/dev-config/eslint/accessibility',
    '@voder/dev-config/eslint/performance'
  ]
};
```

```jsonc
// In a package's tsconfig.json
{
  "extends": "@voder/dev-config/typescript/library.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

### **Application Development Workflow**
```typescript
// In an app's vite.config.ts
import { build } from '@voder/dev-config';

export default build.createAppConfig({
  appName: 'voder-website'
});
```

```jsonc
// In an app's tsconfig.json
{
  "extends": "@voder/dev-config/typescript/vite.json"
}
```

## **Integration Patterns**

### **ESM Import Strategy**
All packages must use ESM-style imports with explicit `.js` extensions in source **(Pure ESM: `module` is `ESNext` in all tsconfig variants; CommonJS `module` settings removed)**:
```typescript
// ✅ Correct - explicit .js extension
import { Component } from './component.js';
import type { Config } from './types.js';

// ❌ Incorrect - missing extension
import { Component } from './component';
```

### **TypeScript + ESLint Coordination**
The package ensures TypeScript and ESLint work together:
- TypeScript `verbatimModuleSyntax: true` enforces import/export syntax
- ESLint `import/extensions` enforces `.js` extensions for TS sources
- Both tools validate ESM compatibility and runtime correctness

### **Build + Test Integration**
Build and test configurations share common patterns:
- Shared external dependencies kept minimal; vendor-specific UI libs referenced only in `ui-testing.md`
- Compatible module resolution strategies

## **Package Scope**

This unified package focuses specifically on:
- Development-time tooling configurations
- Code quality and consistency enforcement
- Build optimization and performance
- Testing infrastructure and utilities
- ESM compatibility and TypeScript integration

**❌ This package MUST NOT contain:**
- Runtime logic, UI components, or business logic
- Application-specific implementations
- Database connections or API integrations
- User interface code or styling

**✅ This package SHOULD export:**
- TypeScript configuration files (`.json`)
- ESLint configuration objects (including mandatory `dx` layer)
- Build configuration factory functions
- Testing setup utilities and configurations (coverage 90% all metrics)
- Prettier formatting rules (single central config)

## **Package Architecture**

### **Configuration-First Design**
The @voder/dev-config package follows a configuration-first approach, exporting configurations rather than implementations:

```typescript
// Export configurations, not implementations
export const baseConfig = { ... };
export const strictConfig = { ... };
export const packageConfig = { ... };

// Provide factory functions for customization
export function createCustomConfig(overrides: Partial<Config>): Config {
  return mergeConfigs(baseConfig, overrides);
}
```

### **Modular Configuration Exports**
Multiple configuration variants are provided for different use cases:

```typescript
// Unified import with named destructuring (best DX)
import { typescript, eslint, build, testing } from '@voder/dev-config';

// Access specific configurations
const libraryConfig = typescript.library;
const baseRules = eslint.base;
const packageBuild = build.createPackageConfig({ packageName: '@voder/my-package' });
const nodeTestConfig = testing.createVitestNodeConfig();
```

## **Implementation Standards**

### **Configuration Validation**
All configurations MUST be validated for correctness and compatibility:

### **Testing Requirements**
Development configurations MUST include comprehensive tests:

