# Developer Guide

## Overview

This guide provides technical guidance for developers working on the voder.ai website project, including best practices, tooling instructions, and common patterns.

## Development Commands

### Server Management

**Important**: When starting development servers, use the appropriate method based on your tooling context:

#### For AI/Automation Tools

- **❌ INCORRECT**: `run_command with args: {"command":"npm","args":["run","preview"],"timeout":120000}`
  - This will hang because `npm run preview` starts a long-running server that doesn't exit
  - The command will wait for the server to terminate, which it never does
- **✅ CORRECT**: Use `start_server` tool or run with background flag
  - Allows the server to run continuously while returning control

#### For Manual Development

- `npm run dev` - Start development server with hot reload
- `npm run preview` - Start production preview server
- `npm run build` - Build for production

### Quality Gates

All code changes must pass these verification steps:

```bash
npm run verify
```

This runs the complete pipeline:

1. `npm run audit:fix` - Security audit and fixes
2. `npm run lint:fix` - Auto-fix linting issues
3. `npm run lint:check` - Verify no remaining lint errors
4. `npm run format:check` - Verify code formatting
5. `npm run build` - Production build
6. `npm run test:ci` - Tests with coverage

### Pre-commit Hooks

The repository uses pre-commit hooks that run:

- `npm run format:check`
- `npm run lint:check`
- `npm run type-check`

These are check-only commands that will prevent commits if quality gates fail.

## Testing Guidelines

### Coverage Requirements

- Minimum 90% coverage across all metrics (statements, branches, functions, lines)
- Configuration files are excluded from coverage (see `vitest.config.ts`)
- Focus coverage on application source under `src/`

### Test Structure

```
tests/
├── setup.ts              # Global test setup
├── *.test.ts             # Unit tests
└── coverage-increase.ts  # Coverage-focused tests
```

### Writing Tests

- Use Vitest with jsdom environment
- Import paths must use `.js` extensions (ESM requirement)
- Mock external dependencies appropriately
- Avoid writing files to the repository during tests

Example:

```typescript
import { describe, expect, it } from 'vitest';
import { init } from '../src/app.js'; // Note .js extension

describe('app functionality', () => {
  it('should initialize correctly', () => {
    // Test implementation
  });
});
```

## Configuration Management

### File Exclusions

Configuration files are automatically excluded from test coverage:

- `config/**` - All configuration code
- `**/*.config.{js,ts}` - Configuration files
- `tests/setup.ts` - Test setup files
- `**/.github/**` - GitHub workflows and scripts
- `**/scripts/**` - Build/automation scripts

### TypeScript Configuration

- Uses Node16 module resolution
- Requires explicit `.js` extensions for relative imports
- Strict type checking enabled

## Architecture Decisions

Key architectural decisions are documented as ADRs in `docs/decisions/` following MADR 4.0 format.

Important decisions:

- [ADR-0024: DORA-style trunk-based development](../docs/decisions/0024-adopt-dora-style-trunk-based-development.accepted.md)
- [ADR-0012: Standard development tools as devDependencies](../docs/decisions/0012-use-standard-development-tools-as-devdependencies.accepted.md)

## Common Issues and Solutions

### TypeScript Import Errors

**Error**: `Relative import paths need explicit file extensions`
**Solution**: Add `.js` extension to TypeScript imports:

```typescript
// ❌ Incorrect
import { init } from '../src/app';

// ✅ Correct
import { init } from '../src/app.js';
```

### Mock Implementation Type Errors

**Error**: Mock function type conflicts
**Solution**: Use type assertion:

```typescript
// ❌ Incorrect
mockFn.mockImplementation((param: string) => { ... });

// ✅ Correct
(mockFn as any).mockImplementation((param: string) => { ... });
```

### Server Command Hanging

**Error**: Automation tools hanging on server commands
**Solution**: Use appropriate server management:

- For automation: Use `start_server` tool or background execution
- For manual: Standard `npm run dev`/`npm run preview`

## Workflow Guidelines

### Branch Strategy

- Use trunk-based development on `main` branch
- Keep feature branches short-lived (<2 days)
- All changes go through automated verification

### Commit Standards

- Use conventional commit format
- Sign commits when possible
- Pre-commit hooks enforce quality gates

### Release Process

1. Ensure `npm run verify` passes
2. Update version in `package.json`
3. Create release tag
4. Deploy through CI/CD pipeline

## Additional Resources

- [README.md](../README.md) - Project overview and setup
- [docs/decisions/](../docs/decisions/) - Architecture decisions
- [.github/instructions/](../.github/instructions/) - Coding standards
