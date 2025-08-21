# @voder/ui-tools

Specialized development tooling for UI component libraries — build configuration factories, PostCSS presets, and jsdom-based testing utilities tailored for component library development.

Requires Node >= 22.6.0.

---

## Quick start

Install as a development dependency in your project:

```bash
npm install --save-dev @voder/ui-tools
```

Or in monorepo / local development, install as a dev dependency pointing to the package location used by your workspace tooling.

---

## Purpose

`@voder/ui-tools` provides small, well-typed factory helpers and presets optimized for building and testing UI component libraries:

- Vite library config factory (ESM-only builds)
- PostCSS configuration factory (PostCSS + Autoprefixer)
- jsdom-focused Vitest configuration factory and test helpers
- Accessibility testing helpers (jest-axe integration)
- Linting configuration factories for HTML/CSS/accessibility (exported as factories)

This package is intended to be consumed by component library packages that need recommended, testable, and LLM-friendly tooling presets.

---

## Examples

vite.config.ts — library build setup

```ts
// vite.config.ts
import { createViteLibraryConfig } from '@voder/ui-tools';

export default createViteLibraryConfig({
  name: 'MyUILibrary',
  entry: './src/index.ts',
  external: ['react', 'react-dom', '@voder/shared']
});
```

Vitest (jsdom) config — component/unit testing

```ts
// vitest.config.ts
import { createVitestJsdomConfig } from '@voder/ui-tools';

export default createVitestJsdomConfig({
  setupFiles: ['./src/test-setup.jsdom.ts'] // your test setup file
});
```

PostCSS factory usage

```ts
import { createPostCSSConfig } from '@voder/ui-tools';

const postcss = createPostCSSConfig({
  browsers: ['last 2 versions', '> 1%'],
  plugins: []
});
```

Test helpers (example)

```ts
import { renderComponent, simulateClick, expectAccessible } from '@voder/ui-tools';

// Use renderComponent to mount a component (jsdom) and simulate interactions
```

---

## Scripts / Verification

The package includes the following relevant npm script targets (run from the package root):

- npm run type-check — TypeScript type checking without emitting
- npm run build — Compile TypeScript sources to ./dist
- npm test — Run Vitest test suites
- npm run test:ci — CI-style test run with coverage
- npm run prepare — Package-local prepare step (runs documentation setup)

Example verification sequence (non-interactive):

```bash
npm run type-check
npm run build
npm test
npm run test:ci
```

---

## Generating .markdownlint.json

This package follows the monorepo convention of using the shared markdown linting configuration from `@voder/dev-config`. To generate a local `.markdownlint.json` (if required):

- Run the package `prepare` step which wires package documentation and may generate docs and metadata used by markdown tooling:
  - npm run prepare

- Or programmatically generate the config using the dev-config helper:
  - Use `@voder/dev-config/linters/markdown`'s getConfig() and write the JSON to `.markdownlint.json`.

Note: The repository’s prepare script and dev-config helper are the recommended approaches. CI and standard developer workflows should rely on the package scripts to ensure consistent generation.

---

## Security posture

- Scope & boundaries
  - This package provides developer tooling only — it does not execute network calls or collect telemetry during runtime usage in consumers.
  - It is a configuration and helper library for build/test tooling; it expects consumers to run build/test processes in controlled environments.

- Data handling
  - Inputs processed by helpers are in-memory configuration objects or test DOM nodes; no persistent sensitive storage is performed by this package.
  - Tests and helpers operate in jsdom and should not be used with untrusted HTML without sanitization in consumer code.

- Threat model assumptions
  - Consumers run build/test processes in a trusted environment (developer machines or CI).
  - Supply-chain risk is limited to devDependencies used during build/test; consumers should perform standard package-audit and lockfile verification per their policies.

- Update & vulnerability policy
  - Keep devDependencies (Vitest, jsdom, postcss, autoprefixer, jest-axe, etc.) up-to-date and run regular `npm audit` checks in CI.
  - The monorepo enforces supply-chain auditing via repository-level processes; follow those processes for upgrades and ADRs for significant dependency changes.

---

## License

UNLICENSED

This software is proprietary and not open-source. No license is granted to use, copy, modify, distribute, or sublicense except as explicitly agreed in writing by the owners. All rights reserved.

---

If you need to run verification locally, execute the non-interactive sequence shown in "Scripts / Verification" above.
