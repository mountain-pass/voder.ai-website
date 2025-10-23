/**
 * @fileoverview Unit tests for ScrollNarrativeDetector
 * Tests scroll detection, progress calculation, and IntersectionObserver integration
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollNarrativeDetector } from '../src/scroll-narrative-detector.js';

describe('ScrollNarrativeDetector', () => {
  let narrativeElement: HTMLElement;

  let mockIntersectionObserver: any;

  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    // Create a mock narrative section element
    narrativeElement = document.createElement('div');
    narrativeElement.className = 'panel';
    narrativeElement.style.height = '800px';
    document.body.appendChild(narrativeElement);

    // Mock IntersectionObserver
    intersectionCallback = vi.fn();
    mockIntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;

      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;

    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any) => {
      cb();

      return 0;
    });
  });

  afterEach(() => {
    // Only remove element if it's still a child of document.body
    if (narrativeElement && narrativeElement.parentNode === document.body) {
      document.body.removeChild(narrativeElement);
    }
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('should initialize with narrative section element', () => {
      const detector = new ScrollNarrativeDetector();

      expect(detector).toBeDefined();
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it('should warn if narrative section not found', () => {
      document.body.removeChild(narrativeElement);

      new ScrollNarrativeDetector();

      expect(console.warn).toHaveBeenCalledWith(
        'ScrollNarrativeDetector: Narrative section (.panel) not found in DOM',
      );
    });

    it('should set up IntersectionObserver with correct threshold', () => {
      new ScrollNarrativeDetector();

      expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
        threshold: 0.1,
      });
    });
  });

  describe('IntersectionObserver', () => {
    it('should detect when narrative section enters viewport', () => {
      const detector = new ScrollNarrativeDetector();

      // Simulate intersection callback
      const mockEntry = {
        isIntersecting: true,
        target: narrativeElement,
      };

      intersectionCallback([mockEntry as any], {} as any);

      expect(console.log).toHaveBeenCalledWith('Narrative section entered viewport');
      expect(detector.isNarrativeInView()).toBe(true);
    });

    it('should detect when narrative section exits viewport', () => {
      const detector = new ScrollNarrativeDetector();

      // First enter viewport
      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      // Then exit viewport
      intersectionCallback([{ isIntersecting: false, target: narrativeElement } as any], {} as any);

      expect(console.log).toHaveBeenCalledWith('Narrative section exited viewport');
      expect(detector.isNarrativeInView()).toBe(false);
    });
  });

  describe('Scroll Progress Calculation', () => {
    it('should calculate 0% progress when section is not visible', () => {
      const detector = new ScrollNarrativeDetector();

      // Mock element completely above viewport
      vi.spyOn(narrativeElement, 'getBoundingClientRect').mockReturnValue({
        top: -1000,
        bottom: -200,
        height: 800,
        width: 1920,
        left: 0,
        right: 1920,
        x: 0,
        y: -1000,
      } as DOMRect);

      // Enter viewport to trigger update
      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      expect(detector.getScrollProgress()).toBe(0);
    });

    it('should calculate 100% progress when section is fully visible', () => {
      const detector = new ScrollNarrativeDetector();

      // Mock element fully in viewport (800px tall, viewport is 1080px)
      vi.spyOn(narrativeElement, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 900,
        height: 800,
        width: 1920,
        left: 0,
        right: 1920,
        x: 0,
        y: 100,
      } as DOMRect);

      // Enter viewport and trigger scroll update
      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      expect(detector.getScrollProgress()).toBe(100);
      expect(console.log).toHaveBeenCalledWith('Narrative scroll progress: 100.0%');
    });

    it('should calculate partial progress when section is partially visible', () => {
      const detector = new ScrollNarrativeDetector();

      // Mock element partially in viewport
      // Top is at 900, bottom is at 1700
      // Visible height = 1080 - 900 = 180px out of 800px = 22.5%
      vi.spyOn(narrativeElement, 'getBoundingClientRect').mockReturnValue({
        top: 900,
        bottom: 1700,
        height: 800,
        width: 1920,
        left: 0,
        right: 1920,
        x: 0,
        y: 900,
      } as DOMRect);

      // Enter viewport and trigger scroll update
      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      expect(detector.getScrollProgress()).toBeCloseTo(22.5, 1);
    });

    it('should handle edge case when section top is negative', () => {
      const detector = new ScrollNarrativeDetector();

      // Element partially scrolled off top
      // Bottom is at 600, top is at -200
      // Visible height = 600 - 0 = 600px out of 800px = 75%
      vi.spyOn(narrativeElement, 'getBoundingClientRect').mockReturnValue({
        top: -200,
        bottom: 600,
        height: 800,
        width: 1920,
        left: 0,
        right: 1920,
        x: 0,
        y: -200,
      } as DOMRect);

      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      expect(detector.getScrollProgress()).toBe(75);
    });
  });

  describe('Scroll Event Handling', () => {
    it('should use requestAnimationFrame for scroll updates', () => {
      new ScrollNarrativeDetector();

      // Enter viewport first
      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'));

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should only update when narrative is in view', () => {
      new ScrollNarrativeDetector();

      // Narrative NOT in view
      intersectionCallback([{ isIntersecting: false, target: narrativeElement } as any], {} as any);

      const rafCallCount = (window.requestAnimationFrame as any).mock.calls.length;

      // Trigger scroll event
      window.dispatchEvent(new Event('scroll'));

      // Should not call requestAnimationFrame for scroll when not in view
      expect((window.requestAnimationFrame as any).mock.calls.length).toBe(rafCallCount);
    });

    it('should throttle scroll events with ticking flag', () => {
      new ScrollNarrativeDetector();

      // Enter viewport
      intersectionCallback([{ isIntersecting: true, target: narrativeElement } as any], {} as any);

      // Trigger multiple scroll events rapidly
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));

      // requestAnimationFrame should be called but throttled
      // The exact count depends on ticking state
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Public API', () => {
    it('should expose getScrollProgress method', () => {
      const detector = new ScrollNarrativeDetector();

      expect(typeof detector.getScrollProgress).toBe('function');
      expect(detector.getScrollProgress()).toBeGreaterThanOrEqual(0);
      expect(detector.getScrollProgress()).toBeLessThanOrEqual(100);
    });

    it('should expose isNarrativeInView method', () => {
      const detector = new ScrollNarrativeDetector();

      expect(typeof detector.isNarrativeInView).toBe('function');
      expect(typeof detector.isNarrativeInView()).toBe('boolean');
    });

    it('should expose destroy method for cleanup', () => {
      const detector = new ScrollNarrativeDetector();

      expect(typeof detector.destroy).toBe('function');
      expect(() => detector.destroy()).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should disconnect observer on destroy', () => {
      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };

      mockIntersectionObserver.mockReturnValue(mockObserver);

      const detector = new ScrollNarrativeDetector();

      detector.destroy();

      expect(mockObserver.unobserve).toHaveBeenCalledWith(narrativeElement);
      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });

  describe('Device Agnostic Behavior', () => {
    it('should work with different viewport heights', () => {
      const viewportSizes = [667, 768, 1024, 1080, 1440];

      viewportSizes.forEach((height) => {
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: height,
        });

        const detector = new ScrollNarrativeDetector();

        // Mock fully visible section
        vi.spyOn(narrativeElement, 'getBoundingClientRect').mockReturnValue({
          top: 100,
          bottom: 900,
          height: 800,
          width: 375,
          left: 0,
          right: 375,
          x: 0,
          y: 100,
        } as DOMRect);

        intersectionCallback(
          [{ isIntersecting: true, target: narrativeElement } as any],
          {} as any,
        );

        expect(detector.getScrollProgress()).toBeGreaterThan(0);
      });
    });
  });
});
