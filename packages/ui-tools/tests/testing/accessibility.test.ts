import { describe, test, expect } from 'vitest';
import {
  getAccessibilityViolations,
  expectAccessible,
  expectAriaAttributes,
  expectFocusable
} from '../../src/testing/accessibility.js';

describe('Accessibility helpers', () => {
  test('getAccessibilityViolations detects color-contrast and missing label violations', async () => {
    // Low-contrast button
    const badButton = document.createElement('button');
    badButton.style.color = '#ccc';
    badButton.style.backgroundColor = '#ddd';
    badButton.textContent = 'Bad Button';
    document.body.appendChild(badButton);

    // Unlabeled form input
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'unlabeled-input';
    form.appendChild(input);
    document.body.appendChild(form);

    const results = await getAccessibilityViolations(document.body);

    // Expect a color-contrast violation
    expect(results.violations.some((v: any) => (v as any).id === 'color-contrast')).toBe(true);

    // Expect a missing label (label) violation
    expect(results.violations.some((v: any) => (v as any).id === 'label')).toBe(true);

    // Cleanup
    document.body.removeChild(badButton);
    document.body.removeChild(form);
  });

  test('expectAccessible succeeds on a corrected fixture', async () => {
    // High-contrast button
    const goodButton = document.createElement('button');
    goodButton.style.color = '#000';
    goodButton.style.backgroundColor = '#fff';
    goodButton.textContent = 'Good Button';
    document.body.appendChild(goodButton);

    // Labeled input
    const form = document.createElement('form');
    const label = document.createElement('label');
    label.htmlFor = 'named-input';
    label.textContent = 'Name';
    const input = document.createElement('input');
    input.id = 'named-input';
    form.appendChild(label);
    form.appendChild(input);
    document.body.appendChild(form);

    // Should not throw / should pass accessibility check
    await expectAccessible(document.body);

    // Cleanup
    document.body.removeChild(goodButton);
    document.body.removeChild(form);
  });

  test('expectAriaAttributes and expectFocusable validate element attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Close');
    el.setAttribute('tabindex', '0');
    document.body.appendChild(el);

    expectAriaAttributes(el, { 'aria-label': 'Close' });
    expectFocusable(el);

    document.body.removeChild(el);
  });
});
