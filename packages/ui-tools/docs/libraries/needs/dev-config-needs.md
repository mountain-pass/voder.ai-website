# Dev-Config Complete ESLint Configuration Requirements

## Required Export: Complete ESLint Configuration

Dev-config must export a complete, ready-to-use ESLint flat config that eliminates the need for manual configuration composition.

### Export API Specification

```javascript
// @voder/dev-config/eslint/complete.js
export const complete = [
  // All ESLint configuration handled internally
];

// Also available as default export for convenience
export default complete;
```

### Consumer Usage Target

```typescript
// eslint.config.ts - Target implementation (simple with necessary overrides)
import { complete } from '@voder/dev-config/eslint';

export default [
  ...complete,
  {
    files: ['**/*.test.{js,ts}', 'src/testing/**/*.{js,ts}', 'tests/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        expect: 'readonly',
        describe: 'readonly', 
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        test: 'readonly',
        // DOM globals for jsdom tests
        document: 'readonly',
        window: 'readonly',
        global: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        requestAnimationFrame: 'readonly'
      }
    }
  },
  {
    files: ['scripts/**/*.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly'
      }
    }
  }
];
```

**Note**: While the ideal target is a 1-line configuration, practical ESLint configurations require environment-specific globals for different file types. The above represents the simplest realistic configuration that properly handles all environments.

## Core Requirement: Universal File Linting

The complete ESLint configuration MUST lint all relevant files in a TypeScript project:

### Required File Coverage

**✅ All of these file types MUST be linted:**
- **Source files**: `src/**/*.{js,ts}`
- **Test files**: `tests/**/*.{js,ts}`, `**/*.test.{js,ts}`, `**/*.spec.{js,ts}`
- **Configuration files**: `*.config.{js,ts}`, `vite.config.{js,ts}`, `vitest.config.{js,ts}`, `prettier.config.{js,ts}`, `eslint.config.{js,cjs}`, `.eslintrc.*`
- **Script files**: `scripts/**/*.{js,ts}`

### Implementation Requirements

**✅ Must handle automatically without consumer configuration:**
- Proper TypeScript parsing for all `.ts` files
- Appropriate rule sets for different file types (source vs config vs test)
- Standard ignore patterns for build outputs and dependencies
- Integration with existing dev-config rule layers (base, dx, performance)

**✅ Environment-specific globals that consumers must add:**
- **Vitest test globals**: `expect`, `describe`, `it`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, `vi`, `test`
- **DOM globals for jsdom**: `document`, `window`, `global`, `setTimeout`, `requestAnimationFrame`
- **Node.js script globals**: `console`, `process` for script files
- **Test environment globals**: `console`, `process` for test files

**Rationale**: Different file types require different runtime environments. While the complete config handles parsing and rules, environment-specific globals must be specified per file pattern to avoid false `no-undef` errors.

**✅ Must work with standard ESLint flat config scripts:**
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix", 
    "lint:check": "eslint . --max-warnings 0"
  }
}
```

## Setup Requirements

### Required Dependencies

The complete ESLint configuration requires these dependencies to be installed by consumers:

**Required for TypeScript config loading:**
- `jiti` - Required for ESLint to load TypeScript configuration files
- Installation: `npm install --save-dev jiti`

### Required TypeScript Configuration Files

The complete config requires these TypeScript configuration files for proper parsing:

**tsconfig.eslint.json** - For source/test file linting
**tsconfig.config.json** - For configuration file linting (TypeScript config files need separate parsing)

### Dev-Config Must Export TypeScript Configurations

Since linting TypeScript configuration files requires dedicated TypeScript configurations, dev-config must provide these:

```javascript
// @voder/dev-config/typescript/eslint.json
// @voder/dev-config/typescript/config.json
```

**Export requirements:**
- Export ready-to-use `tsconfig.eslint.json` content for source/test linting
- Export ready-to-use `tsconfig.config.json` content for config file linting
- Provide setup instructions showing how to create these files in consumer projects
- Include validation that checks these files exist and are properly configured

## Error Handling Requirements

### Clear Error Messages

When setup is incomplete, provide actionable error messages:
- Missing required TypeScript configuration files
- Missing required dependencies (especially `jiti`)
- Invalid project structure  
- Dependency conflicts or missing dependencies

### Validation

The complete config should validate:
- Required directory structure exists (`src/`, `package.json`, etc.)
- TypeScript configuration files are present and valid
- Dev-config dependencies are properly installed
- `jiti` dependency is installed for TypeScript config loading

## Testing Requirements

Dev-config must include tests that verify:

1. **Complete config exports correctly**
2. **All source, test, and config files are linted**
3. **Minimal consumer configuration works with necessary environment overrides**
4. **Integration with real TypeScript projects works**
5. **Required dependencies (jiti) are properly documented**
6. **Environment-specific globals are properly handled in consumer configurations**

## Documentation Requirements

### Setup Documentation

Clear guide showing:
1. How to install dev-config
2. How to install required dependencies (including `jiti` for TypeScript config loading)
3. How to create required TypeScript configuration files using dev-config exports
4. Minimal ESLint setup with necessary environment-specific overrides
5. How to validate that all files are being linted correctly

### Required Dependencies Documentation

Dev-config documentation must clearly specify:
- **jiti** is required for ESLint to load TypeScript configuration files
- Installation command: `npm install --save-dev jiti`
- This dependency is needed even though Node.js ≥ 22.6.0 has native TypeScript config loading, because ESLint requires jiti specifically

### Environment-Specific Configuration Documentation

Dev-config documentation must provide:
- Complete examples showing necessary globals for test files
- Complete examples showing necessary globals for script files  
- Explanation of why environment-specific overrides are required
- Template configurations for common project patterns

### TypeScript Configuration Templates

Dev-config must provide the exact content for required TypeScript configurations:
- Template/export for `tsconfig.eslint.json` 
- Template/export for `tsconfig.config.json`
- Clear instructions for creating these files in consumer projects
- Validation commands to verify setup is correct
