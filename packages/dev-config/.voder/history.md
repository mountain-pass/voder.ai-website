Here’s a concise recap of everything done so far:

• Repository & Tooling  
  – Initialized Git repo  
  – Added Vitest, ESLint (flat-config), Prettier, coverage reporting  
  – Set up package.json with peerDependencies, scripts, conditional exports  

• TypeScript Migration  
  – Converted codebase to strict-mode TS  
  – Removed 107 obsolete files and legacy docs  

• Testing, Build & Packaging  
  – Wrote ~33 Vitest suites (100% coverage)  
  – Configured ESM/CJS bundles, `.d.ts` output, asset copying  
  – Defined “prebuild → build → verify” pipeline  

• CI & Governance  
  – Created GitHub Actions “verify” workflow (lint, format, type-check, build, test)  
  – Added import-time checks & `audit:ci` script; documented ADR-0007  

• Documentation & API  
  – Renamed package to `@voder/dev-config`  
  – Expanded README (changelog, migration guide, API reference)  
  – Introduced CONTRIBUTING.md; enforced Markdownlint  
  – Published documentation site  

• Dependency & Security Maintenance  
  – Upgraded esbuild; audited 450+ deps to zero vulnerabilities; regenerated lockfile  
  – Added SECURITY.md  

• Major Refactorings  
  – Removed obsolete Vite scripts; upgraded parsers/linters; unified test helpers  
  – Added multiple tsconfig variants; enabled JSON modules; cleared ESLint warnings  

• Staging & Cleanup  
  – Updated devDependencies; cleaned lint/build/tests; patched outdated READMEs  
  – Committed “restore a clean working tree”  

• Utility & Testing Additions  
  – Added `validateRuntime.ts` and `jsonLoader.ts` in `src/utils`  
  – Created tests for successful and missing‐file scenarios  

• ESLint Config Patches  
  – Fixed parserOptions/project and undefined-variable issues  
  – Enabled JSON file support  

• Latest Fix & Commit  
  – Patched `jsonLoader` to resolve against top-level TS folder (commit a2e7fb0)  

• Most Recent CI/Test Run  
  – Ran 39 Vitest tests across 15 files; all passing; zero vulnerabilities  

• Vitest Config Refactor  
  – Updated root `vitest.config.ts` to use `createVitestNodeConfig` from `@voder/dev-config/testing`  

• Peer Dependency Addition  
  – Added `jiti@^2.5.1` as a peer dependency  

• Most Recent Git Commit  
  – chore: add jiti to peerDependencies for ESLint TS config loading and update vitest.config.ts (2 files changed, 4 insertions(+), 16 deletions(—))  

• Latest Git Action  
  – Executed `git push origin main`; completed successfully  

• New Documentation File Created  
  – Generated `docs/libraries/needs/dev-config-needs.md` detailing complete ESLint configuration requirements, including API spec, file coverage rules, required tsconfig files, dependencies (like jiti), error handling, testing, and documentation guidelines.

**Most recently we've executed the following action:**

---
Run the following patch to insert a link to the ESLint “needs” doc in README.md:

```bash
apply_patch << 'EOF'
*** Begin Patch
*** Update File: README.md
@@ ### ESLint Flat Config Usage
  > **Note:** The `complete` export automatically includes environment-specific globals for test files (Vitest & DOM) and script files (Node).

+ For detailed ESLint configuration requirements and consumer “needs”, see [Dev-Config ESLint Needs](docs/libraries/needs/dev-config-needs.md).
*** End Patch
EOF
```
---

**This was the result:**
---
Successfully applied 1 patch to file: README.md
Content:
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

For detailed ESLint configuration requirements and consumer “needs”, see [Dev-Config ESLint Needs](docs/libraries/needs/dev-config-needs.md).

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

---
