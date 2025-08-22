import { defineConfig, type UserConfig } from 'vitest/config';

export interface VitestJsdomOptions {
  /** Additional setup files */
  setupFiles?: string[];
  /** Coverage configuration overrides */
  coverage?: Record<string, any>;
  /** Additional Vitest configuration overrides */
  vitestConfig?: UserConfig;
}

export function createVitestJsdomConfig(options: VitestJsdomOptions = {}) {
  const {
    setupFiles = ['./src/test-setup.jsdom.ts'],
    coverage = {},
    vitestConfig = {}
  } = options;

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
          statements: 90
        },
        ...coverage
      }
    },
    ...vitestConfig
  });
}
