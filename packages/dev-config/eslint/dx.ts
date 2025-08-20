/**
 * DX ESLint configuration layer (Flat Config, ESM)
 */
import tsPlugin from '@typescript-eslint/eslint-plugin';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const config: Linter.Config[] = [
  {
    name: '@voder/dev-config/eslint/dx',
    plugins: {
      import: importPlugin as any,
      '@typescript-eslint': tsPlugin as any,
      'simple-import-sort': simpleImportSort as any,
    },
    rules: {
      // Import hygiene: keep imports sorted and deduplicated
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/no-duplicates': 'error',

      // TypeScript DX preferences
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],

      // Readability: blank lines around important boundaries
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },
];

export default config;
