import { resolve } from 'path';
import { defineConfig, type UserConfig } from 'vite';

import { createPostCSSConfig, type PostCSSConfigOptions } from './postcss.ts';

export interface ViteLibraryOptions {
  /** Library name (metadata only; ESM-only build) */
  name: string;
  /** Entry point file path */
  entry: string;
  /** External dependencies to exclude from bundle */
  external?: string[];
  /** Additional Vite configuration overrides */
  viteConfig?: UserConfig;
  /** Enable CSS extraction (default: true) */
  extractCSS?: boolean;
  /** PostCSS configuration overrides */
  postcssConfig?: PostCSSConfigOptions;
}

/**
 * Create a Vite configuration suitable for building ESM-only UI libraries.
 *
 * - Produces only ESM output formats (['es'])
 * - Keeps minification off (consumers handle minification)
 * - Merges a sensible PostCSS config (including autoprefixer) with any overrides
 */
export function createViteLibraryConfig(options: ViteLibraryOptions) {
  const {
    name,
    entry,
    external = ['react', 'react-dom', '@voder/shared'],
    viteConfig = {},
    extractCSS = true,
    postcssConfig = {}
  } = options;

  // Base PostCSS config from our helper
  const basePostcss = createPostCSSConfig();

  // Merge plugins arrays (if present) then shallow-merge the rest of the config.
  const mergedPostcss: Record<string, unknown> = {
    ...basePostcss,
    ...postcssConfig
  };

  const basePlugins = (basePostcss as any).plugins ?? [];

  const overridePlugins = (postcssConfig as any).plugins ?? [];

  mergedPostcss.plugins = [...basePlugins, ...overridePlugins];

  return defineConfig({
    build: {
      lib: {
        entry: resolve(entry),
        name,
        formats: ['es'],
        fileName: (format) => `index.${format}.js`
      },
      rollupOptions: {
        external
      },
      sourcemap: true,
      minify: false,
      cssCodeSplit: Boolean(extractCSS)
    },
    css: {
      postcss: mergedPostcss
    },
    ...viteConfig
  });
}
