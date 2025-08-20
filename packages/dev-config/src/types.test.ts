import { describe, expect, it } from 'vitest';

import { __runtimeShim } from './types.js';

describe('types runtime shim', () => {
  it('exports __runtimeShim === true', () => {
    expect(__runtimeShim).toBe(true);
  });
});
