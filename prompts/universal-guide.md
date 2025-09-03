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

### **🎯 Platform Compatibility Policy**

**This development environment targets POSIX-compatible systems (macOS, Linux, WSL2) and does NOT target native Windows compatibility.**

**Platform Requirements:**
- **Primary Targets**: macOS, Linux, WSL2 (Windows Subsystem for Linux)
- **Shell Environment**: bash, zsh, or other POSIX-compatible shells
- **Build Tools**: POSIX shell commands (cp, mv, rm, etc.) are acceptable in package.json scripts
- **Git Operations**: Git commands (git add, git commit, git push, etc.) are expected and required for development workflow
- **Node.js**: Cross-platform Node.js features are preferred, but shell integration is acceptable
- **Node.js Scripts**: Any Node.js scripts used in build processes MUST be written in TypeScript

**Acceptable Build Patterns:**
```json
{
  "scripts": {
    "copy:assets": "cp typescript/*.json dist/typescript/ && cp eslint/*.js dist/eslint/",
    "clean": "rm -rf dist/ coverage/",
    "build": "tsc -p tsconfig.build.json && npm run copy:assets",
    "custom-build": "tsx scripts/build.ts",
    "verify": "npm audit fix --force && npm run lint:check && npm run format && npm run build && npm run test:ci"
  }
}
```

### **🔒 Dependency Security and Currency Requirements**

**MANDATORY: npm audit fix --force in verify script**

All packages MUST include `npm audit fix --force` as the first step in their verify script, executed before any other quality checks:

```json
{
  "scripts": {
    "verify": "npm audit fix --force && npm run lint:fix && npm run lint:check && npm run lint:md:fix && npm run format && npm run build && npm run test:ci"
  }
}
```

**Why npm audit fix --force is Required:**

**1. Early Problem Detection:**
- **Immediate Feedback**: Security vulnerabilities are identified and fixed as soon as they exist
- **Development Integration**: Fixes are applied during normal development workflow, not as separate maintenance
- **Dependency Currency**: Keeps dependencies current and avoids getting stuck on old versions with security issues

**2. Automated Dependency Management:**
- **Zero Manual Intervention**: Security updates happen automatically during quality checks
- **Consistent Updates**: All team members and CI environments get the same dependency updates
- **Reduced Maintenance Debt**: Prevents accumulation of security vulnerabilities requiring large update efforts

**3. Breaking Change Management:**
- **Early Breaking Change Detection**: If a security update introduces breaking changes, it's discovered during development when fixes are easier
- **Controlled Update Timing**: Updates happen during active development when developers can address any issues immediately
- **Test Integration**: Breaking changes are caught by the test suite that runs after the audit fix

**4. Development Workflow Benefits:**
- **Clean Audit State**: Ensures `npm audit` always shows zero vulnerabilities in committed code
- **CI/CD Reliability**: Prevents CI failures due to security audit failures
- **Deployment Confidence**: Code that passes verify script is ready for production deployment

**Why --force Flag is Necessary:**
- **Non-Interactive**: Enables automated execution in CI/CD environments
- **Decisive Updates**: Applies all available security fixes without manual confirmation
- **Consistent Behavior**: Same result across different environments and team members

**Integration with Quality Gates:**
The verify script order ensures that security updates are applied before code quality checks, so any breaking changes introduced by security fixes are caught by linting, formatting, building, and testing steps.

**CRITICAL: Verify Script Order Requirements:**

The verify script MUST follow this exact order for optimal efficiency:

```bash
npm audit fix --force && npm run lint:fix && npm run lint:check && npm run lint:md:fix && npm run format && npm run build && npm run test:ci
```

**Why This Order Matters:**

**1. Fix Before Check Pattern:**
- **lint:fix**: Automatically fixes all auto-fixable linting issues
- **lint:check**: Validates that no unfixable linting issues remain
- **Efficiency**: Prevents verify script failure on issues that could be automatically resolved

**2. Auto-Fix Before Validation:**
- **lint:md:fix**: Automatically fixes markdown linting issues before other checks
- **format**: Automatically fixes code formatting before build/test validation
- **Logical Flow**: All automatic fixes applied before any validation checks

**3. Build Before Test:**
- **build**: Validates that current code compiles successfully  
- **test:ci**: Validates that compiled code passes all tests
- **Dependency Order**: Tests run against compiled output, so build must succeed first

**❌ WRONG ORDER (Inefficient):**
```bash
# This fails unnecessarily when auto-fixable issues exist
npm run lint:check && npm run lint:fix  # Check fails, fix succeeds, but script already failed
```

**✅ CORRECT ORDER (Efficient):**
```bash
# This succeeds when auto-fixable issues exist, only fails on real problems
npm run lint:fix && npm run lint:check  # Fix resolves issues, check validates remaining quality
```

**Expected Failure Handling:**
If `npm audit fix --force` introduces breaking changes:
1. **Linting failures**: Will be caught by `npm run lint:check` (after auto-fixes are applied)
2. **Build failures**: Will be caught by `npm run build`
3. **Test failures**: Will be caught by `npm run test:ci`
4. **Format issues**: Will be caught by `npm run format` (after auto-fixes are applied)

This approach ensures that security updates are prioritized while maintaining code quality and functionality.

**📝 Markdown Linting Requirements:**

All packages MUST include markdown linting for user-facing documentation:

```json
{
  "scripts": {
    "lint:md": "markdownlint-cli2 *.md docs/**/*.md",
    "lint:md:fix": "markdownlint-cli2 --fix *.md docs/**/*.md"
  }
}
```

**Markdown File Inclusion Policy:**

**✅ INCLUDE (User-facing documentation):**
- **Root-level markdown files**: `README.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, etc.
- **Documentation directories**: All files in `docs/` and its subdirectories (`docs/**/*.md`)
- **Published content**: Any markdown files that are included in the published package

**❌ EXCLUDE (Internal/development files):**
- **Development documentation**: Files in `prompts/`, `prompt-assets/`, or similar internal directories
- **System files**: Files in `.voder/`, `.github/`, or other system directories
- **Templates**: Markdown template files that are not actual content
- **Build artifacts**: Any generated markdown files

**Why This Pattern Matters:**
- **Quality assurance**: User-facing documentation must meet quality standards
- **Consistency**: All published documentation follows the same formatting rules
- **Maintenance**: Linting catches formatting issues before they reach users
- **Selective scope**: Internal development files don't need the same formatting constraints

**Correct Pattern: `*.md docs/**/*.md`**
- `*.md`: Catches all root-level markdown files (README, CHANGELOG, etc.)
- `docs/**/*.md`: Catches all markdown files in documentation directories
- **Excludes**: `prompts/`, `prompt-assets/`, `.voder/`, and other internal directories

**🚫 Pre-commit Hook Limitations in Monorepo Subdirectories:**

**CRITICAL: Husky and lint-staged CANNOT be used in subdirectory packages within larger repositories.**

**Why Pre-commit Hooks Are Not Supported:**
- **Git Hook Scope**: Git hooks operate at the repository root level, not within subdirectories
- **Monorepo Structure**: This project exists as a subdirectory (`packages/dev-config/`) within a larger repository structure
- **Hook Conflicts**: Installing Husky in a subdirectory would attempt to modify the parent repository's git hooks
- **Permission Issues**: Subdirectory packages cannot and should not control parent repository git configuration
- **Tooling Assumptions**: Husky and lint-staged assume they are running at the git repository root

**Alternative Quality Enforcement Strategy:**
Instead of pre-commit hooks, quality enforcement MUST rely on:

**1. Comprehensive Verify Script:**
```json
{
  "scripts": {
    "verify": "npm audit fix --force && npm run lint:fix && npm run lint:check && npm run lint:md:fix && npm run format && npm run build && npm run test:ci"
  }
}
```

**2. Developer Workflow Discipline:**
- **Before Commit**: Always run `npm run verify` before committing changes
- **CI/CD Integration**: Verify script runs automatically in continuous integration
- **Code Review**: Ensure all commits pass the verify script requirements

**3. IDE Integration:**
- **ESLint Extension**: Configure IDE to show linting errors in real-time
- **Prettier Extension**: Configure IDE to format on save
- **TypeScript Integration**: Enable TypeScript checking in IDE

**4. Manual Quality Checks:**
- **Regular Audits**: Run `npm audit` to check for security vulnerabilities
- **Dependency Updates**: Periodically run `npm outdated` and update dependencies
- **Format Validation**: Ensure `npm run format` produces no changes before committing

**Repository Structure Context:**
```
parent-repository/
├── .git/                    # Git hooks controlled here (not accessible to subdirs)
├── packages/
│   ├── dev-config/          # This package (cannot install Husky here)
│   │   ├── package.json     # Must use verify script instead of hooks
│   │   └── ...
│   └── other-packages/
└── ...
```

**Development Best Practices:**
- **Never Install Husky**: Do not add `husky` to devDependencies in subdirectory packages
- **Never Configure lint-staged**: Do not add `lint-staged` configuration to subdirectory package.json
- **Rely on Verify Script**: Use the comprehensive verify script as the quality gate
- **Document Expectations**: Clearly document that developers must run verify before committing

**Why POSIX-Only:**
- **Development Focus**: Streamlined development without Windows-specific complexity
- **Shell Simplicity**: Direct use of standard Unix tools without abstraction layers
- **CI/CD Alignment**: Most CI environments (GitHub Actions, GitLab CI) run on Linux
- **LLM Agent Compatibility**: Shell commands are more predictable and debuggable
- **Ecosystem Standard**: Most Node.js tooling assumes POSIX environment availability

**Windows Developers:**
- **Recommended**: Use WSL2 (Windows Subsystem for Linux) for development
- **Alternative**: Use development containers or remote development environments
- **Not Supported**: Native Windows Command Prompt or PowerShell environments

---

## 🚨 **CRITICAL: Repository File Management & Output Policy**

### **🎯 Core Principle: Console-First Output**

**ALL diagnostic output, command results, and information MUST go to console/stderr, not files.**

**🔑 WHY CONSOLE OUTPUT IS CRITICAL:**
- **Persistent History**: Console output is automatically captured in `.voder/history.md`
- **Future Context**: The history file provides essential context for future LLM actions and debugging
- **Continuous Learning**: Each command's output becomes input for subsequent AI decisions
- **Problem Resolution**: Error messages and diagnostics in history enable better troubleshooting
- **Clean Repository**: Prevents repository pollution with temporary diagnostic files
- **Immediate Feedback**: Real-time output visible to users and LLM agents
- **No Cleanup Required**: Console output doesn't leave files that need management

### **📖 The .voder/history.md Advantage**

The `.voder/history.md` file automatically captures all console interactions, creating a persistent knowledge base:

**What Gets Captured:**
- Command execution and results
- Error messages and stack traces  
- Build output and warnings
- Test results and coverage reports
- Linting and formatting feedback
- Installation and dependency information

**How It Helps Future Actions:**
- **Context Continuity**: Previous command results inform next steps
- **Error Patterns**: Recurring issues become visible and solvable
- **Success Recipes**: Working command sequences can be repeated
- **Environment State**: Current tool versions and configurations are documented
- **Decision History**: Why certain approaches were chosen or abandoned

**🚨 CRITICAL: History is NOT Read-Only Mode**

The `.voder/history.md` file documents what has been done previously, but **does NOT prevent new actions**:

- **✅ Always Run Commands When Needed**: If you need to verify tests, build status, or dependencies, run the commands
- **✅ History Informs, Doesn't Block**: Previous test runs inform you of likely outcomes, but you should verify current state
- **✅ Active Development**: You are an active developer who can run any necessary commands
- **❌ Don't Assume Read-Only**: Never assume you cannot run commands just because history exists
- **❌ Don't Trust Stale Results**: Previous test results may not reflect current working tree state

**When to Run Commands Despite History:**
- **Test verification**: Run `npm test` to confirm current working tree passes
- **Build validation**: Run `npm run build` to verify current compilation
- **Dependency checks**: Run verification scripts to validate current package state
- **Linting/formatting**: Run quality checks on current code state
- **Any uncertainty**: When history shows previous results but you need current verification

### **🎯 Console-First Development Workflow**

**Primary Rule: When in doubt, output to console, not files.**

The console-first approach creates a self-documenting development process where every action contributes to the historical knowledge base in `.voder/history.md`.

**🤖 LLM Agent Development Mode**

LLM agents operate as **solo developers** with **complete autonomy**:

- **✅ Execute Commands**: Run tests, builds, lints, and other verification commands as needed
- **✅ Modify Code**: Edit files, update configurations, fix issues when required
- **✅ Verify Changes**: Always run appropriate validation after making changes
- **✅ Debug Issues**: Run diagnostic commands to understand and resolve problems
- **✅ Make Decisions**: Decide on implementation approaches without external input
- **✅ Commit Directly**: Push completed work directly to main branch (ONLY after all quality checks pass)
- **❌ Passive Inspection**: Don't just read files and assume - actively verify current state
- **❌ Historical Assumptions**: Don't assume previous test results represent current state
- **❌ Wait for Others**: No one else is coming to help, review, or approve your work
- **❌ Create Reports**: Don't create status reports, review documents, or progress updates for others
- **❌ Publishing/Releases**: Never run `npm publish`, `npm version`, or create releases - this is handled by bespoke CI/CD
- **❌ GitHub Actions**: Never create `.github/workflows/` files - the project uses a bespoke CI/CD system, not GitHub Actions
- **❌ Commit Broken Code**: NEVER commit code that fails builds, tests, linting, or formatting checks

**Solo Development Guidelines:**
- **Complete Ownership**: You own the entire development lifecycle (excluding publishing/releases)
- **Self-Validation**: Use automated tools for all validation - no human review exists
- **Direct Action**: Take action immediately when you know what needs to be done
- **End-to-End Responsibility**: From requirements to deployment-ready code (publishing handled externally)
- **🚨 Quality Gate Enforcement**: ALWAYS run `npm run verify` before committing - never commit broken code

**Command Execution Guidelines:**
- **Verification First**: When unsure about package state, run verification commands
- **Test Before Conclude**: Run tests to confirm current working tree status
- **Build to Validate**: Run builds to ensure current code compiles correctly
- **Quality Before Commit**: Run `npm run verify` before every commit to ensure all checks pass
- **Active Problem Solving**: Use commands to diagnose and resolve issues
- **Prefer Broad Quality Checks**: Use comprehensive commands like `npm run verify` over individual test files
- **Avoid Expensive Individual Commands**: Running individual tests like `npx vitest run src/tests/package-exports.test.ts` is very expensive - use full test suites instead

#### **Recommended Output Strategy:**

1. **Information & Results** → `console.log()` or `stdout`
2. **Progress & Status** → `console.error()` or `stderr` 
3. **Errors & Warnings** → `console.error()` or `stderr`
4. **Debug Details** → Structured console output, not files
5. **Temporary Data** → OS temp directory only (if absolutely necessary)

#### **Benefits of Console-First Approach:**

- **🔄 Continuous Learning**: Each command builds knowledge for future actions
- **🐛 Better Debugging**: Error context is preserved and searchable
- **⚡ Faster Iteration**: No file cleanup or management overhead
- **🧠 AI-Friendly**: LLM agents can read and learn from command history
- **📊 Built-in Metrics**: Success/failure patterns become visible over time

### **⛔ ABSOLUTE PROHIBITION: Output Files in Repository**

**NEVER** create any output, temporary, log, or generated files within the repository directory structure unless they are explicitly covered by `.gitignore`.

#### **🚫 FORBIDDEN FILE CREATION:**

**File Extensions (NEVER create in repo):**
- `.log`, `.txt`, `.out`, `.cache`, `.tmp`, `.dump`
- `.json` (unless source configuration)
- `.csv`, `.xml` (unless source data)

**Directories (NEVER create in repo):**
- `logs/`, `output/`, `temp/`, `tmp/`, `cache/`
- `diagnostics/`, `artifacts/`, `reports/`
- `build/`, `coverage/` (unless `.gitignore`d)
- Tool artifacts: `.eslintcache`, `.nyc_output/`, `.vite/`

#### **✅ ONLY ALLOWED FILE CREATION:**

**Source Files (allowed in repo):**
- `.ts`, `.js`, `.md` - Source code and documentation
- `.json` - Configuration files only (not data dumps)
- Package configuration: `package.json`, `tsconfig.json`, etc.

**Build Outputs (only if gitignored):**
- Files explicitly listed in `.gitignore`
- Compiled output in `dist/`, `build/` directories

**External Files (preferred for any output):**
- Files written to OS temp directory outside the repository
- Console output captured in `.voder/history.md`

### **🔒 Repository Cleanliness Requirements**

#### **Required .gitignore Coverage:**
```gitignore
# Build outputs
node_modules/
/dist/
/build/
coverage/

# Tool artifacts  
.cache/
.eslintcache
.vite/
.nyc_output/

# System files
.DS_Store

# Output files (NEVER commit these)
*.log
*.txt
*.out
*.tmp
*.dump

# Temporary directories
logs/
temp/
diagnostics/
artifacts/
```

#### **🤖 LLM Agent Visibility Constraints:**

**CRITICAL**: LLM agents (like the reader of this document) cannot see `.gitignore`d directories or files unless explicitly included via `.voderignore` negation patterns.

**Default Invisible to LLM Agents:**
- `dist/`, `build/`, `coverage/` - Build outputs
- `node_modules/` - Dependencies
- `.cache/`, `.eslintcache`, `.vite/` - Tool artifacts
- Any directory or file pattern listed in `.gitignore`

**Making Content Visible to LLM Agents:**
To make gitignored content visible for LLM inspection, add negation patterns to `.voderignore`:

```gitignore
# .voderignore - Controls LLM agent visibility
# Make dist/ visible for package inspection
!dist/

# Make specific build artifacts visible
!build/types/
!coverage/lcov-report/

# Make specific logs visible for debugging
!logs/debug.log
```

**🎯 Expected Pattern for Package Development:**

For packages that compile TypeScript to JavaScript (like configuration packages), it is **EXPECTED and RECOMMENDED** to have `!dist/` in `.voderignore`:

```gitignore
# .voderignore - Make dist/ visible for LLM package inspection
!dist/
```

**Why This Is Essential:**
- **Package Export Verification**: LLM agents need to verify that `package.json` exports point to actual compiled files
- **Build Output Inspection**: Agents can validate that TypeScript compilation produces expected JavaScript structure
- **Dependency Resolution**: Agents can check that compiled imports/exports match source expectations
- **Packaging Validation**: Agents can verify the compiled package structure matches what consumers will receive
- **Troubleshooting**: When export paths don't resolve, agents can inspect both source and compiled files

**Repository State Expectations:**
- `dist/` should be in `.gitignore` (never committed to version control)
- `dist/` should be negated in `.voderignore` (visible to LLM agents)
- This creates the ideal state: clean VCS history + full LLM package inspection capability

---

## � **LLM Dependency Documentation Requirements**

### **🤖 Critical: docs/libraries/usage Directory**

The `docs/libraries/usage/` directory contains **essential dependency usage documentation** that enables LLM agents to understand and correctly use project dependencies. **These files MUST NOT be removed or relocated.**

**Purpose and Protection:**
- **LLM Context**: Provides critical usage patterns and examples for complex dependencies
- **Implementation Guidance**: Shows correct integration patterns that LLM agents need to implement features
- **Error Prevention**: Prevents common integration mistakes by documenting known-good patterns
- **Dependency Mastery**: Enables LLM agents to use dependencies effectively without external research

**⚠️ CRITICAL PROTECTION POLICY:**
- **✅ PRESERVE**: All files in `docs/libraries/usage/` are protected and essential
- **✅ EXPAND**: Add new usage documentation as dependencies are added
- **✅ UPDATE**: Keep usage examples current with dependency versions
- **❌ NEVER REMOVE**: Do not delete, relocate, or "prune" these files
- **❌ NEVER CONSOLIDATE**: Do not merge into other documentation - keep as dedicated reference files
- **❌ NEVER RELOCATE**: Do not move to external repositories or different locations

**What Gets Documented:**
- **Complex Integration Patterns**: Dependencies requiring specific setup or configuration
- **Common Usage Examples**: Practical examples of dependency usage in context
- **Configuration Requirements**: How to configure dependencies correctly
- **API Usage Patterns**: Key API calls and their proper usage
- **Version-Specific Notes**: Important version compatibility information

**Example Documentation Structure:**
```
docs/libraries/usage/
├── eslint-plugin-unicorn.md     # Plugin-specific configuration and rules
├── rollup-plugin-typescript.md  # Build tool integration patterns
├── vitest.md                    # Testing framework usage patterns
└── typescript-eslint-parser.md  # Parser configuration examples
```

**Why This Documentation Is Essential:**
- **Prevents Research Overhead**: LLM agents don't need to research dependency usage from scratch
- **Ensures Correct Implementation**: Provides tested, working examples of complex integrations
- **Maintains Consistency**: All dependency usage follows documented patterns
- **Reduces Integration Errors**: Common mistakes are avoided through clear guidance
- **Enables Feature Development**: LLM agents can implement features requiring dependency interaction

---

## �📦 **Package Development Guidelines**

### **Dual Export Strategy for Configuration Packages**

Configuration packages should provide **both** main index aggregation and dedicated export paths to maximize developer flexibility:

**Dual Export Implementation:**
```json
// package.json exports
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./testing": {
      "import": "./dist/testing/index.js", 
      "types": "./dist/testing/index.d.ts"
    },
    "./prettier": "./prettier.config.ts",
    "./eslint": "./eslint/index.js",
    "./typescript": "./typescript/index.js"
  }
}
```

```typescript
// src/index.ts - Main index aggregation
export * as testing from './testing/index.js';
export { default as prettier } from '../prettier.config.js';
export * as eslint from '../eslint/index.js';
export * as typescript from '../typescript/index.js';
```

**Consumer Usage Patterns:**
```typescript
// Pattern 1: Dedicated paths (explicit, tree-shakable)
import { createVitestNodeConfig } from '@voder/dev-config/testing';
import prettierConfig from '@voder/dev-config/prettier';
import { base, dx } from '@voder/dev-config/eslint';

// Pattern 2: Main index (convenient for multiple imports)
import { testing, prettier, eslint } from '@voder/dev-config';
const vitestConfig = testing.createVitestNodeConfig();
```

**Export Equivalence Testing (REQUIRED):**
Configuration packages MUST test that both export patterns provide identical functionality:

```typescript
// tests/export-equivalence.test.ts
import { describe, test, expect } from 'vitest';

describe('Export Equivalence', () => {
  test('testing exports are equivalent', async () => {
    // Dedicated path import
    const dedicatedTesting = await import('@voder/dev-config/testing');
    
    // Main index import  
    const { testing: indexTesting } = await import('@voder/dev-config');
    
    // Verify same functionality available
    expect(typeof dedicatedTesting.createVitestNodeConfig).toBe('function');
    expect(typeof indexTesting.createVitestNodeConfig).toBe('function');
    
    // Verify identical configuration output
    const dedicatedConfig = dedicatedTesting.createVitestNodeConfig();
    const indexConfig = indexTesting.createVitestNodeConfig();
    expect(dedicatedConfig).toEqual(indexConfig);
  });

  test('prettier exports are equivalent', async () => {
    const dedicatedPrettier = await import('@voder/dev-config/prettier');
    const { prettier: indexPrettier } = await import('@voder/dev-config');
    
    expect(dedicatedPrettier.default).toEqual(indexPrettier);
  });

  test('eslint exports are equivalent', async () => {
    const dedicatedEslint = await import('@voder/dev-config/eslint');
    const { eslint: indexEslint } = await import('@voder/dev-config');
    
    expect(dedicatedEslint.base).toEqual(indexEslint.base);
    expect(dedicatedEslint.dx).toEqual(indexEslint.dx);
    expect(dedicatedEslint.performance).toEqual(indexEslint.performance);
  });
});
```

**Package Export Integration Testing (REQUIRED):**
All packages implementing dual export strategies MUST include integration tests that verify the actual package.json export paths work correctly:

```typescript
// tests/package-exports.test.ts
import { describe, test, expect } from 'vitest';

describe('Package Export Integration', () => {
  test('all package export paths are accessible', async () => {
    // Test actual package.json export paths work
    const mainImport = import('@package-name');
    const moduleImport = import('@package-name/module');
    
    // All imports should resolve without error
    const [main, module] = await Promise.all([
      mainImport,
      moduleImport
    ]);
    
    expect(main).toBeDefined();
    expect(module).toBeDefined();
  });

  test('export functionality works end-to-end', async () => {
    // Test that exported functions actually work when imported via package paths
    const { someFunction } = await import('@package-name/module');
    
    // Should not throw and should return valid results
    expect(() => someFunction()).not.toThrow();
    const result = someFunction();
    expect(result).toBeDefined();
  });
});
```

**Smoke Test Requirements (REQUIRED):**
All packages MUST include smoke tests that verify basic functionality without errors:

```typescript
// tests/smoke.test.ts  
import { describe, test, expect } from 'vitest';

describe('Package Smoke Tests', () => {
  test('all exports load without throwing', async () => {
    // Import all package exports and verify they load successfully
    await expect(import('@package-name')).resolves.toBeDefined();
    await expect(import('@package-name/module')).resolves.toBeDefined();
  });

  test('main exports have expected shape', async () => {
    const main = await import('@package-name');
    
    // Verify main exports structure without deep inspection
    expect(main.primaryExport).toBeDefined();
    expect(typeof main.primaryExport).toBe('object');
  });
});
```

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
- **Lib**: Include necessary libraries (ES2022 for Node.js/server packages)
- **Declaration**: Generate .d.ts files for TypeScript consumers
- **Source Maps**: Enable for debugging

### **TypeScript Module Requirements**
- **ESM modules**: All `.ts` files MUST be valid ES modules. If a file has no imports/exports, add `export {};` to make it a module.
- **Configuration exports**: Prefer TypeScript (`.ts`) for configuration files when supported by consuming tools. Configuration packages SHOULD export typed configurations rather than plain JavaScript.
- **Import extensions**: Use explicit `.js` extensions in import paths when targeting ESM output (TypeScript will resolve to `.ts` during compilation).

### **Build Configuration Standards**
- **Output**: ESM only
- **Tree Shaking**: Enable for optimal bundle sizes
- **External Dependencies**: Mark as external to avoid bundling

**🚨 CRITICAL BUILD OUTPUT POLICY:**
- **Build outputs** (like `dist/`, `build/`) MUST be covered by `.gitignore` 
- **NEVER commit** compiled JavaScript, declaration files, or build artifacts
- **Source-only repository**: Only TypeScript source files should be tracked in version control
- **Clean builds**: Always build from source; never rely on committed build outputs

**🚨 CRITICAL: Build Artifact Pollution Prevention**

**ABSOLUTE PROHIBITION: Build artifacts in source directories**

Build processes MUST NEVER create compilation artifacts outside of designated build output directories (`dist/`, `build/`). The presence of build artifacts in source directories severely reduces code quality and version control assessments.

**❌ FORBIDDEN BUILD POLLUTION (Severely damages code quality assessment):**
```bash
# These files should NEVER exist in source directories:
src/module.d.ts.map          # TypeScript declaration maps
scripts/build-script.d.ts    # TypeScript declarations  
linters/config.js.map        # JavaScript source maps
typescript/config.d.ts.map   # Any .d.ts.map files outside dist/
```

**✅ CORRECT BUILD ARTIFACT LOCATION:**
```bash
# Build artifacts belong ONLY in build output directories:
dist/src/module.d.ts.map     ✅ Properly contained
dist/scripts/build-script.d.ts ✅ Properly contained
dist/linters/config.js.map   ✅ Properly contained
```

**🔍 POLLUTION DETECTION AND CLEANUP:**

**Immediate Detection Command:**
```bash
# Find build artifact pollution (should return nothing)
find . -name "*.d.ts.map" -not -path "./dist/*" -not -path "./node_modules/*"
find . -name "*.js.map" -not -path "./dist/*" -not -path "./node_modules/*" -not -name "*.config.*"
```

**Emergency Cleanup Commands:**
```bash
# Remove TypeScript declaration map pollution
find . -name "*.d.ts.map" -not -path "./dist/*" -not -path "./node_modules/*" -delete

# Remove JavaScript source map pollution (preserve config maps)
find . -name "*.js.map" -not -path "./dist/*" -not -path "./node_modules/*" -not -name "*.config.*" -delete

# Remove TypeScript declaration pollution (preserve legitimate type files)
find . -name "*.d.ts" -not -path "./dist/*" -not -path "./node_modules/*" -not -path "./src/types/*" -delete
```

**🎯 ROOT CAUSE PREVENTION:**

**TypeScript Configuration Requirements:**
- **All source directories** MUST be included in `tsconfig.build.json` include array
- **Proper outDir** MUST be set to `dist` or appropriate build directory
- **Never run tsx/ts-node** on files outside of build configuration scope

**Example Correct Configuration:**
```jsonc
// tsconfig.build.json
{
  "extends": "./typescript/build.json",
  "compilerOptions": {
    "outDir": "dist",           // ALL outputs go to dist/
    "rootDir": "."
  },
  "include": [
    "src",                      // ✅ Include all source directories
    "scripts",                  // ✅ Include scripts directory
    "eslint", 
    "typescript", 
    "linters",
    "prettier.config.ts"
  ]
}
```

**🚨 CODE QUALITY IMPACT:**

Build artifact pollution has severe negative impacts:

**Version Control Assessment Damage:**
- **Repository cleanliness**: Presence of build artifacts indicates poor build hygiene
- **Commit quality**: Accidental commits of build artifacts pollute git history
- **Diff quality**: Build artifacts create noise in code reviews and diffs
- **Branch management**: Merge conflicts on build artifacts waste development time

**Code Quality Assessment Damage:**
- **Professional standards**: Build pollution indicates lack of professional development practices
- **Maintenance burden**: Cleanup requires manual intervention and repository maintenance
- **Tool reliability**: Inconsistent build artifact location breaks tooling assumptions
- **CI/CD integration**: Polluted repositories require additional cleanup steps

**Development Workflow Damage:**
- **IDE performance**: IDEs may index and search through build artifacts unnecessarily
- **Search quality**: Build artifacts pollute search results and grep operations
- **File navigation**: Extra files make repository navigation more difficult
- **Cognitive load**: Developers must distinguish between source and generated files

**IMMEDIATE ACTION REQUIRED:**
If build artifact pollution is detected, it must be addressed immediately:
1. **Stop current build processes** to prevent further pollution
2. **Run cleanup commands** to remove existing pollution
3. **Fix TypeScript configuration** to include all source directories
4. **Verify build works correctly** without creating pollution
5. **Add detection to CI/CD** to prevent future pollution

### **🚨 COMPREHENSIVE TESTING REQUIREMENTS**

**ALL code MUST meet 80% coverage thresholds across all metrics. NO EXCEPTIONS.**

**🎯 UNIVERSAL COVERAGE POLICY:**
- **All source code**: 80% branches, functions, lines, statements
- **All build scripts**: Must be tested with the same rigor as application code
- **All configuration generation**: Must be tested and validated
- **All utilities**: Must be thoroughly tested regardless of their purpose

**⛔ FORBIDDEN COVERAGE EXEMPTIONS:**
- **❌ "It's just a build script"** - Build scripts are critical infrastructure
- **❌ "It's just configuration"** - Configuration generation must be reliable
- **❌ "It's just a utility"** - Utilities must be tested like any other code
- **❌ "It's just for development"** - Development tools must be production-quality
- **❌ "It's too simple to test"** - Simple code should be easy to test completely

**🔧 REQUIRED TESTING PATTERNS:**

**Build Scripts Testing:**
```typescript
// tests/scripts/copy-assets.test.ts
describe('copy-assets script', () => {
  test('copies all required asset files', async () => {
    // Test actual file copying logic
    // Verify all expected files are copied
    // Validate file contents and permissions
  });

  test('handles missing source files gracefully', async () => {
    // Test error handling when source files don't exist
  });

  test('creates target directories when needed', async () => {
    // Test directory creation logic
  });
});
```

**Configuration Generation Testing:**
```typescript
// tests/scripts/generate-config.test.ts
describe('configuration generation', () => {
  test('generates valid configuration files', async () => {
    // Test that generated config is valid and functional
    // Verify output format and content
  });

  test('handles template variables correctly', async () => {
    // Test variable substitution and templating
  });

  test('validates input parameters', async () => {
    // Test input validation and error handling
  });
});
```

**Utility Function Testing:**
```typescript
// tests/utils/helper.test.ts
describe('utility functions', () => {
  test('handles all input variations', () => {
    // Test all code paths and edge cases
    // Verify error handling for invalid inputs
  });

  test('produces consistent outputs', () => {
    // Test deterministic behavior
    // Verify outputs match specifications
  });
});
```

### **📊 SCRIPT COVERAGE STRATEGIES**

**🎯 COVERAGE ENGINE SELECTION**

Projects use **Istanbul as the coverage engine** for Vitest instead of the default V8 provider. This choice enables fine-grained coverage exclusion through comments like `/* istanbul ignore if */` and `/* istanbul ignore next */`, which are essential for handling CLI-only code paths that cannot be unit tested.

**Configuration Implementation:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',  // Not V8 - enables coverage exclusion
      reporter: ['text', 'html', 'lcov']
    }
  }
});
```

**� LEGITIMATE COVERAGE EXCLUSIONS**

While the 80% coverage requirement is strict, certain file types are legitimately excluded from coverage measurement because they cannot be meaningfully tested during test execution:

**Excluded File Types:**
```typescript
// vitest.config.ts coverage exclusions
exclude: [
  'dist/**',           // Compiled output
  'coverage/**',       // Coverage reports
  'node_modules/**',   // Third-party dependencies
  '**/*.test.ts',      // Test files themselves
  '**/*.spec.ts',      // Test specifications
  'vitest.config.ts',  // Test configuration file
]
```

**Why `vitest.config.ts` is Excluded:**
- **Execution Context**: Vitest config files are only executed during test framework initialization, not during test runs when coverage is measured
- **No Runtime Coverage**: The configuration is processed before any test code runs, making it impossible to capture coverage during test execution
- **Framework Infrastructure**: It's part of the testing infrastructure itself, not application code
- **Similar to Other Config Files**: Like `tsconfig.json`, `eslint.config.js`, etc., these are build-time configurations that don't participate in runtime coverage

**�🚨 CRITICAL INSIGHT: Dual Testing Strategy Required**

Build scripts require a **dual testing approach** combining unit tests for coverage measurement with integration tests for CLI validation. Testing scripts via subprocess execution alone does **NOT** provide coverage metrics for the executed code.

**✅ EFFECTIVE APPROACH: Unit + Integration Testing**

**1. Unit Tests - For Coverage Measurement:**
```typescript
// tests/scripts/copy-assets-unit.test.ts - Import and test functions directly
import { copyAssets, ensureDir, formatCLIOutput } from '../../scripts/copy-assets';
import { describe, test, expect } from 'vitest';

describe('copy-assets unit tests', () => {
  test('copyAssets function processes files correctly', async () => {
    // Test the exported function directly for coverage
    const result = await copyAssets('/test/path');
    expect(result).toBeDefined();
  });

  test('formatCLIOutput produces correct output', () => {
    // Test output formatting logic for coverage
    const result = { tsFiles: ['config.json'], jsFiles: ['rules.js'] };
    expect(() => formatCLIOutput(result)).not.toThrow();
  });
});
```

**2. Integration Tests - For CLI Validation:**
```typescript
// tests/scripts/copy-assets.test.ts - Run script as subprocess for E2E testing
import { execSync } from 'child_process';
import { describe, test, expect } from 'vitest';

describe('copy-assets integration tests', () => {
  test('script executes successfully via command line', () => {
    // This validates the CLI interface but doesn't provide coverage
    const result = execSync('npx tsx ./scripts/copy-assets.ts', {
      encoding: 'utf8',
      cwd: testDir
    });
    expect(result).toContain('copy-assets completed successfully');
  });
});
```

**🎯 SCRIPT ARCHITECTURE FOR MAXIMUM TESTABILITY:**

Scripts must minimize CLI-only code paths to maximize testable coverage:

```typescript
// scripts/copy-assets.ts - Extract all business logic into testable functions
export async function copyAssets(repoRoot: string = process.cwd()) {
  // Main business logic - 100% unit testable
  return { tsFiles, jsFiles };
}

export function formatCLIOutput(result: { tsFiles: string[]; jsFiles: string[] }): void {
  // Output formatting logic - unit testable
  result.tsFiles.forEach((file: string) => {
    stderr.write(`✅ Copied TypeScript file: ${file}\n`);
  });
  stderr.write('🎉 copy-assets completed successfully\n');
}

// CLI execution - minimal and excluded from coverage requirements
/* istanbul ignore if */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  /* istanbul ignore next */
  (async () => {
    try {
      const result = await copyAssets();
      formatCLIOutput(result);
    } catch (err) {
      stderr.write(`❌ ${String(err)}\n`);
      exit(1);
    }
  })();
}
```

**� COVERAGE EXCLUSION FOR CLI CODE:**

Use Istanbul coverage exclusion comments for the minimal CLI-only code that cannot be unit tested:

- **`/* istanbul ignore if */`**: Exclude CLI guard condition
- **`/* istanbul ignore next */`**: Exclude CLI execution wrapper
- **`/* istanbul ignore file */`**: Exclude entire files if purely CLI (rare)

**� COVERAGE REQUIREMENTS BY TEST TYPE:**

| Test Type | Purpose | Coverage Contribution |
|-----------|---------|----------------------|
| **Unit Tests** | Function-level testing | ✅ **Primary coverage source** |
| **Integration Tests** | CLI interface validation | ❌ **No coverage contribution** |
| **Combined Approach** | Complete validation | ✅ **Coverage + E2E assurance** |

**🚨 COVERAGE ENFORCEMENT:**
- **No selective exclusions**: Coverage thresholds apply to ALL code
- **Build integration**: Coverage failures must fail CI/CD builds
- **Quality gates**: 80% coverage required before any code can be merged
- **Regular monitoring**: Coverage must not regress below thresholds

### **🎯 BRANCH COVERAGE OPTIMIZATION TECHNIQUES**

**Eliminate Ternary Operators for 100% Branch Coverage**

Ternary operators create branch coverage issues that are difficult to test comprehensively. Replace them with object lookups or explicit if/else statements for better coverage.

**❌ PROBLEMATIC: Ternary Operator (Hard to test both branches)**
```typescript
// This creates a branch that's difficult to cover in tests
const levelsUp = isCompiledEnvironment ? ['..', '..', '..'] : ['..', '..'];
```

**✅ SOLUTION 1: String-Based Object Lookup (Eliminates branching)**
```typescript
// Convert boolean to string key, eliminating branching logic
const environment = `${__dirname.includes('/dist/')}` as 'true' | 'false';

const pathLevels = {
  'true': ['..', '..', '..'],   // compiled environment  
  'false': ['..', '..']         // source environment
};

const levelsUp = pathLevels[environment];
```

**✅ SOLUTION 2: Explicit If/Else (Easier to test both branches)**
```typescript
// Explicit branching that can be tested with different __dirname values
let levelsUp: string[];
if (__dirname.includes('/dist/')) {
  levelsUp = ['..', '..', '..'];  // compiled environment
} else {
  levelsUp = ['..', '..'];        // source environment  
}
```

**Why Object Lookup is Preferred:**
- **No Branching Logic**: The lookup itself doesn't create branches to cover
- **Type Safety**: Keys can be typed as literal unions for compile-time safety
- **Scalability**: Easy to add more conditions without additional branching
- **Testability**: Only need to test the boolean-to-string conversion once
- **Coverage**: Achieves 100% branch coverage without complex test scenarios

**When to Apply This Pattern:**
- **Environment Detection**: File path checks, NODE_ENV switches
- **Configuration Selection**: Choosing configs based on runtime conditions
- **Simple Decision Trees**: Binary or small-set decision logic
- **Build/Runtime Switches**: Different behavior between development and production

**Using Coverage Ignores for Untestable Branches:**

Some branches cannot or should not be tested because they involve system dependencies or unsafe operations. Use Istanbul coverage ignores judiciously for these cases:

**✅ APPROPRIATE USE: System Dependencies (Cannot safely test)**
```typescript
export function generateConfig(outputDir?: string): string {
  let resolvedOutputDir = outputDir;
  
  /* istanbul ignore if */
  if (!resolvedOutputDir) {
    /* istanbul ignore next */
    resolvedOutputDir = process.cwd(); // Don't test process.cwd() calls
  }
  
  return resolvedOutputDir;
}
```

**✅ APPROPRIATE USE: Error Paths (Difficult to trigger reliably)**
```typescript
try {
  await chmod(destPath, st.mode);
} catch (modeErr) {
  /* istanbul ignore next */
  throw new Error(`Failed to preserve mode: ${String(modeErr)}`);
}
```

**✅ APPROPRIATE USE: CLI Execution Blocks**
```typescript
/* istanbul ignore if */
if (process.argv[1] === new URL(import.meta.url).pathname) {
  /* istanbul ignore next */
  const result = generateConfig();
  /* istanbul ignore next */
  console.error(`✅ Generated config at ${result}`);
}
```

**❌ INAPPROPRIATE USE: Business Logic (Should be tested)**
```typescript
// DON'T ignore core business logic branches
if (user.isAdmin) {  // This should be tested!
  return adminFeatures;
} else {
  return regularFeatures;
}
```

**Guidelines for Coverage Ignores:**
- **System Calls**: `process.cwd()`, `process.env`, filesystem errors
- **CLI Blocks**: Script execution when run directly via command line
- **Error Paths**: Filesystem permission errors, network timeouts
- **External Dependencies**: Third-party library error states
- **Minimal Use**: Prefer code restructuring over ignores when possible
- **Document Reasoning**: Comment why the ignore is necessary

**Why Comprehensive Testing Matters:**
- **Build Reliability**: Build scripts are critical infrastructure that must work consistently
- **Configuration Correctness**: Generated configurations must be valid and functional
- **Utility Dependability**: Helper functions are often reused and must be bulletproof
- **Debugging Speed**: Well-tested code is easier to debug when issues arise
- **Refactoring Safety**: Comprehensive tests enable safe code improvements
- **Professional Standards**: All code should meet professional quality standards

---

## ⚡ **ESLint Configuration Guidelines**

> **🎯 TARGET SIMPLE IMPLEMENTATION**: The goal is to simplify ESLint configuration to 1-2 lines via improved @voder/dev-config complete configurations. See [`docs/libraries/needs/dev-config-needs.md`](../packages/ui-tools/docs/libraries/needs/dev-config-needs.md) for requirements.

### **🎯 Target Simple Implementation (Goal)**

This is what ESLint configuration should look like once dev-config provides complete configurations:

```javascript
// eslint.config.js - TARGET: Simple 1-2 line setup
export { complete as default } from '@voder/dev-config/eslint';
```

**What this complete config must handle automatically:**
- ✅ **All source files**: `src/**/*.{js,ts}`
- ✅ **All test files**: `tests/**/*.{js,ts}`, `**/*.test.{js,ts}`, `**/*.spec.{js,ts}` 
- ✅ **All config files**: `*.config.{js,ts}`, `vite.config.*`, `vitest.config.*`, `prettier.config.*`, `eslint.config.*`
- ✅ **All script files**: `scripts/**/*.{js,ts}`
- ✅ **Proper TypeScript parsing** for all `.ts` files (using appropriate tsconfig files)
- ✅ **Standard ignore patterns** for build outputs (`dist/`, `coverage/`, etc.)
- ✅ **Integration with dev-config rule layers** (base, dx, performance)

### **🚨 Required Package.json Scripts**

These scripts work with both current complex configs and future simple configs:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:check": "eslint . --max-warnings 0"
  }
}
```

**❌ WRONG: Legacy CLI Flags (Breaks Flat Config)**
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.js",        // ❌ --ext overrides flat config
    "lint:fix": "eslint . --ext .ts,.js --fix"  // ❌ Ignores configuration ignores
  }
}
```

### **🛠️ Setup Requirements**

Until dev-config provides complete configurations, projects need:

1. **Required TypeScript configs**: `tsconfig.eslint.json` and `tsconfig.config.json`
2. **Manual configuration composition** (temporary workaround)
3. **Proper ignore patterns** for build outputs
4. **Configuration file overrides** for different parsing needs

---

## **Decision Governance Policy (MADR)**

All architectural and dependency decisions are captured as MADR-style Architecture Decision Records (ADRs).

**🚨 CRITICAL: ADRs Are Documentation, NOT Quality Gates**

ADR creation and acceptance is a **documentation practice** to capture decisions after they are made. It is **NOT a quality gate** that blocks development or implementation.

- **✅ Immediate Documentation**: Create ADRs as soon as decisions are made or discovered
- **✅ Self-Acceptance**: Mark ADRs as "Accepted" immediately when documenting implemented decisions  
- **✅ Implementation-First**: ADRs document what was decided and implemented, not what might be decided
- **❌ No Review Bottlenecks**: Do NOT wait for external reviewers, approvals, or authorization
- **❌ No Development Blocking**: ADRs must never delay development, commits, or releases
- **❌ No Quality Gates**: ADR acceptance is not conditional on external validation

**Purpose**: ADRs exist to:
1. Document the reasoning behind decisions for future maintainers
2. Provide context when decisions need to be revisited
3. Create a searchable history of architectural choices
4. Help onboard new team members to existing decisions

**Published Documentation**: Both the package README.md and local ADRs in `docs/decisions/` are published with the package and available to consumers. These are considered published content that can be referenced in documentation and other ADRs.

### **ADR Title Guidelines:**

Effective ADR titles are **imperative statements** that clearly communicate the decision and its scope. They should be skimmable in file listings and immediately convey what was decided.

**✅ GOOD Examples:**
- `Use TypeScript for configuration files` - Clear action + context
- `Adopt ESLint flat config v9` - Specific tool + version decision  
- `Require exact version alignment for vitest packages` - Precise constraint decision
- `Export configurations as TypeScript modules` - Clear architectural choice
- `Declare peer dependencies for consumer tools` - Specific dependency strategy
- `Use console output instead of log files` - Clear behavior directive

**❌ BAD Examples:**
- `TypeScript` - Too vague, doesn't state the decision
- `Which linting tool should we use?` - Question format, unclear outcome
- `ESLint configuration` - Ambiguous, doesn't specify what was decided
- `Dependencies` - Generic, no indication of the specific decision
- `Fix the build issues` - Problem statement, not a decision
- `Update packages` - Too generic, doesn't specify what or why

### **ADR Management:**

- **Format and template**: Use MADR format. Start from the template at `prompt-assets/adr-template.md`.
- **Location and naming**: Place local decisions in `docs/decisions/` within the package. Use zero‑padded incremental numbering with a concise kebab‑case slug, e.g., `0003-use-mongodb-for-event-storage.md`.
- **Required front‑matter**: `status:` (Proposed | Accepted | Rejected | Superseded), `date:` (ISO date), `deciders:` (names/roles for documentation only), `packages:` (scope of applicability when shared)
- **Lifecycle**: Draft as `Accepted` with Context, Options, Decision, Consequences, and References. Implement immediately. If direction changes later, author a new ADR that marks the prior as `Superseded`.
- **Dependency gate (mandatory)**: Every **new direct dependency** requires an ADR for documentation. Bundle the ADR with the dependency change for documentation completeness.
- **Version specification policy**: Use semantic version ranges by default. Only specify exact versions when technical constraints require it (peer dependency alignment, API compatibility). Document the reasoning in ADRs when using exact versions.
- **Dependency verification policy**: Version alignment constraints must be verified through automated tests, not manual documentation.

---

## **Lean Development Practices (Flow over Inventory)**

### **🎯 Solo Development Model**

This is a **single-agent development environment** with no collaboration infrastructure:

- **No team coordination**: You are the only developer
- **No code review process**: No one else will review your code
- **No approval workflows**: No one else will approve your changes
- **No project management**: No one else is tracking your progress
- **No external validation**: Automated tools are your only validation

### **Expected Development Flow:**
1. **Read requirements** from documentation and specifications
2. **Implement solution** completely and thoroughly
3. **Test extensively** using automated test suites
4. **Validate quality** with linting, type checking, and builds
5. **Commit and push** directly to main branch when ready
6. **Move to next task** - no waiting, no handoffs

### **Commit and Push Strategy:**
- Commit small, coherent changes frequently; push early and often to a shared remote.
- Deliver vertical slices that provide immediate value to package consumers
- Optimize for cycle time to minimize cost of delay. Ship safe, incremental improvements; use pre‑releases when appropriate.
- Run local checks (lint, type‑check, tests) before pushing to keep the main branch green.
- If progress stalls, reduce batch size, slice scope thinner, or author a pivot ADR documenting the change in approach.
- **NO PULL REQUESTS**: Push directly to main after validation
- **NO APPROVAL GATES**: Your automated tests and builds are the approval process
