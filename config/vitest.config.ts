import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportOnFailure: true,
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 },
      include: ['src/**/*.ts'],
      exclude: [
        'scripts/**/*',
        'node_modules/**',
        'dist/**',
        'coverage/**',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
});
