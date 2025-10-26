/**
 * @fileoverview Scroll-locked narrative reveal for cinematic storytelling
 * Implements sticky-position scroll reveal where content pins in viewport
 * while users scroll through narrative with progressive content reveal
 * Per story 026.02-BIZ-VIEWPORT-FIXED-OVERLAY
 */

/**
 * ScrollLockedReveal - Manages cinematic scroll-locked narrative reveal
 * REQ-SCROLL-STAGE: Parent container with height based on reveal steps
 * REQ-STICKY-PINNING: Panel uses position:sticky to pin at viewport top
 * REQ-NATURAL-SCROLL: Users scroll normally without scroll hijacking
 * REQ-PROGRESS-CALC: Calculate 0-1 progress through narrative stage
 */
export class ScrollLockedReveal {
  private stage: HTMLElement | null;
  private elements: HTMLElement[];
  private ticking: boolean;
  private resizeObserver: ResizeObserver | null;
  private boundOnScroll: () => void;

  /**
   * Initialize scroll-locked reveal system
   */
  constructor() {
    this.stage = document.querySelector('.scroll-stage');
    this.elements = Array.from(this.stage?.querySelectorAll('[data-reveal-start]') || []);
    this.ticking = false;
    this.resizeObserver = null;
    this.boundOnScroll = () => this.onScroll();

    if (!this.stage) {
      // eslint-disable-next-line no-console -- REQ-DEBUG-LOGGING: Console output for troubleshooting
      console.log('ScrollLockedReveal: scroll-stage not found in DOM');

      return;
    }

    this.setup();
  }

  /**
   * Setup scroll and resize listeners
   * REQ-RAF-THROTTLE: Use requestAnimationFrame for scroll updates
   * REQ-RESIZE-OBSERVE: Update on resize with ResizeObserver
   */
  private setup(): void {
    if (!this.stage) return;

    // Initialize all elements to hidden state before first update
    for (const el of this.elements) {
      el.style.opacity = '0';
      el.style.transform = `translateY(20px) scale(0.98)`;
    }

    // Scroll listener with rAF throttling
    window.addEventListener('scroll', this.boundOnScroll, { passive: true });
    window.addEventListener('resize', this.boundOnScroll, { passive: true });

    // Observe stage for size changes
    this.resizeObserver = new ResizeObserver(() => this.update());
    this.resizeObserver.observe(this.stage);

    // Initial update - use timeout to ensure layout is fully settled
    // This prevents webkit from showing elements before scroll calculations are ready
    setTimeout(() => this.update(), 50);
  }

  /**
   * Handle scroll events with requestAnimationFrame throttling
   * REQ-RAF-THROTTLE: Throttle scroll updates for performance
   */
  private onScroll(): void {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.update();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  /**
   * Calculate 0-1 progress through the scroll stage
   * REQ-PROGRESS-CALC: Calculate normalized progress through narrative
   * @returns Number between 0 and 1 representing scroll progress
   */
  private getProgress(): number {
    if (!this.stage) return 0;

    const rect = this.stage.getBoundingClientRect();

    const total = this.stage.offsetHeight - window.innerHeight;

    const scrolled = Math.max(0, Math.min(-rect.top, total));

    return total > 0 ? scrolled / total : 0;
  }

  /**
   * Update all reveal elements based on scroll progress
   * REQ-ELEMENT-TIMING: Each element has start/end thresholds
   * REQ-SMOOTH-ANIMATION: Fade and translate based on progress
   * REQ-EASING-FUNCTION: Use smoothstep for natural feel
   * REQ-OPACITY-TRANSFORM: Animate opacity and translateY
   */
  private update(): void {
    const progress = this.getProgress();

    for (const el of this.elements) {
      // Skip Act 1 segments - they're handled by MagicPhaseAnimator
      if (el.dataset.act === '1') {
        continue;
      }

      const start = parseFloat(el.dataset.revealStart || '0');

      const end = parseFloat(el.dataset.revealEnd || '1');

      // Elements before start threshold should be hidden (opacity 0)
      // Use small threshold (0.01) to avoid floating point precision issues
      if (progress < start - 0.01) {
        el.style.opacity = '0';
        el.style.transform = `translateY(20px) scale(0.98)`;

        continue;
      }

      // Elements past end threshold should be fully visible (opacity 1)
      if (progress >= end) {
        el.style.opacity = '1';
        el.style.transform = `translateY(0px) scale(1)`;

        continue;
      }

      // Map global progress to element's local 0-1 range
      const range = Math.max(0.0001, end - start);

      const local = Math.max(0, Math.min(1, (progress - start) / range));

      // Apply smoothstep easing: 3x² - 2x³
      const eased = local * local * (3 - 2 * local);

      // Animate opacity and transform
      el.style.opacity = eased.toString();
      el.style.transform = `translateY(${(1 - eased) * 20}px) scale(${0.98 + 0.02 * eased})`;
    }
  }

  /**
   * Get current scroll progress (for testing)
   * @returns Current 0-1 progress through narrative
   */
  public getCurrentProgress(): number {
    return this.getProgress();
  }

  /**
   * Get number of reveal elements (for testing)
   * @returns Count of elements with reveal timing
   */
  public getRevealElementCount(): number {
    return this.elements.length;
  }

  /**
   * Clean up event listeners and observers
   */
  public destroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    window.removeEventListener('scroll', this.boundOnScroll);
    window.removeEventListener('resize', this.boundOnScroll);
  }
}
