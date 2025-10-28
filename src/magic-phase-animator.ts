/**
 * MagicPhaseAnimator - Cinematic animations for Act 1 (Magic Phase)
 * Story 026.03-BIZ-MAGIC-PHASE-ANIMATION
 *
 * Implements gentle floating motion, warm glows, and elegant scaling effects
 * that capture the initial wonder and excitement of AI-assisted development.
 */

import type { ScrollLockedReveal } from './scroll-locked-reveal.js';
import type { SparklerAnimator } from './sparkler-animator.js';

export class MagicPhaseAnimator {
  private progressiveReveal: ScrollLockedReveal;
  private sparklerAnimator: SparklerAnimator | null = null;
  private animationFrameId: number | null = null;
  private ticking: boolean = false;
  private isAnimating: boolean = false;
  private bobbingTimeOffsets: Map<HTMLElement, number> = new Map(); // Track time offset for each element

  // Segment 2 scroll-triggered animation state
  private segment2Triggered: boolean = false;
  private segment2StartTime: number = 0;
  private segment2Duration: number = 800; // 800ms animation duration
  private segment2Completed: boolean = false;
  private wasInSegment2Range: boolean = false; // Track if we were in range (for proper triggering)

  constructor(progressiveReveal: ScrollLockedReveal, sparklerAnimator?: SparklerAnimator) {
    this.progressiveReveal = progressiveReveal;
    this.sparklerAnimator = sparklerAnimator || null;
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

    // Animate each element individually based on its reveal range
    segments.forEach((segment, index) => {
      const revealStart = parseFloat(segment.getAttribute('data-reveal-start') || '0');

      const revealEnd = parseFloat(segment.getAttribute('data-reveal-end') || '0.12');

      // Calculate this element's individual progress
      const elementProgress = this.mapToSegmentProgress(scrollProgress, revealStart, revealEnd);

      // Slow, dreamy fade-in from fog - very gradual emergence
      const fadeProgress = Math.min(1, elementProgress * 1.5);

      const opacity = Math.pow(fadeProgress, 2); // Very slow fade from fog

      // Very subtle scale for depth/fog effect (0.98 to 1.0)
      const scale = 0.98 + this.easeOutQuart(fadeProgress) * 0.02;

      // Individual bobbing motion for each element (different boats in water)
      // Use index to offset phase, and different frequencies for variety
      const phaseOffset = index * Math.PI * 0.7; // Different starting phases

      const frequency = 0.0008 + index * 0.0002; // Slightly different speeds

      const baseAmplitude = index === 0 ? 4 : 8; // Lower amplitude for first element (REMEMBER WHEN)

      // Gradually fade amplitude in/out based on visibility to avoid jumps
      // Fade in during first 50% of reveal, fade out in last 50%
      let amplitudeFade = 1;

      if (elementProgress < 0.5) {
        // Fade in from 0 to 1 during first half
        amplitudeFade = Math.min(1, Math.max(0, elementProgress * 2));
      } else if (elementProgress > 0.75) {
        // Fade out from 1 to 0 during last quarter
        amplitudeFade = Math.min(1, Math.max(0, (1 - elementProgress) * 4));
      }
      const amplitude = baseAmplitude * amplitudeFade;

      // Initialize time offset on first encounter
      if (!this.bobbingTimeOffsets.has(segment)) {
        this.bobbingTimeOffsets.set(segment, Date.now());
      }

      const timeOffset = this.bobbingTimeOffsets.get(segment)!;

      // Calculate bobbing with faded amplitude
      const bobbingY = Math.sin((Date.now() - timeOffset) * frequency + phaseOffset) * amplitude;

      // Add horizontal bobbing with different phase and lower amplitude (30% of vertical)
      const horizontalPhase = phaseOffset + Math.PI / 3; // Offset by 60 degrees

      const horizontalFrequency = frequency * 0.8; // Slightly slower

      const bobbingX =
        Math.sin((Date.now() - timeOffset) * horizontalFrequency + horizontalPhase) *
        amplitude *
        0.3;

      // Apply transforms with individual opacity and bobbing
      segment.style.opacity = opacity.toString();
      segment.style.transform = `translate(${bobbingX}px, ${bobbingY}px) scale(${scale})`;
    });

    // Magic word simple glow - appears when its parent headline is visible
    const magicWords = document.querySelectorAll<HTMLElement>('.magic-word');

    magicWords.forEach((magicWord) => {
      const parent = magicWord.closest<HTMLElement>('[data-reveal-start]');

      if (parent) {
        // Glow disabled - sparkler effect handles the magic emphasis
        magicWord.style.textShadow = 'none';
      }
    });
  }

  /**
   * Animate Segment 2: "When shipping features was fast and exciting?"
   * Features: scroll-triggered slide-in from left with momentum snap
   * Once triggered, animation plays through to completion regardless of scroll
   * Waits for sparkler animation to complete before triggering
   */
  private animateSegment2(scrollProgress: number): void {
    const segments = document.querySelectorAll<HTMLElement>('[data-segment="2"]');

    if (!segments.length) return;

    // Check if sparkler animation has completed (if sparkler animator is available)
    const sparklerCompleted = !this.sparklerAnimator || this.sparklerAnimator.isSweepCompleted();

    // Trigger when segment 2 first comes into view (after magic animation finishes at 0.25)
    // AND after sparkler sweep completes
    const triggerPoint = 0.45; // Segment 2 reveal start

    const inRange = scrollProgress >= triggerPoint && scrollProgress <= 0.75;

    // Track if we were previously outside range (to detect entering range)
    const justEnteredRange = inRange && !this.wasInSegment2Range;

    this.wasInSegment2Range = inRange;

    // Debug logging
    if (justEnteredRange) {
      // Debug logging (disabled for linting)
      // console.log('Segment 2 entered range. Sparkler completed:', sparklerCompleted, 'Progress:', scrollProgress);
    }

    // Trigger animation ONLY when:
    // 1. We just entered the range (scrolling down into it)
    // 2. AND sparkler has completed
    // 3. AND we haven't triggered yet
    if (
      justEnteredRange &&
      sparklerCompleted &&
      !this.segment2Triggered &&
      !this.segment2Completed
    ) {
      // Debug logging (disabled for linting)
      // console.log('Segment 2 TRIGGERED at progress:', scrollProgress);
      this.segment2Triggered = true;
      this.segment2StartTime = Date.now();
    }

    // Reset if scrolled completely out of visibility (allows retrigger)
    // Only reset if animation is completed AND we're outside the range
    if (this.segment2Completed && (scrollProgress < triggerPoint - 0.1 || scrollProgress > 0.75)) {
      // Check if all segments have faded out
      const allFadedOut = Array.from(segments).every((seg) => {
        const opacity = parseFloat(seg.style.opacity || '0');

        return opacity === 0;
      });

      if (allFadedOut) {
        this.segment2Triggered = false;
        this.segment2Completed = false;
        this.wasInSegment2Range = false; // Reset range tracking
      }
    }

    // Calculate time-based animation progress
    let animationProgress = 0;

    if (this.segment2Triggered) {
      const elapsed = Date.now() - this.segment2StartTime;

      animationProgress = Math.min(1, elapsed / this.segment2Duration);

      if (animationProgress >= 1) {
        this.segment2Completed = true;
      }
    }

    // Animate each element individually based on its reveal range
    segments.forEach((segment) => {
      const revealStart = parseFloat(segment.getAttribute('data-reveal-start') || '0.45');

      const revealEnd = parseFloat(segment.getAttribute('data-reveal-end') || '0.65');

      // Calculate scroll-based progress for fade out when scrolled past
      const scrollBasedProgress = this.mapToSegmentProgress(scrollProgress, revealStart, revealEnd);

      // Both opacity AND transforms are driven by animation progress
      // Keep hidden until animation is triggered
      let opacity = 0;

      let segmentProgress = 0;

      if (this.segment2Triggered) {
        segmentProgress = animationProgress;
        // Fade in quickly once animation starts
        opacity = Math.min(1, animationProgress * 10); // Reaches full opacity at 10% of animation
      } else if (scrollBasedProgress > 0) {
        // Before animation triggers, show element at start position with scroll-based opacity
        // This allows fade-in while waiting for sparkler to complete
        opacity = Math.min(1, scrollBasedProgress * 10);
        segmentProgress = 0; // Keep at start position
      }

      // If scrolled past the end, fade out
      if (this.segment2Completed && scrollBasedProgress < 1) {
        opacity = scrollBasedProgress;
      }

      // Slide in from left with stronger momentum and a snap at the end
      let slideX: number;

      if (segmentProgress < 0.85) {
        // During overshoot phase - use easeOutBack
        const adjustedProgress = segmentProgress / 0.85; // Compress to 0-1 range

        slideX = -400 * (1 - this.easeOutBack(adjustedProgress));
      } else {
        // Final snap back - very fast correction using easeOutQuint (sharper than Quart)
        const snapProgress = (segmentProgress - 0.85) / 0.15; // 0-1 over last 15%

        const overshoot = -400 * (1 - this.easeOutBack(1)); // Calculate final overshoot position

        slideX = overshoot * (1 - Math.pow(snapProgress, 5)); // Snap back with quint easing
      }

      const rotation = (1 - this.easeOutQuart(segmentProgress)) * -3; // Increased rotation from -2 to -3 degrees

      const scale = 0.92 + this.easeOutQuart(segmentProgress) * 0.16; // up to ~1.08 for more punch

      // Apply to this segment element
      segment.style.opacity = opacity.toString();
      segment.style.transform = `translateX(${slideX}px) rotate(${rotation}deg) scale(${scale})`;
      segment.style.willChange = 'transform, opacity';
    });

    // Speed word energy effect - uses time-based animation progress
    const speedWords = document.querySelectorAll<HTMLElement>('.speed-word');

    speedWords.forEach((word) => {
      const parent = word.closest<HTMLElement>('[data-reveal-start]');

      if (parent) {
        const revealStart = parseFloat(parent.getAttribute('data-reveal-start') || '0.45');

        const revealEnd = parseFloat(parent.getAttribute('data-reveal-end') || '0.65');

        const scrollBasedProgress = this.mapToSegmentProgress(
          scrollProgress,
          revealStart,
          revealEnd,
        );

        // Use time-based progress for effects if triggered
        const elementProgress = this.segment2Triggered ? animationProgress : scrollBasedProgress;

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
