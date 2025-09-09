import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Tests to increase coverage for src/app.ts and src/main.ts

beforeEach(() => {
  // Ensure a clean DOM and module cache before each test
  document.body.innerHTML = '';
  vi.resetModules();
  vi.restoreAllMocks();
});

afterEach(() => {
  document.body.innerHTML = '';
  // Restore readyState to 'complete' to avoid leaking state between tests
  try {
    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });
  } catch {
    // ignore
  }
});

describe('src/app', () => {
  it('renders the Voder heading when #app exists', async () => {
    document.body.innerHTML = '<div id="app"></div>';

    const { init } = await import('../src/app');

    expect(() => init()).not.toThrow();

    const app = document.querySelector('#app');

    expect(app).toBeTruthy();
    expect(app?.textContent).toContain('Voder');
    expect(app?.textContent).toContain('Coming soon');
  });

  it('does not throw and logs an error when #app is missing', async () => {
    // Ensure no #app element
    document.body.innerHTML = '';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { init } = await import('../src/app');

    expect(() => init()).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('src/main', () => {
  it('calls init immediately when document.readyState is not loading', async () => {
    // Simulate a readyState where the DOM is already parsed
    Object.defineProperty(document, 'readyState', { value: 'complete', configurable: true });

    const initMock = vi.fn();

    // Mock the app module BEFORE importing main so the import uses the mocked init
    vi.doMock('../src/app', () => ({ init: initMock }));

    await import('../src/main');

    expect(initMock).toHaveBeenCalled();
  });

  it('waits for DOMContentLoaded when document.readyState is loading', async () => {
    // Simulate loading state
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    await import('../src/main');

    // init should NOT be called immediately when loading
    expect(initMock).not.toHaveBeenCalled();

    // Dispatch the DOMContentLoaded event and expect init to be called
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(initMock).toHaveBeenCalled();
  });
});
