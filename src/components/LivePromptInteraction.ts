/**
 * Live Prompt Interaction  private container: HTMLElement;
  private currentExample: number = 0;tem
 * Sophisticated curated demonstration system to replace static mockup
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PromptExample {
  id: string;
  prompt: string;
  uiChanges: {
    heading: string;
    buttonText: string;
    theme: 'casual' | 'premium' | 'dark';
    colorPalette: {
      primary: string;
      background: string;
      text: string;
      accent: string;
    };
    typography: {
      weight: number;
      spacing: string;
      size: string;
    };
  };
}

export class LivePromptInteraction {
  private container: HTMLElement;
  private currentExampleIndex: number = 0;
  private isTransitioning: boolean = false;
  private cyclingTimer: number | null = null;
  private readonly cycleDuration = 4000; // 4 seconds per example

  private examples: PromptExample[] = [
    {
      id: 'casual',
      prompt: 'Tone: Casual, confident, modern.',
      uiChanges: {
        heading: "Let's get you started!",
        buttonText: 'Get Started',
        theme: 'casual',
        colorPalette: {
          primary: '#3B82F6',
          background: '#FFFFFF',
          text: '#1F2937',
          accent: '#EF4444'
        },
        typography: {
          weight: 500,
          spacing: '0.05em',
          size: '1.125rem'
        }
      }
    },
    {
      id: 'premium',
      prompt: 'Tone: Premium, minimalist.',
      uiChanges: {
        heading: 'Begin your journey.',
        buttonText: 'Begin',
        theme: 'premium',
        colorPalette: {
          primary: '#6B7280',
          background: '#F9FAFB',
          text: '#374151',
          accent: '#10B981'
        },
        typography: {
          weight: 300,
          spacing: '0.1em',
          size: '1rem'
        }
      }
    },
    {
      id: 'dark',
      prompt: 'Dark mode',
      uiChanges: {
        heading: 'Enter the experience.',
        buttonText: 'Enter',
        theme: 'dark',
        colorPalette: {
          primary: '#24D1D5',
          background: '#0F1A2E',
          text: '#FFFFFF',
          accent: '#9AEF00'
        },
        typography: {
          weight: 400,
          spacing: '0.02em',
          size: '1.25rem'
        }
      }
    }
  ];

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.createHTML();
    this.setupTransitionFromVisionFlow();
    this.setupHoverReveals();
    this.setupAccessibility();
    this.addTestSelectors();
    this.startAutomaticCycling();
  }

  private createHTML(): void {
    this.container.innerHTML = `
      <section 
        aria-labelledby="prompt-iteration-heading" 
        class="prompt-iteration-section"
        data-testid="prompt-iteration-section"
      >
        <!-- Background with warm lighting effects -->
        <div class="prompt-background" data-testid="prompt-background">
          <div class="warm-lighting-overlay"></div>
        </div>

        <!-- Main content area -->
        <div class="prompt-content-wrapper">
          <h2 id="prompt-iteration-heading" class="prompt-heading">
            Change the prompt. Not the team.
          </h2>

          <!-- Split-screen layout -->
          <div class="split-screen-container" data-testid="split-screen-container">
            <!-- Left side: Prompt panel -->
            <div class="prompt-panel-container">
              <div class="prompt-panel" aria-label="Interactive prompt input panel" data-testid="prompt-panel">
                <div class="prompt-header">
                  <span class="prompt-label">Prompt:</span>
                </div>
                <pre class="prompt-content" data-testid="prompt-content">${this.examples[0].prompt}</pre>
                
                <!-- Hover reveals container -->
                <div class="hover-reveals" data-testid="hover-reveals">
                  <button 
                    class="reveal-option" 
                    data-example="dark"
                    aria-label="Try dark mode example"
                  >
                    Dark mode
                  </button>
                  <button 
                    class="reveal-option" 
                    data-example="premium"
                    aria-label="Try premium tone example"
                  >
                    Use premium tone
                  </button>
                </div>
              </div>
            </div>

            <!-- Right side: UI preview -->
            <div class="ui-preview-container">
              <div class="ui-mockup" aria-label="Product UI preview" data-testid="ui-mockup">
                <div class="ui-chrome">
                  <div class="ui-header">
                    <div class="ui-dots">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                  <div class="ui-content">
                    <h3 class="ui-heading" data-testid="ui-heading">${this.examples[0].uiChanges.heading}</h3>
                    <button class="ui-button" data-testid="ui-button">${this.examples[0].uiChanges.buttonText}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <p class="prompt-iteration-subtext">
            With Voder, your intent drives product delivery. No briefs. No handoffs. No misalignment.
          </p>
        </div>

        <!-- Accessibility live region -->
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          class="sr-only"
          data-testid="prompt-announcer"
        ></div>

        <!-- Skip link -->
        <button 
          class="skip-link"
          data-testid="skip-prompt-demo"
          aria-label="Skip prompt demonstration"
        >
          Skip Demo
        </button>
      </section>
    `;
  }

  private setupTransitionFromVisionFlow(): void {
    const section = this.container.querySelector('.prompt-iteration-section') as HTMLElement;
    
    // Initially hide the section
    gsap.set(section, { opacity: 0 });
    gsap.set('.prompt-panel', { opacity: 0, y: 50 });
    gsap.set('.ui-mockup', { opacity: 0, x: 30 });

    // Create the 5-second transition from Vision Flow
    ScrollTrigger.create({
      trigger: '#vision-flow',
      start: 'bottom 20%',
      end: 'bottom top',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        if (progress > 0.2) {
          // Phase 1: Diagram zoom-out and blur (handled by Vision Flow section)
          
          // Phase 2: Background darkening
          const darkenProgress = Math.max(0, (progress - 0.2) / 0.3);
          gsap.to('body', {
            duration: 0.1,
            backgroundColor: gsap.utils.interpolate('#0F1A2E', '#0A0A0A', darkenProgress)
          });

          // Phase 3: Prompt panel fade-in
          if (progress > 0.5) {
            const fadeProgress = Math.max(0, (progress - 0.5) / 0.5);
            gsap.to(section, {
              duration: 0.1,
              opacity: fadeProgress
            });
            gsap.to('.prompt-panel', {
              duration: 0.1,
              opacity: fadeProgress,
              y: 50 * (1 - fadeProgress)
            });
            gsap.to('.ui-mockup', {
              duration: 0.1,
              opacity: fadeProgress,
              x: 30 * (1 - fadeProgress)
            });
          }
        }
      }
    });

    // Announce when ready
    this.announceToScreenReader('Prompt iteration demonstration ready');
  }

  private setupHoverReveals(): void {
    const revealOptions = this.container.querySelectorAll('.reveal-option');
    
    revealOptions.forEach((option) => {
      const button = option as HTMLButtonElement;
      const exampleId = button.dataset.example;
      
      button.addEventListener('mouseenter', () => {
        this.previewExample(exampleId!);
      });
      
      button.addEventListener('mouseleave', () => {
        this.returnToCurrentExample();
      });
      
      button.addEventListener('click', () => {
        this.selectExample(exampleId!);
      });
      
      // Add smooth expansion animation
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          duration: 0.3,
          scale: 1.05,
          backgroundColor: '#24D1D5',
          color: '#0A0A0A',
          ease: 'power2.out'
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          duration: 0.3,
          scale: 1,
          backgroundColor: 'transparent',
          color: '#24D1D5',
          ease: 'power2.out'
        });
      });
    });
  }

  private previewExample(exampleId: string): void {
    const example = this.examples.find(ex => ex.id === exampleId);
    if (!example) return;

    this.pauseCycling();
    this.applyUITransformation(example, 0.3); // Quick preview
  }

  private returnToCurrentExample(): void {
    const currentExample = this.examples[this.currentExampleIndex];
    this.applyUITransformation(currentExample, 0.3);
    this.resumeCycling();
  }

  private selectExample(exampleId: string): void {
    const exampleIndex = this.examples.findIndex(ex => ex.id === exampleId);
    if (exampleIndex === -1) return;

    this.currentExampleIndex = exampleIndex;
    const example = this.examples[exampleIndex];
    
    this.applyUITransformation(example, 0.6); // Longer selection animation
    this.announceToScreenReader(`Prompt changed to: ${example.prompt}`);
    
    // Reset cycling from this example
    this.restartCycling();
  }

  private applyUITransformation(example: PromptExample, duration: number = 0.8): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const promptContent = this.container.querySelector('.prompt-content') as HTMLElement;
    const uiHeading = this.container.querySelector('.ui-heading') as HTMLElement;
    const uiButton = this.container.querySelector('.ui-button') as HTMLElement;
    const uiMockup = this.container.querySelector('.ui-mockup') as HTMLElement;

    // Create transformation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        this.isTransitioning = false;
      }
    });

    // Prompt text change with typing effect
    tl.to(promptContent, {
      duration: duration * 0.3,
      opacity: 0,
      ease: 'power2.out'
    })
    .call(() => {
      this.typewriterEffect(promptContent, example.prompt);
    })
    .to(promptContent, {
      duration: duration * 0.3,
      opacity: 1,
      ease: 'power2.out'
    }, '-=0.1');

    // UI transformation with color morphing
    tl.to(uiMockup, {
      duration: duration,
      backgroundColor: example.uiChanges.colorPalette.background,
      ease: 'power2.inOut'
    }, 0)
    .to(uiHeading, {
      duration: duration,
      color: example.uiChanges.colorPalette.text,
      fontWeight: example.uiChanges.typography.weight,
      letterSpacing: example.uiChanges.typography.spacing,
      fontSize: example.uiChanges.typography.size,
      ease: 'power2.inOut',
      onUpdate: function() {
        uiHeading.textContent = example.uiChanges.heading;
      }
    }, 0)
    .to(uiButton, {
      duration: duration,
      backgroundColor: example.uiChanges.colorPalette.primary,
      color: example.uiChanges.colorPalette.background,
      borderColor: example.uiChanges.colorPalette.primary,
      ease: 'power2.inOut',
      onUpdate: function() {
        uiButton.textContent = example.uiChanges.buttonText;
      }
    }, 0);

    // Add warm lighting effects
    this.addWarmLightingEffect(duration);
  }

  private typewriterEffect(element: HTMLElement, text: string): void {
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i > text.length) {
        clearInterval(timer);
      }
    }, 30);
  }

  private addWarmLightingEffect(duration: number): void {
    const lightingOverlay = this.container.querySelector('.warm-lighting-overlay') as HTMLElement;
    
    gsap.to(lightingOverlay, {
      duration: duration,
      background: 'radial-gradient(circle at center, rgba(255, 193, 128, 0.1) 0%, transparent 70%)',
      ease: 'power2.inOut'
    });
  }

  private startAutomaticCycling(): void {
    // Don't start automatic cycling during tests or if user prefers reduced motion
    if (this.isTestEnvironment() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    this.cyclingTimer = window.setInterval(() => {
      if (!this.isTransitioning) {
        this.nextExample();
      }
    }, this.cycleDuration);
  }

  private isTestEnvironment(): boolean {
    // Check for common test environment indicators
    const windowWithTest = window as Window & {
      __playwright?: unknown;
      __puppeteer?: unknown;
    };
    
    return !!(
      windowWithTest.__playwright || 
      windowWithTest.__puppeteer || 
      navigator.webdriver ||
      (window.location.hostname === 'localhost' && window.location.port === '4173')
    );
  }

  private pauseCycling(): void {
    if (this.cyclingTimer) {
      clearInterval(this.cyclingTimer);
      this.cyclingTimer = null;
    }
  }

  private resumeCycling(): void {
    if (!this.cyclingTimer) {
      this.startAutomaticCycling();
    }
  }

  private restartCycling(): void {
    this.pauseCycling();
    this.startAutomaticCycling();
  }

  private nextExample(): void {
    this.currentExampleIndex = (this.currentExampleIndex + 1) % this.examples.length;
    const example = this.examples[this.currentExampleIndex];
    this.applyUITransformation(example);
  }

  private setupAccessibility(): void {
    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousExample();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextExample();
          break;
        case 'Escape':
          e.preventDefault();
          this.skipDemo();
          break;
      }
    });

    // Skip demo functionality
    const skipButton = this.container.querySelector('.skip-link') as HTMLButtonElement;
    skipButton.addEventListener('click', () => this.skipDemo());

    // Focus management
    this.container.setAttribute('tabindex', '0');
    this.container.setAttribute('role', 'application');
    this.container.setAttribute('aria-label', 'Interactive prompt demonstration');
  }

  private previousExample(): void {
    this.currentExampleIndex = this.currentExampleIndex === 0 
      ? this.examples.length - 1 
      : this.currentExampleIndex - 1;
    const example = this.examples[this.currentExampleIndex];
    this.applyUITransformation(example);
    this.announceToScreenReader(`Previous example: ${example.prompt}`);
    this.restartCycling();
  }

  private skipDemo(): void {
    this.pauseCycling();
    
    // Jump to final state
    const finalExample = this.examples[this.examples.length - 1];
    this.applyUITransformation(finalExample, 0.1);
    
    this.announceToScreenReader('Prompt demonstration skipped');
    
    // Scroll to next section
    const nextSection = this.container.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private addTestSelectors(): void {
    // Test selectors are already added in createHTML()
  }

  private announceToScreenReader(message: string): void {
    const announcer = this.container.querySelector('[data-testid="prompt-announcer"]') as HTMLElement;
    if (announcer) {
      announcer.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  }

  public destroy(): void {
    this.pauseCycling();
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === this.container) {
        trigger.kill();
      }
    });
  }
}
