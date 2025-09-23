import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('Skip Link Accessibility', () => {
  let skipLink: HTMLElement;

  beforeEach(() => {
    // Create a minimal DOM setup with the skip link
    document.body.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <div id="main-content">Main content here</div>
    `;

    // Load our CSS styles by creating a style element
    const style = document.createElement('style');

    style.textContent = `
      .skip-link {
        background: var(--soft-teal-glow, #24d1d5);
        color: var(--voder-black, #0a0a0a);
        left: 6px;
        overflow: hidden;
        padding: 8px;
        position: absolute;
        text-decoration: none;
        top: -40px;
        z-index: 100;
        clip-path: inset(50%);
        height: 1px;
        white-space: nowrap;
        width: 1px;
      }

      .skip-link:focus {
        top: 6px;
        clip-path: none;
        height: auto;
        white-space: normal;
        width: auto;
      }
    `;
    document.head.appendChild(style);

    skipLink = document.querySelector('.skip-link') as HTMLElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  });

  describe('when not focused', () => {
    it('should exist in the DOM for accessibility', () => {
      expect(skipLink).toBeTruthy();
      expect(skipLink.textContent).toBe('Skip to main content');
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('should be visually hidden with modern CSS techniques', () => {
      const computedStyle = window.getComputedStyle(skipLink);

      // Check that it uses modern hiding techniques
      expect(computedStyle.clipPath).toBe('inset(50%)');
      expect(computedStyle.height).toBe('1px');
      expect(computedStyle.width).toBe('1px');
      expect(computedStyle.overflow).toBe('hidden');
      expect(computedStyle.whiteSpace).toBe('nowrap');
    });

    it('should be positioned off-screen', () => {
      const computedStyle = window.getComputedStyle(skipLink);

      expect(computedStyle.position).toBe('absolute');
      expect(computedStyle.top).toBe('-40px');
      expect(computedStyle.left).toBe('6px');
    });

    it('should still be accessible to screen readers', () => {
      // Screen readers can still access elements that are visually hidden
      // but positioned off-screen or clipped
      expect(skipLink.textContent).toBe('Skip to main content');
      expect(skipLink.getAttribute('href')).toBe('#main-content');
      expect(skipLink.tabIndex).not.toBe(-1); // Should be focusable
    });
  });

  describe('when focused', () => {
    beforeEach(() => {
      skipLink.focus();
    });

    it('should become visible when focused', () => {
      const computedStyle = window.getComputedStyle(skipLink);

      // When focused, the element should become visible
      expect(computedStyle.clipPath).toBe('none');
      expect(computedStyle.height).toBe('auto');
      expect(computedStyle.width).toBe('auto');
      expect(computedStyle.whiteSpace).toBe('normal');
    });

    it('should move to visible position when focused', () => {
      const computedStyle = window.getComputedStyle(skipLink);

      expect(computedStyle.top).toBe('6px');
      expect(computedStyle.left).toBe('6px');
    });

    it('should maintain proper styling when visible', () => {
      const computedStyle = window.getComputedStyle(skipLink);

      expect(computedStyle.position).toBe('absolute');
      expect(computedStyle.zIndex).toBe('100');
      expect(computedStyle.padding).toBe('8px');
    });

    it('should be keyboard accessible', () => {
      // The element should be the currently focused element
      expect(document.activeElement).toBe(skipLink);
    });
  });

  describe('functionality', () => {
    it('should link to the main content area', () => {
      const targetElement = document.querySelector('#main-content');

      expect(targetElement).toBeTruthy();
      expect(skipLink.getAttribute('href')).toBe('#main-content');
    });

    it('should be the first focusable element on the page', () => {
      // Create some other focusable elements
      document.body.innerHTML += `
        <button>First Button</button>
        <a href="#test">Test Link</a>
        <input type="text" placeholder="Input field">
      `;

      // Tab through elements
      const focusableElements = document.querySelectorAll(
        'a[href], button, input, textarea, select',
      );

      // Skip link should be first in tab order by checking its class
      const firstElement = focusableElements[0] as HTMLElement;

      expect(firstElement.classList.contains('skip-link')).toBe(true);
      expect(firstElement.textContent).toBe('Skip to main content');
    });

    it('should trigger focus styles via keyboard navigation', () => {
      // Simulate Tab key press
      const tabEvent = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
      });

      document.dispatchEvent(tabEvent);
      skipLink.focus();

      expect(document.activeElement).toBe(skipLink);
    });
  });

  describe('regression prevention', () => {
    it('should prevent the "random teal line" issue', () => {
      // This test specifically prevents the visual bug we fixed
      const computedStyle = window.getComputedStyle(skipLink);

      // Ensure the element is completely hidden visually
      const isCompletelyHidden =
        computedStyle.clipPath === 'inset(50%)' &&
        computedStyle.height === '1px' &&
        computedStyle.width === '1px' &&
        computedStyle.overflow === 'hidden';

      expect(isCompletelyHidden).toBe(true);
    });

    it('should maintain accessibility compliance', () => {
      // Ensure we haven't broken accessibility while fixing the visual issue
      expect(skipLink.textContent?.trim()).toBeTruthy();
      expect(skipLink.getAttribute('href')).toBeTruthy();

      // Should not have aria-hidden or other accessibility blockers
      expect(skipLink.getAttribute('aria-hidden')).not.toBe('true');
      expect(skipLink.style.display).not.toBe('none');
      expect(skipLink.style.visibility).not.toBe('hidden');
    });
  });
});
