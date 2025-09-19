// Main entry point for Voder website
import './style.css';

import { init } from './app.js';
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
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
