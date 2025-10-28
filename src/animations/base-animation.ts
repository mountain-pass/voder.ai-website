/**
 * Base Animation Abstract Class
 * Part of ADR-0037: Comprehensive Animation System
 *
 * Provides common functionality for all animation types
 */

import type { AnimationConfig, AnimationProgress, IAnimation } from './types.js';
import { AnimationState, AnimationType } from './types.js';

/**
 * Abstract base class for all animations
 * Implements common lifecycle and state management
 */
export abstract class BaseAnimation implements IAnimation {
  readonly id: string;
  readonly type: AnimationType;
  readonly dependencies: string[];
  readonly bidirectional: boolean;

  protected _state: AnimationState = AnimationState.Idle;
  protected scrollRange?: { start: number; end: number };
  protected duration?: number;

  constructor(config: AnimationConfig) {
    this.id = config.id;
    this.type = config.type;
    this.dependencies = config.dependencies || [];
    this.bidirectional = config.bidirectional ?? true;
    this.scrollRange = config.scrollRange;
    this.duration = config.duration;
  }

  /**
   * Get current animation state
   */
  get state(): AnimationState {
    return this._state;
  }

  /**
   * Initialize the animation
   * Override in subclasses to perform custom initialization
   */
  init(): void {
    this._state = AnimationState.Idle;
  }

  /**
   * Update animation based on current progress
   * Must be implemented by subclasses
   */
  abstract update(progress: AnimationProgress): void;

  /**
   * Trigger the animation
   * For scroll-triggered and time-based animations
   */
  trigger(): void {
    if (this._state === AnimationState.Idle) {
      this._state = AnimationState.Triggered;
      this.onTrigger();
    }
  }

  /**
   * Reset animation to idle state
   */
  reset(): void {
    this._state = AnimationState.Idle;
    this.onReset();
  }

  /**
   * Clean up resources
   * Override in subclasses to perform custom cleanup
   */
  destroy(): void {
    this._state = AnimationState.Idle;
  }

  /**
   * Check if animation has completed
   */
  isCompleted(): boolean {
    return this._state === AnimationState.Completed;
  }

  /**
   * Check if all dependencies are satisfied
   */
  dependenciesSatisfied(completedAnimations: Set<string>): boolean {
    if (this.dependencies.length === 0) {
      return true;
    }

    return this.dependencies.every((depId) => completedAnimations.has(depId));
  }

  /**
   * Transition to a new state
   * Validates state transitions
   */
  protected transitionTo(newState: AnimationState): void {
    if (this.isValidTransition(this._state, newState)) {
      const previousState = this._state;

      this._state = newState;
      this.onStateChange(previousState, newState);
    } else {
      console.warn(
        `Invalid state transition for animation "${this.id}": ${this._state} -> ${newState}`,
      );
    }
  }

  /**
   * Validate state transition
   */
  protected isValidTransition(from: AnimationState, to: AnimationState): boolean {
    // Define valid state transitions
    const validTransitions: Record<AnimationState, AnimationState[]> = {
      [AnimationState.Idle]: [
        AnimationState.Triggered,
        AnimationState.Active,
        AnimationState.Reset,
      ],
      [AnimationState.Triggered]: [
        AnimationState.Active,
        AnimationState.Idle,
        AnimationState.Reset,
      ],
      [AnimationState.Active]: [
        AnimationState.Completed,
        AnimationState.Idle,
        AnimationState.Reset,
      ],
      [AnimationState.Completed]: [
        AnimationState.Idle,
        AnimationState.Reset,
        AnimationState.Active,
      ], // Allow reverse
      [AnimationState.Reset]: [AnimationState.Idle],
    };

    return validTransitions[from]?.includes(to) ?? false;
  }

  /**
   * Calculate progress within scroll range
   * For scroll-based animations
   */
  protected calculateScrollProgress(scrollProgress: number): number {
    if (!this.scrollRange) {
      return scrollProgress;
    }

    const { start, end } = this.scrollRange;

    // Clamp to range
    if (scrollProgress < start) return 0;
    if (scrollProgress > end) return 1;

    // Map to 0-1 within range
    return (scrollProgress - start) / (end - start);
  }

  /**
   * Hook called when animation is triggered
   * Override in subclasses for custom behavior
   */
  protected onTrigger(): void {
    // Override in subclasses
  }

  /**
   * Hook called when animation is reset
   * Override in subclasses for custom behavior
   */
  protected onReset(): void {
    // Override in subclasses
  }

  /**
   * Hook called when state changes
   * Override in subclasses for custom behavior
   */
  protected onStateChange(_previousState: AnimationState, _currentState: AnimationState): void {
    // Override in subclasses
    // Can be used for logging, analytics, etc.
  }
}
