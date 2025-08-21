import { describe, test, expect } from 'vitest';
import { setupJsdomTestEnvironment } from '../../src/testing/setup.ts';

describe('jsdom test environment setup', () => {
  test('setupJsdomTestEnvironment does not throw', () => {
    expect(() => setupJsdomTestEnvironment()).not.toThrow();
  });
});
