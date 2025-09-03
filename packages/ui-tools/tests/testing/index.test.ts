import { describe, expect, test } from 'vitest';

// Import everything from the testing index to boost coverage
import * as testingIndex from '../../src/testing/index.js';

describe('testing index exports', () => {
  test('exports all expected functions', () => {
    expect(testingIndex.createVitestJsdomConfig).toBeDefined();
    expect(testingIndex.renderComponent).toBeDefined();
    expect(testingIndex.simulateClick).toBeDefined();
    expect(testingIndex.simulateKeypress).toBeDefined();
    expect(testingIndex.waitForAnimation).toBeDefined();
    expect(testingIndex.waitForNextFrame).toBeDefined();
    expect(testingIndex.expectAccessible).toBeDefined();
    expect(testingIndex.getAccessibilityViolations).toBeDefined();
    expect(testingIndex.expectAriaAttributes).toBeDefined();
    expect(testingIndex.expectFocusable).toBeDefined();
    expect(testingIndex.accessibilityTests).toBeDefined();
    expect(testingIndex.setupJsdomTestEnvironment).toBeDefined();
  });

  test('functions are callable', () => {
    expect(typeof testingIndex.createVitestJsdomConfig).toBe('function');
    expect(typeof testingIndex.renderComponent).toBe('function');
    expect(typeof testingIndex.simulateClick).toBe('function');
    expect(typeof testingIndex.simulateKeypress).toBe('function');
    expect(typeof testingIndex.waitForAnimation).toBe('function');
    expect(typeof testingIndex.waitForNextFrame).toBe('function');
    expect(typeof testingIndex.expectAccessible).toBe('function');
    expect(typeof testingIndex.getAccessibilityViolations).toBe('function');
    expect(typeof testingIndex.expectAriaAttributes).toBe('function');
    expect(typeof testingIndex.expectFocusable).toBe('function');
    expect(typeof testingIndex.setupJsdomTestEnvironment).toBe('function');
  });

  test('accessibilityTests contains expected methods', () => {
    expect(typeof testingIndex.accessibilityTests.colorContrast).toBe('function');
    expect(typeof testingIndex.accessibilityTests.formLabels).toBe('function');
    expect(typeof testingIndex.accessibilityTests.headingStructure).toBe('function');
  });
});
