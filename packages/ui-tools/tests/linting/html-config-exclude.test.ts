import { describe, expect, it } from 'vitest';

import { createHTMLLintConfig } from '../../src/linting/html.js';
describe('HTML Linting Configuration – excludeRules', () => {
  it('should disable the title-require rule when excluded', () => {
    const config = createHTMLLintConfig({ excludeRules: ['title-require'] });

    const rules = config.rules ?? {};

    expect(rules['title-require']).toBe(false);
  });
});
