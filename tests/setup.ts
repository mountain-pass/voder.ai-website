import '@testing-library/jest-dom';

import { beforeEach } from 'vitest';

// Clear DOM between tests
beforeEach(() => {
  document.body.innerHTML = '';
});
