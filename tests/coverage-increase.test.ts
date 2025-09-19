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
  it('renders the brand identity when #app exists', async () => {
    document.body.innerHTML = '<div id="app"></div>';

    const { init } = await import('../src/app.js');

    expect(() => init()).not.toThrow();

    const app = document.querySelector('#app');

    expect(app).toBeTruthy();
    expect(app?.textContent).toContain('Keep Shipping Fast');
    expect(app?.textContent).toContain('Coming Soon');
  });

  it('does not throw and logs an error when #app is missing', async () => {
    // Ensure no #app element
    document.body.innerHTML = '';

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { init } = await import('../src/app.js');

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

    await import('../src/main.js');

    expect(initMock).toHaveBeenCalled();
  });

  it('waits for DOMContentLoaded when document.readyState is loading', async () => {
    // Simulate loading state
    Object.defineProperty(document, 'readyState', { value: 'loading', configurable: true });

    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    await import('../src/main.js');

    // init should NOT be called immediately when loading
    expect(initMock).not.toHaveBeenCalled();

    // Dispatch the DOMContentLoaded event and expect init to be called
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(initMock).toHaveBeenCalled();
  });

  it('initializes analytics with default project ID when no environment variable is set', async () => {
    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    // Mock the Microsoft Clarity NPM package
    const clarityMock = {
      init: vi.fn(),
    };

    vi.doMock('@microsoft/clarity', () => ({
      default: clarityMock,
    }));

    await import('../src/main.js');

    // Wait for async analytics initialization
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(clarityMock.init).toHaveBeenCalledWith('t5zu4kays7');
  });

  it('initializes analytics with custom project ID from environment variable', async () => {
    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    // Mock environment variable
    vi.stubEnv('VITE_CLARITY_PROJECT_ID', 'custom-project-id');

    // Mock the Microsoft Clarity NPM package
    const clarityMock = {
      init: vi.fn(),
    };

    vi.doMock('@microsoft/clarity', () => ({
      default: clarityMock,
    }));

    await import('../src/main.js');

    // Wait for async analytics initialization
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(clarityMock.init).toHaveBeenCalledWith('custom-project-id');

    vi.unstubAllEnvs();
  });

  it('handles analytics script load success', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    // Mock the Microsoft Clarity NPM package to simulate successful initialization
    const clarityMock = {
      init: vi.fn(),
    };

    vi.doMock('@microsoft/clarity', () => ({
      default: clarityMock,
    }));

    await import('../src/main.js');

    // Wait for async analytics initialization
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Analytics initialized with Clarity project:',
      't5zu4kays7',
    );

    consoleSpy.mockRestore();
  });

  it('handles analytics script load failure', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    // Mock the Microsoft Clarity NPM package to simulate import failure
    vi.doMock('@microsoft/clarity', () => {
      throw new Error('Failed to import Clarity');
    });

    await import('../src/main.js');

    // Wait for async analytics initialization attempt
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleSpy).toHaveBeenCalledWith('Analytics initialization failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('handles analytics initialization errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const initMock = vi.fn();

    vi.doMock('../src/app', () => ({ init: initMock }));

    // Mock the Microsoft Clarity NPM package to throw during init
    const clarityMock = {
      init: vi.fn().mockImplementation(() => {
        throw new Error('Clarity init failed');
      }),
    };

    vi.doMock('@microsoft/clarity', () => ({
      default: clarityMock,
    }));

    await import('../src/main.js');

    // Wait for async analytics initialization attempt
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleSpy).toHaveBeenCalledWith('Analytics initialization failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('tracks traffic source after analytics initialization', async () => {
    const initMock = vi.fn();

    const analyzeTrafficSourceMock = vi.fn().mockReturnValue({
      category: 'direct',
      source: 'direct',
      referrer: '',
      isLinkedIn: false,
      isPaid: false,
      utmParams: {},
    });

    const trackTrafficSourceMock = vi.fn();

    const initializeBounceTrackingMock = vi.fn();

    const initializeSessionTrackingMock = vi.fn().mockReturnValue({
      sessionId: 'session_123',
      isNewVisitor: true,
      visitorType: 'new',
    });

    vi.doMock('../src/app', () => ({ init: initMock }));
    vi.doMock('../src/traffic-analytics', () => ({
      analyzeTrafficSource: analyzeTrafficSourceMock,
      trackTrafficSource: trackTrafficSourceMock,
      initializeBounceTracking: initializeBounceTrackingMock,
      initializeSessionTracking: initializeSessionTrackingMock,
    }));

    // Mock the Microsoft Clarity NPM package
    const clarityMock = {
      init: vi.fn(),
    };

    vi.doMock('@microsoft/clarity', () => ({
      default: clarityMock,
    }));

    await import('../src/main.js');

    // Wait for async analytics initialization and traffic tracking
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(analyzeTrafficSourceMock).toHaveBeenCalled();
    expect(trackTrafficSourceMock).toHaveBeenCalledWith({
      category: 'direct',
      source: 'direct',
      referrer: '',
      isLinkedIn: false,
      isPaid: false,
      utmParams: {},
    });
    expect(initializeSessionTrackingMock).toHaveBeenCalledWith({
      category: 'direct',
      source: 'direct',
      referrer: '',
      isLinkedIn: false,
      isPaid: false,
      utmParams: {},
    });
    expect(initializeBounceTrackingMock).toHaveBeenCalledWith({
      category: 'direct',
      source: 'direct',
      referrer: '',
      isLinkedIn: false,
      isPaid: false,
      utmParams: {},
    });
  });
});
