import { resolve } from 'path';

import { createVitestJsdomConfig } from './config/testing/vitest-jsdom.js';

export default createVitestJsdomConfig({
  setupFiles: ['./tests/setup.ts'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    exclude: ['node_modules/**', 'dist/**', 'coverage/**', '**/*.config.{js,ts}', 'tests/setup.ts'],
  },
  vitestConfig: {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@/config': resolve(__dirname, 'config'),
      },
    },
  },
});
