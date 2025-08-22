import { describe, it, expect } from 'vitest';
import { createVitestJsdomConfig } from '../../src/testing/vitest-jsdom.js';

describe('Vitest jsdom configuration factory', () => {
  it('returns expected defaults for jsdom and coverage', () => {
    const config = createVitestJsdomConfig();

    // environment
    expect(config.test?.environment).toBe('jsdom');

    // setupFiles default (exact string expected by the factory)
    expect(config.test?.setupFiles).toEqual(['./src/test-setup.jsdom.ts']);

    // coverage provider
    expect(config.test?.coverage?.provider).toBe('v8');

    // coverage thresholds (narrow typing to avoid TS union property error)
    const coverage = config.test?.coverage as any;
    expect(coverage.thresholds).toEqual({
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    });
  });
});
