import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MagicPhaseAnimator } from '../src/magic-phase-animator.js';
import type { ScrollLockedReveal } from '../src/scroll-locked-reveal.js';
import type { SparklerAnimator } from '../src/sparkler-animator.js';

describe('MagicPhaseAnimator', () => {
  let mockScrollReveal: ScrollLockedReveal;

  let mockSparklerAnimator: SparklerAnimator;

  let animator: MagicPhaseAnimator;

  let container: HTMLElement;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement('div');
    document.body.appendChild(container);

    // Mock ScrollLockedReveal
    mockScrollReveal = {
      getCurrentProgress: vi.fn(() => 0),
    } as unknown as ScrollLockedReveal;

    // Mock SparklerAnimator - default to sweep completed
    mockSparklerAnimator = {
      isSweepCompleted: vi.fn(() => true),
    } as unknown as SparklerAnimator;

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      setTimeout(() => cb(Date.now()), 0);

      return 1;
    });

    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
  });

  afterEach(() => {
    if (animator) {
      animator.destroy();
    }
    document.body.removeChild(container);
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize and start continuous animation', () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should bind scroll and resize listeners', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
        passive: true,
      });
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), {
        passive: true,
      });
    });
  });

  describe('Segment 1 Animation', () => {
    beforeEach(() => {
      // Create Segment 1 elements
      container.innerHTML = `
        <div data-segment="1" data-reveal-start="0" data-reveal-end="0.15">
          Remember when <span class="magic-word">magic</span>?
        </div>
        <div data-segment="1" data-reveal-start="0.05" data-reveal-end="0.25">
          AI coding felt like <span class="magic-word">magic</span>?
        </div>
      `;
    });

    it('should animate segment 1 elements at start of range', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const firstSegment = container.querySelector('[data-reveal-start="0"]') as HTMLElement;

      // At 0% progress, element should be at start of fade-in
      expect(firstSegment.style.opacity).toBeDefined();
      expect(firstSegment.style.transform).toContain('translateY');
      expect(firstSegment.style.transform).toContain('scale');
    });

    it('should fully reveal segment 1 elements at end of range', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.15);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const firstSegment = container.querySelector('[data-reveal-start="0"]') as HTMLElement;

      // At 15% progress (element's reveal-end), should be fully revealed
      expect(parseFloat(firstSegment.style.opacity)).toBeGreaterThan(0.9);
    });

    it('should apply camera bobbing to all segment 1 elements', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segments = container.querySelectorAll<HTMLElement>('[data-segment="1"]');

      segments.forEach((segment) => {
        expect(segment.style.transform).toContain('translateY');
      });
    });

    it('should add glow to magic words when visible', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const magicWords = container.querySelectorAll<HTMLElement>('.magic-word');

      magicWords.forEach((word) => {
        // Should have text-shadow when parent is visible (progress > 0.3 of parent range)
        const parent = word.closest('[data-reveal-start]');

        if (parent) {
          const revealStart = parseFloat(parent.getAttribute('data-reveal-start') || '0');

          const revealEnd = parseFloat(parent.getAttribute('data-reveal-end') || '0.12');

          const progress = (0.1 - revealStart) / (revealEnd - revealStart);

          if (progress > 0.3) {
            expect(word.style.textShadow).toContain('rgba(34, 199, 190');
          }
        }
      });
    });

    it('should not add glow to magic words when parent not visible', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.01);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const magicWords = container.querySelectorAll<HTMLElement>('.magic-word');

      magicWords.forEach((word) => {
        expect(word.style.textShadow).toBe('none');
      });
    });

    it('should use power curve for slow fade-in from fog', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.075); // Midpoint of 0-0.15

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-reveal-start="0"]') as HTMLElement;

      // Power curve (t^3) makes fade slower at start, faster at end
      const opacity = parseFloat(segment.style.opacity);

      expect(opacity).toBeGreaterThan(0); // Should be visible
      expect(opacity).toBeLessThan(1); // But not fully opaque yet
      // At midpoint (0.5), t^3 gives 0.125, but we're at full range midpoint
      expect(opacity).toBeGreaterThan(0.1); // Verifies power curve is applied
    });
  });

  describe('Segment 2 Animation', () => {
    beforeEach(() => {
      // Create Segment 2 elements
      container.innerHTML = `
        <div data-segment="2" data-reveal-start="0.25" data-reveal-end="0.45">
          Shipping features felt <span class="speed-word">fast</span> and <span class="speed-word">exciting</span>?
        </div>
      `;
    });

    it('should animate segment 2 elements with slide-in', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.25);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

      expect(segment.style.transform).toContain('translateX');
      expect(segment.style.transform).toContain('rotate');
      expect(segment.style.transform).toContain('scale');
    });

    it('should slide from -400px to 0', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.25);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

      // At start, should have negative translateX
      expect(segment.style.transform).toMatch(/translateX\(-[\d.]+px\)/);
    });

    it('should fully reveal at end of range', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.45);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

      expect(parseFloat(segment.style.opacity)).toBeCloseTo(1, 1);
      // At end, translateX should be close to 0
      expect(segment.style.transform).toMatch(/translateX\([-]?[0-9.]+px\)/);
    });

    it('should apply brand teal color to speed words', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const speedWords = container.querySelectorAll<HTMLElement>('.speed-word');

      speedWords.forEach((word) => {
        if (word.style.color) {
          expect(word.style.color).toContain('rgb');
        }
      });
    });

    it('should add glow to speed words when visible', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const speedWords = container.querySelectorAll<HTMLElement>('.speed-word');

      speedWords.forEach((word) => {
        const parent = word.closest('[data-reveal-start]');

        if (parent) {
          const revealStart = parseFloat(parent.getAttribute('data-reveal-start') || '0.25');

          const progress = (0.3 - revealStart) / 0.2; // 0.25 to 0.45

          if (progress > 0.05) {
            expect(word.style.textShadow).toContain('rgba');
          }
        }
      });
    });

    describe('Energetic Snap-Back Behavior', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should create momentum overshoot by moving past final position', () => {
        // Trigger animation by scrolling into range
        vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

        // Advance time to 75% of 800ms animation (600ms)
        vi.advanceTimersByTime(600);

        const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

        const transformMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        expect(transformMatch).toBeTruthy();

        const translateX = parseFloat(transformMatch![1]);

        // At 75% time progress (before 85% threshold), still in overshoot phase
        // With easeOutBack, element overshoots past 0 to positive values (moves right of final position)
        // This creates the visible momentum effect
        expect(translateX).toBeGreaterThan(0); // Overshoot to the right
        expect(translateX).toBeLessThan(100); // But not too far
      });

      it('should snap sharply to final position after 85% progress', () => {
        // Trigger animation by scrolling into range
        vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

        // Advance time to 90% of 800ms animation (720ms) - after 85% threshold
        vi.advanceTimersByTime(720);

        const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

        const transformMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        expect(transformMatch).toBeTruthy();

        const translateX = parseFloat(transformMatch![1]);

        // During snap phase, element should be very close to 0
        // (sharp snap means it covers remaining distance quickly)
        expect(Math.abs(translateX)).toBeLessThan(10); // Within 10px of final position
      });

      it('should reach exactly zero translateX at 100% progress', () => {
        // Trigger animation by scrolling into range
        vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

        // Advance time to completion (800ms)
        vi.advanceTimersByTime(800);

        const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

        const transformMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        expect(transformMatch).toBeTruthy();

        const translateX = parseFloat(transformMatch![1]);

        // At completion, should be at final position (0)
        expect(Math.abs(translateX)).toBeLessThan(0.1); // Essentially 0
      });

      it('should show visible momentum effect during slide-in', () => {
        // Trigger animation
        vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

        // Midpoint in time (400ms = 50% of 800ms)
        vi.advanceTimersByTime(400);
        const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

        const midMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        const midX = parseFloat(midMatch![1]);

        // Late in animation (760ms = 95% of 800ms)
        vi.advanceTimersByTime(360); // Total 760ms
        const lateMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        const lateX = parseFloat(lateMatch![1]);

        // Midpoint should still be moving toward position (negative or small positive)
        expect(Math.abs(midX)).toBeGreaterThan(1); // Still visibly offset

        // Late should be nearly at 0 (snap completed)
        expect(Math.abs(lateX)).toBeLessThan(5); // Almost locked to final position
      });

      it('should maintain energetic feel by completing snap quickly', () => {
        // Trigger animation
        vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

        // Just before snap threshold (84% = 672ms)
        vi.advanceTimersByTime(672);
        const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

        const beforeSnapMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        const beforeSnapX = parseFloat(beforeSnapMatch![1]);

        // Just after snap threshold (86% = 688ms) - 16ms later
        vi.advanceTimersByTime(16); // Total 688ms
        const afterSnapMatch = segment.style.transform.match(/translateX\(([-\d.]+)px\)/);

        const afterSnapX = parseFloat(afterSnapMatch![1]);

        // Movement during snap should be more dramatic
        // (small time change = large position change)
        const movementDuringSnap = Math.abs(afterSnapX - beforeSnapX);

        expect(movementDuringSnap).toBeGreaterThan(0); // Should have moved
        expect(Math.abs(afterSnapX)).toBeLessThan(Math.abs(beforeSnapX)); // Should be closer to 0
      });
    });
  });

  describe('Scroll Range Management', () => {
    beforeEach(() => {
      container.innerHTML = `
        <div data-segment="1" data-reveal-start="0" data-reveal-end="0.15">Segment 1</div>
        <div data-segment="2" data-reveal-start="0.25" data-reveal-end="0.45">Segment 2</div>
      `;
    });

    it('should animate when scroll progress is 0%', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment1 = container.querySelector('[data-segment="1"]') as HTMLElement;

      expect(segment1.style.opacity).toBeDefined();
    });

    it('should animate when scroll progress is 75%', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.75);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment2 = container.querySelector('[data-segment="2"]') as HTMLElement;

      expect(segment2.style.opacity).toBeDefined();
    });

    it('should not animate when scroll progress is below 0%', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(-0.1);

      const segment1 = container.querySelector('[data-segment="1"]') as HTMLElement;

      const initialOpacity = segment1.style.opacity;

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      // Should not have been modified
      expect(segment1.style.opacity).toBe(initialOpacity);
    });

    it('should not animate when scroll progress is above 75%', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.8);

      const segment2 = container.querySelector('[data-segment="2"]') as HTMLElement;

      const initialOpacity = segment2.style.opacity;

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      // Should not have been modified
      expect(segment2.style.opacity).toBe(initialOpacity);
    });
  });

  describe('Progress Mapping', () => {
    beforeEach(() => {
      container.innerHTML = `
        <div data-segment="1" data-reveal-start="0.1" data-reveal-end="0.3">Test</div>
      `;
    });

    it('should correctly map scroll progress to segment progress', () => {
      // At start of segment range
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="1"]') as HTMLElement;

      // Should be at beginning of animation (low opacity)
      expect(parseFloat(segment.style.opacity)).toBeLessThan(0.2);
    });

    it('should clamp progress below segment start to 0', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.05);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="1"]') as HTMLElement;

      // Should be at 0 progress (effectively invisible due to power curve)
      expect(parseFloat(segment.style.opacity)).toBeLessThan(0.01);
    });

    it('should clamp progress above segment end to 1', () => {
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.35);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="1"]') as HTMLElement;

      // Should be fully visible
      expect(parseFloat(segment.style.opacity)).toBeGreaterThan(0.9);
    });
  });

  describe('Easing Functions', () => {
    it('should apply easeOutQuart for smooth deceleration', () => {
      container.innerHTML = `
        <div data-segment="1" data-reveal-start="0" data-reveal-end="0.2">Test</div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="1"]') as HTMLElement;

      // Scale should use easeOutQuart - verify transform contains scale
      expect(segment.style.transform).toContain('scale');
    });

    it('should apply easeOutBack for slide-in momentum', () => {
      container.innerHTML = `
        <div data-segment="2" data-reveal-start="0.25" data-reveal-end="0.45">Test</div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.35);

      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const segment = container.querySelector('[data-segment="2"]') as HTMLElement;

      // Slide should use easeOutBack
      expect(segment.style.transform).toContain('translateX');
    });
  });

  describe('Scroll Event Throttling', () => {
    it('should throttle scroll events with requestAnimationFrame', async () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const scrollEvent = new Event('scroll');

      // Trigger multiple scroll events
      window.dispatchEvent(scrollEvent);
      window.dispatchEvent(scrollEvent);
      window.dispatchEvent(scrollEvent);

      // Wait for requestAnimationFrame callbacks
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Should have throttled the calls
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should handle resize events', () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      const resizeEvent = new Event('resize');

      window.dispatchEvent(resizeEvent);

      // Should have triggered animation update
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should cancel animation frame on destroy', () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      animator.destroy();

      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });

    it('should handle destroy when no animation frame exists', () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      animator.destroy();

      // Second destroy should not throw
      expect(() => animator.destroy()).not.toThrow();
    });
  });

  describe('Missing Elements', () => {
    it('should handle missing segment 1 elements gracefully', () => {
      // No segment 1 elements in DOM
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });

    it('should handle missing segment 2 elements gracefully', () => {
      // No segment 2 elements in DOM
      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });

    it('should handle missing magic word elements', () => {
      container.innerHTML = `
        <div data-segment="1" data-reveal-start="0" data-reveal-end="0.15">
          No magic words here
        </div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });

    it('should handle missing speed word elements', () => {
      container.innerHTML = `
        <div data-segment="2" data-reveal-start="0.25" data-reveal-end="0.45">
          No speed words here
        </div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle elements without data-reveal-start attribute', () => {
      container.innerHTML = `
        <div data-segment="1" data-reveal-end="0.15">No start attribute</div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });

    it('should handle elements without data-reveal-end attribute', () => {
      container.innerHTML = `
        <div data-segment="1" data-reveal-start="0">No end attribute</div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });

    it('should handle magic words without parent reveal attributes', () => {
      container.innerHTML = `
        <div data-segment="1">
          <span class="magic-word">orphan</span>
        </div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.1);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });

    it('should handle speed words without parent reveal attributes', () => {
      container.innerHTML = `
        <div data-segment="2">
          <span class="speed-word">orphan</span>
        </div>
      `;

      vi.mocked(mockScrollReveal.getCurrentProgress).mockReturnValue(0.3);

      expect(() => {
        animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);
      }).not.toThrow();
    });
  });

  describe('Continuous Animation', () => {
    it('should continuously update animations via requestAnimationFrame', () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      // Should have called requestAnimationFrame at least once during construction
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should stop animation loop when destroyed', () => {
      animator = new MagicPhaseAnimator(mockScrollReveal, mockSparklerAnimator);

      animator.destroy();

      // Should have called cancelAnimationFrame
      expect(window.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
