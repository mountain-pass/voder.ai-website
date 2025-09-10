import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

// Resolve base URL from environment: PREVIEW_URL, otherwise build from PREVIEW_HOST/PREVIEW_PORT with defaults
const PREVIEW_HOST = process.env.PREVIEW_HOST || '127.0.0.1';

const PREVIEW_PORT = process.env.PREVIEW_PORT || process.env.VITE_PORT || '5173';

const BASE_URL = process.env.PREVIEW_URL || `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['json', { outputFile: 'playwright-results.json' }]],
  use: {
    // Base URL for `page.goto('/')` - resolved from env so CI and scripts can coordinate
    baseURL: BASE_URL,

    // Artifacts and diagnostic helpers for flaky tests
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // sensible defaults
    actionTimeout: 0,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // where to put test artifacts
  outputDir: 'test-results/',
});
