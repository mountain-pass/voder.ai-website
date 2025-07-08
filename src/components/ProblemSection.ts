// src/components/ProblemSection.ts

export function renderProblemSection(container: HTMLElement): void {
  // Section wrapper
  const section = document.createElement('section');
  section.setAttribute('data-test-id', 'problem-section');
  section.setAttribute('aria-labelledby', 'problem-heading');

  // Create the <h2> heading
  const heading = document.createElement('h2');
  heading.id = 'problem-heading';
  heading.textContent = 'The Problem Space';

  // Create the decorative div
  const chaos = document.createElement('div');
  chaos.className = 'visual-chaos';
  chaos.setAttribute('aria-hidden', 'true');

  // Create the paragraph copy
  const copy = document.createElement('p');
  copy.textContent =
    'Developers stitch together frameworks, boilerplate, and brittle glue code — all to approximate what you actually meant.';

  // Assemble and append
  section.append(heading, chaos, copy);
  container.appendChild(section);
}
