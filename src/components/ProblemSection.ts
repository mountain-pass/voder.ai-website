// src/components/ProblemSection.ts
// Temporarily disabled for debugging
// import { VisualChaos } from '../lib/VisualChaos';

export function renderProblemSection(container: HTMLElement): void {
  // Section wrapper
  const section = document.createElement('section');

  section.setAttribute('role', 'region');
  section.setAttribute('data-test-id', 'problem-section');
  section.setAttribute('aria-labelledby', 'problem-heading');
  section.style.position = 'relative';
  section.style.height = '100vh';
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.backgroundColor = '#0A0A0A'; // Voder Black
  section.style.padding = '2rem';

  // Content wrapper (simplified - no 3D canvas for now)
  const contentWrapper = document.createElement('div');
  contentWrapper.style.position = 'relative';
  contentWrapper.style.zIndex = '2';
  contentWrapper.style.textAlign = 'center';
  contentWrapper.style.maxWidth = '800px';
  contentWrapper.style.margin = '0 auto';

  // Create the <h2> heading
  const heading = document.createElement('h2');
  heading.id = 'problem-heading';
  heading.textContent = 'The problem isn’t your tools.';
  heading.style.color = '#FFFFFF';
  heading.style.fontSize = '3rem';
  heading.style.fontWeight = '600';
  heading.style.margin = '0 0 2rem 0';
  heading.style.textAlign = 'center';

  // Create the secondary heading
  const secondary = document.createElement('p');
  secondary.classList.add('secondary-heading');
  secondary.textContent =
    'It’s the gap between your ideas and your implementation.';
  secondary.style.color = '#C6CBD4'; // Cool Grey
  secondary.style.fontSize = '1.5rem';
  secondary.style.margin = '0 0 2rem 0';
  secondary.style.textAlign = 'center';

  // Create the paragraph copy
  const copy = document.createElement('p');
  copy.textContent =
    'Developers stitch together frameworks, boilerplate, and brittle glue code — all to approximate what you actually meant.';
  copy.classList.add('secondary-copy');
  copy.style.color = '#C6CBD4'; // Cool Grey as specified
  copy.style.fontSize = '1.2rem';
  copy.style.lineHeight = '1.6';
  copy.style.textAlign = 'center';
  copy.style.margin = '0';

  // Assemble content
  contentWrapper.append(heading, secondary, copy);
  section.appendChild(contentWrapper);

  container.appendChild(section);
}
