module.exports = {
  parser: 'svelte-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.svelte']
  },
  plugins: ['svelte', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte/svelte'
    }
  ],
  rules: {
    // Warn on console usage
    'no-console': 'warn'
  }
};