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

**Example Impact:**
```bash
# First run - error captured in history
npm test
# ❌ Error: Cannot find module '@types/node'

# LLM reads history, understands missing dependency  
npm install --save-dev @types/node

# Second run - success captured in history
npm test  
# ✅ All tests passing (captured for future reference)
```

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

---

| Use Case | ✅ CORRECT Approach | ❌ WRONG Approach |
|----------|-------------------|------------------|
| **Command Results** | `console.log()`, `process.stdout` | Writing to `results.txt` |
| **Debug Information** | `console.error()`, `process.stderr` | Writing to `debug.log` |
| **Error Details** | Detailed error messages to stderr | Error dumps to files |
| **Status Updates** | Progress messages to stdout | Status files |
| **Test Results** | Test runner console output | Test result files |
| **Diagnostics** | Structured console output | Diagnostic dump files |

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

#### **🔍 Pre-commit Verification:**
- Verify `.gitignore` comprehensiveness before any file operations
- Scan for forbidden file patterns in diffs
- Reject commits containing non-source files outside `.gitignore`
- Clean up any temporary files immediately after creation

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

**Common Use Cases:**
- **Package inspection**: `!dist/` - Allow LLM to verify compiled output structure
- **Build verification**: `!build/types/` - Check generated TypeScript declarations
- **Coverage analysis**: `!coverage/lcov-report/` - Review test coverage reports
- **Debug assistance**: `!logs/debug.log` - Inspect specific error logs

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

**⚠️ Important**: Only negate `.gitignore`d content when LLM inspection is specifically needed. For most build outputs, visibility isn't required, but for packages that need export verification, `!dist/` negation is expected.

### **🛠️ Implementation Guidelines**

#### **Console Output Best Practices:**

```typescript
// ✅ CORRECT: Structured console output
console.log(`✅ Operation completed: ${operation.name}`);
console.error(`❌ Error in ${context}: ${error.message}`);

// Include relevant context in console messages
console.log(JSON.stringify({
  operation: 'build',
  status: 'success',
  duration: '2.3s',
  files: ['index.js', 'types.d.ts']
}, null, 2));

// ✅ CORRECT: Progress updates to stderr (doesn't interfere with stdout data)
process.stderr.write(`Processing ${current}/${total}...\n`);
```

#### **Temporary File Handling (when absolutely necessary):**

```typescript
// ✅ CORRECT: OS temp directory only
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

const tempDir = await mkdtemp(join(tmpdir(), 'voder-'));
try {
  // Use tempDir for any file operations
  const tempFile = join(tempDir, 'data.json');
  await writeFile(tempFile, JSON.stringify(data));
  console.error(`Temporary data written to: ${tempFile}`);
} finally {
  // Always cleanup
  await rm(tempDir, { recursive: true, force: true });
}
```

#### **Repository Boundary Protection:**

```typescript
// ✅ CORRECT: Prevent accidental repo file creation
import { resolve } from 'path';
import { execSync } from 'child_process';

function ensureOutsideRepo(outputPath: string): string {
  try {
    const repoRoot = execSync('git rev-parse --show-toplevel', { 
      encoding: 'utf8' 
    }).trim();
    const resolvedPath = resolve(outputPath);
    
    if (resolvedPath.startsWith(repoRoot)) {
      console.error(`⚠️  Redirecting output from repo to OS temp: ${outputPath}`);
      return join(tmpdir(), `voder-${Date.now()}-${basename(outputPath)}`);
    }
  } catch {
    // Not in a git repo, path is safe
  }
  
  return outputPath;
}
```

### **📋 Enforcement Checklist**

**Before ANY file operation:**
- [ ] Is this output going to console instead of a file?
- [ ] If a file is absolutely necessary, is it outside the repository?
- [ ] Is the output path verified to not be within the repo?
- [ ] Will this file be cleaned up automatically?
- [ ] Is the information available in `.voder/history.md` for future reference?

**Code Review Requirements:**
- [ ] No new files in repository outside `.gitignore`
- [ ] All diagnostic output goes to console
- [ ] Temporary files use OS temp directory only
- [ ] Console output is structured and informative
- [ ] No build outputs, cache files, or artifacts in diffs

### **📝 Summary: Console-First File Management**

**✅ DO:**
- Output all results, diagnostics, and progress to console
- Use structured console messages with clear status indicators
- Leverage `.voder/history.md` as your persistent knowledge base
- Redirect to OS temp directory if files are absolutely necessary
- Write meaningful error messages that help future debugging

**❌ DON'T:**
- Create any output files in the repository directory
- Save diagnostics, logs, or results to files instead of console
- Assume temporary files will be cleaned up automatically
- Use files for information that could be console output
- Ignore the historical value of console output

**🎯 Remember: Console output today becomes tomorrow's context.**

---

### **🐚 Shell Command Examples**

**All shell commands target POSIX-compatible environments (bash, zsh, macOS, Linux, WSL2).**

#### **Build Script Patterns (POSIX Shell Commands):**
```bash
# ✅ CORRECT: POSIX shell commands in package.json scripts
{
  "scripts": {
    "clean": "rm -rf dist/ coverage/",
    "copy:assets": "cp typescript/*.json dist/typescript/ && cp eslint/*.js dist/eslint/",
    "build": "tsc -p tsconfig.build.json && npm run copy:assets",
    "prebuild": "npm run clean",
    "verify": "npm run type-check && npm run lint && npm run build && npm run test"
  }
}

# ✅ CORRECT: Multi-step build commands with error handling
npm run clean && npm run build || { echo "❌ Build failed" >&2; exit 1; }

# ✅ CORRECT: Conditional file operations
[ -d dist ] && rm -rf dist/* || mkdir -p dist
cp -r src/assets/* dist/ 2>/dev/null || true
```

#### **Console-First Patterns:**
```bash
# ✅ CORRECT: Direct console output (captured in .voder/history.md)
npm test 2>&1                    # Test results to console
eslint . --format=stylish        # Linting results to console  
tsc --noEmit                     # Type checking to console

# ✅ CORRECT: Structured console output with context
echo "🔍 Running type check..." >&2
tsc --noEmit && echo "✅ Types valid" || echo "❌ Type errors found"

# ✅ CORRECT: Progress updates to stderr (preserves stdout data)
echo "Processing package dependencies..." >&2
npm install --silent
echo "✅ Dependencies installed" >&2
```

#### **Temporary Files (when absolutely necessary):**
```bash
# ✅ CORRECT: OS temp directory with auto-cleanup
RUN_DIR="$(mktemp -d "${TMPDIR:-/tmp}/voder-$(date +%Y%m%d-%H%M%S)-$$-XXXXXX")"
trap 'rm -rf "$RUN_DIR"' EXIT

echo "📁 Temp directory: $RUN_DIR" >&2

# Use temp directory for any file output
my_command --output "$RUN_DIR/results.json"
echo "📊 Results saved to temp: $RUN_DIR/results.json" >&2
```

#### **Repository Boundary Protection:**
```bash
# ✅ CORRECT: Prevent accidental repo file creation
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
OUTPUT_FILE="$PWD/diagnostics.txt"

case "$OUTPUT_FILE" in
  "$REPO_ROOT"/*)
    echo "⚠️  Redirecting output from repo to OS temp..." >&2
    OUTPUT_FILE="$(mktemp "${TMPDIR:-/tmp}/voder-XXXXXX.txt")"
    ;;
esac

echo "diagnostics data" > "$OUTPUT_FILE"
echo "📄 Diagnostics: $OUTPUT_FILE" >&2
```

#### **Error Handling with Console Output:**
```bash
# ✅ CORRECT: Detailed error info to console, not files
if ! npm run build 2>&1; then
    echo "❌ Build failed with details above" >&2
    echo "🔍 Environment: Node $(node --version), npm $(npm --version)" >&2
    echo "📁 Working directory: $PWD" >&2
    exit 1
fi
```

> **Key Points:**
> - **POSIX Environment**: All shell commands target bash/zsh on macOS/Linux/WSL2
> - **Console output** is automatically preserved in `.voder/history.md`
> - **Shell Commands**: POSIX shell commands (cp, rm, mv) are acceptable in build scripts
> - **stderr** (`>&2`) for progress/status, **stdout** for data
> - **Temp files** only in OS temp directory with cleanup
> - **Repository protection** prevents accidental file creation in repo
> - **Cross-platform**: Node.js features preferred, but shell integration acceptable

---

## 📦 **Package Development Patterns**

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

**Integration/Smoke Test Categories:**
- **Export Resolution Tests**: Verify package.json exports resolve correctly
- **Import Functionality Tests**: Confirm imported functions/objects work as expected  
- **Cross-Export Compatibility**: Test that different import patterns provide equivalent functionality
- **Error Resilience**: Verify imports don't throw during module loading
- **API Surface Validation**: Confirm exported APIs have expected shapes and types

**Benefits of Dual Export Strategy:**
- **Developer Choice**: Use dedicated paths for explicit imports or main index for convenience
- **Tree Shaking**: Dedicated paths enable better bundler optimization
- **Migration Path**: Easy transition between import styles without breaking changes
- **Familiarity**: Supports both modern (dedicated) and traditional (index) npm patterns

### **TypeScript Package Compilation Strategy**

For packages that compile TypeScript to JavaScript for distribution:

**Expected Repository Structure:**
```
src/                 # TypeScript source files (committed)
dist/                # Compiled JavaScript (gitignored, LLM-visible)
package.json         # Points exports to dist/ files
.gitignore          # Excludes dist/ from commits
.voderignore        # Negates dist/ for LLM inspection (!dist/)
```

**File Management Strategy:**
- **Source Control**: Only commit TypeScript sources, never compiled outputs
- **LLM Visibility**: Make compiled outputs visible for verification and troubleshooting
- **Consumer Distribution**: Publish compiled JavaScript to npm (includes dist/)

**Package Configuration:**
```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./eslint": {
      "import": "./dist/eslint/index.js",
      "types": "./dist/eslint/index.d.ts"
    }
  },
  "scripts": {
    "clean": "rm -rf dist/",
    "copy:assets": "cp typescript/*.json dist/typescript/ && cp eslint/*.js dist/eslint/",
    "build": "tsc -p tsconfig.build.json && npm run copy:assets",
    "prebuild": "npm run clean"
  }
}
```

**Build Process (POSIX Shell Commands Acceptable):**
- **TypeScript Compilation**: `tsc` compiles .ts files to dist/
- **Asset Copying**: Shell commands (cp, mv) copy additional files to dist/
- **Clean Operations**: Shell commands (rm -rf) clean build artifacts
- **Multi-step Builds**: Shell operators (&&, ||) chain build steps
- **Cross-Platform**: Not required - POSIX environment assumed

**Example Build Pipeline:**
```bash
# ✅ CORRECT: POSIX shell commands in build process
npm run clean                    # rm -rf dist/
npm run build                   # tsc + cp assets
npm test                        # Verify build artifacts
```

**Why LLM Agents Need dist/ Visibility:**
1. **Export Path Validation**: Verify `package.json` exports point to real files
2. **Compilation Verification**: Check TypeScript → JavaScript transformation correctness
3. **Import Resolution**: Debug consumer import issues by inspecting actual output
4. **Package Structure**: Validate final package structure matches expectations
5. **Type Declaration**: Verify `.d.ts` files are generated correctly
6. **Export Equivalence**: Test that dual export patterns provide identical functionality

**This is NOT a problem or inconsistency** - it's the expected and optimal pattern for TypeScript packages.

### **Development Workflow Scripts**

All packages MUST implement standardized development workflow scripts to ensure consistent development experience and automated quality checks.

#### **Required Script Patterns**

**1. Verify Script (MANDATORY):**
The `verify` script runs a comprehensive quality pipeline that validates the entire package state:

```json
{
  "scripts": {
    "verify": "npm audit fix --force && npm run lint:fix && npm run lint:md:fix && npm run format && npm run build && npm run test:ci"
  }
}
```

**Verify Script Components:**
- **`npm audit fix --force`**: Fix security vulnerabilities in dependencies
- **`npm run lint:fix`**: Fix automatically correctable linting issues
- **`npm run lint:md:fix`**: Fix markdown linting issues automatically
- **`npm run format`**: Apply consistent code formatting (Prettier)
- **`npm run build`**: Compile TypeScript and copy assets
- **`npm run test:ci`**: Run comprehensive test suite with coverage

**When to Run Verify:**
- **🚨 BEFORE ALL COMMITS (MANDATORY)**: ALL quality checks MUST pass before committing code
- **After dependency updates**: Validate package still works correctly
- **During development**: Regular validation of current state
- **CI/CD integration**: Automated quality gate in pipelines

**🚨 CRITICAL: Commit Quality Gates**

**NEVER commit or push code that:**
- ❌ Has build failures (`npm run build` fails)
- ❌ Has failing tests (`npm run test:ci` fails)
- ❌ Has linting errors (`npm run lint:check` fails)
- ❌ Has formatting inconsistencies (`npm run format:check` fails)
- ❌ Has markdown linting errors (`npm run lint:md` fails)
- ❌ Has TypeScript errors (`npm run type-check` fails)
- ❌ Has security vulnerabilities (`npm audit` shows high/critical issues)

**ALWAYS run `npm run verify` before commits to ensure all quality gates pass.**

**Why Quality Gates Are Mandatory:**
- **Build Integrity**: Ensures working tree always compiles successfully
- **Test Coverage**: Maintains code quality and prevents regressions
- **Code Consistency**: Enforces consistent formatting and style across all packages
- **Security**: Prevents committing code with known vulnerabilities
- **Team Productivity**: Reduces time spent debugging broken builds
- **CI/CD Reliability**: Ensures external CI/CD system doesn't fail on preventable issues

**2. Clean Script (MANDATORY):**
The `clean` script removes all generated files and build artifacts:

```json
{
  "scripts": {
    "clean": "rm -rf dist/ coverage/ *.log *.txt .vite/ .cache/ .eslintcache"
  }
}
```

**Clean Script Targets:**
- **`dist/`**: Compiled TypeScript output
- **`coverage/`**: Test coverage reports
- **`*.log *.txt`**: Any accidentally created output files
- **`.vite/ .cache/`**: Vite build cache directories
- **`.eslintcache`**: ESLint cache files
- **Tool artifacts**: Any other tool-generated cache or temp files

**When to Run Clean:**
- **Build issues**: Clear stale build artifacts
- **Fresh start**: Reset to clean source-only state
- **Storage cleanup**: Remove accumulated build artifacts
- **Debugging**: Eliminate cached state causing issues

**3. Supporting Development Scripts (RECOMMENDED):**

```json
{
  "scripts": {
    "dev": "vitest --watch",
    "type-check": "tsc --noEmit",
    "prebuild": "npm run clean",
    "postbuild": "npm run type-check",
    "pretest": "npm run build",
    "reset": "npm run clean && npm install && npm run verify"
  }
}
```

**Supporting Script Purposes:**
- **`dev`**: Start development mode with live testing
- **`type-check`**: Validate TypeScript types without compilation
- **`prebuild`**: Automatic cleanup before building
- **`postbuild`**: Validation after build completion
- **`pretest`**: Ensure fresh build before testing
- **`reset`**: Complete package reset and verification

#### **Script Composition Patterns**

**Error Handling in Script Chains:**
```bash
# ✅ CORRECT: Fail fast on any error
"verify": "npm audit fix --force && npm run lint:fix && npm run test"

# ✅ CORRECT: Continue on expected failures
"clean": "rm -rf dist/ || true && rm -rf coverage/ || true"

# ✅ CORRECT: Conditional execution
"build:prod": "npm run clean && [ \"$NODE_ENV\" = \"production\" ] && npm run build:optimized || npm run build"
```

**Console Output for Script Visibility:**
```bash
# ✅ CORRECT: Descriptive script output (captured in .voder/history.md)
"verify": "echo '🔍 Starting comprehensive verification...' && npm audit fix --force && echo '✅ Security fixes applied' && npm run lint:fix && echo '✅ Linting complete' && npm run build && echo '✅ Build successful' && npm run test:ci && echo '✅ All tests passing'"
```

**Cross-Package Consistency:**
- **Naming**: Use identical script names across all packages
- **Order**: Maintain consistent execution order in verify script
- **Output**: Ensure scripts provide clear console feedback
- **Error handling**: Fail appropriately on quality gate failures

#### **Benefits of Standardized Scripts**

**Developer Experience:**
- **Predictable commands**: Same scripts work across all packages
- **One-command verification**: Single command validates entire package
- **Clean slate capability**: Easy reset to known good state
- **Development mode**: Live feedback during development

**Quality Assurance:**
- **Automated fixes**: Scripts automatically resolve fixable issues
- **Comprehensive validation**: Verify builds, tests, and formatting together
- **Dependency security**: Regular security vulnerability fixes
- **Build integrity**: Ensure compilation and assets are correct

**LLM Agent Compatibility:**
- **Standardized patterns**: Predictable script behavior across packages
- **Console output**: All script results captured in `.voder/history.md`
- **Error visibility**: Clear failure modes and diagnostic information
- **State verification**: Easy validation of current package health

**POSIX Shell Integration:**
- **Cross-platform**: Works on macOS, Linux, WSL2 environments
- **Shell commands**: Direct use of rm, cp, mv for file operations
- **Command chaining**: Use && and || for proper error handling
- **Tool integration**: Seamless integration with npm, TypeScript, ESLint, Prettier

---

## 🏛️ **Package Scope Boundaries**
- Scope is a single standalone package
- The CI/CD for this package is managed externally via a bespoke workflow system. Do not add pipeline configuration files.
- Exclude deployment/CI/infrastructure concerns. This is all managed externally, NOT in GitHub Actions.

### **🚫 Publishing Policy**

**CRITICAL: Package publishing is handled externally via a bespoke CI/CD workflow system and MUST NOT be performed by developers.**

**Bespoke CI/CD Workflow:**
The project uses a custom CI/CD system that operates with this workflow:
1. **`npm ci`** - Clean install of dependencies
2. **`npm run verify`** - Comprehensive quality checks (audit, lint, format, build, test)
3. **`npm pack`** - Create distribution tarball
4. **Private repository publication** - Automated publishing to private npm registry

**Prohibited Actions:**
- ❌ `npm publish` - Publishing is managed by the bespoke CI/CD system
- ❌ `npm version` - Version bumping is handled externally  
- ❌ Creating release tags or GitHub releases
- ❌ Updating version numbers in package.json
- ❌ Any npm registry operations
- ❌ **Creating GitHub Actions workflow files** - The project does NOT use GitHub Actions
- ❌ **Creating `.github/workflows/` directory or files** - This is a waste of time and will not be used

**Developer Responsibilities:**
- ✅ Implement features and fix bugs
- ✅ Run quality checks (`npm run verify`)
- ✅ Commit source code changes
- ✅ Ensure tests pass and coverage meets requirements
- ✅ Update documentation and ADRs as needed

**External Management via Bespoke System:**
- **Publishing**: Automated via custom CI/CD workflow (`npm ci && npm run verify && npm pack`)
- **Versioning**: Managed by release automation
- **Registry Management**: Handled by private repository infrastructure
- **Release Notes**: Generated automatically from commits and ADRs
- **Quality Gates**: Enforced via `npm run verify` in the bespoke workflow

**Rationale:**
- **Consistency**: Automated publishing ensures consistent release processes
- **Security**: Prevents accidental or unauthorized publishes
- **Quality**: Bespoke system enforces all quality gates before publishing
- **Coordination**: Release timing coordinated across multiple packages
- **Audit**: Complete audit trail of all publishing activities
- **Custom Requirements**: Bespoke system handles project-specific publishing needs

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

### **🚨 MANDATORY: Markdown Documentation Standards**

**ALL packages MUST comply with standardized markdown linting using configurations from `@voder/dev-config`:**

**Mandatory Requirements:**
- **Use shared configuration**: MUST import and use markdown linting configuration from `@voder/dev-config`
- **No custom configurations**: MUST NOT create custom `.markdownlint.json` or override rules
- **Install required peer dependency**: MUST install `markdownlint-cli2` as specified by dev-config
- **No alternative tools**: MUST NOT use remark-lint, textlint, or other markdown linters
- **Enforce in scripts**: MUST include `lint:md` and `lint:md:fix` scripts in package.json
- **Pass linting**: ALL markdown files MUST pass the shared linting rules

**Required Implementation:**
```javascript
// .markdownlint.json (generated from @voder/dev-config)
import { getConfig } from '@voder/dev-config/linters/markdown';
import { writeFileSync } from 'fs';

const config = getConfig();
writeFileSync('.markdownlint.json', JSON.stringify(config, null, 2));
```

```json
// package.json scripts (MANDATORY)
{
  "scripts": {
    "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md",
    "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md"
  },
  "peerDependencies": {
    "markdownlint-cli2": "^0.13.0"
  }
}
```

**Enforcement Rules:**
- **File scope**: `README.md` and all files in `docs/**/*.md`
- **Heading structure**: Proper heading hierarchy and order
- **Code blocks**: MUST specify language for fenced code blocks
- **No bare HTML**: HTML elements prohibited in documentation
- **Link policy**: No relative links in published documentation (README.md)
- **Prettier integration**: Line length rules disabled (Prettier handles formatting)

**Why Mandatory Markdown Linting:**
- **Consistency**: All project documentation follows identical standards
- **Quality**: Catches documentation errors and improves readability
- **Tool consolidation**: Single linting solution across all packages
- **CI/CD integration**: Automated enforcement in pipelines
- **LLM comprehension**: Consistent markdown structure improves AI understanding

### **🚨 MANDATORY: Package Scripts**

**ALL packages MUST include standardized scripts for documentation setup and CLI access:**

**Required Scripts:**
```json
// package.json scripts (MANDATORY)
{
  "scripts": {
    "prepare": "node ../../setup-package-docs.js",
    "voder": "node ../../../voder/apps/voder-cli/index.js",
    "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md",
    "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md"
  }
}
```

**Script Requirements:**
- **`prepare`**: MUST run documentation setup using the hierarchical linking system
- **`voder`**: MUST provide access to the Voder CLI from any package directory
- **`lint:md`**: MUST run markdown linting (as documented above)
- **`lint:md:fix`**: MUST run markdown linting with auto-fix (as documented above)

**Why These Scripts Are Mandatory:**
- **Documentation Setup**: `prepare` ensures all packages get proper hierarchical documentation links
- **CLI Access**: `voder` provides consistent access to tooling from any package
- **Automation**: Scripts run automatically during package installation and development
- **Consistency**: Standardized command interface across all packages
- **LLM Integration**: Predictable script names for AI-assisted development

**Script Behavior:**
- **`prepare`**: Automatically runs on `npm install` to set up documentation symlinks
- **`voder`**: Provides CLI access with proper relative path resolution
- **Path Resolution**: All paths are relative to workspace structure for consistency

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
- **Export Integration Tests**: Verify package.json export paths work correctly with real imports
- **Smoke Tests**: Basic "does it work at all" functionality verification

### **REQUIRED Test Categories**

**1. Package Installation Integration Tests (MANDATORY for configuration packages):**
- Test the complete consumer experience by creating temporary packages and installing the built package
- Verify actual package.json export paths work when imported by real consumers
- Validate that all exports function correctly in a clean, isolated environment
- Most realistic testing approach that catches packaging and export issues
- Example: `tests/package-installation.test.ts`

**2. Export Integration Tests (MANDATORY for packages with multiple export paths):**
- Test actual package.json export paths resolve correctly from source
- Verify exported functions work when imported via package paths
- Validate end-to-end functionality through real package imports
- Example: `tests/package-exports.test.ts`

**3. Smoke Tests (MANDATORY for all packages):**
- Verify all exports load without throwing errors
- Confirm basic API surface structure and types
- Test core functionality works without deep inspection
- Example: `tests/smoke.test.ts`

**4. Export Equivalence Tests (MANDATORY for dual export strategy packages):**
- Ensure dedicated paths and main index provide identical functionality
- Verify re-exported modules maintain same behavior as direct imports
- Example: `tests/export-equivalence.test.ts`

**5. Package Structure Tests (MANDATORY for all packages):**
- Verify package.json exports point to existing compiled files in dist/
- Ensure no exports point to source .ts files
- Validate all declared export paths exist and are accessible
- Example: `tests/package-structure.test.ts`

### **🚨 CRITICAL: Use Vitest Tests for All Verification**

**ALL verification and validation MUST be done through formal Vitest test suites, NOT ad-hoc manual commands.**

**❌ WRONG: Manual ad-hoc verification commands**
```bash
# Don't do this - creates unrepeatable, undocumented verification
node -e "import('./dist/index.js').then(()=>console.log('✅ works'))"

# Don't do this - package structure should be tested formally
node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('./package.json','utf8')).exports, null, 2))"

# Don't do this - build verification should be in tests
ls -la dist/ && echo "Build artifacts exist"
```

**✅ CORRECT: Formal Vitest test suites**
```typescript
// tests/package-exports.test.ts
import { describe, test, expect } from 'vitest';

describe('Package Export Integration', () => {
  test('all exports resolve without errors', async () => {
    // Formal, repeatable, documented verification
    const indexModule = await import('../dist/index.js');
    expect(indexModule).toBeDefined();
    // Additional assertions for functionality
  });
});

// tests/package-structure.test.ts
import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Package Structure Validation', () => {
  test('all package.json exports point to existing dist files', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    const exports = packageJson.exports;
    
    expect(exports).toBeDefined();
    
    // Verify all export paths point to dist/ and exist
    for (const [exportPath, exportValue] of Object.entries(exports)) {
      if (typeof exportValue === 'string') {
        expect(exportValue).toMatch(/^\.\/dist\//);
        expect(exportValue).not.toMatch(/\.ts$/);
        expect(existsSync(exportValue.slice(2))).toBe(true);
      } else {
        for (const [key, path] of Object.entries(exportValue as Record<string, string>)) {
          expect(path).toMatch(/^\.\/dist\//);
          expect(path).not.toMatch(/\.ts$/);
          expect(existsSync(path.slice(2))).toBe(true);
        }
      }
    }
  });
});
```

**Why formal tests are mandatory:**
- **Repeatability**: Tests can be run consistently across environments
- **Documentation**: Test files document expected behavior and requirements
- **Coverage tracking**: Vitest provides coverage metrics and reporting
- **CI/CD integration**: Tests integrate with automated pipelines
- **Regression detection**: Tests catch regressions automatically
- **Debugging support**: Test frameworks provide better error reporting and debugging
- **Version control**: Test changes are tracked and reviewable

### **🎯 Package Installation Integration Testing (Recommended for Configuration Packages)**

For packages that provide configurations for other packages to consume, the most robust testing approach is **temporary package installation testing**:

```typescript
// tests/package-installation.test.ts
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { mkdtemp, rm, writeFile, mkdir } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

describe('Package Installation Integration', () => {
  let tempDir: string;
  let packagePath: string;

  beforeAll(async () => {
    // Create temp directory
    tempDir = await mkdtemp(join(tmpdir(), 'voder-test-'));
    
    // Pack the current package
    const packResult = execSync('npm pack', { encoding: 'utf8' });
    const tarball = packResult.trim().split('\n').pop();
    
    // Create test package.json in temp dir
    packagePath = join(tempDir, 'test-package');
    await mkdir(packagePath, { recursive: true });
    await writeFile(join(packagePath, 'package.json'), JSON.stringify({
      "name": "test-consumer",
      "type": "module",
      "dependencies": {
        "@voder/dev-config": `file:${resolve(tarball)}`
      }
    }));
    
    // Install the package
    execSync('npm install', { cwd: packagePath });
  });

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test('can import testing utilities', async () => {
    // Test imports from the installed package
    const testFile = join(packagePath, 'test.mjs');
    await writeFile(testFile, `
      import { createVitestNodeConfig } from '@voder/dev-config/testing';
      console.log(JSON.stringify({ success: true, type: typeof createVitestNodeConfig }));
    `);
    
    const result = execSync(`node ${testFile}`, { cwd: packagePath, encoding: 'utf8' });
    const output = JSON.parse(result.trim());
    expect(output.success).toBe(true);
    expect(output.type).toBe('function');
  });

  test('can import configuration files', async () => {
    const testFile = join(packagePath, 'config-test.mjs');
    await writeFile(testFile, `
      import prettierConfig from '@voder/dev-config/prettier';
      import { base, dx } from '@voder/dev-config/eslint';
      console.log(JSON.stringify({ 
        prettier: !!prettierConfig, 
        eslint: { base: Array.isArray(base), dx: Array.isArray(dx) }
      }));
    `);
    
    const result = execSync(`node ${testFile}`, { cwd: packagePath, encoding: 'utf8' });
    const output = JSON.parse(result.trim());
    expect(output.prettier).toBe(true);
    expect(output.eslint.base).toBe(true);
    expect(output.eslint.dx).toBe(true);
  });
});
```

**Benefits of Package Installation Testing:**
- **Most Realistic**: Tests exactly what consumers will experience
- **Build-Independent**: Doesn't require pre-existing dist files
- **Catches Packaging Issues**: Finds problems with exports, dependencies, etc.
- **Isolated**: Clean environment per test run
- **CI-Friendly**: Works reliably in automated environments
- **Complete Validation**: Tests the entire package distribution process

### **Package Scope Testing (Universal)**
Packages MUST test what they implement and export, but MUST NOT test:
- **Deployment processes**: Build pipelines, deployment scripts, infrastructure setup
- **Environment-specific behavior**: Production vs staging differences, environment variables
- **External system integrations**: APIs, databases, third-party services

> **🚨 CRITICAL**: Packages test their own implementation and how they integrate with their
dependencies only. They DO NOT test the dependencies.

### **Universal Test Requirements**

Every package MUST validate its public interface:

### **🚨 MANDATORY: Package Structure Validation**

**ALL packages MUST include formal tests that verify package structure integrity:**

**Required Package Structure Tests:**
- **Export Path Validation**: Verify all package.json exports point to existing files in dist/ directory
- **Source File Prohibition**: Ensure no exports point directly to .ts source files  
- **Build Artifact Verification**: Confirm all declared export paths exist and are accessible
- **Type Declaration Validation**: Verify .d.ts files exist for all TypeScript exports

**Implementation Example:**
```typescript
// tests/package-structure.test.ts (MANDATORY for all packages)
import { describe, test, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';

describe('Package Structure Validation', () => {
  test('package.json exports are valid', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
    const exports = packageJson.exports;
    
    expect(exports).toBeDefined();
    
    for (const [exportPath, exportValue] of Object.entries(exports)) {
      if (typeof exportValue === 'string') {
        expect(exportValue).toMatch(/^\.\/dist\//);
        expect(exportValue).not.toMatch(/\.ts$/);
        expect(existsSync(exportValue.slice(2))).toBe(true);
      } else {
        for (const [key, path] of Object.entries(exportValue as Record<string, string>)) {
          expect(path).toMatch(/^\.\/dist\//);
          expect(path).not.toMatch(/\.ts$/);
          expect(existsSync(path.slice(2))).toBe(true);
        }
      }
    }
  });
});
```

**Why Package Structure Tests Are Mandatory:**
- **Build Validation**: Ensures compilation produces expected artifacts
- **Consumer Protection**: Prevents publishing packages with broken export paths
- **Development Feedback**: Catches export misconfigurations during development
- **CI Integration**: Automated validation prevents broken releases
- **Documentation**: Tests serve as specification for package structure

**🚫 PROHIBITED: Manual package structure verification**
```bash
# ❌ NEVER do manual package.json inspection
node -e "console.log(JSON.stringify(require('./package.json').exports, null, 2))"

# ❌ NEVER do manual file existence checks  
ls -la dist/ && echo "Files exist"

# ✅ ALWAYS use formal Vitest tests for package validation
npm test  # Runs comprehensive test suite including package structure validation
```

### **Dependency Constraint Testing**

When packages have version alignment requirements or dependency constraints:
- **Version alignment tests**: Write tests that verify peer dependencies have matching versions when required
- **Dependency availability tests**: Test that required dependencies are present and accessible
- **Integration tests**: Verify that dependency constraints work in practice (e.g., coverage providers load correctly)
- **Fail-fast validation**: Tests should fail immediately if constraint violations are detected
- **CI-enforced constraints**: Use automated testing to enforce dependency policies, not manual verification

### **Testing Tool Configuration**

**ALL packages MUST use standardized testing configurations from `@voder/dev-config` or `@voder/ui-tools`:**

**Configuration Requirements:**
- **Node.js packages**: MUST use Vitest configurations from `@voder/dev-config/testing`
- **UI packages**: MUST use Vitest configurations from `@voder/ui-tools/testing` 
- **No custom test configs**: MUST NOT create package-specific Vitest configurations without ADR justification
- **Standardized scripts**: MUST use standard test script names and patterns

**Required Vitest Configuration Pattern:**
```javascript
// vitest.config.ts - MANDATORY for all packages
import { createVitestNodeConfig } from '@voder/dev-config/testing';
// OR for UI packages:
// import { createVitestJsdomConfig } from '@voder/ui-tools/testing';

export default createVitestNodeConfig({
  // Package-specific overrides only if justified in ADR
});
```

**Package Test Scripts:**
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ci": "vitest run --coverage --reporter=verbose"
  },
  "devDependencies": {
    "@voder/dev-config": "workspace:*"
  },
  "peerDependencies": {
    "vitest": "^2.0.0"
  }
}
```

### **Test Organization Standards**
- **Unit tests**: Test individual functions/classes in isolation
- **Integration tests**: Test component interactions and package export resolution
- **Smoke tests**: Basic functionality verification without deep inspection  
- **Export equivalence tests**: Verify dual export strategies provide identical functionality
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

All packages MUST use standardized configurations from `@voder/dev-config` and pass all quality checks:

**Configuration Source Requirements:**
- **Prettier Configuration**: MUST use Prettier configuration exported by `@voder/dev-config`
- **ESLint Configuration**: MUST use ESLint configurations (base, dx, performance) from `@voder/dev-config`
- **TypeScript Configuration**: MUST extend TypeScript configurations from `@voder/dev-config`
- **Testing Configuration**: MUST use Vitest configurations from `@voder/dev-config` (or `@voder/ui-tools` for UI packages)
- **No Custom Configs**: MUST NOT create package-specific formatting or linting configurations without ADR justification

**Code Formatting Standards:**
- **Prettier Integration**: All packages MUST use Prettier for consistent code formatting via dev-config
- **No Formatting Errors**: NEVER commit code with formatting inconsistencies
- **Auto-Format on Save**: Configure editors to auto-format code on save
- **Pre-commit Formatting**: Code MUST be formatted before committing

**Linting Standards:**
- **ESLint Configuration (v9 Flat Config)**: All packages MUST use ESLint 9 flat config via `eslint.config.js` importing from dev-config
- **No Linting Errors**: NEVER commit code with ESLint errors
- **Linting Warnings**: Address linting warnings promptly, don't let them accumulate
- **Custom Rules**: Package-specific overrides must be documented and justified in ADRs

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

**Package Scripts for Code Quality:**
```json
{
  "scripts": {
    "lint": "eslint . --fix",
    "lint:check": "eslint .",
    "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md",
    "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit"
  },
  "devDependencies": {
    "@voder/dev-config": "workspace:*"
  },
  "peerDependencies": {
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "markdownlint-cli2": "^0.13.0"
  }
}
```

**Required Configuration Files:**
```javascript
// eslint.config.js - MANDATORY for all packages
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  ...base,
  ...dx,
  ...performance
];
```

```javascript
// prettier.config.js - MANDATORY for all packages  
import config from '@voder/dev-config/prettier';
export default config;
```

```json
// tsconfig.json - MANDATORY for all packages
{
  "extends": "@voder/dev-config/typescript/base",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

**Why consistent formatting and linting matter:**
- **Code Review Efficiency**: Consistent style reduces cognitive load during reviews
- **Merge Conflicts**: Consistent formatting minimizes formatting-related conflicts
- **Developer Experience**: Predictable code style improves readability
- **Quality Assurance**: Linting catches potential bugs and maintains standards
- **LLM Comprehension**: Consistent patterns help AI agents understand and maintain code

**Formatting Strategy:**
- **Centralized Configuration**: Single Prettier configuration exported by `@voder/dev-config` for all packages
- **ESLint Integration**: ESLint focuses on semantic & correctness rules; stylistic conflicts disabled via `eslint-config-prettier` in dev-config
- **No Local Overrides**: Packages MUST NOT override formatting rules without ADR justification

**ESLint Layer Policy (Flat Config):**
- **Required Layers**: All packages MUST import and use base, dx (mandatory), performance layers from dev-config
- **Layer Order**: Compose layers in flat config in the documented order so later layers can refine earlier ones
- **No Custom Layers**: Packages MUST NOT create custom ESLint layers without ADR justification

**ESLint consumer config example (eslint.config.js, consuming flat layers):**
```js
// eslint.config.js (ESM) - MANDATORY pattern for all packages
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  ...base,
  ...dx,
  ...performance
];
```

> **Note**: ESLint 9 walks up to the nearest `eslint.config.js`. Every package MUST commit a package-local `eslint.config.js` importing from dev-config to prevent picking up parent configurations.

> Note: ESLint 9 walks up to the nearest `eslint.config.js`. Commit a package-local `eslint.config.js` to prevent picking up a parent config.

---

### **Decision Governance Policy (MADR)**

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

- **Format and template**
  - Use MADR format. Start from the template at `prompt-assets/adr-template.md`.
  - Keep titles skimmable and imperative, e.g., "Use MongoDB for event storage" (not "Use MongoDB" or "Which database…").

**ADR Title Guidelines:**

Effective ADR titles are **imperative statements** that clearly communicate the decision and its scope. They should be scannable in file listings and immediately convey what was decided.

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

**Title Structure Patterns:**

1. **Tool Selection**: `Use [Tool] for [Purpose]`
   - ✅ `Use Vitest for testing framework`
   - ✅ `Use Prettier for code formatting`

2. **Configuration Choice**: `Adopt [Config Type] for [Scope]`
   - ✅ `Adopt flat config for ESLint v9`
   - ✅ `Adopt TypeScript format for Prettier config`

3. **Policy Decision**: `Require [Constraint] for [Context]`
   - ✅ `Require peer dependencies for consumer packages`
   - ✅ `Require exact versions for test coverage tools`

4. **Architecture Decision**: `[Action] [Component] as [Pattern]`
   - ✅ `Export configurations as ESM modules`
   - ✅ `Structure layers as composable arrays`

**Context Guidelines:**
- **Be specific about scope**: Include package names, tool versions, or contexts when relevant
- **Avoid jargon**: Use terms that will be clear to future maintainers
- **Include the "why" when it clarifies**: `Use exact versions for peer dependency alignment` vs just `Use exact versions`
- **Keep under 60 characters**: Titles should fit comfortably in file listings and commit messages
- **Location and naming**
  - Place local decisions in `docs/decisions/` within the package.
  - Use zero‑padded incremental numbering with a concise kebab‑case slug, e.g., `0003-use-mongodb-for-event-storage.md`.
- **Required front‑matter**
  - `status:` Proposed | Accepted | Rejected | Superseded
  - `date:` ISO date
  - `deciders:` names/roles (for documentation only, not approval)
  - `packages:` scope of applicability (when shared)
  - Optional: `supersedes:` / `superseded-by:` links
- **Lifecycle**
  1) Draft as `Accepted` with Context, Options (pros/cons), Decision, Consequences, and References.
  2) Implement immediately (ADRs document decisions, not pending approvals).
  3) If direction changes later, author a new ADR that marks the prior as `Superseded`.
- **Dependency gate (mandatory)**
  - Every **new direct dependency** requires an ADR for documentation. You MAY install locally to experiment, but SHOULD create an ADR when committing `package.json`/lockfile changes. Bundle the ADR with the dependency change for documentation completeness.
  - **Package changes** that alter the fundamental tool or approach (e.g., `markdownlint-cli` → `markdownlint-cli2`, `jest` → `vitest`, `webpack` → `vite`) require an ADR documenting the migration rationale.
  - **Version updates** of existing packages (e.g., `eslint@8.x` → `eslint@9.x`, `typescript@5.1` → `typescript@5.2`) do NOT require ADRs unless they introduce breaking changes that affect package functionality or consumer experience.
  - **No blocking**: Dependency changes and ADR creation should happen together but neither should block the other. If urgent dependency changes are needed, commit them and create the ADR afterward.
- **Version specification policy**
  - **Default approach**: Use semantic version ranges (e.g., `^3.2.4`, `~3.2.4`) to automatically receive compatible updates
  - **Exact versions**: Only specify exact versions (e.g., `3.2.4`) when technical constraints require it:
    - **Peer dependency alignment**: When packages must have matching versions due to peer dependency requirements
    - **API compatibility**: When packages have tight coupling that breaks with version mismatches
    - **Temporary pinning**: Short-term exact versions to resolve specific compatibility issues (must include plan to return to ranges)
  - **ADR version documentation**: When using exact versions, ADRs must explain:
    - Why exact versions are required (peer dependencies, API coupling, etc.)
    - What the version alignment constraint is (e.g., "must match vitest version")
    - Strategy for staying current (e.g., "upgrade both packages together when updating")
  - **Staying current**: Prefer the most recent stable versions and update regularly; exact versions should not prevent keeping dependencies current
- **Dependency verification policy**
  - **Automated testing over manual reports**: Version alignment constraints and dependency requirements MUST be verified through automated tests, not manual documentation
  - **Test-driven verification**: Write tests that fail if dependency constraints are violated (e.g., version mismatches, missing peer dependencies)
  - **CI enforcement**: Dependency constraints should be checked in CI pipelines, not through human-reviewed reports
  - **Self-documenting code**: Tests serve as living documentation of dependency requirements; avoid separate manifest files that can become stale
- **Dependency classification ADR (mandatory)**
  - Each package MUST have ADR(s) documenting what types of dependencies go in each section (`dependencies`, `devDependencies`, `peerDependencies`). This MUST cover the conceptual criteria for classification (e.g., "runtime requirements vs build tools vs consumer requirements").
  - The ADR MUST explain the package's specific dependency strategy and provide examples of which tools belong in each category.
  - Update the classification ADR when the dependency strategy changes or new dependency types are introduced.
- **Technical pivots**
  - When an approach proves a dead end, write an ADR documenting what was tried, evidence of failure, and the new direction. This prevents repeating failed paths.
- **Adherence and deviations**
  - Decisions are normative. If you must deviate, create a new ADR that explains the exception and its scope.
- **Skimmability**
  - Keep titles and summaries concise. The title should communicate the decision and its target at a glance.

---

### **Implementation Hints & Standards**

**ESLint Configuration:**
- Use ESLint 9 flat config (`eslint.config.js`).
- Prefer native flat exports when provided by packages; until then, use `FlatCompat` to consume classic shareable configs.
- Extend recommended configs from `@eslint/js` and disable stylistic conflicts with `eslint-config-prettier`.

**Development Priorities:**
- **WORKING CODE THAT MEETS THE SPECIFICATION IS FAR MORE IMPORTANT THAN LINTING**
- **DELIVERY AND ITERATION ARE MORE IMPORTANT THAN PROCESS COMPLIANCE**
- **AUTOMATED VALIDATION IS MORE IMPORTANT THAN MANUAL REVIEW**
- **DOCUMENTATION FOLLOWS DECISIONS, NEVER BLOCKS THEM**
- **COMPLETE WORK IN ISOLATION - NO EXTERNAL HELP IS COMING**

**🚨 CRITICAL: No Reviewers, No Pull Requests, No Approval Process**

LLM agents work in **complete isolation** with **zero external dependencies**:

- **❌ NO REVIEWERS**: There are no human reviewers. Do not wait for review or approval.
- **❌ NO PULL REQUESTS**: Work directly on the main branch. No PR process exists.
- **❌ NO APPROVAL GATES**: No one else is coming to approve, validate, or authorize your work.
- **❌ NO REPORTS OR DOCUMENTS FOR OTHERS**: Do not create review documents, status reports, or waiting mechanisms.
- **✅ WORK TO COMPLETION**: Implement, test, document, commit, and push immediately when ready.
- **✅ SELF-VALIDATION**: Use automated tests, linting, and builds for validation - not humans.
- **✅ DIRECT COMMITS**: Commit directly to main when work is complete and validated.

**Complete Isolation Workflow:**
1. **Implement** the feature or fix completely
2. **Test** thoroughly with automated tests
3. **Validate** with linting, type checking, and builds
4. **Document** any decisions in ADRs if needed
5. **Commit** directly to main branch
6. **Push** immediately - work is complete

**Anti-Patterns to Avoid:**
- Waiting for reviews or approvals that don't exist
- Creating process gates that slow development
- Prioritizing documentation completeness over working software
- Manual verification when automated testing is available
- Creating reports or documents for non-existent reviewers
- Assuming someone else will validate your work

### **Documentation Requirements**

**🚨 CRITICAL REQUIREMENT - README ISOLATION**

README.md files are PUBLIC-FACING and MUST be self-contained; only reference published content (no internal repo paths).

- **❌ NEVER reference internal files**: No links to `prompts/`, `docs/`, `decisions/`, or any internal documentation
- **❌ NEVER reference development structure**: Users cannot see workspace-internal files
- **❌ NEVER use relative paths**: No `./prompts/guidelines.md` or `../docs/api.md` references
- **✅ ONLY reference published content**: Package exports, npm packages, external URLs

**WHY**: README.md appears on npm, GitHub, and package registries where internal project files don't exist. Any internal references will be broken links for users.

**README Template:**
Use the comprehensive README template at `prompt-assets/README-template.md` which includes all required sections:
- Purpose, compatibility, and installation instructions
- Quick start and usage examples
- Configuration matrix and API reference
- Migration guides and troubleshooting
- Versioning policy and security posture
- Contributing guidelines and development setup
- Proper proprietary licensing notice

The template provides a complete structure with placeholder content that should be customized for each package's specific functionality and requirements.

**CHANGELOG Template:**
Use the comprehensive CHANGELOG template at `prompt-assets/CHANGELOG-template.md` which follows Keep a Changelog format:
- Semantic versioning with clear version categories (Added, Changed, Deprecated, Removed, Fixed, Security)
- Breaking change documentation with migration guidance
- Consumer-focused release notes with upgrade instructions
- Template guidelines for consistent changelog maintenance
- Examples of good vs. poor changelog entries

Maintain the CHANGELOG.md in the package root to document all notable changes, version releases, and provide migration guidance for consumers.

### Licensing Policy (Proprietary)

All packages are proprietary (not open-source). Set the package license field and README accordingly.

- package.json MUST set the license field to the literal string `UNLICENSED`.
- README MUST include a clear proprietary notice and lack of granted rights.

Examples:

```jsonc
// package.json
{
  "name": "@voder/example",
  "version": "1.0.0",
  "license": "UNLICENSED"
}
```

```markdown
## License

This software is proprietary and not open-source. No license is granted to use, copy, modify, distribute, or sublicense except as explicitly agreed in writing by the owners. All rights reserved.
```

### Security Posture

Each README MUST include a short security posture section:
- Scope and boundaries: what the package does NOT do (e.g., no runtime/network access, no telemetry).
- Data handling: what inputs are processed and how sensitive data should be treated.
- Threat model assumptions: trusted/untrusted inputs, expected environment.
- Update policy: how security updates are delivered (e.g., patch releases, changelog notes).

---

### Lean Development Practices (Flow over Inventory)

**🎯 Solo Development Model**

This is a **single-agent development environment** with no collaboration infrastructure:

- **No team coordination**: You are the only developer
- **No code review process**: No one else will review your code
- **No approval workflows**: No one else will approve your changes
- **No project management**: No one else is tracking your progress
- **No external validation**: Automated tools are your only validation

**Expected Development Flow:**
1. **Read requirements** from documentation and specifications
2. **Implement solution** completely and thoroughly
3. **Test extensively** using automated test suites
4. **Validate quality** with linting, type checking, and builds
5. **Commit and push** directly to main branch when ready
6. **Move to next task** - no waiting, no handoffs

**Commit and Push Strategy:**
- Commit small, coherent changes frequently; push early and often to a shared remote.
- Deliver vertical slices that provide immediate value to package consumers
- Optimize for cycle time to minimize cost of delay. Ship safe, incremental improvements; use pre‑releases when appropriate.
- Run local checks (lint, type‑check, tests) before pushing to keep the main branch green.
- If progress stalls, reduce batch size, slice scope thinner, or author a pivot ADR documenting the change in approach.
- **NO PULL REQUESTS**: Push directly to main branch after validation
- **NO APPROVAL GATES**: Your automated tests and builds are the approval process

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

```bash
# ❌ FORBIDDEN: Creating files in repository
echo "debug info" > ./debug.log
mkdir ./diagnostics
touch ./output.txt
npm run build # if this outputs to uncomitted directories

# ❌ FORBIDDEN: Any file creation without .gitignore coverage
fs.writeFileSync('./temp-data.json', data);
console.log("Writing to ./logs/debug.log");
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

```bash
# ✅ CORRECT: Use OS temp directory for any file output
TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/voder-$(date +%Y%m%d-%H%M%S)-$$-XXXXXX")"
echo "debug info" > "$TEMP_DIR/debug.log"
echo "Diagnostics saved to: $TEMP_DIR" >&2

# ✅ CORRECT: Console output preferred
echo "Debug info: $data" >&2

# ✅ CORRECT: Check .gitignore coverage before file creation
if ! grep -q "^dist/" .gitignore; then
  echo "ERROR: dist/ not in .gitignore, cannot create build output" >&2
  exit 1
fi
```

---

## 🎊 **Remember: Solo LLM Development**

This architecture is optimized for **single AI developers working in complete isolation**. Every pattern is:
- **🔍 Explicit**: No implicit behavior or hidden dependencies
- **🎯 Predictable**: Same patterns across all packages
- **📖 Documented**: Every decision explained in context
- **🧪 Testable**: Clear success/failure criteria
- **♿ Accessible**: Built-in compliance, not retrofitted
- **🤖 Self-Contained**: No external dependencies on humans or review processes

**🚨 CRITICAL REMINDERS:**
- **You are the only developer** - no one else is involved
- **No approval processes exist** - your tests and builds are the approval
- **Work to completion** - implement, test, validate, commit, push
- **Don't wait for anyone** - there is no one else coming to help

**When in doubt, choose the more explicit, documented, and testable approach that can be validated automatically.**

---
