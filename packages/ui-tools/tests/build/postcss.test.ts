import { describe, expect,it } from 'vitest';

import { createPostCSSConfig } from '../../src/build/postcss.js';

describe('createPostCSSConfig', () => {
  it('returns a config with plugins array and at least one plugin', () => {
    const cfg = createPostCSSConfig();

    expect(cfg).toBeDefined();
    expect(Array.isArray((cfg as any).plugins)).toBe(true);
    expect((cfg as any).plugins.length).toBeGreaterThan(0);
  });
});
