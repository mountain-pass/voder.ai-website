// Example: Converting a Svelte component to Vanilla TypeScript
// This shows how to migrate your existing HeroSection component

import { gsap } from 'gsap';

export class HeroSection {
  private element: HTMLElement;
  private isAnimated = false;

  constructor(container: HTMLElement) {
    this.element = this.createElement();
    container.appendChild(this.element);
    this.setupEventListeners();
    this.initAnimations();
  }

  private createElement(): HTMLElement {
    const section = document.createElement('section');
    section.className = 'hero-section';
    section.setAttribute('aria-labelledby', 'hero-heading');

    section.innerHTML = `
      <div class="hero-container">
        <header class="hero-content">
          <h1 id="hero-heading" class="hero-title">
            Your AI-Powered Development Partner
          </h1>
          <p class="hero-description">
            Transform your development workflow with intelligent automation
          </p>
          <div class="hero-actions">
            <button class="cta-button primary" type="button">
              Get Started
            </button>
            <button class="cta-button secondary" type="button">
              Learn More
            </button>
          </div>
        </header>
        <div class="hero-visual">
          <div class="cube-container" role="img" aria-label="3D visualization">
            <!-- Three.js canvas will be inserted here -->
          </div>
        </div>
      </div>
    `;

    return section;
  }

  private setupEventListeners(): void {
    const primaryButton = this.element.querySelector('.cta-button.primary');
    const secondaryButton = this.element.querySelector('.cta-button.secondary');

    primaryButton?.addEventListener('click', this.handleGetStarted.bind(this));
    secondaryButton?.addEventListener('click', this.handleLearnMore.bind(this));
  }

  private handleGetStarted(): void {
    // Navigate to contact form or signup
    console.log('Get Started clicked');
  }

  private handleLearnMore(): void {
    // Scroll to next section
    const nextSection = document.querySelector('.why-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  }

  private initAnimations(): void {
    if (this.isAnimated) return;

    const title = this.element.querySelector('.hero-title');
    const description = this.element.querySelector('.hero-description');
    const actions = this.element.querySelector('.hero-actions');
    const visual = this.element.querySelector('.hero-visual');

    // Create timeline for coordinated animations
    const tl = gsap.timeline();

    // Animate elements in sequence
    tl.from(title, {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
    })
      .from(
        description,
        {
          duration: 0.8,
          y: 30,
          opacity: 0,
          ease: 'power3.out',
        },
        '-=0.5'
      )
      .from(
        actions,
        {
          duration: 0.6,
          y: 20,
          opacity: 0,
          ease: 'power3.out',
        },
        '-=0.3'
      )
      .from(
        visual,
        {
          duration: 1.2,
          scale: 0.8,
          opacity: 0,
          ease: 'back.out(1.7)',
        },
        '-=0.8'
      );

    this.isAnimated = true;
  }

  // Public method to trigger animation (useful for scroll triggers)
  public animate(): void {
    this.initAnimations();
  }

  // Cleanup method
  public destroy(): void {
    this.element.remove();
  }
}

// CSS that would go in your global styles
export const heroSectionStyles = `
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #00ff88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.cta-button {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.cta-button.primary {
  background: #00ff88;
  color: #1a1a1a;
}

.cta-button.primary:hover {
  background: #00cc6a;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid #00ff88;
}

.cta-button.secondary:hover {
  background: #00ff88;
  color: #1a1a1a;
}

.hero-visual {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cube-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: rgba(0, 255, 136, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
}
`;
