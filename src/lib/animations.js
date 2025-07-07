import { gsap } from 'gsap';

/**
 * Fade-in and slide-up animation for headings, paragraphs,
 * list items and SVG text when a slide becomes active.
 *
 * @param {HTMLElement} current - The currently active slide element.
 */
export function animateSlide(current) {
  const elements = current.querySelectorAll('h1, h2, p, li, svg text');
  gsap.fromTo(
    elements,
    { autoAlpha: 0, y: 20 },
    { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.2 }
  );
}
