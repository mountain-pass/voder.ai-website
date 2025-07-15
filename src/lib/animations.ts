import { prefersReducedMotion } from './utils';

/**
 * Initializes scroll-driven animations.
 * Simplified version without Three.js to resolve initialization conflicts.
 */
export async function initScrollAnimations(): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('▶️ initScrollAnimations fired');
  
  // Set banner as loaded immediately (no 3D model for now)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__bannerModelLoaded = true;

  if (prefersReducedMotion()) {
    // eslint-disable-next-line no-console
    console.log('Reduced motion detected, skipping complex animations.');
    return;
  }

  try {
    // Import only GSAP for now
    const [
      gsapModuleImport,
      { ScrollTrigger }
    ] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger')
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gsap = (gsapModuleImport as any).default ?? (gsapModuleImport as any).gsap;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Expose GSAP globally for other components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gsap = gsap;

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error loading GSAP:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).gsap = {};
  }
}
