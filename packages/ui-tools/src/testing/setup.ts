import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';

/**
 * Standard jsdom test environment setup
 */
export function setupJsdomTestEnvironment(): void {
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
