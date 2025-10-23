/**
 * @fileoverview Scroll detection system for narrative content section
 * Tracks scroll progress through the narrative section and detects viewport entry/exit
 * Per story 026.01-BIZ-SCROLL-DETECTION
 */

/**
 * ScrollNarrativeDetector - Monitors scroll progress through narrative section
 * Uses IntersectionObserver for efficient viewport detection and requestAnimationFrame for smooth updates
 */
export class ScrollNarrativeDetector {
  private narrativeSection: HTMLElement | null = null;
  private isInView: boolean = false;
  private scrollProgress: number = 0;
  private observer: IntersectionObserver | null = null;
  private ticking: boolean = false;
  private progressCallbacks: Array<(progress: number) => void> = [];

  constructor() {
    this.narrativeSection = document.querySelector('.panel');

    if (!this.narrativeSection) {
      console.warn('ScrollNarrativeDetector: Narrative section (.panel) not found in DOM');

      return;
    }

    this.setupIntersectionObserver();
    this.setupScrollHandler();
  }

  /**
   * Register a callback to be notified of scroll progress updates
   * This allows other components (like SegmentMapper) to react to scroll changes
   */
  public onProgressUpdate(callback: (progress: number) => void): void {
    this.progressCallbacks.push(callback);
  }

  /**
   * Set up IntersectionObserver to detect when narrative section enters/exits viewport
   * REQ-INTERSECTION-OBSERVER: Use Intersection Observer API for efficient section detection
   * REQ-BOUNDARY-DETECTION: Detect when narrative section enters and exits viewport
   */
  private setupIntersectionObserver(): void {
    if (!this.narrativeSection) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.isInView = entry.isIntersecting;

          if (this.isInView) {
            // eslint-disable-next-line no-console -- REQ-DEBUG-LOGGING: Console output required per specification
            console.log('Narrative section entered viewport');
            this.updateScrollProgress();
          } else {
            // eslint-disable-next-line no-console -- REQ-DEBUG-LOGGING: Console output required per specification
            console.log('Narrative section exited viewport');
          }
        });
      },
      { threshold: 0.1 },
    );

    this.observer.observe(this.narrativeSection);
  }

  /**
   * Set up scroll event handler with performance optimization
   * REQ-SCROLL-HANDLER: Lightweight scroll event handler with performance optimization
   * REQ-SMOOTH-MONITORING: Use requestAnimationFrame to prevent scroll jank
   * REQ-EFFICIENT-EVENTS: Throttle scroll events for optimal performance
   */
  private setupScrollHandler(): void {
    window.addEventListener(
      'scroll',
      () => {
        if (!this.ticking && this.isInView) {
          requestAnimationFrame(() => {
            this.updateScrollProgress();
            this.ticking = false;
          });
          this.ticking = true;
        }
      },
      { passive: true },
    );
  }

  /**
   * Calculate and update scroll progress through narrative section
   * REQ-PROGRESS-CALCULATION: Calculate scroll progress as percentage (0-100%) through narrative section
   * REQ-ACCURATE-MATH: Precise percentage calculation based on section height and position
   * REQ-BIDIRECTIONAL: Track both forward and backward scrolling
   * REQ-BOUNDARY-AWARENESS: Handle edge cases when section is partially visible
   * REQ-DEVICE-AGNOSTIC: Work consistently across different screen sizes
   * REQ-DEBUG-LOGGING: Console output for development and testing
   */
  private updateScrollProgress(): void {
    if (!this.narrativeSection) return;

    const rect = this.narrativeSection.getBoundingClientRect();

    const windowHeight = window.innerHeight;

    // Calculate progress based on section visibility
    let progress = 0;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);

      const totalHeight = rect.height;

      progress = Math.max(0, Math.min(100, (visibleHeight / totalHeight) * 100));
    }

    this.scrollProgress = progress;

    // eslint-disable-next-line no-console -- REQ-DEBUG-LOGGING: Console output required per specification
    console.log(`Narrative scroll progress: ${this.scrollProgress.toFixed(1)}%`);

    // Notify registered callbacks
    this.progressCallbacks.forEach((callback) => callback(this.scrollProgress));
  }

  /**
   * Get current scroll progress (for testing and external use)
   * @returns Current scroll progress as percentage (0-100)
   */
  public getScrollProgress(): number {
    return this.scrollProgress;
  }

  /**
   * Check if narrative section is currently in viewport (for testing and external use)
   * @returns True if narrative section is in viewport
   */
  public isNarrativeInView(): boolean {
    return this.isInView;
  }

  /**
   * Clean up observers and event listeners
   * REQ-CLEAN-ARCHITECTURE: Modular code structure ready for enhancement
   */
  public destroy(): void {
    if (this.observer && this.narrativeSection) {
      this.observer.unobserve(this.narrativeSection);
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
