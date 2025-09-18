// App initialization logic extracted for testability
export function init(): void {
  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('App element not found');

    return;
  }

  app.innerHTML = `
    <header class="brand-header" role="banner">
      <div class="logo-container">
        <div class="logo-text" aria-label="Voder">VODER</div>
      </div>
    </header>
    
    <main class="main-content" role="main">
      <div class="container">
        <section class="hero-section">
          <h1 class="hero-title">Keep Shipping Fast</h1>
          <p class="hero-description">
            Stop AI from turning your codebase into an unmaintainable mess.
            AI development that stays clean and scales with your team.
          </p>
          <div class="status-indicator">
            <span class="status-text">Coming Soon</span>
          </div>
        </section>
      </div>
    </main>
  `;
}
