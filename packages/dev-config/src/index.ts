// Public API exports for @voder/dev-config
// Dual export strategy: main index aggregation + dedicated export paths

export * as testing from './testing/index.js';

// Re-export configurations for convenience (also available via dedicated paths)
// Note: These point to the source files, not compiled versions
export * as eslint from '../eslint/index.js';
export * as typescript from '../typescript/index.js';
