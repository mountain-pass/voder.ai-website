// src/components/MetaphorSection.ts

export class MetaphorSection {
  constructor(container: HTMLElement) {
    const section = document.createElement('section');
    section.setAttribute('data-testid', 'metaphor-section');
    section.setAttribute('role', 'region');
    section.setAttribute('aria-labelledby', 'metaphor-heading');

    const heading = document.createElement('h2');
    heading.id = 'metaphor-heading';
    heading.textContent = 'You’ve been in the passenger seat.';
    section.appendChild(heading);

    // Decorative diagram
    const diagram = document.createElement('div');
    diagram.className = 'journey-diagram';
    diagram.setAttribute('role', 'img');
    diagram.setAttribute('aria-labelledby', 'metaphor-description');
    section.appendChild(diagram);

    const desc = document.createElement('div');
    desc.id = 'metaphor-description';
    desc.className = 'sr-only';
    desc.textContent =
      'A smooth curved path connects nodes labelled Idea, Design, Code, Ship to illustrate the journey metaphor.';
    section.appendChild(desc);

    const p1 = document.createElement('p');
    p1.textContent =
      'Tools like Copilot and Cursor help you steer… but you’re still stuck giving directions.';
    section.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'What if your system already knew the destination?';
    section.appendChild(p2);

    container.appendChild(section);
  }
}
