import { describe, expect, it } from 'vitest';

import { createPostCSSConfig } from '../../src/build/postcss.js';
describe('createPostCSSConfig', () => {
    it('returns a config with plugins array and at least one plugin', () => {
        const cfg = createPostCSSConfig();

        expect(cfg).toBeDefined();
        expect(Array.isArray(cfg.plugins)).toBe(true);
        expect(cfg.plugins.length).toBeGreaterThan(0);
    });
});
