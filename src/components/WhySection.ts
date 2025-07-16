export function renderWhySection(container: HTMLElement): void {
  const section = document.createElement('section');
  section.setAttribute('role', 'main');
  section.setAttribute('aria-labelledby', 'why-heading');
  section.id = 'main-content';
  
  // Set initial background color for transition (Deep Navy)
  section.style.backgroundColor = '#0F1A2E';
  section.style.height = '100vh';
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.padding = '2rem';
  section.style.position = 'relative';

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
  heading.style.fontSize = '3rem';
  heading.style.fontWeight = '600';
  heading.style.margin = '0 0 2rem 0';
  heading.style.textAlign = 'center';
  heading.style.maxWidth = '800px';
  heading.style.opacity = '1'; // Start visible

  // subheading
  const subheading = document.createElement('p');
  subheading.className = 'subheading';
  subheading.textContent =
    'Not code. Not files. Not frameworks. But the spark behind them all.';
  subheading.style.setProperty('color', '#C6CBD4', 'important');
  subheading.style.fontSize = '1.5rem';
  subheading.style.margin = '0';
  subheading.style.textAlign = 'center';
  subheading.style.maxWidth = '600px';
  subheading.style.opacity = '1'; // Start visible

  // live region for accessibility announcements
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.top = 'auto';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';

  section.append(threeD, heading, subheading, liveRegion);

  container.appendChild(section);
}
