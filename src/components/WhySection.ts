export function renderWhySection(container: HTMLElement): void {
  const section = document.createElement('section');
  section.setAttribute('role', 'main');
  section.setAttribute('aria-labelledby', 'why-heading');
  section.id = 'main-content';



  // wrapper for test locator

  // 3D transition overlay
  const threeD = document.createElement('div');
  threeD.className = 'three-d-transition';
  threeD.setAttribute('aria-hidden', 'true');

  // main heading
  const heading = document.createElement('h1');
  heading.id = 'why-heading';
  heading.className = 'typing-animation';
  heading.textContent = 'We believe software should start with intent.';
  heading.style.setProperty('color', '#FFFFFF', 'important');

  // subheading
  const subheading = document.createElement('p');
  subheading.className = 'subheading';
  subheading.textContent =
    'Not code. Not files. Not frameworks. But the spark behind them all.';
  subheading.style.setProperty('color', '#FFFFFF', 'important');
  // ensure full contrast for WCAG

  // live region
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');

  section.append(threeD, heading, subheading, liveRegion);

  container.appendChild(section);
}
