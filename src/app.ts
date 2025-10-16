import { ThreeAnimation } from './three-animation.js';

// App initialization logic extracted for testability
export function init(): void {
  // Add loading state for smooth transitions
  document.body.classList.add('js-loading');

  const app = document.querySelector<HTMLDivElement>('#app');

  if (!app) {
    console.error('App element not found');

    return;
  }

  // Content is now statically rendered in index.html for better SEO and performance
  // This fallback is no longer needed but kept for backwards compatibility

  // Add form submission handling
  const form = document.getElementById('interest-form') as HTMLFormElement;

  const emailInput = document.getElementById('email') as HTMLInputElement;

  const formStatus = document.getElementById('form-status') as HTMLDivElement;

  if (form && emailInput && formStatus) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Always prevent default for AJAX submission

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

      // Show loading state
      formStatus.textContent = 'Subscribing...';
      formStatus.className = 'form-status loading';

      // Disable form during submission
      const submitButton = form.querySelector('.signup-button') as HTMLButtonElement;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
      }

      try {
        // Track the signup conversion in analytics before form submission
        if (typeof window !== 'undefined' && (window as any).clarity) {
          (window as any).clarity('set', 'email_signup', email);
          (window as any).clarity('event', 'waitlist_signup');
        }

        // Submit form data to Netlify using AJAX
        const formData = new FormData(form);

        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData as any).toString(),
        });

        if (response.ok) {
          formStatus.textContent = "Thank you! We'll notify you when Voder launches.";
          formStatus.className = 'form-status success';
          form.reset(); // Clear the form

          // Reset button state
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Join the Waitlist';
          }
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        formStatus.textContent = 'Something went wrong. Please try again.';
        formStatus.className = 'form-status error';

        // Reset button state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Join the Waitlist';
        }
      }
    });
  }

  // Initialize 3D animation
  const animationContainer = document.getElementById('hero-animation');

  if (animationContainer) {
    try {
      const animation = new ThreeAnimation({ container: animationContainer });

      animation.init().catch((error) => {
        console.warn('3D animation initialization failed:', error);
      });

      // Handle reduced motion preference (check if matchMedia exists for test environment)
      if (typeof window !== 'undefined' && window.matchMedia) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
          animation.pause();
        }

        // Listen for changes to motion preference
        prefersReducedMotion.addEventListener('change', (e) => {
          if (e.matches) {
            animation.pause();
          } else {
            animation.resume();
          }
        });
      }
    } catch (error) {
      console.warn('3D animation constructor failed:', error);
    }
  }

  // Mark JavaScript as fully loaded for smooth transitions
  document.body.classList.remove('js-loading');
  document.body.classList.add('js-loaded');
}
