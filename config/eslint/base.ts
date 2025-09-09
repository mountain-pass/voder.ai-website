/**
 * Base ESLint configuration for the project (Flat Config, ESM).
 */
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';

const config: Linter.Config[] = [
  // JavaScript files - basic configuration
  {
    name: '@voder/dev-config/eslint/base-js',
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      import: importPlugin as any,
    },
    rules: {
      // Basic JavaScript rules
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prefer-const': ['error', { destructuring: 'all' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // TypeScript files - full configuration with type checking
  {
    name: '@voder/dev-config/eslint/base-ts',
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        // Point at the project's tsconfig when type-aware rules are needed.
        project: ['./tsconfig.json', './tsconfig.build.json'],
        // Support .json imports
        extraFileExtensions: ['.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin as any,
      import: importPlugin as any,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      // Use TypeScript-aware no-unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Prefer TypeScript-aware shadow detection
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],

      // Detect and warn about deprecated usage
      '@typescript-eslint/no-deprecated': 'warn',

      // Allow pragmatic usage in this package
      '@typescript-eslint/no-explicit-any': 'off',
      'no-var': 'off',

      // Encourage const where possible
      'prefer-const': ['error', { destructuring: 'all' }],

      // Keep console usage visible during development but not allowed silently
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

export default config;
