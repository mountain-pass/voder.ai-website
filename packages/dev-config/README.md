# @voder/dev-config

> Shareable development configuration presets for TypeScript, ESLint, Prettier, Vitest, and Markdown linting.

## ⚡ Quick Start

```bash
npm install --save-dev @voder/dev-config
```

```typescript
// Example: Vitest config
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

## 🎯 Purpose

`@voder/dev-config` centralizes best-practice configurations for developer tools.  
It exports:

- **TypeScript** presets (`library`, `node`, `base`, `test`)
- **ESLint** flat-config layers (`base`, `dx`, `performance`)
- **Prettier** formatting defaults
- **Vitest** test setups for Node
- **Markdown** linting rules and CLI helpers

## 🔧 Compatibility & Requirements

- **Node.js:** ≥ 22.6.0 (for native TypeScript config loading)

**Required ESLint TS Config Loader**

ESLint needs `jiti` to load TypeScript configuration files.  
Install it in your project as a dev dependency:

```bash
npm install --save-dev jiti
```
- **TypeScript:** ≥ 5.0 (peer dependency)
- **ESM-only**: `"type": "module"` in consumer projects
- **Peer dependencies:**
  - `typescript` `^5.0.0`
  - `eslint` `^9.0.0`
  - `@typescript-eslint/parser` `^8.0.0`
  - `@typescript-eslint/eslint-plugin` `^8.0.0`
  - `eslint-config-prettier` `^10.0.0`
  - `eslint-plugin-import` `^2.30.0`
  - `eslint-plugin-simple-import-sort` `^12.0.0`
  - `eslint-plugin-unicorn` `^60.0.0`
  - `markdownlint-cli2` `^0.18.1`
  - `prettier` `^3.0.0`
  - `vitest` `^3.2.0`
  - `@vitest/coverage-v8` `^3.2.0`

## 📦 Installation

```bash
# npm
npm install --save-dev @voder/dev-config

# pnpm
pnpm add -D @voder/dev-config

# yarn
yarn add -D @voder/dev-config
```

## 🚀 Usage

## Consumer Integration Guide

Use the examples below to integrate `@voder/dev-config` into your project for TypeScript, ESLint, Vitest, and Markdown linting.

### TypeScript Presets Usage

```jsonc
// tsconfig.json
{
  "extends": "@voder/dev-config/typescript/library.json",
  "compilerOptions": { "outDir": "dist" },
}
```

## TypeScript JSON Config Exports

You can extend your project’s tsconfig.json directly from this package:

```jsonc
// tsconfig.json
{
  "extends": "@voder/dev-config/typescript/tsconfig.eslint.json",
  // ...your overrides
}
```

```jsonc
// tsconfig.json (for config files)
{
  "extends": "@voder/dev-config/typescript/tsconfig.config.json",
  // ...your overrides
}
```

### ESLint Flat Config Usage

```js
// eslint.config.js
export { complete as default } from '@voder/dev-config/eslint';
```

> **Note:** The `complete` export automatically includes environment-specific globals for test files (Vitest & DOM) and script files (Node).

```js
// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  prettier,
  { ignores: ['dist/', 'node_modules/', 'coverage/'] },
];
```

### Prettier Usage

```js
// prettier.config.js
import prettierConfig from '@voder/dev-config/prettier';
export default prettierConfig;
```

### Vitest Usage

```ts
// vitest.config.ts
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

### Markdown Lint Usage

```ts
// .markdownlint.json (generate via script)
import { getConfig } from '@voder/dev-config/linters/markdown';
import { writeFileSync } from 'fs';
writeFileSync('.markdownlint.json', JSON.stringify(getConfig(), null, 2));
```

```jsonc
// package.json scripts
{
  "scripts": {
    "lint:md": "markdownlint-cli2 --config .markdownlint.json README.md docs/**/*.md",
    "lint:md:fix": "markdownlint-cli2 --fix --config .markdownlint.json README.md docs/**/*.md",
  },
}
```

## 📖 API Reference
See [API Reference](docs/API.md)


### `testing.createVitestNodeConfig()`

Returns a Vitest config object tuned for Node:

- **Returns:** `Record<string, unknown>`
- **Properties:**
  - `.test.environment` = `"node"`
  - `.test.setupFiles` = `["./src/test-setup.node.ts"]`
  - `.test.coverage.thresholds` = `{ branches: 90, functions: 90, lines: 90, statements: 90 }`

### `testing.testSetup.node`

Path to the test-setup file: `"./src/test-setup.node.ts"`

### ESLint layers

- `eslint.base: Linter.Config[]`
- `eslint.dx: Linter.Config[]`
- `eslint.performance: Linter.Config[]`

### Prettier

- Default export: Prettier `Config` object

### TypeScript

- `typescript.base`, `.node`, `.library`, `.test`: `object` presets

### Markdown

- `markdown.getConfig(overrides?)`: rule object
- `markdown.createCLICommand({ configPath?, fix? })`: CLI command string

## 🔧 Troubleshooting

**Cannot find module ‘@voder/dev-config/...’**  
Install missing peer dependencies.

**TypeScript config fails to load**  
Ensure Node ≥ 22.6.0 and use `NODE_OPTIONS="--experimental-strip-types"` for TS configs.

**ESLint parser errors**  
Install `@typescript-eslint/parser` and point `parserOptions.project` to your `tsconfig.json`.

## 🛡️ Security

- No network or file-system side effects at runtime
- Only reads JSON and exports config objects
- Peer dependencies must be installed in consumer projects
- No sensitive data or API calls

## 🤝 Contributing

For contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).


```bash
npm install
npm run verify
npm run build
```

- **Tests:** `npm test` (Vitest)
- **Lint & format:** `npm run lint && npm run format`
- **MD lint:** `npm run lint:md && npm run lint:md:fix`
- **Type-check:** `npm run type-check`

Submit issues and pull requests that include tests and documentation.

## 📄 License

This software is proprietary and not open-source.  
No rights are granted to use, copy, modify, or distribute without explicit permission.  
All rights reserved. UNLICENSED
