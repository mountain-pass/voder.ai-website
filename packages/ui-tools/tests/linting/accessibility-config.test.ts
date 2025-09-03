import { describe, expect, test } from 'vitest';

import { createAccessibilityLintConfig } from '../../src/linting/accessibility.js';

describe('Accessibility Linting Configuration', () => {
  test('includes core accessibility stylelint rules by default', () => {
    const config = createAccessibilityLintConfig();

    const rules = config.rules ?? {};

    expect(rules['a11y/content-property-no-static-value']).toBe(true);
    expect(rules['a11y/font-size-is-readable']).toBe(true);
    expect(rules['a11y/line-height-is-vertical-rhythmed']).toBe(true);
    expect(rules['a11y/no-outline-none']).toBe(true);
    expect(rules['a11y/selector-pseudo-class-focus']).toBe(true);
  });

  test('applies rule overrides', () => {
    const config = createAccessibilityLintConfig({
      rules: {
        'a11y/line-height-is-vertical-rhythmed': false,
        'custom-rule': 'warn',
      },
    });

    const rules = config.rules as any;

    expect(rules['a11y/line-height-is-vertical-rhythmed']).toBe(false);
    expect(rules['custom-rule']).toBe('warn');
    // Other default rules should still be present
    expect(rules['a11y/no-outline-none']).toBe(true);
  });

  test('excludes specified rules', () => {
    const config = createAccessibilityLintConfig({
      excludeRules: ['a11y/line-height-is-vertical-rhythmed', 'a11y/no-outline-none'],
    });

    const rules = config.rules as any;

    expect(rules['a11y/line-height-is-vertical-rhythmed']).toBe(null);
    expect(rules['a11y/no-outline-none']).toBe(null);
    // Non-excluded rules should still be enabled
    expect(rules['a11y/selector-pseudo-class-focus']).toBe(true);
  });

  test('handles empty options', () => {
    const config = createAccessibilityLintConfig({});

    const rules = config.rules ?? {};

    expect(config).toBeDefined();
    expect(config.plugins).toContain('stylelint-a11y');
    expect(rules['a11y/line-height-is-vertical-rhythmed']).toBe(true);
  });
});
