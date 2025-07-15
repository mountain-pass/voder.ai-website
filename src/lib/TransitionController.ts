/**
 * Controller to manage scroll or time-based transitions using GSAP and ScrollTrigger.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * GSAP animation variables type
 */
type GSAPVars = Record<string, string | number> & {
  duration?: number;
  ease?: string;
};

export interface AnimationProperty {
  /** CSS property to animate, e.g. 'opacity', 'transform' */
  property: string;
  /** Starting value */
  from: string | number;
  /** Ending value */
  to: string | number;
  /** Easing function name */
  easing: string;
}

/**
 * Describes one phase of an animation timeline.
 */
export interface AnimationPhase {
  /** Unique phase name */
  name: string;
  /** Milliseconds offset from start */
  startTime: number;
  /** Phase duration in milliseconds */
  duration: number;
  /** Array of element selectors to animate */
  elements: string[];
  /** Properties to animate */
  properties: AnimationProperty[];
}

/**
 * Configuration for accessibility support in transitions.
 */
export interface AccessibilityConfig {
  /** Selector for aria-live region */
  liveRegionSelector: string;
  /** Skip button selector */
  skipTriggerSelector: string;
  /** Message to announce on start */
  announceOnStart?: string;
  /** Message to announce on complete */
  announceOnComplete?: string;
}

/**
 * Transition configuration tying trigger, timing, phases, and accessibility together.
 */
export interface TransitionConfig {
  trigger: 'scroll' | 'time' | 'interaction';
  triggerValue: number | string;
  duration: number;
  phases: AnimationPhase[];
  accessibility: AccessibilityConfig;
  testSelectors: string[];
}

/**
 * Controller to manage scroll or time-based transitions using GSAP and ScrollTrigger.
 */
export class TransitionController {
  private timeline?: gsap.core.Timeline;
  private resolvePlay?: () => void;

  constructor(private config: TransitionConfig) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /**
   * Initialize the transition: set up trigger, accessibility, and test hooks.
   */
  public init(): void {
    this.setupTrigger();
    // Listen for Escape key to skip animations
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.skip();
      }
    });
    this.setupAccessibility();
    this.addTestSelectors();
  }

  private setupTrigger(): void {
    if (this.config.trigger === 'scroll') {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: this.config.triggerValue as string,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play reverse play reverse',
        },
      });

      this.config.phases.forEach(phase => {
        const fromVars: GSAPVars = {};
        const toVars: GSAPVars = { duration: phase.duration / 1000, ease: phase.properties[0]?.easing || 'none' };
        phase.properties.forEach(prop => {
          fromVars[prop.property] = prop.from;
          toVars[prop.property] = prop.to;
        });
        tl.fromTo(phase.elements, fromVars, toVars, phase.startTime / 1000);
      });

      this.timeline = tl;
    }
  }

  private setupAccessibility(): void {
    const { announceOnStart, announceOnComplete, skipTriggerSelector } = this.config.accessibility;

    if (skipTriggerSelector) {
      const skipBtn = document.querySelector(skipTriggerSelector);
      skipBtn?.addEventListener('click', () => this.skip());
    }

    // Set up bidirectional accessibility announcements
    if (this.timeline) {
      if (announceOnStart) {
        this.timeline.eventCallback('onStart', () => this.announce(announceOnStart));
      }
      if (announceOnComplete) {
        this.timeline.eventCallback('onComplete', () => this.announce(announceOnComplete));
      }
      // Add reverse completion announcement
      this.timeline.eventCallback('onReverseComplete', () => {
        this.announce('Transition reversed');
      });
    }
  }

  private addTestSelectors(): void {
    this.config.testSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.setAttribute('data-testid', selector));
    });
  }

  private announce(message: string): void {
    const region = document.querySelector(this.config.accessibility.liveRegionSelector);
    if (region) {
      region.textContent = message;
    }
  }

  /**
   * Play the transition according to defined phases.
   * Note: For scroll-triggered transitions, playback is handled automatically by ScrollTrigger.
   */
  public play(): Promise<void> {
    if (!this.timeline) {
      return Promise.resolve();
    }
    // For scroll triggers, timeline is controlled by ScrollTrigger
    if (this.config.trigger === 'scroll') {
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
      this.resolvePlay = resolve;
      this.timeline!.eventCallback('onComplete', () => resolve());
      this.timeline!.play();
    });
  }

  /**
   * Skip the animation and jump to final state for accessibility.
   */
  public skip(): void {
    this.showFallback();
    if (this.resolvePlay) {
      this.resolvePlay();
      this.resolvePlay = undefined;
    }
    this.timeline?.kill();
  }

  /**
   * Immediately apply final CSS state of each phase.
   */
  private showFallback(): void {
    this.config.phases.forEach(phase => {
      phase.elements.forEach(selector => {
        const els = document.querySelectorAll<HTMLElement>(selector);
        els.forEach(el => {
          phase.properties.forEach(prop => {
            const value = typeof prop.to === 'number' ? prop.to.toString() : prop.to;
            (el.style as unknown as Record<string, string>)[prop.property] = value;
          });
        });
      });
    });
  }
}
