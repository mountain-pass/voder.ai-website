import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ThreeAnimation } from '../src/three-animation.js';

describe('ThreeAnimation Fallback Functionality', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);
  });

  it('should initialize fallback when WebGL is not supported', async () => {
    // Mock WebGL context to return null (not supported)
    const originalCreateElement = document.createElement;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement.call(document, tagName);

      if (tagName.toLowerCase() === 'canvas') {
        vi.spyOn(element as HTMLCanvasElement, 'getContext').mockReturnValue(null);
      }

      return element;
    });

    const animation = new ThreeAnimation({ container });

    await animation.init();

    // Check that fallback content is created
    expect(container.innerHTML).toContain('animation-fallback');
    expect(container.innerHTML).toContain('cube-2d');
    expect(container.innerHTML).toContain('face front');
    expect((animation as any).isInitialized).toBe(true);
  });

  it('should handle WebGL context creation throwing an error', () => {
    // Mock WebGL context creation to throw an error
    const originalCreateElement = document.createElement;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement.call(document, tagName);

      if (tagName.toLowerCase() === 'canvas') {
        vi.spyOn(element as HTMLCanvasElement, 'getContext').mockImplementation(() => {
          throw new Error('WebGL context creation failed');
        });
      }

      return element;
    });

    const animation = new ThreeAnimation({ container });

    // The constructor calls checkWebGLSupport which should handle the error
    expect((animation as any).supportsWebGL).toBe(false);
  });

  it('should set supportsWebGL to false when WebGL context is null', () => {
    // Mock WebGL context to return null
    const originalCreateElement = document.createElement;

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement.call(document, tagName);

      if (tagName.toLowerCase() === 'canvas') {
        vi.spyOn(element as HTMLCanvasElement, 'getContext').mockReturnValue(null);
      }

      return element;
    });

    const animation = new ThreeAnimation({ container });

    expect((animation as any).supportsWebGL).toBe(false);
  });

  it('should prevent double initialization', async () => {
    const animation = new ThreeAnimation({ container });

    // First initialization
    await animation.init();
    const firstInitState = (animation as any).isInitialized;

    // Second initialization should be ignored
    await animation.init();
    const secondInitState = (animation as any).isInitialized;

    expect(firstInitState).toBe(true);
    expect(secondInitState).toBe(true);
  });

  it('should create proper fallback DOM structure', () => {
    // Force fallback mode
    const animation = new ThreeAnimation({ container });

    (animation as any).supportsWebGL = false;
    (animation as any).initFallback();

    expect(container.querySelector('.animation-fallback')).toBeTruthy();
    expect(container.querySelector('.geometric-shape')).toBeTruthy();
    expect(container.querySelector('.cube-2d')).toBeTruthy();
    expect(container.querySelectorAll('.face')).toHaveLength(6);
    expect(container.querySelector('.face.front')).toBeTruthy();
    expect(container.querySelector('.face.back')).toBeTruthy();
    expect(container.querySelector('.face.right')).toBeTruthy();
    expect(container.querySelector('.face.left')).toBeTruthy();
    expect(container.querySelector('.face.top')).toBeTruthy();
    expect(container.querySelector('.face.bottom')).toBeTruthy();
  });

  it('should handle container dimensions for responsive design', () => {
    // Test various container sizes
    const testSizes = [
      { width: '320px', height: '240px' }, // Mobile
      { width: '768px', height: '576px' }, // Tablet
      { width: '1920px', height: '1080px' }, // Desktop
    ];

    testSizes.forEach((size) => {
      const testContainer = document.createElement('div');

      testContainer.style.width = size.width;
      testContainer.style.height = size.height;
      document.body.appendChild(testContainer);

      const animation = new ThreeAnimation({ container: testContainer });

      (animation as any).initFallback();

      expect(testContainer.innerHTML).toContain('animation-fallback');
      expect((animation as any).isInitialized).toBe(true);
    });
  });
});
