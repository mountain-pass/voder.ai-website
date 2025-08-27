// Export ESLint v9 flat config layers (ESM)
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import type { Linter } from 'eslint';
import { base, dx, performance } from './index.js';

export { default as base } from './base.js';
export { default as dx } from './dx.js';
export { default as performance } from './performance.js';

// Export types for consumers
export type ESLintFlatConfig = Linter.Config;
export type ESLintConfig = Linter.Config[];

export const complete: Linter.Config[] = [
  js.configs.recommended,
  ...base,
  ...dx,
  ...performance,
  prettier,
  { ignores: ['dist/', 'build/', 'coverage/', 'node_modules/'] },
];

export default complete;
