// Main entry point for Voder website
import './style.css';

import { init } from './app.js';

// Initialize Microsoft Clarity analytics
function initializeAnalytics() {
  // Use the Clarity project ID - in development, we can use the .env value directly
  // In production, this should be set as a Vite environment variable VITE_CLARITY_PROJECT_ID
  const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID || 't5zu4kays7';

  if (clarityProjectId && typeof window !== 'undefined') {
    try {
      // Microsoft Clarity script injection
      const script = document.createElement('script');

      script.async = true;
      script.src = `https://www.clarity.ms/tag/${clarityProjectId}`;
      script.onload = () => {
        console.warn('Analytics initialized with Clarity project:', clarityProjectId);
      };
      script.onerror = () => {
        console.warn('Analytics script failed to load');
      };
      document.head.appendChild(script);
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
