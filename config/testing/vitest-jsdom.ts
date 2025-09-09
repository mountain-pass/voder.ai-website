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

  // Extract any user resolve settings and merge with our default extensions
  const { resolve: userResolve = {}, ...otherVitestConfig } = vitestConfig;

  const mergedResolve = {
    extensions: ['.ts', '.js', '.json'],
    ...userResolve,
  };

  return defineConfig({
    test: {
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
    },
    // Merge default & user-resolved extensions, then other overrides
    resolve: mergedResolve,
    ...otherVitestConfig,
  });
}
