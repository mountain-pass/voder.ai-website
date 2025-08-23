import { describe, expect, it } from 'vitest';
import { createViteLibraryConfig } from '../../src/build/vite-library.js';

describe('Vite Library Configuration – PostCSS plugin overrides', () => {
  it('merges user-supplied postcssConfig.plugins into css.postcss.plugins', () => {
    const customPlugin = () => ({ postcssPlugin: 'custom', Once() {} });
    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.ts',
      postcssConfig: { plugins: [customPlugin] }
    });

    const plugins = config.css?.postcss?.plugins;
    expect(Array.isArray(plugins)).toBe(true);

    // The default autoprefixer plugin should be first
    expect(typeof plugins![0]).toBe('function');
    // Our custom plugin should appear after the default
    expect(plugins).toContain(customPlugin);
  });
});
