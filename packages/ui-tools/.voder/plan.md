## NOW  
Refine the Canvas-2D shim in `src/testing/setup.ts` so that whenever `HTMLCanvasElement.prototype.getContext('2d')` is called—in any case—it returns a minimal, non-null 2D context object.

## NEXT  
- Fix the PostCSS merge logic in `src/build/vite-library.ts` to ensure user-supplied `postcssConfig.plugins` are appended after the default Autoprefixer plugin.  
- Run `npm run build && npm test` and iteratively resolve any remaining test failures until the full suite passes.

## LATER  
- Add a Vitest test to enforce exact version alignment between `vitest` and `@vitest/coverage-v8`.  
- Create a consumer-installation integration test in `tests/package-installation.test.ts` using `npm pack`.  
- Revisit and adjust the resolver settings in `createVitestJsdomConfig` or `vitest.config.ts` to address any leftover import-resolution issues.