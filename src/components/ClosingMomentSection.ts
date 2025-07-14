// src/components/ClosingMomentSection.ts

export class ClosingMomentSection {
  constructor(container: HTMLElement) {
    const section = document.createElement('section');
    section.setAttribute('role', 'contentinfo');
    section.setAttribute('aria-labelledby', 'closing-heading');

    // Live region for screen readers
    const liveDiv = document.createElement('div');
    liveDiv.setAttribute('aria-live', 'polite');
    liveDiv.setAttribute('aria-atomic', 'true');
    section.appendChild(liveDiv);

    // Hidden heading for screen readers
    const srHeading = document.createElement('h2');
    srHeading.id = 'closing-heading';
    srHeading.classList.add('visually-hidden');
    srHeading.textContent = 'Voder brand conclusion';
    section.appendChild(srHeading);

    // Closing statement block
    const stmt = document.createElement('div');
    stmt.classList.add('closing-statement');
    stmt.innerHTML = `
      <h3 class="tagline">The Compiler for Prompts</h3>
      <p class="coming-soon">Coming Soon</p>
      <p class="built-with" aria-label="Website attribution">
        Built with Voder. (Of course.)
      </p>
    `;
    section.appendChild(stmt);

    container.appendChild(section);
  }
}
