import eslint from '@eslint/js';
import parser from 'svelte-eslint-parser';
import svelte from 'eslint-plugin-svelte';
import { fileURLToPath } from 'url';
import path from 'path';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
  {
    files: ['**/*.{js,ts,svelte}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      svelte,
    },
    rules: {
      'no-console': 'warn',
      // Add any custom Svelte rules here
      'svelte/no-at-debug-tags': 'warn',
      'svelte/no-target-blank': 'error',
      'svelte/no-at-html-tags': 'warn',
    },
  },
  // Prettier config should be last to override any conflicting rules
  prettier
);
