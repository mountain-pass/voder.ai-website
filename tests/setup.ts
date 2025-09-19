import '@testing-library/jest-dom';

import { beforeEach } from 'vitest';

// Clear DOM between tests (only when document is available)
beforeEach(() => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.innerHTML = '';
  }
});
