/**
 * Tests for AnimationCoordinator
 * Part of ADR-0037: Comprehensive Animation System
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AnimationCoordinator } from '../../src/animations/coordinator.js';
import type { AnimationProgress, IAnimation } from '../../src/animations/types.js';
import { AnimationState, AnimationType } from '../../src/animations/types.js';

// Mock animation for testing
class MockAnimation implements IAnimation {
  readonly id: string;
  readonly type: AnimationType;
  readonly dependencies: string[];
  readonly bidirectional: boolean;
  state: AnimationState = AnimationState.Idle;

  private _isCompleted = false;

  constructor(
    id: string,
    type: AnimationType = AnimationType.ScrollScrubbed,
    dependencies: string[] = [],
  ) {
    this.id = id;
    this.type = type;
    this.dependencies = dependencies;
    this.bidirectional = true;
  }

  init = vi.fn();
  update = vi.fn((progress: AnimationProgress) => {
    if (this.state === AnimationState.Idle) {
      this.state = AnimationState.Active;
    }
    // Auto-complete at 100% progress
    if (progress.value >= 1) {
      this.state = AnimationState.Completed;
      this._isCompleted = true;
    }
  });
  trigger = vi.fn(() => {
    this.state = AnimationState.Triggered;
  });
  reset = vi.fn(() => {
    this.state = AnimationState.Idle;
    this._isCompleted = false;
  });
  destroy = vi.fn();

  isCompleted(): boolean {
    return this._isCompleted;
  }

  dependenciesSatisfied(completedAnimations: Set<string>): boolean {
    return this.dependencies.every((depId) => completedAnimations.has(depId));
  }
}

describe('AnimationCoordinator', () => {
  let coordinator: AnimationCoordinator;

  beforeEach(() => {
    coordinator = new AnimationCoordinator();
  });

  afterEach(() => {
    coordinator.destroy();
  });

  describe('Registration', () => {
    it('should register an animation', () => {
      const animation = new MockAnimation('test-1');

      coordinator.register(animation);

      expect(animation.init).toHaveBeenCalledOnce();
      expect(coordinator.getAnimation('test-1')).toBe(animation);
    });

    it('should warn when registering duplicate ID', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const animation1 = new MockAnimation('test-1');

      const animation2 = new MockAnimation('test-1');

      coordinator.register(animation1);
      coordinator.register(animation2);

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('already registered'));
      expect(coordinator.getAnimation('test-1')).toBe(animation2);

      consoleSpy.mockRestore();
    });

    it('should unregister an animation', () => {
      const animation = new MockAnimation('test-1');

      coordinator.register(animation);
      coordinator.unregister('test-1');

      expect(animation.destroy).toHaveBeenCalledOnce();
      expect(coordinator.getAnimation('test-1')).toBeUndefined();
    });
  });

  describe('State Tracking', () => {
    it('should track animation state', () => {
      const animation = new MockAnimation('test-1');

      animation.state = AnimationState.Active;

      coordinator.register(animation);

      expect(coordinator.getState('test-1')).toBe(AnimationState.Active);
    });

    it('should return undefined for unknown animation', () => {
      expect(coordinator.getState('unknown')).toBeUndefined();
    });
  });

  describe('Scroll Updates', () => {
    it('should update scroll-scrubbed animations', () => {
      const animation = new MockAnimation('test-1', AnimationType.ScrollScrubbed);

      coordinator.register(animation);
      coordinator.updateScroll(0.5);

      expect(animation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 0.5,
          direction: expect.any(String),
        }),
      );
    });

    it('should update scroll-triggered animations', () => {
      const animation = new MockAnimation('test-1', AnimationType.ScrollTriggered);

      coordinator.register(animation);
      coordinator.updateScroll(0.5);

      expect(animation.update).toHaveBeenCalled();
    });

    it('should not update time-based animations during scroll', () => {
      const animation = new MockAnimation('test-1', AnimationType.TimeBased);

      coordinator.register(animation);
      coordinator.updateScroll(0.5);

      expect(animation.update).not.toHaveBeenCalled();
    });

    it('should detect forward scroll direction', () => {
      const animation = new MockAnimation('test-1', AnimationType.ScrollScrubbed);

      coordinator.register(animation);
      coordinator.updateScroll(0.3);
      coordinator.updateScroll(0.5);

      expect(animation.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          direction: 'forward',
        }),
      );
    });

    it('should detect backward scroll direction', () => {
      const animation = new MockAnimation('test-1', AnimationType.ScrollScrubbed);

      coordinator.register(animation);
      coordinator.updateScroll(0.5);
      coordinator.updateScroll(0.3);

      expect(animation.update).toHaveBeenLastCalledWith(
        expect.objectContaining({
          direction: 'backward',
        }),
      );
    });
  });

  describe('Dependency Resolution', () => {
    it('should not update animation with unsatisfied dependencies', () => {
      const animation1 = new MockAnimation('anim-1');

      const animation2 = new MockAnimation('anim-2', AnimationType.ScrollScrubbed, ['anim-1']);

      coordinator.register(animation1);
      coordinator.register(animation2);
      coordinator.updateScroll(0.5);

      // anim-2 should not update because anim-1 is not completed
      expect(animation2.update).not.toHaveBeenCalled();
    });

    it('should update animation when dependencies are satisfied', () => {
      const animation1 = new MockAnimation('anim-1');

      const animation2 = new MockAnimation('anim-2', AnimationType.ScrollScrubbed, ['anim-1']);

      coordinator.register(animation1);
      coordinator.register(animation2);

      // Complete animation1
      coordinator.updateScroll(1.0);
      expect(animation1.isCompleted()).toBe(true);

      // Now animation2 should update
      coordinator.updateScroll(0.5);
      expect(animation2.update).toHaveBeenCalled();
    });

    it('should handle multiple dependencies', () => {
      const animation1 = new MockAnimation('anim-1');

      const animation2 = new MockAnimation('anim-2');

      const animation3 = new MockAnimation('anim-3', AnimationType.ScrollScrubbed, [
        'anim-1',
        'anim-2',
      ]);

      coordinator.register(animation1);
      coordinator.register(animation2);
      coordinator.register(animation3);

      // Complete animation1 but not animation2
      // We'll manually complete anim-1 and ensure anim-2 doesn't complete
      coordinator.updateScroll(0.5);
      animation1.state = AnimationState.Completed;
      animation1['_isCompleted'] = true;

      // Manually track anim-1 as completed
      coordinator['completedAnimations'].add('anim-1');

      // Update again - animation3 should not update yet (anim-2 not complete)
      coordinator.updateScroll(0.6);
      expect(animation3.update).not.toHaveBeenCalled();

      // Now complete animation2
      animation2.state = AnimationState.Completed;
      animation2['_isCompleted'] = true;
      coordinator['completedAnimations'].add('anim-2');

      // Now animation3 should update
      animation3.update.mockClear(); // Clear previous calls
      coordinator.updateScroll(0.7);
      expect(animation3.update).toHaveBeenCalled();
    });
  });

  describe('Time-Based Animations', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should update time-based animations when started', () => {
      const animation = new MockAnimation('test-1', AnimationType.TimeBased);

      coordinator.register(animation);
      coordinator.start();

      vi.advanceTimersByTime(100);

      expect(animation.update).toHaveBeenCalled();
    });

    it('should not update time-based animations when stopped', () => {
      const animation = new MockAnimation('test-1', AnimationType.TimeBased);

      coordinator.register(animation);
      coordinator.start();
      coordinator.stop();

      animation.update.mockClear();
      vi.advanceTimersByTime(100);

      expect(animation.update).not.toHaveBeenCalled();
    });
  });

  describe('Lifecycle', () => {
    it('should reset all animations', () => {
      const animation1 = new MockAnimation('anim-1');

      const animation2 = new MockAnimation('anim-2');

      coordinator.register(animation1);
      coordinator.register(animation2);

      coordinator.reset();

      expect(animation1.reset).toHaveBeenCalledOnce();
      expect(animation2.reset).toHaveBeenCalledOnce();
    });

    it('should destroy all animations', () => {
      const animation1 = new MockAnimation('anim-1');

      const animation2 = new MockAnimation('anim-2');

      coordinator.register(animation1);
      coordinator.register(animation2);

      coordinator.destroy();

      expect(animation1.destroy).toHaveBeenCalledOnce();
      expect(animation2.destroy).toHaveBeenCalledOnce();
      expect(coordinator.getAnimationIds()).toHaveLength(0);
    });
  });

  describe('Query Methods', () => {
    it('should get all animation IDs', () => {
      coordinator.register(new MockAnimation('anim-1'));
      coordinator.register(new MockAnimation('anim-2'));
      coordinator.register(new MockAnimation('anim-3'));

      const ids = coordinator.getAnimationIds();

      expect(ids).toHaveLength(3);
      expect(ids).toContain('anim-1');
      expect(ids).toContain('anim-2');
      expect(ids).toContain('anim-3');
    });

    it('should get animations by type', () => {
      coordinator.register(new MockAnimation('anim-1', AnimationType.ScrollScrubbed));
      coordinator.register(new MockAnimation('anim-2', AnimationType.ScrollTriggered));
      coordinator.register(new MockAnimation('anim-3', AnimationType.ScrollScrubbed));

      const scrollScrubbed = coordinator.getAnimationsByType(AnimationType.ScrollScrubbed);

      expect(scrollScrubbed).toHaveLength(2);
      expect(scrollScrubbed.map((a) => a.id)).toContain('anim-1');
      expect(scrollScrubbed.map((a) => a.id)).toContain('anim-3');
    });

    it('should check dependency satisfaction', () => {
      const animation1 = new MockAnimation('anim-1');

      const animation2 = new MockAnimation('anim-2', AnimationType.ScrollScrubbed, ['anim-1']);

      coordinator.register(animation1);
      coordinator.register(animation2);

      expect(coordinator.areDependenciesSatisfied('anim-2')).toBe(false);

      // Complete animation1
      coordinator.updateScroll(1.0);

      expect(coordinator.areDependenciesSatisfied('anim-2')).toBe(true);
    });
  });
});
