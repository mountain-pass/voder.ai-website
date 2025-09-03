import { describe, expect, test } from 'vitest';

import { createViteLibraryConfig } from '../../src/build/vite-library.js';

describe('Vite Library Configuration', () => {
  test('should generate valid ESM-only configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
    });

    expect(config).toBeDefined();
    expect(config.build).toBeDefined();
    expect(config.build?.lib).toBeDefined();

    const lib = config.build!.lib as any;
    expect(lib.formats).toEqual(['es']);
    expect(lib.name).toBe('TestLibrary');
  });

  test('should include PostCSS configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
    });

    expect(config.css).toBeDefined();
    expect(config.css?.postcss).toBeDefined();
  });

  test('should handle custom external dependencies', () => {
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      external: ['react', 'react-dom', 'custom-lib'],
    });

    expect(config.build?.rollupOptions?.external).toEqual(['react', 'react-dom', 'custom-lib']);
  });

  test('should merge custom Vite configuration', () => {
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      viteConfig: {
        define: {
          __VERSION__: '"1.0.0"'
        },
        plugins: []
      }
    });

    expect(config.define).toEqual({ __VERSION__: '"1.0.0"' });
    expect(config.plugins).toEqual([]);
  });

  test('should handle extractCSS option disabled', () => {
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      extractCSS: false
    });

    // When extractCSS is false, should still have PostCSS config
    expect(config.css?.postcss).toBeDefined();
  });

  test('should merge custom PostCSS config plugins', () => {
    const customPlugin = { name: 'custom-plugin' };
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      postcssConfig: {
        plugins: [customPlugin]
      }
    });

    const postcss = config.css?.postcss as any;
    expect(postcss.plugins).toContain(customPlugin);
    // Should also include the default autoprefixer plugin
    expect(postcss.plugins.length).toBeGreaterThan(1);
  });

  test('should handle external dependencies with different configurations', () => {
    const external = ['react', 'vue'];
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      external,
    });

    expect(config.build?.rollupOptions?.external).toBe(external);
  });

  test('should call createPostCSSConfig correctly', () => {
    const config = createViteLibraryConfig({
      name: 'TestLibrary', 
      entry: './src/index.ts',
    });

    // Verify that PostCSS config is created and contains expected plugins
    const postcss = config.css?.postcss as any;
    expect(postcss?.plugins).toBeDefined();
    expect(postcss?.plugins).toBeInstanceOf(Array);
    expect(postcss?.plugins.length).toBeGreaterThan(0);
  });

  test('should handle postcss config with null/undefined plugins', () => {
    // Test the plugins ?? [] branch
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      postcssConfig: {} as any, // No plugins property
    });

    const postcss = config.css?.postcss as any;
    expect(postcss?.plugins).toBeDefined();
    expect(postcss?.plugins).toBeInstanceOf(Array);
  });

  test('should handle base postcss config without plugins', () => {
    // This tests the fallback branch for basePostcss.plugins ?? []
    const config = createViteLibraryConfig({
      name: 'TestLibrary',
      entry: './src/index.ts',
      postcssConfig: {
        plugins: [{ name: 'custom-plugin' }],
      },
    });

    const postcss = config.css?.postcss as any;
    expect(postcss?.plugins).toBeDefined();
    expect(postcss?.plugins).toBeInstanceOf(Array);
    expect(postcss?.plugins.length).toBeGreaterThan(0);
  });
});
