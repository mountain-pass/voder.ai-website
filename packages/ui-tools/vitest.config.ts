import { createVitestJsdomConfig } from './src/testing/vitest-jsdom.js';
export default createVitestJsdomConfig({
  vitestConfig: {
    resolve: { extensions: ['.ts', '.js', '.json'] },
  },
  coverage: {
    exclude: [
      'scripts/**',
      'coverage/**',
      'dist/**',
      'tests/**',
      'node_modules/**',
      '*.config.*',
      'src/types/**',
    ],
  },
});
