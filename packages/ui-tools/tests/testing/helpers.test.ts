import { describe, expect, test, vi } from 'vitest';

import {
  renderComponent,
  simulateClick,
  simulateKeypress,
  waitForAnimation,
  waitForNextFrame,
} from '../../src/testing/helpers.js';
describe('testing helpers', () => {
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
});
