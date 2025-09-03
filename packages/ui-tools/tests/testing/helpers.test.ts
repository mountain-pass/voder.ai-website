import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  renderComponent,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame,
} from '../../src/testing/helpers.js';

describe('testing helpers', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('renderComponent mounts and removes created container on unmount', async () => {
    const mountSpy = vi.fn((container) => {
      const el = document.createElement('span');

      el.textContent = 'mounted';
      container.appendChild(el);
    });

    const unmountSpy = vi.fn(async () => Promise.resolve());

    const updateConfigSpy = vi.fn(async () => Promise.resolve());

    const component = { mount: mountSpy, unmount: unmountSpy, updateConfig: updateConfigSpy };

    const { container, unmount } = renderComponent(component);

    expect(document.body.contains(container)).toBe(true);
    expect(mountSpy).toHaveBeenCalled();
    await unmount();
    expect(document.body.contains(container)).toBe(false);
  });

  test('renderComponent does not remove caller-owned container on unmount', async () => {
    const mountSpy = vi.fn((container) => {
      const el = document.createElement('span');

      el.textContent = 'mounted';
      container.appendChild(el);
    });

    const unmountSpy = vi.fn(async () => Promise.resolve());

    const container = document.createElement('div');

    document.body.appendChild(container);
    const { unmount } = renderComponent({ mount: mountSpy, unmount: unmountSpy }, { container });

    expect(document.body.contains(container)).toBe(true);
    expect(mountSpy).toHaveBeenCalled();
    await unmount();
    expect(document.body.contains(container)).toBe(true);
    container.remove();
  });

  test('simulateClick triggers click handler', () => {
    const btn = document.createElement('button');

    const handler = vi.fn();

    btn.addEventListener('click', handler);
    document.body.appendChild(btn);
    simulateClick(btn);
    expect(handler).toHaveBeenCalled();
    btn.remove();
  });

  test('simulateKeypress triggers both keydown and keyup with correct key', () => {
    const el = document.createElement('div');

    const down = vi.fn();

    const up = vi.fn();

    el.addEventListener('keydown', down);
    el.addEventListener('keyup', up);
    document.body.appendChild(el);
    simulateKeypress(el, 'Enter');
    expect(down).toHaveBeenCalledTimes(1);
    expect(up).toHaveBeenCalledTimes(1);
    expect(down.mock.calls[0][0].key).toBe('Enter');
    expect(up.mock.calls[0][0].key).toBe('Enter');
    el.remove();
  });

  test('waitForNextFrame and waitForAnimation resolve', async () => {
    await waitForNextFrame();
    await waitForAnimation(10);
    expect(true).toBe(true);
  });

  test('renderComponent handles mount function throwing error', () => {
    const throwingMount = vi.fn(() => {
      throw new Error('Mount failed');
    });
    const component = { mount: throwingMount };

    const { container, unmount } = renderComponent(component);

    expect(throwingMount).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error during component.mount'),
      expect.objectContaining({
        component: expect.any(String),
        error: 'Mount failed',
        stack: expect.any(String)
      })
    );

    // Container should still be created and available
    expect(document.body.contains(container)).toBe(true);

    // Cleanup should still work
    return unmount().then(() => {
      expect(document.body.contains(container)).toBe(false);
    });
  });

  test('renderComponent handles unmount function throwing error', async () => {
    const mount = vi.fn();
    const throwingUnmount = vi.fn(() => {
      throw new Error('Unmount failed');
    });
    const component = { mount, unmount: throwingUnmount };

    const { container, unmount } = renderComponent(component);

    expect(document.body.contains(container)).toBe(true);

    await unmount();

    expect(throwingUnmount).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('Error during component.unmount'),
      expect.objectContaining({
        component: expect.any(String),
        error: 'Unmount failed'
      })
    );

    // Container should still be removed despite unmount error
    expect(document.body.contains(container)).toBe(false);
  });

  test('renderComponent handles component without mount method', () => {
    const component = {}; // No mount method

    const { container, unmount } = renderComponent(component);

    expect(document.body.contains(container)).toBe(true);

    return unmount().then(() => {
      expect(document.body.contains(container)).toBe(false);
    });
  });

  test('renderComponent handles component without unmount method', async () => {
    const mount = vi.fn();
    const component = { mount }; // No unmount method

    const { container, unmount } = renderComponent(component);

    expect(mount).toHaveBeenCalled();
    expect(document.body.contains(container)).toBe(true);

    await unmount();
    expect(document.body.contains(container)).toBe(false);
  });

  test('renderComponent handles provided container not in document', async () => {
    const mount = vi.fn();
    const component = { mount };
    const providedContainer = document.createElement('div');
    // Don't add to document initially

    const { container, unmount } = renderComponent(component, { 
      container: providedContainer 
    });

    expect(container).toBe(providedContainer);
    expect(document.body.contains(container)).toBe(true);

    await unmount();
    expect(document.body.contains(container)).toBe(false);
  });

  test('update calls updateConfig when available', async () => {
    const mount = vi.fn();
    const updateConfig = vi.fn();
    const component = { mount, updateConfig };

    const { update } = renderComponent(component);

    await update({ prop: 'value' });

    expect(updateConfig).toHaveBeenCalledWith({ prop: 'value' });
  });

  test('update calls update method when updateConfig not available', async () => {
    const mount = vi.fn();
    const updateMethod = vi.fn();
    const component = { mount, update: updateMethod };

    const { update } = renderComponent(component);

    await update({ prop: 'value' });

    expect(updateMethod).toHaveBeenCalledWith({ prop: 'value' });
  });

  test('update does nothing when neither updateConfig nor update available', async () => {
    const mount = vi.fn();
    const component = { mount };

    const { update } = renderComponent(component);

    // Should not throw
    await expect(update({ prop: 'value' })).resolves.toBeUndefined();
  });

  test('waitForNextFrame uses requestAnimationFrame when available', async () => {
    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    const mockRequestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      setTimeout(callback, 16); // Simulate 60fps
      return 1; // Return request ID
    });
    globalThis.requestAnimationFrame = mockRequestAnimationFrame;

    await waitForNextFrame();

    expect(mockRequestAnimationFrame).toHaveBeenCalled();

    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  });

  test('waitForNextFrame falls back to setTimeout when requestAnimationFrame unavailable', async () => {
    const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
    delete (globalThis as any).requestAnimationFrame;

    const start = Date.now();
    await waitForNextFrame();
    const end = Date.now();

    // Should have used setTimeout(0)
    expect(end - start).toBeLessThan(50); // Should be very quick

    globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  });

  test('renderComponent handles mount logging error gracefully', () => {
    // Mock console.error to throw during the error handling
    const originalConsoleError = console.error;
    let errorCallCount = 0;
    console.error = vi.fn().mockImplementation(() => {
      errorCallCount++;
      if (errorCallCount === 1) {
        throw new Error('console.error failed');
      }
    });

    const badComponent = {
      mount: vi.fn(() => {
        throw new Error('Mount failed');
      }),
      unmount: vi.fn(),
    };

    const { unmount } = renderComponent(badComponent);
    
    expect(console.error).toHaveBeenCalledTimes(2); // First call fails, second call is fallback
    unmount();
    
    console.error = originalConsoleError;
  });

  test('renderComponent handles component without constructor name', () => {
    const componentWithoutName = Object.create(null);
    componentWithoutName.mount = vi.fn(() => {
      throw new Error('Mount failed');
    });
    componentWithoutName.unmount = vi.fn();

    const mockConsole = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = renderComponent(componentWithoutName);
    
    expect(mockConsole).toHaveBeenCalledWith(
      '[voder/ui-tools] Error during component.mount',
      expect.objectContaining({
        component: expect.any(String),
        error: 'Mount failed',
      })
    );
    
    unmount();
    mockConsole.mockRestore();
  });

  test('renderComponent handles unmount logging error gracefully', async () => {
    const mount = vi.fn();
    const throwingUnmount = vi.fn(() => {
      throw new Error('Unmount failed');
    });
    
    const component = {
      mount,
      unmount: throwingUnmount,
      get constructor() {
        throw new Error('Constructor access failed');
      }
    };

    const { container, unmount } = renderComponent(component);

    // Track if fallback error message was called
    const mockConsoleError = vi.fn();
    console.error = mockConsoleError;

    await unmount();

    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Error during component.unmount (logging failed)')
    );

    expect(document.body.contains(container)).toBe(false);
  });
});
