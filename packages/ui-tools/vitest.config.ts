import { createVitestJsdomConfig } from './src/testing/vitest-jsdom.js';
export default createVitestJsdomConfig({
  vitestConfig: {
    resolve: { extensions: ['.ts', '.js', '.json'] },
  },
});
