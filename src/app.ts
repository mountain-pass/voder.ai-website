// App initialization logic extracted for testability
export function init(): void {
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
