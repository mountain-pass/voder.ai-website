// src/components/ClosingMomentSection.ts

export class ClosingMomentSection {
  constructor(container: HTMLElement) {
    const section = document.createElement('section');
    section.style.backgroundColor = 'var(--color-voder-black)';
    section.setAttribute('role', 'contentinfo');
    section.setAttribute('data-testid', 'voder-black-background');
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
      <p class="coming-soon" data-testid="coming-soon">Coming Soon</p>
      <p class="built-with" aria-label="Website attribution">
        Built with Voder. (Of course.)
      </p>
    `;
    section.appendChild(stmt);
    const taglineEl = section.querySelector('.tagline');
    if (taglineEl) taglineEl.setAttribute('data-testid', 'compiler-tagline');

    container.appendChild(section);

    // Append the new logo signature
    const logoSignature = document.createElement('div');
    logoSignature.classList.add('logo-signature');
    logoSignature.setAttribute('aria-label', 'Voder logo signature');
    const logoImg = document.createElement('img');
    logoImg.src = '/voder-logo.svg';
    logoImg.alt = 'Voder';
    logoImg.setAttribute('data-testid', 'voder-logo');
    logoSignature.appendChild(logoImg);
    section.appendChild(logoSignature);
  }
}
