// Export ESLint v9 flat config layers (ESM)
import js from '@eslint/js';
import type { Linter } from 'eslint';
import globals from 'globals';

import base from './base.js';
import dx from './dx.js';
import performance from './performance.js';

export { default as base } from './base.js';
export { default as dx } from './dx.js';
export { default as performance } from './performance.js';

// Export types for consumers
export type ESLintFlatConfig = Linter.Config;
export type ESLintConfig = Linter.Config[];

export const complete: Linter.Config[] = [
  // Global ignores - must be first and separate
  {
    ignores: ['dist/', 'build/', 'coverage/', 'node_modules/', 'typescript/'],
  },
  // Main configuration
  {
    files: [
      'src/**/*.{js,ts}',
      'tests/**/*.{js,ts}',
      '**/*.test.{js,ts}',
      '**/*.spec.{js,ts}',
      '*.config.{js,ts}',
      'vite.config.{js,ts}',
      'vitest.config.{js,ts}',
      'prettier.config.{js,ts}',
      '.eslintrc.*',
      'scripts/**/*.{js,ts}',
      'eslint/**/*.{js,ts}',
      'linters/**/*.{js,ts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        require: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  // Test files: vitest + DOM globals
  {
    files: ['**/*.test.{js,ts}', 'tests/**/*.{js,ts}', 'src/testing/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        test: 'readonly',
        document: 'readonly',
        window: 'readonly',
        global: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Allow console statements in test files for debugging
    },
  },
  // Script files: Node globals
  {
    files: ['scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
];

export default complete;
