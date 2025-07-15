/**
 * Renders the “Prompt-Driven Iteration” section:
 * shows a prompt panel, live-updates code-driven UI, and descriptive text.
 */
export class PromptIterationSection {
  constructor(container: HTMLElement) {
    const section = document.createElement('section');
    section.setAttribute('role', 'region');
    section.setAttribute('aria-labelledby', 'prompt-iteration-heading');

    section.innerHTML = `
  <h2 id="prompt-iteration-heading">Change the prompt. Not the team.</h2>
  <div class="prompt-panel" role="img" aria-label="Prompt input showing Tone: Casual, confident, modern.">
    <div aria-live="polite"><pre class="prompt-content">Casual, confident, modern.</pre></div>
  </div>
  <div class="ui-mockup" role="img" aria-label="Product UI showing heading ‘Let’s get you started!’">
    <h3>Let’s get you started!</h3>
  </div>
  <p class="prompt-iteration-subtext">With Voder, your intent drives product delivery. No briefs. No handoffs. No misalignment.</p>
`;
    container.appendChild(section);

    function updateContent() {
      const pre = section.querySelector('pre.prompt-content');
      if (pre) pre.textContent = 'Premium, minimalist.';
      const h3 = section.querySelector('div.ui-mockup h3');
      if (h3) h3.textContent = 'Begin your journey.';
    }

    // IntersectionObserver for prompt iteration section
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateContent();
          // trigger content update when section intersects

          obs.disconnect();
        }
      });
    });
    observer.observe(section);

    // If the section is already visible on mount, update immediately
    if (
      section.getBoundingClientRect().top <= window.innerHeight &&
      section.getBoundingClientRect().bottom >= 0
    ) {
      updateContent();
      observer.disconnect();
    }

    // Fallback scroll listener to ensure update once when section enters viewport
    let contentUpdated = false;
    const scrollHandler = () => {
      if (contentUpdated) return;
      const rect = section.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        // updateContent() deferred until section enters viewport
        updateContent();
        contentUpdated = true;
        window.removeEventListener('scroll', scrollHandler);
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    // Initial update on load
    // No initial content update to preserve default state

    }
}
