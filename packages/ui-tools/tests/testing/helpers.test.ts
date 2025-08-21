import { describe, test, expect, vi } from 'vitest';
import {
  renderComponent,
  simulateClick,
  waitForNextFrame,
  waitForAnimation
} from '../../src/testing/helpers';

describe('testing helpers', () => {
  test('renderComponent mounts and removes created container on unmount', async () => {
    const mountSpy = vi.fn((container: Element) => {
      const el = document.createElement('span');
      el.textContent = 'mounted';
      container.appendChild(el);
    });
    const unmountSpy = vi.fn(async () => Promise.resolve());
    const updateConfigSpy = vi.fn(async (_props: any) => Promise.resolve());

    const component = {
      mount: mountSpy,
      unmount: unmountSpy,
      updateConfig: updateConfigSpy
    };

    const result = renderComponent(component);
    const { container, unmount } = result;

    // container should be attached to document by the helper
    expect(document.body.contains(container)).toBe(true);
    expect(mountSpy).toHaveBeenCalled();

    await unmount();

    // when the helper created/attached the container it should be removed on unmount
    expect(document.body.contains(container)).toBe(false);
  });

  test('renderComponent does not remove caller-owned container on unmount', async () => {
    const mountSpy = vi.fn((container: Element) => {
      const el = document.createElement('span');
      el.textContent = 'mounted';
      container.appendChild(el);
    });
    const unmountSpy = vi.fn(async () => Promise.resolve());

    const component = { mount: mountSpy, unmount: unmountSpy };

    // caller-owned container that we append to the document
    const container = document.createElement('div');
    document.body.appendChild(container);

    const result = renderComponent(component, { container });

    expect(document.body.contains(container)).toBe(true);
    expect(mountSpy).toHaveBeenCalled();

    await result.unmount();

    // caller-owned container should still be present after unmount
    expect(document.body.contains(container)).toBe(true);

    // cleanup
    container.parentNode?.removeChild(container);
  });

  test('simulateClick triggers click handler', () => {
    const btn = document.createElement('button');
    const handler = vi.fn();
    btn.addEventListener('click', handler);
    document.body.appendChild(btn);

    simulateClick(btn);

    expect(handler).toHaveBeenCalled();

    document.body.removeChild(btn);
  });

  test('waitForNextFrame and waitForAnimation resolve', async () => {
    // these should resolve without throwing
    await waitForNextFrame();
    await waitForAnimation(10);
    expect(true).toBe(true);
  });
});
