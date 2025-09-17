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
        <img src="/voder-logo-final.svg" alt="Voder" class="logo" width="120" height="40" />
      </div>
    </header>
    
    <main class="main-content" role="main">
      <div class="container">
        <section class="hero-section">
          <h1 class="hero-title">The Compiler for Prompts</h1>
          <p class="hero-description">
            Transform prompts into sustainable, maintainable code.
            Experience the future of AI-assisted development.
          </p>
          <div class="status-indicator">
            <span class="status-text">Coming Soon</span>
          </div>
        </section>
      </div>
    </main>
  `;
}
