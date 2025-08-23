import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  // Prevent ESLint flat-config from traversing generated/build outputs
  // and from attempting type-aware parsing of local configuration files.
  {
    ignores: [
      '**/dist/**',
      '**/*.d.ts',
      'dist/',
      'build/',
      'coverage/',
      'node_modules/',
      '.cache/',
      '.vite/',
      '.eslintcache',

      // Exact config filenames to ignore so ESLint doesn't try to type-parse them
      'vite.config.ts',
      'vite.config.*',
      'vitest.config.ts',
      'vitest.config.*',
      'prettier.config.js',
      'prettier.config.ts',
      'prettier.config.*',
      'eslint.config.js',
      'eslint.config.cjs',
      '.eslintrc.*',

      // Other local tooling scripts that should not be type-checked by ESLint
      'setup-package-docs.js'
    ],

    // Point ESLint's TypeScript-aware parser options to the dedicated
    // tsconfig for linting. This makes the CLI invocation simple and
    // avoids requiring --parser-options on the command line.
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json'
      }
    }
  },

  // Compose dev-config ESLint layers after ignores
  ...base,
  ...dx,
  ...performance
];
