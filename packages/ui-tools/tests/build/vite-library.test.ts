import { describe, expect,it } from 'vitest';

import { createViteLibraryConfig } from '../../src/build/vite-library.js';

describe('Vite Library Configuration', () => {
  it('should generate valid ESM-only configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.ts'
    });

    // Narrow/cast build.lib to avoid 'false | LibraryOptions' type error
const lib: any = config.build && (config.build as any).lib;

expect(lib).toBeDefined();
expect(lib.formats).toEqual(['es']);
expect(lib.name).toBe('TestLib');
  });

  it('should include PostCSS configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.ts'
    });

    expect(config.css?.postcss).toBeDefined();
  });
});