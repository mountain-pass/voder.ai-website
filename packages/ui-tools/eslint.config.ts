// ESLint configuration using dev-config complete export with vitest globals
import { complete } from '@voder/dev-config/eslint';

export default [
  // Additional ignores to supplement dev-config complete export
  {
    ignores: [
      '**/dist/**',
      'dist/**',
      '**/*.d.ts',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '.cache/**',
      '.vite/**',
      '.eslintcache'
    ]
  },
  ...complete
];
