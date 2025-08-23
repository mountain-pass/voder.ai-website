import { setupJsdomTestEnvironment } from './testing/setup.ts';

// Ensure jest-dom extends Vitest's expect before setup runs
await import('@testing-library/jest-dom');

setupJsdomTestEnvironment();
