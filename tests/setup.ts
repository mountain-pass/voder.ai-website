import '@testing-library/jest-dom';

import { beforeEach, vi } from 'vitest';

// Global animation frame mocks to prevent unhandled errors
// These provide basic no-op implementations that prevent errors
global.requestAnimationFrame = vi.fn(() => 1);
global.cancelAnimationFrame = vi.fn();

// Clear DOM between tests (only when document is available)
beforeEach(() => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = '';
  }
});
