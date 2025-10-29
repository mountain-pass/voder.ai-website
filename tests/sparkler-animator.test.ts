/**
 * Tests for SparklerAnimator - Scroll-triggered particle sparkle effects
 * Story 026.03-BIZ-MAGIC-PHASE-ANIMATION
 *
 * Focus: Test observable behavior, not implementation details
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SparklerAnimator } from '../src/sparkler-animator.js';

describe('SparklerAnimator', () => {
  let container: HTMLElement;

  let mockProgressiveReveal: any;

  beforeEach(() => {
    // Use fake timers for animation control
    vi.useFakeTimers();

    // Setup DOM
    container = document.createElement('div');
    container.className = 'sticky-panel';
    container.innerHTML = `
      <h2 class="headline" data-reveal-start="0.05" data-reveal-end="0.25" data-act="1" data-segment="1">
        AI coding felt like <em class="magic-word">magic?</em>
      </h2>
    `;
    document.body.appendChild(container);

    // Mock getBoundingClientRect for magic-word element to return non-zero dimensions
    // (required for buildEmitters to work in JSDOM test environment)
    const magicWord = container.querySelector('.magic-word') as HTMLElement;

    if (magicWord) {
      magicWord.getBoundingClientRect = vi.fn(() => ({
        width: 100,
        height: 30,
        top: 0,
        left: 0,
        right: 100,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }));
    }

    // Mock progressive reveal
    mockProgressiveReveal = {
      getCurrentProgress: vi.fn(() => 0),
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.removeChild(container);
  });

  describe('Canvas Setup', () => {
    it('should create canvas element inside sticky panel', () => {
      new SparklerAnimator(mockProgressiveReveal);

      const canvas = container.querySelector('canvas');

      expect(canvas).toBeTruthy();
      expect(canvas?.style.position).toBe('absolute');
      expect(canvas?.style.zIndex).toBe('-1');
    });

    it('should position canvas behind text content', () => {
      new SparklerAnimator(mockProgressiveReveal);

      const canvas = container.querySelector('canvas');

      expect(canvas?.style.zIndex).toBe('-1');
      expect(canvas?.style.pointerEvents).toBe('none');
    });
  });

  describe('Canvas Opacity - Scroll-based Fade', () => {
    it('should be transparent before 5% scroll', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.03);
      new SparklerAnimator(mockProgressiveReveal);

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      expect(canvas.style.opacity).toBe('0');
    });

    it('should fade in between 5% and 20% scroll', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.125); // Halfway between 5% and 20%
      new SparklerAnimator(mockProgressiveReveal);

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      const opacity = parseFloat(canvas.style.opacity);

      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });

    it('should be fully opaque at 20% scroll (sparkle trigger point)', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      new SparklerAnimator(mockProgressiveReveal);

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      expect(canvas.style.opacity).toBe('1');
    });

    it('should fade out between 45% and 60% scroll', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.525); // Halfway between 45% and 60%
      new SparklerAnimator(mockProgressiveReveal);

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      const opacity = parseFloat(canvas.style.opacity);

      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });
  });

  describe('Scroll-Triggered Animation', () => {
    it('should trigger sparkle animation when scrolling into 20% range', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.15);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Before trigger point
      let canvas = container.querySelector('canvas') as HTMLCanvasElement;

      expect(canvas.style.opacity).not.toBe('1');

      // Scroll to trigger point
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);

      // Advance animation frame
      vi.advanceTimersByTime(16); // One frame

      canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas.style.opacity).toBe('1');
    });

    it('should keep canvas visible while animation plays through (even if scrolled past)', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger animation
      vi.advanceTimersByTime(16);

      // Scroll way past the range
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.7);
      vi.advanceTimersByTime(16);

      // Canvas should still be visible because animation is playing
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      expect(canvas.style.opacity).toBe('1');
    });
  });

  describe('Magic Word Text Reveal', () => {
    it('should start with magic word hidden (clipped)', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.15);
      new SparklerAnimator(mockProgressiveReveal);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      expect(magicWord.style.clipPath).toContain('100%');
    });

    it('should reveal magic word progressively during sparkle sweep', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger animation
      vi.advanceTimersByTime(16);

      // Wait for partial sweep (200ms into 800ms sweep)
      vi.advanceTimersByTime(200);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      // Should be partially revealed (not 100% clipped, not fully open)
      const clipPath = magicWord.style.clipPath;

      expect(clipPath).toBeTruthy();
      expect(clipPath).not.toContain('100%'); // Not fully hidden
    });

    it('should have magic word fully revealed after sweep completes', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger and wait for sweep to complete (800ms + buffer)
      vi.advanceTimersByTime(1000);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      expect(magicWord.style.clipPath).toContain('inset(-2px -2px -2px -2px)');
    });
  });

  describe('Magic Word Color Transition', () => {
    it('should show magic word in white during sparkle animation', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger and check color during sweep
      vi.advanceTimersByTime(200);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      expect(magicWord.style.color).toContain('255, 255, 255'); // White
    });

    it('should fade magic word from white to teal after sweep completes', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Wait for sweep + partial fade (800ms sweep + 200ms fade)
      vi.advanceTimersByTime(1000);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      const color = magicWord.style.color;

      // Should be transitioning (not pure white, not pure teal)
      expect(color).toBeTruthy();
      expect(color).not.toContain('255, 255, 255'); // Not white anymore
    });

    it('should end with magic word in teal after animation fully completes', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Wait for full animation (sweep 800ms + fade 500ms)
      vi.advanceTimersByTime(1400);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      expect(magicWord.style.color).toContain('34, 199, 190'); // Teal
    });
  });

  describe('Smart Retrigger Behavior', () => {
    it('should NOT retrigger if scrolled up partially (text still visible)', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger animation
      vi.advanceTimersByTime(16);
      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      // Scroll up partially (text still visible, opacity > 0)
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.1);
      vi.advanceTimersByTime(16);

      // Scroll back down
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      vi.advanceTimersByTime(16);

      // Should NOT retrigger (clip path shouldn't reset to 100%)
      expect(magicWord.style.clipPath).not.toContain('100%');
    });

    it('should retrigger animation when scrolled fully out and back in', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger initial animation
      vi.advanceTimersByTime(16);

      // Scroll way up until text fully fades (opacity = 0)
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.02);
      vi.advanceTimersByTime(16);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      expect(magicWord.style.clipPath).toContain('100%'); // Should be reset

      // Scroll back down to trigger
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      vi.advanceTimersByTime(16);

      // Should have retriggered (canvas visible, animation playing)
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      expect(canvas.style.opacity).toBe('1');
    });
  });

  describe('Animation Completes Regardless of Scroll Speed', () => {
    it('should complete text reveal even when scrolling fast past range', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger animation
      vi.advanceTimersByTime(16);

      // Immediately scroll way past
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.6);
      vi.advanceTimersByTime(16);

      // Wait for animation to complete
      vi.advanceTimersByTime(1400);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      // Text should be fully revealed despite fast scroll
      expect(magicWord.style.clipPath).toContain('inset(-2px -2px -2px -2px)');
    });

    it('should complete color fade even when scrolling fast past range', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger animation
      vi.advanceTimersByTime(16);

      // Immediately scroll way past
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.6);
      vi.advanceTimersByTime(16);

      // Wait for animation to complete
      vi.advanceTimersByTime(1400);

      const magicWord = document.querySelector('.magic-word') as HTMLElement;

      // Color should be teal despite fast scroll
      expect(magicWord.style.color).toContain('34, 199, 190');
    });

    it('should keep canvas visible with grace period for particle trails', () => {
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.2);
      const animator = new SparklerAnimator(mockProgressiveReveal);

      // Trigger and scroll past immediately
      vi.advanceTimersByTime(16);
      mockProgressiveReveal.getCurrentProgress = vi.fn(() => 0.6);

      // Wait for animation + fade
      vi.advanceTimersByTime(1400);

      const canvas = container.querySelector('canvas') as HTMLCanvasElement;

      // Canvas should still be visible (grace period for trails)
      expect(canvas.style.opacity).toBe('1');

      // After grace period (1000ms extra), canvas can fade
      vi.advanceTimersByTime(1100);

      // Now it should follow scroll-based opacity
      expect(parseFloat(canvas.style.opacity)).toBeLessThan(1);
    });
  });
});
