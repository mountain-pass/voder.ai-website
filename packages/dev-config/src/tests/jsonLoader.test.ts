import { describe, expect,it } from 'vitest';

import loadJSON from '../utils/jsonLoader.js';

describe('loadJSON()', () => {
  it('parses an existing JSON file', () => {
    // Relatively load the TypeScript base preset as a fixture
    const data = loadJSON('../../typescript/base.json');

    expect(typeof data).toBe('object');
    expect(data).toHaveProperty('compilerOptions');
  });

  it('throws when pointed at a nonexistent file', () => {
    expect(() => loadJSON('./this-file-does-not-exist.json')).toThrow();
  });
});
