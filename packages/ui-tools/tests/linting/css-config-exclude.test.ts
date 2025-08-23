import { describe, it, expect } from 'vitest';
import { createCSSLintConfig } from '../../src/linting/css.js';

describe('CSS Linting Configuration – excludeRules', () => {
  it('should disable the color-hex-length rule when excluded', () => {
    const config = createCSSLintConfig({ excludeRules: ['color-hex-length'] });
    const rules = (config.rules ?? {}) as Record<string, any>;
    expect(rules['color-hex-length']).toBeNull();
  });
});
