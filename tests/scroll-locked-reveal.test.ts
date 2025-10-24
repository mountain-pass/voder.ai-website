/**
 * @file scroll-locked-reveal.test.ts
 * @see {@link file://./../prompts/release-1.0/in-scope/026.02-BIZ-VIEWPORT-FIXED-OVERLAY.md Story 026.02}
 * @see {@link file://./../docs/decisions/0016-scroll-locked-narrative-reveal.accepted.md ADR 0016}
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScrollLockedReveal } from '../src/scroll-locked-reveal.js';

describe('ScrollLockedReveal', () => {
  let scrollReveal: ScrollLockedReveal;

  let scrollStage: HTMLElement;

  let stickyPanel: HTMLElement;

  let revealElements: HTMLElement[];

  beforeEach(() => {
    // Create scroll-stage structure
    scrollStage = document.createElement('div');
    scrollStage.className = 'scroll-stage';
    scrollStage.style.height = '500vh'; // 5 steps (4 + 1)

    stickyPanel = document.createElement('div');
    stickyPanel.className = 'sticky-panel';

    // Create reveal elements with timing attributes
    revealElements = [
      createRevealElement('kicker', '0', '0.15'),
      createRevealElement('headline', '0.05', '0.25'),
      createRevealElement('preamble1', '0.15', '0.35'),
      createRevealElement('preamble2', '0.2', '0.4'),
      createRevealElement('hinge', '0.35', '0.55'),
      createRevealElement('fallout1', '0.6', '0.75'),
      createRevealElement('bottom', '0.85', '1'),
    ];

    revealElements.forEach((el) => stickyPanel.appendChild(el));
    scrollStage.appendChild(stickyPanel);
    document.body.appendChild(scrollStage);

    // Mock getBoundingClientRect
    vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 5000,
      height: 5000,
      width: 1000,
      left: 0,
      right: 1000,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      value: 1000,
      writable: true,
    });

    scrollReveal = new ScrollLockedReveal();
  });

  afterEach(() => {
    scrollReveal.destroy();
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  function createRevealElement(className: string, start: string, end: string): HTMLElement {
    const el = document.createElement('p');

    el.className = className;
    el.setAttribute('data-reveal-start', start);
    el.setAttribute('data-reveal-end', end);
    el.textContent = `Element ${className}`;

    return el;
  }

  describe('initialization', () => {
    it('should find scroll-stage and sticky-panel elements', () => {
      expect(scrollReveal['stage']).toBe(scrollStage);
      expect(scrollReveal['elements']).toBeDefined();
    });

    it('should collect all reveal elements with timing attributes', () => {
      expect(scrollReveal['elements'].length).toBe(7);
    });

    it('should handle missing scroll-stage gracefully', () => {
      document.body.innerHTML = '';
      const reveal = new ScrollLockedReveal();

      expect(reveal['stage']).toBeNull();
      reveal.destroy();
    });

    it('should handle missing sticky-panel gracefully', () => {
      document.body.innerHTML = '';
      const stage = document.createElement('div');

      stage.className = 'scroll-stage';
      document.body.appendChild(stage);

      const reveal = new ScrollLockedReveal();

      expect(reveal['stage']).toBe(stage);
      // Should not throw even without sticky-panel
      expect(() => reveal.destroy()).not.toThrow();
      reveal.destroy();
    });
  });

  describe('getProgress()', () => {
    it('should return 0 when scroll-stage is at top of viewport', () => {
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: 0,
        bottom: 5000,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      });

      Object.defineProperty(scrollStage, 'offsetHeight', { value: 5000, configurable: true });

      const progress = scrollReveal.getCurrentProgress();

      expect(progress).toBe(0);
    });

    it('should return 1 when scroll-stage bottom reaches viewport bottom', () => {
      // Stage has scrolled up by 4000px (4 viewport heights)
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -4000,
        bottom: 1000, // Exactly at viewport bottom
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -4000,
        toJSON: () => ({}),
      });

      Object.defineProperty(scrollStage, 'offsetHeight', { value: 5000, configurable: true });

      const progress = scrollReveal.getCurrentProgress();

      expect(progress).toBe(1);
    });

    it('should return 0.5 when halfway through scroll distance', () => {
      // Stage has scrolled up by 2000px (2 viewport heights = 50% of 4vh distance)
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -2000,
        bottom: 3000,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -2000,
        toJSON: () => ({}),
      });

      Object.defineProperty(scrollStage, 'offsetHeight', { value: 5000, configurable: true });

      const progress = scrollReveal.getCurrentProgress();

      expect(progress).toBeCloseTo(0.5, 2);
    });

    it('should clamp progress below 0', () => {
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: 1000, // Above viewport
        bottom: 6000,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: 1000,
        toJSON: () => ({}),
      });

      Object.defineProperty(scrollStage, 'offsetHeight', { value: 5000, configurable: true });

      const progress = scrollReveal.getCurrentProgress();

      expect(progress).toBe(0);
    });

    it('should clamp progress above 1', () => {
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -5000,
        bottom: 0, // Scrolled past end
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -5000,
        toJSON: () => ({}),
      });

      Object.defineProperty(scrollStage, 'offsetHeight', { value: 5000, configurable: true });

      const progress = scrollReveal.getCurrentProgress();

      expect(progress).toBe(1);
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      // Mock offsetHeight for all update tests
      Object.defineProperty(scrollStage, 'offsetHeight', { value: 5000, configurable: true });
    });

    it('should reveal element when progress enters its range', () => {
      // Kicker has data-reveal-start="0" data-reveal-end="0.15"
      const kicker = revealElements[0];

      // Progress at 0.1 (within range)
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -400, // 10% through scroll distance
        bottom: 4600,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -400,
        toJSON: () => ({}),
      });

      scrollReveal['update']();

      expect(kicker.style.opacity).not.toBe('0');
      expect(kicker.style.transform).not.toContain('translateY(20px)');
    });

    it('should hide element when progress is before its range', () => {
      // Headline has data-reveal-start="0.05" data-reveal-end="0.25"
      const headline = revealElements[1];

      // Progress at 0.02 (before range)
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -80, // 2% through scroll distance
        bottom: 4920,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -80,
        toJSON: () => ({}),
      });

      scrollReveal['update']();

      expect(headline.style.opacity).toBe('0');
      expect(headline.style.transform).toContain('translateY(20px)');
    });

    it('should smoothly interpolate opacity and transform', () => {
      // Preamble1 has data-reveal-start="0.15" data-reveal-end="0.35"
      const preamble1 = revealElements[2];

      // Progress at 0.25 (middle of 0.15-0.35 range = 50% interpolation)
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -1000, // 25% through scroll distance
        bottom: 4000,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -1000,
        toJSON: () => ({}),
      });

      scrollReveal['update']();

      const opacity = parseFloat(preamble1.style.opacity);

      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });

    it('should fully reveal element when progress exceeds its range', () => {
      // Hinge has data-reveal-start="0.35" data-reveal-end="0.55"
      const hinge = revealElements[4];

      // Progress at 0.6 (past range)
      vi.spyOn(scrollStage, 'getBoundingClientRect').mockReturnValue({
        top: -2400, // 60% through scroll distance
        bottom: 2600,
        height: 5000,
        width: 1000,
        left: 0,
        right: 1000,
        x: 0,
        y: -2400,
        toJSON: () => ({}),
      });

      scrollReveal['update']();

      expect(hinge.style.opacity).toBe('1');
      expect(hinge.style.transform).toContain('translateY(0px)');
      expect(hinge.style.transform).toContain('scale(1)');
    });

    it('should handle elements without timing attributes', () => {
      const noTiming = document.createElement('p');

      noTiming.textContent = 'No timing attributes';
      stickyPanel.appendChild(noTiming);

      expect(() => scrollReveal['update']()).not.toThrow();
    });
  });

  describe('scroll handling', () => {
    it('should throttle scroll updates with requestAnimationFrame', () => {
      const rafSpy = vi.spyOn(window, 'requestAnimationFrame');

      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('scroll'));

      // Should only request one animation frame
      expect(rafSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('ResizeObserver', () => {
    it('should observe scroll-stage for size changes', () => {
      expect(scrollReveal['resizeObserver']).toBeDefined();
    });
  });

  describe('destroy()', () => {
    it('should remove scroll listener', () => {
      const scrollSpy = vi.spyOn(window, 'removeEventListener');

      scrollReveal.destroy();
      expect(scrollSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should remove resize listener', () => {
      const resizeSpy = vi.spyOn(window, 'removeEventListener');

      scrollReveal.destroy();
      expect(resizeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('should disconnect ResizeObserver', () => {
      const disconnectSpy = vi.spyOn(scrollReveal['resizeObserver']!, 'disconnect');

      scrollReveal.destroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('should handle double destroy gracefully', () => {
      scrollReveal.destroy();
      expect(() => scrollReveal.destroy()).not.toThrow();
    });
  });
});
