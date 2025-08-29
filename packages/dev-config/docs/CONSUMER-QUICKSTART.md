# Consumer Quickstart

This quickstart provides copy/paste-ready snippets to configure your project to use the shared dev-config exports from @voder/dev-config.

## Prerequisites

- Node >= 22.6.0
- Install dev-dependencies listed below in your project's devDependencies (see npm install command)

## 1. Install packages (devDependencies / peer dependencies)

Run the following in your project root:

```bash
npm install -D @voder/dev-config jiti typescript prettier eslint vitest @vitest/coverage-istanbul markdownlint-cli2 eslint-plugin-import eslint-plugin-unicorn eslint-plugin-simple-import-sort eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## 2. tsconfig files

Create `tsconfig.eslint.json` with the following content:

```json
{
  "extends": "./node_modules/@voder/dev-config/typescript/tsconfig.eslint.json"
}
```

Create `tsconfig.config.json` with the following content:

```json
{
  "extends": "./node_modules/@voder/dev-config/typescript/tsconfig.config.json"
}
```

If you prefer to copy the full local JSON, use the templates below (these mirror the exported presets):

**tsconfig.eslint.json**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "types": ["node", "vitest/globals"],
    "isolatedModules": false
  },
  "exclude": ["dist", "build", "coverage", "typescript"]
}
```

**tsconfig.config.json**

```json
{
  "extends": "./base.json",
  "compilerOptions": {
    "types": ["node"],
    "isolatedModules": false
  }
}
```

## 3. ESLint config (eslintrc as TypeScript using jiti)

Create a file `eslint.config.ts` with the following content:

```ts
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { default: config } = require('@voder/dev-config/dist/eslint/index.js');
export default config;
```

Alternative (using jiti to load TypeScript directly):

```ts
import jiti from 'jiti';
const r = jiti(import.meta.url);
export default r('@voder/dev-config/eslint');
```

## 4. Prettier config (`prettier.config.ts`)

Create `prettier.config.ts` at project root with:

```ts
import r from 'jiti';
export default r(import.meta.url)('@voder/dev-config/prettier');
```

## 5. Vitest config (`vitest.config.ts`)

Create `vitest.config.ts` at project root with:

```ts
import r from 'jiti';
export default r(import.meta.url)('@voder/dev-config/testing');
```

## 6. package.json scripts

Add the following scripts to your `package.json`:

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "generate:md-config": "generate-markdownlint-config .",
  "lint:md": "markdownlint-cli2 *.md docs/**/*.md",
  "lint:md:fix": "markdownlint-cli2 --fix *.md docs/**/*.md",
  "format": "NODE_OPTIONS=\"--experimental-strip-types\" prettier \"**/*.{ts,tsx,js,jsx,json,md}\" --write",
  "format:check": "NODE_OPTIONS=\"--experimental-strip-types\" prettier \"**/*.{ts,tsx,js,jsx,json,md}\" --check",
  "test": "vitest",
  "test:ci": "vitest run --coverage --reporter=verbose --testTimeout=120000",
  "verify": "npm audit fix --force && npm run lint:fix && npm run lint:check && npm run lint:md:fix && npm run format && npm run build && npm run test:ci"
}
```

After adding the scripts above, generate the MarkdownLint configuration file:

```bash
npm run generate:md-config
```

This will create a `.markdownlint.json` file in your project root, which is required for the markdown lint scripts.

## 7. One-line verification command

Run the full verification locally with:

```bash
npm run verify
```

### Notes & Troubleshooting

- Ensure you have Node >= 22.6.0 to support experimental strip types for prettier when using TypeScript configs in scripts.
- If you encounter jiti resolution issues, ensure jiti is installed as a devDependency in the consumer project.
- The exported paths in the package expose: `@voder/dev-config/prettier`, `@voder/dev-config/eslint`, `@voder/dev-config/typescript/tsconfig.eslint.json` and `tsconfig.config.json` — prefer using those exports to keep in sync with package changes.

Further reading

- `docs/API.md` for exported module details
- `docs/decisions/0001-use-standard-development-tools-as-devdependencies.md`
