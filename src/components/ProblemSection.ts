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
    canvas.style.opacity = '1'; // Make fully visible for testing
    canvas.setAttribute('aria-hidden', 'true');
    
    // Set explicit canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    section.appendChild(canvas);

    // Wait for canvas to be in DOM before initializing
    setTimeout(() => {
      // Double-check dimensions
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      
      // Initialize Visual Chaos system
      const visualChaos = new VisualChaos(canvas);
      
      // Store reference for cleanup
      (section as HTMLElement & { __visualChaos?: typeof visualChaos }).__visualChaos = visualChaos;

      // Set up scroll-based animations for visual chaos
      setTimeout(() => {
        // Wait for GSAP to be available
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gsap = (window as any).gsap;
        if (gsap && gsap.ScrollTrigger) {
          // Create scroll-triggered animation for chaos intensity
          gsap.to(canvas, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 1
            }
          });

          // Intensify chaos based on scroll progress through the section
          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              end: 'bottom center',
              scrub: 1, // Smooth scrubbing
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onUpdate: (self: any) => {
                const progress = self.progress;
                
                // Intensify chaos as user scrolls through
                if (progress > 0.2) {
                  visualChaos.intensifyChaos();
                } else {
                  visualChaos.calmChaos();
                }
              }
            }
          });

          // Create particle burst effects on scroll milestones
          gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 50%',
              end: 'bottom 50%',
              scrub: true,
              onEnter: () => visualChaos.intensifyChaos(),
              onLeave: () => visualChaos.calmChaos(),
              onEnterBack: () => visualChaos.intensifyChaos(),
              onLeaveBack: () => visualChaos.calmChaos()
            }
          });
        }
      }, 100);
    }, 100);

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

    // Add mouse movement for parallax effect (simplified)
    const handleMouseMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Apply subtle parallax to grain overlay only
      const offsetX = (x - 0.5) * 10;
      const offsetY = (y - 0.5) * 10;
      grainOverlay.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };

    section.addEventListener('mousemove', handleMouseMove);

    // Cleanup function for proper lifecycle management
    const cleanup = () => {
      section.removeEventListener('mousemove', handleMouseMove);
      const storedVisualChaos = (section as HTMLElement & { __visualChaos?: { dispose: () => void } }).__visualChaos;
      if (storedVisualChaos) {
        storedVisualChaos.dispose();
      }
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
