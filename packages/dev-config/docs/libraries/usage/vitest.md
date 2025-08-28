# Vitest Configuration

This guide shows how to import and use the `createVitestNodeConfig()` factory from `@voder/dev-config/testing` in your project’s `vitest.config.ts`.

## Installation

Make sure you have Vitest installed in your consumer project:

```bash
npm install --save-dev vitest @voder/dev-config
```

## Usage

In your `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import { createVitestNodeConfig } from '@voder/dev-config/testing';

export default defineConfig(createVitestNodeConfig());
```

### Coverage Thresholds

The returned config includes Istanbul coverage settings with thresholds:

- branches: 80%
- functions: 80%
- lines: 80%
- statements: 80%

You can override or extend these settings by passing an object:

```ts
import { defineConfig } from 'vitest/config';
import { createVitestNodeConfig } from '@voder/dev-config/testing';

export default defineConfig(
  createVitestNodeConfig({
    coverage: {
      thresholds: { branches: 95, functions: 95, lines: 95, statements: 95 },
    },
  }),
);
```

### Setup Files

By default, the config points to `./src/test-setup.node.ts` for any global setup. You can customize this path if your setup file lives elsewhere:

```ts
export default defineConfig(
  createVitestNodeConfig({
    test: { setupFiles: ['./tests/setup.ts'] },
  }),
);
```

## Additional Notes

- The factory uses a Node environment (`environment: 'node'`) and Vitest globals.
- It automatically sets `globals: true`, configures `provider: 'istanbul'`, and includes `text`, `html`, and `lcov` reporters.
