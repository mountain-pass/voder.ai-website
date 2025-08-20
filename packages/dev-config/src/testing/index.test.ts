import { describe, expect, it } from 'vitest';

import { createVitestNodeConfig, testSetup } from './index.js';

describe('testing factory exports', () => {
  it('createVitestNodeConfig returns node config shape', () => {
    const cfg = createVitestNodeConfig() as any;

    expect(cfg).toBeDefined();
    expect(cfg).toHaveProperty('test');
    expect(cfg.test.environment).toBe('node');
    expect(cfg.test).toHaveProperty('setupFiles');
  });

  it('testSetup mapping points to setup files', () => {
    expect(testSetup.node).toContain('test-setup.node');
  });
});
