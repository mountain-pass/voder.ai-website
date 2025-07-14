// src/components/ProblemSection.ts

export function renderProblemSection(container: HTMLElement): void {
  // Section wrapper
  const section = document.createElement('section');

  section.setAttribute('role', 'region');
  section.setAttribute('data-test-id', 'problem-section');
  section.setAttribute('aria-labelledby', 'problem-heading');
  section.setAttribute('data-test-id', 'problem-section');
  section.setAttribute('aria-labelledby', 'problem-heading');

  // Create the <h2> heading
  const heading = document.createElement('h2');
  heading.id = 'problem-heading';
  heading.textContent = 'The problem isn’t your tools.';
  heading.style.color = '#FFFFFF';
  heading.style.color = '#FFFFFF';

  // Create the decorative div
  const chaos = document.createElement('div');
  chaos.className = 'visual-chaos';
  chaos.setAttribute('aria-hidden', 'true');

  // Create the paragraph copy
  const copy = document.createElement('p');
  copy.textContent =
    'Developers stitch together frameworks, boilerplate, and brittle glue code — all to approximate what you actually meant.';
  copy.classList.add('secondary-copy');
  // Ensure this text remains pure white for contrast

  // Assemble and append with secondary heading
  const secondary = document.createElement('p');
  secondary.classList.add('secondary-heading');
  secondary.textContent =
    'It’s the gap between your ideas and your implementation.';

  section.append(heading, secondary, chaos, copy);
  container.appendChild(section);
}
