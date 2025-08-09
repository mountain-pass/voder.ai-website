# @voder/dev-config — Unified Development Configuration Package

This package provides all development tooling configurations for the VODER project in a single, cohesive package.

## **Package Overview**

**Export Structure:**
```javascript
import { typescript, eslint, build, testing } from '@voder/dev-config';
```

**Consolidated Responsibilities:**
- ✅ **TypeScript configurations** - ESM-first presets for apps, libraries, and tools
- ✅ **ESLint configurations** - Code quality, ESM validation, accessibility rules
- ✅ **Formatting configuration** - Prettier integration for consistent, automated code style
- ✅ **Build configurations** - Rollup/Vite setups with performance optimization
- ✅ **Testing configurations** - Vitest setups with coverage and accessibility testing

## **1. TypeScript Configuration (`typescript`)**

### **Core Purpose**
Shared TypeScript presets for the monorepo with:
- ESM-first compatibility (enforce ".js" import specifiers in source)
- Fast DX for apps (Vite) and libraries
- Live cross-package development without building (source-to-source imports)

### **Preset Matrix**
- `base.json` (shared defaults)
- `vite.json` (apps, Vite + DOM)
- `node.json` (tools/CLIs)
- `library.json` (libs: declarations + project refs)
- `test.json` (Vitest)

### **base.json (shared defaults)**
```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "paths": {
      "@voder/*": ["../*/src"]
    }
  }
}
```

### **vite.json (applications)**
```jsonc
{
  "extends": "./base.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src/**/*", "*.d.ts"]
}
```

### **node.json (tools/CLIs)**
```jsonc
{
  "extends": "./base.json",
  "compilerOptions": {
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "module": "CommonJS",
    "types": ["node"]
  },
  "include": ["src/**/*", "*.d.ts"]
}
```

### **library.json (packages)**
```jsonc
{
  "extends": "./base.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "declaration": true,
    "composite": true,
    "incremental": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["**/*.test.ts", "**/*.spec.ts"]
}
```

### **test.json (Vitest)**
```jsonc
{
  "extends": "./base.json",
  "compilerOptions": {
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src/**/*", "test/**/*", "**/*.test.ts", "**/*.spec.ts"]
}
```

## **2. ESLint Configuration (`eslint`)**

### **Core Purpose**
Comprehensive ESLint rules ensuring:
- ESM import validation with strict `.js` extension enforcement
- TypeScript-aware linting with proper type checking
- Code quality standards consistent across all packages
- Accessibility compliance for web components
- Performance optimization rules

### **Base Configuration (`base.js`)**
```javascript
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-config-prettier'; // Disables conflicting stylistic rules

export default [
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'unicorn': unicorn,
      'import': importPlugin
    },
    rules: {
      // ESM Import Rules - Enforce .js extensions for TS sources
      'import/extensions': ['error', 'always', { 'ts': 'always', 'tsx': 'always' }],
      'import/no-unresolved': 'error',
      'import/no-default-export': 'error',
      'import/no-commonjs': 'error',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }],
      'import/no-useless-path-segments': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      'import/first': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-relative-packages': 'error',
      
      // TypeScript Rules  
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { 
        'prefer': 'type-imports', 
        'fixStyle': 'inline-type-imports' 
      }],
      '@typescript-eslint/consistent-type-exports': ['error', { 
        'fixMixedExportsWithInlineTypeSpecifier': true 
      }],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': ['warn', { ignoreConditionalTests: true }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      
      // Unicorn Rules - Modern JS/TS patterns
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-modern-dom-apis': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/no-useless-undefined': 'error',
      'unicorn/no-negated-condition': 'warn',
      'unicorn/explicit-length-check': 'warn',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-array-find': 'warn',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-logical-operator-over-ternary': 'warn',
      'unicorn/prefer-optional-catch-binding': 'error',
      
      // Core JS/ES Rules (autofix-friendly)
      'object-shorthand': ['error', 'always'],
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      'logical-assignment-operators': ['error', 'always', { enforceForIfStatements: true }],
      'no-useless-return': 'error',
      'no-return-await': 'error',
      'no-else-return': ['warn', { allowElseIf: false }],
      
      // Code Quality (non-formatting)
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  // Prettier MUST be last to turn off conflicting formatting rules
  prettier
];
```

### **Accessibility Configuration (`accessibility.js`)**
```javascript
import a11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    plugins: {
      'jsx-a11y': a11y
    },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error'
    }
  }
];
```

### **Performance Configuration (`performance.js`)**
```javascript
export default [
  {
    rules: {
      // DOM Performance
      'no-document-write': 'error',
      'prefer-const': 'error',
      
      // Animation Performance 
      'no-unused-expressions': 'error',
      'no-loop-func': 'error'
    }
  }
];
```

### **DX Enhancement Configuration (`dx.js`)**
Additional autofix rules specifically focused on improving developer experience with consistent, modern patterns:

```javascript
export default [
  {
    files: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
    plugins: {
      'testing-library': testingLibrary,
      'jest-dom': jestDom
    },
    rules: {
      // Testing Best Practices (autofix where possible)
      'testing-library/prefer-screen-queries': 'warn',
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/prefer-presence-queries': 'warn',
      'jest-dom/prefer-enabled-disabled': 'warn',
      'jest-dom/prefer-checked': 'warn',
      'jest-dom/prefer-required': 'warn'
    }
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // Padding/spacing for readability (Prettier handles formatting, these handle semantic spacing)
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' }
      ]
    }
  }
];
```

**Rationale for DX Rules:**
- **Import hygiene**: Eliminates duplicate imports, enforces consistent ordering
- **TypeScript consistency**: `interface` over `type`, array-simple syntax, optional chaining
- **Modern patterns**: Object shorthand, arrow functions, logical assignments
- **Unicorn rules**: Encourages modern APIs (`includes` vs `indexOf`, string methods, etc.)
- **Testing standards**: Consistent testing-library patterns, better assertions
- **Readability**: Strategic blank lines around declarations and returns

**Usage Pattern Update:**
```javascript
// In a package's eslint.config.js
import { eslint } from '@voder/dev-config';

export default [
  ...eslint.base,
  ...eslint.dx,        // NEW: DX enhancement rules
  ...eslint.accessibility,
  ...eslint.performance
];
```

**Performance Impact:**
All added rules are designed to be:
- ✅ **Autofix-friendly** - Most can be automatically corrected
- ✅ **Low false-positive rate** - Carefully chosen to avoid noise
- ✅ **Incremental adoption** - Many are `warn` initially, can be promoted to `error`

## **3. Build Configuration (`build`)**

### **Core Purpose**
Optimized build configurations implementing:
- Rollup configurations for ES module library packages
- Vite configurations for applications with performance optimization
- CSS inlining implementation per ADR-0007 for critical performance
- Bundle splitting strategies for optimal loading performance
- Asset optimization for 3D models, images, and GSAP/Three.js bundles

### **Package Rollup Config (`rollup.config.js`)**
```javascript
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export function createPackageConfig(options = {}) {
  return {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'es',
        sourcemap: true
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true
      }
    ],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: 'tsconfig.json',
        declaration: true,
        declarationDir: 'dist',
        sourceMap: true
      })
    ],
    external: [
      '@voder/shared',
      '@voder/dev-config',
      'gsap',
      'three'
    ]
  };
}
```

### **Application Vite Config (`vite.config.js`)**
```javascript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export function createAppConfig(options = {}) {
  return defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'gsap': ['gsap'],
            'three': ['three'],
            'vendor': ['lodash', 'axios']
          }
        }
      },
      cssCodeSplit: false, // Inline critical CSS per ADR-0007
      sourcemap: true,
      target: 'es2022'
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@voder': resolve(__dirname, '../packages')
      }
    },
    optimizeDeps: {
      include: ['gsap', 'three']
    }
  });
}
```

## **4. Testing Configuration (`testing`)**

### **Core Purpose**
Comprehensive testing setup providing:
- Vitest configuration with jsdom environment
- Test utilities, mock factories, and custom assertions
- Coverage requirements (90% function, 80% branch)
- Accessibility testing integration with @testing-library and axe-core
- Component testing patterns for UI packages

### **Vitest Base Config (`vitest.config.js`)**
```javascript
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export function createTestConfig(options = {}) {
  return defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test-setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        thresholds: {
          functions: 90,
          branches: 80,
          lines: 85,
          statements: 85
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@voder': resolve(__dirname, '../packages')
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
 * Custom render function for component testing
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
 * Accessibility testing helper
 */
export async function expectAccessible(element: Element): Promise<void> {
  const results = await axe(element);
  expect(results).toHaveNoViolations();
}

/**
 * Animation testing helper
 */
export function waitForAnimation(duration = 1000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, duration));
}

/**
 * Mock factory for GSAP animations
 */
export const mockGSAP = {
  to: vi.fn().mockReturnValue({ kill: vi.fn() }),
  from: vi.fn().mockReturnValue({ kill: vi.fn() }),
  timeline: vi.fn().mockReturnValue({
    to: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    kill: vi.fn()
  })
};
```

### **Test Setup (`test-setup.ts`)**
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/dom';
import { afterEach, beforeEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock GSAP for tests
beforeEach(() => {
  vi.mock('gsap', () => mockGSAP);
});

// Mock Three.js for tests
beforeEach(() => {
  vi.mock('three', () => ({
    WebGLRenderer: vi.fn(),
    Scene: vi.fn(),
    PerspectiveCamera: vi.fn(),
    Mesh: vi.fn(),
    BoxGeometry: vi.fn(),
    MeshBasicMaterial: vi.fn()
  }));
});
```

## **Prettier Integration (`prettier.config.js`)**

**Purpose**: Enforce a single, automated formatting standard across all packages while letting ESLint focus on semantic/code-quality rules.

**Design Principles:**
- Formatting is non-negotiable + fully automated (no subjective style debates)
- ESLint only enforces logic / safety / import hygiene (avoid overlapping style rules)
- Prettier runs in write & check modes (CI uses check)
- Consistent authoring experience across editors (EditorConfig + Prettier)

**Prettier Config (ESM)**
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

If using CommonJS (e.g. tooling scripts):
```javascript
// prettier.config.cjs
module.exports = { /* same options */ };
```

**Recommended Package Scripts**
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

**Editor Setup**
- Enable: Format on Save (VS Code) → uses workspace Prettier
- Ensure no conflicting formatters enabled simultaneously
- Optional: Add a root `.editorconfig` to enforce indentation + newline style at editor layer

**CI Recommendation**
- Run `npm run format:check` before `eslint` to fail fast on formatting drift

**Monorepo Strategy**
- Single root Prettier config → no per-package overrides unless unavoidable
- Avoid adding ESLint style rules already handled by Prettier (keep lean rule set)

**Rationale**
- Reduces review friction
- Deterministic diffs → cleaner PR history
- Keeps ESLint performance higher (fewer style passes)

## **Configuration Usage Patterns**

### **Package Development Workflow**
```typescript
// In a package's vite.config.ts
import { build } from '@voder/dev-config';

export default build.createPackageConfig({
  packageName: '@voder/my-package'
});
```

```typescript
// In a package's vitest.config.ts  
import { testing } from '@voder/dev-config';

export default testing.createTestConfig();
```

```javascript
// In a package's eslint.config.js
import { eslint } from '@voder/dev-config';

export default [
  ...eslint.base,
  ...eslint.accessibility,
  ...eslint.performance
];
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
All packages must use ESM-style imports with explicit `.js` extensions:
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
- Consistent alias resolution (`@voder/*` paths)
- Shared external dependencies (gsap, three)
- Compatible module resolution strategies

## **Package Scope**

This unified package focuses specifically on:
- Development-time tooling configurations
- Code quality and consistency enforcement
- Build optimization and performance
- Testing infrastructure and utilities
- ESM compatibility and TypeScript integration
- No runtime logic, UI components, or business logic

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
const testSetup = testing.createTestConfig();
```

### **Package Structure**
```
packages/dev-config/
├── package.json              # Unified development dependencies
├── src/
│   ├── index.ts             # Main exports (typescript, eslint, build, testing)
│   ├── typescript/          # TypeScript configuration variants
│   │   ├── base.json       # Shared defaults
│   │   ├── vite.json       # Apps with Vite + DOM
│   │   ├── node.json       # Tools/CLIs
│   │   ├── library.json    # Libraries with declarations
│   │   └── test.json       # Vitest environment
│   ├── eslint/             # ESLint configuration variants
│   │   ├── base.js         # Core rules + TypeScript + imports
│   │   ├── accessibility.js # a11y rules
│   │   ├── performance.js  # Performance rules
│   │   └── dx.js          # DX enhancement rules
│   ├── build/              # Build configuration factories
│   │   ├── rollup.config.js # Package builds
│   │   └── vite.config.js  # Application builds
│   ├── testing/            # Testing configuration and utilities
│   │   ├── vitest.config.js # Base Vitest setup
│   │   ├── test-utils.ts   # Testing utilities
│   │   └── test-setup.ts   # Test environment setup
│   └── prettier/           # Prettier configuration
│       └── prettier.config.js # Formatting rules
├── README.md                # Usage documentation
└── prompts/                 # Symlinked documentation
    ├── universal-guide.md   # Universal architecture
    ├── development.md       # Development layer guidance
    └── development-dev-config.md # This specification
```

## **Implementation Standards**

### **Configuration Validation**
All configurations MUST be validated for correctness and compatibility:

```typescript
// Configuration validation pattern
export function validateConfig(config: Config): ValidationResult {
  const errors: string[] = [];
  
  // Validate required properties
  if (!config.compilerOptions) {
    errors.push('compilerOptions is required');
  }
  
  // Check for conflicting settings
  if (config.compilerOptions?.module === 'CommonJS' && config.compilerOptions?.verbatimModuleSyntax) {
    errors.push('CommonJS module conflicts with verbatimModuleSyntax');
  }
  
  // Ensure ESM compatibility
  if (!config.compilerOptions?.moduleDetection) {
    errors.push('moduleDetection should be set for ESM compatibility');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### **Testing Requirements**
Development configurations MUST include comprehensive tests:

```typescript
// Configuration testing pattern
describe('@voder/dev-config', () => {
  describe('TypeScript configurations', () => {
    test('base config compiles successfully', async () => {
      const result = await compileWithConfig(typescript.base);
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
    
    test('library config generates declarations', async () => {
      const result = await compileWithConfig(typescript.library);
      expect(result.declarationFiles).toBeDefined();
    });
  });
  
  describe('ESLint configurations', () => {
    test('base rules pass validation', async () => {
      const config = eslint.base;
      const result = await ESLint.validateConfig(config);
      expect(result.valid).toBe(true);
    });
    
    test('no conflicting rules with prettier', () => {
      const conflicts = findPrettierConflicts(eslint.base);
      expect(conflicts).toHaveLength(0);
    });
  });
});
```

### **Documentation Requirements**
Each configuration variant MUST include:

- **Purpose**: What this configuration is designed for
- **Use Case**: When and where to use this configuration  
- **Dependencies**: Required peer dependencies and versions
- **Integration**: How to extend, customize, or combine with other configs
- **Examples**: Complete working examples for common scenarios

## **Development Workflow**

### **Build & Development Commands**
Standard development workflow using Vite and npm scripts:

1. **Development server**: `npm run dev` - Start Vite development server
2. **Production build**: `npm run build` - Build for production
3. **Preview build**: `npm run preview` - Preview production build
   - ⚠️ **Critical**: YOU MUST RUN `npm run build` before `vite preview`
4. **Testing**: `npm run test` - Run Vitest test suite
5. **Linting**: `npm run lint` - Run ESLint validation
6. **Formatting**: `npm run format` - Apply Prettier formatting

### **Static Assets**
- Vite serves static files from the `public/` folder
- 3D models, images, and other assets should be placed in `public/assets/`
- Use Vite's asset handling for optimized imports in source code

### **Development Tools & CLI**
Essential development practices:

- **Issue Tracking**: DO NOT USE ONLINE ISSUE TRACKERS. Use local markdown files for issue tracking
- **Pipeline Status**: Use `gh` CLI to check GitHub Actions pipeline status
- **Code Quality**: Run `npm run lint:fix` and `npm run format` before commits
- **Testing**: Maintain >90% function coverage, >80% branch coverage

## **Maintenance & Operations**

### **Version Management Strategy**
Coordinated updates across the monorepo:

- **Pin Major Versions**: Avoid breaking changes across packages
- **Coordinated Updates**: Update tool versions (TypeScript, ESLint, Vite) across all packages simultaneously
- **Compatibility Testing**: Test configuration changes against all packages before release
- **Semantic Versioning**: Follow semver for configuration changes (breaking config changes = major bump)

### **Dependency Management**
Strategic dependency handling:

- **Peer Dependencies**: Use peer dependencies for tools that consuming packages install directly (TypeScript, ESLint, Vite)
- **Direct Dependencies**: Include configuration-specific plugins and utilities as direct dependencies
- **Version Ranges**: Use conservative version ranges for stability (`^5.0.0` not `>=5.0.0`)
- **Security Updates**: Regular updates for security patches, validate against test suite

### **Critical Quality Requirements**

#### **Consistency Enforcement**
Development configurations MUST enforce zero-tolerance quality standards:

- **No Linting Errors**: Zero ESLint errors across the entire monorepo
- **Formatting Compliance**: 100% Prettier formatting compliance (enforced by CI)
- **Type Safety**: No TypeScript errors in strict mode across all packages
- **Build Success**: All packages must build without errors or warnings

#### **Performance Considerations**
All configurations optimized for developer experience:

- **Fast Builds**: Rollup configurations optimized for build speed and bundle size
- **Efficient Linting**: ESLint rules balanced for thoroughness without development slowdown
- **Quick Tests**: Vitest configurations for rapid test execution and feedback
- **Cache-Friendly**: Configurations support build caching and incremental compilation

#### **ADR Compliance**
Implementation of architectural decision records:

- **ADR-0004**: ESLint + Prettier integration for automated code quality
- **ADR-0007**: CSS optimization and performance patterns in build configs
- **ADR-0008**: Monorepo package architecture support in TypeScript configs
- **ADR-0009**: Comprehensive testing strategy with Vitest configurations

---

## **🎊 Development Excellence Principles**

The @voder/dev-config package enables monorepo-wide development success through:

- **🔍 Reliability**: Configurations work consistently across all environments and team setups
- **🎯 Efficiency**: Fast builds, quick lints, rapid tests - optimized developer feedback loops
- **📖 Documentation**: Clear, comprehensive usage instructions for all team members
- **🧪 Testing**: Thoroughly validated configurations across multiple usage scenarios
- **♿ Accessibility**: Built-in a11y linting and testing support for inclusive development

**Guiding Principle**: When in doubt, prioritize consistency and developer experience over flexibility.
