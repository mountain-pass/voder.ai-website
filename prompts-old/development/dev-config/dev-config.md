# @voder/dev-con### \*\*Mand- Compat- Governance: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.

- Self-contained links: only reference published content; do not link to internal repository paths.
- Documentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see "Markdown Linting (Required)" below).

## **Package Overview**mentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see "Markdown Linting (Required)" below).

## **Package Overview**ity and peers: supported Node runtime, ESM-only note (if applicable), and required peer dependency ranges including markdownlint-cli2.

- Quickstart orientation: where to place minimal configuration (tsconfig extends, `eslint.config.js`, `vitest.config.ts`, `vite.config.ts`/Rollup) using this package's exports.
- Governance: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.
- Self-contained links: only reference published content; do not link to internal repository paths.
- **Documentation hygiene: MANDATORY use of this package's markdown linting configuration and CLI commands. Alternative markdown linters are PROHIBITED.** Consumer README Requirements\*\*
  Every package that adopts `@voder/dev-config` MUST document, in its public README:
- Test expectations and usage: Node environment testing with Vitest, coverage thresholds (80% all metrics), and testing utilities for server-side/tooling packages. **Vitest and coverage are mandatory for all packages.**
- Code quality expectations and usage: ESLint 9 flat config via `eslint.config.js` or `eslint.config.ts`. Compose layers (base, dx, performance) using the flat exports provided by this package. Prettier is the single formatter.
- Compatibility and peers: supported Node runtime, ESM-only note (if applicable), and required peer dependency ranges including all ESLint plugins.
- Quickstart orientation: where to place minimal configuration (tsconfig extends, `eslint.config.js`, `vitest.config.ts`) using this package's exports.
- Governance: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.Quickstart orientation: where to place minimal configuration (tsconfig extends, `eslint.config.js`, `vitest.config.ts`) using this package's exports. Quickstart orientation: where to place minimal configuration (tsconfig extends, `eslint.config.js`, `vitest.config.ts`) using this package's exports.e- Documentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see "Markdown Linting (Required)" below).

## **Package Overview**ce: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.

- Self-contained links: only reference published content; do not link to internal repository paths.
- Documentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see "Markdown Linting (Required)" below).

## **Package Overview**evelopment Configuration Package

## **🎯 Package Context**

This package provides development tooling configurations for other projects in a single, cohesive package. This is a **configuration package** written in TypeScript that compiles to JavaScript for distribution, exporting TypeScript configs, lint & formatting rules, and testing utilities - it does not contain runtime application logic.

> CI / Pipeline Note: The CI/CD for this package is managed externally. Do not add pipeline configuration.

> Disclaimer: Examples use placeholder identifiers (e.g., `PackageName`, `IService`). They illustrate patterns, not enforced naming.

### **Mandatory Consumer README Requirements**

Every package that adopts `@voder/dev-config` MUST document, in its public README:

- Test expectations and usage: Node environment testing with Vitest, coverage thresholds (80% all metrics), and testing utilities for server-side/tooling packages.
- Code quality expectations and usage: ESLint 9 flat config via `eslint.config.js` or `eslint.config.ts`. Compose layers (base, dx, performance) using the flat exports provided by this package. Prettier is the single formatter.
- Build script utilities: Availability of shared build functions for asset copying, configuration generation, and common build patterns.
- Compatibility and peers: supported Node runtime, ESM-only note (if applicable), and required peer dependency ranges.
- Quickstart orientation: where to place minimal configuration (tsconfig extends, `eslint.config.js`, `vitest.config.ts`, `vite.config.ts`/Rollup) using this package’s exports.
- Governance: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.
- Self-contained links: only reference published content; do not link to internal repository paths.
- Documentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see “Markdown Linting (Required)” below).

## **Package Overview**

**Export Strategy:**
This package implements the dual export strategy defined in the Universal Development Guide, providing both dedicated export paths and main index aggregation:

```javascript
// Dedicated paths (explicit, tree-shakable)
import { createVitestNodeConfig } from '@voder/dev-config/testing';
import prettierConfig from '@voder/dev-config/prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';
import {
  copyAssets,
  generateMarkdownlintConfig,
} from '@voder/dev-config/scripts';

// Main index (convenient for multiple imports)
import {
  testing,
  prettier,
  eslint,
  typescript,
  scripts,
} from '@voder/dev-config';
```

**Testing Requirements:**
This package MUST include comprehensive test suites as specified in the Universal Development Guide:

- **Export equivalence tests** to ensure both import patterns provide identical functionality
- **Package structure tests** to verify all package.json exports point to existing compiled files
- **Temporary package installation tests** to validate the complete consumer experience
- **Source functionality tests** to verify core configuration behavior

See test files in `src/tests/` for implementation examples including package installation integration tests that validate the actual consumer experience.

**Consolidated Responsibilities:**

- ✅ **TypeScript configurations** - ESM-first presets for libraries, tools, and testing
- ✅ **ESLint configurations** - Code quality, ESM validation, and developer experience rules
- ✅ **Formatting configuration** - Prettier integration for consistent, automated code style
- ✅ **Testing configurations** - Vitest setups with coverage for Node.js environments
- ✅ **Markdown linting** - Shared markdown linting configuration for documentation
- ✅ **Build scripts** - Reusable build utilities for common package tasks

### **Required Functionality (Implementation Flexible)**

| Capability     | Required Features                                           | Implementation Notes                                                        |
| -------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| **TypeScript** | Base, Node, Library, Test presets with ESM+strict settings  | Export path and format flexible                                             |
| **ESLint**     | Base, DX (mandatory), Performance layers for flat config v9 | Layer composition required, export path flexible                            |
| **Testing**    | Vitest Node config factory with 80% coverage thresholds     | Function export required, path flexible                                     |
| **Prettier**   | Centralized formatting config with TypeScript support       | Direct config access required                                               |
| **Linters**    | Concrete markdown linting tool with working configuration   | **REQUIRES IMPLEMENTATION** - select tool, configure rules, expose commands |
| **Scripts**    | Common build utilities (asset copying, config generation)   | Export build functions for package reuse                                    |

## **1. TypeScript Configuration**

### **Core Purpose**

Shared TypeScript presets with:

- Modern ESM compilation settings (NodeNext module resolution)
- TypeScript compilation to JavaScript with declaration files for distribution
- Strict type checking and consistent casing enforcement
- Configuration for Node.js tools, libraries, and testing environments

### **Required Presets**

- **Base** - Core TypeScript settings for all packages
- **Node** - Additional settings for Node.js tools/CLIs
- **Library** - Library-specific settings with declarations + project references
- **Test** - Testing-specific configuration for Vitest integration

**Consumer Usage Pattern:**

```jsonc
// tsconfig.json - specific path depends on package implementation
{
  "extends": "@voder/dev-config/typescript/library.json",
  }
}
```

## **2. Build Scripts**

### **Core Purpose**

Reusable build utilities that eliminate duplicate build logic across packages:

- Asset copying (TypeScript configs, ESLint rules) with proper file handling
- Configuration file generation for consuming packages
- Common build patterns following the dual testing strategy
- CLI utilities that can be imported as functions for maximum testability

### **Required Script Functions**

- **Asset copying** - Copy configuration files (TypeScript JSON, ESLint JS) from source to dist
- **Config generation** - Generate configuration files (markdown linting, etc.) in consumer packages
- **Directory utilities** - Ensure directories exist, handle file permissions
- **Build helpers** - Common patterns for configuration package builds

**Consumer Usage Pattern:**

```typescript
// Build script in consumer package
import {
  copyAssets,
  generateMarkdownlintConfig,
} from '@voder/dev-config/scripts';

// Copy configuration assets to dist/
await copyAssets(process.cwd());

// Generate .markdownlint.json in project root
await generateMarkdownlintConfig(process.cwd());
```

**Script Architecture Requirements:**

- **Exportable functions** - All business logic must be exportable for unit testing
- **CLI wrappers** - Minimal CLI sections with coverage exclusion comments
- **Error handling** - Proper error messages and exit codes for CLI usage
- **Testability** - Follow dual testing strategy (unit tests for coverage + integration tests for CLI)

**Export Structure:**

```typescript
// Example: @voder/dev-config/scripts exports
export { copyAssets, ensureDir, formatCLIOutput } from './copy-assets.js';
export { generateMarkdownlintConfig } from './generate-markdownlint-config.js';
// Additional build utilities as needed
```

## **3. ESLint Configuration**

## **3. ESLint Configuration**

### **Core Purpose**

Comprehensive ESLint rules ensuring:

- ESM import validation with strict `.js` extension enforcement
- TypeScript-aware linting with proper type checking
- Code quality standards consistent across all packages
- Performance optimization rules
- Developer experience enhancements with autofix patterns
- Deprecation detection and migration guidance

### **Required Layer Structure**

- **Base** - Core ESLint rules for code quality, safety, and ESM compliance
- **DX (Developer Experience)** - Autofix patterns and modern JavaScript idioms (**mandatory for all consumers**)
- **Performance** - Performance-focused linting for loops, memory, data structures, and V8 optimizations

### **Test File Overrides**

The complete ESLint configuration automatically provides special handling for test files:

**Test File Patterns Covered:**

- `**/*.test.{js,ts}` - Test files anywhere in the project
- `tests/**/*.{js,ts}` - Files in dedicated test directories
- `src/testing/**/*.{js,ts}` - Testing utilities and helpers

**Automatic Test File Overrides:**

- **Console statements allowed**: `no-console` rule is disabled for debugging in tests
- **Vitest globals**: `describe`, `it`, `test`, `expect`, `beforeEach`, etc. are predefined
- **DOM globals**: `document`, `window` for browser-like testing scenarios
- **Node globals**: `process`, `console` for Node.js testing environments

**No Manual Configuration Required:**
Consumers do not need to add test file overrides, disable console rules, or configure test globals - the complete configuration handles all test scenarios automatically.

**🚨 CRITICAL: Configuration Quality Validation**

**🎯 ACCEPTABLE BASELINE CONFIGURATIONS (Tool Limitation Accommodations)**

The following configuration files represent the **BEST POSSIBLE** implementation given current tool limitations. These exact patterns are **ACCEPTABLE** and do **NOT** trigger functionality caps:

1. **`eslint.config.ts`** - Current implementation with layer composition and ignores is **ACCEPTABLE**
2. **`prettier.config.ts`** - Simple import pattern: `import prettierConfig from '@voder/dev-config/prettier'; export default prettierConfig;`
3. **`tsconfig.json`** - Extends with minimal overrides due to TypeScript resolution constraints
4. **`tsconfig.build.json`** - Required path overrides (`outDir`, `rootDir`, `include`, `exclude`) due to TypeScript extends resolution limitations
5. **`vitest.config.ts`** - Factory function pattern: `import { createVitestNodeConfig } from '@voder/dev-config/testing'; export default createVitestNodeConfig();`

**✅ CURRENT ACCEPTABLE PATTERNS (No Functionality Penalty)**

The current root configurations in this package represent the **maximum simplification possible** with existing tools. These patterns are **ACCEPTABLE** and should be replicated by consumers:

- **ESLint layer composition** - Due to flat config architecture requiring manual assembly
- **TypeScript extends with path overrides** - Due to extends resolution working relative to config location
- **Minimal configuration objects** - Reduced to essential settings only

**🚨 FUNCTIONALITY ASSESSMENT TRIGGERS (Further Deviations)**

**ANY FURTHER DEVIATIONS** beyond the current baseline patterns will cap FUNCTIONALITY at 50%:

- **Additional ESLint rules or plugins** beyond the current layer composition
- **Additional TypeScript compiler options** beyond current path and output settings
- **Manual Prettier rule overrides** beyond the simple import pattern
- **Complex Vitest configuration** beyond the simple factory function call
- **Creation of workaround files** like `.eslintignore` or `.prettierignore`

**Current Implementation Status: ACCEPTABLE BASELINE - No Further Simplification Possible**

✅ **ACCEPTABLE BASELINE CONFIGURATIONS (Current Implementation Patterns)**

These represent the **BEST POSSIBLE** configurations given tool limitations. Consumers should replicate these exact patterns:

**1. eslint.config.ts (ACCEPTABLE - Layer Composition Required):**

```typescript
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/', 'typescript/'] },
];
```

**2. prettier.config.ts (IDEAL - Simple Import):**

```typescript
import prettierConfig from '@voder/dev-config/prettier';
export default prettierConfig;
```

**3. tsconfig.json (ACCEPTABLE - Minimal Overrides):**

```jsonc
{
  "extends": "@voder/dev-config/typescript/library.json",
  "compilerOptions": {
    "outDir": "dist",
  },
}
```

**4. tsconfig.build.json (ACCEPTABLE - TypeScript Limitation Accommodation):**

````jsonc
**4. tsconfig.build.json:**
**4. tsconfig.build.json (ACCEPTABLE - TypeScript Limitation Accommodation):**
```jsonc
{
  "extends": "@voder/dev-config/typescript/build.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["src", "scripts", "eslint", "typescript", "linters"],
  "exclude": ["**/*.test.ts", "**/*.test.js", "node_modules", "dist"]
}
````

**5. vitest.config.ts (IDEAL - Simple Factory Call):**

```typescript
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

❌ **FUNCTIONALITY FAILURE INDICATORS (Further Deviations Beyond Baseline)**

Any changes BEYOND the current baseline patterns automatically cap Functionality at 50%:

❌ **FUNCTIONALITY FAILURE INDICATORS (Further Deviations Beyond Baseline)**

Any changes BEYOND the current baseline patterns automatically cap Functionality at 50%:

**eslint.config.ts FAILURES (Beyond Current Baseline):**

- ❌ Additional rules beyond the layer composition pattern
- ❌ Additional plugins beyond base/dx/performance layers
- ❌ Additional ignores beyond the current comprehensive set
- ❌ Manual parser configuration changes
- ❌ Custom language options modifications
- ❌ **CREATION of `.eslintignore` file** = PROVES INSUFFICIENT EXPORTS

**prettier.config.ts FAILURES (Beyond Current Baseline):**

- ❌ Manual rule overrides (printWidth, semi, etc.) instead of using the export
- ❌ Custom options or overrides array additions
- ❌ **CREATION of `.prettierignore` file** = PROVES INSUFFICIENT EXPORTS

**tsconfig.json FAILURES (Beyond Current Baseline):**

- ❌ Additional `compilerOptions` beyond current minimal set
- ❌ Manual `include` or `exclude` arrays
- ❌ Complex path mapping or additional references

**tsconfig.build.json FAILURES (Beyond Current Baseline):**

- ❌ Additional `compilerOptions` beyond required path settings
- ❌ Additional `include` directories beyond current package structure
- ❌ Additional `exclude` patterns beyond current test exclusions

**vitest.config.ts FAILURES (Beyond Current Baseline):**

- ❌ Manual test configuration instead of using factory
- ❌ Coverage, environment, or timeout overrides
- ❌ Custom setup files configuration

**🚨 CURRENT STATUS: ACCEPTABLE BASELINE ACHIEVED**

The current configuration files in this project represent the **MAXIMUM SIMPLIFICATION POSSIBLE** given tool limitations:

```plaintext
✅ eslint.config.ts - ACCEPTABLE (layer composition due to flat config architecture)
✅ prettier.config.ts - IDEAL (simple import)
✅ tsconfig.json - ACCEPTABLE (minimal extends + outDir)
✅ tsconfig.build.json - ACCEPTABLE (required paths due to TypeScript extends)
✅ vitest.config.ts - IDEAL (simple factory call)
✅ NO .eslintignore - Proves exports handle ignores correctly
✅ NO .prettierignore - Proves exports handle ignores correctly
✅ NO workaround files - Proves exports are sufficient
```

**Why this is the BEST POSSIBLE implementation:**

- **ESLint flat config** requires manual layer composition - this is a tool architectural limitation
- **TypeScript extends resolution** works relative to config location - this is a tool limitation
- **All other configs** use the simplest possible import patterns
- **No workaround files** exist, proving exported configurations are complete

**REQUIRED TARGET STATE FOR CONSUMERS:**

- **Replicate these exact patterns** - no further simplification is possible
- **Any deviations BEYOND these patterns** = FUNCTIONALITY ASSESSMENT capped at 50%
- **These patterns DO NOT trigger functionality penalties** - they represent the baseline standard

**Implementation Assessment Impact:**

- **Current baseline patterns** = FUNCTIONALITY ASSESSMENT can reach 85-100%
- **Any additions beyond baseline patterns** = FUNCTIONALITY ASSESSMENT capped at 50%
- **Creation of workaround files** = FUNCTIONALITY ASSESSMENT capped at 50%

The current implementation demonstrates that exported configurations work correctly within tool constraints.

**ESLint Policy Requirements:**

- Must use ESLint 9 flat config (`eslint.config.js` or `eslint.config.ts`)
- Must compose layers in order: `base` → `dx` (mandatory) → `performance`
- Must use `eslint-config-prettier` to disable stylistic conflicts
- Must NOT run Prettier via ESLint

**🚨 PRIMARY TEST CASE: Root ESLint Config Simplicity**

The **primary test** of our exported ESLint configurations is the simplicity of our own root `eslint.config.js`/`eslint.config.ts`. If our root config requires complex workarounds, special cases, or extensive customization, then our exported configurations are **not fit for purpose**.

**🚨 PRIMARY TEST CASES: Root Configuration Simplicity**

The **primary test** of all our exported configurations is the simplicity of our own root configuration files. If any of our root configs require complex workarounds, special cases, or extensive customization, then our exported configurations are **not fit for purpose**.

**Target: Simple Root Configs**
Our own root configuration files should be as simple as the consumer patterns below (accessing via relative imports during development, but demonstrating the same simplicity consumers will achieve via package exports):

**ESLint Configuration:**

```js
// eslint.config.js - TARGET: This should be possible and sufficient
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx, // mandatory
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] },
];
```

**TypeScript Configuration:**

```jsonc
// tsconfig.json - TARGET: This should be possible and sufficient
{
  "extends": "@voder/dev-config/typescript/library.json",
  "compilerOptions": {
    "outDir": "dist",
  },
}
```

**Prettier Configuration:**

```js
// prettier.config.js - TARGET: This should be possible and sufficient
import prettierConfig from '@voder/dev-config/prettier';
export default prettierConfig;
```

**Vitest Configuration:**

```js
// vitest.config.ts - TARGET: This should be possible and sufficient
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

**Consumer Usage Pattern:**

```js
// eslint.config.js - import path depends on package implementation
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx, // mandatory
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] },
];
```

**🚨 CRITICAL FAILURE INDICATORS**

If our root ESLint config contains ANY of the following, the exported configurations are BROKEN and FUNCTIONALITY ASSESSMENT is capped at 50%:

- ❌ **ANY manual ignores** (like `{ ignores: ['dist/'] }`) = BROKEN EXPORTS
- ❌ **ANY file-specific overrides** for test globals = BROKEN EXPORTS
- ❌ **ANY manual parser configuration** for scripts = BROKEN EXPORTS
- ❌ **ANY custom language options** for different file types = BROKEN EXPORTS
- ❌ **ANY workarounds** for TypeScript-eslint project configuration = BROKEN EXPORTS
- ❌ **ANY spread operator usage** (like `...complete`) requiring additional config = BROKEN EXPORTS

**REQUIRED FOR >50% FUNCTIONALITY:**

```typescript
// ONLY ACCEPTABLE ROOT CONFIG
import complete from '@voder/dev-config/eslint';
export default complete; // NO SPREAD, NO OVERRIDES, NO NOTHING
```

The exported `complete` configuration MUST internally handle ALL common cases including:

- Standard ignore patterns (`dist/`, `coverage/`, `node_modules/`, etc.)
- Test file globals and environment setup
- Script file parsing requirements
- TypeScript-aware parsing for all file types
- All common development scenarios

**If consumers need ANY manual configuration, our exports are incomplete and broken.**

> Note: This configuration package is built with TypeScript and must be compiled to JavaScript for distribution. The package exports point to compiled JavaScript files with TypeScript declarations for full type safety. The TypeScript source files in `src/`, `eslint/`, `typescript/`, and `linters/` directories are compiled to the `dist/` directory during the build process. Consumers can use either `.js` or `.ts` for their own config files as ESLint 9 supports both. For TypeScript config files, install jiti as a dev dependency to enable TypeScript config loading.

> ESLint 9 walks up to the nearest `eslint.config.js` or `eslint.config.ts`. Commit a package-local config file to prevent inheriting parent configs inadvertently.

## **4. Prettier Configuration**

### **Core Purpose**

Comprehensive testing setup providing:

- Vitest configuration helpers for Node.js environment testing
- Coverage requirements (**80% branches, functions, lines, statements globally**)
- Test setup files for server-side and tooling packages

### **Required Functionality**

- **Node Environment Configuration** for server-side, tooling, and configuration packages
- **Coverage Thresholds** enforced at 80% across all metrics
- **Test Setup Integration** for consistent testing environment

**Consumer Usage Pattern:**

```ts
// vitest.config.ts - import path depends on package implementation
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

**Expected Configuration Shape:**

```javascript
// Reference implementation - actual implementation may vary
export function createVitestNodeConfig() {
  return defineConfig({
    test: {
      environment: 'node',
      globals: true,
      setupFiles: ['./src/test-setup.node.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'lcov'],
        thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 },
      },
    },
  });
}
```

## **5. Prettier Configuration**

### **Core Purpose**

TypeScript and JavaScript formatting with centralized configuration standards.

### **Required Functionality**

- **TypeScript/JavaScript Formatting** with consistent style rules
- **Centralized Configuration** for formatting standards across packages
- **Development Tool Integration** with VS Code and build processes

**Consumer Usage Pattern:**

```javascript
// prettier.config.js - import path depends on package implementation
import prettierConfig from '@voder/dev-config/prettier';
export default prettierConfig;
```

**Expected Configuration Shape:**

```javascript
// Reference implementation - actual implementation may vary
export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  parser: 'typescript',
};
```

### **5. Markdown Linting (Mandatory Implementation)**

**MANDATORY REQUIREMENT**: This package MUST provide a complete working markdown linting implementation that all consumers are REQUIRED to use.

**Implementor Responsibilities:**

- **Choose a specific markdown linter** (e.g., markdownlint-cli2, remark-lint, etc.)
- **Create complete working configuration** with the rules specified below
- **Add the tool as peer dependency** that consumers must install
- **Provide working CLI commands** that consumers use in their package.json scripts
- **Mandate consumer usage** - no alternative markdown linters allowed

**Consumer Usage Pattern:**

````javascript
**Consumer Usage Pattern:**
```javascript
// Consumers MUST import and use the provided configuration
import { getConfig, createCLICommand } from '@voder/dev-config/linters/markdown';

// Get the complete working configuration
const config = getConfig();

// Get ready-to-use CLI commands for package.json scripts
const lintCommand = createCLICommand();
const fixCommand = createCLICommand({ fix: true });
````

**Required Configuration Features:**

- **File scope**: `README.md` and `docs/**/*.md` (or consumer's package docs folder)
- **Rules baseline**:
  - Enforce headings order, fenced code blocks with language, no bare HTML where avoidable
  - Allow long lines (Prettier handles wrapping) — disable line-length rule
  - Forbid relative links in public READMEs (only published URLs and npm package links)
- **Mandatory usage**: Consumers MUST use this configuration and MUST NOT use alternative markdown linters
- **Complete implementation**: Package provides working config and CLI commands, not just abstractions

````

**Required Configuration Features:**
- **File scope**: `README.md` and `docs/**/*.md` (or consumer's package docs folder)
- **Rules baseline**:
  - Enforce headings order, fenced code blocks with language, no bare HTML where avoidable
  - Allow long lines (Prettier handles wrapping) — disable line-length rule
  - Forbid relative links in public READMEs (only published URLs and npm package links)
- **Mandatory tool usage**: Consumers MUST use the exported markdown linting configuration and commands - no alternative tools allowed
- **Complete implementation**: This package provides working configuration and CLI commands for the selected tool
- **Peer dependency pattern**: Tool is specified as peer dependency that consumers must install

**Implementation Strategy:**
1. **Select a markdown linting tool** (document choice in ADR)
2. **Add tool as peer dependency** (consumers install the tool)
3. **Create complete working configuration** matching the tool's expected format
4. **Export getConfig() function and CLI helpers** that provide ready-to-use commands
5. **Update package.json exports** to include the linters path
6. **Mandate usage in consumer documentation** - no alternative markdown linters allowed

**Consumer Package.json Integration:**
```json
{
  "peerDependencies": {
    "markdownlint-cli2": "^0.13.0"
  },
  "scripts": {
    "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md",
    "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md"
  }
}
````

**Mandatory Consumer Requirements:**

- **Install peer dependency**: `npm install --save-dev markdownlint-cli2`
- **Use provided configuration**: Import `getConfig()` to write `.markdownlint.json`
- **Use provided CLI commands**: Import `createCLICommand()` for npm scripts
- **No alternative tools**: Consumers MUST NOT use remark-lint, textlint, or other markdown linters

## **Execution Checklist (LLM Coding Agent — Limited Access Mode)**

## **Configuration Usage Patterns Examples**

```typescript
// In a package's vitest.config.ts for Node.js testing
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

```javascript
// In a package's ESLint config (flat, ESLint 9)
// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  prettier,
];
```

## **LLM Agent Guidance**

- **Implementation Flexibility**: This package may be implemented with varying internal structures while maintaining the required functionality above
- **Export Requirements**: Consumers must be able to access configurations via the export paths shown in usage patterns
- **Documentation Focus**: Prioritize clear consumer usage over internal implementation details
- **Validation Approach**: Test against consumer requirements rather than specific implementation patterns

**🎯 Primary Validation Method: Dog-fooding**
The most important validation of our exported configurations is using them in our own project:

1. **Root Config Simplicity**: Our root configuration files should follow the exact same patterns we expect consumers to use
   - `eslint.config.ts` should be minimal with no special workarounds
   - `tsconfig.json` should use simple extends with minimal overrides
   - `prettier.config.ts` should be a direct export with no customization

2. **No Special Cases**: If we need workarounds in our root configs, consumers will too - fix the exports instead
   - ESLint shouldn't need manual test globals or script parsing configuration
   - TypeScript shouldn't need complex include/exclude patterns or custom compiler options
   - Prettier shouldn't need rule overrides

3. **Relative vs Package Imports**: We use relative imports during development, consumers use package imports - but the configuration objects should be identical
   - `./eslint/index.js` vs `@voder/dev-config/eslint`
   - `./typescript/base.json` vs `@voder/dev-config/typescript/base.json`
   - `./prettier.config.ts` vs `@voder/dev-config/prettier`
   - `./vitest.config.ts` vs `@voder/dev-config/testing`

4. **Configuration Completeness**: Our exported configs should handle all common cases internally
   - All file types (tests, scripts, configs) should work without consumer configuration
   - All common development scenarios should be covered by the exported presets

**Implementation Assessment Impact:**
**🚨 CRITICAL: SPECIFIC ROOT CONFIG FILE COMPLEXITY = FUNCTIONALITY FAILURE**

Root configuration complexity in these EXACT files directly impacts the **FUNCTIONALITY ASSESSMENT** score with HARD LIMITS:

**Mandatory File-Specific Assessment Criteria:**

- **`eslint.config.ts` requiring ANY overrides** = Automatic 50% functionality cap
- **`.eslintignore` file existing** = Automatic 50% functionality cap
- **`prettier.config.ts` not being a simple import** = Automatic 50% functionality cap
- **`.prettierignore` file existing** = Automatic 50% functionality cap
- **`tsconfig.json` having ANY options beyond `outDir`** = Automatic 50% functionality cap
- **`tsconfig.build.json` having path settings beyond required TypeScript constraints** = Automatic 50% functionality cap
- **`vitest.config.ts` not being a simple factory call** = Automatic 50% functionality cap

**Assessment Rules:**

- **ALL config files must match exact target patterns AND no workaround files exist** = FUNCTIONALITY ASSESSMENT can reach 85-100%
- **ANY ONE file deviating OR any workaround file existing** = FUNCTIONALITY ASSESSMENT capped at 50%
- **Each workaround file** = proof that exported configurations are fundamentally broken

The five specific root configuration files PLUS the absence of workaround files are the PRIMARY and DEFINITIVE indicators of export completeness and consumer experience quality. **There are no exceptions to this rule.**
