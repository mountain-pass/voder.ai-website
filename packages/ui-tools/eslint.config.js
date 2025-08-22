import { base, dx, performance } from '@voder/dev-config/eslint';

export default [
  // Prevent ESLint flat-config from traversing generated/build outputs
  {
    ignores: [
      'dist/',
      'build/',
      'coverage/',
      'node_modules/',
      '.cache/',
      '.vite/',
      '.eslintcache'
    ]
  },

  // Compose dev-config ESLint layers after ignores
  ...base,
  ...dx,
  ...performance
];
