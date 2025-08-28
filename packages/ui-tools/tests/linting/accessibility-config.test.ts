import { describe, expect, it } from 'vitest';

import { createAccessibilityLintConfig } from '../../src/linting/accessibility.js';
describe('Accessibility Linting Configuration', () => {
    it('includes core accessibility stylelint rules by default', () => {
        const config = createAccessibilityLintConfig();

        const rules = (config.rules ?? {});

        expect(rules['a11y/content-property-no-static-value']).toBe(true);
        expect(rules['a11y/font-size-is-readable']).toBe(true);
    });
});
