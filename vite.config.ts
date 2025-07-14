import { defineConfig } from 'vite';
import path from 'path';
import inlineSource from 'vite-plugin-inline-source';

export default defineConfig(({ command }) => ({
    plugins: command === 'build'
      ? [
          inlineSource(),
        ]
      : [],

    build: {
      cssCodeSplit: true,
      sourcemap: true,
      rollupOptions: {
        external: [  '@sentry/browser', '@sentry/tracing'],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/@sentry')) return 'vendor-sentry';
            if (
              id.includes('node_modules/beasties') ||
              id.includes('node_modules/critters')
            )
              return 'vendor-beasties';
            
            // Granular Three.js chunking for smaller bundles
            if (id.includes('node_modules/three')) {
              if (id.includes('/examples/jsm/loaders/')) return 'three-loaders';
              if (id.includes('/examples/jsm/')) return 'three-examples';
              if (id.includes('/src/renderers/') || id.includes('WebGLRenderer')) return 'three-webgl';
              if (id.includes('/src/cameras/') || id.includes('Camera')) return 'three-cameras';
              if (id.includes('/src/scenes/') || id.includes('Scene')) return 'three-scenes';
              if (id.includes('/src/lights/') || id.includes('Light')) return 'three-lights';
              if (id.includes('/src/materials/')) return 'three-materials';
              if (id.includes('/src/geometries/')) return 'three-geometries';
              if (id.includes('/src/math/')) return 'three-math';
              if (id.includes('/src/core/')) return 'three-core';
              return 'three-utils';
            }
            
            if (id.includes('node_modules/gsap')) return 'vendor-gsap';
            if (id.includes('node_modules/')) return 'vendor-other';
          },
        },
      },
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    server: {
      port: 5173,
      strictPort: true,
    },

    preview: {
      port: 4173,
      strictPort: true,
    },
  }));