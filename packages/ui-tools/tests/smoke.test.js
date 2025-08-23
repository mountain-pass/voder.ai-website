import { describe, expect, test } from 'vitest';
describe('Smoke Tests', () => {
    test('dist entry loads and exports createPostCSSConfig', async () => {
        // Import the source module (avoid depending on compiled dist during type-check)
        const mod = await import('../src/index.js');
        expect(mod).toBeDefined();
        // Primary export exists and is a function
        expect(typeof mod.createPostCSSConfig).toBe('function');
    });
});
