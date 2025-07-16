// src/components/ProblemSection.ts
import { VisualChaos } from '../lib/VisualChaos';

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

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create 3D canvas for visual chaos only if not reduced motion
  if (!prefersReducedMotion) {
    const canvas = document.createElement('canvas');
    canvas.className = 'visual-chaos'; // Add class for GSAP transitions
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0'; // Start hidden for transition
    canvas.setAttribute('aria-hidden', 'true');
    section.appendChild(canvas);

    // Initialize Visual Chaos system
    const visualChaos = new VisualChaos(canvas);

    // Add grain overlay for atmospheric friction
    const grainOverlay = document.createElement('div');
    grainOverlay.style.position = 'absolute';
    grainOverlay.style.top = '0';
    grainOverlay.style.left = '0';
    grainOverlay.style.width = '100%';
    grainOverlay.style.height = '100%';
    grainOverlay.style.zIndex = '1';
    grainOverlay.style.pointerEvents = 'none';
    grainOverlay.style.background = `
      radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 10, 0.1) 100%),
      repeating-linear-gradient(
        0deg, 
        transparent, 
        transparent 2px, 
        rgba(255, 255, 255, 0.01) 2px, 
        rgba(255, 255, 255, 0.01) 3px
      )
    `;
    grainOverlay.style.opacity = '0.3';
    grainOverlay.setAttribute('aria-hidden', 'true');
    section.appendChild(grainOverlay);

    // Add mouse movement for parallax effect
    const handleMouseMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Apply subtle parallax to canvas
      const offsetX = (x - 0.5) * 20;
      const offsetY = (y - 0.5) * 20;
      canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };

    section.addEventListener('mousemove', handleMouseMove);

    // Cleanup function for proper lifecycle management
    const cleanup = () => {
      section.removeEventListener('mousemove', handleMouseMove);
      visualChaos.dispose();
    };

    // Store cleanup function on section for later access
    (section as HTMLElement & { __cleanup?: () => void }).__cleanup = cleanup;
  }

  // Content wrapper
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
  heading.style.opacity = '0'; // Start hidden for transition
  heading.style.transform = 'translateY(30px)'; // Start offset for smooth reveal

  // Create the secondary heading
  const secondary = document.createElement('p');
  secondary.classList.add('secondary-heading');
  secondary.textContent =
    'It’s the gap between your ideas and your implementation.';
  secondary.style.color = '#C6CBD4'; // Cool Grey
  secondary.style.fontSize = '1.5rem';
  secondary.style.margin = '0 0 2rem 0';
  secondary.style.textAlign = 'center';
  secondary.style.opacity = '0'; // Start hidden for transition
  secondary.style.transform = 'translateY(30px)'; // Start offset for smooth reveal

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
  copy.style.opacity = '0'; // Start hidden for transition
  copy.style.transform = 'translateY(30px)'; // Start offset for smooth reveal

  // Assemble content
  contentWrapper.append(heading, secondary, copy);
  section.appendChild(contentWrapper);

  container.appendChild(section);
}
