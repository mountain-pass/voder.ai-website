import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateSlide } from './animations.js';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  document.querySelectorAll('main section').forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      onEnter: () => animateSlide(section)
    });
  });
}