import { describe, expect, test } from 'vitest';

/**
 * Package Smoke Tests
 *
 * Verifies basic functionality without errors - ensures that all exports
 * can be loaded successfully and have the expected basic structure.
 * These are "does it work at all" tests that should catch major issues.
 */
describe('Package Smoke Tests', () => {
  test('all exports load without throwing', async () => {
    // Import all package exports and verify they load successfully
    await expect(import('@voder/dev-config')).resolves.toBeDefined();
    await expect(import('@voder/dev-config/testing')).resolves.toBeDefined();
    await expect(import('@voder/dev-config/eslint')).resolves.toBeDefined();
    await expect(import('@voder/dev-config/typescript')).resolves.toBeDefined();
    await expect(import('@voder/dev-config/prettier')).resolves.toBeDefined();
  });

  test('main exports have expected shape', async () => {
    const main = await import('@voder/dev-config');

    // Verify main exports structure without deep inspection
    expect(main.testing).toBeDefined();
    expect(main.eslint).toBeDefined();
    expect(main.typescript).toBeDefined();

    // Verify basic types
    expect(typeof main.testing).toBe('object');
    expect(typeof main.eslint).toBe('object');
    expect(typeof main.typescript).toBe('object');
  });

  test('testing module exports core functionality', async () => {
    const testing = await import('@voder/dev-config/testing');

    // Should export the main configuration function
    expect(testing.createVitestNodeConfig).toBeDefined();
    expect(typeof testing.createVitestNodeConfig).toBe('function');

    // Function should be callable without throwing
    expect(() => testing.createVitestNodeConfig()).not.toThrow();
  });

  test('eslint module exports configuration arrays', async () => {
    const eslint = await import('@voder/dev-config/eslint');

    // Should export all required configuration layers
    expect(eslint.base).toBeDefined();
    expect(eslint.dx).toBeDefined();
    expect(eslint.performance).toBeDefined();

    // Each should be an array (ESLint 9 flat config format)
    expect(Array.isArray(eslint.base)).toBe(true);
    expect(Array.isArray(eslint.dx)).toBe(true);
    expect(Array.isArray(eslint.performance)).toBe(true);

    // Arrays should not be empty
    expect(eslint.base.length).toBeGreaterThan(0);
    expect(eslint.dx.length).toBeGreaterThan(0);
    expect(eslint.performance.length).toBeGreaterThan(0);
  });

  test('typescript module exports configuration objects', async () => {
    const typescript = await import('@voder/dev-config/typescript');

    // Should export all required preset configurations
    expect(typescript.base).toBeDefined();
    expect(typescript.node).toBeDefined();
    expect(typescript.library).toBeDefined();
    expect(typescript.test).toBeDefined();

    // Each should be a configuration object
    expect(typeof typescript.base).toBe('object');
    expect(typeof typescript.node).toBe('object');
    expect(typeof typescript.library).toBe('object');
    expect(typeof typescript.test).toBe('object');

    // Should not be null or arrays
    expect(typescript.base).not.toBeNull();
    expect(typescript.node).not.toBeNull();
    expect(typescript.library).not.toBeNull();
    expect(typescript.test).not.toBeNull();
    expect(Array.isArray(typescript.base)).toBe(false);
    expect(Array.isArray(typescript.node)).toBe(false);
    expect(Array.isArray(typescript.library)).toBe(false);
    expect(Array.isArray(typescript.test)).toBe(false);
  });

  test('prettier module exports valid configuration', async () => {
    const prettier = await import('@voder/dev-config/prettier');

    // Should have a default export
    expect(prettier.default).toBeDefined();
    expect(typeof prettier.default).toBe('object');
    expect(prettier.default).not.toBeNull();
    expect(Array.isArray(prettier.default)).toBe(false);

    // Should have basic Prettier properties (smoke test only)
    expect(prettier.default).toHaveProperty('semi');
    expect(prettier.default).toHaveProperty('singleQuote');
  });

  test('re-exported modules maintain functionality', async () => {
    const main = await import('@voder/dev-config');

    // Re-exported testing functionality should work
    expect(main.testing.createVitestNodeConfig).toBeDefined();
    expect(typeof main.testing.createVitestNodeConfig).toBe('function');
    expect(() => main.testing.createVitestNodeConfig()).not.toThrow();

    // Re-exported eslint configurations should be arrays
    expect(Array.isArray(main.eslint.base)).toBe(true);
    expect(Array.isArray(main.eslint.dx)).toBe(true);
    expect(Array.isArray(main.eslint.performance)).toBe(true);

    // Re-exported typescript configurations should be objects
    expect(typeof main.typescript.base).toBe('object');
    expect(typeof main.typescript.node).toBe('object');
    expect(typeof main.typescript.library).toBe('object');
    expect(typeof main.typescript.test).toBe('object');
  });
});
