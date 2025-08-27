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

```javascript
// eslint.config.js - Target implementation (1-2 lines)
export { complete as default } from '@voder/dev-config/eslint';

// Alternative syntax
import { complete } from '@voder/dev-config/eslint';
export default complete;
```

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
- Invalid project structure  
- Dependency conflicts or missing dependencies

### Validation

The complete config should validate:
- Required directory structure exists (`src/`, `package.json`, etc.)
- TypeScript configuration files are present and valid
- Dev-config dependencies are properly installed

## Testing Requirements

Dev-config must include tests that verify:

1. **Complete config exports correctly**
2. **All source, test, and config files are linted**
3. **No consumer configuration is required**
4. **Integration with real TypeScript projects works**

## Documentation Requirements

### Setup Documentation

Clear guide showing:
1. How to install dev-config
2. How to create required TypeScript configuration files using dev-config exports
3. Single-line ESLint setup
4. How to validate that all files are being linted correctly

### TypeScript Configuration Templates

Dev-config must provide the exact content for required TypeScript configurations:
- Template/export for `tsconfig.eslint.json` 
- Template/export for `tsconfig.config.json`
- Clear instructions for creating these files in consumer projects
- Validation commands to verify setup is correct
