# @voder/dev-config

Provide a single-package solution of TypeScript, ESLint, Prettier, Vitest, and Markdown-lint configurations for Node.js projects.

# @voder/dev-config

- Node.js ≥22.6.0 (ESM support with `--experimental-strip-types`)
- **Governance:** Any deviation from these configurations requires an ADR per the Dependency Governance policy.
- peerDependencies:
  - eslint ^9.0.0
  - prettier ^3.0.0
  - typescript ^5.0.0
  - vitest ^3.2.0
  - markdownlint-cli2 ^0.18.1
  - @typescript-eslint/parser ^8.0.0
  - @typescript-eslint/eslint-plugin ^8.0.0
  - eslint-config-prettier ^10.0.0
  - eslint-plugin-import ^2.30.0
  - eslint-plugin-simple-import-sort ^12.0.0
  - eslint-plugin-unicorn ^60.0.0

# @voder/dev-config

```bash
npm install @voder/dev-config
pnpm add @voder/dev-config
yarn add @voder/dev-config
```

# @voder/dev-config

# @voder/dev-config

```jsonc
// tsconfig.json
{
  "extends": "@voder/dev-config/typescript/library.json",
  "compilerOptions": { "outDir": "./dist" },
}
```

# @voder/dev-config

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
];
```

# @voder/dev-config

```ts
import { defineConfig } from 'vitest/config';
import { createVitestNodeConfig } from '@voder/dev-config/testing';

export default defineConfig(createVitestNodeConfig());
```

# @voder/dev-config

```ts
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: { alias: { '@config': '@voder/dev-config' } },
});
```

# @voder/dev-config

- `npm run copy:assets` — runs `scripts/copy-assets.ts` to copy ESLint- and TypeScript-JSON assets into `dist/`
- `npm run generate:md-config` — runs `scripts/generate-markdownlint-config.ts` to regenerate `.markdownlint.json`

# @voder/dev-config

# @voder/dev-config

# @voder/dev-config

Factory for Vitest Node config.

```ts
import { createVitestNodeConfig } from '@voder/dev-config/testing';
const config = createVitestNodeConfig();
console.log(config.test.environment); // 'node'
```

# @voder/dev-config

Paths to setup files.

```ts
import { testSetup } from '@voder/dev-config/testing';
console.log(testSetup.node); // './src/test-setup.node.ts'
```

# @voder/dev-config

# @voder/dev-config

Core ESLint flat-config layer.

```js
import { base } from '@voder/dev-config/eslint';
console.log(base[0].name); // '@voder/dev-config/eslint/base'
```

# @voder/dev-config

Developer-experience rules.

# @voder/dev-config

Performance-focused rules.

# @voder/dev-config

# @voder/dev-config

Compiler options for each environment.

```ts
import { base, node } from '@voder/dev-config/typescript';
console.log(base.compilerOptions.target); // 'ES2022'
```

# @voder/dev-config

# @voder/dev-config

Prettier settings.

```ts
import prettierConfig from '@voder/dev-config/prettier';
console.log(prettierConfig.singleQuote); // true
```

# @voder/dev-config

# @voder/dev-config

Programmatic rule object.

```ts
import { getConfig } from '@voder/dev-config/linters/markdown';
console.log(getConfig().MD013); // false
```

# @voder/dev-config

CLI invocation string.

```sh
npm run lint:md # runs markdownlint-cli2 with the generated config
```

# @voder/dev-config

- Missing peer dependency (Cannot find module ...): If you see errors like "Cannot find module 'eslint'" or similar, install the required peer dependencies in your project. Example (install common peers as dev dependencies):
  npm install --save-dev eslint prettier typescript vitest markdownlint-cli2 @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-import eslint-plugin-simple-import-sort eslint-plugin-unicorn

- Prettier TypeScript config: The Prettier config is provided as TypeScript (prettier.config.ts). You need Node >= 22.6.0 to load it natively. When running Prettier CLI or scripts that load the `.ts` config, set:
  NODE_OPTIONS="--experimental-strip-types" prettier --check "\**/\_.{ts,js,md}"

  For convenience, use the package scripts:
  - npm run format
  - npm run format:check

- Regenerating .markdownlint.json: If you update markdown linting defaults or want to regenerate the project config, run:
  - npm run generate:md-config
    or run the prebuild which runs generation automatically:
  - npm run prebuild

# @voder/dev-config

- Scope & boundaries: This package provides configuration only (TypeScript, ESLint, Prettier, Vitest, and markdown lint rules). It does not perform runtime network requests, telemetry, or persist user data.
- Data handling: The package only processes configuration objects and local files. It does not store or transmit secrets.
- Threat model: The primary risk is supply-chain (npm dependencies, plugins and CLI tools executed by consumers). Use lockfile-based installs in CI (npm ci) and registry mirrors when possible to reduce risk.
- Update policy: Security updates are delivered via patch releases and noted in CHANGELOG.md. Run npm audit regularly and review advisories before applying forced fixes.

# @voder/dev-config

This software is proprietary and not open-source. The package is licensed as UNLICESNED. No license is granted to use, copy, modify, distribute, or sublicense except as explicitly agreed in writing by the owners. All rights reserved.

# @voder/dev-config

- Install dependencies:
  npm install
- Run full verification (lint, md-lint-fix, format, build, tests):
  npm run verify
- Build package:
  npm run build
- Run tests:
  npm test
  npm run test:ci
- Lint:
  npm run lint
  npm run lint:fix
- Format:
  npm run format
  npm run format:check

Note: The Prettier TypeScript config requires Node >= 22.6.0. When running Prettier CLI or scripts that load the TypeScript config, prefix commands with:
NODE_OPTIONS="--experimental-strip-types"
