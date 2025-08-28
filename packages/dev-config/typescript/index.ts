import loadJSON from '../src/utils/jsonLoader.js';
const base = loadJSON('./base.json');

const node = loadJSON('./node.json');

const library = loadJSON('./library.json');

const test = loadJSON('./test.json');

// Export individual configs for direct access
export { base, library, node, test };

// Load and re-export ESLint and config JSON presets
const tsconfigEslint = loadJSON('./tsconfig.eslint.json');
const tsconfigConfig = loadJSON('./tsconfig.config.json');
export { tsconfigEslint, tsconfigConfig };

// Also export as grouped object for compatibility
export const typescript = {
  base,
  node,
  library,
  test,
};

export interface TypeScriptConfig {
  compilerOptions?: Record<string, any>;
  extends?: string;
  include?: string[];
  exclude?: string[];
}
