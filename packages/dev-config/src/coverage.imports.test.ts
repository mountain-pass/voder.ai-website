import { describe, expect, it } from 'vitest';

describe('coverage - import surface', () => {
  it('loads runtime configs, eslint layers, linters and prettier without throwing', async () => {
    // typescript runtime loader (reads JSON presets)
    const tsModule = await import('../typescript/index.js');

    expect(tsModule).toBeDefined();
    expect(tsModule.typescript).toBeDefined();
    expect(tsModule.typescript).toHaveProperty('base');
    expect(tsModule.typescript).toHaveProperty('node');
    expect(tsModule.typescript).toHaveProperty('library');
    expect(tsModule.typescript).toHaveProperty('test');

    // eslint flat layers export
    const eslintIndex = await import('../eslint/index.js');

    expect(eslintIndex).toBeDefined();
    expect(eslintIndex).toHaveProperty('base');
    expect(eslintIndex).toHaveProperty('dx');
    expect(eslintIndex).toHaveProperty('performance');

    // individual eslint layer file execution (sanity)
    const performance = await import('../eslint/performance.js');

    expect(performance).toBeDefined();
    expect(Array.isArray(performance.default)).toBe(true);

    // linters stubs (markdown only) - currently TODO implementation
    const md = await import('../linters/markdown/index.js');

    expect(md).toBeDefined();
    // Note: getConfig() not yet implemented per ADR-0006 TODO

    // prettier top-level config (TypeScript config file)
    // Test that the prettier config exists and can be loaded
    // Note: TypeScript config requires NODE_OPTIONS="--experimental-strip-types" to be loaded by prettier
    const fs = await import('fs');

    const path = await import('path');

    const url = await import('url');

    const currentDir = path.dirname(url.fileURLToPath(import.meta.url));

    const prettierConfigPath = path.resolve(currentDir, '../prettier.config.ts');

    expect(fs.existsSync(prettierConfigPath)).toBe(true);

    // Verify the config exports the expected structure
    const configContent = fs.readFileSync(prettierConfigPath, 'utf-8');

    expect(configContent.length).toBeGreaterThan(0);
    expect(configContent).toContain('printWidth');
    expect(configContent).toContain('export default');

    // verify test setup mapping from testing entry
    const testing = await import('./testing/index.js');

    expect(testing).toBeDefined();
    expect(testing.testSetup).toBeDefined();
    expect(testing.testSetup.node).toContain('test-setup.node');
  });
});
