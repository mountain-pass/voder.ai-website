import { describe, expect, it } from 'vitest';

import loadJSON from '../utils/jsonLoader.js';

describe('loadJSON()', () => {
  it('parses an existing JSON file', () => {
    // Load the TypeScript base preset as a fixture
    const data = loadJSON('base.json');

    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('compilerOptions');
  });

  it('throws when pointed at a nonexistent file', () => {
    expect(() => loadJSON('./this-file-does-not-exist.json')).toThrow();
  });

  it('handles both compiled and source environments', () => {
    // Test the branch condition by mocking __dirname
    const originalDirname = (global as any).__dirname;

    // Test compiled environment path (should use ../../../typescript/)
    (global as any).__dirname = '/some/path/dist/src/utils';
    const dataFromCompiled = loadJSON('base.json');

    expect(dataFromCompiled).toHaveProperty('compilerOptions');

    // Test source environment path (should use ../../typescript/)
    (global as any).__dirname = '/some/path/src/utils';
    const dataFromSource = loadJSON('base.json');

    expect(dataFromSource).toHaveProperty('compilerOptions');

    // Restore original
    (global as any).__dirname = originalDirname;
  });
});
