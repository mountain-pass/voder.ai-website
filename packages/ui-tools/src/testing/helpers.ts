export interface RenderComponentOptions {
  container?: Element;
  [key: string]: any;
}

export interface ComponentTestResult {
  container: Element;
  component: any;
  unmount: () => Promise<void>;
  update: (props: any) => Promise<void>;
}

/**
 * Custom render function for component testing (jsdom/browser-only)
 *
 * - Appends a container element (or uses provided one)
 * - Calls component.mount(container)
 * - Returns helpers to unmount and update the component
 */
export function renderComponent(
  component: any,
  options: RenderComponentOptions = {}
): ComponentTestResult {
  const container = options.container || document.createElement('div');
  if (!options.container) {
    document.body.appendChild(container);
  } else {
    // If a provided container isn't already in the document, append it
    if (!document.body.contains(container)) {
      document.body.appendChild(container);
    }
  }

  // Call mount if available (may be sync)
  if (typeof component?.mount === 'function') {
    // Allow mount to be sync or return a promise; don't await here to keep call-site simple
    // Consumers/tests can await any async side-effects inside mount if needed
    try {
      (component.mount as Function)(container);
    } catch {
      // swallow to keep behavior minimal and deterministic for tests that don't rely on mount throwing
    }
  }

  return {
    container,
    component,
    unmount: async () => {
      try {
        if (typeof component?.unmount === 'function') {
          // Support unmount returning a promise or being sync
          await (component.unmount as Function)();
        }
      } finally {
        // Remove container if it is still in the document and we created/attached it
        if (container.parentNode) {
          container.parentNode.removeChild(container);
        }
      }
    },
    update: async (props: any) => {
      if (typeof (component as any)?.updateConfig === 'function') {
        await (component as any).updateConfig(props);
      } else if (typeof (component as any)?.update === 'function') {
        await (component as any).update(props);
      }
    }
  };
}

/**
 * Waits for a given duration to allow CSS animations/transitions to complete.
 */
export async function waitForAnimation(duration = 300): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, duration));
}

/**
 * Wait for the next animation frame
 */
export async function waitForNextFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    // requestAnimationFrame may not be available in some test environments;
    // fallback to setTimeout(0)
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
    } else {
      setTimeout(() => resolve(), 0);
    }
  });
}

/**
 * Simulate click event on an element
 */
export function simulateClick(element: Element): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/**
 * Simulate keypress (keydown + keyup) on an element
 */
export function simulateKeypress(element: Element, key: string): void {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
}
