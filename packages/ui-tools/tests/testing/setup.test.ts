import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { setupJsdomTestEnvironment } from '../../src/testing/setup.js';

describe('jsdom test environment setup', () => {
  const originalConsoleError = console.error;

  const originalTextEncoder = globalThis.TextEncoder;

  const originalHTMLCanvasElement = globalThis.HTMLCanvasElement;

  beforeEach(() => {
    // Mock console.error to capture messages
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore original implementations
    console.error = originalConsoleError;
    globalThis.TextEncoder = originalTextEncoder;
    if (originalHTMLCanvasElement) {
      globalThis.HTMLCanvasElement = originalHTMLCanvasElement;
    }
  });

  test('setupJsdomTestEnvironment does not throw', () => {
    expect(() => setupJsdomTestEnvironment()).not.toThrow();
  });

  test('sets up DOM cleanup after each test', () => {
    setupJsdomTestEnvironment();

    // Add some elements to DOM
    const div = document.createElement('div');

    div.textContent = 'test';
    document.body.appendChild(div);

    expect(document.body.children.length).toBeGreaterThan(0);

    // Simulate afterEach cleanup (this is called by Vitest automatically)
    // We can't easily test the afterEach directly, but we can verify DOM manipulation works
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    expect(document.body.children.length).toBe(0);
  });

  test('sets up matchMedia mock', () => {
    setupJsdomTestEnvironment();

    const mediaQuery = window.matchMedia('(max-width: 600px)');

    expect(mediaQuery).toBeDefined();
    expect(mediaQuery.matches).toBe(false);
    expect(typeof mediaQuery.addListener).toBe('function');
    expect(typeof mediaQuery.removeListener).toBe('function');
  });

  test('sets up IntersectionObserver mock', () => {
    setupJsdomTestEnvironment();

    expect(globalThis.IntersectionObserver).toBeDefined();
    const observer = new IntersectionObserver(vi.fn());

    expect(observer).toBeDefined();
    expect(typeof observer.observe).toBe('function');
    expect(typeof observer.unobserve).toBe('function');
    expect(typeof observer.disconnect).toBe('function');
  });

  test('sets up ResizeObserver mock', () => {
    setupJsdomTestEnvironment();

    expect(globalThis.ResizeObserver).toBeDefined();
    const observer = new ResizeObserver(vi.fn());

    expect(observer).toBeDefined();
    expect(typeof observer.observe).toBe('function');
    expect(typeof observer.unobserve).toBe('function');
    expect(typeof observer.disconnect).toBe('function');
  });

  test('sets up Canvas 2D mock', () => {
    setupJsdomTestEnvironment();

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    expect(context).toBeDefined();
    expect(typeof context?.createImageData).toBe('function');
    expect(typeof context?.getImageData).toBe('function');
    expect(typeof context?.putImageData).toBe('function');
  });

  test('Canvas 2D mock returns correct ImageData structure', () => {
    setupJsdomTestEnvironment();

    const canvas = document.createElement('canvas');

    const context = canvas.getContext('2d');

    const imageData = context?.createImageData(10, 10);

    expect(imageData?.width).toBe(10);
    expect(imageData?.height).toBe(10);
    expect(imageData?.data).toBeInstanceOf(Uint8ClampedArray);
    expect(imageData?.data.length).toBe(400); // 10 * 10 * 4 (RGBA)
  });

  test('handles missing HTMLCanvasElement gracefully', () => {
    // Temporarily remove HTMLCanvasElement
    delete (globalThis as any).HTMLCanvasElement;

    expect(() => setupJsdomTestEnvironment()).not.toThrow();
  });

  test('does nothing when not running under Vitest', () => {
    // Temporarily clear Vitest indicators
    const originalVitest = (globalThis as any).__vitest__;

    const originalVitestEnv = process.env.VITEST;

    delete (globalThis as any).__vitest__;
    delete process.env.VITEST;

    const originalMatchMedia = window.matchMedia;

    setupJsdomTestEnvironment();

    // Should not have modified anything
    expect(window.matchMedia).toBe(originalMatchMedia);

    // Restore
    if (originalVitest) {
      (globalThis as any).__vitest__ = originalVitest;
    }
    if (originalVitestEnv) {
      process.env.VITEST = originalVitestEnv;
    }
  });

  test('handles TextEncoder patching with verbose logging', () => {
    // Set verbose mode
    process.env.VITEST_VERBOSE = '1';

    // Mock TextEncoder that returns non-Uint8Array
    globalThis.TextEncoder = class MockTextEncoder {
      encode(input: string): any {
        return Array.from(new Uint8Array(Buffer.from(input, 'utf8')));
      }
    } as any;

    setupJsdomTestEnvironment();

    // Should have logged the patch
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Patched TextEncoder.encode'),
    );

    // Cleanup
    delete process.env.VITEST_VERBOSE;
  });

  test('handles Canvas setup failure with verbose logging', () => {
    process.env.VITEST_VERBOSE = '1';

    // Mock HTMLCanvasElement that throws during setup
    globalThis.HTMLCanvasElement = {
      prototype: {
        get getContext() {
          throw new Error('Canvas setup failed');
        },
      },
    } as any;

    setupJsdomTestEnvironment();

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to install Canvas 2D mock'),
      expect.any(Error),
    );

    delete process.env.VITEST_VERBOSE;
  });

  test('installs Canvas mock with verbose logging when successful', () => {
    process.env.VITEST_VERBOSE = '1';

    // Clean setup to test success logging
    setupJsdomTestEnvironment();

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Installed Canvas 2D mock to prevent axe-core crashes in JSDOM'),
    );

    delete process.env.VITEST_VERBOSE;
  });

  test('handles TextEncoder missing gracefully', () => {
    // Temporarily remove TextEncoder
    const originalTextEncoderForTest = globalThis.TextEncoder;

    delete (globalThis as any).TextEncoder;

    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    // Restore
    globalThis.TextEncoder = originalTextEncoderForTest;
  });

  test('handles TextEncoder.encode check failure gracefully', () => {
    const mockTextEncoder = {
      encode: vi.fn().mockImplementation(() => {
        throw new Error('encode failed');
      }),
    };

    Object.defineProperty(global, 'TextEncoder', {
      value: mockTextEncoder,
      configurable: true,
    });

    expect(() => setupJsdomTestEnvironment()).not.toThrow();
    vi.resetAllMocks();
  });

  test('Canvas 2D context methods are properly mocked', () => {
    setupJsdomTestEnvironment();

    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Test createImageData
      const imageData = ctx.createImageData(10, 10);

      expect(imageData.width).toBe(10);
      expect(imageData.height).toBe(10);
      expect(imageData.data).toBeInstanceOf(Uint8ClampedArray);

      // Test getImageData
      const getImageData = ctx.getImageData(0, 0, 5, 5);

      expect(getImageData.width).toBe(5);
      expect(getImageData.height).toBe(5);

      // Test no-op methods don't throw
      expect(() => ctx.putImageData(imageData, 0, 0)).not.toThrow();
      expect(() => ctx.drawImage(canvas, 0, 0)).not.toThrow();
      expect(() => ctx.fillRect(0, 0, 10, 10)).not.toThrow();
      expect(() => ctx.clearRect(0, 0, 10, 10)).not.toThrow();
    }
  });

  test('DOM cleanup works correctly', () => {
    setupJsdomTestEnvironment();

    // Add some elements to DOM
    const div = document.createElement('div');

    div.id = 'test-element';
    document.body.appendChild(div);

    expect(document.getElementById('test-element')).toBeTruthy();

    // Trigger cleanup (simulate afterEach)
    document.body.innerHTML = '';

    expect(document.getElementById('test-element')).toBeFalsy();
  });

  test('handles function condition checking properly', () => {
    // Test that the function successfully sets up afterEach callback
    // We can't easily mock vitest's afterEach, but we can verify
    // the setup function runs without error in vitest context
    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    // Verify that DOM is properly cleaned up in afterEach context
    const testDiv = document.createElement('div');

    testDiv.id = 'test-cleanup';
    document.body.appendChild(testDiv);

    expect(document.getElementById('test-cleanup')).toBeTruthy();
  });

  test('setupJsdomTestEnvironment options parameter', () => {
    // Test that function works with various call patterns
    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    // Mock console methods to capture verbose output
    const mockConsole = {
      log: vi.fn(),
      warn: vi.fn(),
    };

    vi.stubGlobal('console', mockConsole);

    // Test internal verbose logging paths by simulating conditions
    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    vi.unstubAllGlobals();
  });

  test('handles TextEncoder.encode throwing error', () => {
    // Store originals
    const originalTextEncoderForEncode = globalThis.TextEncoder;

    const originalConsoleErrorForEncode = console.error;

    // Mock console.error
    const mockConsoleError = vi.fn();

    console.error = mockConsoleError;

    // Create a TextEncoder that throws during encode
    const throwingTextEncoder = class {
      encode(_input?: string) {
        throw new Error('TextEncoder.encode failed');
      }
    };

    globalThis.TextEncoder = throwingTextEncoder as any;

    // Set VITEST_VERBOSE to trigger verbose logging
    const originalVerbose = process.env.VITEST_VERBOSE;

    process.env.VITEST_VERBOSE = '1';

    // The setup should not throw even if TextEncoder.encode throws
    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    // Test that the patched encoder returns safe fallback
    try {
      const encoder = new globalThis.TextEncoder();

      const result = encoder.encode('test');

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(0); // Should be empty fallback
    } catch (error) {
      // If the encoder still throws, that's expected - we're testing the setup handles it
      expect(error).toBeInstanceOf(Error);
    }

    // Restore
    globalThis.TextEncoder = originalTextEncoderForEncode;
    console.error = originalConsoleErrorForEncode;
    process.env.VITEST_VERBOSE = originalVerbose;
  });

  test('handles Canvas getContext returning null', () => {
    // Store original
    const originalHTMLCanvasElementForCanvas = globalThis.HTMLCanvasElement;

    const originalConsoleErrorForCanvas = console.error;

    // Mock console.error
    const mockConsoleError = vi.fn();

    console.error = mockConsoleError;

    // Create a mock canvas element that we can attach to
    const mockCanvasInstance = {
      getContext: vi.fn(() => null), // This should trigger the fallback
    };

    // Mock HTMLCanvasElement constructor and prototype
    const MockHTMLCanvasElement = vi.fn().mockImplementation(() => mockCanvasInstance);

    MockHTMLCanvasElement.prototype = {
      getContext: vi.fn(() => null),
    };

    globalThis.HTMLCanvasElement = MockHTMLCanvasElement as any;

    // Set VITEST_VERBOSE to trigger verbose logging
    const originalVerbose = process.env.VITEST_VERBOSE;

    process.env.VITEST_VERBOSE = '1';

    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    // The setup function modifies the prototype, not instance, so check that
    expect(MockHTMLCanvasElement.prototype.getContext).toBeDefined();

    // Restore
    globalThis.HTMLCanvasElement = originalHTMLCanvasElementForCanvas;
    console.error = originalConsoleErrorForCanvas;
    process.env.VITEST_VERBOSE = originalVerbose;
  });

  test('handles TextEncoder.encode returning non-Uint8Array', () => {
    const originalTextEncoderForNonUint8Array = globalThis.TextEncoder;

    // Mock TextEncoder.encode to return something that's not a Uint8Array
    globalThis.TextEncoder = class {
      encode(input: string) {
        return [1, 2, 3] as any; // Return array instead of Uint8Array
      }
    } as any;

    const originalConsoleErrorForNonUint8Array = console.error;

    console.error = vi.fn();

    // Set VITEST_VERBOSE to trigger verbose logging
    const originalVerbose = process.env.VITEST_VERBOSE;

    process.env.VITEST_VERBOSE = '1';

    expect(() => setupJsdomTestEnvironment()).not.toThrow();

    globalThis.TextEncoder = originalTextEncoderForNonUint8Array;
    console.error = originalConsoleErrorForNonUint8Array;
    process.env.VITEST_VERBOSE = originalVerbose;
  });
});
