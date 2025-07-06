import { animateSlide } from './animations.js';

export async function initScrollAnimations() {
  if (typeof window === 'undefined') return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('main section').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      onEnter: () => animateSlide(section)
    });
  });
}