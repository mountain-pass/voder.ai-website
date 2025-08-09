# 🏗️ Universal Development Guide

## 🎯 **Purpose**

This guide contains **truly universal** knowledge that applies to ALL 22 packages in the Voder monorepo, including simple configuration packages like `@voder/tsconfig`. Every LLM agent implementing packages will receive this documentation to ensure consistent understanding and implementation across the entire system.

---

## 🤖 **LLM-Optimized Patterns**

### **Architectural Philosophy**

This system is designed for **LLM agents as developers**. Every architectural decision prioritizes clarity, predictable patterns that AI can understand and implement reliably.

### **Core Principles:**

1. **🧩 Explicit Contracts**: All interactions between packages happen through clearly defined interfaces
2. **🔒 Strict Boundaries**: Each package owns its domain completely - no cross-package implementation details
3. **📝 Documentation-Driven**: Implementation follows documentation, not the reverse
4. **🤖 LLM-Optimized**: Patterns are designed for AI comprehension and implementation
5. **🔧 Interface-Only Dependencies**: Packages communicate through contracts, not implementations

---

## 🏛️ **Package Scope Boundaries**

### **✅ PACKAGES SHOULD: Focus on implementation and functionality**
```typescript
class MyPackage {
  // ✅ Implement core functionality
  // ✅ Handle user interactions (if applicable)
  // ✅ Manage internal state
  // ✅ Provide public API
  // ✅ Follow interface contracts
}
```

### **❌ PACKAGES MUST NOT: Handle deployment, CI/CD, or infrastructure concerns**
```typescript
// ❌ NO: Deployment scripts in packages
// ❌ NO: CI/CD configuration in packages  
// ❌ NO: Environment-specific deployment logic
// ❌ NO: Production monitoring setup
// ❌ NO: Infrastructure provisioning
// ❌ NO: Build pipeline configuration
// ❌ NO: Database connection management
// ❌ NO: Server configuration
```

> **🚨 CRITICAL**: Individual packages focus ONLY on implementation. Deployment, CI/CD, monitoring, and infrastructure concerns are handled at the application and root level.

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
packages/package-name/
├── package.json              # Dependencies & scripts
├── src/
│   ├── index.ts             # Public API exports only
│   ├── types.ts             # Internal types
│   ├── PackageName.ts       # Main implementation
│   └── PackageName.test.ts  # Comprehensive tests
├── rollup.config.ts         # Build configuration (for packages using Rollup)
└── prompts/                 # Symlinked documentation
    ├── universal-guide.md   # This file (universal)
    ├── testing.md          # Testing standards
    └── package-name.md     # Package-specific guide
```

**Note**: Applications use Vite (per ADR-0001), packages use Rollup for library builds.

---

## 🧪 **Universal Testing Standards**

### **Testing Strategy Overview**
Every package MUST include comprehensive tests that validate:
- **Interface Compliance**: Exported public API matches expected contracts
- **Configuration Validation**: Package accepts only valid configuration
- **Error Handling**: Graceful handling of invalid inputs and edge cases
- **Build Tests**: Package compilation and output validation (Vitest)

> **🔗 For runtime packages**: See `runtime-testing.md` for UI-specific testing requirements (accessibility, visual validation, performance, cross-browser testing).

### **Package Scope Testing (Universal)**
Packages MUST test what they implement and export, but MUST NOT test:
- **Application functionality**: How the package is used by applications
- **Integration scenarios**: Multi-package workflows and user journeys
- **Deployment processes**: Build pipelines, deployment scripts, infrastructure setup
- **Environment-specific behavior**: Production vs staging differences, environment variables
- **External system integrations**: APIs, databases, third-party services

> **🚨 CRITICAL**: Packages test their own implementation only. Integration testing happens at the application level.

### **Universal Test Requirements**

Every package MUST validate its public interface:

```typescript
describe('Package Interface Compliance', () => {
  test('exports all required interface methods', () => {
    const packageExports = Object.keys(require('./index'));
    const requiredExports = ['PackageName', 'IPackageConfig'];
    
    expect(packageExports).toEqual(expect.arrayContaining(requiredExports));
  });
  
  test('implements expected interface completely', () => {
    const packageInstance = new PackageName(mockConfig);
    
    // Required properties
    expect(packageInstance).toHaveProperty('id');
    expect(packageInstance).toHaveProperty('isReady');
    
    // Required methods (adapt to your package's interface)
    expect(typeof packageInstance.initialize).toBe('function');
    expect(typeof packageInstance.destroy).toBe('function');
    // Add other methods specific to your package
  });
  
  test('methods return expected types', async () => {
    const packageInstance = new PackageName(mockConfig);
    
    expect(packageInstance.initialize()).toBeInstanceOf(Promise);
    // Add other method return type checks specific to your package
    expect(typeof packageInstance.destroy()).toBe('undefined');
  });
});
```

### **Configuration Validation Tests**
```typescript
describe('Configuration Validation', () => {
  test('accepts valid configuration', () => {
    const validConfig = {
      requiredSetting: 'value',
      optionalSetting: 100
    };
    
    expect(() => new PackageName(validConfig)).not.toThrow();
  });
  
  test('rejects invalid configuration', () => {
    const invalidConfigs = [
      null,
      undefined,
      {},
      { requiredSetting: null },
      { requiredSetting: 123 } // wrong type
    ];
    
    invalidConfigs.forEach(config => {
      expect(() => new PackageName(config)).toThrow(PackageError);
    });
  });
  
  test('provides helpful error messages', () => {
    expect(() => new PackageName({})).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('requiredSetting')
      })
    );
  });
});
```

### **Error Handling Tests**
```typescript
describe('Error Handling', () => {
  test('throws PackageError for known failures', async () => {
    const packageInstance = new PackageName({
      requiredSetting: 'test-value',
      simulateError: true
    });
    
    await expect(packageInstance.initialize()).rejects.toThrow(PackageError);
  });
  
  test('cleans up resources on error', async () => {
    const packageInstance = new PackageName(errorConfig);
    const cleanupSpy = jest.spyOn(packageInstance, 'cleanup');
    
    try {
      await packageInstance.initialize();
    } catch (error) {
      expect(cleanupSpy).toHaveBeenCalled();
    }
  });
});
```

### **Testing Tool Configuration**

**Vitest Configuration (`vitest.config.ts`)**:
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // Use 'jsdom' for packages that manipulate DOM
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      threshold: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  },
  esbuild: {
    target: 'node14'
  }
});
```

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
- **Integration tests**: Test package-internal component interactions  
- **Configuration tests**: Validate all configuration scenarios
- **Error scenario tests**: Test all error conditions and edge cases
- **Performance tests**: Validate package doesn't exceed performance budgets
- **Tool compatibility**: Works reliably with TypeScript and build tools

### **Coverage Requirements**
- **Minimum 90% code coverage** across branches, functions, lines, statements
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

### **Implementation Hints & Standards**

**ESLint Configuration:**
1. Uses flat config format in `eslint.config.js` (not `.eslintrc.*`)
2. Current version: eslint ^9.30.1 with typescript-eslint ^8.35.1
3. YOU MUST NOT USE eslint's FlatCompat
4. Extends: eslint:recommended, typescript-eslint:recommended
5. The `eslint.config.js` file is extremely fragile. Avoid modifying it unless absolutely necessary

**Development Priorities:**
- WORKING CODE THAT MEETS THE SPECIFICATION IS FAR MORE IMPORTANT THAN LINTING

**Accessibility & Standards:**
- Use semantic HTML with proper ARIA attributes for accessibility
- `@axe-core/playwright` only exports `AxeBuilder`, not `injectAxe` or `getViolations`

**Architecture Constraints:**
- The site is static. DO NOT CREATE POST, PATCH, PUT, or DELETE OPERATIONS

### **Documentation Requirements**

**🚨 CRITICAL REQUIREMENT - README ISOLATION**

README.md files are PUBLIC-FACING and MUST be completely self-contained:

- **❌ NEVER reference internal files**: No links to `prompts/`, `docs/`, `decisions/`, or any internal documentation
- **❌ NEVER reference development structure**: Users cannot see workspace-internal files
- **❌ NEVER use relative paths**: No `./prompts/guidelines.md` or `../docs/api.md` references
- **✅ ONLY reference published content**: Package exports, npm packages, external URLs

**WHY**: README.md appears on npm, GitHub, and package registries where internal project files don't exist. Any internal references will be broken links for users.

**Required README.md Sections:**
- **Purpose**: Clear, one-sentence description of what the package does
- **Installation**: Exact installation instructions (workspace context)
- **Usage**: Comprehensive examples showing ALL primary use cases
- **API Reference**: Complete documentation of all public exports/configurations
- **Development**: Instructions for contributors (testing, building, etc.)

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

### **TypeScript Configuration Standards**
- **Strict Mode**: Enable strict type checking
- **Target**: ES2022 for modern JavaScript features
- **Module**: ESNext for optimal tree shaking
- **Lib**: Include necessary libraries (ES2022, DOM for UI packages)
- **Declaration**: Generate .d.ts files for TypeScript consumers
- **Source Maps**: Enable for debugging

### **Build Configuration Standards**
- **Packages**: Use Rollup for optimized library builds
- **Applications**: Use Vite for development server and HMR
- **Output**: Multiple formats (ESM, CJS) for maximum compatibility
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

## 📚 **Universal System Glossary**

### **🏢 MONOREPO TERMS**

**Package**  
A discrete unit of functionality in the monorepo with:
- Own package.json with dependencies
- Isolated build process
- Independent versioning
- Clear interface boundaries
- Documentation inheritance from hierarchical system

**Layer**  
A grouping of packages by function:
- **Runtime Layer**: Packages that handle application logic and user interactions
- **Development Layer**: Build tools, configs, and development utilities

**Dependency Injection**  
A pattern where packages receive their dependencies through constructor parameters rather than creating them internally. Enables:
- Testing with mock dependencies
- Runtime dependency swapping
- Clear dependency visualization
- Loose coupling between packages

### **📖 DOCUMENTATION SYSTEM TERMS**

**Documentation Inheritance**  
Hierarchical system where packages automatically receive documentation from parent directories:
- **Universal**: All packages inherit files from `prompts/` root
- **Layer**: Packages inherit from their layer directory (`development/` or `runtime/`)
- **Package-specific**: Each package gets its own implementation guide

**Needs File**  
Documentation that describes what a dependent package requires from a dependency:
- Located in dependent package: `docs/libraries/needs/dependency-name-needs.md`
- Automatically symlinked into dependency's documentation
- Written from dependent's perspective
- Defines required interfaces, methods, and behaviors

**Symlink Network**  
System of symbolic links that ensures each package has access to relevant documentation without duplication:
- Created by `setup-package-docs.js`
- Automatically maintained by npm prepare hooks
- Provides single source of truth for each concept
- Enables contextual documentation for LLM agents

**LLM Agent Context**  
The complete set of documentation files that an LLM agent receives when implementing a package:
- Universal documentation (architecture, testing, security, glossary)
- Layer and sublayer guidelines
- Package-specific implementation guide
- Needs files from all dependent packages
- README files from dependencies

### **🔧 DEVELOPMENT TERMS**

**Build Tool Strategy**  
Different build tools for different package types:
- **Vite**: Used for applications (apps/) with dev server and HMR
- **Rollup**: Used for packages with optimized library builds
- **TypeScript**: Universal compilation across all packages
- **CSS Inlining**: Critical CSS optimization via vite-plugin-inline-source

**Testing Strategy**  
Dual testing approach based on package type:
- **Vitest**: Unit and integration testing for packages
- **Interface Compliance Tests**: Verify packages implement required interfaces
- **Configuration Validation**: Ensure exported configs are valid

**Package Naming Convention**  
Consistent naming across the monorepo:
- **Packages**: `@voder/package-name` (e.g., `@voder/shared`, `@voder/services`)
- **Applications**: `voder-app-name` (e.g., `voder-website`)
- **Files**: kebab-case with descriptive names
- **Exports**: PascalCase for classes, camelCase for functions

**Prepare Hook**  
npm lifecycle script that runs automatically:
- Executes `node ../../setup-package-docs.js`
- Runs on `npm install` and `npm run prepare`
- Ensures documentation symlinks are current
- Creates proper LLM agent context

### **🔌 INTEGRATION TERMS**

**Dependency Graph**  
Visual representation of package relationships:
- **Runtime Dependencies**: Required for application execution
- **Development Dependencies**: Required for building/testing
- **Peer Dependencies**: Expected to be provided by consumer
- **Circular Dependencies**: Dependencies that reference each other (avoid)

**Interface Compliance**  
Verification that implementations match contracts:
- TypeScript interface validation
- Runtime type checking
- Method signature verification
- Event contract compliance

### **🧪 TESTING TERMS**

**Unit Test**  
Test of individual functions or methods in isolation:
- Mock external dependencies
- Fast execution (< 1ms per test)
- High code coverage target (> 90%)
- Testing behavior, not implementation

**Integration Test**  
Test of package interactions:
- Real dependencies between packages
- Interface contract compliance
- Moderate execution time (< 100ms per test)

### **⚡ QUICK REFERENCE**

**File Naming Patterns**  
- **Packages**: `PackageName.ts` (PascalCase)
- **Interfaces**: `IPackageName.ts` (I + PascalCase)
- **Tests**: `packageName.test.ts` or `packageName.spec.ts`
- **Documentation**: `package-name.md` (kebab-case)

**Import/Export Patterns**  
```typescript
// Interface definition
export interface IPackageService { ... }

// Implementation
export class PackageService implements IPackageService { ... }

// Default export for main package
export default class PackageName { ... }

// Named exports for utilities
export { validateConfig, createUtility };
```

**Documentation Inheritance Order**  
1. **Universal** (`prompts/*.md`) → All packages
2. **Layer** (`prompts/runtime/*.md` or `prompts/development/*.md`) → Layer packages  
3. **Package** (`prompts/runtime/package-name/*.md`) → Specific package
4. **Needs** (`docs/libraries/needs/*.md`) → From dependent packages

**Testing File Locations**  
- **Unit tests**: `src/__tests__/` or alongside source files
- **Integration tests**: `tests/integration/`
- **Configuration tests**: `tests/config/`
- **Package validation tests**: `tests/package/`

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

## 🏁 **Conclusion**

This universal guide provides the complete foundation for implementing ANY package in the Voder monorepo. These principles, patterns, and standards apply equally to configuration packages like `@voder/tsconfig`, utility packages like `@voder/shared`, and runtime packages like `@voder/services`.

**Remember**: Every concept here represents core system knowledge that ALL packages need to understand, regardless of their specific functionality.
