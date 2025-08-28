# API Reference

## testing

- `createVitestNodeConfig(): Record<string, unknown>`  
  Returns a Vitest configuration object for Node.js tests.
- `testSetup.node: string`  
  Path to the Node test-setup file (`"./src/test-setup.node.ts"`).

## eslint

- `base: Linter.Config[]`  
  Flat-config layer of core ESLint rules.
- `dx: Linter.Config[]`  
  Developer-experience rules (autofix, import sorting, padding).
- `performance: Linter.Config[]`  
  Performance-focused rules (placeholder, permissive).
- `complete: Linter.Config[]`  
  Aggregates `js.configs.recommended`, `base`, `dx`, and `performance`; applies test & script globals; and enforces standard ignore patterns internally—no manual overrides required.

## prettier

- **default export**: `Config`  
  Prettier configuration object with properties:
  - `printWidth: number`
  - `semi: boolean`
  - `singleQuote: boolean`
  - `trailingComma: string`
  - `arrowParens: string`
  - `bracketSpacing: boolean`
  - `endOfLine: string`
  - `overrides: { files: string; options: Partial<Config> }[]`

## typescript

- `base: object`  
  Core TS compiler options (ES2022, NodeNext, strict).
- `node: object`  
  TS options for Node.js tools (`types: ["node"]`).
- `library: object`  
  TS options for libraries (`declaration`, `composite`, `outDir`).
- `test: object`  
  TS options for tests (`types: ["vitest/globals","node"], isolatedModules`).
- `tsconfigEslint: object`  
  JSON config for ESLint file linting (`types: ["node","vitest/globals"], isolatedModules:false`).
- `tsconfigConfig: object`  
  JSON config for TS config files (`types: ["node"], isolatedModules:false`).

## markdown

- `getConfig(overrides?: Record<string, unknown>): Record<string, unknown>`  
  Returns the base markdownlint-cli2 ruleset merged with any overrides.
- `createCLICommand(opts?: { configPath?: string; fix?: boolean }): string`  
  Returns a shell command string to run markdownlint-cli2 over `README.md` and `docs/**/*.md`.

### markdown

```ts
import {
  getConfig,
  createCLICommand,
} from '@voder/dev-config/linters/markdown';

// Programmatic config
const rules = getConfig({ MD005: false });
console.log(rules.MD005);

// CLI invocation string
const lintCmd = createCLICommand({
  configPath: '.markdownlint.json',
  fix: true,
});
console.log(lintCmd);
```
