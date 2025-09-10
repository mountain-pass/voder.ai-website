import { resolve } from 'path';

import { createVitestJsdomConfig } from './config/testing/vitest-jsdom.js';

export default createVitestJsdomConfig({
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'config/**', // All configuration code
      '**/*.config.{js,ts}', // Configuration files
      'tests/setup.ts', // Test setup files
      'tests/**/*.setup.{js,ts}', // Additional test setup patterns
      '**/.eslintrc.{js,cjs}', // ESLint legacy configs
      '**/eslint.config.{js,ts}', // ESLint flat configs
      '**/vite.config.{js,ts}', // Vite configs
      '**/vitest.config.{js,ts}', // Vitest configs
      '**/postcss.config.{js,ts}', // PostCSS configs
      '**/prettier.config.{js,ts}', // Prettier configs
      '**/stylelint.config.{js,ts}', // Stylelint configs
      '**/htmlhint.config.{js,ts}', // HTMLHint configs
      '**/playwright.config.{js,ts}', // Playwright configs
      '**/tailwind.config.{js,ts}', // Tailwind configs
      '**/.github/**', // GitHub workflows and scripts
      '**/scripts/**', // Build/automation scripts
    ],
  },
  vitestConfig: {
    test: {
      exclude: ['tests/e2e/**'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/config': resolve(__dirname, 'config'),
      },
    },
  },
});
