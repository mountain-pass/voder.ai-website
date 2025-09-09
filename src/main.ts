// Main entry point for Voder website
import './style.css';

console.log('Voder website starting...');

// Basic app initialization
function init() {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('App element not found');

    return;
  }

  app.innerHTML = `
    <div class="container">
      <h1>Voder</h1>
      <p>The future of AI-assisted development</p>
      <p class="subtitle">Coming soon...</p>
    </div>
  `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
