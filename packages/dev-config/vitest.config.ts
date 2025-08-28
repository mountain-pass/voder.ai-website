export default {
  test: {
    testTimeout: 120000,
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test-setup.node.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      include: ['src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/node_modules/**'],
      thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 },
    },
    retry: { runMode: 5 }
  },
} as const;
