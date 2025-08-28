import { setupJsdomTestEnvironment } from './testing/setup.js';
// Ensure jest-dom extends Vitest's expect before setup runs
await import('@testing-library/jest-dom');
setupJsdomTestEnvironment();
