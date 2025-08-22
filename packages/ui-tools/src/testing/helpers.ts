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
 *
 * Behavior:
 * - Tracks whether the helper created/attached the container (createdByHelper)
 * - Only removes the container on unmount if createdByHelper === true
 * - Surface mount/unmount errors via console.error with component context
 */
export function renderComponent(
  component: any,
  options: RenderComponentOptions = {}
): ComponentTestResult {
  const container = options.container || document.createElement('div');

  // Track whether we created/attached the container so we don't remove
  // caller-owned containers on unmount.
  let createdByHelper = false;

  if (!options.container) {
    document.body.appendChild(container);
    createdByHelper = true;
  } else {
    // If a provided container isn't already in the document, append it and mark createdByHelper
    if (!document.body.contains(container)) {
      document.body.appendChild(container);
      createdByHelper = true;
    }
  }

  // Call mount if available (may be sync or async). Surface errors to console.
  if (typeof component?.mount === 'function') {
    try {
      // Allow mount to be sync or return a promise; don't await here to keep call-site simple.
      // Consumers/tests can await any async side-effects inside mount if needed.
      (component.mount as Function)(container);
    } catch (err: unknown) {
      // Console-first: surface the error with context for debugging and history capture.
      try {
        const compName = component?.constructor?.name ?? typeof component;

        console.error('[voder/ui-tools] Error during component.mount', {
          component: compName,
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined
        });
      } catch {
        // If logging fails for any reason, fall back to a minimal message.
        console.error('[voder/ui-tools] Error during component.mount (logging failed)');
      }
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
      } catch (err: unknown) {
        // Surface unmount errors to console with context
        try {
          const compName = component?.constructor?.name ?? typeof component;

          console.error('[voder/ui-tools] Error during component.unmount', {
            component: compName,
            error: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined
          });
        } catch {
          console.error('[voder/ui-tools] Error during component.unmount (logging failed)');
        }
      } finally {
        // Remove container only if this helper created/attached it.
        if (createdByHelper && container.parentNode) {
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
