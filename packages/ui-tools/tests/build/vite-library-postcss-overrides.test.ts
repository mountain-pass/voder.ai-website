import { describe, expect, it } from 'vitest';

import { createViteLibraryConfig } from '../../src/build/vite-library.js';
describe('Vite Library Configuration – PostCSS plugin overrides', () => {
  it('merges user-supplied postcssConfig.plugins into css.postcss.plugins', () => {
    const customPlugin = () => ({ postcssPlugin: 'custom', Once() {} });

    const config = createViteLibraryConfig({
      name: 'TestLib',
      entry: './src/index.js',
      postcssConfig: { plugins: [customPlugin] },
    });

    const postcssConfig = config.css?.postcss;

    // Type guard to ensure postcss is an object with plugins
    expect(typeof postcssConfig).toBe('object');
    expect(postcssConfig).not.toBe(null);
    const plugins = (postcssConfig as any)?.plugins;

    expect(Array.isArray(plugins)).toBe(true);
    // The default autoprefixer plugin should be first (configured autoprefixer returns an object)
    expect(typeof plugins[0]).toBe('object');
    expect(plugins[0]).toHaveProperty('postcssPlugin', 'autoprefixer');
    // Our custom plugin should appear after the default
    expect(plugins).toContain(customPlugin);
  });
});
