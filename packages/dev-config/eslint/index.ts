// Export ESLint v9 flat config layers (ESM)
import type { Linter } from 'eslint';

export { default as base } from './base.js';
export { default as dx } from './dx.js';
export { default as performance } from './performance.js';

// Export types for consumers
export type ESLintFlatConfig = Linter.Config;
export type ESLintConfig = Linter.Config[];
