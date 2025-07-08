export function renderWhySection(container: HTMLElement): void {
  const section = document.createElement('section');
  section.setAttribute('role', 'main');

  // wrapper for test locator
  const wrapper = document.createElement('div');
  wrapper.id = 'main-content';

  // 3D transition overlay
  const threeD = document.createElement('div');
  threeD.className = 'three-d-transition';
  threeD.setAttribute('aria-hidden', 'true');

  // main heading
  const heading = document.createElement('h1');
  heading.id = 'why-heading';
  heading.className = 'typing-animation';
  heading.textContent = 'We believe software should start with intent.';

  // subheading
  const subheading = document.createElement('p');
  subheading.className = 'subheading';
  subheading.textContent =
    'Not code. Not files. Not frameworks. But the spark behind them all.';

  // live region
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');

  wrapper.append(threeD, heading, subheading, liveRegion);
  section.appendChild(wrapper);
  container.appendChild(section);
}
