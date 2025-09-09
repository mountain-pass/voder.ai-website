import '@testing-library/jest-dom';

import { afterEach, vi } from 'vitest';
/**
 * Standard jsdom test environment setup
 *
 * All test-only global patches and mocks are gated to run only when executing
 * under the Vitest runtime. This prevents test-only behavior from leaking into
 * other runtimes.
 *
 * Hardened behavior:
 * - TextEncoder patch logs only when VITEST_VERBOSE === '1'
 * - Canvas 2D mock prevents axe-core crashes (doesn't enable color-contrast testing)
 * - Mock installation logs only when VITEST_VERBOSE === '1'
 */
export function setupJsdomTestEnvironment(): void {
  const isVitest =
    typeof globalThis !== 'undefined' &&
    (Boolean((globalThis as any).__vitest__) || Boolean(process.env.VITEST));

  if (!isVitest) {
    // Not running under Vitest — do nothing.
    return;
  }
  const verbose = process.env.VITEST_VERBOSE === '1';

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
      TextEncoder.prototype.encode = function (input) {
        try {
          const out = orig.call(this, input);

          return out instanceof Uint8Array ? out : new Uint8Array(out);
        } catch {
          // If original throws for unexpected reasons, fall back to safe behavior.
          return new Uint8Array();
        }
      };
      // Emit diagnostic only when explicitly requested
      if (verbose) {
        console.error(
          '[voder/ui-tools] Patched TextEncoder.encode to ensure Uint8Array for test environment',
        );
      }
    }
  } catch {
    // If TextEncoder is not present or checks fail, do nothing - tests will surface environment incompatibility.
  }
  // Cleanup DOM after each test
  afterEach(() => {
    // Manual DOM cleanup: remove all children from document.body so tests start with a clean DOM.
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
  // Provide a minimal Canvas 2D mock to prevent axe-core from crashing
  // when it probes for Canvas support during accessibility testing.
  // Note: This doesn't enable color-contrast testing (that's impossible in JSDOM),
  // but prevents crashes when running other accessibility rules.
  try {
    if (typeof HTMLCanvasElement !== 'undefined') {
      const proto = HTMLCanvasElement.prototype;

      // In JSDOM, always install the mock since getContext is not properly implemented
      (proto as any).getContext = function (contextType: string) {
        if (contextType === '2d') {
          return {
            createImageData: (width: number, height: number) => ({
              data: new Uint8ClampedArray(width * height * 4),
              width,
              height,
            }),
            getImageData: (_x: number, _y: number, width: number, height: number) => ({
              data: new Uint8ClampedArray(width * height * 4),
              width,
              height,
            }),
            putImageData: () => {
              /* no-op for tests */
            },
            drawImage: () => {
              /* no-op for tests */
            },
            fillRect: () => {
              /* no-op for tests */
            },
            clearRect: () => {
              /* no-op for tests */
            },
          };
        }

        return null;
      };
      if (verbose) {
        console.error(
          '[voder/ui-tools] Installed Canvas 2D mock to prevent axe-core crashes in JSDOM',
        );
      }
    }
  } catch (err) {
    if (verbose) {
      console.error('[voder/ui-tools] Failed to install Canvas 2D mock', err);
    }
  }
}
