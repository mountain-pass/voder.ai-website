import { renderComponent } from '../../src/testing/helpers.js';
import { describe, it, expect, vi } from 'vitest';

describe('renderComponent error handling', () => {
  it('catches errors from component.mount, logs them, and still returns a working unmount()', async () => {
    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create a component whose mount throws
    const mountError = new Error('mount failed');
    const component = {
      mount: () => { throw mountError; },
      unmount: vi.fn(async () => Promise.resolve()),
    };

    const { container, unmount } = renderComponent(component as any);

    // mount threw, so console.error should have been called at least once
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();

    // The container should still be in the document
    expect(document.body.contains(container)).toBe(true);

    // unmount should run without throwing and remove the container
    await expect(unmount()).resolves.not.toThrow();
    expect(document.body.contains(container)).toBe(false);
  });
});