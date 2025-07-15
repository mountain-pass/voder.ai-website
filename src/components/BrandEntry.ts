// src/components/BrandEntry.ts
// Temporarily disabled for debugging
// import { BrandEntry3D } from '../lib/BrandEntry3D';

export function BrandEntry(): HTMLElement {
  const section = document.createElement('section');
  section.setAttribute('role', 'banner');
  section.setAttribute('aria-label', 'Voder brand introduction');
  section.style.position = 'relative';
  section.style.height = '100vh';
  section.style.display = 'flex';
  section.style.flexDirection = 'column';
  section.style.justifyContent = 'center';
  section.style.alignItems = 'center';
  section.style.backgroundColor = '#0A0A0A'; // Voder Black

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1';
  section.appendChild(canvas);

  const liveDiv = document.createElement('div');
  liveDiv.setAttribute('aria-live', 'polite');
  liveDiv.setAttribute('aria-atomic', 'true');
  liveDiv.style.position = 'absolute';
  liveDiv.style.opacity = '0';
  liveDiv.style.pointerEvents = 'none';
  section.appendChild(liveDiv);

  const contentWrapper = document.createElement('div');
  contentWrapper.style.position = 'relative';
  contentWrapper.style.zIndex = '2';
  contentWrapper.style.textAlign = 'center';
  contentWrapper.style.color = '#FFFFFF';

  const title = document.createElement('h1');
  title.textContent = 'Voder';
  title.style.fontSize = '4rem';
  title.style.fontWeight = '600';
  title.style.margin = '0 0 1rem 0';
  title.style.color = '#FFFFFF';
  contentWrapper.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'The Compiler for Prompts';
  subtitle.style.fontSize = '1.5rem';
  subtitle.style.margin = '0';
  subtitle.style.opacity = '0.8';
  subtitle.style.color = '#C6CBD4'; // Cool Grey
  contentWrapper.appendChild(subtitle);

  const skipLink = document.createElement('a');
  skipLink.setAttribute('href', '#main-content');
  skipLink.classList.add('skip-link');
  skipLink.textContent = 'Skip to main content';
  skipLink.style.position = 'absolute';
  skipLink.style.top = '1rem';
  skipLink.style.left = '1rem';
  skipLink.style.zIndex = '3';
  skipLink.style.color = '#24D1D5';
  skipLink.style.textDecoration = 'underline';
  section.appendChild(skipLink);

  section.appendChild(contentWrapper);

  // Initialize 3D scene after canvas is in DOM
  setTimeout(() => {
    try {
      // Set canvas size
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // TODO: Re-enable 3D after fixing initialization error
      // const brandEntry3D = new BrandEntry3D(canvas);
      
      // Store reference for cleanup
      // (section as HTMLElement & { __brandEntry3D?: BrandEntry3D }).__brandEntry3D = brandEntry3D;
      
      // Handle window resize
      const handleResize = () => {
        const rect = section.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        // brandEntry3D.handleResize();
      };
      
      window.addEventListener('resize', handleResize);
      (section as HTMLElement & { __resizeHandler?: () => void }).__resizeHandler = handleResize;
      
      // Animate in the 3D object
      // brandEntry3D.fadeIn(2000);
      
    } catch {
      // Fallback: show a simple gradient background
      canvas.style.background = 'radial-gradient(circle, #24D1D5 0%, #0A0A0A 70%)';
    }
  }, 100);

  return section;
}
