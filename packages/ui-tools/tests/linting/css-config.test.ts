import { describe, expect,it } from 'vitest';

import { createCSSLintConfig } from '../../src/linting/css.js';

describe('CSS Linting Configuration', () => {
  it('includes core CSS stylelint rules by default', () => {
    const config = createCSSLintConfig();

    const rules = (config.rules ?? {}) as Record<string, any>;

    expect(rules['order/properties-alphabetical-order']).toBe(true);
    expect(rules['color-hex-length']).toBe('short');
    expect(rules['color-no-invalid-hex']).toBe(true);
  });
});