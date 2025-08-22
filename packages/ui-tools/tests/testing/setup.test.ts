import { describe, expect,test } from 'vitest';

import { setupJsdomTestEnvironment } from '../../src/testing/setup.js';

describe('jsdom test environment setup', () => {
  test('setupJsdomTestEnvironment does not throw', () => {
    expect(() => setupJsdomTestEnvironment()).not.toThrow();
  });
});
