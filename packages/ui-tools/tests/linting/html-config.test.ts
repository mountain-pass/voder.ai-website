import { describe, expect,it } from 'vitest';

import { createHTMLLintConfig } from '../../src/linting/html.js';

describe('HTML Linting Configuration', () => {
  it('includes core HTMLHint rules by default', () => {
    const config = createHTMLLintConfig();

    const rules = (config as any).rules as Record<string, any>;

    expect(rules['title-require']).toBe(true);
    expect(rules['alt-require']).toBe(true);
    expect(rules['attr-lowercase']).toBe(true);
  });
});