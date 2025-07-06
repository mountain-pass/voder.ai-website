// eslint.config.cjs
const { FlatCompat } = require('@eslint/eslintrc');

// Load our existing .eslintrc.cjs via FlatCompat
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendationMode: 'recommended'
});

module.exports = [
  // Extend configs from .eslintrc.cjs
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier'
  ),

  // Plugins
  ...compat.plugins('svelte', '@typescript-eslint'),

  // Parser and parser options
  {
    languageOptions: {
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.svelte']
      }
    }
  },

  // Svelte file processor
  {
    files: ['*.svelte'],
    processor: 'svelte/svelte'
  },

  // Custom rules
  {
    rules: {
      'no-console': 'warn'
    }
  }
];