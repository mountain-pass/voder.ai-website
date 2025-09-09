/**
 * Performance ESLint configuration layer (Flat Config, ESM)
 */
import type { Linter } from 'eslint';

const config: Linter.Config[] = [
  {
    name: '@voder/dev-config/eslint/performance',
    rules: {
      // Example performance-oriented rule placeholders (kept permissive)
      // Add stricter rules via ADRs or when there's consensus to enforce them.
      // 'no-restricted-syntax': ['warn', { selector: 'ForInStatement', message: 'Avoid for-in for arrays; prefer for-of or array iteration methods.' }]
    },
  },
];

export default config;
