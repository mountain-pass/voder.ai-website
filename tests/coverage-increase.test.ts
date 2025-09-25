import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Tests to increase coverage for src/app.ts and src/main.ts

beforeEach(() => {
  // Ensure a clean DOM and module cache before each test
  document.body.innerHTML = '';
  vi.resetModules();
  vi.restoreAllMocks();

  // Mock window.location if it doesn't exist
  if (!window.location) {
    Object.defineProperty(window, 'location', {
      value: {
        search: '',
        href: 'http://localhost:3000',
        hostname: 'localhost',
        pathname: '/',
        hash: '',
      },
      configurable: true,
    });
  }

  // Mock window.screen if it doesn't exist
  if (!window.screen) {
    Object.defineProperty(window, 'screen', {
      value: {
        width: 1920,
        height: 1080,
      },
      configurable: true,
    });
  }
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

  it('handles animation initialization error gracefully', async () => {
    document.body.innerHTML = '<div id="app"></div><div id="hero-animation"></div>';

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock ThreeAnimation to reject during init
    vi.doMock('../src/three-animation.js', () => ({
      ThreeAnimation: vi.fn().mockImplementation(() => ({
        init: vi.fn().mockRejectedValue(new Error('WebGL initialization failed')),
        pause: vi.fn(),
        resume: vi.fn(),
      })),
    }));

    const { init } = await import('../src/app.js');

    await init();

    // Wait for the async error to be caught
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '3D animation initialization failed:',
      expect.any(Error),
    );

    consoleWarnSpy.mockRestore();
  });

  it('handles matchMedia not being available', async () => {
    document.body.innerHTML = '<div id="app"></div><div id="hero-animation"></div>';

    // Mock canvas.getContext to return null (no WebGL support)
    const mockGetContext = vi.fn().mockReturnValue(null);

    const mockCanvas = {
      getContext: mockGetContext,
      width: 800,
      height: 600,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      style: {},
    } as any;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas;
      }

      // Return a basic mock element for other tag types
      const element = {
        tagName: tagName.toUpperCase(),
        style: {},
        appendChild: vi.fn(),
        removeChild: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as any;

      return element;
    });

    // Mock window without matchMedia
    const originalWindow = global.window;

    const originalMatchMedia = window.matchMedia;

    // @ts-ignore
    global.window = { ...originalWindow };
    delete (global.window as any).matchMedia;
    delete (window as any).matchMedia;

    const { init } = await import('../src/app.js');

    expect(() => init()).not.toThrow();

    // Restore window and matchMedia
    global.window = originalWindow;
    window.matchMedia = originalMatchMedia;
  });

  it('pauses animation when prefers-reduced-motion is enabled', async () => {
    document.body.innerHTML = '<div id="app"></div><div id="hero-animation"></div>';

    const pauseMock = vi.fn();

    const resumeMock = vi.fn();

    const addEventListenerMock = vi.fn();

    // Mock matchMedia to return matches: true
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: addEventListenerMock,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    vi.doMock('../src/three-animation.js', () => ({
      ThreeAnimation: vi.fn().mockImplementation(() => ({
        init: vi.fn().mockResolvedValue(undefined),
        pause: pauseMock,
        resume: resumeMock,
      })),
    }));

    const { init } = await import('../src/app.js');

    await init();

    expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(pauseMock).toHaveBeenCalled();
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('handles motion preference changes from reduced to normal', async () => {
    document.body.innerHTML = '<div id="app"></div><div id="hero-animation"></div>';

    const pauseMock = vi.fn();

    const resumeMock = vi.fn();

    let changeListener: any = null;

    const addEventListenerMock = vi.fn().mockImplementation((event, callback) => {
      if (event === 'change') {
        changeListener = callback;
      }
    });

    // Mock matchMedia to return matches: false initially
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: addEventListenerMock,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    vi.doMock('../src/three-animation.js', () => ({
      ThreeAnimation: vi.fn().mockImplementation(() => ({
        init: vi.fn().mockResolvedValue(undefined),
        pause: pauseMock,
        resume: resumeMock,
      })),
    }));

    const { init } = await import('../src/app.js');

    await init();

    // Simulate motion preference change from reduced to normal
    if (changeListener) {
      changeListener({ matches: false });
      expect(resumeMock).toHaveBeenCalled();
    }
  });

  it('handles motion preference changes from normal to reduced', async () => {
    document.body.innerHTML = '<div id="app"></div><div id="hero-animation"></div>';

    const pauseMock = vi.fn();

    const resumeMock = vi.fn();

    let changeListener: any = null;

    const addEventListenerMock = vi.fn().mockImplementation((event, callback) => {
      if (event === 'change') {
        changeListener = callback;
      }
    });

    // Mock matchMedia to return matches: false initially
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: addEventListenerMock,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: matchMediaMock,
    });

    vi.doMock('../src/three-animation.js', () => ({
      ThreeAnimation: vi.fn().mockImplementation(() => ({
        init: vi.fn().mockResolvedValue(undefined),
        pause: pauseMock,
        resume: resumeMock,
      })),
    }));

    const { init } = await import('../src/app.js');

    await init();

    // Simulate motion preference change from normal to reduced
    if (changeListener) {
      changeListener({ matches: true });
      expect(pauseMock).toHaveBeenCalled();
    }
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
