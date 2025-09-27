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

  // Mock requestAnimationFrame and cancelAnimationFrame for animation testing
  if (typeof window !== 'undefined') {
    let animationId = 0;

    window.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
      const id = ++animationId;

      setTimeout(() => callback(Date.now()), 16); // ~60fps

      return id;
    });
    window.cancelAnimationFrame = vi.fn().mockImplementation(() => {
      // No-op for tests
    });
  }

  // Enhance DOM Element prototypes for Three.js compatibility
  if (typeof HTMLElement !== 'undefined') {
    // Override appendChild to handle non-standard Three.js DOM elements better
    const originalAppendChild = HTMLElement.prototype.appendChild;

    HTMLElement.prototype.appendChild = function <T extends Node>(child: T): T {
      try {
        // If it's a regular DOM node, use the original method
        if (child && child.nodeType && child.nodeType > 0) {
          return originalAppendChild.call(this, child) as T;
        }

        // If it looks like a Three.js renderer dom element (has canvas-like properties)
        if (
          child &&
          typeof child === 'object' &&
          ('width' in child || 'height' in child || 'getContext' in child)
        ) {
          // Create a mock canvas element to represent it
          const mockCanvas = document.createElement('canvas');

          if ('width' in child && typeof child.width === 'number') {
            mockCanvas.width = child.width;
          }
          if ('height' in child && typeof child.height === 'number') {
            mockCanvas.height = child.height;
          }

          return originalAppendChild.call(this, mockCanvas) as T;
        }

        // For other objects that might be renderer elements, create a div
        const mockElement = document.createElement('div');

        return originalAppendChild.call(this, mockElement) as T;
      } catch {
        // If all else fails, create a mock element
        const mockElement = document.createElement('div');

        return originalAppendChild.call(this, mockElement) as T;
      }
    };

    if (verbose) {
      console.error('[voder/ui-tools] Enhanced DOM element appendChild for Three.js compatibility');
    }
  }
  // Provide Canvas mock with WebGL support for Three.js testing
  // This prevents crashes when Three.js tries to create rendering contexts
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

        // Mock WebGL contexts for Three.js testing
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
          return {
            // Core WebGL context properties that Three.js checks for
            canvas: this,
            drawingBufferWidth: this.width || 300,
            drawingBufferHeight: this.height || 150,

            // WebGL context methods (minimal implementation)
            getExtension: () => null,
            getParameter: (param: number) => {
              // Return reasonable defaults for common parameters
              switch (param) {
                case 0x1f00:
                  return 'WebGL Mock'; // GL_VENDOR
                case 0x1f01:
                  return 'WebGL Mock Renderer'; // GL_RENDERER
                case 0x1f02:
                  return '1.0'; // GL_VERSION
                default:
                  return null;
              }
            },

            // Shader and program methods
            createShader: () => ({}),
            createProgram: () => ({}),
            shaderSource: () => {},
            compileShader: () => {},
            attachShader: () => {},
            linkProgram: () => {},
            useProgram: () => {},
            getShaderParameter: () => true,
            getProgramParameter: () => true,

            // Buffer methods
            createBuffer: () => ({}),
            bindBuffer: () => {},
            bufferData: () => {},

            // Texture methods
            createTexture: () => ({}),
            bindTexture: () => {},
            texImage2D: () => {},
            texParameteri: () => {},
            generateMipmap: () => {},

            // Rendering methods
            viewport: () => {},
            clear: () => {},
            clearColor: () => {},
            clearDepth: () => {},
            enable: () => {},
            disable: () => {},
            depthFunc: () => {},
            blendFunc: () => {},

            // Vertex attributes
            getAttribLocation: () => 0,
            getUniformLocation: () => ({}),
            enableVertexAttribArray: () => {},
            vertexAttribPointer: () => {},
            uniform1i: () => {},
            uniform1f: () => {},
            uniform2f: () => {},
            uniform3f: () => {},
            uniform4f: () => {},
            uniformMatrix3fv: () => {},
            uniformMatrix4fv: () => {},

            // Drawing
            drawArrays: () => {},
            drawElements: () => {},

            // Constants that Three.js might access
            TRIANGLES: 4,
            UNSIGNED_SHORT: 5123,
            FLOAT: 5126,
            DEPTH_TEST: 2929,
            CULL_FACE: 2884,
            BLEND: 3042,
            SRC_ALPHA: 770,
            ONE_MINUS_SRC_ALPHA: 771,
            LEQUAL: 515,
            COLOR_BUFFER_BIT: 16384,
            DEPTH_BUFFER_BIT: 256,
          };
        }

        return null;
      };

      if (verbose) {
        console.error(
          '[voder/ui-tools] Installed Canvas mock with WebGL support for Three.js testing',
        );
      }
    }
  } catch (err) {
    if (verbose) {
      console.error('[voder/ui-tools] Failed to install Canvas mock', err);
    }
  }
}
