---
status: accepted
date: 2025-08-28
decision-makers: Tom Howard
---

# TypeScript Build Configuration Path Constraints

## Context and Problem Statement

When creating shared TypeScript configurations, we discovered that path-based settings (`outDir`, `rootDir`, `include`, `exclude`) cannot be effectively shared when the shared configuration files are located in subdirectories (e.g., `typescript/build.json`). This is due to TypeScript's extends resolution mechanism, where paths resolve relative to the location of the configuration file being extended.

## Decision Drivers

- TypeScript extends mechanism resolves paths relative to the config file location
- Shared configs in `typescript/` subdirectory cause `outDir: "dist"` to resolve to `typescript/dist/` instead of package root `dist/`
- Consumer packages need consistent output directories at their package root
- Shared configurations should eliminate duplication while working correctly
- Path-based settings are inherently package-relative and cannot be abstracted

## Considered Options

- Move shared configs to package root (breaks organization and export structure)
- Use relative paths like `"outDir": "../dist"` in shared configs (fragile and non-portable)
- Accept that path-based settings must be specified in each package's config
- Create complex tooling to rewrite paths during config resolution

## Decision Outcome

Chosen option: "Accept that path-based settings must be specified in each package's config", because it acknowledges the inherent constraints of TypeScript's configuration system while still allowing shared compiler options.

### Consequences

- Good, because it works reliably with TypeScript's extends mechanism
- Good, because shared configs can focus on compiler options that are truly shareable
- Good, because each package has explicit control over its build paths and inclusion patterns
- Good, because the architecture is transparent and debuggable
- Bad, because packages must repeat path-based configuration
- Bad, because it's more verbose than initially hoped

## Implementation Guidelines

**Shared Configuration (`typescript/build.json`):**

- Contains only compiler options that are universal (declaration, sourceMap, etc.)
- Does NOT contain path-based settings (outDir, rootDir, include, exclude)

**Package Configuration (`tsconfig.build.json`):**

- Extends the shared config for compiler options
- Specifies all path-based settings relative to the package root
- Must include all source directories in the `include` array
- Must properly exclude test files and build artifacts

**Standard Package Pattern:**

```jsonc
{
  "extends": "@voder/dev-config/typescript/build.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": ".",
  },
  "include": ["src", "scripts"],
  "exclude": ["**/*.test.ts", "**/*.test.js", "node_modules", "dist"],
}
```

This decision ensures reliable builds while accepting the limitations of TypeScript's configuration inheritance model.
