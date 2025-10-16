import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { init } from '../src/app.js';

describe('app initialization', () => {
  beforeEach(() => {
    // Ensure a clean DOM with an #app container
    document.body.innerHTML = '<div id="app"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('initializes application successfully', () => {
    // Mock console to avoid animation initialization errors in test environment
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => init()).not.toThrow();

    const app = document.querySelector('#app');

    expect(app).toBeTruthy();

    // Verify app div exists and init doesn't modify it
    // (content is now in static HTML, not dynamically generated)
    expect(app?.innerHTML).toBe('');

    consoleSpy.mockRestore();
  });
});
