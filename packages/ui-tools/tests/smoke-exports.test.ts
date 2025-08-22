import { describe, test, expect } from 'vitest';

describe('Package root exports', () => {
  test('exports core API functions', async () => {
    const mod = await import('../src/index.js');

    expect(mod).toBeDefined();
    expect(typeof mod.createPostCSSConfig).toBe('function');
    expect(typeof mod.createViteLibraryConfig).toBe('function');
    expect(typeof mod.createVitestJsdomConfig).toBe('function');
    expect(typeof mod.renderComponent).toBe('function');
    expect(typeof mod.expectAccessible).toBe('function');
    expect(typeof mod.setupJsdomTestEnvironment).toBe('function');
  });
});
