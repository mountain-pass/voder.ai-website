import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { init } from '../src/app.js';

describe('app initialization', () => {
  beforeEach(() => {
    // Ensure a clean DOM with an #app container
    document.body.innerHTML = '<div id="app"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the brand identity', () => {
    init();

    const app = document.querySelector('#app');

    expect(app).toBeTruthy();
    expect(app?.textContent).toContain('AI Coding Without the Slop');
    expect(app?.textContent).toContain('Coming Soon');
  });
});
