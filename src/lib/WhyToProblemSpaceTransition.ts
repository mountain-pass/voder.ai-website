/**
 * WhyToProblemSpaceTransition: Implements the 4-second choreographed transition
 * as specified in the requirements with precise timing control.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class WhyToProblemSpaceTransition {
  private timeline?: gsap.core.Timeline;

  constructor() {
    gsap.registerPlugin(ScrollTrigger);
    // eslint-disable-next-line no-console
    console.log('Creating WhyToProblemSpaceTransition instance');
  }

  /**
   * Initialize the 4-second choreographed transition
   */
  public init(): void {
    // Wait a bit for elements to be rendered
    setTimeout(() => {
      this.setupTransition();
      
      // ...existing code...
    }, 1000);
  }

  /**
   * Set up the transition after brand entry is complete
   */
  private setupTransition(): void {
    // Ensure Why elements are visible before we can transition them
    const whyHeading = document.querySelector('#why-heading') as HTMLElement;
    const subheading = document.querySelector('.subheading') as HTMLElement;
    
    if (whyHeading) {
      whyHeading.style.opacity = '1';
      whyHeading.style.transform = 'none';
      whyHeading.style.filter = 'none';
    }
    
    if (subheading) {
      subheading.style.opacity = '1';
      subheading.style.transform = 'none';
      subheading.style.filter = 'none';
    }

    // Create dedicated live region for our transition to avoid conflicts
    const existingLiveRegion = document.querySelector('#why-problem-transition-live-region');
    if (!existingLiveRegion) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'why-problem-transition-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.top = 'auto';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }

    // Create the master timeline for the 4-second sequence
    const tl = gsap.timeline();

    // Phase 1: Background darkening (0-1s)
    tl.to('#main-content', {
      backgroundColor: '#0A0A0A',
      ease: 'power2.out'
    }, 0);

    // Phase 2: Why text dissolution (1-2s)
    tl.to('#why-heading, .subheading', {
      opacity: 0,
      filter: 'blur(10px)',
      y: -50,
      ease: 'power2.out'
    }, 1);

    // Phase 3: Visual chaos emergence (2-3.5s)
    tl.to('.visual-chaos', {
      opacity: 1,
      ease: 'power2.out'
    }, 2);

    // Phase 4: Problem content reveal (3.5-4s)
    tl.to('#problem-heading, .secondary-heading, .secondary-copy', {
      opacity: 1,
      y: 0,
      ease: 'power2.out'
    }, 3.5);

    // Use ScrollTrigger with scrub for scroll-tied, bidirectional animation
    ScrollTrigger.create({
      trigger: '[data-test-id="problem-section"]',
      start: 'top 80%',
      end: 'bottom 20%',
      animation: tl,
      scrub: 1,
      toggleActions: 'play reverse play reverse',
      onUpdate: (self) => {
        if (self.progress === 0) {
          this.announceTransition('Transitioning from Why section to Problem Space');
        } else if (self.progress === 1) {
          this.announceTransition('Problem Space fully revealed');
        }
      }
    });
    this.timeline = tl;

    // Set up escape key for accessibility
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.skip();
      }
    });

    this.timeline = tl;
  }

  /**
   * Skip the animation and jump to final state
   */
  public skip(): void {
    if (this.timeline) {
      this.timeline.progress(1);
      this.announceTransition('Transition skipped, Problem Space revealed');
    }
  }

  /**
   * Make accessibility announcements
   */
  private announceTransition(message: string): void {
    const liveRegion = document.querySelector('#why-problem-transition-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  // ...existing code...
}
