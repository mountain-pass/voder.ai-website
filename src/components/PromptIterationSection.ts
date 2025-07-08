// src/components/PromptIterationSection.ts

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
      <!-- Live region for screen readers -->
      <div aria-live="polite" aria-atomic="true" class="prompt-iteration-live"></div>

      <!-- Stylized prompt panel -->
      <div class="prompt-panel" role="img" aria-label="Prompt input showing Tone: Casual, confident, modern.">
        <label>Tone:</label>
        <pre class="prompt-content">Casual, confident, modern.</pre>
      </div>

      <!-- Headline -->
      <h2 id="prompt-iteration-heading">Change the prompt. Not the team.</h2>

      <!-- Subtext -->
      <p class="prompt-iteration-subtext">
        With Voder, your intent drives product delivery. No briefs. No handoffs. No misalignment.
      </p>

      <!-- Resulting UI mockup -->
      <div class="ui-mockup" role="img" aria-label="Product UI showing heading ‘Let’s get you started!’ and a Get Started button.">
        <h3>Let’s get you started!</h3>
      </div>
      <button aria-label="Get Started">Get Started</button>
    `;

    container.appendChild(section);
  }
}
