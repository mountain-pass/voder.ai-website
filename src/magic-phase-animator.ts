/**
 * MagicPhaseAnimator - Cinematic animations for Act 1 (Magic Phase)
 * Story 026.03-BIZ-MAGIC-PHASE-ANIMATION
 *
 * Implements gentle floating motion, warm glows, and elegant scaling effects
 * that capture the initial wonder and excitement of AI-assisted development.
 */

import type { ScrollLockedReveal } from './scroll-locked-reveal.js';

export class MagicPhaseAnimator {
  private progressiveReveal: ScrollLockedReveal;
  private animationFrameId: number | null = null;
  private ticking: boolean = false;
  private isAnimating: boolean = false;

  constructor(progressiveReveal: ScrollLockedReveal) {
    this.progressiveReveal = progressiveReveal;
    this.bindScrollListener();
    this.startContinuousAnimation();
  }

  /**
   * Start continuous animation loop for floating effects
   */
  private startContinuousAnimation(): void {
    const animate = () => {
      this.updateMagicAnimations();
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.isAnimating = true;
    animate();
  }

  /**
   * Bind to scroll events to trigger magic phase animations
   */
  private bindScrollListener(): void {
    const onScroll = () => {
      if (!this.ticking) {
        this.ticking = true;
        // Scroll will be handled by continuous animation loop
        requestAnimationFrame(() => {
          this.ticking = false;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /**
   * Update magic phase animations based on current scroll progress
   * Only animates during Act 1 (0-75% scroll range to cover all segments)
   */
  private updateMagicAnimations(): void {
    const scrollProgress = this.progressiveReveal.getCurrentProgress();

    // Only animate during Magic Phase (0-75% of total scroll to cover all Act 1 segments)
    if (scrollProgress >= 0 && scrollProgress <= 0.75) {
      this.animateSegment1(scrollProgress);
      this.animateSegment2(scrollProgress);
    }
  }

  /**
   * Animate Segment 1: "Remember when AI coding felt like magic?"
   * Features: floating motion, magic word glow, elegant scaling
   * Takes full control of opacity and transforms for Act 1 magic phase
   */
  private animateSegment1(scrollProgress: number): void {
    const segments = document.querySelectorAll<HTMLElement>('[data-segment="1"]');

    if (!segments.length) return;

    // Camera bobbing motion (boat on water) - continuous, applies to all
    const cameraBobbingY = Math.sin(Date.now() * 0.0008) * 8;

    // Animate each element individually based on its reveal range
    segments.forEach((segment) => {
      const revealStart = parseFloat(segment.getAttribute('data-reveal-start') || '0');

      const revealEnd = parseFloat(segment.getAttribute('data-reveal-end') || '0.12');

      // Calculate this element's individual progress
      const elementProgress = this.mapToSegmentProgress(scrollProgress, revealStart, revealEnd);

      // Slow, dreamy fade-in from fog - very gradual emergence
      const fadeProgress = Math.min(1, elementProgress * 1.5);

      const opacity = Math.pow(fadeProgress, 2); // Very slow fade from fog

      // Very subtle scale for depth/fog effect (0.98 to 1.0)
      const scale = 0.98 + this.easeOutQuart(fadeProgress) * 0.02;

      // Apply transforms with individual opacity but shared camera bobbing
      segment.style.opacity = opacity.toString();
      segment.style.transform = `translateY(${cameraBobbingY}px) scale(${scale})`;
    });

    // Magic word simple glow - appears when its parent headline is visible
    const magicWords = document.querySelectorAll<HTMLElement>('.magic-word');

    magicWords.forEach((magicWord) => {
      const parent = magicWord.closest<HTMLElement>('[data-reveal-start]');

      if (parent) {
        const revealStart = parseFloat(parent.getAttribute('data-reveal-start') || '0');

        const revealEnd = parseFloat(parent.getAttribute('data-reveal-end') || '0.12');

        const elementProgress = this.mapToSegmentProgress(scrollProgress, revealStart, revealEnd);

        if (elementProgress > 0.3) {
          // Simple warm glow
          magicWord.style.textShadow = `
            0 0 20px rgba(34, 199, 190, 0.8),
            0 0 40px rgba(34, 199, 190, 0.4)
          `;
        } else {
          magicWord.style.textShadow = 'none';
        }
      }
    });
  }

  /**
   * Animate Segment 2: "When shipping features was fast and exciting?"
   * Features: slide-in from left, speed word energy pulse
   * Takes full control of opacity and transforms for Act 1 magic phase
   */
  private animateSegment2(scrollProgress: number): void {
    const segments = document.querySelectorAll<HTMLElement>('[data-segment="2"]');

    if (!segments.length) return;

    // Animate each element individually based on its reveal range (like Segment 1)
    segments.forEach((segment) => {
      const revealStart = parseFloat(segment.getAttribute('data-reveal-start') || '0.25');

      const revealEnd = parseFloat(segment.getAttribute('data-reveal-end') || '0.45');

      // Calculate this element's individual progress
      const segmentProgress = this.mapToSegmentProgress(scrollProgress, revealStart, revealEnd);

      // Fade in very quickly - almost immediately visible
      const opacity = Math.min(1, segmentProgress * 10); // Reaches full opacity at 10% progress

      // Slide in from left with stronger momentum and a subtle rotation to convey speed
      const slideX = -400 * (1 - this.easeOutBack(segmentProgress)); // Start even further off-screen for more drama

      const rotation = (1 - this.easeOutQuart(segmentProgress)) * -3; // Increased rotation from -2 to -3 degrees

      const scale = 0.92 + this.easeOutQuart(segmentProgress) * 0.16; // up to ~1.08 for more punch

      // Apply to this segment element
      segment.style.opacity = opacity.toString();
      segment.style.transform = `translateX(${slideX}px) rotate(${rotation}deg) scale(${scale})`;
      segment.style.willChange = 'transform, opacity';
    });

    // Speed word energy effect - scroll-driven color and glow (no transform, parent handles scale)
    const speedWords = document.querySelectorAll<HTMLElement>('.speed-word');

    speedWords.forEach((word) => {
      const parent = word.closest<HTMLElement>('[data-reveal-start]');

      if (parent) {
        const revealStart = parseFloat(parent.getAttribute('data-reveal-start') || '0.25');

        const revealEnd = parseFloat(parent.getAttribute('data-reveal-end') || '0.45');

        const elementProgress = this.mapToSegmentProgress(scrollProgress, revealStart, revealEnd);

        // Use brand teal color that intensifies as animation progresses
        const tealIntensity = elementProgress; // 0 -> 1

        const r = Math.round(34 * (1 - tealIntensity) + 34 * tealIntensity); // stays ~34

        const g = Math.round(199 * (1 - tealIntensity) + 199 * tealIntensity); // stays ~199

        const b = Math.round(190 * (1 - tealIntensity) + 190 * tealIntensity); // stays ~190
        // Brand teal is #22c7be = rgb(34, 199, 190)

        const glowBase = 6 + elementProgress * 18; // 6 -> 24px

        const glowAlpha = 0.45 + elementProgress * 0.35; // 0.45 -> 0.8

        if (elementProgress > 0.05) {
          word.style.color = `rgb(${r}, ${g}, ${b})`;
          word.style.textShadow = `0 0 ${glowBase}px rgba(${r}, ${g}, ${b}, ${glowAlpha})`;
          word.style.willChange = 'color, text-shadow';
        } else {
          word.style.color = '';
          word.style.textShadow = 'none';
        }
      }
    });
  }

  /**
   * Map scroll progress to segment-specific progress (0-1 range)
   */
  private mapToSegmentProgress(scrollProgress: number, start: number, end: number): number {
    return Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
  }

  /**
   * Ease out quartic - smooth deceleration
   */
  private easeOutQuart(t: number): number {
    return 1 - Math.pow(1 - t, 4);
  }

  /**
   * Ease out back - slight overshoot for momentum feel
   */
  private easeOutBack(t: number): number {
    const c1 = 1.70158;

    const c3 = c1 + 1;

    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  /**
   * Clean up animation frame if needed
   */
  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
