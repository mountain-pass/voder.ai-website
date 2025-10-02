import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ThreeAnimation } from '../src/three-animation.js';

describe('ThreeAnimation - Final Coverage Edge Cases', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Destroy Method Coverage', () => {
    it('should handle destroy with window.removeEventListener', () => {
      const animation = new ThreeAnimation({ container });

      // Spy on window.removeEventListener to ensure it's called
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      animation.destroy();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(animation['isInitialized']).toBe(false);

      removeEventListenerSpy.mockRestore();
    });

    it('should clear container innerHTML during destroy', () => {
      const animation = new ThreeAnimation({ container });

      // Add some content to container first
      container.innerHTML = '<div>test content</div>';
      expect(container.innerHTML).toBe('<div>test content</div>');

      animation.destroy();

      expect(container.innerHTML).toBe('');
    });
  });

  describe('Constructor Edge Cases', () => {
    it('should handle constructor with only required container option', () => {
      const animation = new ThreeAnimation({ container });

      expect(animation['container']).toBe(container);
      expect(animation['isInitialized']).toBe(false);
      expect(animation['supportsWebGL']).toBe(false); // In JSDOM environment
    });

    it('should handle constructor with fallbackContent option', () => {
      const animation = new ThreeAnimation({
        container,
        fallbackContent: 'Custom fallback content',
      });

      expect(animation['container']).toBe(container);
    });
  });

  describe('Error Boundary Edge Cases', () => {
    it('should handle multiple destroy calls safely', () => {
      const animation = new ThreeAnimation({ container });

      // First destroy
      animation.destroy();
      expect(animation['isInitialized']).toBe(false);

      // Second destroy should not throw
      expect(() => animation.destroy()).not.toThrow();
      expect(animation['isInitialized']).toBe(false);
    });

    it('should handle destroy when container is already empty', () => {
      const animation = new ThreeAnimation({ container });

      // Ensure container is empty
      container.innerHTML = '';

      expect(() => animation.destroy()).not.toThrow();
      expect(container.innerHTML).toBe('');
    });
  });

  describe('Initialization State Coverage', () => {
    it('should maintain correct initialization state after fallback', async () => {
      const animation = new ThreeAnimation({ container });

      expect(animation['isInitialized']).toBe(false);
      expect(animation['supportsWebGL']).toBe(false);

      await animation.init();

      expect(animation['isInitialized']).toBe(true);
      // Should have fallback content since WebGL is not supported in JSDOM
      expect(container.innerHTML).toContain('animation-fallback');
    });

    it('should handle multiple init calls correctly', async () => {
      const animation = new ThreeAnimation({ container });

      await animation.init();
      expect(animation['isInitialized']).toBe(true);
      const firstContent = container.innerHTML;

      // Second init should return early and not change content
      await animation.init();
      expect(animation['isInitialized']).toBe(true);
      expect(container.innerHTML).toBe(firstContent);
    });
  });

  describe('Container State Management', () => {
    it('should handle container with existing content before initialization', async () => {
      container.innerHTML = '<div>existing content</div>';
      const animation = new ThreeAnimation({ container });

      await animation.init();

      // Should replace existing content with fallback
      expect(container.innerHTML).toContain('animation-fallback');
      expect(container.innerHTML).not.toContain('existing content');
    });

    it('should maintain container reference throughout lifecycle', () => {
      const animation = new ThreeAnimation({ container });

      expect(animation['container']).toBe(container);

      animation.destroy();

      // Container reference should still exist even after destroy
      expect(animation['container']).toBe(container);
    });
  });
});
