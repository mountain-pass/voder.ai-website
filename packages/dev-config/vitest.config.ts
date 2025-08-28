import { createVitestNodeConfig } from '@voder/dev-config/testing';
import { defineConfig } from 'vitest/config';

const baseConfig = createVitestNodeConfig() as any;

export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    coverage: {
      ...baseConfig.test.coverage,
      exclude: [
        ...((baseConfig.test.coverage as any)?.exclude || []),
        'dist/**',
        'coverage/**',
        'node_modules/**',
        '**/*.test.ts',
        '**/*.spec.ts',
        'vitest.config.ts',
      ],
    },
  },
});
