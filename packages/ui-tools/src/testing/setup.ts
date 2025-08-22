import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

/**
 * Standard jsdom test environment setup
 */
export function setupJsdomTestEnvironment(): void {
  // Defensive guard for esbuild / test runtime invariant:
  // Some test environments can return a non-Uint8Array from TextEncoder.encode,
  // which breaks esbuild's runtime invariant. Patch encode to always return a Uint8Array.
  try {
    const encoder = new TextEncoder();
    const sample = encoder.encode('');
    if (!(sample instanceof Uint8Array)) {
      const orig = TextEncoder.prototype.encode;
      // Replace with wrapper that coerces to Uint8Array when necessary.
      // Keep original behavior otherwise.
      // @ts-ignore - runtime patch for test environment only
      TextEncoder.prototype.encode = function (input: string) {
        try {
          const out = orig.call(this, input);
          return out instanceof Uint8Array ? out : new Uint8Array(out as any);
        } catch {
          // If original throws for unexpected reasons, fall back to safe behavior.
          return new Uint8Array();
        }
      };
      // Console-first diagnostic for history; OK if visible only during tests.
      console.error('[voder/ui-tools] Patched TextEncoder.encode to ensure Uint8Array for test environment');
    }
  } catch {
    // If TextEncoder is not present or checks fail, do nothing - tests will surface environment incompatibility.
  }

  // Cleanup DOM after each test
  afterEach(() => {
    // Manual DOM cleanup: remove all children from document.body so tests start with a clean DOM.
    // This replaces the previous cleanup() helper import which is not available in @testing-library/dom.
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    // Clear timers that tests may have registered
    vi.clearAllTimers();
  });

  // Mock common browser APIs not available in jsdom
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  // @ts-ignore - global typing in test environment
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  // @ts-ignore - global typing in test environment
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}
