/**
 * Tests for BaseAnimation
 * Part of ADR-0037: Comprehensive Animation System
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BaseAnimation } from '../../src/animations/base-animation.js';
import type { AnimationConfig, AnimationProgress } from '../../src/animations/types.js';
import { AnimationState, AnimationType } from '../../src/animations/types.js';

// Concrete implementation for testing
class TestAnimation extends BaseAnimation {
  updateCalled = false;
  lastProgress: AnimationProgress | null = null;

  update(progress: AnimationProgress): void {
    this.updateCalled = true;
    this.lastProgress = progress;

    // Auto-complete at 100% for testing
    if (progress.value >= 1) {
      this.transitionTo(AnimationState.Completed);
    } else if (this._state === AnimationState.Idle) {
      this.transitionTo(AnimationState.Active);
    }
  }
}

describe('BaseAnimation', () => {
  describe('Construction and Configuration', () => {
    it('should initialize with basic config', () => {
      const config: AnimationConfig = {
        id: 'test-anim',
        type: AnimationType.ScrollScrubbed,
      };

      const animation = new TestAnimation(config);

      expect(animation.id).toBe('test-anim');
      expect(animation.type).toBe(AnimationType.ScrollScrubbed);
      expect(animation.state).toBe(AnimationState.Idle);
      expect(animation.dependencies).toEqual([]);
      expect(animation.bidirectional).toBe(true);
    });

    it('should initialize with full config', () => {
      const config: AnimationConfig = {
        id: 'test-anim',
        type: AnimationType.ScrollTriggered,
        dependencies: ['dep-1', 'dep-2'],
        scrollRange: { start: 0.2, end: 0.8 },
        duration: 1000,
        bidirectional: false,
      };

      const animation = new TestAnimation(config);

      expect(animation.dependencies).toEqual(['dep-1', 'dep-2']);
      expect(animation.bidirectional).toBe(false);
    });
  });

  describe('State Management', () => {
    let animation: TestAnimation;

    beforeEach(() => {
      animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });
    });

    it('should start in idle state', () => {
      expect(animation.state).toBe(AnimationState.Idle);
    });

    it('should initialize to idle state', () => {
      animation['_state'] = AnimationState.Active;
      animation.init();

      expect(animation.state).toBe(AnimationState.Idle);
    });

    it('should trigger animation', () => {
      animation.trigger();

      expect(animation.state).toBe(AnimationState.Triggered);
    });

    it('should not trigger if not idle', () => {
      animation['_state'] = AnimationState.Active;
      animation.trigger();

      expect(animation.state).toBe(AnimationState.Active);
    });

    it('should reset animation', () => {
      animation['_state'] = AnimationState.Completed;
      animation.reset();

      expect(animation.state).toBe(AnimationState.Idle);
    });

    it('should check completion status', () => {
      expect(animation.isCompleted()).toBe(false);

      animation['_state'] = AnimationState.Completed;

      expect(animation.isCompleted()).toBe(true);
    });
  });

  describe('State Transitions', () => {
    let animation: TestAnimation;

    beforeEach(() => {
      animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });
    });

    it('should allow valid transition from Idle to Active', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      animation['transitionTo'](AnimationState.Active);

      expect(animation.state).toBe(AnimationState.Active);
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should allow valid transition from Active to Completed', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      animation['_state'] = AnimationState.Active;
      animation['transitionTo'](AnimationState.Completed);

      expect(animation.state).toBe(AnimationState.Completed);
      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should warn on invalid transition', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      animation['_state'] = AnimationState.Completed;
      animation['transitionTo'](AnimationState.Triggered);

      expect(animation.state).toBe(AnimationState.Completed); // Should not change
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid state transition'));

      consoleSpy.mockRestore();
    });

    it('should allow reset from any state', () => {
      animation['_state'] = AnimationState.Completed;
      animation['transitionTo'](AnimationState.Reset);

      expect(animation.state).toBe(AnimationState.Reset);
    });
  });

  describe('Dependency Checking', () => {
    it('should be satisfied with no dependencies', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });

      const completedSet = new Set<string>();

      expect(animation.dependenciesSatisfied(completedSet)).toBe(true);
    });

    it('should check dependencies are completed', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
        dependencies: ['dep-1', 'dep-2'],
      });

      const completedSet = new Set<string>(['dep-1']);

      expect(animation.dependenciesSatisfied(completedSet)).toBe(false);

      completedSet.add('dep-2');

      expect(animation.dependenciesSatisfied(completedSet)).toBe(true);
    });
  });

  describe('Scroll Progress Calculation', () => {
    it('should return raw progress with no scroll range', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });

      expect(animation['calculateScrollProgress'](0.5)).toBe(0.5);
    });

    it('should map progress to scroll range', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
        scrollRange: { start: 0.2, end: 0.8 },
      });

      // Before range
      expect(animation['calculateScrollProgress'](0.1)).toBe(0);

      // Start of range
      expect(animation['calculateScrollProgress'](0.2)).toBe(0);

      // Middle of range
      expect(animation['calculateScrollProgress'](0.5)).toBeCloseTo(0.5);

      // End of range
      expect(animation['calculateScrollProgress'](0.8)).toBe(1);

      // After range
      expect(animation['calculateScrollProgress'](0.9)).toBe(1);
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should call onTrigger when triggered', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollTriggered,
      });

      const onTriggerSpy = vi.spyOn(animation as any, 'onTrigger');

      animation.trigger();

      expect(onTriggerSpy).toHaveBeenCalledOnce();
    });

    it('should call onReset when reset', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });

      const onResetSpy = vi.spyOn(animation as any, 'onReset');

      animation.reset();

      expect(onResetSpy).toHaveBeenCalledOnce();
    });

    it('should call onStateChange during transition', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });

      const onStateChangeSpy = vi.spyOn(animation as any, 'onStateChange');

      animation['transitionTo'](AnimationState.Active);

      expect(onStateChangeSpy).toHaveBeenCalledWith(AnimationState.Idle, AnimationState.Active);
    });
  });

  describe('Update Method', () => {
    it('should call update method', () => {
      const animation = new TestAnimation({
        id: 'test',
        type: AnimationType.ScrollScrubbed,
      });

      const progress: AnimationProgress = {
        value: 0.5,
        direction: 'forward' as any,
      };

      animation.update(progress);

      expect(animation.updateCalled).toBe(true);
      expect(animation.lastProgress).toEqual(progress);
    });
  });
});
