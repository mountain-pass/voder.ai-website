// eslint.config.ts (ESLint v9 Flat Config)
import js from '@eslint/js';
import type { Linter } from 'eslint';
import prettier from 'eslint-config-prettier';

import { base, dx, performance } from './eslint/index.js';

const config: Linter.Config[] = [
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  {
    // Allow test globals in test files (flat config-compatible).
    files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    languageOptions: {
      globals: {
        // Timer APIs used in tests
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Common test framework globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        // Node runtime globals used in tests (added)
        process: 'readonly',
        Buffer: 'readonly',
        globalThis: 'readonly',
      },
    },
  },
  {
    // Prevent typescript-eslint from attempting type-aware checks for plain JS/CJS/MJS/TSX/TS scripts
    // Treat repository script files as plain scripts (no parserOptions.project) and provide Node globals.
    files: [
      'scripts/**/*.{js,cjs,mjs,ts,tsx}',
      '**/scripts/**/*.{js,cjs,mjs,ts,tsx}',
      '**/*/scripts/**/*.{js,cjs,mjs,ts,tsx}',
    ],
    languageOptions: {
      // Disable type-aware parsing for these files so @typescript-eslint won't require parserOptions.project
      parserOptions: {
        project: undefined,
      },
      // Provide Node runtime globals to avoid no-undef errors for console/process/Buffer/globalThis
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        globalThis: 'readonly',
      },
      // Do not specify a TypeScript parser here — parse as plain JS when appropriate.
    },
  },
  prettier,
  {
    ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'],
  },
];

export default config;
