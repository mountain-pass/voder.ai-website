/**
 * Ren    section.innerHTML = `
  <h2 id="prompt-iteration-heading">Change the prompt. Not the team.</h2>
  <div class="prompt-panel" role="img" aria-label="Prompt input showing Tone: Casual, confident, modern.">
    <pre class="prompt-content">Casual, confident, modern.</pre>
    <div aria-live="polite" class="visually-hidden"></div>
  </div>
  <div class="ui-mockup" role="img" aria-label="Product UI showing heading 'Let's get you started!'">
    <h3>Let's get you started!</h3>
  </div>
  <p class="prompt-iteration-subtext">With Voder, your intent drives product delivery. No briefs. No handoffs. No misalignment.</p>
`;Prompt-Driven Iteration” section:
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

    // Simple scroll-based content update
    let contentUpdated = false;
    const scrollHandler = () => {
      if (contentUpdated) return;
      
      // Update content after any scroll event (triggered by test scrolling)
      if (window.scrollY > 0) {
        updateContent();
        contentUpdated = true;
        window.removeEventListener('scroll', scrollHandler);
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    }
}
