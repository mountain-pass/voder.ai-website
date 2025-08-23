import { describe, it, expect } from 'vitest';
import { createHTMLLintConfig } from '../../src/linting/html.js';

describe('HTML Linting Configuration – excludeRules', () => {
  it('should disable the title-require rule when excluded', () => {
    const config = createHTMLLintConfig({ excludeRules: ['title-require'] });
    const rules = (config.rules ?? {}) as Record<string, any>;
    expect(rules['title-require']).toBe(false);
  });
});