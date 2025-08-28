/**
 * Vitest configuration factories for Node.js environment testing
 *
 * This module provides a simple factory function that returns a plain config object
 * compatible with Vitest's expected shape for Node.js testing environments.
 * It intentionally avoids importing from 'vitest/config' to keep TypeScript
 * type/ambient dependency requirements out of this package surface (consumers
 * may still use defineConfig if they prefer).
 */

/**
 * Vitest Node environment config factory
 *
 * Consumers can import and use this factory in their vitest.config.ts
 * for server-side, tooling, and configuration package testing.
 *
 * Example:
 * import { createVitestNodeConfig } from '@voder/dev-config/testing';
 * export default createVitestNodeConfig();
 */
export function createVitestNodeConfig(): Record<string, unknown> {
  return {
    test: {
      environment: 'node',
      globals: true,
      // When consumed from another package, this path points to that package's src
      setupFiles: ['./src/test-setup.node.ts'],
      coverage: {
        provider: 'istanbul', // Use Istanbul for subprocess coverage support
        reporter: ['text', 'html', 'lcov'],
        reportOnFailure: true, // Show coverage even when tests fail
        thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
      },
    },
  };
}

/**
 * Setup file location for consumers.
 */
export const testSetup = {
  node: './src/test-setup.node.ts',
} as const;
