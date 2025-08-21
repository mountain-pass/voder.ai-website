import { describe, test, expect } from 'vitest';

describe('Smoke Tests', () => {
  test('dist entry loads and exports createPostCSSConfig', async () => {
    // Import the compiled package entry
    const mod = await import('../dist/src/index.js');
    expect(mod).toBeDefined();

    // Primary export exists and is a function
    expect(typeof mod.createPostCSSConfig).toBe('function');
  });
});
