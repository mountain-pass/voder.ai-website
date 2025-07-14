// src/lib/utils.ts

/**
 * Returns true if the user has requested reduced motion.
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
