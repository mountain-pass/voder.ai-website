/**
 * Animation Coordinator - Central Management System
 * Part of ADR-0037: Comprehensive Animation System
 *
 * Manages all animations, handles dependencies, coordinates updates
 */

import type { IAnimation, IAnimationCoordinator } from './types.js';
import { AnimationState, AnimationType, ScrollDirection } from './types.js';

/**
 * Coordinates all animations in the system
 * Handles registration, dependency resolution, and update distribution
 */
export class AnimationCoordinator implements IAnimationCoordinator {
  private animations = new Map<string, IAnimation>();
  private completedAnimations = new Set<string>();
  private previousScrollProgress = 0;
  private animationFrameId: number | null = null;
  private isRunning = false;

  /**
   * Register an animation with the coordinator
   */
  register(animation: IAnimation): void {
    if (this.animations.has(animation.id)) {
      console.warn(`Animation with id "${animation.id}" already registered, replacing`);
    }

    this.animations.set(animation.id, animation);
    animation.init();
  }

  /**
   * Unregister an animation
   */
  unregister(animationId: string): void {
    const animation = this.animations.get(animationId);

    if (animation) {
      animation.destroy();
      this.animations.delete(animationId);
      this.completedAnimations.delete(animationId);
    }
  }

  /**
   * Get animation by ID
   */
  getAnimation(animationId: string): IAnimation | undefined {
    return this.animations.get(animationId);
  }

  /**
   * Get current state of an animation
   */
  getState(animationId: string): AnimationState | undefined {
    return this.animations.get(animationId)?.state;
  }

  /**
   * Update all animations based on scroll progress
   */
  updateScroll(scrollProgress: number): void {
    // Determine scroll direction
    const direction =
      scrollProgress > this.previousScrollProgress
        ? ScrollDirection.Forward
        : ScrollDirection.Backward;

    // Track newly completed animations in this update cycle
    const newlyCompleted: string[] = [];

    // Update scroll-based animations
    for (const animation of this.animations.values()) {
      if (
        animation.type === AnimationType.ScrollScrubbed ||
        animation.type === AnimationType.ScrollTriggered
      ) {
        // Check if dependencies are satisfied before updating
        if (animation.dependenciesSatisfied(this.completedAnimations)) {
          animation.update({
            value: scrollProgress,
            direction,
          });

          // Track completion status (but don't add to set yet)
          if (animation.isCompleted() && !this.completedAnimations.has(animation.id)) {
            newlyCompleted.push(animation.id);
          }
        }
      }
    }

    // Add newly completed animations after all updates are done
    newlyCompleted.forEach((id) => this.completedAnimations.add(id));

    this.previousScrollProgress = scrollProgress;
  }

  /**
   * Start coordinator (begins update loop for time-based animations)
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.animate();
  }

  /**
   * Stop coordinator
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Animation loop for time-based animations
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();

    const newlyCompleted: string[] = [];

    // Update time-based animations
    for (const animation of this.animations.values()) {
      if (animation.type === AnimationType.TimeBased) {
        if (animation.dependenciesSatisfied(this.completedAnimations)) {
          animation.update({
            value: 0, // Progress calculated internally by time-based animations
            elapsedTime: currentTime,
          });

          // Track completion status (but don't add to set yet)
          if (animation.isCompleted() && !this.completedAnimations.has(animation.id)) {
            newlyCompleted.push(animation.id);
          }
        }
      }
    }

    // Add newly completed animations after all updates are done
    newlyCompleted.forEach((id) => this.completedAnimations.add(id));

    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  /**
   * Clean up all animations and resources
   */
  destroy(): void {
    this.stop();

    for (const animation of this.animations.values()) {
      animation.destroy();
    }

    this.animations.clear();
    this.completedAnimations.clear();
  }

  /**
   * Reset all animations to idle state
   */
  reset(): void {
    for (const animation of this.animations.values()) {
      animation.reset();
    }
    this.completedAnimations.clear();
    this.previousScrollProgress = 0;
  }

  /**
   * Get all registered animation IDs
   */
  getAnimationIds(): string[] {
    return Array.from(this.animations.keys());
  }

  /**
   * Get animations by type
   */
  getAnimationsByType(type: AnimationType): IAnimation[] {
    return Array.from(this.animations.values()).filter((anim) => anim.type === type);
  }

  /**
   * Check if an animation's dependencies are all completed
   */
  areDependenciesSatisfied(animationId: string): boolean {
    const animation = this.animations.get(animationId);

    return animation ? animation.dependenciesSatisfied(this.completedAnimations) : false;
  }
}
