// Main entry point for Voder website
import './style.css';

import { init } from './app.js';

console.warn('Voder website starting...');

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
