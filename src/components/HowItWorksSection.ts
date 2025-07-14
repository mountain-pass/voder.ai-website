// src/components/HowItWorksSection.ts

export class HowItWorksSection {
  constructor(container: HTMLElement) {
    const section = document.createElement('section');

    // Hide until activated by animations

    section.setAttribute('role', 'region');
    section.setAttribute('aria-labelledby', 'flow-heading');
    section.id = 'vision-flow';

    section.innerHTML = `
      <h2 id="flow-heading">How It Works</h2>
      <div role="img" aria-labelledby="flow-description" class="flow-diagram">
        <svg width="200" height="400" aria-hidden="true">
          <line x1="100" y1="50"  x2="100" y2="350" stroke="#24D1D5" stroke-width="2"/>
          <circle cx="100" cy="80"  r="6" fill="#FFFFFF"/>
          <circle cx="100" cy="180" r="6" fill="#FFFFFF"/>
          <circle cx="100" cy="280" r="6" fill="#FFFFFF"/>
          <circle cx="100" cy="350" r="6" fill="#FFFFFF"/>
        </svg>
      </div>
      <div id="flow-description" class="sr-only">
        Business Intent leads to Source Prompts, which are processed by Voder 
        to create Application Code, resulting in a Working Product.
      </div>
      <div class="flow-text">
        <div class="flow-step">
          <h3>Source Prompts</h3>
          <p>Intent lives in markdown prompts.</p>
        </div>
        <div class="flow-step">
          <h3>Voder</h3>
          <p>Voder interprets and compiles your vision.</p>
        </div>
        <div class="flow-step">
          <h3>Application Code</h3>
          <p>Code is written, structured, and versioned — for real.</p>
        </div>
        <div class="flow-step">
          <h3>Working Product</h3>
        </div>
      </div>
    `;
    container.appendChild(section);
  }
}
