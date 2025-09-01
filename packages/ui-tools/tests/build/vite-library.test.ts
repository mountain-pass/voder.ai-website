import { describe, expect, it } from 'vitest';

import { createViteLibraryConfig } from '../../src/build/vite-library.js';
describe('Vite Library Configuration', () => {
  it('should generate valid ESM-only configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.js',
    });

    // Narrow/cast build.lib to avoid 'false | LibraryOptions' type error
    const lib = config.build && config.build.lib;

    expect(lib).toBeDefined();
    expect((lib as any)?.formats).toEqual(['es']);
    expect((lib as any)?.name).toBe('TestLib');
  });
  it('should include PostCSS configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.js',
    });

    expect(config.css?.postcss).toBeDefined();
  });
});
