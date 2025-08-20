import { describe, expect, it } from 'vitest';

import { eslint, testing, typescript } from './index.js';

describe('public API surface', () => {
  it('exports typescript presets', () => {
    expect(typescript).toBeDefined();
    expect(typeof typescript).toBe('object');
    expect(typescript).toHaveProperty('base');
    expect(typescript).toHaveProperty('node');
    expect(typescript).toHaveProperty('library');
    expect(typescript).toHaveProperty('test');
  });

  it('exports eslint layers', () => {
    expect(eslint).toBeDefined();
    expect(eslint).toHaveProperty('base');
    expect(eslint).toHaveProperty('dx');
    expect(eslint).toHaveProperty('performance');
  });

  it('exports testing utilities', () => {
    expect(testing).toBeDefined();
    expect(typeof testing).toBe('object');
  });
});
