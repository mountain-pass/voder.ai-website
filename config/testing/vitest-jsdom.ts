import type { ViteUserConfig } from 'vitest/config';
import { defineConfig } from 'vitest/config';

export interface VitestJsdomOptions {
  setupFiles?: string[];
  coverage?: any;
  vitestConfig?: ViteUserConfig;
}

/**
 * Creates a Vitest configuration for jsdom testing environment
 * @param options - Optional configuration options
 * @returns Complete Vitest configuration with jsdom setup
 */
export function createVitestJsdomConfig(options: VitestJsdomOptions = {}): ViteUserConfig {
  const { setupFiles = ['./src/test-setup.jsdom.ts'], coverage = {}, vitestConfig = {} } = options;

  // Extract any user resolve and test settings and merge with our defaults
  const {
    resolve: userResolve = {},
    test: userTest = {},
    ...otherVitestConfig
  } = vitestConfig as any;

  const mergedResolve = {
    extensions: ['.ts', '.js', '.json'],
    ...userResolve,
  };

  const defaultTestConfig = {
    environment: 'jsdom',
    globals: true,
    setupFiles,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
      ...coverage,
    },
  };

  // Merge user-specified test config with our defaults so callers can augment (e.g., add exclude patterns)
  const mergedTestConfig = {
    ...defaultTestConfig,
    ...userTest,
  };

  return defineConfig({
    test: mergedTestConfig,
    // Merge default & user-resolved extensions, then other overrides
    resolve: mergedResolve,
    ...otherVitestConfig,
  });
}
