/**
 * Comprehensive Animation System - Type Definitions
 * Part of ADR-0037: Comprehensive Animation System
 *
 * This module defines the core types and interfaces for the animation system.
 */

/**
 * Animation state lifecycle
 */
export enum AnimationState {
  /** Animation has not been triggered yet */
  Idle = 'idle',

  /** Animation has been triggered but not yet started */
  Triggered = 'triggered',

  /** Animation is currently running */
  Active = 'active',

  /** Animation has finished */
  Completed = 'completed',

  /** Animation has been reset to idle state */
  Reset = 'reset',
}

/**
 * Animation types supported by the system
 */
export enum AnimationType {
  /** Animation that updates continuously based on scroll position */
  ScrollScrubbed = 'scroll-scrubbed',

  /** Animation that triggers once when scroll reaches a threshold */
  ScrollTriggered = 'scroll-triggered',

  /** Animation that runs based on elapsed time */
  TimeBased = 'time-based',
}

/**
 * Scroll direction
 */
export enum ScrollDirection {
  Forward = 'forward',
  Backward = 'backward',
}

/**
 * Animation configuration options
 */
export interface AnimationConfig {
  /** Unique identifier for the animation */
  id: string;

  /** Type of animation */
  type: AnimationType;

  /** IDs of animations this one depends on */
  dependencies?: string[];

  /** Scroll range for scroll-based animations (0-1) */
  scrollRange?: {
    start: number;
    end: number;
  };

  /** Duration in milliseconds for time-based animations */
  duration?: number;

  /** Whether animation can run in reverse */
  bidirectional?: boolean;
}

/**
 * Animation state change event
 */
export interface AnimationStateEvent {
  animationId: string;
  previousState: AnimationState;
  currentState: AnimationState;
  timestamp: number;
}

/**
 * Animation progress information
 */
export interface AnimationProgress {
  /** Current progress (0-1) */
  value: number;

  /** Scroll direction if applicable */
  direction?: ScrollDirection;

  /** Elapsed time in milliseconds for time-based animations */
  elapsedTime?: number;
}

/**
 * Base interface for all animations
 */
export interface IAnimation {
  /** Unique identifier */
  readonly id: string;

  /** Animation type */
  readonly type: AnimationType;

  /** Current state */
  readonly state: AnimationState;

  /** Animation dependencies */
  readonly dependencies: string[];

  /** Whether animation can run in reverse */
  readonly bidirectional: boolean;

  /**
   * Initialize the animation
   * Called once when animation is registered with coordinator
   */
  init(): void;

  /**
   * Update animation based on current progress
   * @param progress Animation progress information
   */
  update(progress: AnimationProgress): void;

  /**
   * Trigger the animation
   * For scroll-triggered and time-based animations
   */
  trigger(): void;

  /**
   * Reset animation to idle state
   */
  reset(): void;

  /**
   * Clean up resources
   */
  destroy(): void;

  /**
   * Check if animation has completed
   */
  isCompleted(): boolean;

  /**
   * Check if all dependencies are satisfied
   * @param completedAnimations Set of completed animation IDs
   */
  dependenciesSatisfied(completedAnimations: Set<string>): boolean;
}

/**
 * Animation coordinator interface
 */
export interface IAnimationCoordinator {
  /**
   * Register an animation with the coordinator
   * @param animation Animation to register
   */
  register(animation: IAnimation): void;

  /**
   * Unregister an animation
   * @param animationId ID of animation to unregister
   */
  unregister(animationId: string): void;

  /**
   * Get animation by ID
   * @param animationId Animation ID
   */
  getAnimation(animationId: string): IAnimation | undefined;

  /**
   * Get current state of an animation
   * @param animationId Animation ID
   */
  getState(animationId: string): AnimationState | undefined;

  /**
   * Update all animations based on scroll progress
   * @param scrollProgress Global scroll progress (0-1)
   */
  updateScroll(scrollProgress: number): void;

  /**
   * Start coordinator (begins update loop for time-based animations)
   */
  start(): void;

  /**
   * Stop coordinator
   */
  stop(): void;

  /**
   * Clean up all animations and resources
   */
  destroy(): void;
}
