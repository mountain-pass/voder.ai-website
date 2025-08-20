import { describe, expect, test } from 'vitest';

/**
 * Package Export Integration Tests
 *
 * Verifies that the actual package.json export paths work correctly
 * and provide the expected functionality when imported by consumers.
 * These tests use the real package export paths as defined in package.json.
 */
describe('Package Export Integration', () => {
  test('all package export paths are accessible', async () => {
    // Test actual package.json export paths work
    const mainImport = import('@voder/dev-config');

    const testingImport = import('@voder/dev-config/testing');

    const eslintImport = import('@voder/dev-config/eslint');

    const typescriptImport = import('@voder/dev-config/typescript');

    const prettierImport = import('@voder/dev-config/prettier');

    // All imports should resolve without error
    const [main, testing, eslint, typescript, prettier] = await Promise.all([
      mainImport,
      testingImport,
      eslintImport,
      typescriptImport,
      prettierImport,
    ]);

    expect(main).toBeDefined();
    expect(testing).toBeDefined();
    expect(eslint).toBeDefined();
    expect(typescript).toBeDefined();
    expect(prettier).toBeDefined();
  });

  test('testing export functionality works end-to-end', async () => {
    // Test that exported functions actually work when imported via package paths
    const { createVitestNodeConfig } = await import('@voder/dev-config/testing');

    // Should not throw and should return valid config
    expect(() => createVitestNodeConfig()).not.toThrow();
    const config = createVitestNodeConfig();

    expect(config).toBeDefined();
    expect(config).toHaveProperty('test');

    // Verify the config has expected Vitest structure
    const testConfig = config.test as any;

    expect(testConfig.environment).toBe('node');
    expect(testConfig.coverage).toBeDefined();
  });

  test('eslint export provides expected configurations', async () => {
    const eslintConfigs = await import('@voder/dev-config/eslint');

    // Should provide all required configuration layers
    expect(eslintConfigs.base).toBeDefined();
    expect(eslintConfigs.dx).toBeDefined();
    expect(eslintConfigs.performance).toBeDefined();

    // Each should be an array (flat config format)
    expect(Array.isArray(eslintConfigs.base)).toBe(true);
    expect(Array.isArray(eslintConfigs.dx)).toBe(true);
    expect(Array.isArray(eslintConfigs.performance)).toBe(true);
  });

  test('typescript export provides expected presets', async () => {
    const typescriptConfigs = await import('@voder/dev-config/typescript');

    // Should provide all required preset configurations
    expect(typescriptConfigs.base).toBeDefined();
    expect(typescriptConfigs.node).toBeDefined();
    expect(typescriptConfigs.library).toBeDefined();
    expect(typescriptConfigs.test).toBeDefined();

    // Each should be a configuration object
    expect(typeof typescriptConfigs.base).toBe('object');
    expect(typeof typescriptConfigs.node).toBe('object');
    expect(typeof typescriptConfigs.library).toBe('object');
    expect(typeof typescriptConfigs.test).toBe('object');
  });

  test('prettier export provides valid configuration', async () => {
    const prettierConfig = await import('@voder/dev-config/prettier');

    // Should provide a default export with valid Prettier config
    expect(prettierConfig.default).toBeDefined();
    expect(typeof prettierConfig.default).toBe('object');

    // Should have expected Prettier configuration properties
    expect(prettierConfig.default).toHaveProperty('semi');
    expect(prettierConfig.default).toHaveProperty('singleQuote');
    expect(prettierConfig.default).toHaveProperty('printWidth');
  });

  test('main index provides all expected re-exports', async () => {
    const main = await import('@voder/dev-config');

    // Should re-export all major configuration modules
    expect(main.testing).toBeDefined();
    expect(main.eslint).toBeDefined();
    expect(main.typescript).toBeDefined();

    // Re-exports should match dedicated path exports
    const dedicatedTesting = await import('@voder/dev-config/testing');

    const dedicatedEslint = await import('@voder/dev-config/eslint');

    const dedicatedTypescript = await import('@voder/dev-config/typescript');

    expect(main.testing.createVitestNodeConfig).toBe(dedicatedTesting.createVitestNodeConfig);
    expect(main.eslint.base).toBe(dedicatedEslint.base);
    expect(main.typescript.base).toBe(dedicatedTypescript.base);
  });
});
