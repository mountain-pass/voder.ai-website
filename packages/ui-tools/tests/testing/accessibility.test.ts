import { describe, expect, test } from 'vitest';

import { expectAccessible, expectAriaAttributes, expectFocusable, getAccessibilityViolations } from '../../src/testing/accessibility.js';
describe('Accessibility helpers', () => {
    test('getAccessibilityViolations detects missing label violations (JSDOM-compatible)', async () => {
        // Create a single landmark wrapper for all fixtures to avoid unrelated axe landmark warnings
        const wrapper = document.createElement('main');

        document.body.appendChild(wrapper);
        // Low-contrast button (color-contrast is not reliable in JSDOM; exclude it)
        const badButton = document.createElement('button');

        badButton.style.color = '#ccc';
        badButton.style.backgroundColor = '#ddd';
        badButton.textContent = 'Bad Button';
        wrapper.appendChild(badButton);
        // Unlabeled form input
        const form = document.createElement('form');

        const input = document.createElement('input');

        input.type = 'text';
        input.id = 'unlabeled-input';
        form.appendChild(input);
        wrapper.appendChild(form);
        // Exclude color-contrast from JSDOM accessibility checks
        const results = await getAccessibilityViolations(wrapper, { excludeRules: ['color-contrast'] });

        // Expect a missing label (label) violation (JSDOM-compatible)
        expect(results.violations.some((v) => v.id === 'label')).toBe(true);
        // Cleanup wrapper and its children
        document.body.removeChild(wrapper);
    });
    test('expectAccessible succeeds on a corrected fixture', async () => {
        const wrapper = document.createElement('main');

        document.body.appendChild(wrapper);
        // High-contrast button
        const goodButton = document.createElement('button');

        goodButton.style.color = '#000';
        goodButton.style.backgroundColor = '#fff';
        goodButton.textContent = 'Good Button';
        wrapper.appendChild(goodButton);
        // Labeled input
        const form = document.createElement('form');

        const label = document.createElement('label');

        label.htmlFor = 'named-input';
        label.textContent = 'Name';
        const input = document.createElement('input');

        input.id = 'named-input';
        form.appendChild(label);
        form.appendChild(input);
        wrapper.appendChild(form);
        // Should not throw / should pass accessibility check
        await expectAccessible(wrapper);
        // Cleanup wrapper and its children
        document.body.removeChild(wrapper);
    });
    test('expectAriaAttributes and expectFocusable validate element attributes', () => {
        const wrapper = document.createElement('main');

        document.body.appendChild(wrapper);
        const el = document.createElement('div');

        el.setAttribute('aria-label', 'Close');
        el.setAttribute('tabindex', '0');
        wrapper.appendChild(el);
        expectAriaAttributes(el, { 'aria-label': 'Close' });
        expectFocusable(el);
        // Cleanup wrapper and its children
        document.body.removeChild(wrapper);
    });
});
