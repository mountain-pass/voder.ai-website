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
    "custom-build": "tsx scripts/build.ts"
  }
}
```

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
