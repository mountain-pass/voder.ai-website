// Root ESLint configuration for Voder monorepo
// Implements ADR-0004: Adopt ESLint & Prettier for Code Quality and Formatting
// Extends the shared configuration from packages/tsconfig/eslint.config.js

import sharedConfig from './packages/tsconfig/eslint.config.js';

export default [
  ...sharedConfig,
  
  // Root-specific overrides
  {
    files: ['*.config.{js,ts,mjs}', 'scripts/**/*'],
    rules: {
      'no-console': 'off', // Allow console in build scripts
      '@typescript-eslint/no-explicit-any': 'off' // Allow any in config files
    }
  }
];
