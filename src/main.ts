// Main entry point for Voder website
import './style.css';

import { init } from './app.js';
import { MagicPhaseAnimator } from './magic-phase-animator.js';
import { ScrollLockedReveal } from './scroll-locked-reveal.js';
import { ScrollNarrativeDetector } from './scroll-narrative-detector.js';
import { SegmentMapper } from './segment-mapper.js';
import {
  analyzeTrafficSource,
  initializeBounceTracking,
  initializeSessionTracking,
  trackTrafficSource,
} from './traffic-analytics.js';

// Initialize Microsoft Clarity analytics
async function initializeAnalytics() {
  // Use the Clarity project ID - in development, we can use the .env value directly
  // In production, this should be set as a Vite environment variable VITE_CLARITY_PROJECT_ID
  const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID || 't5zu4kays7';

  if (clarityProjectId && typeof window !== 'undefined') {
    try {
      // Dynamically import Microsoft Clarity
      const clarityModule = await import('@microsoft/clarity');

      const Clarity = clarityModule.default;

      // Microsoft Clarity NPM package initialization
      (Clarity as any).init(clarityProjectId);
      console.warn('Analytics initialized with Clarity project:', clarityProjectId);

      // Track traffic source after Clarity is initialized
      setTimeout(() => {
        const trafficSource = analyzeTrafficSource();

        trackTrafficSource(trafficSource);

        // Initialize session tracking first
        const sessionAnalytics = initializeSessionTracking(trafficSource);

        // Initialize bounce rate tracking
        initializeBounceTracking(trafficSource);

        console.warn('Analytics fully initialized:', {
          sessionId: sessionAnalytics.sessionId,
          visitorType: sessionAnalytics.isNewVisitor ? 'new' : 'returning',
          trafficSource: trafficSource.source,
        });
      }, 100);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }
}

console.warn('Voder website starting...');

// Initialize analytics before app initialization
initializeAnalytics();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    // Initialize scroll detection and segment mapping (per stories 026.01 and 026.02)
    const scrollDetector = new ScrollNarrativeDetector();

    const segmentMapper = new SegmentMapper();

    // Initialize scroll-locked reveal (per story 026.02-BIZ-VIEWPORT-FIXED-OVERLAY)
    const scrollReveal = new ScrollLockedReveal();

    // Initialize magic phase animations (per story 026.03-BIZ-MAGIC-PHASE-ANIMATION)
    const magicPhaseAnimator = new MagicPhaseAnimator(scrollReveal);

    // Connect segment mapper to scroll progress updates
    scrollDetector.onProgressUpdate((progress) => {
      segmentMapper.updateSegmentStates(progress);
    });

    // Store references for cleanup if needed
    (window as any).__voder = { scrollDetector, segmentMapper, scrollReveal, magicPhaseAnimator };
  });
} else {
  init();
  // Initialize scroll detection and segment mapping (per stories 026.01 and 026.02)
  const scrollDetector = new ScrollNarrativeDetector();

  const segmentMapper = new SegmentMapper();

  // Initialize scroll-locked reveal (per story 026.02-BIZ-VIEWPORT-FIXED-OVERLAY)
  const scrollReveal = new ScrollLockedReveal();

  // Initialize magic phase animations (per story 026.03-BIZ-MAGIC-PHASE-ANIMATION)
  const magicPhaseAnimator = new MagicPhaseAnimator(scrollReveal);

  // Connect segment mapper to scroll progress updates
  scrollDetector.onProgressUpdate((progress) => {
    segmentMapper.updateSegmentStates(progress);
  });

  // Store references for cleanup if needed
  (window as any).__voder = { scrollDetector, segmentMapper, scrollReveal, magicPhaseAnimator };
}
