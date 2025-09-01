import { describe, expect, it } from 'vitest';

import { createCSSLintConfig } from '../../src/linting/css.js';
describe('CSS Linting Configuration – excludeRules', () => {
  it('should disable the color-hex-length rule when excluded', () => {
    const config = createCSSLintConfig({ excludeRules: ['color-hex-length'] });

    const rules = config.rules ?? {};

    expect(rules['color-hex-length']).toBeNull();
  });
});
