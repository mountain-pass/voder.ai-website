import { resolve } from 'path';
import { defineConfig } from 'vite';
import inlineSource from 'vite-plugin-inline-source';

export default defineConfig({
  root: '.',
  plugins: [inlineSource()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/config': resolve(__dirname, 'config'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
