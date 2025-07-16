/**
 * WhyToProblemSpaceTransition: Implements the 4-second choreographed transition
 * as specified in the requirements with precise timing control.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export class WhyToProblemSpaceTransition {
  private timeline?: gsap.core.Timeline;
  private isActive = false;

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
      
      // Add test function to window for debug tests
      (window as Window & { __testTimeline?: () => void }).__testTimeline = () => {
        // eslint-disable-next-line no-console
        console.log('Testing timeline execution');
        this.testTransition();
      };
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
    const tl = gsap.timeline({ paused: true });

    // Phase 1: Background darkening (0-1s)
    tl.to('#main-content', {
      backgroundColor: '#0A0A0A',
      duration: 1,
      ease: 'power2.out'
    }, 0);

    // Phase 2: Why text dissolution (1-2s)
    tl.to('#why-heading, .subheading', {
      opacity: 0,
      filter: 'blur(10px)',
      y: -50,
      duration: 1,
      ease: 'power2.out'
    }, 1);

    // Phase 3: Visual chaos emergence (2-3.5s)
    const visualChaos = document.querySelector('.visual-chaos');
    if (visualChaos) {
      tl.to('.visual-chaos', {
        opacity: 1,
        duration: 1.5,
        ease: 'power2.out'
      }, 2);
    }

    // Phase 4: Problem content reveal (3.5-4s)
    tl.to('#problem-heading, .secondary-heading, .secondary-copy', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out'
    }, 3.5);

    // For testing: trigger transition immediately when problem section is scrolled into view
    const problemSection = document.querySelector('[data-test-id="problem-section"]');
    
    if (problemSection) {
      // Store the timeline for later use
      this.timeline = tl;
      
      // Use Intersection Observer to detect when problem section comes into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.isActive) {
            this.isActive = true;
            this.announceTransition('Transitioning from Why section to Problem Space');
            tl.play();
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -25% 0px' // Trigger when problem section is 25% into viewport
      });
      
      observer.observe(problemSection);
    }

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
      this.isActive = true; // Mark as active so we don't trigger again
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

  /**
   * Test method for debug timeline test
   */
  public testTransition(): void {
    // eslint-disable-next-line no-console
    console.log('Before: transition test starting');
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const beforeBg = getComputedStyle(mainContent).backgroundColor;
      // eslint-disable-next-line no-console
      console.log('Before:', beforeBg);
      
      // Force the transition to run
      if (this.timeline) {
        this.timeline.restart();
      }
      
      // Check after a delay
      setTimeout(() => {
        const afterBg = getComputedStyle(mainContent).backgroundColor;
        // eslint-disable-next-line no-console
        console.log('After:', afterBg);
      }, 100);
    }
  }
}
