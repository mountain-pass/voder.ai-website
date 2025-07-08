// src/components/BrandEntry.ts

export function BrandEntry(): HTMLElement {
  const section = document.createElement('section');
  section.setAttribute('role', 'banner');
  section.setAttribute('aria-label', 'Voder brand introduction');

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  section.appendChild(canvas);

  const liveDiv = document.createElement('div');
  liveDiv.setAttribute('aria-live', 'polite');
  liveDiv.setAttribute('aria-atomic', 'true');
  section.appendChild(liveDiv);

  const title = document.createElement('h1');
  title.textContent = 'Voder';
  section.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'The Compiler for Prompts';
  section.appendChild(subtitle);

  const skipLink = document.createElement('a');
  skipLink.setAttribute('href', '#main-content');
  skipLink.classList.add('skip-link');
  skipLink.textContent = 'Skip to main content';
  section.appendChild(skipLink);

  return section;
}
