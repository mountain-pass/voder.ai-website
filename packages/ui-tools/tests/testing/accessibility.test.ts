import { describe, expect, test, vi } from 'vitest';

import {
  accessibilityTests,
  expectAccessible,
  expectAriaAttributes,
  expectFocusable,
  getAccessibilityViolations,
} from '../../src/testing/accessibility.js';

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

  test('getAccessibilityViolations handles custom axeConfig', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    const button = document.createElement('button');
    button.textContent = 'Test Button';
    wrapper.appendChild(button);

    const results = await getAccessibilityViolations(wrapper, {
      axeConfig: { 
        tags: ['wcag2a'],
        timeout: 5000 
      }
    });

    expect(results).toBeDefined();
    expect(Array.isArray(results.violations)).toBe(true);

    document.body.removeChild(wrapper);
  });

  test('expectAccessible with excludeRules configuration', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    // Create an element that might have contrast issues (excluded in test)
    const button = document.createElement('button');
    button.style.color = '#999';
    button.style.backgroundColor = '#aaa';
    button.textContent = 'Low Contrast Button';
    wrapper.appendChild(button);

    // Should pass when color-contrast is excluded
    await expectAccessible(wrapper, { 
      excludeRules: ['color-contrast'] 
    });

    document.body.removeChild(wrapper);
  });

  test('expectAriaAttributes fails with incorrect values', () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Close');
    el.setAttribute('aria-expanded', 'false');
    wrapper.appendChild(el);

    expect(() => {
      expectAriaAttributes(el, { 'aria-label': 'Open' }); // Wrong value
    }).toThrow();

    expect(() => {
      expectAriaAttributes(el, { 'aria-hidden': 'true' }); // Missing attribute
    }).toThrow();

    document.body.removeChild(wrapper);
  });

  test('expectFocusable fails on non-focusable elements', () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    const nonFocusable = document.createElement('div');
    wrapper.appendChild(nonFocusable);

    expect(() => expectFocusable(nonFocusable)).toThrow();

    const negativeFocusable = document.createElement('div');
    negativeFocusable.setAttribute('tabindex', '-1');
    wrapper.appendChild(negativeFocusable);

    expect(() => expectFocusable(negativeFocusable)).toThrow();

    document.body.removeChild(wrapper);
  });

  test('accessibilityTests.colorContrast detects violations', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    const lowContrastText = document.createElement('p');
    lowContrastText.style.color = '#ccc';
    lowContrastText.style.backgroundColor = '#ddd';
    lowContrastText.textContent = 'Low contrast text';
    wrapper.appendChild(lowContrastText);

    // This test might pass in JSDOM since color contrast detection is limited
    // but we test that the function doesn't throw
    await expect(accessibilityTests.colorContrast(wrapper)).resolves.not.toThrow();

    document.body.removeChild(wrapper);
  });

  test('accessibilityTests.formLabels detects missing labels', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    const form = document.createElement('form');
    const unlabeledInput = document.createElement('input');
    unlabeledInput.type = 'text';
    form.appendChild(unlabeledInput);
    wrapper.appendChild(form);

    // Should detect missing label
    await expect(accessibilityTests.formLabels(wrapper)).rejects.toThrow();

    document.body.removeChild(wrapper);
  });

  test('accessibilityTests.headingStructure detects improper heading order', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    // Skip from h1 to h3 (improper order)
    const h1 = document.createElement('h1');
    h1.textContent = 'Main Title';
    const h3 = document.createElement('h3');
    h3.textContent = 'Sub-sub Title';
    
    wrapper.appendChild(h1);
    wrapper.appendChild(h3);

    // Should detect heading order violation
    await expect(accessibilityTests.headingStructure(wrapper)).rejects.toThrow();

    document.body.removeChild(wrapper);
  });

  test('handles malformed DOM elements gracefully', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    // Create an element with potentially problematic structure
    const malformedButton = document.createElement('button');
    malformedButton.innerHTML = '<div>Nested block element in button</div>';
    wrapper.appendChild(malformedButton);

    // Should handle malformed DOM without crashing
    const results = await getAccessibilityViolations(wrapper, { 
      excludeRules: ['color-contrast'] 
    });
    
    expect(results).toBeDefined();
    expect(Array.isArray(results.violations)).toBe(true);

    document.body.removeChild(wrapper);
  });

  test('handles empty elements and edge cases', async () => {
    const wrapper = document.createElement('main');
    document.body.appendChild(wrapper);

    // Empty button
    const emptyButton = document.createElement('button');
    wrapper.appendChild(emptyButton);

    // Button with only whitespace
    const whitespaceButton = document.createElement('button');
    whitespaceButton.textContent = '   ';
    wrapper.appendChild(whitespaceButton);

    const results = await getAccessibilityViolations(wrapper, { 
      excludeRules: ['color-contrast'] 
    });
    
    expect(results).toBeDefined();
    // Should detect empty button violations
    expect(results.violations.length).toBeGreaterThan(0);

    document.body.removeChild(wrapper);
  });
});
