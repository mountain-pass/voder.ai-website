import { describe, expect, test } from 'vitest';

/**
 * Export Equivalence Tests
 *
 * Ensures that both export patterns (dedicated paths vs main index) provide
 * identical functionality as required by the Universal Development Guide.
 *
 * Note: Uses relative imports since package isn't published yet.
 */
describe('Export Equivalence', () => {
  test('testing exports are equivalent', async () => {
    // Dedicated path import (simulated)
    const dedicatedTesting = await import('../testing/index.js');

    // Main index import
    const { testing: indexTesting } = await import('../index.js');

    // Verify same functionality available
    expect(typeof dedicatedTesting.createVitestNodeConfig).toBe('function');
    expect(typeof indexTesting.createVitestNodeConfig).toBe('function');

    // Verify identical configuration output
    const dedicatedConfig = dedicatedTesting.createVitestNodeConfig();

    const indexConfig = indexTesting.createVitestNodeConfig();

    expect(dedicatedConfig).toEqual(indexConfig);
  });

  test('eslint exports are equivalent', async () => {
    const dedicatedEslint = await import('../../eslint/index.js');

    const { eslint: indexEslint } = await import('../index.js');

    // Verify all layer exports are equivalent
    expect(dedicatedEslint.base).toEqual(indexEslint.base);
    expect(dedicatedEslint.dx).toEqual(indexEslint.dx);
    expect(dedicatedEslint.performance).toEqual(indexEslint.performance);
  });

  test('typescript exports are equivalent', async () => {
    const dedicatedTypescript = await import('../../typescript/index.js');

    const { typescript: indexTypescript } = await import('../index.js');

    // Verify all preset exports are equivalent
    expect(dedicatedTypescript.base).toEqual(indexTypescript.base);
    expect(dedicatedTypescript.node).toEqual(indexTypescript.node);
    expect(dedicatedTypescript.library).toEqual(indexTypescript.library);
    expect(dedicatedTypescript.test).toEqual(indexTypescript.test);
  });

  test('all main index exports are accessible', async () => {
    const mainExports = await import('../index.js');

    // Verify all expected exports are present
    expect(mainExports.testing).toBeDefined();
    expect(mainExports.eslint).toBeDefined();
    expect(mainExports.typescript).toBeDefined();

    // Verify types
    expect(typeof mainExports.testing).toBe('object');
    expect(typeof mainExports.eslint).toBe('object');
    expect(typeof mainExports.typescript).toBe('object');
  });

  test('dedicated path exports are accessible', async () => {
    // Verify all dedicated paths work independently
    const testingImport = import('../testing/index.js');

    const eslintImport = import('../../eslint/index.js');

    const typescriptImport = import('../../typescript/index.js');

    // All imports should resolve without error
    const [testing, eslint, typescript] = await Promise.all([
      testingImport,
      eslintImport,
      typescriptImport,
    ]);

    expect(testing).toBeDefined();
    expect(eslint).toBeDefined();
    expect(typescript).toBeDefined();
  });
});
