# @voder/dev-config

Purpose

A configuration package that exposes development-time tooling presets and helpers for TypeScript, ESLint (v9 flat config), Prettier, and Vitest-based testing. This package contains configuration and helper code only — no runtime application logic.

Compatibility & Requirements

- Node: This package is ESM-first. For general usage, Node 18+ is supported; NOTE: importing the TypeScript Prettier config file (prettier.config.ts) or running Prettier against that file requires Node 22.6.0+ or using NODE_OPTIONS="--experimental-strip-types".
- ESM: All package exports and configuration files are ESM-first.
- Tooling: Consumers must install tooling listed under Peer dependencies below in their consuming project so the configs can be used.

Peer dependencies

This package relies on common developer tooling to be installed by consumers. Install examples follow.

Required peer dependencies (typical set):

- typescript
- eslint (ESLint v9)
- prettier
- vitest
- @vitest/coverage-v8
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint-config-prettier
- eslint-import-resolver-typescript
- eslint-plugin-import
- eslint-plugin-simple-import-sort
- eslint-plugin-unicorn
- @types/node (for TypeScript Node development)

Install examples (copy/paste)

- npm

```bash
npm install --save-dev typescript eslint prettier vitest @vitest/coverage-v8 \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier \
  eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-simple-import-sort \
  eslint-plugin-unicorn @types/node
```

- pnpm

```bash
pnpm add -D typescript eslint prettier vitest @vitest/coverage-v8 \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier \
  eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-simple-import-sort \
  eslint-plugin-unicorn @types/node
```

- yarn

```bash
yarn add -D typescript eslint prettier vitest @vitest/coverage-v8 \
  @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier \
  eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-simple-import-sort \
  eslint-plugin-unicorn @types/node
```

Quickstart

TypeScript

- Extend a typescript preset in your package's tsconfig.json:

```json
{
  "extends": "@voder/dev-config/typescript/library.json",
  "compilerOptions": { "outDir": "./dist" }
}
```

ESLint (Flat Config v9)

- Compose layers in this order: base → dx (mandatory) → performance. Use eslint.config.js/ts or eslint.config.mjs in your repository root to avoid walking up other configs.

Example (eslint.config.mjs):

```js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx, // mandatory
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] },
];
```

Vitest (Node environment)

- Use the testing helper exported by this package:

```ts
// vitest.config.ts
import { createVitestNodeConfig } from '@voder/dev-config/testing';
export default createVitestNodeConfig();
```

- This helper configures:
  - environment: 'node'
  - globals: true
  - setupFiles: ['./src/test-setup.node.ts']
  - coverage: provider 'v8' with thresholds: branches/functions/lines/statements >= 90%

Prettier

- This package exports a TypeScript Prettier config at the dedicated export path:

```js
import prettierConfig from '@voder/dev-config/prettier';
export default prettierConfig;
```

- If you run Prettier against prettier.config.ts, either run on Node >=22.6.0 or use:
  - NODE_OPTIONS="--experimental-strip-types" prettier --check ...
    (Note: this is required to allow Prettier to load .ts config files natively.)

HTML/CSS Linting

```js
// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import { base, dx, performance, html } from '@voder/dev-config/eslint';

export default [
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  ...html, // HTML lint rules
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] },
];
```

```js
// stylelint.config.js (at project root)
import { stylelintConfig } from '@voder/dev-config/eslint';
export default stylelintConfig;
```

```diff
 "scripts": {
   // …existing…
+  "lint:css": "stylelint --config stylelint.config.js \"**/*.{css,scss}\""
 }
```

Markdown linting

- This package exposes a markdown linter abstraction (linters/markdown) that consumers import; it uses the tool selected by the package (markdownlint-cli2) under the hood. Consumers should use the package export rather than pinning a specific linter tool.

Usage & API summary

Primary exports:

- `typescript` — JSON presets: `base`, `node`, `library`, `test`.
- `eslint` — shareable flat-config layers: `base`, `dx`, `performance`.
- `testing` — helpers: `createVitestNodeConfig()`, `testSetup`.
- `prettier` — default Prettier config (exported).
- `linters/markdown` — programmatic markdown lint configuration helper (getConfig).

Export patterns supported:

- Dedicated path (tree-shakable): `@voder/dev-config/testing`, `@voder/dev-config/eslint`, `@voder/dev-config/typescript`, `@voder/dev-config/prettier`
- Main index: `import { testing, eslint, typescript } from '@voder/dev-config'`

Troubleshooting

- "ESLint can't find parser/project": Ensure the consuming repo has a local tsconfig and the ESLint config points at it (parserOptions.project).
- "Cannot find module '@vitest/coverage-v8'": Install @vitest/coverage-v8 and ensure version alignment with vitest (see dev tool notes).
- "Prettier can't load prettier.config.ts": Use Node >=22.6.0 or set NODE_OPTIONS="--experimental-strip-types".
- "Vitest setup files not found": Verify `src/test-setup.node.ts` exists or adapt setupFiles in your vitest config to match your repo layout.

Development and contributing

- Scripts available in package.json (for package developers):
  - format, format:check, lint, lint:fix, type-check, test, test:watch, test:coverage
- Running local validation:
  - npm run type-check
  - npm run test
  - npm run format
- If you must change tooling decisions (different linters, different coverage thresholds, etc.), create an ADR following the package governance.

Security

- Scope and boundaries: This package only provides development-time configuration and helpers. It performs no network access, no telemetry, and no runtime execution in consumers' production code.
- Data handling: Only local configuration files and code are processed. Do not store secrets or credentials in configs.
- Threat model: Intended for trusted developer and CI environments.
- Update policy: Security and tooling updates are delivered via patch releases; consumers should follow the package changelog.

License

This software is proprietary and not open-source.

This package is licensed under the literal license token "UNLICESNED" in package.json. No rights are granted to use, copy, modify, distribute, sublicense, or otherwise exploit this software except as explicitly agreed in writing by the owners. All rights reserved.

Notes

- The README is self-contained and references only published exports and public URLs; it does not reference internal repository paths.
