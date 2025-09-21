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

        <section class="problem-space" role="region" aria-labelledby="problem-title">
          <h2 id="problem-title" class="problem-title">Sound Familiar?</h2>
          <div class="problem-content">
            <p class="problem-description">
              You started using AI to ship faster, but now your codebase looks like it was written by a caffeinated intern having a breakdown.
            </p>
            <div class="problem-examples">
              <div class="problem-item">
                <span class="problem-icon">📁</span>
                <p>Empty .md files everywhere because AI "documented" your features</p>
              </div>
              <div class="problem-item">
                <span class="problem-icon">🔧</span>
                <p>Scripts that work once, then break mysteriously in production</p>
              </div>
              <div class="problem-item">
                <span class="problem-icon">🏗️</span>
                <p>Architecture that made sense to GPT but confuses every human</p>
              </div>
              <div class="problem-item">
                <span class="problem-icon">⏰</span>
                <p>Debugging takes longer than writing the original code</p>
              </div>
            </div>
            <div class="problem-question">
              <p class="resonance-check">Does this resonate with your experience?</p>
            </div>
          </div>
        </section>

        <section class="interest-capture">
          <h2 class="signup-title">Get notified when we launch</h2>
            <form class="signup-form" id="interest-form" aria-label="Email signup form">
              <div class="form-group">
                <label for="email" class="sr-only">Email address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter your email address" 
                  required 
                  class="email-input"
                  aria-describedby="email-hint"
                />
                <span id="email-hint" class="sr-only">We'll notify you when Voder launches</span>
              </div>
              <button type="submit" class="signup-button">Join the Waitlist</button>
              <div class="form-status" id="form-status" aria-live="polite"></div>
            </form>
          </div>
        </section>
      </div>
    </main>
  `;

  // Add form submission handling
  const form = document.getElementById('interest-form') as HTMLFormElement;

  const emailInput = document.getElementById('email') as HTMLInputElement;

  const formStatus = document.getElementById('form-status') as HTMLDivElement;

  if (form && emailInput && formStatus) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email) {
        formStatus.textContent = 'Please enter your email address.';
        formStatus.className = 'form-status error';
        emailInput.focus();

        return;
      }

      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.className = 'form-status error';
        emailInput.focus();

        return;
      }

      // Simulate form submission (in a real app, this would send to a server)
      formStatus.textContent = "Thank you! We'll notify you when Voder launches.";
      formStatus.className = 'form-status success';
      emailInput.value = '';

      // Track the signup conversion in analytics
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('set', 'email_signup', email);
        (window as any).clarity('event', 'waitlist_signup');
      }
    });
  }
}
