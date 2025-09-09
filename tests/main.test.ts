import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { init } from '../src/app';

describe('app initialization', () => {
  beforeEach(() => {
    // Ensure a clean DOM with an #app container
    document.body.innerHTML = '<div id="app"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the Voder heading', () => {
    init();

    const app = document.querySelector('#app');

    expect(app).toBeTruthy();
    expect(app?.textContent).toContain('Voder');
  });
});
