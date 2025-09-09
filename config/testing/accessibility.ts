import type { AxeResults } from 'axe-core';
import { axe, toHaveNoViolations } from 'jest-axe';

// Extend Vitest/Jest expect with accessibility matchers
expect.extend(toHaveNoViolations);

export interface AccessibilityTestOptions {
  axeConfig?: any;
  excludeRules?: string[];
}

/**
 * Accessibility testing helper (jsdom/browser-only)
 *
 * Runs axe on the provided element with optional configuration and excluded rules,
 * and asserts that there are no violations.
 */
export async function expectAccessible(
  element: Element,
  options: AccessibilityTestOptions = {},
): Promise<void> {
  const { axeConfig = {}, excludeRules = [] } = options;

  const config = {
    ...axeConfig,
    // explicit types for the reduce accumulator and rule parameter
    rules: excludeRules.reduce((acc: Record<string, any>, rule: string) => {
      acc[rule] = { enabled: false };

      return acc;
    }, {}),
  };

  const results = await axe(element, config);

  // Cast expect to any so the matcher is accepted by the TypeScript compiler
  (expect(results) as any).toHaveNoViolations();
}

/**
 * Run axe on the provided element and return the raw AxeResults.
 * Applies excludeRules in the same manner as expectAccessible.
 */
export async function getAccessibilityViolations(
  element: Element,
  options: AccessibilityTestOptions = {},
): Promise<AxeResults> {
  const { axeConfig = {}, excludeRules = [] } = options;

  const config = {
    ...axeConfig,
    rules: excludeRules.reduce((acc: Record<string, any>, rule: string) => {
      acc[rule] = { enabled: false };

      return acc;
    }, {}),
  };

  return await axe(element, config);
}

/**
 * Assert that an element has the expected ARIA attributes.
 */
export function expectAriaAttributes(
  element: Element,
  expectedAttrs: Record<string, string>,
): void {
  Object.entries(expectedAttrs).forEach(([attr, value]) => {
    const actualValue = element.getAttribute(attr);

    expect(actualValue).toBe(value);
  });
}
/**
 * Assert that an element is focusable (has tabindex and it's not -1).
 */
export function expectFocusable(element: Element): void {
  expect(element).toHaveAttribute('tabindex');
  expect(element.getAttribute('tabindex')).not.toBe('-1');
}

/**
 * Common accessibility test scenarios (convenience helpers).
 */
export const accessibilityTests = {
  /**
   * Test for color contrast violations
   */
  async colorContrast(element: Element): Promise<void> {
    const results = await axe(element, {
      rules: {
        'color-contrast': { enabled: true },
      },
    });

    const violations = results.violations;

    expect(violations.filter((v: any) => v.id === 'color-contrast')).toHaveLength(0);
  },
  /**
   * Test for missing form labels
   */
  async formLabels(element: Element): Promise<void> {
    const results = await axe(element, {
      rules: {
        label: { enabled: true },
      },
    });

    const violations = results.violations;

    expect(violations.filter((v: any) => v.id === 'label')).toHaveLength(0);
  },
  /**
   * Test for proper heading structure
   */
  async headingStructure(element: Element): Promise<void> {
    const results = await axe(element, {
      rules: {
        'heading-order': { enabled: true },
      },
    });

    const violations = results.violations;

    expect(violations.filter((v: any) => v.id === 'heading-order')).toHaveLength(0);
  },
};
