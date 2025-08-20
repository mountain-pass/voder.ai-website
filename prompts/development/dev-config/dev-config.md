# @voder/dev-con### **Mand- Compat- Governance: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.
- Self-contained links: only reference published content; do not link to internal repository paths.
- Documentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see "Markdown Linting (Required)" below).

## **Package Overview**mentation hygiene: Prettier-format all Markdown and enforce Markdown linting (see "Markdown Linting (Required)" below).

## **Package Overview**ity and peers: supported Node runtime, ESM-only note (if applicable), and required peer dependency ranges including markdownlint-cli2.
- Quickstart orientation: where to place minimal configuration (tsconfig extends, `eslint.config.js`, `vitest.config.ts`, `vite.config.ts`/Rollup) using this package's exports.
- Governance: that deviations (e.g., different lint layers, coverage exceptions, alternative tools) REQUIRE an ADR per the Dependency Governance policy.
- Self-contained links: only reference published content; do not link to internal repository paths.
- **Documentation hygiene: MANDATORY use of this package's markdown linting configuration and CLI commands. Alternative markdown linters are PROHIBITED.** Consumer README Requirements**
Every package that adopts `@voder/dev-config` MUST document, in its public README:
- Test expectations and usage: Node environment testing with Vitest, coverage thresholds (90% all metrics), and testing utilities for server-side/tooling packages. **Vitest and coverage are mandatory for all packages.**
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
- Test expectations and usage: Node environment testing with Vitest, coverage thresholds (90% all metrics), and testing utilities for server-side/tooling packages.
- Code quality expectations and usage: ESLint 9 flat config via `eslint.config.js` or `eslint.config.ts`. Compose layers (base, dx, performance) using the flat exports provided by this package. Prettier is the single formatter.
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

// Main index (convenient for multiple imports)
import { testing, prettier, eslint, typescript } from '@voder/dev-config';
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

### **Required Functionality (Implementation Flexible)**
| Capability | Required Features | Implementation Notes |
|-----------|-------------------|---------------------|
| **TypeScript** | Base, Node, Library, Test presets with ESM+strict settings | Export path and format flexible |
| **ESLint** | Base, DX (mandatory), Performance layers for flat config v9 | Layer composition required, export path flexible |
| **Testing** | Vitest Node config factory with 90% coverage thresholds | Function export required, path flexible |
| **Prettier** | Centralized formatting config with TypeScript support | Direct config access required |
| **Linters** | Concrete markdown linting tool with working configuration | **REQUIRES IMPLEMENTATION** - select tool, configure rules, expose commands |

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
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

## **2. ESLint Configuration**

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

**ESLint Policy Requirements:**
- Must use ESLint 9 flat config (`eslint.config.js` or `eslint.config.ts`)
- Must compose layers in order: `base` → `dx` (mandatory) → `performance`  
- Must use `eslint-config-prettier` to disable stylistic conflicts
- Must NOT run Prettier via ESLint

**Consumer Usage Pattern:**
```js
// eslint.config.js - import path depends on package implementation
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx,        // mandatory
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] }
];
```

> Note: This configuration package is built with TypeScript and must be compiled to JavaScript for distribution. The package exports point to compiled JavaScript files with TypeScript declarations for full type safety. The TypeScript source files in `src/`, `eslint/`, `typescript/`, and `linters/` directories are compiled to the `dist/` directory during the build process. Consumers can use either `.js` or `.ts` for their own config files as ESLint 9 supports both. For TypeScript config files, install jiti as a dev dependency to enable TypeScript config loading.

> ESLint 9 walks up to the nearest `eslint.config.js` or `eslint.config.ts`. Commit a package-local config file to prevent inheriting parent configs inadvertently.

## **3. Testing Configuration**

### **Core Purpose**
Comprehensive testing setup providing:
- Vitest configuration helpers for Node.js environment testing
- Coverage requirements (**90% branches, functions, lines, statements globally**)
- Test setup files for server-side and tooling packages

### **Required Functionality**
- **Node Environment Configuration** for server-side, tooling, and configuration packages
- **Coverage Thresholds** enforced at 90% across all metrics
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
        thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 }
      }
    }
  });
}
```

## **4. Prettier Configuration**

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
  parser: 'typescript'
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
```javascript
**Consumer Usage Pattern:**
```javascript
// Consumers MUST import and use the provided configuration
import { getConfig, createCLICommand } from '@voder/dev-config/linters/markdown';

// Get the complete working configuration
const config = getConfig();

// Get ready-to-use CLI commands for package.json scripts
const lintCommand = createCLICommand();
const fixCommand = createCLICommand({ fix: true });
```

**Required Configuration Features:**
- **File scope**: `README.md` and `docs/**/*.md` (or consumer's package docs folder)
- **Rules baseline**:
  - Enforce headings order, fenced code blocks with language, no bare HTML where avoidable
  - Allow long lines (Prettier handles wrapping) — disable line-length rule
  - Forbid relative links in public READMEs (only published URLs and npm package links)
- **Mandatory usage**: Consumers MUST use this configuration and MUST NOT use alternative markdown linters
- **Complete implementation**: Package provides working config and CLI commands, not just abstractions
```

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
```

**Mandatory Consumer Requirements:**
- **Install peer dependency**: `npm install --save-dev markdownlint-cli2`
- **Use provided configuration**: Import `getConfig()` to write `.markdownlint.json`
- **Use provided CLI commands**: Import `createCLICommand()` for npm scripts
- **No alternative tools**: Consumers MUST NOT use remark-lint, textlint, or other markdown linters

## **Execution Checklist (LLM Coding Agent — Limited Access Mode)**

**Editor Setup**
- Enable: Format on Save (VS Code) → uses workspace Prettier
- Ensure no conflicting formatters enabled simultaneously
- Add a root `.editorconfig` to enforce indentation + newline style at editor layer

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
  prettier
];
```

## **LLM Agent Guidance**

- **Implementation Flexibility**: This package may be implemented with varying internal structures while maintaining the required functionality above
- **Export Requirements**: Consumers must be able to access configurations via the export paths shown in usage patterns  
- **Documentation Focus**: Prioritize clear consumer usage over internal implementation details
- **Validation Approach**: Test against consumer requirements rather than specific implementation patterns

