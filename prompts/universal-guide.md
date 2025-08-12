# 🏗️ Universal Development Guide

## 🤖 **LLM-Optimized Patterns**
> Disclaimer: Example identifiers (e.g., `PackageName`, `IService`) are illustrative patterns, not enforced naming conventions.

### **Architectural Philosophy**

This system is designed for **LLM agents as developers**. Every architectural decision prioritizes clarity, predictable patterns that AI can understand and implement reliably.

### **Core Principles:**

1. **🧩 Explicit Contracts**: All interactions happen through clearly defined interfaces
2. **🔒 Strict Boundaries**: Each package owns its domain completely
3. **📝 Documentation-Driven**: Implementation follows documentation, not the reverse
4. **🤖 LLM-Optimized**: Patterns are designed for AI comprehension and implementation
5. **🔧 Interface-Only Dependencies**: Communicate through contracts, not implementations

---

## 🏛️ **Package Scope Boundaries**
- Scope is a single standalone package
- The CI/CD for this package is managed externally. Do not add pipeline configuration. 
- Exclude deployment/CI/infrastructure concerns. This is all managed externally, not in github actions.

---

## 🔗 **Interface-Only Dependency Patterns**

### **Dependency Injection Pattern**
```typescript
// ✅ CORRECT: Interface-only dependency
import type { IService } from '@voder/shared';

// Each package receives dependencies, never imports them directly
export class PackageExample {
  constructor(
    private serviceA: IServiceA,
    private serviceB: IServiceB
  ) {}
}
```

### **❌ Wrong: Direct Implementation Dependencies**
```typescript
// ❌ WRONG: Direct implementation dependency
import { ConcreteService } from '@voder/services/src/ConcreteService';
```

### **Interface Contract Principles**
- **Input data structure**: Clearly defined
- **Output data structure**: Predictable format
- **Method signatures**: Consistent across implementations
- **Event definitions**: Standardized communication
- **Dependency requirements**: Interface-based only

---

## 📖 **Documentation Standards**

### **File Naming Conventions**
- **Packages**: `PackageName.ts` (PascalCase)
- **Utilities**: `utilityNameUtility.ts` (camelCase + Utility)
- **Interfaces**: `IPackageName.ts` (I + PascalCase)
- **Tests**: `packageName.test.ts` or `packageName.spec.ts`
- **Documentation**: `package-name.md` (kebab-case)

### **Code Documentation Requirements**
```typescript
/**
 * Brief description of the class/function purpose
 * 
 * @example
 * ```typescript
 * const example = new PackageName({ config, dependencies });
 * await example.initialize();
 * ```
 */
export class PackageName {
  /**
   * Description of what this method does
   * @param data - Description of parameter
   * @returns Promise that resolves when operation completes
   */
  public async initialize(data: ConfigType): Promise<void> {
    // Implementation
  }
}
```

### **Package Structure Requirements**
```
package.json             # Dependencies & scripts
src/
├── index.ts             # Public API exports only
├── types.ts             # Internal types
├── PackageName.ts       # Main implementation
└── PackageName.test.ts  # Comprehensive tests
```
---

## 🧪 **Universal Testing Standards**

### **Testing Strategy Overview**
Every package MUST include comprehensive tests that validate:
- **Interface Compliance**: Exported public API matches expected contracts
- **Configuration Validation**: Package accepts only valid configuration
- **Error Handling**: Graceful handling of invalid inputs and edge cases
- **Build Tests**: Package compilation and output validation (Vitest)

### **Package Scope Testing (Universal)**
Packages MUST test what they implement and export, but MUST NOT test:
- **Deployment processes**: Build pipelines, deployment scripts, infrastructure setup
- **Environment-specific behavior**: Production vs staging differences, environment variables
- **External system integrations**: APIs, databases, third-party services

> **🚨 CRITICAL**: Packages test their own implementation and how they integrate with their
dependencies only. They DO NOT test the dependencies.

### **Universal Test Requirements**

Every package MUST validate its public interface:

### **Testing Tool Configuration**

**Package Test Scripts**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=verbose"
  }
}
```

### **Test Organization Standards**
- **Unit tests**: Test individual functions/classes in isolation
- **Integration tests**: Test component interactions  
- **Configuration tests**: Validate all configuration scenarios
- **Error scenario tests**: Test all error conditions and edge cases
- **Performance tests**: Validate package doesn't exceed performance budgets
- **Tool compatibility**: Works reliably with TypeScript and build tools

### **Coverage Requirements**
- **Minimum 90% code coverage** across branches, functions, lines, statements (single universal threshold; exceptions require ADR)
- **100% coverage of public API** - every exported function/class must be tested
- **100% coverage of error scenarios** - every throw/reject must be tested
- **Edge case coverage** - boundary conditions, null/undefined inputs, type mismatches

---

## 📋 **Code Quality Standards**

### **🚨 MANDATORY CODE FORMATTING REQUIREMENTS**

All packages MUST maintain consistent code formatting and pass linting checks:

**Code Formatting Standards:**
- **Prettier Integration**: All packages MUST use Prettier for consistent code formatting
- **No Formatting Errors**: NEVER commit code with formatting inconsistencies
- **Auto-Format on Save**: Configure editors to auto-format code on save
- **Pre-commit Formatting**: Code MUST be formatted before committing

**Linting Standards:**
- **ESLint Configuration**: All packages MUST extend shared ESLint configuration
- **No Linting Errors**: NEVER commit code with ESLint errors
- **Linting Warnings**: Address linting warnings promptly, don't let them accumulate
- **Custom Rules**: Package-specific ESLint overrides must be documented and justified

**Priority Order for Code Quality Issues:**
1. **Security vulnerabilities** - Address immediately
2. **Test failures** - Block all other work until resolved
3. **Linting errors** - Must be fixed before committing
4. **Formatting inconsistencies** - Must be resolved before committing
5. **Linting warnings** - Address during regular development

**Package Scripts for Code Quality:**
```json
{
  "scripts": {
    "lint": "eslint src/ --ext .ts,.js",
    "lint:fix": "eslint src/ --ext .ts,.js --fix",
    "format": "prettier --write src/",
    "format:check": "prettier --check src/",
    "type-check": "tsc --noEmit"
  }
}
```

**Why consistent formatting and linting matter:**
- **Code Review Efficiency**: Consistent style reduces cognitive load during reviews
- **Merge Conflicts**: Consistent formatting minimizes formatting-related conflicts
- **Developer Experience**: Predictable code style improves readability
- **Quality Assurance**: Linting catches potential bugs and maintains standards
- **LLM Comprehension**: Consistent patterns help AI agents understand and maintain code

**Formatting Strategy:**
- Single central Prettier configuration exported by the development configuration package
- ESLint focuses on semantic & correctness rules; stylistic conflicts disabled via `eslint-config-prettier`

**ESLint Layer Policy:**
- Mandatory inclusion order: `base`, `dx`, `accessibility`, `performance`

**ESLint consumer config example (.eslintrc.cjs):**
```js
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

### **Implementation Hints & Standards**

**ESLint Configuration:**
- Do NOT use ESLint flat config or FlatCompat
- Use classic configuration files: .eslintrc.cjs/.eslintrc.json with extends
- Extend recommended configs from ESLint and typescript-eslint

**Development Priorities:**
- WORKING CODE THAT MEETS THE SPECIFICATION IS FAR MORE IMPORTANT THAN LINTING

### **Documentation Requirements**

**🚨 CRITICAL REQUIREMENT - README ISOLATION**

README.md files are PUBLIC-FACING and MUST be self-contained; only reference published content (no internal repo paths).

- **❌ NEVER reference internal files**: No links to `prompts/`, `docs/`, `decisions/`, or any internal documentation
- **❌ NEVER reference development structure**: Users cannot see workspace-internal files
- **❌ NEVER use relative paths**: No `./prompts/guidelines.md` or `../docs/api.md` references
- **✅ ONLY reference published content**: Package exports, npm packages, external URLs

**WHY**: README.md appears on npm, GitHub, and package registries where internal project files don't exist. Any internal references will be broken links for users.

**Required README.md Sections:**
- **Purpose**: Clear, one-sentence description of what the package does
- **Compatibility & Requirements**: Supported Node versions, ESM-only note (if applicable), required peer dependency ranges (e.g., eslint, typescript)
- **Installation**: Copy-paste commands for npm, pnpm, yarn (no workspace assumptions)
- **Quickstart**: Minimal snippets for tsconfig extends, .eslintrc.cjs, vitest.config.ts (node/jsdom variants), and rollup/vite setup
- **Usage**: Comprehensive examples showing ALL primary use cases
- **Configuration Matrix**: Brief table mapping exports to use-cases (e.g., createVitestNodeConfig vs createVitestJsdomConfig)
- **API Reference**: Complete documentation of all public exports/configurations
- **Migration Notes**: Common upgrade guidance (e.g., ESLint classic config, TS module settings) with before/after examples
- **Troubleshooting**: Top issues and fixes (ESM import extensions, parser project:true, missing peer deps, etc.)
- **Versioning & Breaking Changes**: SemVer policy and how deprecations are announced
- **Changelog**: Link to published releases or CHANGELOG location
- **License & Security**: License type and security posture (e.g., no runtime/network code)
- **Contributing**: Short guidelines for tests and change process (no internal repo links)
- **Development**: Instructions for contributors (testing, building, etc.)

### 🚂 **Trunk-Based Development and Lean Delivery**
- Single main line (trunk). Avoid branches.
- Commit and push often: small, atomic commits with clear messages; link ADR IDs when relevant. This reduces internal inventory, lowers merge risk, and cuts cost of delay via faster feedback.
- Keep trunk green: run tests locally; integrate continuously; fix forward or revert quickly when red.
- Deliver incrementally: slice work into small, valuable vertical slices; use feature flags/dark launches to ship safely.
- Limit WIP: finish and integrate before starting new work; avoid large batch sizes and queued changes.
- Definition of Done: change is on trunk, tests/coverage pass, docs/README updated, and required ADRs added/linked.

### **Dependency Governance (MADR-based ADRs)**
- All dependencies (runtime, dev, peer, optional) MUST be justified by a decision record in `docs/decisions/` before being added to `package.json`.
- Use the MADR template at `prompt-assets/adr-template.md`.
- Naming (MADR filename): `####-<skimmable-title>.md`
  - Title composition: `Verb (imperative)` + `Object/Technology` + `Qualifier (for/in/to)` + `Specific scope`
  - Be specific about scope (package type, layer, workflow, environment) and intent (why/where used)
  - Allowed characters: lowercase letters, numbers, hyphens; no underscores or spaces
  - Avoid vague titles (e.g., "use-vite", "event-storage"). Prefer specific context.
  - Examples:
    - `0001-use-vite-for-local-website-dev-and-hmr.md`
    - `0002-do-not-use-eslint-flat-config-for-typescript-packages.md`
    - `0003-use-rollup-for-library-builds-in-packages.md`
    - `0004-select-vitest-for-unit-and-integration-testing-in-packages.md`
    - `0005-enforce-js-extensions-in-esm-imports-for-typescript-source.md`
- Title style: make decision titles skimmable and contextual. Prefer concise, action-oriented titles that include scope, e.g., "Use MongoDB for event storage in analytics pipeline" over generic titles like "Use MongoDB" or "Event Storage".
- Lifecycle: `Proposed` → `Accepted` → (`Deprecated` | `Superseded`). Superseding changes must reference prior ADRs.
- Required ADR content (per MADR): Context and problem, decision drivers, considered options, decision outcome, consequences (positive/negative), pros/cons per option, links/references.
- In Trunk-Based Development (TBD), any change that adds/upgrades/removes dependencies MUST include a link to the relevant ADR (e.g., in the commit message or change description).
- Significant technical decisions (architecture, build/test strategy, module formats, error handling strategy, etc.) MUST also be captured as ADRs, not only dependency changes.
- Pivots (when a tried approach fails and we move to another) are a MUST for ADRs and MUST include:
  - What was tried and how it was implemented
  - Evidence of failure or constraints encountered (errors, metrics, DX issues)
  - Why the new approach is chosen now and alternatives considered
  - Explicit "what didn't work" and "known dead-ends" to prevent repeating the same path
  - A reference to the superseded/related ADRs (use `Superseded by`/`Supersedes` linkage)

---

## 📦 **Package Development Guidelines**

### **Public API Design**
```typescript
// index.ts - Clean public API
export type { IPackage, IPackageConfig } from './types';
export { PackageName } from './PackageName';

// Never export:
// - Internal utilities
// - Private methods
// - Implementation details
```

### **Error Handling Pattern**
```typescript
export class PackageError extends Error {
  constructor(
    message: string,
    public readonly packageName: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(`[${packageName}] ${message}`);
    this.name = 'PackageError';
  }
}

// Usage
throw new PackageError('Failed to initialize', '@voder/package-name', config);
```

**Config Package Exception:** Configuration-only packages MAY omit a custom `PackageError` subclass and throw regular `Error` objects.

### **TypeScript Configuration Standards**
- **Strict Mode**: Enable strict type checking
- **Target**: ES2022 for modern JavaScript features
- **Module**: ESNext for optimal tree shaking
- **Lib**: Include necessary libraries (ES2022, DOM for UI packages that depend on this configuration)
- **Declaration**: Generate .d.ts files for TypeScript consumers
- **Source Maps**: Enable for debugging

### **Build Configuration Standards**
- **Output**: ESM only
- **Tree Shaking**: Enable for optimal bundle sizes
- **External Dependencies**: Mark as external to avoid bundling

---

## 🔍 **Success Criteria** 

A package is correctly implemented when:

1. ✅ **Interface Compliance**: Implements all required interfaces completely
2. ✅ **Dependency Injection**: Never imports implementations, only interfaces
3. ✅ **Testing**: 100% coverage of public API and error scenarios
4. ✅ **Documentation**: Every public method and interface fully documented
5. ✅ **Security**: No data collection, input sanitization where applicable
6. ✅ **Error Handling**: Proper error types with context information
7. ✅ **Code Quality**: Passes linting and formatting checks
8. ✅ **API Design**: Clean, predictable public interface with no internal leaks

---

## 🚨 **Anti-Patterns to Avoid**

### **❌ NEVER DO THIS:**

```typescript
// Direct implementation imports
import { ConcreteService } from '@voder/services/src/ConcreteService';

// Shared mutable state
export const globalState = { value: 0 };

// Unsafe content handling
element.innerHTML = userContent; // XSS risk

// Untested error scenarios
if (config.invalid) {
  // Silent failure - should throw PackageError
}

// Leaking internal details
export { InternalHelper } from './internal/helper';
```

### **✅ CORRECT PATTERNS:**

```typescript
// Interface-only dependencies
import type { IService } from '@voder/shared';

// Immutable state with events
this.eventBus?.emit('state:changed', { newState: immutableData });

// Safe content handling
element.textContent = sanitizedContent;

// Explicit error handling
if (config.invalid) {
  throw new PackageError('Invalid configuration', '@voder/package-name', config);
}

// Clean public API
export type { IPackage, IPackageConfig } from './types';
export { PackageName } from './PackageName';
```

---

## 🎊 **Remember: LLM-First Development**

This architecture is optimized for AI developers. Every pattern is:
- **🔍 Explicit**: No implicit behavior or hidden dependencies
- **🎯 Predictable**: Same patterns across all packages
- **📖 Documented**: Every decision explained in context
- **🧪 Testable**: Clear success/failure criteria
- **♿ Accessible**: Built-in compliance, not retrofitted

**When in doubt, choose the more explicit, documented, and testable approach.**

---
