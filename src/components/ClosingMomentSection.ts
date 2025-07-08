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

    // Logo signature
    const logoWrap = document.createElement('div');
    logoWrap.classList.add('logo-signature');
    logoWrap.setAttribute('aria-label', 'Voder logo signature');
    const img = document.createElement('img');
    img.src = '/voder-logo.svg';
    img.alt = 'Voder';
    logoWrap.appendChild(img);
    section.appendChild(logoWrap);

    container.appendChild(section);
  }
}
