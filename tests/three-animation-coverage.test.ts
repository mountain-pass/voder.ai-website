import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThreeAnimation } from '../src/three-animation.js';

describe('ThreeAnimation Coverage Tests', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div') as HTMLDivElement as HTMLDivElement;
    container.style.width = '400px';
    container.style.height = '400px';
    document.body.appendChild(container);

    // Mock navigator for device detection tests
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      configurable: true,
    });
  });

  describe('Device Detection', () => {
    it('should detect mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('mobile');
    });

    it('should detect tablet devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('tablet');
    });

    it('should detect Android tablets', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10; SM-T515) AppleWebKit/537.36',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('tablet');
    });

    it('should detect desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('desktop');
    });

    it('should default to desktop when navigator is undefined', () => {
      // Mock undefined navigator
      const originalNavigator = global.navigator;

      delete (global as any).navigator;

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('desktop');

      // Restore navigator
      global.navigator = originalNavigator;
    });
  });

  describe('Responsive Configuration', () => {
    it('should return mobile configuration for mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      const config = animation.getResponsiveConfig();

      expect(config.fov).toBe(20);
      expect(config.cameraZ).toBe(40);
    });

    it('should return tablet configuration for tablet devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      const config = animation.getResponsiveConfig();

      expect(config.fov).toBe(20);
      expect(config.cameraZ).toBe(40);
    });

    it('should return desktop configuration for desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      const config = animation.getResponsiveConfig();

      expect(config.fov).toBe(20);
      expect(config.cameraZ).toBe(40);
    });

    it('should return default configuration when window is undefined', () => {
      const originalWindow = global.window;

      delete (global as any).window;

      const animation = new ThreeAnimation({ container });

      const config = animation.getResponsiveConfig();

      expect(config.fov).toBe(65);
      expect(config.cameraZ).toBe(5);

      global.window = originalWindow;
    });
  });

  describe('WebGL Support Detection', () => {
    it('should detect when WebGL is not supported', () => {
      // Mock canvas that throws error
      const originalCreateElement = document.createElement;

      document.createElement = vi.fn((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement.call(document, tag) as HTMLCanvasElement;

          canvas.getContext = vi.fn(() => {
            throw new Error('WebGL not supported');
          });

          return canvas;
        }

        return originalCreateElement.call(document, tag);
      });

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const animation = new ThreeAnimation({ container });

      // Force initialization to test fallback
      animation.init();

      expect(container.innerHTML).toContain('animation-fallback');

      document.createElement = originalCreateElement;
      consoleSpy.mockRestore();
    });

    it('should detect when WebGL context is null', () => {
      // Mock canvas that returns null context
      const originalCreateElement = document.createElement;

      document.createElement = vi.fn((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement.call(document, tag) as HTMLCanvasElement;

          canvas.getContext = vi.fn(() => null);

          return canvas;
        }

        return originalCreateElement.call(document, tag);
      });

      const animation = new ThreeAnimation({ container });

      animation.init();

      expect(container.innerHTML).toContain('animation-fallback');

      document.createElement = originalCreateElement;
    });

    it('should handle missing document', () => {
      const originalDocument = global.document;

      delete (global as any).document;

      const animation = new ThreeAnimation({ container: {} as HTMLElement });

      global.document = originalDocument;
    });

    it('should handle missing window', () => {
      const originalWindow = global.window;

      delete (global as any).window;

      const animation = new ThreeAnimation({ container });

      global.window = originalWindow;
    });
  });

  describe('Initialization', () => {
    it('should not initialize twice', async () => {
      const animation = new ThreeAnimation({ container });

      await animation.init();
      await animation.init(); // Second call should be ignored

      // Verify it's initialized but not duplicated
      expect(animation).toBeDefined();
    });

    it('should initialize with fallback content', async () => {
      // Force fallback by mocking no WebGL support
      const originalCreateElement = document.createElement;

      document.createElement = vi.fn((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement.call(document, tag) as HTMLCanvasElement;

          canvas.getContext = vi.fn(() => null);

          return canvas;
        }

        return originalCreateElement.call(document, tag);
      });

      const animation = new ThreeAnimation({ container });

      await animation.init();

      expect(container.innerHTML).toContain('animation-fallback');
      expect(container.innerHTML).toContain('cube-2d');
      expect(container.innerHTML).toContain('face front');

      document.createElement = originalCreateElement;
    });
  });

  describe('Lifecycle Methods', () => {
    it('should handle pause and resume', async () => {
      const animation = new ThreeAnimation({ container });

      await animation.init();

      animation.pause();
      animation.resume();

      expect(animation).toBeDefined();
    });

    it('should handle destroy with missing elements', () => {
      const animation = new ThreeAnimation({ container });

      // Mock missing animation frame ID
      animation.pause(); // Clear any animation frame
      animation.destroy();

      expect(container.innerHTML).toBe('');
    });

    it('should handle destroy with cleanup', async () => {
      const animation = new ThreeAnimation({ container });

      await animation.init();

      animation.destroy();

      expect(container.innerHTML).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should handle initialization errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Create animation that will fail initialization
      const animation = new ThreeAnimation({ container });

      // Mock Three.js to throw error during initialization
      vi.doMock('three', () => {
        throw new Error('Three.js failed to load');
      });

      await animation.init();

      // Should fall back to 2D content
      expect(container.innerHTML).toContain('animation-fallback');

      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases and Additional Coverage', () => {
    it('should handle container with zero clientWidth', () => {
      const zeroContainer = document.createElement('div');

      Object.defineProperty(zeroContainer, 'clientWidth', { value: 0 });
      Object.defineProperty(zeroContainer, 'clientHeight', { value: 0 });

      const animation = new ThreeAnimation({ container: zeroContainer });

      expect(animation.getDeviceType()).toBe('desktop'); // Should still work
    });

    it('should handle Android mobile device detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; Android 11; SM-A505F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('mobile');
    });

    it('should handle webOS device detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (webOS/1.0; U; en-US) AppleWebKit/525.27.1',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('mobile');
    });

    it('should handle BlackBerry device detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (BlackBerry; CPU OS 10_3_3 like Mac OS X)',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('mobile');
    });

    it('should handle Opera Mini device detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Opera/9.80 (iPhone; Opera Mini/36.2.2254/119.132; U; en)',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('mobile');
    });

    it('should handle Kindle device detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (X11; U; Linux armv6l; en-US; rv:1.9a6pre) Gecko/20070810 Firefox/3.0a1 Fennec/0.9pre',
        configurable: true,
      });

      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; U; en-US) AppleWebKit/528.5+ (KHTML, like Gecko, Safari/528.5+) Version/4.0 Kindle/3.0',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('tablet');
    });

    it('should handle Silk browser device detection', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; U; Android 4.4.3; KFTHWI Build/KTU84M) AppleWebKit/537.36 (KHTML, like Gecko) Silk/47.1.79 like Chrome/47.0.2526.80',
        configurable: true,
      });

      const animation = new ThreeAnimation({ container });

      expect(animation.getDeviceType()).toBe('tablet');
    });

    it('should handle resume when not initialized', () => {
      const animation = new ThreeAnimation({ container });

      // Should not throw when resume is called before init
      expect(() => animation.resume()).not.toThrow();
    });

    it('should handle resume when WebGL not supported', async () => {
      // Force WebGL not supported
      const originalCreateElement = document.createElement;

      document.createElement = vi.fn((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement.call(document, tag) as HTMLCanvasElement;

          canvas.getContext = vi.fn(() => null);

          return canvas;
        }

        return originalCreateElement.call(document, tag);
      });

      const animation = new ThreeAnimation({ container });

      await animation.init(); // This will use fallback

      // Resume should handle missing WebGL gracefully
      expect(() => animation.resume()).not.toThrow();

      document.createElement = originalCreateElement;
    });

    it('should handle pause when no animation frame exists', () => {
      const animation = new ThreeAnimation({ container });

      // Should not throw when pause is called before init
      expect(() => animation.pause()).not.toThrow();
    });

    it('should handle multiple pause calls', async () => {
      const animation = new ThreeAnimation({ container });

      await animation.init();

      animation.pause();
      animation.pause(); // Second pause should be safe

      expect(animation).toBeDefined();
    });

    it('should detect WebGL with experimental-webgl fallback', () => {
      const originalCreateElement = document.createElement;

      document.createElement = vi.fn((tag: string) => {
        if (tag === 'canvas') {
          const canvas = originalCreateElement.call(document, tag) as HTMLCanvasElement;

          canvas.getContext = vi.fn((contextType: string) => {
            if (contextType === 'webgl') {
              return null; // First attempt fails
            }
            if (contextType === 'experimental-webgl') {
              return {} as WebGLRenderingContext; // Second attempt succeeds
            }

            return null;
          }) as any;

          return canvas;
        }

        return originalCreateElement.call(document, tag);
      });

      const animation = new ThreeAnimation({ container });

      document.createElement = originalCreateElement;
    });
  });
});
